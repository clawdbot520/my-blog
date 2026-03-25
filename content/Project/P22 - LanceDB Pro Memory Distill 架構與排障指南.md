---
title: P22 - LanceDB Pro Memory Distill 架構與排障指南
date: 2026-03-24
tags:
  - project
  - lancedb
  - memory
  - distill
  - sdd
  - 案例
publish: true
socialImage: https://www.clawdbot520.fyi/attachment/p22_lancedb_distill.png
image: attachment/p22_lancedb_distill.png
cover: attachment/p22_lancedb_distill.png
prompt: A neural distillation process with chat logs flowing through filters into a crystalline vector database, teal data streams on dark background, memory consolidation visualization
summary: LanceDB Pro memory distill 完整架構：jsonl_distill.py 三步流程（init/run/commit）、distiller agent cron 設定、2月底 README 說明被移除後的排障紀錄，以及本次修復過程。
---
![[Screenshot 2026-03-25 at 4.09.03 PM.png|612]]

## 1. 系統概述 (System Overview)

**背景**：LanceDB Pro 的 `autoCapture` 只在**當前對話**中即時擷取記憶，無法涵蓋其他 agent 的歷史對話。官方設計了一個 JSONL 蒸餾流程，讓 memory-distiller agent 定期讀取所有 agent 的 session 紀錄並提煉成長期記憶。

**問題史**：2026-03-24 發現好幾天沒有新記憶進入 LanceDB，排查後發現是 `jsonl_distill.py` 被替換成舊版（不產生 batch 檔），導致整個 pipeline 靜默失敗。

**技術棧**：

| 層 | 技術 |
|----|------|
| OS | macOS (Apple Silicon M4) |
| 記憶庫 | LanceDB Pro（`~/.openclaw/memory/lancedb-pro/`） |
| Plugin | memory-lancedb-pro@1.1.0-beta.9+ |
| 蒸餾腳本 | `jsonl_distill.py`（Python 3）|
| Cron 排程 | OpenClaw cron（`~/.openclaw/cron/jobs.json`） |
| Distiller Agent | `memory-distiller`（workspace: `~/.openclaw/workspace-memory-distiller/`） |

---

## 2. 架構設計 (Architectural Design)

**Pipeline 完整流程**：

```
所有 agent session JSONL
  (~/.openclaw/agents/*/sessions/*.jsonl)
         ↓
jsonl_distill.py run
  （增量讀取新內容，產生 batch 檔）
         ↓
~/.openclaw/state/jsonl-distill/batches/batch-YYYYMMDD-HHMMSS.json
         ↓
memory-distiller agent（cron 每小時）
  讀取 batch → LLM 判斷 → memory_store
         ↓
LanceDB Pro（global + agent scope）
         ↓
jsonl_distill.py commit --batch-file <path>
  （更新 cursor，標記已處理）
```

**Cursor 機制**：

```
~/.openclaw/state/jsonl-distill/cursor.json
  每個 JSONL 檔案記錄：
  - inode：檔案識別（偵測 rotation）
  - committed：已處理到的 byte offset
  - pendingBatch：正在處理中的 batch 路徑
```

---

## 3. 數據設計 (Data Design)

**Batch 檔格式**（`batches/batch-*.json`）：

```json
{
  "batchId": "batch-20260324-220440",
  "messages": [
    {
      "agent": "main",
      "role": "assistant",
      "text": "...",
      "timestamp": "..."
    }
  ]
}
```

**Cursor 狀態**：

| 欄位 | 說明 |
|------|------|
| `committed` | 已確認處理的 byte offset |
| `pendingBatch` | 有 batch 未 commit 時的路徑（non-null = 上次未完成） |

---

## 4. 接口與協議 (Interface Control)

**jsonl_distill.py 子指令**：

```bash
# 初始化：把所有現有 session 標記為「已讀」（只處理之後的新內容）
python3 scripts/jsonl_distill.py init

# 讀取增量內容，產生 batch 檔
python3 scripts/jsonl_distill.py run
# 輸出：{"ok": true, "action": "created", "batchFile": "/path/to/batch.json"}
# 若無新內容：{"ok": true, "action": "noop"}

# 確認 batch 已處理，更新 cursor
python3 scripts/jsonl_distill.py commit --batch-file /path/to/batch.json
```

**Cron Job Message 完整格式**（`~/.openclaw/cron/jobs.json`）：

```
run jsonl memory distill

Goal: distill NEW chat content from OpenClaw session JSONL files into
high-quality LanceDB memories using memory_store.

Hard rules:
- Incremental only: call the extractor script first
- Store only reusable memories; skip routine chatter
- < 500 chars, atomic entries
- <= 3 memories per agent per run; <= 3 global per run
- Scope: global for broadly reusable; otherwise agent:<agentId>

Workflow:
1) exec: python3 ~/.openclaw/workspace-memory-distiller/scripts/jsonl_distill.py run
2) If action==noop: stop
3) Read the batchFile path from output JSON
4) Read the batch file content
5) For each message worth keeping: memory_store(...)
6) exec: python3 ... commit --batch-file <batchFile>
```

---

## 5. 詳細設計 (Detailed Design)

### autoCapture vs jsonl_distill 的差異

| | `autoCapture`（plugin） | `jsonl_distill.py`（cron） |
|--|--|--|
| 來源 | 當前對話（即時） | 所有 agent 的 JSONL 歷史 |
| 時機 | 對話進行中 | 每小時批次 |
| 涵蓋範圍 | 自己這次的對話 | 小歐、小安、小可等全部 |
| 功能 | 自動存當次記憶 | 增量抓取後 distiller 提煉 |

**兩者互補，不能互相取代。**

### 2026-03-24 Bug 根因

舊版 `jsonl_distill.py`（無 subcommand）：
- `run()` 讀取新內容 → 過濾 → 直接 commit cursor → 寫 `.md` log
- **沒有產生 batch 檔**，`batches/` 永遠是空的
- distiller agent 拿不到任何內容，35 秒內就結束
- 靜默失敗，無 error，cursor 持續推進

正確版本（有 `init`/`run`/`commit` subcommand）：
- `run` → 產生 `batches/batch-*.json`，cursor 標記 `pendingBatch`
- agent 讀 batch → `memory_store` → `commit` 清除 pending

### 修復步驟（2026-03-24 已執行）

```bash
# 1. 從 repo 拉最新 script
gh api "repos/CortexReach/memory-lancedb-pro/contents/scripts/jsonl_distill.py" \
  --jq '.content' | base64 -d > \
  ~/.openclaw/workspace-memory-distiller/scripts/jsonl_distill.py

# 2. 驗證子指令存在
python3 ~/.openclaw/workspace-memory-distiller/scripts/jsonl_distill.py --help
# 應看到：{init,run,commit}

# 3. 測試 run 產生 batch
python3 ~/.openclaw/workspace-memory-distiller/scripts/jsonl_distill.py run
# 應看到：{"ok": true, "action": "created", "batchFile": "..."}

# 4. 更新 cron job message（已更新 jobs.json）
```

### 健康檢查

```bash
# 確認 cursor 最後更新時間
python3 -c "
import json, datetime
d = json.load(open('/Users/clawdbot520/.openclaw/state/jsonl-distill/cursor.json'))
times = [v['updatedAtMs'] for v in d['files'].values() if 'updatedAtMs' in v]
print('最後更新:', datetime.datetime.fromtimestamp(max(times)/1000))
"

# 確認 batch 目錄
ls -la ~/.openclaw/state/jsonl-distill/batches/
# 正常：空的（batch 被 commit 後刪除）
# 異常：有舊 batch 檔殘留（agent 沒有 commit）

# 確認 main session 有沒有 pending 內容
# committed 應該接近 actual size
python3 -c "
import json, os
d = json.load(open('/Users/clawdbot520/.openclaw/state/jsonl-distill/cursor.json'))
for k, v in d['files'].items():
    if os.path.exists(k):
        actual = os.path.getsize(k)
        diff = actual - v.get('committed', 0)
        if diff > 10000:
            print(f'PENDING {diff//1024}KB: {k.split(\"/\")[-1]}')
"
```

---

## 6. 相關連結

- Plugin Repo：`https://github.com/CortexReach/memory-lancedb-pro`
- Distiller workspace：`~/.openclaw/workspace-memory-distiller/`
- Script：`~/.openclaw/workspace-memory-distiller/scripts/jsonl_distill.py`
- Cursor 狀態：`~/.openclaw/state/jsonl-distill/cursor.json`
- Cron 設定：`~/.openclaw/cron/jobs.json`（job id: `de01fcb0-b559-482c-94a1-c33b8e715714`）
- [[P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦]]

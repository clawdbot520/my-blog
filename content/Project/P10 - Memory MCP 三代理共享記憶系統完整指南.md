---
title: P10 - Memory MCP 三代理共享記憶系統完整指南
date: 2026-03-11
tags:
  - Memory
  - MCP
  - LanceDB
  - 多代理
  - 架構
  - ClaudeCode
  - OpenClaw
  - Antigravity
publish: true
prompt: Three AI robots connected to a shared glowing brain in the center, neural pathways forming a triangle, LanceDB crystals, blue purple orange, futuristic memory system
---
![[Pasted image 20260311224251.png]]

> [!info] 概述
> Memory MCP Server 讓小可（Claude Code）、小安（Antigravity）、小歐（OpenClaw）三個 AI 共享同一個 LanceDB 記憶庫，打破資訊孤島，實現跨代理即時記憶存取。

---

## GitHub Path
https://github.com/clawdbot520/awesome-claude-skills

## 目的

### 沒有 Memory MCP 之前的問題

每個代理的記憶是孤立的：

```
用戶問小可 → 小可回答 → 記憶存在小可的 session context（關掉就消失）
用戶問小歐 → 小歐回答 → 記憶存在 OpenClaw LanceDB（只有小歐看得到）
用戶問小安 → 小安回答 → 記憶只在對話歷史（回憶機制有限）
```

**核心痛點：** 小可今天學到的東西，明天小安不知道；小歐蒸餾出的知識，小可只能靠 hook 注入的靜態 snapshot 取得，不能即時查詢。

### Memory MCP 解決的問題

```
任意代理 → remember() → 共享 LanceDB
任意代理 → recall()   → 即時查詢所有人的記憶
```

三個代理共享同一個知識庫，任何一個學到新東西，另外兩個馬上可以查到。

---

## 原理

### 底層：LanceDB（向量資料庫）

LanceDB 是一個本地向量資料庫，存放在：

```
~/.openclaw/memory/lancedb-pro/
```

每一筆記憶的結構：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | string | 8 字元短 UUID |
| `text` | string | 記憶內容（自然語言） |
| `vector` | float[1024] | 語意向量（Jina AI 生成） |
| `scope` | string | 來源代理（`agent:claude-code` / `agent:antigravity` / `global` 等） |
| `category` | string | 標籤（逗號分隔，如 `fact,decision`） |
| `importance` | float | 重要度 0.0～1.0 |
| `timestamp` | float | 建立時間（**毫秒**，Unix timestamp） |
| `metadata` | JSON string | 附加資訊（建立時間 ISO 格式等） |

### 向量的作用

每筆記憶存入時，文字會透過 **Jina AI** 轉換成 1024 維的浮點向量。查詢時也把查詢字串轉成向量，找「語意最接近」的記憶，而非只做字串比對。

```
"MCP 伺服器建立決策" → [0.021, -0.043, 0.118, ...] (1024維)
    ↓ 和所有記憶的向量做餘弦相似度計算
    ↓ 回傳最相似的 top-k 筆
```

---

## 架構

```
┌─────────────────────────────────────────────────────┐
│                   三代理系統                          │
│                                                     │
│  小可 (Claude Code)  小安 (Antigravity)  小歐 (OpenClaw) │
│         │                  │                  │     │
│         └──────────────────┼──────────────────┘     │
│                            ▼                        │
│              Memory MCP Server (stdio)              │
│              ~/.openclaw/skills/memory-mcp/         │
│                       server.py                     │
│                            │                        │
│                            ▼                        │
│              LanceDB Pro (本地向量資料庫)              │
│         ~/.openclaw/memory/lancedb-pro/             │
└─────────────────────────────────────────────────────┘
```

### MCP 協議

Memory MCP 採用 **stdio 協議**：Claude Code 透過 stdin/stdout 與 server.py 溝通，不需要 HTTP port，不需要開服務，按需啟動。

配置在 `~/.claude/claude.json`：

```json
{
  "mcpServers": {
    "memory-mcp": {
      "command": "python3",
      "args": ["~/.openclaw/skills/memory-mcp/server.py"]
    }
  }
}
```

---

## 工具規格（5 個 MCP 工具）

### `remember(content, tags?, agent?, importance?)`

寫入一條記憶。

```json
輸入：
{
  "content": "memory-mcp timestamp 必須用毫秒，與 OpenClaw 格式一致",
  "tags": ["bug", "lancedb"],
  "agent": "agent:claude-code",
  "importance": 0.8
}

輸出：
{ "ok": true, "memory_id": "ca7e269d" }
```

**流程：**
1. 呼叫 Jina AI 生成 1024 維 embedding
2. 檢查重複（`check_duplicate` 內部呼叫）
3. 寫入 LanceDB（timestamp 用毫秒）

---

### `recall(query, top_k?, agent_filter?)`

關鍵詞搜尋記憶（目前為文字匹配，非向量搜尋）。

```json
輸入：
{
  "query": "timestamp 毫秒",
  "top_k": 5
}

輸出：
[
  {
    "memory_id": "ca7e269d",
    "content": "memory-mcp timestamp 必須用毫秒...",
    "score": 1.0,
    "tags": ["bug", "lancedb"],
    "agent": "agent:claude-code"
  }
]
```

---

### `list_facts(agent?, tag?)`

條件過濾列表（精確比對，非語意搜尋）。

```json
// 只看小安的記憶
{ "agent": "agent:antigravity" }

// 只看 decision 標籤
{ "tag": "decision" }
```

---

### `check_duplicate(content, threshold?)`

寫入前檢查是否已有高相似度記憶，防止雜訊污染。

```json
輸入：{ "content": "...", "threshold": 0.90 }
輸出：{ "is_duplicate": true, "similar": [...] }
```

> [!note] 設計原則
> `is_duplicate: true` 時只警告，不強制阻擋。由呼叫方決定是否繼續寫入。

---

### `forget(memory_id)`

刪除指定記憶。

```json
輸入：{ "memory_id": "ca7e269d" }
輸出：{ "ok": true }
```

---

## Scope 命名空間設計

所有代理共享同一個 LanceDB，透過 `scope` 欄位區分來源：

| Scope | 說明 | 誰寫 | 誰能讀 |
|-------|------|------|--------|
| `global` | 跨代理共識、蒸餾知識 | memory-distiller | 全部 |
| `agent:claude-code` | 小可的記憶 | 小可 | 全部 |
| `agent:antigravity` | 小安的記憶 | 小安 | 全部 |
| `agent:main` | 小歐的記憶 | 小歐 | 全部 |
| `agent:2nd-brain` | 第二大腦知識庫 | 小歐蒸餾 | 全部 |

> [!warning] 命名規則
> Scope 必須以 `agent:` 開頭或為 `global`，否則 Agent Monitor 的 sidebar 看不到該 scope 的記憶。

---

## 完整流程

### 正常寫入流程

```
代理想存一條記憶
    │
    ▼
呼叫 remember(content, tags, agent)
    │
    ▼
check_duplicate() 內部檢查（相似度 ≥ 90% 則警告）
    │
    ▼
呼叫 Jina AI API 生成 embedding
(curl POST https://api.jina.ai/v1/embeddings)
    │
    ▼
寫入 LanceDB
  - timestamp = time.time() * 1000  ← 毫秒！
  - scope = agent 參數（如 "agent:claude-code"）
    │
    ▼
回傳 { ok: true, memory_id: "xxxxxxxx" }
```

### 查詢流程（UserPromptSubmit hook）

```
用戶發送訊息
    │
    ▼
UserPromptSubmit hook 自動觸發
    │
    ▼
hook 對 LanceDB 做向量搜尋
（把用戶問題轉成 embedding，找最相關的記憶）
    │
    ▼
注入到 system prompt 頂部（memory_recall 區塊）
    │
    ▼
代理看到相關記憶後回答
```

---

## 與現有記憶機制的關係

```
現有機制（非即時）：
  UserPromptSubmit hook → 召回靜態 snapshot（向量搜尋）
  Stop hook → 寫入記憶
  hourly cron → memory-distiller 蒸餾 → global scope

Memory MCP 補足的部分（即時）：
  任意時間點 → recall()   即時查詢（對話中間也能用）
  任意時間點 → remember() 即時寫入（不用等 Stop hook）
```

兩者**並行**，不取代現有 hook 機制。

---

## 注意事項與坑點

### ⚠️ 坑 1：timestamp 必須用毫秒

**錯誤：** `time.time()` → 秒級（如 `1773237198`）
**正確：** `time.time() * 1000` → 毫秒（如 `1773237198897`）

Agent Monitor 按 timestamp 降序排列，秒級數字遠小於其他記憶（毫秒），導致新記憶沉到最底部看不到。

---

### ⚠️ 坑 2：embedding 不能用零向量

**錯誤：** `[0.0] * 1024`（placeholder）
**正確：** 呼叫 Jina AI API 取得真實 1024 維向量

零向量會導致向量搜尋完全失效，該筆記憶永遠查不到。Jina API 需用 curl subprocess（Python urllib 會被回傳 403）：

```python
def get_embedding(text):
    cmd = [
        "curl", "-s", "-X", "POST", "https://api.jina.ai/v1/embeddings",
        "-H", f"Authorization: Bearer {JINA_API_KEY}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps({
            "model": "jina-embeddings-v5-text-small",
            "task": "retrieval.passage",
            "normalized": True,
            "input": [text]
        })
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return json.loads(result.stdout)["data"][0]["embedding"]
```

---

### ⚠️ 坑 3：scope 必須有 `agent:` 前綴

**錯誤：** `scope = "claude-code"` 或 `scope = "antigravity"`
**正確：** `scope = "agent:claude-code"` 或 `scope = "agent:antigravity"`

Agent Monitor sidebar 只顯示 `global` 和以 `agent:` 開頭的 scope。沒有前綴的 scope 記憶在 sidebar 完全隱形（但在「全部」模式下仍存在 DB 中）。

---

### ⚠️ 坑 4：修改 scope 無法直接 update

LanceDB 目前不支援原地更新 scope（update 會丟失向量）。正確做法：

```python
# 1. 讀出舊資料
row = table.query().where(f"id = '{mid}'").to_pandas().iloc[0]

# 2. 刪除
table.delete(f"id = '{mid}'")

# 3. 重新插入（保留原向量）
table.add([{ ...row, "scope": "agent:claude-code" }])
```

---

### ⚠️ 坑 5：小安寫記憶的特殊限制

小安（Antigravity）原生記憶機制只能「回憶」，無法主動搜尋。透過 memory-mcp 的 `recall()` 工具，小安可以主動查詢整個知識庫，突破這個限制。

---

## 快速除錯清單

| 症狀 | 可能原因 | 解法 |
|------|---------|------|
| Agent Monitor 看不到新記憶 | timestamp 用秒而非毫秒 | 確認 `time.time() * 1000` |
| 向量搜尋查不到某筆記憶 | 存入了零向量 | 確認有呼叫 Jina API |
| Sidebar 看不到某個代理的 scope | scope 沒有 `agent:` 前綴 | 用 delete + reinsert 遷移 |
| `recall()` 回傳空 | 文字匹配，查詢詞要精準 | 換同義詞或用 `list_facts` |
| Jina API 403 | 用了 Python urllib | 改用 curl subprocess |

---

## 檔案位置

```
~/.openclaw/skills/memory-mcp/
├── server.py          # MCP server 主程式
└── SKILL.md           # skill 說明

~/.openclaw/memory/lancedb-pro/   # 實際資料庫

~/.claude/claude.json             # MCP 掛載設定
```

---

## 設計背景：三方觀點

Memory MCP 是 2026-03-08 三方討論後的共識（對應提案6），各代理的設計動機：

**小可的觀點：** 最大收益是能在回覆用戶時即時查詢小安、小歐已蒸餾的知識，而不只是依賴 hook 注入的靜態 snapshot。

**小安的提醒：** 需加入「重複偵測」機制，避免同樣議題被反覆討論、記憶庫被雜訊污染（「無限迴圈問題」）。因此 `check_duplicate()` 是核心功能，並在 `remember()` 內部自動呼叫。

**小歐的定位：** 這是三個 MCP 中優先級最高的，Plan-board 和 Agent-bridge 操作後都應呼叫 `remember()` 自動記錄決策。沒有 Memory MCP，其他兩個 MCP 的操作歷史都是一次性的。

---

## 並發寫入安全

多個代理同時呼叫 `remember()` 可能造成寫入衝突。標準做法是複用 flock 模式：

```python
import fcntl

def safe_remember(content, tags, agent):
    lock_path = Path.home() / ".openclaw" / "memory" / ".write.lock"
    with open(lock_path, "w") as lock_file:
        fcntl.flock(lock_file, fcntl.LOCK_EX)
        try:
            return remember(content, tags, agent)
        finally:
            fcntl.flock(lock_file, fcntl.LOCK_UN)
```

> [!note] 目前版本
> 現行 server.py 尚未實作 flock，LanceDB 本身有基本的寫入保護，實際並發衝突機率低。高並發場景建議補上。

---

## MVP 驗收紀錄（2026-03-08）

| 項目 | 狀態 |
|------|------|
| `remember("test", tags=["test"])` 成功寫入 LanceDB | ✅ |
| `recall("test")` 能找到剛寫入的記憶 | ✅ |
| `check_duplicate()` 對高相似內容回傳 `is_duplicate: true` | ✅ |
| `check_duplicate()` 對不同內容回傳 `is_duplicate: false` | ✅ |
| 小安寫入的記憶，小可能用 `recall()` 查到 | ✅ |
| `list_facts(agent="antigravity")` 只回傳小安的記憶 | ✅ |
| 兩個 Agent 同時 `remember()` 不衝突 | ✅ |

---

## 相關文件

- [[設計規格 - Memory MCP Server]] — 原始三方設計共識
- [[P8 - 怎麼打通Openclaw 和 ClaudeCode 的雙相記憶共享]] — 記憶共享背景
- [[P3 - 想知道 OpenClaw 在背著你八卦什麼Agent Monitor Board 告訴你]] — Agent Monitor 使用

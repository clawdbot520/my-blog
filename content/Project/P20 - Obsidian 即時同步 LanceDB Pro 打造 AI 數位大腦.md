---
title: P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦
date: 2026-03-24
tags:
  - project
  - lancedb
  - obsidian
  - mcp
  - embedding
  - sdd
  - 案例
publish: true
prompt: A futuristic digital brain concept with Obsidian notes flowing into a glowing vector database, dark background with teal and purple neural network connections, minimalist tech aesthetic
summary: 用 sync_obsidian.py 在 Obsidian 存檔時自動把 frontmatter summary 推入 LanceDB Pro。Agent 看摘要快速定位，需要細節再去看 .md。BGE-M3 本地 embedding，支援 check_duplicate 防重。腳本位於 ~/repos/kanban-agent-teams/scripts/。
---

![[p20_obsidian_lancedb_sync.png]]

## 1. 系統概述 (System Overview)

**專案背景**：Obsidian 是人類看的知識庫，LanceDB Pro 是 AI Agent 的記憶庫。兩者原本互不相通——這套系統讓 Obsidian 存檔事件自動觸發 summary 推送，讓小歐、小安、小可都能語意搜尋你的筆記。

**核心設計**：兩層結構，各司其職。

| 層 | 格式 | 角色 |
|----|------|------|
| Obsidian `.md` | Markdown | Source of truth，人類可讀 |
| LanceDB Pro | 向量（Float32[1024]） | AI 語意搜尋索引 |

**技術棧 (Tech Stack)**：

| 層 | 技術 |
|----|------|
| OS | macOS (Apple Silicon M4) |
| Vector DB | LanceDB Pro (`~/.openclaw/memory/lancedb-pro/`) |
| Embedding | bge-m3 本地模型（port 8010） |
| Middleware | MCP Server Node.js（port 3003） |
| Runtime | Python 3.13 (miniconda) |
| Trigger | obsidian-shellcommands |

---

## 2. 架構設計 (Architectural Design)

**模組劃分**：

- **Trigger Layer**：`obsidian-shellcommands` 監聽 After saving a file 事件
- **Sync Script**：`sync_obsidian.py` — 讀取 frontmatter → 防重檢查 → 呼叫 MCP
- **MCP Server**：`remember` 工具 — 呼叫 embedding server → 寫入 LanceDB
- **Embedding Engine**：BGE-M3 Flask wrapper（`~/repos/embedding-server/`）

**流程圖**：

```
Obsidian 存檔 (Cmd+S)
  ↓ obsidian-shellcommands
sync_obsidian.py {{file_path}}
  ↓ 讀 frontmatter → 取 summary
  ↓ 沒有 summary → skip
  ↓ 是 Kanban → skip
  ↓ check_duplicate → 已存在 → skip
POST http://localhost:3003/mcp/message → remember
  ↓ BGE-M3 http://localhost:8010/v1/embeddings
LanceDB Pro (~/.openclaw/memory/lancedb-pro/)
```

---

## 3. 數據設計 (Data Design)

**LanceDB Schema**：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | String (8 chars) | 隨機 UUID 前 8 碼 |
| `vector` | Float32[1024] | bge-m3 生成的向量 |
| `text` | String | `[Obsidian] 標題\n摘要：...\n路徑：...` |
| `scope` | String | `global`（所有 agent 可見）|
| `category` | String | `obsidian note` |
| `importance` | Float | `0.6` |
| `timestamp` | Int64 | Unix timestamp |
| `metadata` | JSON | `{"created": "ISO timestamp"}` |

**記憶條目格式**：

```
[Obsidian] P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦
摘要：用 sync_obsidian.py 在 Obsidian 存檔時...
路徑：/Users/clawdbot520/repos/Obsidian Vault/Project/P20 - ....md
```

---

## 4. 接口與協議 (Interface Control)

**MCP SSE 協議流程**：

```bash
# 1. 建立 session
GET http://localhost:3003/mcp/sse  → sessionId

# 2. Initialize
POST http://localhost:3003/mcp/message?sessionId=xxx
  {"method": "initialize", ...}

# 3. 工具呼叫（回應走 SSE stream）
POST http://localhost:3003/mcp/message?sessionId=xxx
  {"method": "tools/call", "params": {"name": "check_duplicate", ...}}
  {"method": "tools/call", "params": {"name": "remember", ...}}
```

**Embedding API**：

```
POST http://localhost:8010/v1/embeddings
Authorization: Bearer local
{"input": ["text"]}
→ {"data": [{"embedding": [1024 floats]}]}
```

**錯誤處理**：

- MCP Server 未啟動 → `sync_obsidian.py` 印出錯誤，不 crash Obsidian
- Embedding 逾時（預設 30s）→ 印出 timeout，繼續下一筆
- Kanban 檔案 → 自動 skip（檢查 `kanban-plugin` frontmatter）

---

## 5. 詳細設計 (Detailed Design)

**同步策略**：
- 只同步 frontmatter 有 `summary` 的筆記（opt-in）
- 每篇筆記存 1 筆記憶（非 chunk，避免雜訊）
- `check_duplicate` 防止重複存檔重複寫入

**Shell Commands 設定**：

```bash
/opt/homebrew/Caskroom/miniconda/base/bin/python3 \
  ~/repos/kanban-agent-teams/scripts/sync_obsidian.py \
  "{{file_path:absolute}}"
```

Events: After saving a file

**手動觸發**：

```bash
python3 ~/repos/kanban-agent-teams/scripts/sync_obsidian.py \
  "/path/to/note.md"
```

**健康確認**：

```bash
curl http://localhost:3003/health   # MCP Server
curl http://localhost:8010/health   # Embedding Server
```

---

## 6. 相關連結

- [[P19 - 用本地 BGE-M3 取代 Jina AI Embedding API]]
- 腳本：`~/repos/kanban-agent-teams/scripts/sync_obsidian.py`
- MCP Server：`~/repos/kanban-agent-teams/`
- Embedding Server：`~/repos/embedding-server/`

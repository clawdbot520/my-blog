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
  - 案例
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

向量語意搜尋記憶（透過 Jina AI embedding 做相似度比對）。

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
    "score": 0.92,
    "tags": ["bug", "lancedb"],
    "agent": "agent:claude-code"
  }
]
```

> [!note] score 說明
> score = `1 - _distance`（LanceDB 向量距離轉換），越接近 1.0 越相似。不需要精準關鍵詞，語意相近即可召回。

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
| `recall()` 回傳空 | 查詢語意差距太大 | 換更接近語意的詞，或用 `list_facts` 精確過濾 |
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

---

# V2 — Agent Monitor 統一 HTTP API（2026-03-18）

> [!info] V2 概述
> 在 V1（MCP STDIO 各自 spawn）基礎上，將向量搜尋能力整合進 Agent Monitor 的 Express server，讓所有 Agent 只需打一個 HTTP endpoint 就能做語意搜尋，不需要 spawn 任何進程。

## V2 架構變化

### V1 問題點
```
小可 → spawn server.py (Python, STDIO, 1:1 私有)
小安 → 自己 spawn 另一份 server.py（環境問題導致 EOF）
小歐 → 直接 import lancedb（不走 MCP）
→ 三方各自為政，小安 PATH 問題難解
```

### V2 解法
```
Agent Monitor（Electron, 持續在跑, port 3002）
  ├─ GET /api/lancedb/vector-search  ← 語意向量搜尋（新增）
  ├─ GET /api/lancedb/search         ← 關鍵詞 FTS（UI 用）
  ├─ GET /api/lancedb/memories       ← 列表（UI 用）
  ├─ POST /api/lancedb/memories      ← 新增（改用真實 embedding）
  └─ DELETE /api/lancedb/memories/:id

        ↑              ↑              ↑
      小可            小安            小歐
   (HTTP call)    (HTTP call)    (HTTP or 直接 import)
```

## 新增 API

### `GET /api/lancedb/vector-search`

語意向量搜尋，呼叫 Jina AI 生成 embedding 後做 ANN 搜尋。

```
參數：
  q      (string, required) — 查詢字串
  scope  (string, optional) — 限定 scope，如 agent:claude-code
  limit  (number, optional) — 回傳筆數，預設 5

回應：
[
  {
    "id": "...",
    "text": "...",
    "scope": "agent:antigravity",
    "category": "fact",
    "importance": 0.85,
    "timestamp": 1773637996324,
    "score": 0.92          ← 相似度（1 - distance），越高越相關
  }
]
```

**小安使用範例：**
```python
import requests
results = requests.get("http://localhost:3002/api/lancedb/vector-search",
                       params={"q": "MCP 記憶搜尋", "limit": 5}).json()
```

### `POST /api/lancedb/memories`（V2 修正）

V1 使用零向量（`[0.0] * 1024`），導致記憶無法被向量搜尋找到。
V2 改為呼叫 Jina API 生成真實 embedding 後寫入。

## 修復項目

| 問題 | V1 | V2 |
|------|----|----|
| 小安無法用向量搜尋 | ❌ 需自行 spawn server.py | ✅ HTTP 一行搞定 |
| UI 新增記憶用零向量 | ❌ 搜不到 | ✅ 真實 embedding |
| recall() 用關鍵詞匹配 | ❌ 語意差距大查不到 | ✅ 向量相似度 |

## V2 驗收（2026-03-18）

| 項目 | 狀態 |
|------|------|
| `GET /api/lancedb/vector-search?q=MCP` 回傳相關記憶 | ✅ |
| score 欄位正確（0~1）| ✅ |
| scope filter 正常運作 | ✅ |
| POST 新增記憶有真實 embedding | ✅ |
| Agent Monitor rebuild 成功 | ✅ |

---

# V3 — Agent Monitor 統一 MCP Server（2026-03-18）

> [!info] V3 概述
> 將 Memory MCP 與 Task Kanban MCP 整合進 Agent Monitor 的 Express server，以 MCP over HTTP/SSE 協議對外提供服務。所有 Agent 連同一個 URL，不再各自 spawn Python 進程。

## 架構演進

```
V1：各自 spawn Python subprocess（STDIO，1:1 私有）
V2：Agent Monitor 加入 REST vector-search（HTTP，但非 MCP）
V3：Agent Monitor 本身成為 MCP Server（HTTP/SSE，多 client 共用）
```

## 連線資訊

```
MCP Server URL: http://localhost:3002/mcp/sse
協議: MCP over HTTP/SSE（標準 MCP 協議）
```

## 可用工具（11 個）

**Memory 工具：**

| 工具 | 說明 |
|------|------|
| `remember` | 寫入記憶（自動生成 Jina embedding）|
| `recall` | 向量語意搜尋 |
| `list_facts` | 條件過濾列表 |
| `check_duplicate` | 重複偵測 |
| `forget` | 刪除記憶 |

**Kanban 工具：**

| 工具 | 說明 |
|------|------|
| `get_board` | 取得看板全貌 |
| `get_task` | 取得任務詳情 |
| `create_task` | 建立新任務 |
| `move_card` | 搬移卡片狀態 |
| `trigger_job` | 觸發 job.sh |
| `list_tasks_by_status` | 列出特定狀態任務 |

## 各 Agent 連線方式

**小可（Claude Code）— claude.json 設定：**
```json
{
  "mcpServers": {
    "memory-mcp":  { "url": "http://localhost:3002/mcp/sse" },
    "task-kanban": { "url": "http://localhost:3002/mcp/sse" }
  }
}
```

**小安（Antigravity）— 直接 HTTP：**
```python
import requests

# 建立連線，取得 sessionId
sse = requests.get("http://localhost:3002/mcp/sse", stream=True)
for line in sse.iter_lines():
    if line.startswith(b"data:"):
        endpoint = json.loads(line[5:])["uri"]
        session_id = endpoint.split("sessionId=")[1]
        break

# 呼叫工具
resp = requests.post(
    f"http://localhost:3002/mcp/message?sessionId={session_id}",
    json={"jsonrpc":"2.0","id":1,"method":"tools/call",
          "params":{"name":"recall","arguments":{"query":"MCP 記憶"}}}
)
```

**小歐（OpenClaw）— 如支援 MCP client：**
```
URL: http://localhost:3002/mcp/sse
```
如不支援 MCP，直接用 REST API：
```
GET http://localhost:3002/api/lancedb/vector-search?q=<query>&limit=5
```

## MCP 協議流程

```
1. GET  /mcp/sse
   ← event: endpoint
   ← data: {"uri": "/mcp/message?sessionId=<uuid>"}

2. POST /mcp/message?sessionId=<uuid>
   Body: {"jsonrpc":"2.0","id":1,"method":"tools/call",
          "params":{"name":"recall","arguments":{"query":"..."}}}
   ← 202 Accepted（回應透過 SSE 推送）

3. SSE stream 收到：
   event: message
   data: {"result":{"content":[{"type":"text","text":"..."}]},"id":1,"jsonrpc":"2.0"}
```

## V3 驗收（2026-03-18）

| 項目 | 狀態 |
|------|------|
| `GET /mcp/sse` 回傳 endpoint event | ✅ |
| `tools/list` 回傳 11 個工具 | ✅ |
| `get_board` 正確回傳看板狀態 | ✅ |
| `recall` 向量搜尋正常 | ✅ |
| claude.json 改用 URL 模式 | ✅ |
| 不再 spawn Python subprocess | ✅ |

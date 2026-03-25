---
title: P19 - 用本地 BGE-M3 取代 Jina AI Embedding API
date: 2026-03-24
tags:
  - project
  - embedding
  - bge-m3
  - lancedb
  - sdd
  - 案例
publish: true
image: attachment/p19_local_embedding.png
socialImage: https://www.clawdbot520.fyi/attachment/p19_local_embedding.png
prompt: Minimalist black-and-white icon set in Notion style. An icon of a cloud with a thin strike-through line, and a beautiful minimalist icon of a local server or computer with several small dot patterns symbolizing embeddings. A simple, clean arrow links them. Elegant, flat, professional line-art. Light gray background. No tech-sci-fi neon. Dedicated to local AI privacy.
summary: 將原本依賴 Jina AI 的雲端 Embedding 流程改為本地運行 BGE-M3。使用 Python Flask 搭建微服務封裝 `FlagEmbedding`，實現毫秒級、零成本、高隱私且支援多語言的向量化處理。
---

![[p19_local_embedding.png]]

## 1. 系統概述 (System Overview)

**專案背景**：Jina AI 是雲端服務，每次 embedding 都送資料出去，有 API key 洩漏風險與成本問題。替換為本地 BGE-M3 後：零成本、零延遲、零隱私疑慮，且與現有 LanceDB 1024 維向量完全相容，不需重建索引。

**技術棧 (Tech Stack)**：

| 層 | 技術 |
|----|------|
| OS | macOS (Apple Silicon M4) |
| 模型 | BAAI/bge-m3（`~/models/bge-m3`） |
| Server | Python Flask（`~/repos/embedding-server/server.py`） |
| Runtime | Python 3.13 (miniconda) |
| 依賴 | sentence-transformers, flask |
| 啟動 | launchd `com.clawdbot520.embedding-server` |

---

## 2. 架構設計 (Architectural Design)

**模組劃分**：

- **BGE-M3 Model**：本地 SentenceTransformer，輸出 1024 維 Float32 向量
- **Flask Server**：OpenAI 相容 `/v1/embeddings` 接口，port 8010
- **launchd**：開機自動啟動，KeepAlive 確保持續運行
- **Caller（OpenClaw Plugin / sync_obsidian.py）**：透過 HTTP 呼叫本地 server

**流程圖**：

```
Agent / sync_obsidian.py
  ↓ POST /v1/embeddings (Authorization: Bearer local)
Flask Server（port 8010）
  ↓ SentenceTransformer.encode()
BGE-M3（~/models/bge-m3）
  ↓ 1024 維 Float32 向量
LanceDB Pro（~/.openclaw/memory/lancedb-pro/）
```

---

## 3. 數據設計 (Data Design)

**Embedding API 格式（OpenAI 相容）**：

| 項目 | 數值 |
|------|------|
| 模型 | BAAI/bge-m3 |
| 向量維度 | 1024 |
| 正規化 | `normalize_embeddings=True` |
| Port | 8010 |
| API Key | `local`（固定值，Bearer 驗證） |
| Jina 相容 | ✅（維度一致，LanceDB 不需重建） |

**Request / Response 格式**：

```json
// Request
POST /v1/embeddings
Authorization: Bearer local
{"input": ["text to embed"]}

// Response
{
  "object": "list",
  "data": [{"object": "embedding", "index": 0, "embedding": [1024 floats]}],
  "model": "bge-m3"
}
```

---

## 4. 接口與協議 (Interface Control)

**Endpoints**：

```
POST http://localhost:8010/v1/embeddings  → 產生向量
GET  http://localhost:8010/health         → 健康確認
```

**openclaw.json embedding 設定**：

```json
"embedding": {
  "apiKey": "local",
  "baseURL": "http://127.0.0.1:8010",
  "dimensions": 1024,
  "model": "bge-m3",
  "normalized": true
},
"retrieval": {
  "rerank": "none"
}
```

**JavaScript 呼叫（取代 Jina）**：

```javascript
const EMBEDDING_URL = process.env.EMBEDDING_URL || 'http://127.0.0.1:8010'
const res = await fetch(`${EMBEDDING_URL}/v1/embeddings`, {
  headers: { 'Authorization': 'Bearer local', 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: [text] })
})
```

**錯誤處理**：

- Server 未啟動 → `launchctl start com.clawdbot520.embedding-server`
- Port 衝突 → `lsof -i :8010` 確認佔用程序

---

## 5. 詳細設計 (Detailed Design)

**安裝步驟**：

```bash
# 1. 下載模型
omlx download BAAI/bge-m3 --save-dir ~/models/bge-m3

# 2. 安裝依賴
pip3 install sentence-transformers flask

# 3. 載入 launchd
launchctl load ~/Library/LaunchAgents/com.clawdbot520.embedding-server.plist
```

**launchd Plist**（`~/Library/LaunchAgents/com.clawdbot520.embedding-server.plist`）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawdbot520.embedding-server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/clawdbot520/repos/embedding-server/server.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>HOME</key>
        <string>/Users/clawdbot520</string>
        <key>EMBEDDING_PORT</key>
        <string>8010</string>
        <key>EMBEDDING_API_KEY</key>
        <string>local</string>
    </dict>
</dict>
</plist>
```

**驗證**：

```bash
# Health check
curl http://localhost:8010/health

# 測試 embedding，期望輸出：dim: 1024 ✅
curl -s -X POST http://localhost:8010/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer local" \
  -d '{"input":["hello world"]}' | python3 -c "
import json,sys; d=json.load(sys.stdin)
print('dim:', len(d['data'][0]['embedding']), '✅')
"
```

---

## 6. 相關連結

- Server 程式碼：`~/repos/embedding-server/server.py`
- [[P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦]]

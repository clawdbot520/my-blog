---
title: P21 - 使用本地模型把 Obsidian 打造成 NotebookLM
date: 2026-03-24
tags:
  - project
  - obsidian
  - notebooklm
  - omlx
  - embedding
  - sdd
  - 案例
publish: true
prompt: An Obsidian vault glowing with AI intelligence, local model chip replacing cloud brain, teal knowledge graph connections flowing through a notebook interface, dark minimalist aesthetic
summary: 用 Obsidian Copilot Plugin 接上本地 oMLX LLM（Qwen2.5-3B）與 bge-m3 Embedding，開啟 Vault QA 功能，實現對整個 Obsidian 知識庫的語意問答，完全本地無隱私疑慮。
---

![[p21_obsidian_notebooklm.png]]

## 1. 系統概述 (System Overview)

**專案背景**：Google NotebookLM 可以對上傳的文件提問，但資料要送到雲端。這套方案讓 Obsidian 做到同樣的事：用本地 LLM 對話、本地 Embedding 向量搜尋，所有資料留在本機。

**技術棧 (Tech Stack)**：

| 層 | 技術 |
|----|------|
| OS | macOS (Apple Silicon M4) |
| 筆記庫 | Obsidian（`~/repos/Obsidian Vault/`） |
| LLM | oMLX Qwen2.5-3B（port 8000） |
| Embedding | oMLX bge-m3（port 8000，同一 server） |
| Plugin | Obsidian Copilot |
| 協議 | OpenAI Compatible `/v1/chat/completions` + `/v1/embeddings` |

---

## 2. 架構設計 (Architectural Design)

**模組劃分**：

- **oMLX Server**：本地 LLM + Embedding server，OpenAI 相容 API，port 8000
- **Copilot Plugin**：Obsidian 插件，負責對話 UI + Vault QA（向量搜尋）
- **Index**：Copilot 掃描所有 `.md` 並建立本地向量索引

**流程圖**：

```
用戶在 Copilot 側邊欄提問
  ↓ Vault QA 模式
Copilot Plugin
  ↓ POST /v1/embeddings（問題向量化）
oMLX bge-m3（port 8000）
  ↓ 向量相似度搜尋（本地索引）
找到相關筆記片段
  ↓ 組合 context + 問題
  ↓ POST /v1/chat/completions
oMLX Qwen2.5-3B（port 8000）
  ↓ 生成回答，附上筆記來源連結
```

---

## 3. 數據設計 (Data Design)

**Vault QA 索引**：

| 項目 | 說明 |
|------|------|
| 索引來源 | 所有 `.md` 檔案 |
| 向量模型 | bge-m3（oMLX） |
| 索引觸發 | 手動 Index Vault 或更新時重建 |
| 索引位置 | Copilot Plugin 本地快取 |

---

## 4. 接口與協議 (Interface Control)

**oMLX API**：

```
Base URL: http://localhost:8000/v1
API Key:  任意字串（如 omlx）— oMLX 不驗證，但 Copilot 欄位不能空白
```

**Copilot LLM 設定**（Chat Models → Add Model）：

| 欄位 | 值 |
|------|-----|
| Provider | OpenAI Compatible |
| Base URL | `http://localhost:8000/v1` |
| API Key | `omlx` |
| Model Name | `qwen2.5-3b` |

**Copilot Embedding 設定**（Embedding Models → Add Model）：

| 欄位 | 值 |
|------|-----|
| Provider | OpenAI Compatible |
| Base URL | `http://localhost:8000/v1` |
| API Key | `omlx` |
| Model Name | `bge-m3` |

**錯誤處理**：

- Copilot 無法連線 → 確認 oMLX 已啟動，`curl http://localhost:8000/health`
- 回答品質差 → 重新 Index Vault，確認筆記有內容

---

## 5. 詳細設計 (Detailed Design)

**安裝步驟**：

1. Obsidian → Settings → Community Plugins → 搜尋 **Copilot** → 安裝並啟用

**設定 LLM**：

1. Settings → Community Plugins → Copilot → Model Tab
2. Chat Models → **+ Add Model**
3. 填入 Provider: `OpenAI Compatible`、Base URL: `http://localhost:8000/v1`、API Key: `omlx`、Model: `qwen2.5-3b`

**設定 Embedding**：

1. Model Tab → Embedding Models → **+ Add Model**
2. 填入同上，Model 改為 `bge-m3`

**建立向量索引**：

1. Copilot 設定 → 找到 **Vault QA** → 開啟
2. 點擊 **Index Vault** → 等待掃描完所有 `.md`

**使用方式**：

- 右側邊欄開啟 Copilot 對話框
- 切換模式為 **Vault QA**
- 提問範例：「根據我的筆記，關於 embedding 的核心概念是什麼？」
- AI 會搜尋所有筆記，彙整答案並附上來源連結

**驗證**：

```bash
# 確認 oMLX 正常
curl http://localhost:8000/health
```

---

## 6. 相關連結

- [[P19 - 用本地 BGE-M3 取代 Jina AI Embedding API]]
- [[P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦]]
- oMLX 下載：App Store 搜尋 oMLX

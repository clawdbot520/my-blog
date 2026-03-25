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
socialImage: https://www.clawdbot520.fyi/attachment/p21_obsidian_notebooklm.png
image: attachment/p21_obsidian_notebooklm.png
cover: attachment/p21_obsidian_notebooklm.png
prompt: An Obsidian vault glowing with AI intelligence, local model chip replacing cloud brain, teal knowledge graph connections flowing through a notebook interface, dark minimalist aesthetic
summary: 用 Obsidian Copilot Plugin 接上本地 oMLX LLM（Qwen2.5-3B）與 bge-m3 Embedding，開啟 Vault QA 功能，實現對整個 Obsidian 知識庫的語意問答，完全本地無隱私疑慮。
---

![[p21_obsidian_notebooklm.png]]

## 1. 系統概述 (System Overview)

**目標**：在 Obsidian 中實現類似 NotebookLM 的功能，但完全運行在本地筆記庫上。

**核心組件**：
- **Obsidian Copilot Plugin**：提供 AI 對話界面。
- **oMLX (Apple Silicon 優化)**：運行 Qwen2.5-3B 本地 LLM。
- **BGE-M3 Embedding**：用於本地向量化與語意搜尋。

---

## 2. 架構設計 (Architectural Design)

```mermaid
graph LR
    A[Obsidian Copilot] --> B[Local LLM - Qwen2.5-3B]
    A --> C[Local Vector DB - BGE-M3]
    C --> D[Obsidian MD Files]
```

---

## 3. 數據設計 (Data Design)

- **Vector Storage**：由 Copilot 內建的索引機制管理，使用本地 BGE-M3 將筆記轉換為向量。
- **Context Optimization**：透過篩選特定的資料夾（例如 `Project` 或 `Journal`），提高檢索準確度。

---

## 4. 接口與協議 (Interface Control)

- **LLM API**：OpenAI 兼容格式（由 oMLX 暴露）。
- **Embedding API**：由本地 Python 服務封裝（詳見 P19）。

---

## 5. 詳細設計 (Detailed Design)

### Step 1：啟動本地 LLM (oMLX)

```bash
omlx serve qwen2.5-3b-instruct-q4
```

### Step 2：配置 Copilot Plugin

在 Obsidian Copilot 設定中：
- **Model**：`custom`
- **Base URL**：`http://localhost:8080/v1`
- **Embedding Model**：選擇 `Local BGE-M3` (需確保 P19 的背景服務已啟動)

### Step 3：建立索引

在 Copilot 面板點擊 **"Index Vault"**。索引完成後，即可使用 "Vault QA" 模式進行提問。

---

## 6. 相關連結

- Obsidian Copilot Repo：`https://github.com/logancyang/obsidian-copilot`
- oMLX Repo：`https://github.com/apple/ml-explore`

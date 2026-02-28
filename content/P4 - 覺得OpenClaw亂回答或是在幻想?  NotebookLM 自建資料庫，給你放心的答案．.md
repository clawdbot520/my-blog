---
title: P4 - 覺得 Openclaw 亂回答或是在幻想？NotebookLM 自建資料庫
date: 2026-02-23
tags:
  - 案例
  - OpenClaw
  - NotebookLM
  - 知識庫
publish: true
prompt: A wise AI librarian organizing infinite books and documents, with a glowing knowledge brain in the background. Library of the future, warm amber and blue colors
---
![[Pasted image 20260226231149.png]]

> [!info] 概述
> 當 AI 回答的內容不準確或是在「幻想」時，最好的解決方案就是給它一個可信的資料庫。

## 問題背景

AI 有時會：
- 回答錯誤的資訊
- 過度自信地說謊
- 混淆相似概念

解決方案：**讓 AI 只從你的資料回答問題**

## 解決方案：NotebookLM

NotebookLM 是 Google 推出的 AI 筆記工具，特色：

| 功能 | 說明 |
|------|------|
| 來源輸入 | 支援 PDF、Google Docs、網頁、影片 |
| 語音摘要 | 自動生成音頻摘要 |
| 引用來源 | 答案會附上引用來自哪個文件 |
| 離線可用 | 離線也能使用 |

## 建立知識庫步驟

### 1. 準備資料

收集你想讓 AI 學習的資料：
- 部落格文章
- PDF 筆記
- 個人文件
- 研究報告

### 2. 上傳到 NotebookLM

1. 前往 https://notebooklm.google/
2. 建立新筆記本
3. 點擊「新增來源」
4. 選擇檔案或輸入 URL

### 3. 與 AI 對話

在右側面板輸入問題，AI 會：
- 只從你上傳的資料回答
- 附上引用來源
- 標註不確定的地方

## 整合 OpenClaw

你可以讓 OpenClaw 幫你：

1. **自動抓取資料**：用 DeepReader 抓取網頁存檔
2. **整理成筆記**：存到 Obsidian Vault
3. **定期上傳**：手動或自動化上傳到 NotebookLM
4. **詢問問題**：透過 OpenClaw 查詢 NotebookLM

## 相關工具

### DeepReader Skill

```
https://github.com/astonysh/OpenClaw-DeepReeder
```

讓 OpenClaw 可以幫你讀取網頁並轉成 Markdown。

### 自動化流程

```
瀏覽網頁 → DeepReader 擷取 → Obsidian 存檔 → NotebookLM 上傳 → 問問題
```

---


## 相關文章

[[P5 - 沒時間刷Podcast? 用一句話讓OpenClaw 幫你生成筆記|下一篇：P5 - 沒時間刷Podcast? 用一句話讓OpenClaw 幫你生成筆記]]


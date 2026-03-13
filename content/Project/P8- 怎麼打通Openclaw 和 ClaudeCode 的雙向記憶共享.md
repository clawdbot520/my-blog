---
title: P8 - 怎麼打通Openclaw 和 ClaudeCode 的雙向記憶共享
date: 2026-03-01
tags:
  - OpenClaw
  - 記憶
  - 自動化
  - ClaudeCode
publish: true
prompt: Two AI robots shaking hands, sharing brain waves, digital memory data flowing between them, neural network connection, blue and orange colors, futuristic tech
---

![[Pasted image 20260301203811.png]]

> [!info] 概述
> 打通 OpenClaw 與 Claude Code 的雙向記憶共享，讓兩個 AI 系統可以互相存取對方的記憶。

---

## 啟發

昨天看到 YouTuber「AI 超元域」介紹 LanceDB Pro 插件，對我的 OpenClaw 記憶系統有很大幫助——減少失憶、增强記憶功能。

> [!link] 參考
> [AI 超元域的 GitHub](https://github.com/win4r/memory-lancedb-pro)

同時我也用 Claude Code，就想到：能不能把 Claude Code 的記憶跟 OpenClaw 共享？這樣兩邊學到的東西可以打通，經驗可以互相分享。

於是做了這個基於 LanceDB Pro 插件的 patch，達成這個目標。

---

## 特點

| 特點 | 說明 |
|------|------|
| 跨系統學習 | OpenClaw 可學習 Claude Code 的記憶 |
| 無需額外開發 | Claude Code 直接用 openclaw CLI |
| 極低延遲 | 結束時只做 symlink，不需額外寫入 |

---

## 目標

| 方向 | 說明 |
|------|------|
| OpenClaw → Claude Code | 讓 Claude Code 可以存取 OpenClaw 的記憶 |
| Claude Code → OpenClaw | 讓 OpenClaw 可以存取 Claude Code 的記憶 |

---

## 流程

### 1. 訊息發送時（召回記憶）

```
你送訊息
    ↓
memory-recall.sh 自動搜 LanceDB Pro
    ↓
相關記憶注入 context
```

在 user 發送訊息後，觸發 memory-recall.sh 搜尋相關資訊，注入上下文中。

### 2. 對話結束時（同步記憶）

```
對話結束
    ↓
on-stop.sh symlink Claude Code session 到 ~/.openclaw/agents/*/sessions/
    ↓
自動存入 LanceDB Pro
```

這是核心 hack——用 symlink 而非寫入，極低延遲。

### 3. 順著 OpenClaw 的 Cron 蒸餾記憶

```
OpenClaw sessions（~/.openclaw/agents/*/sessions/）
        ↓
   hourly cron 增量蒸餾
        ↓
   LanceDB Pro (global scope)
```

---

## 常見問題

### Claude Code 格式行被跳過

**問題**：jsonl_distill.py 只處理 message type，其他格式會被跳過。

**解決**：在 line 312 把：

```python
if obj.get("type") != "message":
    continue
```

改成：

```python
if obj.get("type") not in ("message", "user", "assistant"):
    continue
```

---

## 檔案對照表

| 檔案 | 功能 |
|------|------|
| ~/.claude/hooks/memory-recall.sh | UserPromptSubmit hook — 召回記憶 |
| ~/.claude/hooks/on-stop.sh | TUI branch — 對話結束時同步 |
| ~/.claude/settings.json | 加入 UserPromptSubmit hook |

---

## 環境需求

| 需求 | 狀態 |
|------|------|
| openclaw CLI 在 PATH | ✅ 已有 |
| JINA_API_KEY 環境變數 | ✅ 已設 |
| hooks 設定好 | ✅ 已做 |

---

## 相關連結

[[O5 - 一個OpenClaw不夠用，角色切來切去失憶，怎麼解決？]]

---
title: P11 - Telegram 橋接 Antigravity
date: 2026-03-06
tags:
  - antigravity
  - telegram
  - remoat
  - bridge
publish: true
---

## 目標

讓 Telegram 可以直接跟 Antigravity IDE對話，從手機遠端操控 Antigravity。

---

## 背景：之前為什麼失敗

2026-03-03 曾嘗試用 `antigravity chat --mode agent --reuse-window` 從 `bridge.py` 後台呼叫，但一直失敗。根本原因：

> `--reuse-window` 依賴 **IPC socket** 來定位現有視窗，但後台 subprocess 的環境變數與前景 process 不同，IPC socket 無法被找到，導致靜默失敗。

當時做通的只有：Telegram ↔ **Gemini API 直連**（完全繞過 Antigravity）。

---

## 這次的解法：Remoat

### 什麼是 Remoat

- npm 套件：`npm install -g remoat`
- GitHub：`https://github.com/optimistengineer/Remoat`
- 專為 Antigravity IDE + Telegram 設計的本地 bot

### 核心技術差異

| | 之前失敗的方式 | Remoat |
|---|---|---|
| 通訊方式 | IPC socket | **CDP（Chrome DevTools Protocol）over TCP** |
| 發現現有視窗 | 需要進程 ID | HTTP `/json/list` 自動掃描 port 9222–9666 |
| 後台注入訊息 | IPC 在後台失敗 | WebSocket TCP，完全可靠 |
| 讀取回應 | 需自行實作 | 內建 ResponseMonitor（每 2 秒輪詢 DOM） |

### 架構

```
Telegram → @media520_bot → Remoat bot（grammy）
    → CdpService（WebSocket to port 9222）
    → Antigravity IDE（Input.dispatchKeyEvent 注入訊息）
    → ResponseMonitor（DOM 輪詢等待回應）
    → Remoat 回傳結果到 Telegram
```

---

## 設定過程

### 1. 安裝 Remoat
```bash
npm install -g remoat
```

### 2. 設定 `~/.remoat/config.json`
```json
{
  "telegramBotToken": "<bot token>",
  "allowedUserIds": ["<user id>"],
  "workspaceBaseDir": "/Users/clawdbot520/.openclaw",
  "autoApproveFileEdits": false,
  "useTopics": false
}
```

> **坑**：`allowedUserIds` 必須是陣列 `["id"]`，寫成字串 `"id"` 會被 spread 成單個字元導致永遠驗證失敗。

### 3. Antigravity 必須以 CDP debug port 開啟

```bash
open -a Antigravity --args --remote-debugging-port=9222 ~/.openclaw/workspace-antigravity
```

> 不能用一般方式開 Antigravity，否則 CDP port 是 random 的，Remoat 找不到。

### 4. 啟動 Remoat
```bash
remoat start
```

### 5. Telegram 使用方式
1. 傳 `/project` → 選 `workspace-antigravity`
2. 直接傳訊息即可

---

## CDP 底層技術（給進階用戶 / Agent 自動化）

Remoat 背後是 **Chrome DevTools Protocol（CDP）**，理解這層有助於 debug 和自訂腳本。

### CDP 完整流程

```
Python / 任意程式
  ↓ GET http://localhost:9222/json
找到 title 含 "workspace" 的頁面，取得 webSocketDebuggerUrl
  ↓ WebSocket 連線
  ├─ Runtime.enable（啟用 JS 執行環境）
  ├─ querySelector('div[role="textbox"]').focus()   ← 聊天輸入框 focus
  ├─ Input.dispatchKeyEvent: Cmd+A + Backspace      ← 清除舊內容
  ├─ Input.insertText: "你的訊息"                    ← 注入文字（支援中文）
  ├─ Input.dispatchKeyEvent: Enter                  ← 送出
  │
  └─ 輪詢等待回應
       ├─ 偵測 Stop 按鈕是否存在（有 = 還在生成）
       │   selector: [data-tooltip-id="input-send-button-cancel-tooltip"]
       └─ 抓最新回應文字
           selector: .antigravity-agent-side-panel .leading-relaxed（最後一個節點）
```

### 聊天框為何不能直接設 `.value`

Antigravity 的輸入框是 `div[role="textbox"]`（富文字編輯器），不是 `<input>`，所以必須用 `Input.insertText` 或 `pbcopy + execCommand('paste')` 注入文字，直接設 `.value` 無效。

### ⚠️ 必須加 `--remote-allow-origins=*`

啟動 Antigravity 時**兩個參數都要**：

```bash
--remote-debugging-port=9222 --remote-allow-origins=*
```

缺少 `--remote-allow-origins=*` 會導致外部 WebSocket 連線回傳 **403 Forbidden**，Remoat 和所有自訂腳本都會失效。

### Agent 程式化呼叫（非 Telegram 場景）

其他 agent（如小歐、小可）需要呼叫小安時，可用 `ask_antigravity.py`，底層同樣是 CDP：

```
小歐 / 小可
  ↓ python3 ask_antigravity.py "問題"
  ↓ CDP → Antigravity IDE（真正的小安）
  ↓ 等待生成完成
  → 回傳文字到 stdout
```

檔案位置：`~/.openclaw/skills/task-kanban-mcp/scripts/ask_antigravity.py`

---

## 遇到的困難

| 問題 | 原因 | 解法 |
|---|---|---|
| Bot 收不到訊息 | `allowedUserIds` 格式錯誤（字串而非陣列） | 改成 `["id"]` |
| Workbench page not found | Remoat 每次開新 workspace 用 random port | 先手動用 debug port 開 Antigravity，再啟動 Remoat |
| 多個 Antigravity 視窗 | Remoat 反覆嘗試開新視窗 | 全部關掉，重新以正確方式開一個 |
| workspaceBaseDir 設錯 | 指向 `.gemini/antigravity`（`.pb` 檔，非 project） | 改成 `~/.openclaw`，project 選 `workspace-antigravity` |

---

## 自動啟動設定（launchd）

### Antigravity debug mode 開機啟動
```
~/Library/LaunchAgents/com.clawdbot520.antigravity-debug.plist
```
- 開機執行 `open -a Antigravity --args --remote-debugging-port=9222 ~/.openclaw/workspace-antigravity`
- 只執行一次（無 KeepAlive）

### Remoat 常駐服務
```
~/Library/LaunchAgents/com.clawdbot520.remoat.plist
```
- 開機啟動 `remoat start`
- KeepAlive = true，掉了自動重啟
- Log：`~/.remoat/remoat.log`

---

## 相關檔案

| 路徑                                                               | 說明                  |
| ---------------------------------------------------------------- | ------------------- |
| `~/.remoat/config.json`                                          | Remoat 設定           |
| `~/.remoat/remoat.log`                                           | 執行 log              |
| `~/.openclaw/workspace-antigravity/`                             | workspace           |
| `~/Library/LaunchAgents/com.clawdbot520.remoat.plist`            | Remoat launchd      |
| `~/Library/LaunchAgents/com.clawdbot520.antigravity-debug.plist` | Antigravity launchd |

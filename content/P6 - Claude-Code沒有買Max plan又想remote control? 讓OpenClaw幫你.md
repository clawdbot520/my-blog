---
title: P6 - Claude Code 沒有買 Max plan 又想遠端控制？讓 OpenClaw 幫你
tags:
  - OpenClaw
  - 自動化
  - 工作流
  - ClaudeCode
  - 案例
date: 2026-02-28
publish: true
prompt: A smartphone controlling a powerful computer remotely, with Telegram icons and AI robot. Remote control concept, cyan and orange contrast, futuristic UI
---
![[Pasted image 20260228115112.png]]


> [!info] 概述
> Claude Code Remote Control 是強大的遠端控制功能，但僅開放給 Max 訂閱用戶（每月 100 刀）。本文教你用 OpenClaw + Telegram 打造免費替代方案，讓你免訂閱也能遠端操控 Claude Code。

---

## 為什麼需要 Bridge？

[Claude Code Remote Control](https://code.claude.com/docs/en/remote-control) 是 Claude Code 的新功能，讓你從手機、平板或瀏覽器遠程控制本地會話。

> [!warning] 代價
> 這個功能僅開放給 **Max 訂閱用戶**，每個月要花 100 刀。

如果不想要這筆支出，但又想享受遠端操控的便利，可以透過通訊軟體讓 OpenClaw 幫你實現。

具體做法請參考這個 skill：
📎 [awesome-openclaw_skills/claude-code-bridge](https://github.com/clawdbot520/awesome-openclaw_skills/tree/main/claude-code-bridge)

---

## 核心功能

| 功能 | 說明 |
|------|------|
| **Telegram 派任務** | 通過 Telegram 發送任務描述 |
| **自動執行** | dispatch 腳本自動啟動 Claude Code |
| **自動回報** | 任務完成後 Hook 自動發 Telegram 通知 |
| **無需訂閱** | 免費開源方案 |

---

## 工作流程

```
Telegram 派任務
    ↓
OpenClaw 創建 task.json
    ↓
dispatch.sh 讀取並執行
    ↓
Claude Code 執行任務
    ↓
Hook 觸發 → 自動發 Telegram 通知
```

---

## task.json 格式

```json
{
  "from": "TELEGRAM_CHAT_ID",
  "text": "Create a REST API",
  "workdir": "~/my-project",
  "permission_mode": "acceptEdits"
}
```

| 欄位 | 必填 | 說明 |
|------|:----:|------|
| from | ✅ | 完成後通知的 Telegram ID |
| text | ✅ | 任務描述（Prompt） |
| workdir | ❌ | 工作目錄，預設 ~ |
| permission_mode | ❌ | 權限模式，預設 acceptEdits |

---

## 安裝步驟

### 1. 複製腳本

```bash
cp scripts/dispatch.sh ~/.openclaw/skills/claude-code-bridge/
cp scripts/on-stop.sh ~/.claude/hooks/
```

### 2. 設定權限

```bash
chmod +x ~/.openclaw/skills/claude-code-bridge/dispatch.sh
chmod +x ~/.claude/hooks/on-stop.sh
```

### 3. 配置 Claude Code Hook

在 `~/.claude/settings.json` 加入：

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/on-stop.sh",
        "timeout": 30
      }]
    }]
  }
}
```

---

## 使用方式

### Step 1: 創建 task.json

```json
{
  "from": "7683093123",
  "text": "幫我寫一個登入 API",
  "workdir": "~/my-project"
}
```

### Step 2: 執行

```bash
~/.openclaw/skills/claude-code-bridge/dispatch.sh
```

### Step 3: 自動收到通知

任務完成後，你會收到 Telegram 通知：

```
✅ Claude Code done
📋 Task: 幫我寫一個登入 API
📝 Output: (結果)
```

---

## 檔案結構

```
~/.openclaw/claude-code-bridge/
├── task.json           # 任務配置
├── task-output.txt     # 執行輸出
└── hook.log           # 日誌

~/.claude/hooks/
└── on-stop.sh         # Stop Hook
```

---

## 為什麼選 Bridge？

> [!tip] 優勢
> 1. **免費**：不需要 Max 訂閱
> 2. **簡單**：一行指令就搞定
> 3. **自動**：任務完成自動通知
> 4. **靈活**：可以接多個 Telegram bot

---

## 相關資源

- [Claude Code Remote Control 文檔](https://code.claude.com/docs/en/remote-control)
- [OpenClaw Skills - Claude Code Bridge](https://github.com/clawdbot520/awesome-openclaw_skills/tree/main/claude-code-bridge)


---

## 相關連結

（完）

---
title: P15 - 透過 Telegram 橋接 Claude Code
date: 2026-03-11
tags:
  - ClaudeCode
  - Telegram
  - cct
  - 橋接
  - 自動化
publish: true
prompt: Claude robot connected to Telegram via glowing bridge, smartphone showing chat interface, headless terminal in background, blue and white colors, futuristic remote control
---
![[Pasted image 20260312142328.png]]
## 背景

Claude Code 官方沒有 Telegram 整合，官方存取方式只有：
- Terminal TUI（直接在終端機操作）
- VS Code / JetBrains 插件
- GitHub Actions
- Agent SDK（開發者自建）

**cct（Claude Code Telegram）** 是基於 `@anthropic-ai/claude-agent-sdk` + `grammy`（Telegram framework）自行開發的橋接工具。

---

## 架構

```
用戶 → Telegram Bot → cct → Claude Code（headless）→ Telegram 回覆
```

cct 本質上是一個 Telegram Bot，收到訊息後在背景以 headless 模式跑 Claude Code，再把結果回傳給用戶。

---

## 安裝與設定

### 1. 安裝 cct

cct 是 Bun 編譯的 binary（60MB），直接複製即可：

```bash
cp /path/to/cct ~/.local/bin/cct
chmod +x ~/.local/bin/cct
```

binary 位於 `~/.local/bin/cct`。**建議先備份現有 binary**，source code 若遺失無法重新 build：

```bash
cp ~/.local/bin/cct ~/Backups/cct.backup
```

### 2. 設定 Telegram Bot Token

在 `~/.cct/` 目錄下設定 bot token（首次執行 `cct .` 會引導設定）。

### 3. 啟動

```bash
# 在指定工作目錄啟動
cct .

# 注意：不能在 Claude Code TUI 內直接跑，會觸發 nested 保護
# 需要清除環境變數
env -u CLAUDECODE cct .
```

---

## 設定為開機自動啟動（launchd）

### plist 位置
`~/Library/LaunchAgents/com.clawdbot520.claude-code-telegram.plist`

### 操作指令

```bash
# 啟動
launchctl load ~/Library/LaunchAgents/com.clawdbot520.claude-code-telegram.plist

# 停止
launchctl unload ~/Library/LaunchAgents/com.clawdbot520.claude-code-telegram.plist

# 確認是否在跑
launchctl list | grep claude-code-telegram
ps aux | grep cct | grep -v grep
```

plist 設有 `KeepAlive = true`，所以 cct 掛掉會自動重啟。

---

## 與 OpenClaw Gateway 的關係

cct 是獨立服務，和 OpenClaw Gateway 是並行關係：

| | cct | OpenClaw Gateway |
|---|---|---|
| 橋接目標 | Claude Code | 小歐（MiniMax）、小安（Antigravity）等 |
| Telegram Bot | 獨立 bot | 各 agent 各自的 bot |
| 管理方式 | 獨立 launchd plist | `ai.openclaw.gateway.plist` |

---

## Claude Code Bridge（CCB）進階用法

**CCB** 是在 cct 基礎上，讓 OpenClaw 可以主動派任務給 Claude Code 的橋接機制。

CCB 不是常駐服務，是被動觸發式——只有當 task.json 出現才會執行，不需要單獨啟動。

```
OpenClaw 寫入 task.json
    ↓
dispatch.sh 讀取 task.json
    ↓
script -q + claude -c -p headless 執行（必須用 PTY 否則卡住）
    ↓
on-stop.sh 讀取結果，Telegram 通知 + 清理
```

詳細規格與腳本參見：`~/.openclaw/skills/claude-code-bridge/SKILL.md`

---

## 注意事項

- cct 和 Claude Code TUI 是**兩個獨立的 session**，互不干擾
- cct 使用 `bypassPermissions` 模式，執行任何指令不需確認
- **不能在 Claude Code TUI 內直接跑 cct**：會觸發 nested session 保護，需用 `env -u CLAUDECODE cct .`
- 停止更新 Antigravity 前記得先 `unload` cct，否則 Telegram 訊息可能喚醒 Antigravity

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `~/.local/bin/cct` | cct 執行檔 |
| `~/.cct/` | cct 工作目錄與設定 |
| `~/.cct/cct.log` | 執行日誌 |
| `~/Library/LaunchAgents/com.clawdbot520.claude-code-telegram.plist` | launchd 設定 |
| `~/.openclaw/skills/claude-code-bridge/dispatch.sh` | CCB 派任腳本 |
| `~/.claude/hooks/on-stop.sh` | Claude Code Stop hook |

---

## 相關文件

- [[P11 - Telegram 橋接 Antigravity]] — 小安的 Telegram 橋接（Remoat）
- [[P14 - Obsidian Kanban 多代理任務自動化系統]] — Kanban 任務派發給 Claude Code

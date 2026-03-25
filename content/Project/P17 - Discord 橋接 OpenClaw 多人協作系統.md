---
title: P17 - Discord 橋接 OpenClaw 多人協作系統
date: 2026-03-24
tags:
  - project
  - discord
  - openclaw
  - integration
  - sdd
  - 案例
publish: true
socialImage: https://www.clawdbot520.fyi/attachment/p17_discord_openclaw.png
image: attachment/p17_discord_openclaw.png
cover: attachment/p17_discord_openclaw.png
prompt: A futuristic Discord interface with glowing teal chat bubbles and stylized AI agent avatars (robots/minimalist heads) interacting, dark background, cyberpunk-neon influence
summary: 透過 Discord 官方 Bot API 將 OpenClaw 接入 Discord 頻道。支援多人 @ 機器人、執行 Shell 指令、存取本地 MCP Server 工具，實現「像真人一樣在群組裡寫代碼」的協作體驗。
---
![[Screenshot 2026-03-25 at 4.06.13 PM.png]]


## 1. 系統概述 (System Overview)

**專案背景**：讓多個 OpenClaw Agent 透過 Discord 提供服務，不同頻道對應不同 Agent（main、market-analysis、editor 等），實現多人協作與分流。

**技術棧 (Tech Stack)**：

| 層 | 技術 |
|----|------|
| OS | macOS (Apple Silicon M4) |
| Gateway | OpenClaw Gateway |
| Channel | Discord Bot（discord.js） |
| 設定 | `~/.openclaw/openclaw.json` |
| Bot Portal | Discord Developer Portal |

---

## 2. 架構設計 (Architectural Design)

**模組劃分**：

- **Discord Bot**：持有 Bot Token，監聽 Server 訊息
- **OpenClaw Gateway**：路由層，依 bindings 把訊息派給對應 Agent
- **Agents**：main、editor、market-analysis 等，各自有 session context

**頻道分流架構**：

```
Discord Server
├── #general 頻道 → main agent
├── #editor 頻道  → editor agent
└── #market 頻道  → market-analysis agent
    Bot: @Main / @Marketing（多 Bot 模式）
```

**流程圖**：

```
Discord 用戶傳訊息
  ↓ Discord Bot（WebSocket）
OpenClaw Gateway
  ↓ 比對 bindings（channel ID / guildId）
對應 Agent（main / editor / market-analysis）
  ↓ 回覆
Discord 頻道
```

---

## 3. 數據設計 (Data Design)

**openclaw.json 設定結構**：

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "accounts": {
        "default": {
          "token": "YOUR_BOT_TOKEN",
          "guilds": {
            "YOUR_GUILD_ID": {
              "requireMention": false,
              "users": ["YOUR_USER_ID"]
            }
          }
        }
      }
    }
  },
  "bindings": [
    {
      "agentId": "editor",
      "match": {
        "channel": "discord",
        "peer": { "kind": "channel", "id": "YOUR_CHANNEL_ID" },
        "guildId": "YOUR_GUILD_ID"
      }
    },
    {
      "agentId": "market-analysis",
      "match": {
        "channel": "discord",
        "accountId": "discord_marketing"
      }
    }
  ]
}
```

**命名規範**：
- `accountId`：多 Bot 時區分不同 Bot，如 `discord_marketing`
- `guildId`：Discord Server ID（18 位數字字串）
- `peer.id`：頻道 ID（18 位數字字串）

---

## 4. 接口與協議 (Interface Control)

**Discord Developer Portal 設定**：

```
Privileged Gateway Intents（必須全開）：
  ✅ Message Content Intent
  ✅ Server Members Intent

OAuth2 Scopes：
  ✅ bot
  ✅ applications.commands

Bot Permissions：
  ✅ View Channels
  ✅ Send Messages
  ✅ Read Message History
  ✅ Embed Links
  ✅ Attach Files
```

**常用指令**：

```bash
# 查看頻道狀態
openclaw channels status

# 查看目前 sessions
openclaw sessions list

# 重啟 Gateway（設定更新後必做）
openclaw gateway restart
```

**錯誤處理**：

- Bot 顯示 disconnected → 確認 Bot 已加入 Server，對 Bot 傳 DM 完成驗證
- 多個 Bot 回應同一頻道 → 檢查 bindings，每頻道只能有一個 binding
- Config 格式錯誤 → `openclaw config validate`，確認 `channelId` 是數字不是字串

---

## 5. 詳細設計 (Detailed Design)

**步驟一：建立 Discord Application**

1. 前往 Discord Developer Portal → New Application → 命名
2. 左側 Bot → 啟用 Privileged Gateway Intents（Message Content + Server Members）
3. Reset Token → 複製 Bot Token

**步驟二：邀請 Bot 加入 Server**

1. Developer Portal → OAuth2 → OAuth2 URL Generator
2. 勾選 Scopes + Bot Permissions → 複製 URL → 瀏覽器授權

**步驟三：更新 openclaw.json**

```bash
openclaw config set channels.discord.accounts.default.token 'YOUR_BOT_TOKEN'
openclaw config set channels.discord.enabled true
```

**步驟四：重啟並驗證**

```bash
openclaw gateway restart
openclaw channels status
```

**安全注意**：Bot Token 屬於機密，只存在 `openclaw.json`，不 commit 到 git。

---

## 6. 相關連結

- OpenClaw 設定：`~/.openclaw/openclaw.json`
- [[P20 - Obsidian 即時同步 LanceDB Pro 打造 AI 數位大腦]]

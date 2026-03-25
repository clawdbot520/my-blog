---
title: P18 - Discord 橋接 Claude Code（小可）
date: 2026-03-19
tags:
  - discord
  - claude-code
  - bot
  - deno
  - integration
  - 案例
publish: true
socialImage: https://www.clawdbot520.fyi/attachment/p18_claude_discord.png
---
![[Screenshot 2026-03-25 at 4.06.13 PM.png]]
## 目標

將 Claude Code（小可）接上 Discord，讓用戶可以透過 Discord 頻道或私訊（DM）直接與 Claude Code 互動。

---

## 使用的工具

- **Repo**：`~/claude-code-discord`
- **Runtime**：Deno
- **Bot Framework**：discord.js 14
- **AI**：Anthropic Claude Agent SDK（`@anthropic-ai/claude-agent-sdk`）

---

## 遇到的問題與解法

### 1. Nested Claude Code Protection（Exit Code 1）

**症狀**：Bot 啟動後呼叫 Claude 時直接 exit code 1。

**原因**：Claude Code 有保護機制，偵測到 `CLAUDECODE` 環境變數就拒絕在 nested 環境下啟動。Bot 本身是在 Claude Code TUI 裡跑的，所以繼承了這個 env var。

**修復**：在 `claude/client.ts` 的 `envVars` 裡明確清掉：
```ts
CLAUDECODE: '',
```

---

### 2. Cannot read properties of null (substring)

**症狀**：MessageCreate handler 中呼叫假的 `ctx` 時出現 null 錯誤。

**原因**：假的 `InteractionContext` 缺少 `getChannelId()`、`getMemberRoleIds()`、`getUserId()` 等方法，並且 `editReply` / `deferReply` 的機制與真正的 Discord Interaction 不同。

**修復**：補齊所有 ctx 方法，並改用 `statusMsg.edit()` + `channel.send()` 取代 `message.reply()`。

---

### 3. Invalid Form Body embeds\[0\].timestamp

**症狀**：Discord API 回傳 `DATE_TIME_TYPE_PARSE` 錯誤。

**原因**：全域 embed 裡有 `timestamp: true`，但 Discord 要求 ISO8601 字串，不接受 boolean。

**修復**：全域搜尋替換 14 個檔案，將 `timestamp: true` 改為 `timestamp: new Date().toISOString()`。

---

### 4. ⚙️ System: init 每次對話都顯示

**症狀**：每次發訊息都會看到 "System: init" 的系統 embed。

**原因**：Claude Agent SDK 每次 session 啟動都會發送一個 system init 事件，透過 `sendContent`（followUp/reply）傳出來。

**修復**：在 `sendContent` 裡過濾 title 含 `'System: init'` 或 `'Startup Complete'` 的 embed：
```ts
if (title.includes('System: init') || title.includes('Startup Complete')) return;
```

---

### 5. DM 完全沒有回應

**症狀**：DM 傳訊息後，Discord DM 視窗沒有任何回應（但 session 有在跑）。

**根本原因**：`sendClaudeMessages` 在 bot 啟動時就被綁定到 guild channel 的 sender，DM 走的是同一個 `handlers.get('claude').execute(ctx)`，Claude 的輸出全跑去 guild channel 的 thread，DM 視窗看不到。

**架構分析**：
```
guild channel 路徑：
  MessageCreate → handlers.get('claude') → createThreadSender → guild thread
  
DM 路徑（錯誤）：
  MessageCreate → handlers.get('claude') → sendClaudeMessages → guild channel ← 問題在這
  
DM 路徑（正確）：
  MessageCreate → sendToClaudeCode 直接呼叫 → DM channel sender → DM 視窗
```

**修復**：為 DM 建立獨立路徑 `runClaudeForDM()`，直接呼叫 `sendToClaudeCode`，輸出用 `DiscordSender` wrapping DM channel：

```ts
const dmDiscordSender: DiscordSender = {
  async sendMessage(content) {
    await channel.send(convertMessageContent(content));
  }
};
const dmSender = createClaudeSender(dmDiscordSender);

const result = await sendToClaudeCode(
  workDir, prompt, controller, sessionId,
  undefined,
  (jsonData) => {
    const msgs = convertToClaudeMessages(jsonData);
    if (msgs.length > 0) dmSender(msgs).catch(() => {});
  },
  false,
);
```

---

### 6. Typing Indicator 不停

**症狀**：Claude 回應後，DM 視窗仍持續顯示 typing indicator。

**原因**：Typing loop 每 8 秒才檢查一次 `done` flag，加上 Discord 本身 typing 動畫會持續 10 秒，所以完成後最長出現 18 秒延遲。

**修復**：改為每 1 秒檢查一次：
```ts
for (let i = 0; i < 8; i++) {
  if (done) return;
  await new Promise(r => setTimeout(r, 1000));
}
```

---

### 7. DM 安全性（任何人都能觸發）

**解法**：從 `.env` 讀取 `USER_ID`，DM handler 只允許該 user 觸發：
```ts
if (allowedUserId && message.author.id !== allowedUserId) return;
```

---

### 8. DM Channel Partial

**症狀**：DM channel 啟用 `Partials.Channel` 後，`channel.send()` 可能失敗。

**修復**：在 DM handler 裡先 fetch partial channel：
```ts
if ((message.channel as any).partial) {
  try { await message.channel.fetch(); } catch { return; }
}
```

---

## 最終設定

### .env
```
DISCORD_TOKEN=...
APPLICATION_ID=...
WORK_DIR=/Users/clawdbot520
USER_ID=YOUR_USER_ID            ← 限制 DM 存取
CATEGORY_NAME=claude-code
CHANNEL_ID=YOUR_CHANNEL_ID     ← 固定 guild channel
```

### 啟動方式
```bash
cd ~/claude-code-discord
nohup deno run --allow-all index.ts > /tmp/discord-bot.log 2>&1 &
```

### 查看 log
```bash
tail -f /tmp/discord-bot.log
```

---

## 架構圖（最終）

```
Discord Guild Channel
  用戶輸入 → MessageCreate → runClaudeOnChannel
                               → handlers.get('claude').execute(ctx)
                               → createThreadSender → guild thread（輸出在這）

Discord DM
  用戶輸入 → MessageCreate → USER_ID 驗證 → runClaudeForDM
                               → sendToClaudeCode 直接呼叫
                               → DM channel sender（輸出直接在 DM）
```

---

## 相關 Backlog

- **TASK-00012**：Discord Bot 速度優化（移除 subprocess 冷啟動）
  - 方向：Warm subprocess pool / 真正 streaming / Typing indicator 已完成

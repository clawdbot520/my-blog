---
title: P3 - 想知道 OpenClaw 在背著你八卦什麼？Agent Monitor Board 告訴你
date: 2026-02-22
tags:
  - 案例
  - OpenClaw
  - ClaudeCode
  - Project
  - 專案
publish: true
prompt: A futuristic command center with multiple screens showing AI agent conversations and thinking processes. Like Mission Control for AI, cyberpunk dashboard, blue and green data visualization
---

![[Pasted image 20260226230846.png]]

---

> [!info] 概述
> 建立一個 Agent Monitor Board，像通訊軟體的介面，即時監看 AI Agent 的行動與思考過程。

![[Screenshot 2026-02-22 at 3.21.05 PM 3.png]]

---

## 什麼是 Agent Monitor Board？

一個像通訊軟體的介面，可以看到：

| 功能 | 說明 |
|------|------|
| 所有 AI Agent 的行動 | 了解所有 Agent 的狀態和進度 |
| 背後的思考過程 | 了解 AI 怎麼分解任務、怎麼推理 |

---

## 為什麼需要？

> [!warning] 痛點
> AI 只會給你最後結果，中間的思考過程不會揭露。有時做很久，會想知道：他在幹嘛？卡住了嗎？做到哪了？

> [!tip] 解決方案
> 建立一個面板，點擊 Agent 看它在執行什麼 Session、進度到哪了。

---

## 怎麼提需求？

> [!example] 一句話總結
> 說清楚四件事：
> 1. **資料格式**（格式 + 路徑 + 範例）
> 2. **畫面長相**（ASCII 草圖 + 參考圖）
> 3. **功能**（逐條列出）
> 4. **平台**（web / Electron / 行動裝置）

> [!tip] 補充
> 顏色、間距這類細節可以最後再調整。

---

### 需求關鍵要素

#### 1. 一句話定義產品

> [!example] 範例
> 「一個 macOS 桌面 app，可以像 Telegram 一樣瀏覽 AI agent 的對話記錄」

這決定平台、UI 風格、使用情境。

---

#### 2. 版面配置

用 ASCII 畫出來：

```
┌────────────────────────────────────┐
│  [紅黃綠]    titlebar (可拖移)    [🔍💡↺⚙] │
├────┬────┬──────────────────────────┤
│ Agents│Sessions│   Log (chat bubbles)│
│ (列表)│ (列表) │                    │
└────┴────┴──────────────────────────┘
```

> [!note] 風格描述
> macOS 深色主題，像 Telegram，titlebar 稍淡，面板偏深，icon 按鈕無邊框。

如果有參考圖片，直接附上最有效。

---

#### 3. 功能清單

> [!abstract] 功能列表
> - 三欄 layout，欄寬可拖拉，記住寬度
> - 支援兩個 source：OpenClaw（sessions/）和 Claude Code（.jsonl）
> - 右上角切換 source 按鈕
> - Thinking 內容預設隱藏，可 toggle 顯示
> - 全文搜尋，符合文字 highlight
> - 設定存 localStorage
> - Hover 按鈕 1 秒後顯示 tooltip

---

## 成品展示

![[Screenshot 2026-02-22 at 3.21.05 PM.png]]

> [!tip] GitHub
> 專案網址：https://github.com/clawdbot520/agent-monitor

---


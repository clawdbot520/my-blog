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

<!-- Nano Banana Prompt: A futuristic command center with multiple screens showing AI agent conversations and thinking processes. Like Mission Control for AI, cyberpunk dashboard, blue and green data visualization -->
---
![[Pasted image 20260226230846.png]]

> [!info] 概述
> 本文記錄如何透過 OpenClaw 建立一個 Agent Monitor Board，一個像通訊軟體的介面，可以即時監看 AI Agent 的行動與思考過程。適合需要管理多個 AI Agent 的開發者。


![[Screenshot 2026-02-22 at 3.21.05 PM 3.png]]## 什麼是 Agent Monitor Board

一個像是通訊軟體的介面，可以看到：

1. **所有 AI Agent 的行動**
   - 讓自己可以更清楚了解所有 AI Agent 的狀態和進度

2. **他背後的思考（心理 OS）**
   - 了解背後的思考過程，幫助自己很好地了解怎麼把任務交代好

## 為什麼需要 Agent Monitor Board

> [!abstract] 問題背景
> 當任務變多變複雜，做事的 AI Agent 一多，管理的問題就來了。人類的世界也是這樣 — 各 Agent 進度如何、怎麼同步溝通、誰遇到問題卡住了需要幫忙。

> [!warning] 痛點
> AI 只會給你最後的結果，其實中間有很多他思考的過程和 breakdown 的步驟，這些都不會揭露來，只存在在後台的紀錄。有時候他一件事情做很久，就會一直在想他到底在幹嘛、是不是卡住了、做到哪個步驟了、是不是遇到問題，或是哪邊我沒有說清楚，就會想關心一下。

> [!tip] 解決方案
> 建立一個像通訊軟體一樣的面板，可以點擊相對應的 AI Agent 看他下面有什麼 Sessions（任務），就可以知道他背後怎麼 Agent 之間的通訊，個別任務的進度做到哪了，就會比較安心。

## 如何提需求

> [!example] 一句話總結
> 你只需要說清楚四件事：
> 1. **資料長什麼樣**（格式 + 路徑 + 範例）
> 2. **畫面長什麼樣**（ASCII 草圖 + 參考圖）
> 3. **要什麼功能**（逐條列出，不要省略細節）
> 4. **要跑在哪裡**（web / Electron / 哪個平台）
>
> 其他像顏色微調、間距大小這類細節，可以在看到成品後再調整，不需要一開始就說清楚。

### 需求說明的關鍵要素

#### 1. 一句話定義產品

_「一個 macOS 桌面 app，可以像 Telegram 一樣瀏覽 AI agent 的對話記錄」_

這決定整個方向，包含平台、UI 風格、使用情境。

---

#### 2. 版面配置（畫草圖最有效）

用 ASCII 畫出來：

┌────────────────────────────────────┐
 │  [紅黃綠]                                                                       titlebar (可拖移)     [🔍💡↺⚙] │
├────┬────┬──────────────────────────┤
 │  Agents     │  Sessions │                             Log (chat bubbles)                                       │
 │  (列表)       │  (列表)      │                                                                                                     │
 │                   │                   │                                                                                                     │
└────┴────┴──────────────────────────┘

> [!note] 風格描述
> _「macOS 深色主題，像 Telegram，titlebar 稍淡，面板偏深，icon 按鈕無邊框，直接嵌在背景上」_

如果有參考圖片（像 Telegram 截圖），直接附上是最有效的。

#### 3. 功能清單（逐條列出）

> [!abstract] 功能列表
> - 三欄 layout，欄寬可拖拉，記住寬度
> - 支援兩個 source：OpenClaw（sessions/ 子目錄）和 Claude Code（.jsonl 直接在 project 目錄）
> - 右上角切換 source 按鈕，顯示目前 source 的 logo icon
> - Thinking 內容預設隱藏，可 toggle 顯示
> - 全文搜尋，符合的文字 highlight
> - 所有設定（路徑、欄寬）存 localStorage
> - Hover 按鈕 1 秒後顯示 tooltip

---


## 成品展示

![[Screenshot 2026-02-22 at 3.21.05 PM.png]]

> [!tip] GitHub
> 專案網址：https://github.com/clawdbot520/agent-monitor

---


## 相關筆記

[[怎麼透過 OpenClaw 創立新的 Agent 和 Telegram 群組]]

---


## 相關文章

[[P5|下一篇：NotebookLM 知識庫 →]]


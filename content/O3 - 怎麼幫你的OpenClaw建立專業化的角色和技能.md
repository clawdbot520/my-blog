---
title: O3 - 怎麼幫你的 OpenClaw 建立專業化的角色和技能
date: 2026-02-22
tags:
  - OpenClaw
publish: true
prompt: A robot character coming to life with gears and brain circuits glowing. The robot has a friendly face and is wearing a customized outfit. Warm colors, magical realism style
---

![[Pasted image 20260226223001.png]]

> [!info] 一句話總結
> 這就是 system prompt 的解構和記憶，讓 agent 有「人格」，有「記憶」，有「學習能力」。

---

## 為什麼要設定角色？

以前用 AI，一開始都要先跟它定義角色、說明使用場景、說明你是誰。這樣 AI 才能根據設定的條件邊界來精準回答問題。

OpenClaw 有幾個重要文件可以配置，就是 system prompt 的拆解：

| 檔案 | 用途 |
|------|------|
| SOUL.md | 定義 AI 的人格、價值觀、行為準則、說話風格 |
| AGENTS.md | 工作模式、操作指令、工作流程、工具使用原則 |
| IDENTITY.md | AI 的名字、emoji、avatar |
| USER.md | 使用者資訊（名字、偏好、timezone） |

> [!tip] 設定好處處
> 以後一上來就直接交代需求，它知道所有背景知識，用起來更高效。隨著使用還可以更新迭代，讓它更專業。

---

## 可以多有趣？

你可以自己設計 SOUL.md，讓它用你想要的語氣跟你對話：

- 脫口秀主持人：幽默好笑
- 工程師：嚴謹有邏輯
- 槓精：質疑你的一切
- 聽話的小貓：順從

> [!example] 參考來源
> [openclaw-agents](https://github.com/will-assistant/openclaw-agents) 裡面有很多可以參考的配置。

---

## Agent Monitor Board

如果不想自己設定，這裡有一個開源工具可以直接使用：

📎 [Agent Monitor Board](https://github.com/clawdbot520/agent-monitor)

![[Screenshot 2026-02-25 at 6.36.27 PM.png]]

### 支援的角色類型

| 類別 | 角色 |
|------|------|
| 程式開發 | 程式夥伴、快速交付 (TDD)、除錯專家、程式審查、QA 測試工程師 |
| 設計與產品 | UI/UX 設計師、產品經理 |
| 研究與資料 | 研究助手、資料分析師、學術研究員 |
| 寫作與溝通 | 內容寫作、技術文件寫作、行銷策略師、會議助手、社群媒體管理、客服專員 |
| 運維與安全 | DevOps 助手、資安審計、OpenClaw 設定 |
| 學習與生產力 | 學習教練、導師、個人財務追蹤 |

---

## 相關連結

[[O4 - Openclaw 如何從錯誤中自我學習，越用越聰明|下一篇：O4 - Openclaw 如何從錯誤中自我學習，越用越聰明]]

---

title: O3 - 怎麼幫你的 OpenClaw 建立專業化的角色和技能
description: 教你如何為 OpenClaw 建立專業化的角色和技能
date: 2026-02-22
tags:
  - OpenClaw
status: published
publish: true

<!-- Nano Banana Prompt: A robot character coming to life with gears and brain circuits glowing. The robot has a friendly face and is wearing a customized outfit. Warm colors, magical realism style -->
---
![[Pasted image 20260226223001.png]]
我自己的理解，一句話總結，這個就是system prompt的解構和記憶．
讓 agent 有「人格」，有「記憶」，有「學習能力」，而不是每次都從頭開始的 chatbot
以前用AI，一開始都要先跟他定義他的角色，說明你的使用場景，說明你是誰．這樣AI才能根據你設定的條件邊界來精準的回答你的問題．

openclaw 有幾個重要文件可以配置，就是system prompt的拆解．
1. SOUL.md 
	1. 定義AI的人格、價值觀、行为准则 、說話風格
2. AGENTS.md 
	1. 工作模式，操作指令、工作流程、工具使用原則
3. IDENTITY.md
	1. AI的名字、emoji、avatar  
4. USER.md 
	1. 使用者资讯（名字、偏好、timezone） 

設定好了這些，以後一上來就直接交代需求就好，他就知道他所需要知道的一切背景知識，用起來就可高效．然後隨著使用還可以更新迭代你這些檔案，讓他更專業．更能給出你想要的答案．

除了剛說的有用，還有有趣． 你可以自己設計soul.md，讓他可以用你想要的語氣跟你對話．可以是像脫口秀主持人幽默好笑，可以像工程師嚴謹有邏輯，可以像槓精質疑你的一切，也可以像聽話的小貓順從。可以根據自己的喜好和需求來配置．

以下來源裡面有很多可以參考的配置，可以把openclaw塑造成你喜歡的樣子．
https://github.com/will-assistant/openclaw-agents


如果不想這麼麻煩的話，我寫了一個APP 叫 agent monitor board ，開源的歡迎自行取用
https://github.com/clawdbot520/agent-monitor
直接在裡面添加就可以
![[Screenshot 2026-02-25 at 6.36.27 PM.png]]
                                                                            
1. 程式開發
	1. 程式夥伴   
	2. 快速交付 (TDD) 
	3. 除錯專家
	4. 程式審查 — 嚴格版
	5. 程式審查 — 情境版
	6. QA 測試工程師 
2. 設計與產品
	1. UI/UX 設計師 
	2. 產品經理  
3. 研究與資料 
	1. 研究助手  
	2. 資料分析師 
	3. 學術研究員 
4. 寫作與溝通
	1. 內容寫作     
	2. 技術文件寫作 
	3. 行銷策略師   
	4. 會議助手     
	5. 社群媒體管理 
	6. 客服專員     
5. 運維與安全
	1. DevOps 助手   
	2. 資安審計      
	3. OpenClaw 設定 
6. 學習與生產力
	1. 學習教練     
	2. 導師         
	3. 個人財務追蹤 

---


## 相關文章

[[O4|下一篇：自建 AI 模型 →]]


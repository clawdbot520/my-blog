---
title: O2 - 為什麼是OpenClaw? 怎麼建立的環境
date: 2026-02-21
tags:
  - OpenClaw
  - 教學
  - 環境建置
publish: true
prompt: A sleek Mac Mini on a modern desk, surrounded by connection lines and icons of Telegram, API keys, and cloud services. Clean tech aesthetic, blue and white color scheme
---
![[Pasted image 20260226222752.png]]

> [!info] 概述
> ## 🤖 OpenClaw 是什麼？

平常大家用的AI主要都是在對話窗的使用，問問題，或是拿來寫程式。

今天有了OpenClaw 就像是幫這個機器人裝上了「手、腳和眼睛」，讓它不只能說話，還能走出屋子幫你完成任務，能操控你電腦中的一切事物，就像你在使用電腦一樣。這聽起來很厲害，但是反過來也很危險，如果AI理解錯你的意思，做了一些不可挽回的事情，那就很麻煩，甚至很危險．所以還是要小心謹慎，勁量不要部署在你本來就存放很多重要東西的電腦上，找一個新的獨立的家來養龍蝦．

---


### 🌟 它在做什麼？（三大特異功能）

1. **自動跑腿（自動化）：** 你只要說：「幫我找今天最酷的 3 則 AI 新聞，並寫成筆記」，它就會自己打開網頁、閱讀文章，然後把重點寫好給你，你完全不用動手。
    
2. **聰明的管理員（排版與整理）：** 它可以幫你把電腦亂七八糟的檔案整理得整整齊齊。它知道哪裡該放標題、哪裡該畫重點，就像一個最厲害的班長。
    
3. **超級大腦的延伸（開源工具）：** 因為它是「開源」的，代表全世界的聰明工程師都在幫它變強。它能連接各種不同的 AI（像是 Claude 或 Gemini），讓機器人變得越來越聰明。
    

---


### 💡 總結一句話：

**OpenClaw 就是一個能聽懂你的話，並自動幫你在電腦上「做事、寫字、查資料」的 AI 小管家！**
所以接下來就是要教大家怎麼讓ＡＩ走出房間，到外面可以幫你做事．將帶你從零開始建立 OpenClaw 環境，包括硬體準備、帳號申請、軟體安裝與設定。

## 1. 準備硬體

> [!abstract] 推薦設備
> Mac Mini M4 是最推薦的選擇，兼具效能與性價比。

很多人推薦 Mac Mini M4 作為 Home Lab 的主機，是一個非常均衡且划算的選擇。
當然後面還有很多更小的openclaw版本可以跑在硬體需求更低的機器上，今天就先專注在大家最推薦的平台吧．

## 2. 申請 Apple 帳號

Mac mini 開機時會引導你完成設定，按照指示操作即可。

## 3. 申請 Google 帳號

> [!tip] 建議
> 統一使用同一個 Google 帳號註冊各種服務，可以省去許多輸入個資的麻煩。參考https://www.google.com/

日後會有很多工具需要註冊，例如 Vercel、Cloudflare 等，使用同一個帳號可以一鍵登入。

## 4. 申請通訊軟體帳號

> [!note] 通訊方式說明
> - **TUI (文字介面)**：最簡單的溝通方式，適合初學者
> - **通訊軟體 (Telegram/Signal)**：更方便但需要額外設定

一開始建議先使用本地端 TUI 與 OpenClaw 溝通，因為打通通訊軟體可能需要一些額外設定。可以等TUI起來之後讓openclaw 幫你．

## 5. 註冊大語言模型 (LLM)

> [!warning] 費用注意
> - API Key 方案：用多少 token 付多少錢
> - 月費方案 (OAuth)：固定時間內有 token 限制

常見選擇：
- GPT
- Claude
- Gemini
- MiniMax

註冊完成後記得取得 API Key，一開始可以先用免費額度。

## 6. 下載和安裝 OpenClaw

參考 [官方文檔](https://platform.minimax.io/docs/solutions/moltbot)。

> [!tip] 安裝重點
> 取得 API Key 後，運行 `openclaw tui` 即可開始與 AI 溝通。

## 7. 設定 OpenClaw

```bash
# 進入設定
openclaw config

# 重啟服務
openclaw gateway restart
```

## 8. 重置為原廠設定

如果想要重新來過：

```bash
# 重置 OpenClaw
openclaw reset

# 重新安裝精靈
openclaw onboard --install-daemon
```
但千萬不要這樣做，我就是因爲這樣才被逼的從０開始的，也因為自己犯了白痴的錯誤，所以才有素材可以從０開始寫筆記．


---


## 相關文章

[[O3 - 怎麼幫你的OpenClaw建立專業化的角色和技能|下一篇：O3 - 怎麼幫你的OpenClaw建立專業化的角色和技能]]


---
title: P8 - 怎麼打通Openclaw 和 ClaudeCode 的雙相記憶共享
date: 2026-03-01
tags:
  - OpenClaw
  - 記憶
  - 自動化
  - ClaudeCode
  - 案例
publish: true
prompt: Two AI robots shaking hands, sharing brain waves, digital memory data flowing between them, neural network connection, blue and orange colors, futuristic tech
---
![[Pasted image 20260301203811.png]]

> [!info] 概述
> 打通 OpenClaw 與 Claude Code 的雙向記憶共享，讓兩個 AI 系統可以互相存取對方的記憶。

---

## 啟發
昨天看到一個youtuber "AI 超元域" 在介紹Lancedb pro 的插件，對我openclaw記憶系統有提升，減少了他失憶和增強他記憶的功能。 他的Github 連結在下面 https://github.com/win4r/memory-lancedb-pro ，可以自行參考。強烈跟大家推薦閱讀。

我自己同時也在用Claude Code，所以我就在想可不可以把我在Claude Code 的記憶，也跟OpenClaw 共享，這樣兩邊的學到的東西就可以打通，大家的經驗可以互相分享。於是我就做了一個基於Lancede Pro插件的patch，可以達到這個目標。

## 特點
1. openclaw可學習claudecode的記憶：在input直接查詢添加context。
2. 不需要額外開發：Claude code 可以直接利用openclaw  lacedb pro 插件的CLI。
3. 極低的延遲：calude code 結束時只做symlink，不需額外的寫入。


## 目標

| 方向 | 說明 |
|------|------|
| OpenClaw → Claude Code | 讓 Claude Code 可以存取 OpenClaw 的記憶 |
| Claude Code → OpenClaw | 讓 OpenClaw 可以存取 Claude Code 的記憶 |

 ## 流程
### 1. 訊息發送時（召回記憶）

**settings.json** 設定了兩個 hook 事件：                                                                                    
	UserPromptSubmit → memory-recall.sh   ← 你按下送出時觸發 
	Stop             → on-stop.sh         ← 我回答完畢時觸發
  
在 user 發送消息後，會觸發一個 memeory-recall.sh，去搜尋用戶在openclaw記憶中相關的資訊，然後注入到上下文中。這樣ClaudeCode在思考的時候，就會帶有更多訊息幫助判斷。
```
  **觸發流程：**
  User 送出訊息
      ↓
  Claude Code 把訊息 JSON 用 stdin 傳給 memory-recall.sh
      ↓
  .sh 讀 stdin → 取出 .prompt 欄位（你打的字）
      ↓
  openclaw memory-pro search "你的問題" --limit 5
      ↓
  .sh 把結果印到 stdout（包在 <memory_recall>...</memory_recall>）
      ↓
  Claude Code 把 stdout 內容注入到我的上下文
```

### 2. 對話結束時（同步記憶）
對話結束的時候會觸發一個hook，把本次的對話內容同步到OpenClaw的資料夾中，這樣OpenClaw在蒸餾記憶得時候會一併把ClaudeCode的記憶，一併做處理。

這邊有一個hack，也就是這個Skill最核心的地方，就是他不需要
```
對話結束
    ↓
on-stop.sh    symlink Claude code session info to ~/.openclaw/agents/*/sessions/
    ↓
自動存入 LanceDB Pro
```

---

### 3. 順著Openclaw 的Cron 來蒸餾記憶

```
OpenClaw sessions（~/.openclaw/agents/*/sessions/）
        ↓
   hourly cron 增量蒸餾
        ↓
   LanceDB Pro (global scope)
```

這邊有一個問題claude code 的sessions 格式和openclaw 並不相容，jsonl_distill.py 只處理 message type，其他格式會被跳過。
所以蒸餾時擷取sessions 的時候需要修改一下。

**在jsonl_distill.py line 312 把：
```python
if obj.get("type") != "message":
    continue
```
改成：
```python
if obj.get("type") not in ("message", "user", "assistant"):
    continue
```

這樣 Claude Code 格式的行也能被解析。

---

## 檔案對照表

| 檔案                               | 功能                                |
| -------------------------------- | --------------------------------- |
| ~/.claude/hooks/memory-recall.sh | input — UserPromptSubmit hook     |
| ~/.claude/hooks/on-stop.sh       | hook— TUI branch 新增記憶捕獲           |
| ~/.claude/settings.json          | config - 加入 UserPromptSubmit hook |

---

### 環境需求

| 需求 | 狀態 |
|------|------|
| openclaw CLI 在 PATH | ✅ 已有 |
| JINA_API_KEY 環境變數 | ✅ 已設 |
| hooks 設定好 | ✅ 已做 |


---


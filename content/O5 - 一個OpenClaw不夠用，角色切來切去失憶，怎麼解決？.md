---

title: O5 - 一個 OpenClaw 不夠用，角色切來切去失憶，怎麼解決？
date: 2026-02-22
tags:
  - OpenClaw
publish: true

<!-- Nano Banana Prompt: A robot reading books and making notes, with light bulbs appearing above its head. Trees growing from books symbolizing growth. Warm learning atmosphere, orange and yellow tones -->
---
![[Pasted image 20260226223340.png]]


1. 什麼時候需要這個功能
	1. 當你有多個任務需要處理，你想要並行處理
	2. 當你有多種任務需要處理，不同的agent 記憶和能力不一樣，可以更好的定義專人做專事
2. 跟openclaw 說
	1. 幫我建立一個新的agent 叫做leader，可以透過telegram 跟agent 溝通，先和你用一樣的模型，binding  到group -100xxxxxxxxxx．
	2. 也可以順便定義他的角色，這樣他一上來就會進入狀況，你可以這樣說，他角色是領導，負責溝通協調他底下的developer, tester, reviewer，幫我寫到他的agents.md, soul.md, identity.md
	3. 或是你也可以等agent部署好了，再到他專用的頻道告訴他．
3. 需要的資訊是 telegram group id，步驟是
	1. 創建一個群組![[Screenshot 2026-02-21 at 2.12.53 PM.png]]
	2. 搜尋你的bot 名稱，把你的bot 加進去
	3. 點擊右上角的edit 把你的bot 設定成admin![[Screenshot 2026-02-21 at 2.15.07 PM.png]]
	4. 搜尋userinfo 然後加入他                            ![[Screenshot 2026-02-21 at 2.16.36 PM.png]]
	5. 加入之後再跟他的對話匡詢問問 group id       ![[Screenshot 2026-02-21 at 2.18.07 PM.png]]
4. 以我自己的經驗來說，openclaw 沒有辦法第一次就做對，所以你需要自己去檢查 openclaw.json 裡面的兩個地方
	1. channels.telegram.groups (Channel)
``` typescript
"groups": {
	"-100xxxxxxxxxx": {
	"enabled": true
}
```
	2. bindings.match (Binding)
``` typescript
"match": {
	"channel": "telegram",
	"peer": {
	"kind": "group",
	"id": "-100xxxxxxxxxx"
	}
}
```
4. 然後你在群組跟他說話，他會跟你說要pairing然後給你一個code，執行一下，下面那一段就好
```bash
openclaw pairing approve telegram JBTDB2A6
``` 
5. 裡面＠他，他就會跟你說話了．但是如果你沒有＠他是會看不到的．這個是要做agent 隔離用的，如果你要群聊，要去設定裡面把mentions拿掉．
```typyscript
"channels": {
	"telegram": {
		"enabled": true,
		"dmPolicy": "pairing",
		"groupPolicy": "open",   //這裡要從預設值 allowlist -> open
```


進階設定

1. 2 個bot，可以分開聊
	1. 照前面的步驟多開一個bot
	2. 修改openclaw.json
```typescript
...

"agents": {
	"list": [
		{
			"id": "main"
		},
		//此處要添加第二個agent 
		{
			"id": "main_bak"
		},

"bindings": [
	{
		"match": {
		"channel": "telegram",
		"accountId": "bot_primary"
		},
		"agentId": "main"
	},
	//此處要binding第二個agent 
	{
		"match": {
		"channel": "telegram",
		"accountId": "bot_secondary"
		},
		"agentId": "main_bak"
	},

...

"channels": {
	"telegram": {
		"enabled": true,
		"dmPolicy": "pairing",
		"groupPolicy": "open",
		"streamMode": "partial",
		"accounts": {
			"bot_primary": {
				"botToken": "your-bot_token primary",
			},
			// 添加第二個bot account
			"bot_secondary": {
				"botToken": "your-bot_token secondary",
			}
		},
		
...
```
1. 2 個bot，可以群聊
```typescript

	"accounts": {
		"bot_primary": {
			"botToken": "your-bot_token primary",
			// 添加你要加入的群組
			"groups": {
				"-100xxxxxxxxxx": {
					"requireMention": false,
					"enabled": true
				}
			}
		},
		"bot_secondary": {
			"botToken": "your-bot_token secondary",
			// 添加你要加入的群組
			"groups": {
				"-100xxxxxxxxxx": {
					"requireMention": false,
					"enabled": true
				}
			}
		}
	},
```
1. 1個bot，多個agents一起聊
	1. 只有whatapp支援，telegram 不支援，這邊就不演示了
---


## 相關文章

[[O7|下一篇：Claude Code 接入 →]]


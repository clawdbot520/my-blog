---
title: Note1：怎麼建立OpenClaw的環境
publish: true
tags:
---
但是
1. 準備一個硬體，
	1. 之前是看到很多人都推薦Mac Mini４是一個很平衡又划算的選擇，所以我就用這個主機當作示範
2. 申請一個新的Apple帳號，
	1. Mac mini在開機的時候會引導你就照著指示做就可以
3. 申請一個Google帳號，
	1. 到時候會有很多工具需要註冊你都可以用這個Google帳號一鍵註冊，可以省去很多key in的麻煩
4. 申請一個通訊軟體的帳號
	1. 到時候你會透過通訊軟體請AI做事。一開始是比較推薦在本地端用TUI來和小龍蝦溝通會比較簡單，
	2. 因為要打通通訊軟體，有時候會遇到一些麻煩還是需要先打通本地端，
	3. 而且再透過通訊軟體轉一層也比較慢，不過很方便
5. 註冊一個大語言模型  
	1. gpt, claude, gemini, minimax這些都可以
	2. 註冊完了之後去取得 API KEY
	3. 一開始可以先用免費的等到OpenClaw告訴你你的流量限制了你就可以考慮付費了
6. 下載和安裝Open claw
	1. https://platform.minimax.io/docs/solutions/moltbot 這個網頁說得很清楚，可以直接參考
	2. 最重要就是大語言模型選好了之後就可以直接用TUI跟他溝通了 openclaw tui
7. 改OpenClaw的設定
	1. openclaw config
	2. openclaw gateway restart
8. 回到原廠設定
	1. 如果你也想嘗試重新再來一次，你也可以試試
	2. openclaw reset
	3. openclaw onboard --install-daemon
9. 付費模型
	1. 通常有兩種付費模式
		1. API Key:  用多少token算多少錢．
		2. 月費方案 Oauth，但每天或者是固定的時間內有Token的限制。
---
title: O6 - 怎麼把強大的 Claude Code 接到 OpenClaw 上
description: 將強大的 Claude Code 整合到 OpenClaw
date: 2026-02-22
tags:
  - OpenClaw
status: published
publish: false
---
![[Pasted image 20260226224717.png]]



## 目標                                                                                                                                                       

   Claude Code 每次執行完後，自動發 Telegram 訊息通知結果                                                                                                        

   ## 現狀                                                                                                                                                       

   - 有 Claude Code（本地 CLI）                                                                                                                                  

   - 有 OpenClaw（Telegram 已連線）                                                                                                                              

   - 兩者目前獨立運作                                                                                                                                            

   ## 需求                                                                                                                                                       

   1. 當 Claude Code 執行結束時觸發 hook                                                                                                                         

   2. 讀取任務輸出（task名稱 + 結果摘要）                                                                                                                        

   3. 發送到我的 Telegram（chatId: 7683093090）                                                                                                                  

   4. 訊息格式：task 名稱 + 狀態（成功/失敗）+ 結果                                                                                                              

   ## 驗收標準                                                                                                                                                   

   - 手動執行 claude code task → 收到 Telegram 通知
---


## 相關文章

[[index|← 返回首頁]]


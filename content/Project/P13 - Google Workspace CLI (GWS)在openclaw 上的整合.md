---
title: P13 - Google Workspace CLI (GWS) 在 OpenClaw 上的整合
date: 2026-03-09
tags:
  - GoogleWorkspace
  - GWS
  - OpenClaw
  - 自動化
  - CLI
  - 案例
publish: true
prompt: Terminal command line interface with Google Workspace logos, automation gears, blue Google colors and orange OpenClaw colors, futuristic productivity dashboard
---
![[Pasted image 20260312142124.png]]
這份筆記記錄了在協助使用者整合 `gws` (Google Workspace CLI) 過程中遇到的挑戰、除錯流程以及最終的解決方案。這對於未來重新設定或擴充功能（如 Drive, Sheets）具有極高的參考價值。

## 📋 專案背景
- **工具**: `gws` (v0.8.1)
- **環境**: MacOS, Node.js v22.22.0
- **目標**: 透過 CLI 自動化存取 Google Calendar 與 Gmail。

---

## 🚀 成功路徑 (Best Practice)

若要重新設定，請依序執行以下步驟：

### 1. 基礎環境準備
1. **安裝 gws**: `npm install -g @googleworkspace/cli`
2. **安裝 gcloud SDK**: `brew install --cask google-cloud-sdk` (用於自動化專案管理)。

### 2. Google Cloud 控制台設定 (手動關鍵點)
這是最容易採坑的地方，必須手動完成：
1. **建立專案**: 在 [Google Cloud Console](https://console.cloud.google.com/) 建立新專案。
2. **啟動 API**: 
   - 搜尋並啟用 **Google Calendar API**。
   - 搜尋並啟用 **Gmail API**。
3. **設定 OAuth 同意畫面 (Consent Screen)**:
   - 類型選「外部 (External)」。
   - **重要**: 在「測試使用者 (Test users)」中加入自己的 Gmail。
4. **建立憑證**: 建立「OAuth 用戶端 ID」，類型選「電腦應用程式 (Desktop app)」。取得 **Client ID** 與 **Client Secret**。

### 3. 本地端連結
1. **存入憑證**: 將 JSON 存至 `~/.config/gws/client_secret.json`。
2. **發起登入**: `gws auth login -s calendar,gmail.modify --force-consent`。

---

## ⚠️ 遇到的困難與解決方案 (採坑紀錄)

### 1. 權限勾選框 (Checkbox) 消失
- **現象**: 雖然點擊授權連結成功，但 `gws` 執行時報錯 `insufficientPermissions`。
- **原因**: 
  - Google 記住了舊的授權決定，沒有彈出權限勾選清單。
  - **API 服務未啟用**：如果專案端沒開 API，授權頁面會直接隱藏該權限，導致使用者「無處可勾」。
- **對策**: 
  - 使用 `--force-consent` 參數強迫 Google 重新顯示授權頁。
  - **撤銷舊連結**: 到 [Google Safety](https://myaccount.google.com/connections) 徹底刪除該應用程式的存取權。

### 2. 瀏覽器跳轉失敗 (Localhost Refused)
- **現象**: 點完同意後，網頁顯示 `ERR_CONNECTION_REFUSED`。
- **原因**: `gws` 在本地開啟的臨時監聽 Server 因為等待太久而超時關閉。
- **對策**: 產生連結後需在 1-2 分鐘內完成網頁操作；若失敗，需重新執行 `gws auth login` 獲取新連結。

### 3. API 啟用延遲與 403 錯誤
- **現象**: 指令明明下對了，卻顯示 `PERMISSION_DENIED`。
- **原因**: 專案 API 剛啟用時，可能需要 1-3 分鐘才會全域生效。
- **對策**: 稍微等待，或使用 `gcloud services enable` 指令確認狀態。

---

## 🛠️ 實用指令集

| 功能 | 指令 |
| :--- | :--- |
| 查看日曆行程 | `gws calendar +agenda` |
| 查看未讀郵件 | `gws gmail +triage` |
| 強制重新授權 | `gws auth login -s calendar,gmail --force-consent` |
| 匯出憑證 (備份用) | `gws auth export --unmasked > credentials.json` |

---

## 📝 總結心得
AI 代理與 Google 服務的整合，最大的難關不在於代碼，而是在於 **OAuth 的安全性限制**。這份整合得來不易，主因是我們克服了「看不到勾勾」的快取問題。未來若要增加新功能（如 Drive），請務必先去 [Google Library](https://console.cloud.google.com/apis/library) 點擊啟用，否則授權頁面會再次出現「消失的勾勾」。

---
*記錄日期: 2026-03-09*
*執行代理: Antigravity*

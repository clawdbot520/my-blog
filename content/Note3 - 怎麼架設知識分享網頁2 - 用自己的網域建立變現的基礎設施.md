---
title: Note3 - 怎麼架設知識分享網頁2 - 用自己的網域建立變現的基礎設施
publish: true
date: 2026-02-20
tags:
  - 變現
  - vercel
  - cloudflare
  - 架網頁
---
## 🛠 Vercel + Cloudflare 協作筆記

這套架構的核心在於：**Vercel 負責「住」（存儲與運算），Cloudflare 負責「門面與安全」（網域與防護）。**

### 一、 為什麼要同時用這兩個？

- **Vercel**：對 React、Quartz (Next.js/Node.js) 支援度最高，部署速度極快，且自動生成 SSL 憑證。
- **Cloudflare**：全球最強的 DNS 解析、阻斷攻擊 (DDoS)、以及更靈活的網域管理功能。
- **Vercel (網站主體)** 與 **Cloudflare (網域與安全)** 的純粹對接流程。這也是目前效能最優、設定最專業的架構。

---

### 二、 核心設定步驟：從網域到上線

### 1. 網域購買與身分驗證 

在 Cloudflare  https://www.cloudflare.com/ 搜尋你喜歡的網域名稱並刷卡買下，便宜的一年５～１５都有，我是買最便宜４塊的玩一玩，最重要的動作是**驗證信箱**。

- **動作：** 檢查你的 Email，會有一封來自 Cloudflare 的 **ICANN 驗證郵件**。
- **後果：** 如果在 14 天內沒點擊驗證連結，網域會被「註冊商鎖定」(ClientHold)，導致全世界都搜不到你的網站。

### ２. 註冊Vercel和獲得ＤＮＳ設定
https://vercel.com 網頁
這一步最坑，我在這邊花了很多時間，要先在Domaina 裡面搜尋剛剛你在clouldflare 註冊的網域，然後Add Existing．然後他會顯示三欄．
第三個最簡單，直接就是你github page 的內容，vercel 免費給你使用的．
前面兩個就是你剛剛買的網域，一個不帶www.一個帶www.前綴．
點右邊的Edit，會顯示以下內容，每個人都不一樣，但是格式都一樣．這個要記住，等等設定couldflare要用到．

| **紀錄類型 (Type)** | **名稱 (Name)** | **內容 (Content)** | **Proxy 狀態 (小雲端)** |
| --------------- | ------------- | ---------------- | ------------------ |
| **A**           | @             | xx.xx.xx.xx      | DNS only           |
| **CNAME**       | www           | placeholder      | DNS only           |
![[Screenshot 2026-02-20 at 9.24.16 PM.png]]
### 3. Cloudflare DNS 對接 (最關鍵)

在 Cloudflare 的 DNS 設定中，必須手動指向 Vercel 的伺服器：我用了３個ＡＩ，兩個ＡＩ都告訴我要像下面那樣填．我也就照做．但是等了很久，第二步的vercel 一直沒有變藍勾勾．繼續問ＡＩ，他還叫我要點耐心，等個２４小時都是有的．結果根本不是這一回事，就是要把第二步拿到的資訊拿來填cloudflare．
我會發現是因為我去讀他超連結裡面的文檔才知道，要在ＤＮＳ那邊保持同樣的設定．

| **紀錄類型 (Type)** | **名稱 (Name)** | **內容 (Content)**       | **Proxy 狀態 (小雲端)** |
| --------------- | ------------- | ---------------------- | ------------------ |
| **A**           | `@` (根網域)     | `76.76.21.21`          | **初期灰色** (驗證用)     |
| **CNAME**       | `www`         | `cname.vercel-dns.com` | **初期灰色**           |

以下是我的couldflare 設置給大家參考，只要設兩個就好，但是不知道為什麼他自己多了兩個，能動我就先不管他了．
![[Screenshot 2026-02-20 at 9.35.08 PM.png]]


---

### 三、 Quartz 專案的對應調整

當網域從 `xxx.github.io/my-blog/` 變成 `clawdbot520.fyi` 時，必須修改專案程式碼：

1. **修改 `quartz.config.ts`**：
    
    
    
    ```TypeScript
    configuration: {
      pageTitle: "你的標題",
      baseUrl: "clawdbot520.fyi", // 移除後綴，直接填入網域
      // ...
    }
    ```
    
2. **執行同步**：`npx quartz sync`。
    

---

### 四、 常見問題排查 (Troubleshooting)

|**現象**|**可能原因**|**解決方法**|
|---|---|---|
|**Invalid Configuration**|DNS 尚未生效或小雲端是橘色的|檢查 [DNSChecker](https://dnschecker.org/)，確認 A 紀錄是 `76.76.21.21`。|
|**太多次跳轉 (Too many redirects)**|SSL 模式設為 Flexible|在 Cloudflare 將 SSL 改為 **Full**。|
|**網頁沒更新**|Vercel 快取或瀏覽器快取|在 Vercel 重新 Deploy (Redeploy)，或清空 Cloudflare 快取。|

---

### 五、 進階技巧：自動化流程

- **GitHub 動力源**：你只需要在 Obsidian 寫完，輸入 `npx quartz sync`。
    
- **Vercel 接收器**：GitHub 收到更新後，Vercel 會自動感應並重新編譯，你的 `clawdbot520.fyi` 就會在一分鐘內更新。
    
- **Cloudflare 護盾**：確保你的網站在全球都有極快的解析速度，並幫你擋掉惡意機器人。
    

---

### 💡 接下來的動作建議：

既然你已經設定好了，現在你的網站 `https://clawdbot520.fyi` 應該是綠燈狀態了。
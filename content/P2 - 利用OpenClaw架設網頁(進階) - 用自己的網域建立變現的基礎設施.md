---
title: P2 - 怎麼利用 OpenCLaw 架設網頁 2 - 用自己的網域建立變現的基礎設施
date: 2026-02-20
tags:
  - 案例
  - Vercel
  - Cloudflare
  - 架網頁
  - OpenClaw
publish: true
prompt: A castle on a cloud with flags of Vercel and Cloudflare, connected to the internet galaxy. Professional cloud infrastructure, blue sky and white clouds, majestic fortress
---

![[Pasted image 20260226225627.png]]

---

## 架構說明

> [!info] 一句話總結
> Vercel 負責「住」（存儲與運算），Cloudflare 負責「門面與安全」（網域與防護）。

### 為什麼用這兩個？

| 服務 | 職責 | 優點 |
|------|------|------|
| Vercel | 網站主體 | 對 Next.js/Quartz 支援最好，部署快，自動 SSL |
| Cloudflare | 網域與安全 | DNS 解析、DDoS 防護、網域管理 |

---

## 1. 網域購買與驗證

### 步驟 1: 購買網域

到 https://www.cloudflare.com/ 搜尋喜歡的網域名稱並購買。

> [!tip] 價格
> 便宜的 $5 ~ $15 一年，我買最便宜的 $4 試試水溫。

### 步驟 2: 驗證 Email

> [!warning] 重要
> 收到 Cloudflare 的 ICANN 驗證郵件一定要點擊！

- **期限**：14 天內
- **後果**：未驗證會被鎖定（ClientHold），網站從此消失

---

## 2. Vercel 設定

### 步驟 1: 註冊 Vercel

網址：https://vercel.com

### 步驟 2: 添加網域

1. 在 Vercel 搜尋你買的網域
2. 選擇 **Add Existing**
3. 會顯示三個欄位：
   - 兩個是你買的網域（帶 www 與不帶）
   - 第三個是你 GitHub Page 的內容（免費）

### 步驟 3: 記錄 DNS 資訊

點擊右邊 **Edit**，記下這組資訊（等等 Cloudflare 會用到）：

| 類型 | 名稱 | 內容 | Proxy |
|------|------|------|-------|
| A | @ | xx.xx.xx.xx | DNS only |
| CNAME | www | placeholder | DNS only |

![[Screenshot 2026-02-20 at 9.24.16 PM.png]]

---

## 3. Cloudflare DNS 對接

### 步驟 1: 登入 Cloudflare

進入 DNS 設定頁面。

### 步驟 2: 填入 Vercel 資訊

> [!tip] 經驗分享
> 當時等好久 Vercel 都不變綠勾勾，後來發現是要把 Vercel 給的資訊原封不動填到 Cloudflare！

| 類型 | 名稱 | 內容 | Proxy |
|------|------|------|-------|
| A | @ | 76.76.21.21 | 初期灰色（驗證用）|
| CNAME | www | cname.vercel-dns.com | 初期灰色 |

### 步驟 3: 驗證結果

![[Screenshot 2026-02-20 at 9.35.08 PM.png]]

---

## 4. Quartz 專案調整

當網域從 `xxx.github.io/my-blog/` 變成自定義網域時：

### 4.1 修改 quartz.config.ts

```typescript
configuration: {
  pageTitle: "你的標題",
  baseUrl: "你的網域.com",  // 移除後綴，直接填網域
}
```

### 4.2 執行同步

```bash
npx quartz sync
```

---

## 5. 常見問題排查

| 現象 | 可能原因 | 解決方法 |
|------|----------|----------|
| Invalid Configuration | DNS 未生效或小雲端橘色 | 檢查 [DNSChecker](https://dnschecker.org/)，確認 A 紀錄是 `76.76.21.21` |
| 太多次跳轉 | SSL 模式設為 Flexible | 在 Cloudflare 將 SSL 改為 **Full** |
| 網頁沒更新 | Vercel 或瀏覽器快取 | 重新 Deploy 或清空 Cloudflare 快取 |

---

## 6. 自動化流程

| 環節 | 說明 |
|------|------|
| 動力源 | Obsidian 寫完 → `npx quartz sync` |
| 接收器 | GitHub 更新 → Vercel 自動編譯 |
| 護盾 | Cloudflare 全球分發 + 擋攻擊 |

> [!success] 結果
> 網域從申請到上線，大約一小時內完成！

---

## 7. 注意事項

> [!warning] branch 區別
> - **Production** 對應 `master` branch
> - **Quartz sync** 推到 `v4` branch
> - 最新更新是 Preview，不是 Production
> - 如要正式上線，需將 `v4` merge 到 `master`

---

## 相關連結

[[P3 - 想知道OpenClaw在背著你八卦什麼? Agent Monitor Board 告訴你|下一篇：P3 - 想知道OpenClaw在背著你八卦什麼? Agent Monitor Board 告訴你]]

---
title: P5 - 利用 OpenCLaw 架設網頁（流量變現）
description: 透過 Google AdSense 和 Buy Me a Coffee 實現部落格流量變現
date: 2026-02-21
tags:
  - 案例
  - OpenClaw
  - 架網頁
  - 變現
status: published
publish: false
---
![[Pasted image 20260226225932.png]]


### 1. 掛載 Buy Me a Coffee 贊助連結（最快見效）

我建議將贊助按鈕放在 **側邊欄底部** 或 **文章末尾**。

1. **取得你的連結：** 去 [Buy Me a Coffee](https://www.buymeacoffee.com/) 註冊並取得你的網址（如 `https://www.buymeacoffee.com/yourname`）。
    
2. **修改 Layout：** 打開你的 Quartz 專案中的 `quartz.layout.ts` 檔案。
    
3. **插入 HTML 代碼：** 你可以直接在側邊欄組件（如 `left` 或 `right`）中加入一個簡單的連結。
    
    TypeScript
    
    ```
    // 在 quartz.layout.ts 的組件清單中尋找
    Component.DesktopOnly(Component.TableOfContents()),
    // 下方加入這段自定義 HTML
    Component.Html(`
      <div style="margin-top: 1rem;">
        <a href="https://www.buymeacoffee.com/你的帳號" target="_blank">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 145px !important;" >
        </a>
      </div>
    `),
    ```
    


### 2. 掛載 Google AdSense 廣告

AdSense 需要將一段 `<script>` 放在網頁的 `<head>` 標籤內。

1. **修改 `quartz.config.ts`：** 在 Quartz 中，全域的 Header 設定通常在 `quartz.config.ts` 的 `configuration` 區塊下。
    
2. **插入自動廣告代碼：**
    
    TypeScript
    
    ```
    configuration: {
      pageTitle: "我的 AI 筆記",
      enableGPA: true, // 如果有的話
      header: `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-你的ID" crossorigin="anonymous"></script>
      `,
      // ... 其他設定
    }
    ```
    
    _註：如果 `quartz.config.ts` 不允許直接插入 HTML，你需要修改 `quartz/components/Head.tsx`，將 AdSense 程式碼貼進 `<head>` 標籤中。_
    


### 3. 如何增加文章內廣告？

如果你想在文章中間顯示廣告（這通常收益最高），你可以利用 Quartz 的 **Markdown 支持**。 在你的 Obsidian 筆記中，直接貼入 AdSense 的廣告單元代碼：

HTML

```
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxx"
     data-ad-slot="xxx"
     data-ad-format="auto"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```


### 4. 關鍵：部署到 GitHub 才能通過 AdSense 審核

Google AdSense **不會**審核 `localhost:8080`。你必須先將網站推上網（GitHub Pages）。

**我們來完成最後的 GitHub 部署指令：**

1. 在 GitHub 建立一個新倉庫（例如 `my-blog`）。
    
2. 在終端機輸入：
    
    Bash
    
    ```
    git add .
    git commit -m "Add monetization and content"
    git remote add origin https://github.com/你的帳號/my-blog.git
    git push -u origin v4
    ```
    

**成功 Push 之後，我會教你如何開啟 GitHub Actions，讓它達成「你在 Obsidian 存檔，網頁就自動更新廣告內容」的自動化流程！準備好最後一步了嗎？**



對於 **Quartz** 使用者來說，建議優先選擇 **「AdSense 程式碼片段」**。


### 4.1. AdSense 程式碼片段 (最推薦)

這是最常見的方式，Google 會給你一段 JavaScript 代碼（`<script>...</script>`）。

- **優點：** 驗證的同時，這段代碼也是未來**自動廣告 (Auto Ads)** 的啟動開關。
    
- **如何做：** 將代碼放入網站每個頁面的 `<head>` 標籤中。
    
- **Quartz 實作路徑：** 在 `quartz.config.ts` 的 `plugins.afterBody` 或是透過修改 `quartz/components/Head.tsx` 來加入。
    

### 4.2. Ads.txt 程式碼片段 (長期必備)

這是一個放在網站根目錄的純文字檔案（`ads.txt`）。

- **優點：** 它是為了防止惡意廣告詐騙（防止別人偽裝成你的網站賣廣告）。雖然有時候可用作驗證，但它的主要功能是「授權」。
    
- **如何做：** 在你的 `content` 資料夾根目錄建立一個 `ads.txt` 檔案，內容填入 Google 給你的資訊（如 `google.com, pub-xxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0`）。
    
- **注意：** 即使你用別的方法驗證，通過審核後，Google 通常還是會要求你補上這個檔案。
---


## 相關文章

[[P4|下一篇：Agent Monitor Board →]]


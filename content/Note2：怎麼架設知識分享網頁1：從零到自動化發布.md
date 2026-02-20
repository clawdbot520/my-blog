---
title: Note2：怎麼架設知識分享網頁1：從零到自動化發布
publish: true
date: 2026-02-20
tags:
  - Obsidian
  - Quartz
  - 技術筆記
  - github
  - 架網頁
---


這篇筆記記錄了如何將 Obsidian 本地筆記轉化為個人技術部落格，並利用轉檔引擎Quartz，發步到GitHub Page上，之後更新好網站內容，可以一鍵發步到網站上．

## 1. 核心架構
- **筆記端：Obsidian (或 Logseq)**
    - 你平時就在這裡寫 記錄、心得。
- **發布端：Quartz 4.0**
    - 這是一個開源工具，它能直接讀取你的 Obsidian 資料夾，並將其轉換成一個極速、支援搜尋、還有「雙向連結」圖譜的網頁。
- **代管端：GitHub 
    - 檔案存在 GitHub，透過 GitHub Page 自動部署成網頁。這部分完全免費．


## 2. Obsidian 安裝與設定
	1.直接下載 https://obsidian.md/ 
	2.啟動後的選單
		當你第一次打開 Obsidian 時，會看到一個歡迎畫面，請選擇：
		「Create new vault」** (建立新保險庫)。
    3.設定名稱與位置
		這時候會跳出兩個欄位：
		Vault name (名稱)： 給你的筆記庫取個名字。
	    Location (位置)： 預設/Users/你的使用者名稱/Documents/
	4.完成建立
		點擊 **「Create」**，你會看到一個全黑（或全白）的簡潔介面，這就是你的保險庫了！
	5.建立筆記
	
## ３. Quartz 安裝與初始化
我們現在就在你的 **Mac Mini 終端機**上完成這一切：

---

### 1. 安裝必要環境

Quartz 需要 **Node.js**（建議版本 18.14 或以上）。請先檢查是否已安裝：
```
node -v
```
如果沒安裝，請執行 `brew install node`。

---

### 2. 下載並初始化 Quartz

我們要將 Quartz 的程式碼下載到你的電腦裡（這不是放在 Vault 裡，而是放在另一個資料夾，作為「轉檔工具」）：

1. 移動到你想存放網站程式碼的地方（例如家目錄）：    
```Bash
cd ~
```
    
2. 執行安裝指令：
```Bash
npx quartz@latest create
```
如果 `npx` 還是抓不到，請嘗試直接從 GitHub 複製（這也是最穩定的做法）：** 如果你執行上面的指令依然有問題，請改用這幾行：(我自己是這個方式才行)

```Bash
# 1. 複製 Quartz 倉庫到你的電腦（my-blog 可以換成你喜歡的名字）
git clone https://github.com/jackyzha0/quartz.git my-blog

# 2. 進入資料夾
cd my-blog

# 3. 安裝必要的套件
npm install

# 4. 初始化設定（這時候它會問你 Vault 路徑）
npx quartz create
```
3. **安裝過程中的選項（關鍵）：**
    - **Project Name:** 輸入你的網站名字（例如 `my-blog`）。
    - **Content Source:** 選擇 **「Link to a local folder」**（這就是要把你的 Obsidian 接進來）。
    - **Path to your vault:** 這裡請貼上你剛才找到的 **Obsidian Vault 絕對路徑**。

---

### 3. 預覽你的部落格

初始化完成後，進入該資料夾並啟動開發伺服器：

```bash
cd my-blog
npx quartz build --serve
```

啟動後，終端機會顯示一個網址（通常是 `http://localhost:8080`）。打開瀏覽器輸入這個網址，你就會驚訝地發現：**你的 Obsidian 筆記已經變成網頁了！**

如果出網頁出現４０４錯誤，那代表Quartz 需要一個「首頁」作為進入點。
- **解決方法：** 在你的 Obsidian 裡，建立一個檔案命名為 **`index.md`**（全小寫）。
- 隨便寫點內容，例如：`# 歡迎來到我的 AI 筆記本`。
- 重新整理網頁看看。

---

## 4.接下來發步到GitHub上讓全世界看到

要把 Quartz 筆記正式刊登到 GitHub Pages 並讓全世界看到，我們需要進行 **「推送到 GitHub」** 與 **「開啟自動化部署 (GitHub Actions)」**。

因為 Quartz 是靜態網站，GitHub Actions 會在你每次 `git push` 時自動幫你編譯並更新網頁。

以下是具體步驟：

---

### 第一步：在 GitHub 上建立倉庫 (Repository)

1. 登入你的 GitHub 帳號。
2. 建立一個新倉庫，名稱建議取為 **`my-blog`**。
3. **不要**勾選 "Initialize this repository with a README"（保持全空）。

---

### 第二步：將本地程式碼推送到 GitHub

回到你的 Mac Mini 終端機，在 `my-blog` 資料夾下執行：

```Bash
# 1. 初始化 Git
git init

# 2. 將遠端地址指向你剛建立的 GitHub 倉庫
git remote add origin https://github.com/你的帳號名稱/my-blog.git

# 3. 將所有檔案加入暫存區
git add .

# 4. 提交版本 (如果這是第一次)
git commit -m "Initial Quartz build with monetization"

# 5. 推送到 GitHub 的 v4 分支 (Quartz 4 預設使用 v4)
git push -u origin v4
```

---

### 第三步：設定自動部署 (GitHub Actions)

Quartz 的作者已經寫好了自動化腳本。
1. 在 GitHub 網頁上進入你的 `my-blog` 倉庫。
2. 點擊左側選單的 **Pages**。
3. 在 **Build and deployment** -> **Source** 下拉選單中，選擇 **「GitHub Actions」**。

---

### 第四步：觸發第一次部署

1. 回到終端機，執行 Quartz 自帶的同步指令（這會自動處理推送與觸發）：
```Bash
npx quartz sync
```
2. 這時回到 GitHub 倉庫的 **Actions** 標籤頁，你會看到一個正在跑的進度條（通常叫 `Deploy Quartz`）。
3. 等它變成**綠色打勾**。

## 5. 自動化同步流程

未來寫完文章，只需在 `my-blog` 資料夾下執行：

```bash
npx quartz sync
```

這會自動執行：**Pull -> Build -> Push -> 觸發 GitHub Actions 部署**。

## 6.  quartz 進階的隱私設定

Quartz 預設會讀取 Vault 裡的所有內容，但如果你只想公開**部分**筆記，可以在 Obsidian 的筆記最上方加入這段資訊（Frontmatter）：

```Markdown
---
title: 我的 OpenClaw 設置心得
publish: true
---
```

雖然publish: false 的文章不會發步到網頁上，但是還是回check in 到git repo中，所以如果你有些文章還沒準備好不想要”獻醜“的話，可以在你的 `my-blog` 資料夾根目錄下，找到或建立一個名為 `.gitignore` 的檔案，加入以下內容：

```Plaintext
# 忽略所有在 content 裡的 private 資料夾
content/private/
content/Diary/

# 忽略所有帶有 "draft" 字眼的檔案
content/**/*draft*
```

這樣，只要你把私密筆記放在 Obsidian 裡的 `private` 資料夾，Git 就會完全當它們不存在，不會上傳。

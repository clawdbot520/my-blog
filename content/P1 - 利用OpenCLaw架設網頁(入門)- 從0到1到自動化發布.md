---
title: P1 - 利用 OpenCLaw 架設網頁（入門）- 從 0 到 1 到自動化發布
date: 2026-02-20
tags:
  - 案例
  - Obsidian
  - Quartz
  - GitHub
  - 架網頁
  - OpenClaw
publish: true
prompt: A peaceful village with houses made of knowledge books, connected by digital paths. Obsidian crystal and Quartz gemstone glowing in the center. Fantasy book village, warm cozy colors
---

![[Pasted image 20260226225107.png]]

---

> [!tip] 一句話總結
> 利用 OpenClaw 幫你從零架一個靜態部落格，Obsidian 寫筆記 + Quartz 轉網頁 + GitHub Pages 發布，完全免費！

---

## 什麼是 OpenClaw 架站？

用 AI 幫你架設網站，只要提供資訊就好：

| 元素 | 說明 |
|------|------|
| 筆記端 | Obsidian，平時寫筆記的地方 |
| 發布端 | Quartz 4.0，將筆記轉成靜態網頁 |
| 代管端 | GitHub Pages，自動部署，完全免費 |

---

## 自動化發布

> [!abstract] 自動化流程
> 1. Obsidian 寫筆記
> 2. `npx quartz sync` 自動執行 Pull → Build → Push → 部署
> 3. 全自動發布到網站！

---

## 1. 準備事項

跟 OpenClaw 說你要什麼：

> [!example] 範例指令
> 幫我從零架一個靜態部落格，Obsidian Vault 放 ~/repos/my-vault，Quartz 放 ~/my-blog，GitHub repo 叫 my-blog，標題是「我的學習筆記」，用深色主題。

### OpenClaw 會問你的資訊

| 項目 | 範例 |
|------|------|
| Obsidian Vault 路徑 | ~/repos/my-vault |
| Quartz 程式路徑 | ~/my-blog |
| GitHub 帳號 | your-username |
| Repository 名稱 | my-blog |
| 網域（可選） | blog.mydomain.com |
| 網站標題 | 我的 AI 學習筆記 |
| 主題 | 深色/淺色 |

---

## 2. Obsidian 安裝與設定

### 2.1 下載 Obsidian

官網下載：https://obsidian.md/

### 2.2 建立新 Vault

### 步驟 1: 選擇 Create new vault

第一次打開會看到歡迎畫面，選擇「Create new vault」。

### 步驟 2: 設定名稱與位置

- **Vault name**: 給筆記庫取個名字
- **Location**: 預設在 `/Users/你的名稱/Documents/`

### 步驟 3: 完成

點擊「Create」，就會看到簡潔介面，可以開始寫筆記了！

---

## 3. Quartz 安裝與初始化

### 3.1 安裝必要環境

Quartz 需要 **Node.js**（建議版本 18.14 或以上）：

```bash
node -v
```

如果沒安裝，執行：

```bash
brew install node
```

### 3.2 下載並初始化 Quartz

> [!tip] 兩種安裝方式

**方式一：npx 安裝（推薦）**

```bash
cd ~
npx quartz@latest create
```

**方式二：從 GitHub 複製**

```bash
git clone https://github.com/jackyzha0/quartz.git my-blog
cd my-blog
npm install
npx quartz create
```

### 3.3 安裝過程選項

| 選項 | 選擇 |
|------|------|
| Project Name | 輸入網站名字（如 my-blog） |
| Content Source | **Link to a local folder** |
| Path to your vault | 貼上 Obsidian Vault 絕對路徑 |

### 3.4 預覽部落格

```bash
cd my-blog
npx quartz build --serve
```

> [!info] 結果
> 瀏覽器打開 `http://localhost:8080`，你的 Obsidian 筆記已經變成網頁了！

### 3.5 解決 404 錯誤

如果出現 404，代表缺少首頁：

> [!solution] 解決方法
> 在 Obsidian Vault 建立 `index.md`，隨便寫點內容，重新整理網頁即可。

---

## 4. 發布到 GitHub

### 4.1 建立 GitHub Repository

1. 註冊 GitHub：https://github.com/
2. 建立新倉庫，名稱建議 `my-blog`
3. **不要**勾選 "Initialize with README"

### 4.2 推送程式碼到 GitHub

```bash
cd my-blog
git init
git remote add origin https://github.com/你的帳號/my-blog.git
git add .
git commit -m "Initial Quartz build"
git push -u origin v4
```

### 4.3 設定自動部署

1. 進入 GitHub 倉庫 → 左側 **Pages**
2. **Build and deployment** → Source 選擇 **「GitHub Actions」**

### 4.4 觸發第一次部署

```bash
npx quartz sync
```

> [!success] 等待部署
> 去 GitHub Actions 頁面，等變成綠色打勾，就完成了！

### 4.5 以後都讓 OpenClaw 代勞

> [!tip] 授權 OpenClaw
> 1. 告訴它要建立 GitHub repo
> 2. 提供 GitHub 帳號密碼
> 3. 讓它推送上去
> 4. 等兩分鐘就看到網站了

---

## 5. 未來發布流程

每次寫完文章，只需執行：

```bash
npx quartz sync
```

自動執行：**Pull → Build → Push → GitHub Actions 部署**

---

## 6. 進階設定

### 6.1 Frontmatter 發布設定

在筆記最上方加入：

```markdown
---
title: 我的筆記
publish: true
---
```

> [!info] 說明
> - `publish: true` → 發布到網站
> - `publish: false` → 不發布

### 6.2 .gitignore 過濾私密筆記

在 `my-blog/` 根目錄建立 `.gitignore`：

```plaintext
content/private/
content/Diary/
content/**/*draft*
```

> [!tip] 這樣
> 私密筆記放在 `private` 資料夾，Git 就會完全忽略，不會上傳。

---

## 7. 總結

> [!success] 架站好處
> - 免費：完全不用花錢
> - 簡單：AI 幫你處理繁瑣步驟
> - 自動化：以後 `npx quartz sync` 就發布

> [!quote] 重點
> 人只需要提供 AI 沒有的資訊（帳號、密碼、名稱），其他它都能自己搞定。不懂原理也沒關係，隨時可以問 AI！

---

## 相關連結

[[P2 - 利用OpenClaw架設網頁(進階) - 用自己的網域建立變現的基礎設施|下一篇：P2 - 利用OpenClaw架設網頁(進階) - 用自己的網域建立變現的基礎設施]]

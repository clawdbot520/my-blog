---
title: P7 - 利用 OpenCLaw 架設網頁（流量變現）
date: 2026-02-21
tags:
  - 案例
  - OpenClaw
  - 架網頁
  - 變現
publish: true
prompt: A website growing into a money tree with coins, traffic streams flowing in. Green and gold colors
---

![[Pasted image 20260226225932.png]]

---

## 變現方式

| 方式 | 難度 | 收益速度 |
|------|------|----------|
| Buy Me a Coffee | ⭐ 簡單 | 快 |
| Google AdSense | ⭐⭐ 中等 | 慢 |

---

## 1. Buy Me a Coffee 贊助連結

### 步驟 1: 取得連結

1. 前往 [Buy Me a Coffee](https://www.buymeacoffee.com/)
2. 註冊並取得你的網址
3. 例如：`https://www.buymeacoffee.com/yourname`

### 步驟 2: 修改 Layout

打開 Quartz 專案的 `quartz.layout.ts`

### 步驟 3: 插入 HTML

在側邊欄組件中加入：

```typescript
Component.Html(`
  <div style="margin-top: 1rem;">
    <a href="https://www.buymeacoffee.com/你的帳號" target="_blank">
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 145px !important;" >
    </a>
  </div>
`)
```

---

## 2. Google AdSense 廣告

### 2.1 取得廣告代碼

從 AdSense 取得一段 `<script>` 代碼

### 2. 植入 AdSense

在 `quartz.config.ts` 的 `configuration` 中加入：

``` typescript
configuration: {
pageTitle: "我的 AI 筆記",
header: `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-你的ID" crossorigin="anonymous"></script>
`,
}
```

> [!tip] 替代方式
> 如果不允許直接插入 HTML，可以修改 `quartz/components/Head.tsx`

### 2.3 文章內廣告

在 Obsidian 筆記中直接貼入：

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-xxx"
     data-ad-slot="xxx"
     data-ad-format="auto"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

## 3. AdSense 審核必備

> [!warning] 重要
> Google AdSense 不會審核 `localhost:8080`，必須先部署到 GitHub Pages！

### 部署到 GitHub

```bash
git add .
git commit -m "Add monetization"
git remote add origin https://github.com/你的帳號/my-blog.git
git push -u origin v4
```

---

## 4. ads.txt 檔案

> [!info] 長期必備
> 這是防止廣告詐騙的檔案，通過審核後 Google 通常會要求補上。

在 `content/` 根目錄建立 `ads.txt`：

```
google.com, pub-xxxxxxxxxxxxxx, DIRECT, f08c47fecxxxxxx
```

---


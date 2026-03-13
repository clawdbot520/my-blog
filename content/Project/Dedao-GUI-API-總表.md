---
title: Dedao GUI API 總表
date: 2026-03-01
tags:
  - Dedao
  - API
  - 開發
publish: true
prompt: A clean API documentation interface with code blocks and colorful endpoints, developer tools, modern tech style
---

> [!info] 概述
> 得到 App API 總表，包含聽書、電子書、課程、搜尋等功能模組。

---

## 🔐 認證

| 功能 | Go 函式 |
|------|---------|
| QR code 登入 | CheckLogin() |
| Cookie 登入 | LoginByCookie() |
| 登出 | Logout() |
| 切換帳號 | SwitchAccount() |

---

## 📚 聽書 (odob) — VIP 有效 ✅

| 功能 | Go 函式 | endpoint |
|------|---------|----------|
| 書單列表 | CourseList("odob", ...) | /api/hades/v2/product/list |
| VIP 狀態 | OdobUserInfo() | /pc/odob/v2/vipuser/vip_card_info |
| 加入書架 | OdobShelfAdd(ids) | /pc/odob/v2/bookrack/pc/add |
| 文章內文 | OdobArticleDetail(enid) | — |
| 音頻 URL | AudioDetail(aliasID) | /pc/bauhinia/v1/audio/mutiget_by_alias |
| 下載文稿 MD | DownloadOdobMarkdown() | — |

---

## 📖 電子書 (ebook) — VIP 已過期 ❌

| 功能 | Go 函式 | endpoint |
|------|---------|----------|
| 書架列表 | CourseList("ebook", ...) | /api/hades/v2/product/list |
| 書籍詳情 | EbookDetail(enid) | /pc/ebook2/v1/pc/detail |
| 加入書架 | EbookShelfAdd(ids) | /api/pc/ebook2/v1/bookshelf/add |
| 移出書架 | EbookShelfRemove(ids) | /api/pc/hades/v1/product/remove |
| 書評列表 | EbookCommentList(id, sort, page, limit) | /pc/ebook2/v1/comment/list |
| 書摘筆記 | svc.EbookNoteList(enid) | /api/pc/ledgers/ebook/list |

---

## 🎓 課程 (bauhinia)

| 功能 | Go 函式 |
|------|---------|
| 課程列表 | CourseList("bauhinia", ...) |
| 課程詳情 | CourseDetail(enid) |
| 文章列表 | ArticleList(enid, ...) |
| 文章內文 | ArticleDetail(enid) |
| 留言列表 | ArticleCommentList(enid, ...) |

---

## 🔍 搜尋 & 其他

| 功能 | Go 函式 | endpoint |
|------|---------|----------|
| 熱門搜尋詞 | svc.SearchHot() | /api/search/pc/hot |
| 知識城邦(頻道) | ChannelInfo(id) / ChannelHomepage(id) | — |
| 話題筆記 | TopicAll() / TopicDetail() / TopicNotesList() | — |
| 錦囊 (sunflower) | svc.SunflowerLabelList() / SunflowerLabelContent() | — |
| 直播 | svc.LiveList() | — |

---

## 相關連結

[[P5 - 沒時間刷Podcast? 用一句話讓OpenClaw 幫你生成筆記]]

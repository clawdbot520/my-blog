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

---

```

2. 利用 .gitignore 來過濾掉你不想要上傳的文章
   雖然 publish: false 的文章不會發布到網頁上，但是還是會 check in 到 git repo 中，所以如果你有些文章還沒準備好不想要「獻醜」的話，可以在你的 `my-blog` 資料夾根目錄下，找到或建立一個名為 `.gitignore` 的檔案，加入以下內容：

```plaintext
# 忽略所有在 content 裡的 private 資料夾
content/private/
content/Diary/

# 忽略所有帶有 "draft" 字眼的檔案
content/**/*draft*
```

這樣，只要你把私密筆記放在 Obsidian 裡的 `private` 資料夾，Git 就會完全當它們不存在，不會上傳。

## 7. 總結

利用ＡＩ架設網頁比起以前繁瑣的步驟真的是輕鬆不少，人只需要提供他沒有的資訊就好（你的帳號密碼，和你想取什麼名子），其他跟寫程式或是流程相關的他都可以自己搞定。就算你不懂其中的原理也沒關係，隨時可以問ＡＩ，只要最終目的你有達成就好。

---


## 相關文章

[[P2|下一篇：進階架站 →]]


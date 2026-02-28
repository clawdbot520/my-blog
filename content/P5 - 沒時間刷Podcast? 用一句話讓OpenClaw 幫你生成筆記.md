---
title: P5 - 沒時間刷 Podcast？用一句話讓 OpenClaw 幫你生成筆記
tags:
  - OpenClaw
  - Podcast
  - AI
  - 自動化
  - Whisper
date: 2026-02-27
status: published
publish: true
---
![[Pasted image 20260228103857.png]]
> [!info] 概述
> 沒時間刷 Podcast？只要告訴 OpenClaw 想聽哪個 Podcast、哪一集，它就會自動下載音頻、用 Whisper 轉成文字，產出全文或重點摘要。

---

## 目的是什麼？

**讓使用者只要說出 Podcast 名稱，就能自動產出文字稿。**

### 過往 vs 現在

| 過往 | 現在 |
|------|------|
| 手動搜尋 RSS | 自動搜尋 |
| 下載音頻 | 自動下載 |
| 用 Whisper 轉文字 | 自動轉換 |
| 過濾業配/閒聊 | 智慧過濾 |

只要告訴 AI 要轉哪個 Podcast，全部自動處理完成。

---

## 功能規格

### 輸入參數

| 參數 | 必填 | 預設 | 說明 |
|------|:----:|------|------|
| `podcast` | ✅ | - | Podcast 頻道名稱（如：股癌、豬探長推理故事集） |
| `episode` | ❌ | 最新集 | 指定集數（如：EP639、636） |
| `format` | ❌ | `full` | 輸出格式：`full`=全文，`summary`=重點摘要 |

### 輸出

| 格式 | 說明 |
|------|------|
| **全文** | Whisper 直接輸出，保留所有內容 |
| **重點摘要** | 過濾業配、廣告、閒聊，只保留核心知識內容 |

### 支援平臺

- SoundOn
- Firstory
- Apple Podcasts
- 其他支援 RSS 的 Podcast 平臺

---

## 技術堆疊

| 層面 | 工具 |
|------|------|
| 搜尋 RSS | Apple Podcasts API |
| 下載音頻 | yt-dlp |
| 轉文字 | faster-whisper (tiny model) |
| 輸出 | .txt 檔案 |

> [!tip] 安裝需求
> - `yt-dlp` → `brew install yt-dlp`
> - `ffmpeg` → `brew install ffmpeg`
> - `faster-whisper` → Python venv (`/tmp/whisper-venv`)

---

## 檔案位置

```
~/.openclaw/skills/podcast-transcriber/
├── SKILL.md              # Skill 說明文件
└── scripts/
    └── transcribe.py     # 核心轉錄腳本
```

**輸出位置**：`/tmp/podcast-transcribe/`

---

## 使用方式

### 對話範例

```
用戶：股癌 EP637 給我 300 字摘要

OpenClaw：
→ 自動搜尋「股癌」RSS
→ 下載 EP637 音頻
→ Whisper 轉文字
→ 生成重點摘要
→ 產出結果
```

### 直接執行

```bash
# 最新集 + 全文
python3 scripts/transcribe.py --podcast "股癌"

# 指定集數
python3 scripts/transcribe.py --podcast "股癌" --episode 637

# 重點摘要（適合投資/科技內容）
python3 scripts/transcribe.py --podcast "股癌" --format summary
```

---

## 使用情境

### 適合使用

| 類型 | 範例 |
|------|------|
| **投資 Podcast** | 股癌、Mirror → 產出投資重點 |
| **技術 Podcast** | 產業趨勢、技術分析 |
| **兒童故事** | 豬探長推理故事集 → 故事內容 |

### 注意事項

> [!warning] 限制
> 1. **轉換時間**：約 3-5 分鐘（取決於音頻長度）
> 2. **Whisper 準確率**：約 90-95%，部分口音/專有名詞可能出錯
> 3. **重點過濾**：是簡單的關鍵字過濾，可能誤判

---

## 實測案例

| Podcast | 平臺 | 集數 | 狀態 |
|---------|------|------|------|
| 股癌 | SoundOn | EP637 | ✅ 已轉文字 |
| 股癌 | SoundOn | EP636 | ✅ 已轉文字 |
| 豬探長推理故事集 | Firstory | EP120 | ✅ 可下載 |

---

## 如何觸發？

當使用者說：
- 「轉文字」
- 「轉錄」
- 「生成文字稿」
- 「幫我把 OO 轉成文字」
- 「幫我產出 OO 的重點摘要」

---

## 快速指令

```bash
# 安裝 skill（路徑）
cd ~/.openclaw/skills/podcast-transcriber

# 測試執行
python3 scripts/transcribe.py --podcast "測試" --help
```

---

*建立於 2026-02-27*

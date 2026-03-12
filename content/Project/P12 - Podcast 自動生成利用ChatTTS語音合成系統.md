---
title: P12 - Podcast 自動生成利用ChatTTS語音合成系統
date: 2026-03-11
tags:
  - 案例
  - OpenClaw
  - ChatTTS
  - Project
  - TTS
  - 語音生成
publish: true
prompt: A cute digital lobster wearing headphones, speaking into a professional studio microphone. Sound waves and musical notes forming a digital aquaculture bubble. 3D render, high detail, vibrant colors.
---
![[Pasted image 20260312141540.png]]
# ChatTTS 語音合成系統

## GItHub Path:
https://github.com/xiciliu/Awesome-ChatTTS-2

## 目的

將文字稿（Markdown 格式的雙人對話腳本）自動轉換為語音檔案，生成類似 Podcast 的雙人對話音頻。

### 應用場景
- YouTube Shorts 語音旁白
- Podcast 節目生成
- 有聲書自動化

---

## 原理

### ChatTTS 核心概念

| 參數 | 用途 | API 位置 |
|------|------|----------|
| **Audio Seed** | 控制音色（男聲/女聲高低） | `torch.manual_seed()` → `sample_random_speaker()` |
| **Text Seed** | 控制情感/語氣 | `InferCodeParams(manual_seed=...)` |
| **Speed** | 語速 | `RefineTextParams(prompt=f"[speed_X]")` |
| **Oral** | 口語化程度（加「就是」、「那麼」） | prompt 中的 `[oral_X]` |
| **Temperature** | 隨機性/創意程度 | `InferCodeParams(temperature=...)` |
| **Top_P** | 情感相關性 | `InferCodeParams(top_P=...)` |
| **Top_K** | 詞彙選擇範圍 | `InferCodeParams(top_K=...)` |

### 音色選擇

| Seed 值 | 描述 |
|---------|------|
| 7 | 男聲（阿強預設） |
| 444 | 女聲（小曼預設，較温柔） |
| 2222 | 標準女聲 |
| 6653 | 甜美女聲 |
| 462 | 活潑女聲 |

---

## 架構

```
┌─────────────────────────────────────────────────────────┐
│                    輸入層                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Markdown 腳本 (podcast_*.md)                   │   │
│  │ 格式：| 角色 | 對話 |                           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   解析層                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ generate_podcast.py                            │   │
│  │ - clean_text() 清洗文字                         │   │
│  │ - parse_script() 解析對話表格                   │   │
│  │ - merge_params() 合併全域/角色參數              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   生成層                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ChatTTS Core                                   │   │
│  │ 1. sample_random_speaker() 產生音色嵌入        │   │
│  │ 2. RefineTextParams 建立語音prompt             │   │
│  │ 3. InferCodeParams 設定推理參數                 │   │
│  │ 4. chat.infer() 生成音頻                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   輸出層                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 輸出格式：WAV (24kHz, int16)                   │   │
│  │ - podcast_output.wav (合併後)                   │   │
│  │ - 阿強.wav / 小曼.wav (個別角色)               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 流程

### 1. 準備腳本

在 `~/repos/Obsidian Vault/YT Short/` 目錄下建立 `podcast_*.md`：

```markdown
| 角色 | 對話 |
|------|------|
| 小曼 | 哈囉大家好！歡迎收聽今天的節目。 |
| 阿強 | 小曼，妳準備好了嗎？ |
```

### 2. 執行生成

```bash
cd ~/chatts-webui
source ~/chatts-venv/bin/activate
python3 scripts/generate_podcast.py
```

### 3. 命令列參數覆蓋

```bash
# 覆蓋速度
python3 scripts/generate_podcast.py --speed 6

# 覆蓋所有角色的音色
python3 scripts/generate_podcast.py --audio-seed 2222

# 覆蓋情感種子
python3 scripts/generate_podcast.py --text-seed 123

# 指定輸出檔名
python3 scripts/generate_podcast.py --output my_podcast
```

---

## 設定檔結構

### 全域預設 (DEFAULT_PARAMS)

```python
DEFAULT_PARAMS = {
    "speed": 5,           # 0-9
    "temperature": 0.3,  # 0-1
    "top_P": 0.7,        # 0.1-0.9
    "top_K": 20,         # 1-20
    "text_seed": 42,
    "oral": 4,           # 0-9
    "laugh": 0,          # 0-9
}
```

### 角色配置 (ROLES)

```python
ROLES = {
    "阿強": {
        "audio_seed": 134,
        "text_seed": 42,
        "speed": 4,
        "temperature": 0.3,
        "top_P": 0.7,
    },
    "小曼": {
        "audio_seed": 2222,
        "text_seed": 123,
        "speed": 3,
        "temperature": 0.3,
        "top_P": 0.8,
    },
}
```

---

## WebUI 使用

啟動服務：

```bash
cd ~/chatts-webui
source ~/chatts-venv/bin/activate
python3 webui.py
```

訪問：http://localhost:7860

### 參數位置

| 參數 | WebUI 位置 |
|------|------------|
| Speed | 🚀 速度與節奏 |
| Break | 🚀 速度與節奏 |
| Temperature | 🎲 隨機性 |
| Top P | 🎲 隨機性 |
| Top K | 🎲 隨機性 |
| Audio Seed | 🎤 音色與情感 |
| Text Seed | 🎤 音色與情感 |
| Oral | 🎤 音色與情感 |
| Laugh | 🎤 音色與情感 |

---

## 注意事項

### 1. 常見錯誤

#### MPS 錯誤
```
RuntimeError: Placeholder storage has not been allocated on MPS device
```
**解決**：WebUI 改用 CPU（`device = "cpu"`）

#### Gradio 輸出錯誤
```
InvalidPathError: Cannot move /tmp/chattts_output.wav
```
**解決**：輸出路徑改為工作目錄而非 `/tmp`

#### Invalid Characters 警告
```
found invalid characters: {'！', '？'}
```
**說明**：中文標點可能觸發警告，但不影響生成

### 2. 模型位置

```
~/.openclaw/workspace-media/
├── asset/                    # ChatTTS 模型
│   ├── DVAE.safetensors
│   ├── Decoder.safetensors
│   ├── Embed.safetensors
│   └── Vocos.safetensors
```

### 3. 輸出位置

```
~/chatts-webui/output/
├── podcast_output.wav       # 合併後的音頻
├── 阿強.wav                 # 個別角色音頻
└── 小曼.wav
```

### 4. 音色穩定性

- 使用相同的 `audio_seed` + `text_seed` 組合可獲得一致的輸出
- 建議先在 WebUI 測試滿意的參數，再寫入配置檔

---

## 檔案位置

| 檔案 | 路徑 |
|------|------|
| Podcast 生成腳本 | `~/chatts-webui/scripts/generate_podcast.py` |
| WebUI | `~/chatts-webui/webui.py` |
| 腳本範本 | `~/repos/Obsidian Vault/YT Short/podcast_*.md` |
| 輸出目錄 | `~/chatts-webui/output/` |

---

## 相關資源

- [Awesome-ChatTTS-2](https://github.com/xiciliu/Awesome-ChatTTS-2) - 官方推薦入門指南
- [ChatTTS 官網](https://chattts.in)

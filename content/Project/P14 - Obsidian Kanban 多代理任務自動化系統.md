---
title: P14 - Obsidian Kanban 多代理任務自動化系統
date: 2026-03-11
tags:
  - Kanban
  - 多代理
  - 自動化
  - OpenClaw
  - ClaudeCode
  - Antigravity
publish: true
prompt: Three AI robots pushing  "Kanban cards" on a digital board, automated workflow arrows, "Obsidian" logo, blue orange purple colors, futuristic task management
---
![[Pasted image 20260312141912.png]]
# Obsidian Kanban 多代理任務自動化系統

> 最後更新：2026-03-11

---

## 目標

將 Obsidian Kanban 打造為 Multi-Agent 自動化任務系統，支援單步驟與多步驟接力。

---

## 架構

```
User → Obsidian Kanban UI → Kanban.md
                              ↓ fswatch
                          watcher.sh
                              ↓ Todo 增加時觸發
                            job.sh
                              ↓ 依 assignee 路由
                    claude-code / openclaw / antigravity
```

---

## 檔案結構

```
~/repos/Obsidian Vault/Task Kanban/
├── Kanban.md              # 看板主檔
├── User Manu.md           # 使用手冊
└── task/                  # 任務筆記目錄
    └── TASK-XXXXX-title.md

~/.openclaw/skills/task-kanban-mcp/
├── SKILL.md               # skill 說明
├── scripts/
│   ├── job.sh             # 主排程腳本
│   └── watcher.sh         # fswatch 監聽腳本
└── server.py              # MCP server
```

---

## 看板欄位

| 欄位名 | 用途 |
|--------|------|
| 📥 Backlog | 點子收集 |
| 📅 Todo | 等待執行（拖入此欄觸發自動化） |
| 🚀 In Progress | 執行中（卡片全程停留直到完成） |
| 👀 Review | 等待 Alan 確認 |
| ✅ Done | 已完成 |
| ❌ Canceled | 已取消/歸檔 |
| 🚫 Blocked | 被阻塞或需人工處理 |

---

## Task 檔 YAML Schema

```yaml
---
assignee: claude-code   # 當前執行 agent（多步驟時由 job.sh 自動更新）
retry_count: 0          # 失敗自動累計，超過 3 次推到 Blocked

# 多步驟接力（可選）
current_step: 1
step1: antigravity
step2: claude-code
step3: openclaw
step4: Alan             # Alan = 需人工 → job.sh 推到 Blocked
---

**User (YYYY-MM-DD HH:mm):**
> 任務描述
```

**說明：**
- 單步驟任務只需 `assignee` + `retry_count`
- 多步驟任務加上 `current_step` + `step1~4`
- `assignee` 永遠是**當前要執行的 agent**，由 job.sh 在步驟完成後自動更新

---

## 回覆格式

Agent 完成後追加到 task 檔末尾：

```markdown
**{assignee} (YYYY-MM-DD HH:mm):**
> 回覆內容
```

---

## 狀態流轉

| 動作 | 從 | 到 | 誰負責 |
|------|----|----|--------|
| 排程執行 | Backlog | Todo | Alan（拖曳） |
| AI 開始跑 | Todo | In Progress | job.sh（自動） |
| AI 做完 | In Progress | Review | job.sh（自動） |
| 需要人工 | In Progress | Blocked | job.sh（assignee: Alan） |
| 失敗重試 | In Progress | In Progress | job.sh（retry_count+1） |
| 超過重試 | In Progress | Blocked | job.sh（自動） |
| Alan 確認 | Review | Done | Alan（手動） |
| 歸檔清理 | Done | Canceled | Alan（手動） |

---

## 多步驟接力邏輯

- 卡片移入 In Progress 後**全程停留**，不回 Todo
- job.sh 在同一個 run 內依序跑完所有 step
- 每個同步 agent 完成後，job.sh 呼叫 `advance_task()`：
  - 有下一步 → 更新 YAML `assignee` + `current_step`，繼續 loop
  - 沒有 → 移到 Review
- openclaw 為非同步，queue 後結束，等小歐完成另行處理

---

## Agent 路由規則

| assignee | 執行方式 |
|----------|---------|
| `claude-code` | `(cd $HOME && script -q /dev/null claude -c -p "$prompt" --permission-mode bypassPermissions)` |
| `openclaw` | `bash add_task.sh`（非同步） |
| `antigravity` | `python3 $HOME/.openclaw/skills/task-kanban-mcp/scripts/ask_antigravity.py "$prompt"` |
| `Alan` | 移到 Blocked |
| 其他 | 移到 Review（skip） |

**claude-code 注意事項：**
- 必須用 `script -q /dev/null` 包 PTY，否則卡住
- 用 `-c` 接回 $HOME 現有 session，共享 context

---

## Prompt 格式（通用）

```
任務檔案：/full/path/to/TASK-XXXXX.md

請讀取任務檔案，完成 User 的需求，並將你的回覆以下列格式追加到檔案末尾：

**{assignee} (YYYY-MM-DD HH:mm):**
> 你的回覆
```

---

## 自動化腳本觸發方式

1. **自動**：拖曳卡片到 Todo → fswatch 偵測 → watcher.sh → job.sh
2. **手動**：`bash ~/.openclaw/skills/task-kanban-mcp/scripts/job.sh`
3. **MCP**：`trigger_job()`

---

## MCP 介面

| Tool | 功能 |
|------|------|
| `get_board()` | 取得看板狀態 |
| `get_task(id)` | 取得任務詳情 |
| `create_task(...)` | 建立新任務 |
| `move_card(id, status)` | 搬移卡片 |
| `trigger_job()` | 觸發執行 |
| `list_tasks_by_status(status)` | 列出特定狀態任務 |

---

## 與現有系統整合

| Agent | 底層 | 用途 |
|-------|------|------|
| claude-code（小可） | Claude | 程式開發、兜底精修 |
| openclaw（小歐） | MiniMax | 主力開發、協調自動化 |
| antigravity（小安） | Gemini | 特定領域、Code review |

---

## 開發狀態

| Phase | 項目 | 狀態 |
|-------|------|------|
| Phase 1 | Kanban.md + 使用手冊 | ✅ 完成 |
| Phase 2 | job.sh + watcher.sh 自動化 | ✅ 完成 |
| Phase 3 | MCP 介面 | ✅ 完成 |
| Phase 4 | 多步驟接力（advance_task） | ✅ 完成 |
| Phase 5 | openclaw 完成後自動 advance | 🚧 待實作 |

---

## LaunchAgent（常駐監聽）

watcher.sh 透過 launchd 開機自啟，常駐監聽 Kanban.md 變化：

```
com.clawdbot520.kanban-watcher
~/Library/LaunchAgents/com.clawdbot520.kanban-watcher.plist
```

修改腳本後需重啟：
```bash
launchctl unload ~/Library/LaunchAgents/com.clawdbot520.kanban-watcher.plist
launchctl load ~/Library/LaunchAgents/com.clawdbot520.kanban-watcher.plist
```

---

## 注意事項

- **`ask_antigravity.py` 不要放 `/tmp/`**：重開機後 `/tmp` 會被清除或覆寫，必須固定放在 skill 目錄（`~/.openclaw/skills/task-kanban-mcp/scripts/`）
- **claude-code 必須用 `script -q /dev/null` 包 PTY**，否則 headless 模式會卡住不回應
- **watcher 觸發條件**：只有 Todo 欄位卡片數量**增加**才觸發，其他欄位變動不觸發

---

## 參考資源

- Obsidian Kanban Plugin: https://github.com/mgmeyers/obsidian-kanban
- 使用手冊：`~/repos/Obsidian Vault/Task Kanban/User Manu.md`
- Skill 說明：`~/.openclaw/skills/task-kanban-mcp/SKILL.md`

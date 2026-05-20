# AI_ORG Dashboard

> **Project: ForgeBench｜AI 鍛造台** — Human Oversight Console(對外品牌 ForgeBench)

AI-Native 軟體組織的 **Human Oversight Console** — 看 AI 代理在做什麼、待批什麼、憲法守得好不好,人類只負責批准、提方向。

7 頁全接 FastAPI runtime([ai-org-runtime](https://github.com/adexenx123/ai-org-runtime),憲法 SSOT 在 [AI_ORG](https://github.com/adexenx123/AI_ORG))。

## Pages

| Page | Path | 接什麼端點 | 在做什麼 |
|------|------|---|---|
| 儀表板 Dashboard | `index.html` | `GET /tasks?status=awaiting_approval` + `GET /agents` | 待批佇列、agent roster、5s 輪詢、approve/reject |
| 任務 Tasks | `tasks.html` | `GET /tasks` + status filter | 全任務列表、狀態過濾、5s 輪詢 |
| AI 員工 Agents | `agents.html` | `GET /agents` | 8 角色 class 分組(orchestration / planning / execution / qa) |
| 討論室 Discuss | `discuss.html` | `POST /chat` SSE stream | 與 claude -p headless 即時 chat、Enter 送/Shift+Enter 換行、~50ms throttle |
| 歷史 History | `history.html` | `GET /tasks` + `GET /tasks/{id}` | 時間軸倒序、點開卡片 fetch diff inline / modal |
| 憲法 Constitution | `constitution.html` | `GET /constitution` | 憲法 11 條文 side nav + 簡易 markdown render(無外部 lib) |
| 設定 Settings | `settings.html` | `GET /health` + `GET /agents` | 連線狀態紅/綠燈、角色統計、引擎分佈、manifest version、重新整理 |

### Phase 1 新增 server 端點(dashboard 還沒接,preview)

| 端點 | 用途 |
|---|---|
| `POST /graph/task` | 走 LangGraph 路線啟任務(取代 dispatcher 路線可選) |
| `GET /graph/tasks/{id}/state` | 讀 PostgresSaver checkpoint state |
| `POST /graph/tasks/{id}/approve` | graph 從 interrupt 點 resume → commit |
| `POST /graph/tasks/{id}/reject` | 標 blocked,不執行 commit |

## Stack

Pure static HTML + CSS + vanilla JS。**不引外部 framework / markdown lib**;每頁自帶 inline `<script>` fetch + render。
失敗一律 toast(`shared.js` 的 `showToast`)+ 保留 mock,UI 不會壞。

API endpoint 切換:每頁支援 `?api=http://your-runtime:8765` query string。

## 本機跑

```bash
# Pages(任一靜態 server)
python3 -m http.server 8080
# 開 http://localhost:8080/?api=http://127.0.0.1:8765

# Runtime(另一個 repo)
cd ../ai-org-runtime
.venv/bin/uvicorn src.api.server:app --host 127.0.0.1 --port 8765 --reload
```

## Live

https://adexenx123.github.io/ai-org-dashboard/

> 線上版直接接你自己 runtime 的 URL,把網址加 `?api=https://your-runtime.example.com` 即可。
> 未指定 `?api=` 時走預設 `http://127.0.0.1:8765`,離線狀態頁面用 mock 內容,不會空白。

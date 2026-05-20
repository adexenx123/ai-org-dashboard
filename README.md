# AI_ORG Dashboard

A clickable demo of the AI-Native software org dashboard — what running a company looks like when AI agents do the work and you only approve, ideate, and set direction.

## Pages

| Page | Path | What it shows |
|------|------|---------------|
| 儀表板 Dashboard | `index.html` | Pending approvals, in-flight kanban, agent roster, budget, constitution health |
| 任務 Tasks | `tasks.html` | All 17 tasks, filters, gantt, awaiting-you queue |
| 討論室 Discuss | `discuss.html` | Full-screen chat with CEO-orchestrator + role-agents |
| AI 員工 Agents | `agents.html` | 8 agent profiles with stats |
| 歷史 History | `history.html` | Decisions, ships, constitution edits, learnings |
| 憲法 Constitution | `constitution.html` | 12 articles + 8 roles, browsable |
| 設定 Settings | `settings.html` | Models, budget, notifications, approval rules, integrations |

## Stack

Pure static HTML + CSS + vanilla JS. No build step. Drops into any static host.

## Local

Open `index.html` in a browser, or run any static server:

```bash
python3 -m http.server 8080
```

## Live

https://adexenx123.github.io/ai-org-dashboard/

# WORKSPACE.md — Component-level wireframe (members)

## Routes
- `/{locale}/workspace`
- `/{locale}/workspace/prompts`
- `/{locale}/workspace/notes`
- `/{locale}/workspace/bookmarks`

---

## Components
### `WorkspaceShell`
- Sidebar nav:
  - Overzicht
  - Prompts
  - Notities
  - Bookmarks
  - Collections (later)
- Topbar:
  - Search (later Cmd+K)
  - Plan badge (Free/Pro/Studio)

### `/workspace` Dashboard
- `StatsCards`:
  - prompts count
  - bookmarks count
  - notes count
- `RecentItems` list
- `UpgradeNudge` if limits reached

### Prompts
- `PromptsList` + filters (tags, tool-context)
- `PromptEditor` (markdown)
- Save, delete, duplicate
- Access: owner/admin

### Notes
- Similar to prompts, but allow linking to cases/tools/pulse items

### Bookmarks
- group by collection
- types: case/tool/pulse/kit

---

## Entitlements
- Free limits enforced in UI + server
- Pro unlimited

## i18n
- labels as keys

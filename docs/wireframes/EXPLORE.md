# EXPLORE.md — Component-level wireframe

## Route
- `/{locale}/explore`

## Page goal
Snel overzicht + filters, geen overload.

---

## Components
### `PageHeader`
- Title: "Ontdek wat er gebouwd wordt"
- Subtitle: "Echte oplossingen, gebouwd met vibecoding."

### `FilterBar` (sticky)
**Filters**
- Type: microtool | product/saaS | experiment | evolving
- Doel: automation | data | marketing | ops | support | other
- Status: prototype | live | paused
- Tool: select from tools (multi-select)
- Toggle: Editors picks
- Toggle: Beginner-friendly

**Behavior**
- Updates query params
- Debounced apply
- Reset button

### `CasesGrid`
- `CaseCard` list (paginated or infinite)
- Each card:
  - title
  - tagline
  - 1-zin probleem
  - tool chips (max 3)
  - labels: editorsPick / promoted / featured
- Skeleton loading
- Empty state: “Geen cases gevonden. Pas filters aan.”

### `Sidebar` (desktop optional)
- `MicroProblemCTACompact`
- `PricingNudge` (subtle)

---

## Data requirements
- `cases` query with filters, indexed on type/status/tools/tags
- `tools` list for filter options

---

## i18n
- All filter labels are translatable keys

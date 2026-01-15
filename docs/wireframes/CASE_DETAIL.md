# CASE_DETAIL.md — Component-level wireframe

## Route
- `/{locale}/case/{slug}`

---

## Components
### `CaseHero`
- Title
- Tagline
- Meta:
  - Type chip
  - Status chip
  - Builder (link to profile)
  - Tools used (chips)
- Primary CTA: "Bewaar" (bookmark) (member) / "Meld je aan" (guest)
- Secondary CTA: "Dien een vergelijkbaar micro-probleem in"

### `Tabs`
Tabs:
1) Overzicht
2) Stack
3) Learnings
4) Builder

### Tab: `Overview`
- `ProblemBlock`
- `SolutionBlock`
- `EnablesBlock` (wat maakt dit mogelijk)

### Tab: `Stack`
- `ToolsList`
  - tool name + short role (1 zin)
  - link (affiliate if exists)
- `LinksBlock` (demo/github)

### Tab: `Learnings`
- bullets: “Wat werkte” / “Wat niet”
- “Voor wie is dit relevant”
- Optional “Volgende stap” (kit)

### Tab: `Builder`
- Builder card: bio + links
- Other cases by builder

### `RelatedKitCard` (contextual)
- show if kit exists
- CTA: "Bekijk kit"

### `MicroProblemCTA`
- Title: "Heb je iets vergelijkbaars?"
- CTA: "Leg je probleem voor"

---

## States
- Loading skeleton
- 404: “Case niet gevonden”
- Unlisted: require token or 404 (depending on policy)

---

## i18n
- All body fields localized in Payload: nl/en/es
- fallback to nl

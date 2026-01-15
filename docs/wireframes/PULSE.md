# PULSE.md — Component-level wireframe (curated digest)

## Route
- `/{locale}/pulse`

---

## Components
### `PageHeader`
- Title: "Pulse"
- Subtitle: "Gecureerde updates over vibecoding, AI en tools."

### `DigestSignup` (top or mid)
- Email input
- Consent text
- CTA: "Ontvang de wekelijkse digest"

### `FeaturedPulseList`
- `PulseCard` x5
  - title
  - 2–3 zinnen summary
  - source + date
  - "Waarom dit relevant is" (editor note)
- Loading skeleton

### `AllPulseList` (optional, limited)
- smaller rows, pagination
- Filters: tool/topic
- Empty state

---

## Data
- featured: `pulseItems.curationStatus=featured`
- all: `pulseItems.curationStatus in (reviewed, featured)` with pagination

---

## i18n
- Titles/summaries can be localized later; MVP: NL summary + source link

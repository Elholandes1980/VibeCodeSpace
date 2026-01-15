# SUBMIT_BUILD.md — Component-level wireframe

## Route
- `/{locale}/submit/build`

## Goal
Builder insturen → moderation queue, minimale frictie.

---

## Components
### `PageHeader`
- Title: "Deel je build"
- Subtitle: "Laat zien wat je gebouwd hebt — met context."

### `SubmitBuildForm`
Fields:
- Project naam
- 1-zin tagline
- Type: microtool | SaaS | experiment | evolving
- Probleem (kort)
- Oplossing (kort)
- Wat maakt het mogelijk (kort)
- Tools gebruikt (multi-select)
- Links (demo/github/website)
- Builder naam + e-mail
- Duidelijkheid: “We reviewen alles. Geen spam.”

CTA:
- "Verstuur build"

States:
- Success: “Bedankt — je build staat in review.”
- Error: inline validation

---

## Data
- write to `submissions` with status `pending`

## i18n
- labels via translation keys

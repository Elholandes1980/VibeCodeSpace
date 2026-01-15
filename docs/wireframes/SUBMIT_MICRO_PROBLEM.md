# SUBMIT_MICRO_PROBLEM.md — Component-level wireframe (Airbnb-style)

## Route
- `/{locale}/submit/micro-problem`

## Goal
Hoge kwaliteit leads met lage frictie, zonder account verplichting.

---

## Components
### `PageHeader`
- Title: "Leg je micro-probleem voor"
- Subtitle: "Beschrijf je uitdaging en we bekijken wat de beste volgende stap is."

### `MultiStepForm`
- Progress indicator (Step 1/5)
- Back/Next
- Autosave (optional)
- Validation per step

#### Step 1 — Probleem
- Prompt: "Wat probeer je op te lossen?"
- Textarea (min 50 chars)
- Examples block (2–3 voorbeelden)

#### Step 2 — Context
- Category multi-select
- Type:
  - One-off / tijdelijk
  - Herhalend
  - Potentieel product

#### Step 3 — Urgentie & scope
- Urgentie: deze week / deze maand / geen deadline
- Scope: klein (uren) / medium (dagen) / groter (weken)

#### Step 4 — Locatie & organisatie
- Land (dropdown)
- Voorkeurstaal
- Industrie (dropdown)
- Bedrijfsgrootte
- Datasensitiviteit (low/medium/high)

#### Step 5 — Delen & contact
- Sharing preference:
  - Alleen VibeCodeSpace
  - Alleen betaald netwerk
  - Open voor community (curated)
- Budgetrange (optioneel)
- Naam
- E-mail

CTA:
- "Dien probleem in"

### `AfterSubmit`
- “Bedankt. Je aanvraag staat in review.”
- “We nemen contact op met de beste volgende stap.”

---

## Data
- write to `microProblems` status `new`

## Access
- Anyone can submit (rate-limited)
- Only admin/editor can view all
- Paid pool visibility later

## i18n
- Copy keys + NL default

# CONTACT.md — Component-level wireframe

## Route
- `/{locale}/contact`

---

## Components
### `PageHeader`
- Title: "Contact"
- Subtitle: "Stuur een bericht of pitch je tool/opleiding."

### `ContactForm`
- Naam
- E-mail
- Onderwerp (dropdown): algemeen | partnership | enterprise | anders
- Bericht
- CTA: "Verstuur"

### `DirectLinks` (optional)
- “Partnerships” → /pricing
- “Micro-probleem” → /submit/micro-problem

---

## Data
- store in `leads` (optional) OR send email + store record in Payload for pipeline

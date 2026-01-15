# HOME.md — Component-level wireframe (NL bron, i18n-ready)

## Route
- `/{locale}/` (locale: nl|en|es)

## SEO
- Title (NL): "VibeCodeSpace — software gebouwd in het vibecoding-tijdperk"
- Meta description (NL): "Ontdek purpose-built microtools en vibecoded SaaS, curated updates en een workspace voor prompts en ideeën."
- OG: title/description + image

---

## Layout
### 1) `SiteHeader`
**Props**
- locale
- user (optional)
- navItems (Explore, Pulse, Pricing, Submit, Workspace*, About)
- CTA button: "Dien een micro-probleem in"

**Behaviors**
- Sticky on scroll (optional)
- Mobile drawer nav
- Language switcher

---

### 2) `HeroSection`
**Copy (NL)**
- H1: "Software gebouwd in het vibecoding-tijdperk"
- Subhead: "Van purpose-built microtools tot vibecoded SaaS. Gecureerd, contextueel en echt."
- Body: "Ontdek wat makers bouwen, blijf op de hoogte met een curated digest, of leg je micro-probleem voor."

**CTAs**
- Primary: "Bekijk cases" → `/explore`
- Primary 2: "Dien een micro-probleem in" → `/submit/micro-problem`
- Secondary: "Bekijk pricing" → `/pricing`

**States**
- none

---

### 3) `ValuePropsGrid`
3 cards:
1. "Voor builders" — "Deel je build, krijg zichtbaarheid met context."
2. "Voor ondernemers" — "Dien een micro-probleem in, ontvang gecureerde opties."
3. "Voor tools & SaaS" — "Zichtbaarheid in echte cases, geen spam."

---

### 4) `FeaturedCases`
**Data**
- query: cases where `featured=true` OR `editorsPick=true`
- limit: 6

**Components**
- `CaseCard` x6
  - title
  - tagline
  - label chips: type/status + editorsPick/promoted
  - tools chips (max 3)
- CTA: "Bekijk alle cases"

**Empty state**
- toon skeletons, daarna fallback: “Nog geen uitgelichte cases — kom binnenkort terug.”

---

### 5) `PulsePreview`
**Data**
- query: pulseItems where `curationStatus=featured`
- limit: 5

**Components**
- `PulseItemRow` x5: title, date, source, 1-zin summary
- CTA: "Bekijk Pulse"
- Optional: email capture “Ontvang de digest” → `/pulse#digest`

---

### 6) `PricingPreview`
**Components**
- `PricingCardMini` x3: Free, Pro, Studio
- CTA: "Bekijk alle pakketten" → `/pricing`

---

### 7) `MicroProblemCTA`
**Copy**
- Title: "Heb je een concreet micro-probleem?"
- Body: "Beschrijf je uitdaging en wij bekijken wat de beste volgende stap is."
- CTA: "Dien een micro-probleem in"

---

### 8) `SiteFooter`
- Links: Contact, About, Privacy, Terms
- Social links (optional)

---

## Tracking (minimal)
- CTA clicks (cases / micro-problem / pricing)
- Featured case card clicks

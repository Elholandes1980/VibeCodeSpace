# VibeCodeSpace – Masterplan (Claude-ready)

> **Taal**: Nederlands (bron).  
> **i18n**: alle copy/labels/SEO moeten later ook EN + ES ondersteunen via Payload localization + app routing.  
> **Positionering extern**: *purpose-built software* / *built in the vibecoding era*.  
> **Interne term**: disposable software (niet gebruiken in publieke hero-copy).

---

## 1) North Star
VibeCodeSpace is een gecureerde portal die laat zien hoe software ontstaat in het vibecoding-tijdperk:
van purpose-built microtools tot vibecoded SaaS/startups.

Het platform combineert:
1. **Showcase** (Cases): wat is er gebouwd, waarom, wat maakt het mogelijk?
2. **Pulse** (Curated digest): wat moet je weten (niet alles wat er gebeurt).
3. **Workspace** (Members): prompts, notities, bookmarks, collecties.
4. **Micro-probleem intake** (Lead generator): bedrijven/ondernemers sturen micro-problemen in; jij curateert; betaalde tiers krijgen toegang tot reageren/matching.

**Operationeel doel:** minimale dagelijkse workload voor eigenaar (curator), maximale levendigheid door bijdragen van anderen.

---

## 2) Kernprincipes (Speed-first + Enterprise UX)
### Performance budget
- Initial load (p75): **< 1.5s**
- Interaction response: **< 100ms**
- Data viz render: **< 500ms**
- JS initial bundle: **< 200KB gz** (streef)
- Afbeeldingen: AVIF/WebP, lazy
- Fonts: variable fonts, preload waar nodig, FOUT strategie

### UX patterns (2025–2026)
- Predictable navigation (Citrix patroon)
- Contextual actions altijd zichtbaar
- Undo/redo waar logisch (minimaal in editors)
- Keyboard shortcuts (later: Cmd+K)
- Touch targets ≥ 44px
- 8px spacing system

### Architectuur & codekwaliteit
- Feature-based modules
- File size limits: target <300 lines (warning 300–500, error >500)
- Eén verantwoordelijkheid per file
- “Container/Presenter” waar nuttig
- TypeScript strict
- Defensive programming + error boundaries
- Tests: unit (utils), component (kritische UI), smoke (routing)

---

## 3) Productlagen (scope)
### Laag A — Showcase (public)
- Cases index + filters
- Case detail (context, stack, learnings)
- Tools index (alleen tools die in cases voorkomen)
- Kits (jouw verdieping: cursussen, templates, learning paths)
- Submit build (moderation queue)

### Laag B — Pulse (curated digest)
- Ingestion: officiële bronnen + changelogs + select X-accounts (whitelist)
- Curation: queue → reviewed/featured/ignore
- Output: “Weekly digest” + Pulse pagina

### Laag C — Workspace & Matching (members)
- Prompt vault (tags, tool-context)
- Notes (markdown + links naar cases/tools/pulse)
- Bookmarks + collections
- Micro-probleem intake (open formulier)
- Reageren/matching (betaalde tiers; later uitbreiden)

---

## 4) Monetization (tiers)
### Free
- Explore: cases + pulse lezen
- 1 build insturen
- 1 micro-probleem insturen (lead)
- Workspace beperkt (bijv. 10 prompts, 20 bookmarks)

### Pro (± €12–15/m)
- Unlimited prompts/notes/bookmarks
- Collections
- Builder profile
- Light analytics (views/clicks op eigen case)

### Studio (± €49–99/m)
- Promoted case (curated)
- Featured placement (rotatie)
- Reageren op micro-problemen (paid pool)
- Analytics dashboard

### Enterprise (custom)
- Exclusieve matching
- Pulse spotlight (1×/maand)
- Co-created case/kit
- Priority placement

---

## 5) Tech stack (aanbevolen)
### Frontend
- **Next.js (App Router)**
- React Server Components default
- shadcn/ui + Radix (a11y)
- Tailwind (8px grid)

### CMS + content workflow
- **Payload CMS (Next.js-native)**  
  - Collections: cases/tools/kits/pulse/microProblems/promotions
  - Localization velden per taal (NL/EN/ES)

### Auth
- **Clerk** (identity provider: login/sessions/MFA)  
- Payload gebruikt `profiles` collection (clerkUserId) voor roles/plan/entitlements.

### Billing
- **Stripe** (subscriptions + checkout + webhooks)

### Database + storage
- **Postgres** (managed)
- Object storage (R2/S3) voor assets (later; MVP links-only)

---

## 6) Security baseline
- Moderation queue voor builds en promoted content
- Rate limiting op forms (submit build, micro-problem, contact)
- Markdown sanitization
- No auto-publish
- Privé data (prompts/notes/bookmarks) alleen owner/admin (Payload access rules + server-side enforcement)
- Stripe = source-of-truth voor subscription status (webhooks → entitlements)

---

## 7) Multilanguage workflow (NL → EN/ES)
- NL is broncontent
- Auto-translate on publish (eerst alleen title/tagline/summary; body later)
- Fallback: toon NL als EN/ES ontbreekt
- URL routing: `/{locale}/...` of locale subpath per Next i18n

---

## 8) Minimale workload eigenaar
Wekelijks (batch):
- Submissions review (15 min)
- Pulse queue selectie (15 min)
- Promotions check (5 min)

Geen:
- forum moderatie
- realtime chat
- dagelijkse content

---

## 9) Deliverables (in deze repo)
- Component-level wireframes per pagina
- Build instructions (stack, setup, CI/CD, deploy)
- Architecture guidelines (file structure + rules)

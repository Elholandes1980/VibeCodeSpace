# BUILD_INSTRUCTIONS.md (Claude-ready)

> Doel: dit document is de “single source of truth” voor hoe we VibeCodeSpace snel, veilig en schaalbaar bouwen en deployen.

---

## 0) Stack (definitief)
- Next.js (App Router, RSC-first)
- Payload CMS (in dezelfde Next app)
- Clerk (auth)
- Stripe (billing)
- Postgres (managed)
- Vercel (hosting) + object storage (R2/S3) optioneel

---

## 1) Repo structuur (feature-based, schaalbaar)
Aanbevolen:

```
/app
  /(public)
  /(workspace)
  /(marketing)
  /(api)
/features
  /cases
  /pulse
  /tools
  /kits
  /workspace
  /billing
  /microProblems
/lib
  /auth
  /cms
  /billing
  /i18n
  /mail
  /perf
/payload
  /collections
  /access
  /hooks
  /jobs
/docs
  VIBECODESPACE-MASTERPLAN.md
  BUILD_INSTRUCTIONS.md
  /wireframes
/scripts
  check-architecture.ts
  generate-component.ts
```

---

## 2) Clean architecture rules (enforcement)
### File size
- Target: <300 lines
- Warning: 300–500
- Error: >500 (split required)

### Module rules
Voor elke feature:

```
feature/
  types/
  utils/
  hooks/
  components/
  FeaturePage.tsx
```

### Import discipline
1) React
2) third-party
3) internal libs
4) feature hooks/utils
5) feature components
6) types

### Anti-patterns
- God components
- Prop drilling > 2 levels (gebruik composition/context waar logisch)
- `export *` in barrels (vermijden)
- Inline business logic in UI components (naar hooks/utils)

---

## 3) UI stack & standards
- shadcn/ui + Radix
- Tailwind: 8px grid
- A11y: WCAG AA/AAA waar haalbaar
- Touch targets: 44px
- Animaties: micro-interactions, 60fps, functioneel

---

## 4) Performance budget (hard)
- Initial load p75 < 1.5s
- JS initial bundle < 200KB gz (streef)
- Images: AVIF/WebP + lazy + responsive sizes
- Fonts: variable + preload waar nodig
- Route-level code split
- RSC default; client components alleen waar nodig

### Monitoring
- Lighthouse CI (optional)
- Next.js bundle analyzer in CI (fail op regressie)

---

## 5) Auth & roles (Clerk + Payload)
### Identity
- Clerk is de identity provider.
- In Payload: `profiles` collection met `clerkUserId`.

### Entitlements
- `profiles.plan`: free | pro | studio | enterprise
- `profiles.roles`: admin | editor | partner | member

### Access control
- Public: cases/tools/kits/pulseItems (read)
- Submissions + microProblems: create public (rate limit); read admin/editor
- Workspace: prompts/notes/bookmarks read/write owner/admin
- Studio-only: reageren op microProblems (paid pool)

---

## 6) Billing (Stripe)
- Stripe Checkout voor aankoop
- Stripe webhooks:
  - subscription created/updated/canceled
  - payment succeeded/failed
- Webhook handler update:
  - `profiles.plan`
  - `profiles.entitlements`

### Trial
- Plan-level trial in Stripe
- UI: “Start proefperiode” bij Pro/Studio

---

## 7) Payload CMS setup
### Collections (minimum)
- cases
- tools
- kits
- pulseSources
- pulseItems
- submissions
- microProblems
- promotions
- profiles
- prompts
- notes
- bookmarks

### Localization
- Enable localization op contentvelden (NL/EN/ES)
- NL default

### Moderation queues
- submissions.status: pending|approved|rejected
- pulseItems.curationStatus: queued|reviewed|featured|ignored
- promotions.status: pending|active|ended

---

## 8) Pulse ingestion (Model A: curated digest)
- Cron job 2× per dag
- Bronnen:
  - official pages
  - changelogs (RSS/GitHub releases)
  - X whitelist (select accounts + caching)
- Dedupe op URL/hash
- Queue: `pulseItems` met status `queued`
- Admin curation UI: bulk actions

### Weekly digest email
- Mail provider: Resend (of Sendgrid)
- Digest template: 5–10 items, per thema

---

## 9) Micro-probleem intake (Airbnb-style form)
- Multi-step form (5 stappen)
- Valideer minimaal: probleemomschrijving + land + e-mail
- sharingPreference:
  - private
  - paid_pool
  - community
- Status pipeline:
  - new → reviewed → needs_clarification → matched → in_progress → closed

---

## 10) CI/CD
### Checks
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm check:arch` (file size + headers)
- `pnpm build` (Next)

### Release process
- main branch → Vercel production
- preview deployments per PR

---

## 11) Deploy (Vercel + Postgres)
### Env vars (minimum)
- DATABASE_URL
- PAYLOAD_SECRET
- CLERK_SECRET_KEY
- CLERK_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
- RESEND_API_KEY (optional)

### Postgres
- Managed Postgres (Neon/Supabase/RDS)
- Migrations: via Payload/DB tooling (documenteer in /docs)

### Rollback
- Vercel rollback to previous deployment
- Stripe webhooks idempotent (store event IDs)

---

## 12) Security checklist (pre-launch)
- Rate limit forms
- CSRF safe for mutations (Next route handlers)
- Sanitize markdown rendering
- No public write endpoints behalve forms
- Admin routes behind role checks
- Audit logs (later, optional)

---

## 13) Definition of Done (MVP)
- Public explore + case detail
- Submit build → moderation queue
- Micro-problem intake → pipeline in CMS
- Pricing page + Stripe checkout (Pro/Studio)
- Basic workspace (prompts + bookmarks)
- Pulse page + weekly digest (manual selection)
- Multilanguage-ready (NL content + fields for EN/ES)

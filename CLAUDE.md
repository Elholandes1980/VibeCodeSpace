# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeCodeSpace is a curated portal showcasing software built in the "vibecoding era" (AI-assisted development). It combines:
- **Showcase (Cases)**: Featured builds with context, stack, learnings
- **Pulse**: Curated digest of AI/coding developments
- **Workspace**: Member prompts, notes, bookmarks
- **Micro-problem intake**: Lead generation via problem submissions

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
pnpm check:arch   # Architecture enforcement (file size + headers)
```

## Architecture

### Dual Data Layer
- **Convex**: Primary data store for app data (cases, tools, profiles, etc.)
- **Payload CMS (SQLite)**: Admin/editorial control only. Uses SQLite for lightweight local storage.

### Directory Structure
```
/app
  /(frontend)           # Public-facing routes
    /(public)/[locale]  # Localized public pages (explore, tools, pulse, about)
    /(api)              # API routes
  /(payload)            # Payload CMS admin routes
/features               # Feature modules (cases, pulse, tools, workspace, billing)
/components             # Shared UI components (shadcn/ui)
/lib                    # Shared utilities, auth, i18n, Convex client
/payload                # Payload collections and access rules
/convex                 # Convex schema and functions
/scripts                # Build/check scripts
```

### Feature Module Structure
Each feature in `/features/<name>/` follows:
```
types/       # TypeScript interfaces
utils/       # Pure functions (no side effects)
hooks/       # Data fetching, state, business logic
components/  # Presentational UI
<Name>Page.tsx
index.ts
```

## Code Conventions

### File Headers (Required)
Every `.ts`/`.tsx` file must start with a header comment:
```ts
/**
 * path/to/file.tsx
 *
 * What does this file do? (1-2 sentences)
 * Why does this exist? What responsibility?
 *
 * Related:
 * - path/to/related-1.ts
 */
```

### File Size Limits
- Target: < 300 lines
- Warning: 300-500 lines
- Error: > 500 lines (split required)

### Import Order
1. React/Next
2. Third-party libs
3. Internal libs (`/lib/*`)
4. Feature hooks/utils
5. Feature components
6. Types (type-only imports)

### Component Guidelines
- One component per file
- Props interface at top
- Minimal logic in component (delegate to hooks/utils)
- Split when: > 250 lines, multiple responsibilities, or complex conditionals

## Tech Stack
- **Framework**: Next.js 15+ (App Router, RSC-first)
- **UI**: shadcn/ui + Radix, Tailwind (8px grid)
- **Database**: Convex (app data), SQLite via Payload (admin)
- **Auth**: Clerk (planned)
- **Billing**: Stripe (planned)
- **i18n**: NL default, EN/ES support via `[locale]` routing

## Performance Budget
- Initial load p75: < 1.5s
- JS bundle: < 200KB gzipped (target)
- Images: AVIF/WebP, lazy loading
- Use React Server Components by default; client components only when needed

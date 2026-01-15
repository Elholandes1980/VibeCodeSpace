/**
 * app/page.tsx
 *
 * Root page that redirects to the default locale.
 * This ensures visitors to / are sent to /nl.
 *
 * Related:
 * - middleware.ts
 * - app/(public)/[locale]/page.tsx
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/nl')
}

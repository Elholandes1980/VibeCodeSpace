/**
 * middleware.ts
 *
 * Next.js middleware for handling root redirect to default locale.
 * Redirects / to /nl (default locale).
 *
 * Related:
 * - app/(public)/[locale]/layout.tsx
 * - lib/i18n/config.ts
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_LOCALE = 'nl'
export const SUPPORTED_LOCALES = ['nl', 'en', 'es'] as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run on root path
  matcher: '/',
}

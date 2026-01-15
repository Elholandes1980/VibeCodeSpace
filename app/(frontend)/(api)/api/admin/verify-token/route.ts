/**
 * app/(frontend)/(api)/api/admin/verify-token/route.ts
 *
 * API route to verify admin token and set cookie.
 * Simple token comparison - no auth provider.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/admin/intakes/AdminLoginForm.tsx
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const adminToken = process.env.ADMIN_ACCESS_TOKEN

  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin access not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { token } = body

    if (token === adminToken) {
      const cookieStore = await cookies()
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

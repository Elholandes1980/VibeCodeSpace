/**
 * app/(frontend)/(public)/[locale]/admin/intakes/page.tsx
 *
 * Admin page for managing problem intakes.
 * Protected by ADMIN_ACCESS_TOKEN via cookie.
 *
 * Related:
 * - features/intakes-admin/index.ts
 * - app/(frontend)/(public)/[locale]/admin/intakes/IntakesAdminContent.tsx
 */

import { cookies } from 'next/headers'
import { IntakesAdminContent } from './IntakesAdminContent'
import { AdminLoginForm } from './AdminLoginForm'

interface PageProps {
  params: Promise<{ locale: string }>
}

async function isAuthenticated(): Promise<boolean> {
  const adminToken = process.env.ADMIN_ACCESS_TOKEN
  if (!adminToken) {
    console.warn('[admin/intakes] ADMIN_ACCESS_TOKEN not configured')
    return false
  }

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('admin_token')

  return tokenCookie?.value === adminToken
}

export default async function IntakesAdminPage({ params }: PageProps) {
  const { locale } = await params
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return (
      <div className="container max-w-md py-16">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-4 text-xl font-semibold">Admin Access Required</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter the admin access token to continue.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <IntakesAdminContent locale={locale} />
    </div>
  )
}

export const metadata = {
  title: 'Intakes Admin',
  description: 'Manage problem intake submissions',
}

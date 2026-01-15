/**
 * app/(frontend)/(api)/api/admin/create-case/route.ts
 *
 * API route to create a Payload Case from an accepted intake.
 * Creates draft case with NL content and placeholder translations.
 *
 * Related:
 * - payload/collections/Cases.ts
 * - features/intakes-admin/components/IntakeDetail.tsx
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40)

  const suffix = Math.random().toString(36).substring(2, 8)
  return `${base}-${suffix}`
}

export async function POST(request: Request) {
  // Verify admin token
  const adminToken = process.env.ADMIN_ACCESS_TOKEN
  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin access not configured' },
      { status: 500 }
    )
  }

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('admin_token')

  if (tokenCookie?.value !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { intakeId, title, problemDescription, desiredOutcome } = body

    if (!intakeId || !title || !problemDescription || !desiredOutcome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Create case in NL (auto-translate hook will handle EN/ES)
    const newCase = await payload.create({
      collection: 'cases',
      locale: 'nl',
      data: {
        slug: generateSlug(title),
        status: 'draft',
        visibility: 'public',
        source: 'community',
        title: title,
        oneLiner: 'Micro-oplossing aangevraagd via VibeCodeSpace',
        problem: problemDescription,
        solution: desiredOutcome,
        learnings: '',
      },
    })

    return NextResponse.json({
      success: true,
      caseId: newCase.id,
      slug: newCase.slug,
    })
  } catch (error) {
    console.error('[create-case] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    )
  }
}

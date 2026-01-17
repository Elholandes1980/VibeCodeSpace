/**
 * app/(frontend)/(api)/api/cron/pulse-ingest/route.ts
 *
 * Vercel Cron endpoint for automated Pulse content ingestion.
 * Runs every 2 hours to fetch and process new content from RSS feeds.
 * Protected by CRON_SECRET environment variable.
 *
 * Related:
 * - lib/services/pulse-ingest.ts (core logic)
 * - vercel.json (cron configuration)
 */

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes max

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production, require CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check required environment variables
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  try {
    // Dynamic import to avoid loading Payload at module level
    const { ingestPulseItems } = await import('@/lib/services/pulse-ingest')
    const stats = await ingestPulseItems()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats,
    })
  } catch (error) {
    console.error('Pulse ingestion failed:', error)
    return NextResponse.json(
      {
        error: 'Ingestion failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

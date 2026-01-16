/**
 * app/api/db-check/route.ts
 * Debug endpoint to check database contents on Vercel
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const cats = await payload.find({ collection: 'tool-categories', limit: 0 })
    const tools = await payload.find({ collection: 'tools', limit: 0 })
    const cases = await payload.find({ collection: 'cases', limit: 100, locale: 'nl' })

    // Get case details
    const caseDetails = cases.docs.map(c => ({
      slug: c.slug,
      problemLength: c.problem ? String(c.problem).length : 0,
      solutionLength: c.solution ? String(c.solution).length : 0,
    }))

    return NextResponse.json({
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
      categories: cats.totalDocs,
      tools: tools.totalDocs,
      cases: cases.totalDocs,
      caseDetails,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

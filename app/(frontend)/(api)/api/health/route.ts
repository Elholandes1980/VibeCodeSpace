/**
 * app/(api)/api/health/route.ts
 *
 * Health check endpoint for monitoring and deployment verification.
 * Returns simple JSON status response.
 *
 * Related:
 * - docs/BUILD_INSTRUCTIONS.md
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}

/**
 * scripts/pulse-ingest.ts
 *
 * CLI wrapper for Pulse content ingestion.
 * Loads environment variables and runs the ingestion.
 *
 * Run: npx tsx scripts/pulse-ingest.ts
 *
 * Related:
 * - lib/services/pulse-ingest.ts (core logic)
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set!')
  process.exit(1)
}

import { ingestPulseItems } from '../lib/services/pulse-ingest'

ingestPulseItems()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Ingestion failed:', err)
    process.exit(1)
  })

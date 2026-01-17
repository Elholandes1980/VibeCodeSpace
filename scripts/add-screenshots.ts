/**
 * scripts/add-screenshots.ts
 *
 * Adds screenshot URLs to all existing tools.
 * Run with: DATABASE_URL="..." npx tsx scripts/add-screenshots.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}

import { getPayload } from 'payload'
import config from '../payload.config'

function getScreenshotUrl(websiteUrl: string): string {
  // thum.io expects URL without encoding
  return `https://image.thum.io/get/width/1200/crop/630/${websiteUrl}`
}

async function addScreenshots() {
  console.log('📸 Adding screenshot URLs to tools...\n')

  const payload = await getPayload({ config })

  const tools = await payload.find({
    collection: 'tools',
    limit: 100,
    locale: 'nl',
  })

  console.log(`Found ${tools.docs.length} tools\n`)

  let updated = 0

  for (const tool of tools.docs) {
    const websiteUrl = tool.websiteUrl as string | undefined

    if (websiteUrl && !tool.screenshotUrl) {
      const screenshotUrl = getScreenshotUrl(websiteUrl)

      await payload.update({
        collection: 'tools',
        id: tool.id,
        data: { screenshotUrl },
        context: { skipTranslation: true, skipIngest: true },
      })

      console.log(`✓ ${tool.name}`)
      updated++
    }
  }

  console.log(`\n✅ Added screenshots to ${updated} tools`)
  process.exit(0)
}

addScreenshots().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

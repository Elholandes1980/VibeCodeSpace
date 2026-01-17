/**
 * scripts/download-screenshots.ts
 *
 * Downloads screenshot images and uploads them as featured images for tools.
 * Run with: DATABASE_URL="..." npx tsx scripts/download-screenshots.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}

import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import os from 'os'

function getScreenshotUrl(websiteUrl: string): string {
  // thum.io expects URL without encoding
  return `https://image.thum.io/get/width/1200/crop/630/${websiteUrl}`
}

async function downloadImage(url: string, filename: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; VibeCodeSpace/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`)
  }

  const buffer = await response.arrayBuffer()
  const tempPath = path.join(os.tmpdir(), filename)
  fs.writeFileSync(tempPath, Buffer.from(buffer))

  return tempPath
}

async function downloadScreenshots() {
  console.log('📸 Downloading screenshots as featured images...\n')

  const payload = await getPayload({ config })

  const tools = await payload.find({
    collection: 'tools',
    limit: 100,
    locale: 'nl',
  })

  console.log(`Found ${tools.docs.length} tools\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const tool of tools.docs) {
    const websiteUrl = tool.websiteUrl as string | undefined
    const slug = tool.slug as string
    const name = tool.name as string

    // Skip if already has featured image
    if (tool.featuredImage) {
      console.log(`⏭ ${name} (already has featured image)`)
      skipped++
      continue
    }

    // Skip if no website URL
    if (!websiteUrl) {
      console.log(`⏭ ${name} (no website URL)`)
      skipped++
      continue
    }

    try {
      console.log(`📥 Downloading: ${name}...`)

      // Generate and download the screenshot
      const screenshotUrl = getScreenshotUrl(websiteUrl)
      const filename = `tool-${slug}-screenshot.png`
      const tempPath = await downloadImage(screenshotUrl, filename)

      // Create media document
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `Screenshot of ${name}`,
        },
        filePath: tempPath,
      })

      // Update tool with featured image
      await payload.update({
        collection: 'tools',
        id: tool.id,
        data: {
          featuredImage: media.id,
        },
        context: { skipTranslation: true, skipIngest: true },
      })

      // Clean up temp file
      fs.unlinkSync(tempPath)

      console.log(`✓ ${name}`)
      updated++

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500))
    } catch (error) {
      console.error(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed: ${failed}`)

  process.exit(0)
}

downloadScreenshots().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

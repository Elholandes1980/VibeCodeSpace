/**
 * scripts/fix-media-urls.ts
 *
 * Fixes media URLs to point to Vercel Blob storage.
 * Run with: npx tsx scripts/fix-media-urls.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { list } from '@vercel/blob'
import { getPayload } from 'payload'
import config from '../payload.config'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

async function fixMediaUrls() {
  console.log('🔧 Fixing media URLs to point to Vercel Blob...\n')

  if (!BLOB_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not set')
    process.exit(1)
  }

  // Get list of blobs
  const blobList = await list({ token: BLOB_TOKEN })
  const blobUrlMap = new Map<string, string>()

  for (const blob of blobList.blobs) {
    // Extract filename from pathname (e.g., "media/pitchdeck.jpg" -> "pitchdeck.jpg")
    const filename = blob.pathname.split('/').pop()
    if (filename) {
      blobUrlMap.set(filename, blob.url)
    }
  }

  console.log(`📦 Found ${blobUrlMap.size} blobs in storage`)

  const payload = await getPayload({ config })

  // Get all media records
  const media = await payload.find({
    collection: 'media',
    limit: 100,
  })

  console.log(`\n📝 Updating ${media.docs.length} media records...\n`)

  for (const doc of media.docs) {
    const filename = doc.filename as string

    // Try to find matching blob (with or without number suffix)
    let blobUrl = blobUrlMap.get(filename)

    // If not found, try base filename (e.g., "pitchdeck-2.jpg" -> "pitchdeck.jpg")
    if (!blobUrl) {
      const baseFilename = filename.replace(/-\d+\./, '.')
      blobUrl = blobUrlMap.get(baseFilename)
    }

    if (!blobUrl) {
      console.log(`   ⚠ No blob found for: ${filename}`)
      continue
    }

    // Check if URL needs updating
    if (doc.url === blobUrl) {
      console.log(`   ✓ Already correct: ${filename}`)
      continue
    }

    try {
      // Update the media record directly in database
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          url: blobUrl,
        },
      })

      console.log(`   ✓ Fixed: ${filename}`)
      console.log(`     ${doc.url} -> ${blobUrl}`)
    } catch (error) {
      console.error(`   ❌ Failed to update ${filename}:`, error)
    }
  }

  console.log('\n✅ URL fix complete!')
  process.exit(0)
}

fixMediaUrls().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

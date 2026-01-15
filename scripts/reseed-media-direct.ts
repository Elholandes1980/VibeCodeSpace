/**
 * scripts/reseed-media-direct.ts
 *
 * Directly uploads images to Vercel Blob and updates database URLs.
 * Bypasses Payload's upload system for direct blob storage.
 * Run with: npx tsx scripts/reseed-media-direct.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { put, del, list } from '@vercel/blob'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

const LOCAL_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'demo')
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

async function reseedMediaDirect() {
  console.log('🖼️  Re-seeding media directly to Vercel Blob...\n')

  if (!BLOB_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not set')
    process.exit(1)
  }

  // Clean up existing blobs
  console.log('🗑️  Cleaning up existing blobs...')
  const existingBlobs = await list({ token: BLOB_TOKEN })
  for (const blob of existingBlobs.blobs) {
    if (blob.pathname.startsWith('media/')) {
      await del(blob.url, { token: BLOB_TOKEN })
      console.log(`   ✓ Deleted: ${blob.pathname}`)
    }
  }

  const payload = await getPayload({ config })

  // Delete existing media records
  console.log('\n🗑️  Deleting existing media records...')
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 100,
  })

  for (const media of existingMedia.docs) {
    await payload.delete({
      collection: 'media',
      id: media.id,
    })
    console.log(`   ✓ Deleted record: ${media.filename}`)
  }

  // Get all cases
  const cases = await payload.find({
    collection: 'cases',
    limit: 100,
    depth: 0,
  })

  console.log(`\n📤 Uploading ${cases.docs.length} images to Vercel Blob...`)

  for (const caseDoc of cases.docs) {
    const slug = caseDoc.slug as string

    // Find local image
    let imagePath = path.join(LOCAL_IMAGES_DIR, `${slug}.jpg`)
    if (!fs.existsSync(imagePath)) {
      imagePath = path.join(LOCAL_IMAGES_DIR, `${slug}.png`)
    }

    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠ No image found for: ${caseDoc.title}`)
      continue
    }

    try {
      // Upload to Vercel Blob
      const fileBuffer = fs.readFileSync(imagePath)
      const filename = path.basename(imagePath)
      const blobPath = `media/${filename}`

      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        token: BLOB_TOKEN,
      })

      // Create media record with blob URL
      const media = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: `Featured image for ${caseDoc.title}`,
          source: 'upload',
          filename: filename,
          mimeType: 'image/jpeg',
          filesize: fileBuffer.length,
          url: blob.url,
        },
      })

      // Update case with new media ID
      await payload.update({
        collection: 'cases',
        id: caseDoc.id,
        data: {
          featuredImage: media.id,
        },
      })

      console.log(`   ✓ ${slug} -> ${blob.url}`)
    } catch (error) {
      console.error(`   ❌ Failed ${slug}:`, error)
    }
  }

  console.log('\n✅ Media re-seeding complete!')
  console.log('\n🌐 Images are now in Vercel Blob storage')

  process.exit(0)
}

reseedMediaDirect().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

/**
 * scripts/reseed-media.ts
 *
 * Re-uploads case images to Vercel Blob storage.
 * Deletes existing media and re-creates with cloud storage.
 * Run with: npx tsx scripts/reseed-media.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

const LOCAL_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'demo')

async function reseedMedia() {
  console.log('🖼️  Re-seeding media to cloud storage...\n')

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not set in .env.local')
    process.exit(1)
  }

  console.log('✓ BLOB_READ_WRITE_TOKEN is set')

  const payload = await getPayload({ config })

  // Get all cases with their media
  const cases = await payload.find({
    collection: 'cases',
    limit: 100,
    depth: 1,
  })

  console.log(`\n📦 Found ${cases.docs.length} cases`)

  // Delete existing media
  console.log('\n🗑️  Deleting existing media...')
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 100,
  })

  for (const media of existingMedia.docs) {
    await payload.delete({
      collection: 'media',
      id: media.id,
    })
    console.log(`   ✓ Deleted: ${media.filename}`)
  }

  // Re-upload images for each case
  console.log('\n📤 Uploading images to cloud storage...')

  for (const caseDoc of cases.docs) {
    const slug = caseDoc.slug

    // Check for local image
    let imagePath = path.join(LOCAL_IMAGES_DIR, `${slug}.jpg`)
    if (!fs.existsSync(imagePath)) {
      imagePath = path.join(LOCAL_IMAGES_DIR, `${slug}.png`)
    }

    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠ No image found for: ${caseDoc.title}`)
      continue
    }

    try {
      // Upload to cloud storage
      const media = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: `Featured image for ${caseDoc.title}`,
          source: 'upload',
        },
        filePath: imagePath,
      })

      // Update case with new media ID
      await payload.update({
        collection: 'cases',
        id: caseDoc.id,
        data: {
          featuredImage: media.id,
        },
      })

      console.log(`   ✓ Uploaded: ${slug} -> ${media.url}`)
    } catch (error) {
      console.error(`   ❌ Failed to upload ${slug}:`, error)
    }
  }

  console.log('\n✅ Media re-seeding complete!')
  console.log('\n🌐 Images are now stored in Vercel Blob storage')

  // Clean up temp blob file
  const envBlob = path.join(process.cwd(), '.env.blob')
  if (fs.existsSync(envBlob)) {
    fs.unlinkSync(envBlob)
  }

  process.exit(0)
}

reseedMedia().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

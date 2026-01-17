/**
 * scripts/translate-tools.ts
 *
 * Translates all tools from NL to EN and ES.
 * Run after seeding to fill in translations.
 * Run with: DATABASE_URL="..." npx tsx scripts/translate-tools.ts
 */

// CRITICAL: Load env vars BEFORE any other imports
import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}
console.log('✓ DATABASE_URL loaded')

import { getPayload } from 'payload'
import config from '../payload.config'
import { translate } from '../lib/services/translate'
import type { TargetLocale } from '../lib/services/translate'

const TARGET_LOCALES: TargetLocale[] = ['en', 'es']
const FIELDS_TO_TRANSLATE = ['name', 'shortOneLiner', 'description', 'primaryUseCase']

async function translateTools() {
  console.log('🌐 Translating tools...\n')

  const payload = await getPayload({ config })

  // Get all tools
  const tools = await payload.find({
    collection: 'tools',
    limit: 100,
    locale: 'nl',
  })

  console.log(`Found ${tools.docs.length} tools\n`)

  let translated = 0
  let skipped = 0

  for (const tool of tools.docs) {
    const slug = tool.slug as string
    console.log(`\n📝 Processing: ${slug}`)

    for (const targetLocale of TARGET_LOCALES) {
      try {
        // Get existing translations
        const existing = await payload.findByID({
          collection: 'tools',
          id: tool.id,
          locale: targetLocale,
        })

        const translations: Record<string, string> = {}

        for (const field of FIELDS_TO_TRANSLATE) {
          const sourceText = tool[field] as string | undefined
          const existingText = existing[field] as string | undefined

          // Skip if no source text
          if (!sourceText || typeof sourceText !== 'string') {
            continue
          }

          // Check if existing is just fallback (same as NL source)
          // Payload returns NL content when target locale is empty
          const isFallback = existingText === sourceText

          // Skip if already translated (different from source and not a placeholder)
          if (existingText && !isFallback && !existingText.startsWith('[EN]') && !existingText.startsWith('[ES]')) {
            console.log(`  ⏭ ${field} already translated`)
            continue
          }

          try {
            const result = await translate(sourceText, targetLocale)
            translations[field] = result.text
            console.log(`  ✓ ${field} → ${targetLocale}`)
          } catch (error) {
            console.error(`  ❌ Failed: ${field} → ${targetLocale}`)
            translations[field] = `[${targetLocale.toUpperCase()}] ${sourceText}`
          }
        }

        if (Object.keys(translations).length > 0) {
          await payload.update({
            collection: 'tools',
            id: tool.id,
            locale: targetLocale,
            data: translations,
            context: { skipTranslation: true },
          })
          translated++
        } else {
          skipped++
        }
      } catch (error) {
        console.error(`  ❌ Error for ${targetLocale}:`, error)
      }
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200))
  }

  console.log(`\n✅ Translation complete!`)
  console.log(`   Translated: ${translated} locale updates`)
  console.log(`   Skipped (already done): ${skipped}`)

  process.exit(0)
}

translateTools().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})

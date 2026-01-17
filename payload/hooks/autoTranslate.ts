/**
 * payload/hooks/autoTranslate.ts
 *
 * Auto-translation hook for Cases collection.
 * When content is created/updated in NL (source locale),
 * automatically translates to EN and ES using configured provider.
 *
 * IMPORTANT: Translations run asynchronously (fire-and-forget) to avoid
 * blocking the database transaction and causing Neon timeout errors.
 *
 * Configuration:
 * - TRANSLATION_PROVIDER: 'openai' | 'deepl' | 'placeholder'
 * - OPENAI_API_KEY or DEEPL_API_KEY depending on provider
 *
 * Related:
 * - lib/services/translate.ts
 * - payload/collections/Cases.ts
 */

import type { CollectionAfterChangeHook, Payload } from 'payload'
import { translate } from '../../lib/services/translate'
import type { TargetLocale } from '../../lib/services/translate'

// Localized fields that need auto-translation
const LOCALIZED_FIELDS = ['title', 'oneLiner', 'problem', 'solution', 'learnings']
const TARGET_LOCALES: TargetLocale[] = ['en', 'es']
const SOURCE_LOCALE = 'nl'

/**
 * Perform translations in background (fire-and-forget).
 * This function is NOT awaited to prevent blocking the DB transaction.
 */
async function translateInBackground(
  payload: Payload,
  docId: string,
  slug: string,
  fieldsToTranslate: Record<string, string>
): Promise<void> {
  console.log(`[autoTranslate] Starting background translation for case: ${slug}`)

  for (const targetLocale of TARGET_LOCALES) {
    const translations: Record<string, string> = {}

    for (const [field, sourceText] of Object.entries(fieldsToTranslate)) {
      try {
        const result = await translate(sourceText, targetLocale)
        translations[field] = result.text
        console.log(`[autoTranslate] ${field} → ${targetLocale}: ${result.provider}`)
      } catch (error) {
        console.error(`[autoTranslate] Failed to translate ${field} to ${targetLocale}:`, error)
        translations[field] = `[${targetLocale.toUpperCase()}] ${sourceText}`
      }
    }

    if (Object.keys(translations).length > 0) {
      try {
        await payload.update({
          collection: 'cases',
          id: docId,
          locale: targetLocale,
          data: translations,
          context: { skipTranslation: true },
        })
        console.log(`[autoTranslate] Updated ${targetLocale} locale for case: ${slug}`)
      } catch (error) {
        console.error(`[autoTranslate] Failed to update ${targetLocale}:`, error)
      }
    }
  }

  console.log(`[autoTranslate] Completed background translation for case: ${slug}`)
}

/**
 * Hook that auto-translates NL content to EN and ES.
 * Translations run in background to avoid blocking DB transaction.
 */
export const autoTranslateHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  context,
}) => {
  const { payload } = req

  // Skip if this is a translation update (prevent infinite loop)
  if (context?.skipTranslation) {
    return doc
  }

  // Only process when editing in NL locale
  const currentLocale = req.locale || SOURCE_LOCALE
  if (currentLocale !== SOURCE_LOCALE) {
    return doc
  }

  if (!payload) {
    return doc
  }

  // Collect fields that need translation
  const fieldsToTranslate: Record<string, string> = {}

  for (const field of LOCALIZED_FIELDS) {
    const newValue = doc[field]

    if (!newValue || typeof newValue !== 'string') {
      continue
    }

    if (operation === 'create') {
      fieldsToTranslate[field] = newValue
    }

    if (operation === 'update' && previousDoc) {
      const oldValue = previousDoc[field]
      if (newValue !== oldValue) {
        fieldsToTranslate[field] = newValue
      }
    }
  }

  if (Object.keys(fieldsToTranslate).length === 0) {
    return doc
  }

  console.log(`[autoTranslate] Queuing ${Object.keys(fieldsToTranslate).length} fields for case: ${doc.slug}`)

  // Fire-and-forget: Start translation in background WITHOUT awaiting
  // This prevents blocking the database transaction
  translateInBackground(payload, doc.id, doc.slug as string, fieldsToTranslate).catch((error) => {
    console.error(`[autoTranslate] Background translation failed for ${doc.slug}:`, error)
  })

  // Return immediately - translations will complete in background
  return doc
}

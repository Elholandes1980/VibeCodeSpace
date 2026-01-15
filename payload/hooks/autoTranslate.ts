/**
 * payload/hooks/autoTranslate.ts
 *
 * Auto-translation hook for Cases collection.
 * When content is created/updated in NL (source locale),
 * automatically translates to EN and ES using configured provider.
 *
 * Uses afterChange hook to update translations after document is saved.
 *
 * Configuration:
 * - TRANSLATION_PROVIDER: 'openai' | 'deepl' | 'placeholder'
 * - OPENAI_API_KEY or DEEPL_API_KEY depending on provider
 *
 * Related:
 * - lib/services/translate.ts
 * - payload/collections/Cases.ts
 */

import type { CollectionAfterChangeHook } from 'payload'
import { translate } from '../../lib/services/translate'
import type { TargetLocale } from '../../lib/services/translate'

// Localized fields that need auto-translation
const LOCALIZED_FIELDS = ['title', 'oneLiner', 'problem', 'solution', 'learnings']
const TARGET_LOCALES: TargetLocale[] = ['en', 'es']
const SOURCE_LOCALE = 'nl'

/**
 * Hook that auto-translates NL content to EN and ES.
 * Runs after save to update other locales.
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

  // Only process when editing in NL locale or creating new
  const currentLocale = req.locale || SOURCE_LOCALE

  // Skip if not operating on source locale
  if (currentLocale !== SOURCE_LOCALE) {
    return doc
  }

  // Skip if no payload client (shouldn't happen, but safety check)
  if (!payload) {
    return doc
  }

  // Collect fields that need translation
  const fieldsToTranslate: Record<string, string> = {}

  for (const field of LOCALIZED_FIELDS) {
    const newValue = doc[field]

    // Skip empty fields
    if (!newValue || typeof newValue !== 'string') {
      continue
    }

    // For create: translate all fields
    if (operation === 'create') {
      fieldsToTranslate[field] = newValue
    }

    // For update: only translate changed fields
    if (operation === 'update' && previousDoc) {
      const oldValue = previousDoc[field]
      if (newValue !== oldValue) {
        fieldsToTranslate[field] = newValue
      }
    }
  }

  // If no fields to translate, return early
  if (Object.keys(fieldsToTranslate).length === 0) {
    return doc
  }

  console.log(`[autoTranslate] Translating ${Object.keys(fieldsToTranslate).length} fields for case: ${doc.slug}`)

  // Translate to each target locale
  for (const targetLocale of TARGET_LOCALES) {
    const translations: Record<string, string> = {}

    for (const [field, sourceText] of Object.entries(fieldsToTranslate)) {
      try {
        const result = await translate(sourceText, targetLocale)
        translations[field] = result.text
        console.log(`[autoTranslate] ${field} → ${targetLocale}: ${result.provider}`)
      } catch (error) {
        console.error(`[autoTranslate] Failed to translate ${field} to ${targetLocale}:`, error)
        // Use placeholder on error
        translations[field] = `[${targetLocale.toUpperCase()}] ${sourceText}`
      }
    }

    // Update the document with translations
    if (Object.keys(translations).length > 0) {
      try {
        await payload.update({
          collection: 'cases',
          id: doc.id,
          locale: targetLocale,
          data: translations,
          // Skip hooks to prevent infinite loop
          context: { skipTranslation: true },
        })
        console.log(`[autoTranslate] Updated ${targetLocale} locale for case: ${doc.slug}`)
      } catch (error) {
        console.error(`[autoTranslate] Failed to update ${targetLocale}:`, error)
      }
    }
  }

  return doc
}

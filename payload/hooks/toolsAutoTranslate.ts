/**
 * payload/hooks/toolsAutoTranslate.ts
 *
 * Auto-translation hook for Tools collection.
 * When content is created/updated in NL (source locale),
 * automatically translates to EN and ES using configured provider.
 *
 * IMPORTANT: Translations run asynchronously (fire-and-forget) to avoid
 * blocking the database transaction and causing Neon timeout errors.
 *
 * Related:
 * - lib/services/translate.ts
 * - payload/collections/Tools.ts
 * - payload/hooks/autoTranslate.ts (Cases version)
 */

import type { CollectionAfterChangeHook, Payload } from 'payload'
import { translate } from '../../lib/services/translate'
import type { TargetLocale } from '../../lib/services/translate'

// Simple localized fields (text/textarea)
// NOTE: 'name' is excluded - tool names are brand names and should NOT be translated
const SIMPLE_LOCALIZED_FIELDS = ['shortOneLiner', 'description', 'primaryUseCase']

// Array fields that need special handling
const ARRAY_LOCALIZED_FIELDS = ['bestFor', 'notFor', 'keyFeatures']

const TARGET_LOCALES: TargetLocale[] = ['en', 'es']
const SOURCE_LOCALE = 'nl'

/**
 * Translate array field items (bestFor, notFor bullets).
 */
async function translateArrayField(
  items: Array<{ point?: string; title?: string; detail?: string }> | undefined,
  targetLocale: TargetLocale,
  fieldType: 'bullets' | 'features'
): Promise<Array<{ point?: string; title?: string; detail?: string }>> {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return []
  }

  const translated: Array<{ point?: string; title?: string; detail?: string }> = []

  for (const item of items) {
    if (fieldType === 'bullets' && item.point) {
      const result = await translate(item.point, targetLocale)
      translated.push({ point: result.text })
    } else if (fieldType === 'features') {
      const translatedItem: { title?: string; detail?: string } = {}
      if (item.title) {
        const titleResult = await translate(item.title, targetLocale)
        translatedItem.title = titleResult.text
      }
      if (item.detail) {
        const detailResult = await translate(item.detail, targetLocale)
        translatedItem.detail = detailResult.text
      }
      if (translatedItem.title || translatedItem.detail) {
        translated.push(translatedItem)
      }
    }
  }

  return translated
}

/**
 * Perform translations in background (fire-and-forget).
 * This function is NOT awaited to prevent blocking the DB transaction.
 */
async function translateToolInBackground(
  payload: Payload,
  doc: Record<string, unknown>,
  fieldsToTranslate: Record<string, string>,
  arrayFieldsToTranslate: Record<string, unknown[]>
): Promise<void> {
  const slug = doc.slug as string
  console.log(`[toolsAutoTranslate] Starting background translation for tool: ${slug}`)

  for (const targetLocale of TARGET_LOCALES) {
    try {
      // Get current locale data to check what's already filled
      const existingData = await payload.findByID({
        collection: 'tools',
        id: doc.id as string,
        locale: targetLocale,
      })

      const translations: Record<string, unknown> = {}

      // Translate simple fields (only if empty or same as source = fallback)
      for (const [field, sourceText] of Object.entries(fieldsToTranslate)) {
        const existingValue = existingData[field]

        // Check if existing is fallback (same as source)
        const isFallback = existingValue === sourceText

        // Skip if already has different content (real translation exists)
        if (
          existingValue &&
          typeof existingValue === 'string' &&
          existingValue.trim() !== '' &&
          !isFallback &&
          !existingValue.startsWith('[EN]') &&
          !existingValue.startsWith('[ES]')
        ) {
          continue
        }

        try {
          const result = await translate(sourceText, targetLocale)
          translations[field] = result.text
          console.log(`[toolsAutoTranslate] ${field} → ${targetLocale}: ${result.provider}`)
        } catch (error) {
          console.error(`[toolsAutoTranslate] Failed to translate ${field}:`, error)
          translations[field] = `[${targetLocale.toUpperCase()}] ${sourceText}`
        }
      }

      // Translate array fields
      for (const [field, items] of Object.entries(arrayFieldsToTranslate)) {
        const existingArray = existingData[field] as unknown[] | undefined

        // Skip if target already has content
        if (existingArray && Array.isArray(existingArray) && existingArray.length > 0) {
          continue
        }

        try {
          const fieldType = field === 'keyFeatures' ? 'features' : 'bullets'
          const translated = await translateArrayField(
            items as Array<{ point?: string; title?: string; detail?: string }>,
            targetLocale,
            fieldType
          )
          if (translated.length > 0) {
            translations[field] = translated
            console.log(`[toolsAutoTranslate] ${field} → ${targetLocale}: ${translated.length} items`)
          }
        } catch (error) {
          console.error(`[toolsAutoTranslate] Failed to translate ${field}:`, error)
        }
      }

      // Update the document with translations
      if (Object.keys(translations).length > 0) {
        await payload.update({
          collection: 'tools',
          id: doc.id as string,
          locale: targetLocale,
          data: translations,
          context: { skipTranslation: true },
        })
        console.log(`[toolsAutoTranslate] Updated ${targetLocale} locale for tool: ${slug}`)
      }
    } catch (error) {
      console.error(`[toolsAutoTranslate] Failed to update ${targetLocale}:`, error)
    }
  }

  console.log(`[toolsAutoTranslate] Completed background translation for tool: ${slug}`)
}

/**
 * Hook that auto-translates NL content to EN and ES.
 * Translations run in background to avoid blocking DB transaction.
 */
export const toolsAutoTranslateHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const { payload } = req

  // Skip if triggered by translation update (prevent infinite loop)
  if (req.context?.skipTranslation) {
    return doc
  }

  // Only process when editing in NL locale
  const currentLocale = req.locale || SOURCE_LOCALE
  if (currentLocale !== SOURCE_LOCALE) {
    return doc
  }

  // Check if sync is enabled
  if (doc.syncTranslationsFromNL === false) {
    console.log(`[toolsAutoTranslate] Sync disabled for tool: ${doc.slug}`)
    return doc
  }

  if (!payload) {
    return doc
  }

  // Collect simple fields that need translation
  const fieldsToTranslate: Record<string, string> = {}

  for (const field of SIMPLE_LOCALIZED_FIELDS) {
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

  // Check array fields for changes
  const arrayFieldsToTranslate: Record<string, unknown[]> = {}

  for (const field of ARRAY_LOCALIZED_FIELDS) {
    const newValue = doc[field] as unknown[] | undefined

    if (!newValue || !Array.isArray(newValue) || newValue.length === 0) {
      continue
    }

    if (operation === 'create') {
      arrayFieldsToTranslate[field] = newValue
    }

    if (operation === 'update' && previousDoc) {
      const oldValue = previousDoc[field] as unknown[] | undefined
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        arrayFieldsToTranslate[field] = newValue
      }
    }
  }

  // If nothing to translate, return early
  if (
    Object.keys(fieldsToTranslate).length === 0 &&
    Object.keys(arrayFieldsToTranslate).length === 0
  ) {
    return doc
  }

  const totalFields =
    Object.keys(fieldsToTranslate).length + Object.keys(arrayFieldsToTranslate).length
  console.log(`[toolsAutoTranslate] Queuing ${totalFields} fields for tool: ${doc.slug}`)

  // Fire-and-forget: Start translation in background WITHOUT awaiting
  translateToolInBackground(payload, doc, fieldsToTranslate, arrayFieldsToTranslate).catch(
    (error) => {
      console.error(`[toolsAutoTranslate] Background translation failed for ${doc.slug}:`, error)
    }
  )

  // Return immediately - translations will complete in background
  return doc
}

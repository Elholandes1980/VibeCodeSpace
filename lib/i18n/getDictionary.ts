/**
 * lib/i18n/getDictionary.ts
 *
 * Loads locale dictionaries safely for Server Components.
 * Uses static imports to avoid dynamic fs on edge runtime.
 *
 * Related:
 * - lib/i18n/config.ts
 * - lib/i18n/dictionaries/*.json
 */

import { validateLocale } from './config'

import type { Locale } from './config'

// Static imports for dictionaries (edge-safe)
import nl from './dictionaries/nl.json'
import en from './dictionaries/en.json'
import es from './dictionaries/es.json'

export type Dictionary = typeof nl

const dictionaries: Record<Locale, Dictionary> = {
  nl,
  en,
  es,
}

/**
 * Gets the dictionary for the specified locale.
 * Validates locale and falls back to 'nl' if invalid.
 */
export function getDictionary(locale: string | undefined): Dictionary {
  const validLocale = validateLocale(locale)
  return dictionaries[validLocale]
}

/**
 * Async version for use in Server Components with dynamic params.
 * Validates locale and falls back to 'nl' if invalid.
 */
export async function getDictionaryAsync(
  locale: string | undefined
): Promise<Dictionary> {
  return getDictionary(locale)
}

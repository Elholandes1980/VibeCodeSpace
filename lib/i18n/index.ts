/**
 * lib/i18n/index.ts
 *
 * Public exports for i18n module.
 *
 * Related:
 * - lib/i18n/config.ts
 * - lib/i18n/getDictionary.ts
 */

export { supportedLocales, defaultLocale, validateLocale, isValidLocale } from './config'
export { getDictionary, getDictionaryAsync } from './getDictionary'

export type { Locale } from './config'
export type { Dictionary } from './getDictionary'

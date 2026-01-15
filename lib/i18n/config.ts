/**
 * lib/i18n/config.ts
 *
 * i18n configuration constants for supported locales.
 * NL is the source language, EN and ES are translations.
 *
 * Related:
 * - lib/i18n/getDictionary.ts
 * - middleware.ts
 */

export const supportedLocales = ['nl', 'en', 'es'] as const

export type Locale = (typeof supportedLocales)[number]

export const defaultLocale: Locale = 'nl'

/**
 * Validates a locale string and returns a valid Locale.
 * Falls back to defaultLocale if invalid.
 */
export function validateLocale(locale: string | undefined): Locale {
  if (locale && supportedLocales.includes(locale as Locale)) {
    return locale as Locale
  }
  return defaultLocale
}

/**
 * Checks if a string is a valid supported locale.
 */
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

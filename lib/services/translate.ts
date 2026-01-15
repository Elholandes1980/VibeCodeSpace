/**
 * lib/services/translate.ts
 *
 * Translation service for auto-translating content.
 * Supports multiple providers: OpenAI, DeepL, or placeholder mode.
 *
 * Configuration via environment variables:
 * - TRANSLATION_PROVIDER: 'openai' | 'deepl' | 'placeholder' (default: 'placeholder')
 * - OPENAI_API_KEY: Required for OpenAI provider
 * - DEEPL_API_KEY: Required for DeepL provider
 *
 * Related:
 * - payload/hooks/autoTranslate.ts
 * - payload/collections/Cases.ts
 */

export type TranslationProvider = 'openai' | 'deepl' | 'placeholder'
export type TargetLocale = 'en' | 'es'

interface TranslationResult {
  text: string
  provider: TranslationProvider
}

/**
 * Get the configured translation provider.
 */
function getProvider(): TranslationProvider {
  const provider = process.env.TRANSLATION_PROVIDER as TranslationProvider
  if (provider === 'openai' || provider === 'deepl') {
    return provider
  }
  return 'placeholder'
}

/**
 * Translate text using OpenAI GPT-4.
 */
async function translateWithOpenAI(
  text: string,
  targetLocale: TargetLocale
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn('[translate] OpenAI API key not configured, falling back to placeholder')
    return createPlaceholder(text, targetLocale)
  }

  const targetLanguage = targetLocale === 'en' ? 'English' : 'Spanish'

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following Dutch text to ${targetLanguage}.
Only return the translated text, nothing else. Keep the same tone and style.
If there are technical terms or brand names, keep them as-is.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[translate] OpenAI error:', error)
      return createPlaceholder(text, targetLocale)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || createPlaceholder(text, targetLocale)
  } catch (error) {
    console.error('[translate] OpenAI request failed:', error)
    return createPlaceholder(text, targetLocale)
  }
}

/**
 * Translate text using DeepL API.
 */
async function translateWithDeepL(
  text: string,
  targetLocale: TargetLocale
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    console.warn('[translate] DeepL API key not configured, falling back to placeholder')
    return createPlaceholder(text, targetLocale)
  }

  // DeepL uses uppercase locale codes
  const targetLang = targetLocale === 'en' ? 'EN' : 'ES'

  try {
    // Use DeepL free API endpoint (api-free.deepl.com) or pro (api.deepl.com)
    const baseUrl = apiKey.endsWith(':fx')
      ? 'https://api-free.deepl.com'
      : 'https://api.deepl.com'

    const response = await fetch(`${baseUrl}/v2/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `DeepL-Auth-Key ${apiKey}`,
      },
      body: new URLSearchParams({
        text,
        source_lang: 'NL',
        target_lang: targetLang,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[translate] DeepL error:', error)
      return createPlaceholder(text, targetLocale)
    }

    const data = await response.json()
    return data.translations?.[0]?.text || createPlaceholder(text, targetLocale)
  } catch (error) {
    console.error('[translate] DeepL request failed:', error)
    return createPlaceholder(text, targetLocale)
  }
}

/**
 * Create a placeholder translation (for development/preview).
 */
function createPlaceholder(text: string, targetLocale: TargetLocale): string {
  const prefix = `[${targetLocale.toUpperCase()}]`
  // Don't double-prefix
  if (text.startsWith('[EN]') || text.startsWith('[ES]') || text.startsWith('[NL]')) {
    return `${prefix} ${text.replace(/^\[(EN|ES|NL)\]\s*/, '')}`
  }
  return `${prefix} ${text}`
}

/**
 * Translate text from Dutch to target locale.
 * Uses the configured provider (OpenAI, DeepL, or placeholder).
 */
export async function translate(
  text: string,
  targetLocale: TargetLocale
): Promise<TranslationResult> {
  // Skip empty text
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return { text: '', provider: 'placeholder' }
  }

  const provider = getProvider()

  let translatedText: string

  switch (provider) {
    case 'openai':
      translatedText = await translateWithOpenAI(text, targetLocale)
      break
    case 'deepl':
      translatedText = await translateWithDeepL(text, targetLocale)
      break
    default:
      translatedText = createPlaceholder(text, targetLocale)
  }

  return {
    text: translatedText,
    provider,
  }
}

/**
 * Translate multiple fields at once.
 * More efficient for batch translations.
 */
export async function translateFields(
  fields: Record<string, string | undefined>,
  targetLocale: TargetLocale
): Promise<Record<string, string>> {
  const results: Record<string, string> = {}

  // Process translations in parallel
  const entries = Object.entries(fields).filter(([, value]) => value && typeof value === 'string')

  const translations = await Promise.all(
    entries.map(async ([key, value]) => {
      const result = await translate(value!, targetLocale)
      return [key, result.text] as const
    })
  )

  for (const [key, text] of translations) {
    results[key] = text
  }

  return results
}

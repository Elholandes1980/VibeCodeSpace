/**
 * payload/hooks/toolsUrlIngest.ts
 *
 * URL ingest hook for Tools collection.
 * When ingestSource='url-ingest' and websiteUrl is set/changed,
 * fetches the page and extracts metadata to populate tool fields.
 *
 * Extracted data:
 * - metaTitle (from <title>)
 * - metaDescription (from meta description)
 * - ogImageUrl (from og:image)
 * - faviconUrl (from link[rel="icon"])
 * - shortOneLiner, description (AI-generated or template-based)
 * - bestFor, notFor, keyFeatures (AI-generated when API key available)
 * - pricingModel (inferred from keywords)
 * - screenshotUrl (via thum.io)
 *
 * Sets status='review' and lastIngestedAt after ingest.
 * Resilient: stores errors in ingestError, never throws fatal errors.
 *
 * Related:
 * - payload/collections/Tools.ts
 * - lib/ai/content-generator.ts
 */

import type { CollectionBeforeChangeHook } from 'payload'
import { generateToolContent } from '@/lib/ai/content-generator'

interface IngestResult {
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  faviconUrl?: string
  screenshotUrl?: string
  pricingModel?: string
  warnings: string[]
  error?: string
}

/**
 * Generate screenshot URL using free screenshot services.
 * Uses thum.io - free, no API key needed, reliable.
 */
function getScreenshotUrl(websiteUrl: string): string {
  // thum.io expects the URL without encoding
  // Returns a 1200px wide screenshot, cropped to 630px height (OG image ratio)
  return `https://image.thum.io/get/width/1200/crop/630/${websiteUrl}`
}

/**
 * Fetch HTML from URL with timeout.
 */
async function fetchHtml(url: string, timeoutMs = 10000): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VibeCodeSpace/1.0; +https://vibecodespace.nl)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error(`Not HTML: ${contentType}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Extract metadata from HTML string.
 */
function extractMetadata(html: string, baseUrl: string): IngestResult {
  const warnings: string[] = []
  const result: IngestResult = { warnings }

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    result.metaTitle = titleMatch[1].trim()
  } else {
    warnings.push('No <title> found')
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  if (!descMatch) {
    // Try alternate order
    const altMatch = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
    if (altMatch) {
      result.metaDescription = altMatch[1].trim()
    } else {
      warnings.push('No meta description found')
    }
  } else {
    result.metaDescription = descMatch[1].trim()
  }

  // Extract og:title
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (ogTitleMatch) {
    result.ogTitle = ogTitleMatch[1].trim()
  }

  // Extract og:description
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
  if (ogDescMatch) {
    result.ogDescription = ogDescMatch[1].trim()
  }

  // Extract og:image
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (ogImageMatch) {
    let imageUrl = ogImageMatch[1].trim()
    // Make absolute URL if relative
    if (imageUrl.startsWith('/')) {
      try {
        const base = new URL(baseUrl)
        imageUrl = `${base.protocol}//${base.host}${imageUrl}`
      } catch {
        // Keep relative URL
      }
    }
    result.ogImageUrl = imageUrl
  }

  // Extract favicon
  const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i)
  if (faviconMatch) {
    let faviconUrl = faviconMatch[1].trim()
    // Make absolute URL if relative
    if (faviconUrl.startsWith('/')) {
      try {
        const base = new URL(baseUrl)
        faviconUrl = `${base.protocol}//${base.host}${faviconUrl}`
      } catch {
        // Keep relative URL
      }
    }
    result.faviconUrl = faviconUrl
  } else {
    // Default favicon location
    try {
      const base = new URL(baseUrl)
      result.faviconUrl = `${base.protocol}//${base.host}/favicon.ico`
    } catch {
      // Skip
    }
  }

  // Infer pricing model from content
  const lowerHtml = html.toLowerCase()
  if (
    lowerHtml.includes('free forever') ||
    lowerHtml.includes('100% free') ||
    lowerHtml.includes('completely free')
  ) {
    result.pricingModel = 'free'
  } else if (
    lowerHtml.includes('free plan') ||
    lowerHtml.includes('free tier') ||
    lowerHtml.includes('start free') ||
    lowerHtml.includes('try for free')
  ) {
    result.pricingModel = 'freemium'
  } else if (
    lowerHtml.includes('enterprise') ||
    lowerHtml.includes('contact sales') ||
    lowerHtml.includes('talk to sales')
  ) {
    result.pricingModel = 'enterprise'
  } else if (
    lowerHtml.includes('pricing') ||
    lowerHtml.includes('/month') ||
    lowerHtml.includes('/mo') ||
    lowerHtml.includes('$')
  ) {
    result.pricingModel = 'paid'
  }

  return result
}

/**
 * Generate placeholder content from metadata.
 */
function generatePlaceholderContent(
  meta: IngestResult,
  toolName: string
): {
  shortOneLiner?: string
  description?: string
  bestFor?: Array<{ point: string }>
  notFor?: Array<{ point: string }>
} {
  const result: {
    shortOneLiner?: string
    description?: string
    bestFor?: Array<{ point: string }>
    notFor?: Array<{ point: string }>
  } = {}

  // Generate shortOneLiner from og:description or meta description
  const sourceDesc = meta.ogDescription || meta.metaDescription
  if (sourceDesc) {
    // Take first sentence or first 100 chars
    const firstSentence = sourceDesc.split(/[.!?]/)[0]
    result.shortOneLiner = firstSentence.length > 100
      ? firstSentence.substring(0, 97) + '...'
      : firstSentence
  } else if (meta.metaTitle || meta.ogTitle) {
    result.shortOneLiner = meta.ogTitle || meta.metaTitle
  }

  // Generate description
  if (sourceDesc) {
    result.description = `${toolName} is een tool voor ${sourceDesc.toLowerCase().replace(/^[a-z]/, (c) => c.toLowerCase())}

[Deze beschrijving is automatisch gegenereerd en moet worden aangepast door een editor.]`
  }

  // Generate placeholder bestFor bullets
  result.bestFor = [
    { point: 'Developers die snel willen bouwen' },
    { point: 'Teams die productiviteit willen verhogen' },
    { point: '[Voeg specifieke use cases toe]' },
  ]

  // Generate placeholder notFor bullets
  result.notFor = [
    { point: '[Voeg specifieke scenario\'s toe waar dit niet geschikt voor is]' },
    { point: '[Alternatieven overwegen voor bepaalde use cases]' },
  ]

  return result
}

/**
 * Hook that ingests metadata from websiteUrl.
 * Runs before save to populate fields.
 */
export const toolsUrlIngestHook: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  // Skip if context says to skip
  if (req.context?.skipIngest) {
    return data
  }

  // Only run for NL locale (source)
  const locale = req.locale || 'nl'
  if (locale !== 'nl') {
    return data
  }

  // Check if we should ingest
  const shouldIngest =
    data.ingestSource === 'url-ingest' &&
    data.websiteUrl &&
    typeof data.websiteUrl === 'string' &&
    data.websiteUrl.trim() !== ''

  if (!shouldIngest) {
    return data
  }

  // Validate URL
  let validUrl: URL
  try {
    validUrl = new URL(data.websiteUrl as string)
    if (!validUrl.protocol.startsWith('http')) {
      throw new Error('Only HTTP(S) URLs supported')
    }
  } catch (error) {
    data.ingestError = `Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    data.ingestWarnings = []
    return data
  }

  console.log(`[toolsUrlIngest] Fetching metadata from: ${data.websiteUrl}`)

  try {
    // Fetch HTML
    const html = await fetchHtml(data.websiteUrl as string)

    // Extract metadata
    const meta = extractMetadata(html, data.websiteUrl as string)

    // Update data with extracted metadata
    if (meta.metaTitle) {
      data.metaTitle = meta.metaTitle
    }
    if (meta.metaDescription) {
      data.metaDescription = meta.metaDescription
    }
    if (meta.ogImageUrl) {
      data.ogImageUrl = meta.ogImageUrl
    }
    if (meta.faviconUrl) {
      data.faviconUrl = meta.faviconUrl
    }

    // Generate screenshot URL
    const screenshotUrl = getScreenshotUrl(data.websiteUrl as string)
    data.screenshotUrl = screenshotUrl
    console.log(`[toolsUrlIngest] Screenshot URL: ${screenshotUrl}`)

    // Set pricing model if detected and not already set
    if (meta.pricingModel && (!data.pricingModel || data.pricingModel === 'unknown')) {
      data.pricingModel = meta.pricingModel
    }

    // Generate AI-powered content for empty fields
    const toolName = (data.name as string) || meta.ogTitle || meta.metaTitle || 'Tool'

    // Get category name if available
    let categoryName: string | undefined
    if (data.category && typeof data.category === 'object' && 'title' in data.category) {
      categoryName = data.category.title as string
    }

    try {
      console.log(`[toolsUrlIngest] Generating content for: ${toolName}`)
      const generatedContent = await generateToolContent({
        name: toolName,
        websiteUrl: data.websiteUrl as string,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        ogDescription: meta.ogDescription,
        pricingModel: data.pricingModel as string | undefined,
        category: categoryName,
      })

      // Only fill empty fields
      if (!data.shortOneLiner && generatedContent.shortOneLiner) {
        data.shortOneLiner = generatedContent.shortOneLiner
      }
      if (!data.description && generatedContent.description) {
        data.description = generatedContent.description
      }
      if ((!data.bestFor || (Array.isArray(data.bestFor) && data.bestFor.length === 0)) && generatedContent.bestFor.length > 0) {
        data.bestFor = generatedContent.bestFor
      }
      if ((!data.notFor || (Array.isArray(data.notFor) && data.notFor.length === 0)) && generatedContent.notFor.length > 0) {
        data.notFor = generatedContent.notFor
      }
      if ((!data.keyFeatures || (Array.isArray(data.keyFeatures) && data.keyFeatures.length === 0)) && generatedContent.keyFeatures.length > 0) {
        data.keyFeatures = generatedContent.keyFeatures
      }

      console.log(`[toolsUrlIngest] Content generated successfully`)
    } catch (contentError) {
      console.error(`[toolsUrlIngest] Content generation failed:`, contentError)
      // Fall back to basic placeholder content
      const placeholders = generatePlaceholderContent(meta, toolName)
      if (!data.shortOneLiner && placeholders.shortOneLiner) {
        data.shortOneLiner = placeholders.shortOneLiner
      }
      if (!data.description && placeholders.description) {
        data.description = placeholders.description
      }
      if ((!data.bestFor || (Array.isArray(data.bestFor) && data.bestFor.length === 0)) && placeholders.bestFor) {
        data.bestFor = placeholders.bestFor
      }
      if ((!data.notFor || (Array.isArray(data.notFor) && data.notFor.length === 0)) && placeholders.notFor) {
        data.notFor = placeholders.notFor
      }
    }

    // Set status to review
    data.status = 'review'

    // Update ingest metadata
    data.lastIngestedAt = new Date().toISOString()
    data.ingestError = undefined
    data.ingestWarnings = meta.warnings.map((w) => ({ warning: w }))

    console.log(`[toolsUrlIngest] Successfully ingested: ${data.websiteUrl}`)
    if (meta.warnings.length > 0) {
      console.log(`[toolsUrlIngest] Warnings: ${meta.warnings.join(', ')}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[toolsUrlIngest] Failed to ingest: ${errorMessage}`)

    data.ingestError = errorMessage
    data.ingestWarnings = []
    data.lastIngestedAt = new Date().toISOString()

    // Still set to review so editor can manually fix
    data.status = 'review'
  }

  return data
}

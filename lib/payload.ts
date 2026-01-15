/**
 * lib/payload.ts
 *
 * Payload CMS client utilities for server-side data fetching.
 * Uses getPayload for direct database access (faster than REST).
 * Caches globally for performance.
 *
 * Related:
 * - payload.config.ts
 * - payload/globals/SiteGlobal.ts
 * - payload/collections/Pages.ts
 */

import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Locale } from '@/features/cases/types'

// Cached Payload instance
const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})

// === Site Global ===

export interface SiteGlobalData {
  identity: {
    siteName: string
    tagline: string
  }
  navigation: {
    primaryNav: Array<{
      id: string
      label: string
      href: string
      style: 'default' | 'highlight'
      visibility: 'public' | 'loggedIn' | 'pro' | 'studio'
    }>
  }
  headerCtas: {
    primaryCtaLabel: string
    primaryCtaHref: string
  }
  footer: {
    copyright: string
    footerLinks: Array<{
      id: string
      label: string
      href: string
    }>
  }
  pageIntros: {
    exploreTitle: string
    exploreDescription: string
    toolsTitle: string
    toolsDescription: string
    pulseTitle: string
    pulseDescription: string
  }
  courseCta: {
    enabled: boolean
    title: string
    text: string
    ctaLabel: string
    ctaHref: string
    subtext?: string
  }
  caseCtas: {
    submitCaseTitle: string
    submitCaseText: string
    submitCaseButtonLabel: string
    submitCaseButtonHref: string
  }
  seoDefaults: {
    defaultTitle: string
    defaultDescription: string
  }
}

/**
 * Fetch site-wide global settings.
 * Cached per request for performance.
 */
export const getSiteGlobal = cache(async (locale: Locale = 'nl'): Promise<SiteGlobalData | null> => {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'site-global',
      locale,
      fallbackLocale: 'nl',
    })
    return data as unknown as SiteGlobalData
  } catch {
    console.error('[Payload] Failed to fetch site-global')
    return null
  }
})

// === Pages ===

export interface PageBlock {
  id: string
  blockType: string
  [key: string]: unknown
}

export interface PageData {
  id: string
  title: string
  slug: string
  seo?: {
    title?: string
    description?: string
  }
  blocks: PageBlock[]
}

/**
 * Fetch a page by slug.
 * Returns null if not found.
 */
export const getPage = cache(async (slug: string, locale: Locale = 'nl'): Promise<PageData | null> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: 'nl',
      limit: 1,
      depth: 2, // Populate relationships like manualCases
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0] as unknown as PageData
  } catch {
    console.error(`[Payload] Failed to fetch page: ${slug}`)
    return null
  }
})

/**
 * Fetch the home page.
 */
export const getHomePage = cache(async (locale: Locale = 'nl'): Promise<PageData | null> => {
  return getPage('home', locale)
})

// === Cases for ShowcaseStrip ===

export interface CasePreview {
  id: string
  title: string
  slug: string
  oneLiner: string
  featuredImage?: {
    url?: string
    alt?: string
    sizes?: {
      card?: { url?: string }
      thumbnail?: { url?: string }
    }
  }
  tags: Array<{ id: string; name: string; slug: string }>
  tools: Array<{ id: string; name: string }>
}

/**
 * Fetch latest published cases for showcase strips.
 */
export const getLatestCases = cache(async (
  limit: number = 3,
  locale: Locale = 'nl'
): Promise<CasePreview[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'cases',
      where: {
        _status: { equals: 'published' },
      },
      locale,
      fallbackLocale: 'nl',
      limit,
      sort: '-createdAt',
      depth: 1,
    })

    return result.docs as unknown as CasePreview[]
  } catch {
    console.error('[Payload] Failed to fetch latest cases')
    return []
  }
})

/**
 * Fetch featured cases.
 */
export const getFeaturedCases = cache(async (
  limit: number = 3,
  locale: Locale = 'nl'
): Promise<CasePreview[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'cases',
      where: {
        _status: { equals: 'published' },
        featured: { equals: true },
      },
      locale,
      fallbackLocale: 'nl',
      limit,
      sort: '-createdAt',
      depth: 1,
    })

    return result.docs as unknown as CasePreview[]
  } catch {
    console.error('[Payload] Failed to fetch featured cases')
    return []
  }
})

// === Page Intro Helpers ===

export interface PageIntro {
  title: string
  description: string
}

/**
 * Get page intro for a specific section.
 * Falls back to provided default if CMS data unavailable.
 */
export const getPageIntro = cache(async (
  page: 'explore' | 'tools' | 'pulse',
  locale: Locale = 'nl',
  fallback: PageIntro
): Promise<PageIntro> => {
  const siteGlobal = await getSiteGlobal(locale)
  if (!siteGlobal?.pageIntros) return fallback

  const intros = siteGlobal.pageIntros
  switch (page) {
    case 'explore':
      return {
        title: intros.exploreTitle || fallback.title,
        description: intros.exploreDescription || fallback.description,
      }
    case 'tools':
      return {
        title: intros.toolsTitle || fallback.title,
        description: intros.toolsDescription || fallback.description,
      }
    case 'pulse':
      return {
        title: intros.pulseTitle || fallback.title,
        description: intros.pulseDescription || fallback.description,
      }
    default:
      return fallback
  }
})

// === Case CTA Helpers ===

export interface CaseCta {
  title: string
  text: string
  buttonLabel: string
  buttonHref: string
}

/**
 * Get case detail CTA content.
 * Falls back to provided default if CMS data unavailable.
 */
export const getCaseCta = cache(async (
  locale: Locale = 'nl',
  fallback: CaseCta
): Promise<CaseCta> => {
  const siteGlobal = await getSiteGlobal(locale)
  if (!siteGlobal?.caseCtas) return fallback

  const ctas = siteGlobal.caseCtas
  return {
    title: ctas.submitCaseTitle || fallback.title,
    text: ctas.submitCaseText || fallback.text,
    buttonLabel: ctas.submitCaseButtonLabel || fallback.buttonLabel,
    buttonHref: ctas.submitCaseButtonHref || fallback.buttonHref,
  }
})

// === Course Promo ===

export interface CoursePromoHero {
  eyebrow: string
  headline: string
  subheadline: string
  bullets: string[]
  buttonLabel: string
  buttonUrl: string
  authorName: string
  authorDescription?: string
}

export interface CoursePromoCompact {
  headline: string
  description: string
  buttonLabel: string
  buttonUrl: string
  authorName: string
}

export interface CoursePromoSettings {
  enabled: boolean
  showOnHomepage: boolean
  showOnCases: boolean
  showOnTools: boolean
  showOnBuilders: boolean
}

export interface CoursePromoData {
  settings: CoursePromoSettings
  hero: CoursePromoHero
  compact: CoursePromoCompact
}

/**
 * Fetch course promo content from CMS.
 * Returns null if promo is disabled or not configured.
 */
export const getCoursePromo = cache(async (locale: Locale = 'nl'): Promise<CoursePromoData | null> => {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'course-promo',
      locale,
      fallbackLocale: 'nl',
    })

    // Check if enabled
    const settings = data.settings as CoursePromoSettings | undefined
    if (!settings?.enabled) return null

    const author = data.author as { name?: string; description?: string } | undefined
    const hero = data.hero as {
      eyebrow?: string
      headline?: string
      subheadline?: string
      bullets?: Array<{ text?: string }>
      buttonLabel?: string
      buttonUrl?: string
    } | undefined
    const compact = data.compact as {
      headline?: string
      description?: string
      buttonLabel?: string
      buttonUrl?: string
    } | undefined

    return {
      settings: {
        enabled: settings.enabled,
        showOnHomepage: settings.showOnHomepage ?? true,
        showOnCases: settings.showOnCases ?? true,
        showOnTools: settings.showOnTools ?? false,
        showOnBuilders: settings.showOnBuilders ?? false,
      },
      hero: {
        eyebrow: hero?.eyebrow || '',
        headline: hero?.headline || '',
        subheadline: hero?.subheadline || '',
        bullets: hero?.bullets?.map(b => b.text || '').filter(Boolean) || [],
        buttonLabel: hero?.buttonLabel || '',
        buttonUrl: hero?.buttonUrl || 'https://www.vibecodemadness.nl/',
        authorName: author?.name || 'Mitchel van Duuren',
        authorDescription: author?.description,
      },
      compact: {
        headline: compact?.headline || '',
        description: compact?.description || '',
        buttonLabel: compact?.buttonLabel || '',
        buttonUrl: compact?.buttonUrl || 'https://www.vibecodemadness.nl/',
        authorName: author?.name || 'Mitchel van Duuren',
      },
    }
  } catch {
    console.error('[Payload] Failed to fetch course-promo')
    return null
  }
})

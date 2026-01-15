/**
 * lib/cms/navigation.ts
 *
 * Server-side helpers for fetching navigation and mega menu data from Payload CMS.
 * Uses Payload local API for direct database access.
 * Includes caching with 60s revalidation.
 *
 * IMPORTANT: Only use in Server Components or server actions.
 * DO NOT import in client components.
 *
 * Related:
 * - payload/globals/Navigation.ts
 * - payload/collections/ToolCategories.ts
 * - components/nav/MegaMenu.tsx
 */

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

// Local types for new collections (payload-types.ts needs regeneration)
interface ToolCategoryDoc {
  id: number | string
  title: string
  slug: string
  description?: string | null
  icon?: string | null
  showInMegaMenu?: boolean
  megaMenuGroup?: string
  megaMenuColumn?: string
  order?: number
}

interface ToolDoc {
  id: number | string
  name: string
  slug: string
  shortOneLiner?: string
  description?: string | null
  logo?: number | Media | null
  websiteUrl?: string | null
}

// === Types ===

export type Locale = 'nl' | 'en' | 'es'

export interface MegaMenuCategory {
  id: number | string
  title: string
  slug: string
  description?: string | null
  icon?: string | null
  href: string
}

export interface MegaMenuSection {
  heading: string
  categories: MegaMenuCategory[]
  order: number
}

export interface MegaMenuUseCase {
  label: string
  href: string
  icon?: string | null
}

export interface MegaMenuCompareLink {
  label: string
  href: string
  badge?: string | null
}

export interface MegaMenuFeaturedTool {
  id: number | string
  name: string
  slug: string
  shortOneLiner: string
  description?: string | null
  logo?: {
    url: string
    alt: string
  } | null
  href: string
}

export interface ToolsMegaMenuData {
  enabled: boolean
  coreSections: MegaMenuSection[]
  useCasesHeading: string
  useCaseLinks: MegaMenuUseCase[]
  compareHeading: string
  compareLinks: MegaMenuCompareLink[]
  showFeatured: boolean
  featuredLabel: string
  featuredTool: MegaMenuFeaturedTool | null
  featuredDescription?: string | null
  featuredCtaLabel: string
  footerLinks: Array<{
    label: string
    href: string
    icon?: string | null
  }>
}

// === Helper Functions ===

async function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Build a tools page URL with optional category filter.
 */
export function buildToolsUrl(locale: Locale, categorySlug?: string): string {
  const base = `/${locale}/tools`
  if (categorySlug) {
    return `${base}?category=${categorySlug}`
  }
  return base
}

/**
 * Build a compare page URL.
 */
export function buildCompareUrl(locale: Locale, path: string): string {
  // If path already includes locale prefix, use as-is
  if (path.startsWith(`/${locale}/`) || path.startsWith('/compare')) {
    return path.startsWith('/') ? `/${locale}${path.replace(/^\/[a-z]{2}\//, '/')}` : `/${locale}/${path}`
  }
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Build a tool detail URL.
 */
export function buildToolUrl(locale: Locale, toolSlug: string): string {
  return `/${locale}/tools/${toolSlug}`
}

// === Main Data Fetching ===

/**
 * Fetch the Tools mega menu configuration.
 * Returns null if mega menu is disabled.
 * Cached for 60 seconds.
 */
export const getToolsMegaMenu = unstable_cache(
  async (locale: Locale): Promise<ToolsMegaMenuData | null> => {
    const payload = await getPayloadClient()

    // Fetch navigation global with populated relationships
    const navigation = await payload.findGlobal({
      slug: 'navigation',
      locale,
      depth: 2, // Populate category and tool relationships
    })

    const megaMenu = navigation.toolsMegaMenu
    if (!megaMenu?.enabled) {
      return null
    }

    // Process core sections with populated categories
    const coreSections: MegaMenuSection[] = []

    if (megaMenu.coreSections && Array.isArray(megaMenu.coreSections)) {
      for (const section of megaMenu.coreSections) {
        const categories: MegaMenuCategory[] = []

        if (section.categories && Array.isArray(section.categories)) {
          for (const cat of section.categories) {
            // Category might be ID or populated object
            if (typeof cat === 'object' && cat !== null) {
              const category = cat as ToolCategoryDoc
              categories.push({
                id: category.id,
                title: category.title,
                slug: category.slug,
                description: category.description || null,
                icon: category.icon || null,
                href: buildToolsUrl(locale, category.slug),
              })
            }
          }
        }

        if (categories.length > 0) {
          coreSections.push({
            heading: section.heading || '',
            categories,
            order: section.order ?? 0,
          })
        }
      }
    }

    // Sort sections by order
    coreSections.sort((a, b) => a.order - b.order)

    // Process use case links
    const useCaseLinks: MegaMenuUseCase[] = []
    if (megaMenu.useCaseLinks && Array.isArray(megaMenu.useCaseLinks)) {
      for (const link of megaMenu.useCaseLinks) {
        let href = link.href || ''

        // Build URL from filter if no direct href
        if (!href && link.filterCategory) {
          const filterCat = typeof link.filterCategory === 'object'
            ? (link.filterCategory as ToolCategoryDoc).slug
            : null
          if (filterCat) {
            href = buildToolsUrl(locale, filterCat)
          }
          if (link.filterQuery) {
            href += href.includes('?') ? `&${link.filterQuery}` : `?${link.filterQuery}`
          }
        }

        if (link.label && href) {
          useCaseLinks.push({
            label: link.label,
            href,
            icon: link.icon || null,
          })
        }
      }
    }

    // Process compare links
    const compareLinks: MegaMenuCompareLink[] = []
    if (megaMenu.compareLinks && Array.isArray(megaMenu.compareLinks)) {
      for (const link of megaMenu.compareLinks) {
        if (link.label && link.href) {
          compareLinks.push({
            label: link.label,
            href: buildCompareUrl(locale, link.href),
            badge: link.badge || null,
          })
        }
      }
    }

    // Process featured tool
    let featuredTool: MegaMenuFeaturedTool | null = null
    if (megaMenu.showFeatured && megaMenu.featuredTool) {
      const tool = typeof megaMenu.featuredTool === 'object'
        ? (megaMenu.featuredTool as ToolDoc)
        : null

      if (tool) {
        const logo = tool.logo && typeof tool.logo === 'object'
          ? (tool.logo as Media)
          : null

        featuredTool = {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          shortOneLiner: tool.shortOneLiner || '',
          description: megaMenu.featuredDescription || null,
          logo: logo ? { url: logo.url || '', alt: logo.alt || tool.name } : null,
          href: buildToolUrl(locale, tool.slug),
        }
      }
    }

    // Process footer links
    const footerLinks: ToolsMegaMenuData['footerLinks'] = []
    if (megaMenu.footerLinks && Array.isArray(megaMenu.footerLinks)) {
      for (const link of megaMenu.footerLinks) {
        if (link.label && link.href) {
          footerLinks.push({
            label: link.label,
            href: link.href.startsWith('/') ? `/${locale}${link.href}` : link.href,
            icon: link.icon || null,
          })
        }
      }
    }

    return {
      enabled: true,
      coreSections,
      useCasesHeading: megaMenu.useCasesHeading || 'Gebruik dit als je…',
      useCaseLinks,
      compareHeading: megaMenu.compareHeading || 'Vergelijk & Begrijp',
      compareLinks,
      showFeatured: megaMenu.showFeatured ?? true,
      featuredLabel: megaMenu.featuredLabel || 'Tool van de week',
      featuredTool,
      featuredDescription: megaMenu.featuredDescription || null,
      featuredCtaLabel: megaMenu.featuredCtaLabel || 'Bekijk tool',
      footerLinks,
    }
  },
  ['tools-mega-menu'],
  { revalidate: 60, tags: ['navigation', 'tool-categories', 'tools'] }
)

/**
 * Fetch all visible tool categories for a locale.
 * Cached for 60 seconds.
 */
export const getToolCategories = unstable_cache(
  async (locale: Locale): Promise<MegaMenuCategory[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tool-categories',
      locale,
      where: {
        showInMegaMenu: { equals: true },
      },
      sort: 'order',
      limit: 100,
    })

    return result.docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      description: doc.description || null,
      icon: doc.icon || null,
      href: buildToolsUrl(locale, doc.slug),
    }))
  },
  ['tool-categories'],
  { revalidate: 60, tags: ['tool-categories'] }
)

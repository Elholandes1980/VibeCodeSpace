/**
 * lib/cms/tools-settings.ts
 *
 * Server-side helper for fetching ToolsSettings global from Payload CMS.
 * Provides type-safe access to CMS-driven labels for tools pages.
 *
 * IMPORTANT: Only use in Server Components or server actions.
 * DO NOT import in client components.
 *
 * Related:
 * - payload/globals/ToolsSettings.ts
 * - app/(frontend)/(public)/[locale]/tools/page.tsx
 * - app/(frontend)/(public)/[locale]/tools/[slug]/page.tsx
 */

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

export type Locale = 'nl' | 'en' | 'es'

export interface ToolsSettingsData {
  indexPage: {
    title: string
    intro: string
    filterAllLabel: string
    filterPricingLabel: string
    searchPlaceholder: string
    cardCtaLabel: string
  }
  emptyStates: {
    noToolsTitle: string
    noToolsBody: string
    noResultsTitle: string
    noResultsBody: string
  }
  submitCta: {
    enabled: boolean
    label: string
    href: string
  }
  detailPage: {
    visitToolLabel: string
    makerLabel: string
    pricingLabel: string
    freeLabel: string
    freemiumLabel: string
    paidLabel: string
    enterpriseLabel: string
    unknownPricingLabel: string
    trialLabel: string
    startingFromLabel: string
  }
  detailSections: {
    bestForLabel: string
    notForLabel: string
    featuresLabel: string
    usedInCasesLabel: string
    alternativesLabel: string
    backLabel: string
  }
  badges: {
    newBadge: string
    popularBadge: string
    featuredBadge: string
  }
}

// Default values (fallback if CMS not seeded yet)
const DEFAULTS: ToolsSettingsData = {
  indexPage: {
    title: 'Tools',
    intro: 'Vind de beste tools voor vibecoding.',
    filterAllLabel: 'Alle',
    filterPricingLabel: 'Pricing',
    searchPlaceholder: 'Zoek tools...',
    cardCtaLabel: 'Bekijk',
  },
  emptyStates: {
    noToolsTitle: 'Nog geen tools',
    noToolsBody: 'We zijn bezig met het toevoegen van tools.',
    noResultsTitle: 'Geen resultaten',
    noResultsBody: 'Probeer een andere zoekopdracht.',
  },
  submitCta: {
    enabled: true,
    label: 'Tool toevoegen',
    href: '/submit-tool',
  },
  detailPage: {
    visitToolLabel: 'Bezoek tool',
    makerLabel: 'Website maker',
    pricingLabel: 'Pricing',
    freeLabel: 'Gratis',
    freemiumLabel: 'Freemium',
    paidLabel: 'Betaald',
    enterpriseLabel: 'Enterprise',
    unknownPricingLabel: 'Prijs onbekend',
    trialLabel: 'Proefperiode beschikbaar',
    startingFromLabel: 'Vanaf',
  },
  detailSections: {
    bestForLabel: 'Ideaal voor',
    notForLabel: 'Minder geschikt voor',
    featuresLabel: 'Belangrijkste features',
    usedInCasesLabel: 'Gebruikt in cases',
    alternativesLabel: 'Alternatieven',
    backLabel: 'Terug naar tools',
  },
  badges: {
    newBadge: 'Nieuw',
    popularBadge: 'Populair',
    featuredBadge: 'Uitgelicht',
  },
}

/**
 * Fetch ToolsSettings global with locale.
 * Cached for 60 seconds.
 */
export const getToolsSettings = unstable_cache(
  async (locale: Locale): Promise<ToolsSettingsData> => {
    try {
      const payload = await getPayload({ config })

      const settings = await payload.findGlobal({
        slug: 'tools-settings',
        locale,
      })

      // Merge with defaults (in case some fields are empty)
      return {
        indexPage: {
          title: settings.indexPage?.title || DEFAULTS.indexPage.title,
          intro: settings.indexPage?.intro || DEFAULTS.indexPage.intro,
          filterAllLabel: settings.indexPage?.filterAllLabel || DEFAULTS.indexPage.filterAllLabel,
          filterPricingLabel: settings.indexPage?.filterPricingLabel || DEFAULTS.indexPage.filterPricingLabel,
          searchPlaceholder: settings.indexPage?.searchPlaceholder || DEFAULTS.indexPage.searchPlaceholder,
          cardCtaLabel: settings.indexPage?.cardCtaLabel || DEFAULTS.indexPage.cardCtaLabel,
        },
        emptyStates: {
          noToolsTitle: settings.emptyStates?.noToolsTitle || DEFAULTS.emptyStates.noToolsTitle,
          noToolsBody: settings.emptyStates?.noToolsBody || DEFAULTS.emptyStates.noToolsBody,
          noResultsTitle: settings.emptyStates?.noResultsTitle || DEFAULTS.emptyStates.noResultsTitle,
          noResultsBody: settings.emptyStates?.noResultsBody || DEFAULTS.emptyStates.noResultsBody,
        },
        submitCta: {
          enabled: settings.submitCta?.enabled ?? DEFAULTS.submitCta.enabled,
          label: settings.submitCta?.label || DEFAULTS.submitCta.label,
          href: settings.submitCta?.href || DEFAULTS.submitCta.href,
        },
        detailPage: {
          visitToolLabel: settings.detailPage?.visitToolLabel || DEFAULTS.detailPage.visitToolLabel,
          makerLabel: settings.detailPage?.makerLabel || DEFAULTS.detailPage.makerLabel,
          pricingLabel: settings.detailPage?.pricingLabel || DEFAULTS.detailPage.pricingLabel,
          freeLabel: settings.detailPage?.freeLabel || DEFAULTS.detailPage.freeLabel,
          freemiumLabel: settings.detailPage?.freemiumLabel || DEFAULTS.detailPage.freemiumLabel,
          paidLabel: settings.detailPage?.paidLabel || DEFAULTS.detailPage.paidLabel,
          enterpriseLabel: settings.detailPage?.enterpriseLabel || DEFAULTS.detailPage.enterpriseLabel,
          unknownPricingLabel: settings.detailPage?.unknownPricingLabel || DEFAULTS.detailPage.unknownPricingLabel,
          trialLabel: settings.detailPage?.trialLabel || DEFAULTS.detailPage.trialLabel,
          startingFromLabel: settings.detailPage?.startingFromLabel || DEFAULTS.detailPage.startingFromLabel,
        },
        detailSections: {
          bestForLabel: settings.detailSections?.bestForLabel || DEFAULTS.detailSections.bestForLabel,
          notForLabel: settings.detailSections?.notForLabel || DEFAULTS.detailSections.notForLabel,
          featuresLabel: settings.detailSections?.featuresLabel || DEFAULTS.detailSections.featuresLabel,
          usedInCasesLabel: settings.detailSections?.usedInCasesLabel || DEFAULTS.detailSections.usedInCasesLabel,
          alternativesLabel: settings.detailSections?.alternativesLabel || DEFAULTS.detailSections.alternativesLabel,
          backLabel: settings.detailSections?.backLabel || DEFAULTS.detailSections.backLabel,
        },
        badges: {
          newBadge: settings.badges?.newBadge || DEFAULTS.badges.newBadge,
          popularBadge: settings.badges?.popularBadge || DEFAULTS.badges.popularBadge,
          featuredBadge: settings.badges?.featuredBadge || DEFAULTS.badges.featuredBadge,
        },
      }
    } catch (error) {
      console.error('[getToolsSettings] Failed to fetch:', error)
      return DEFAULTS
    }
  },
  ['tools-settings'],
  { revalidate: 60, tags: ['tools-settings'] }
)

/**
 * Get pricing label for a pricing model value.
 */
export function getPricingLabel(
  pricingModel: string | null | undefined,
  labels: ToolsSettingsData['detailPage']
): string {
  switch (pricingModel) {
    case 'free':
      return labels.freeLabel
    case 'freemium':
      return labels.freemiumLabel
    case 'paid':
      return labels.paidLabel
    case 'enterprise':
      return labels.enterpriseLabel
    default:
      return labels.unknownPricingLabel
  }
}

/**
 * Get pricing badge color class.
 */
export function getPricingBadgeClass(pricingModel: string | null | undefined): string {
  switch (pricingModel) {
    case 'free':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'freemium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'paid':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    case 'enterprise':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

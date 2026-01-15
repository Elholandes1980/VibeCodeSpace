/**
 * payload/globals/ToolsSettings.ts
 *
 * Global singleton for Tools pages CMS-driven copy.
 * Stores all labels, headings, CTAs, and empty states for:
 * - Tools index page (/[locale]/tools)
 * - Tool detail pages (/[locale]/tools/[slug])
 *
 * All text fields are localized (nl source, en/es translations).
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/tools/page.tsx
 * - app/(frontend)/(public)/[locale]/tools/[slug]/page.tsx
 * - payload/collections/Tools.ts
 */

import type { GlobalConfig } from 'payload'

export const ToolsSettings: GlobalConfig = {
  slug: 'tools-settings',
  label: 'Tools Settings',
  admin: {
    group: 'Settings',
    description: 'CMS-driven labels and copy for Tools pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === Index Page ===
    {
      type: 'group',
      name: 'indexPage',
      label: 'Tools Index Page',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          localized: true,
          defaultValue: 'Tools',
        },
        {
          name: 'intro',
          type: 'textarea',
          label: 'Introduction Text',
          localized: true,
          defaultValue: 'Vind de beste tools voor vibecoding. Van AI-assistenten tot automatisering — alles wat je nodig hebt om sneller te bouwen.',
        },
        {
          name: 'filterAllLabel',
          type: 'text',
          label: 'Filter: All Label',
          localized: true,
          defaultValue: 'Alle',
        },
        {
          name: 'filterPricingLabel',
          type: 'text',
          label: 'Filter: Pricing Label',
          localized: true,
          defaultValue: 'Pricing',
        },
        {
          name: 'searchPlaceholder',
          type: 'text',
          label: 'Search Placeholder',
          localized: true,
          defaultValue: 'Zoek tools...',
        },
        {
          name: 'cardCtaLabel',
          type: 'text',
          label: 'Card CTA Label',
          localized: true,
          defaultValue: 'Bekijk',
        },
      ],
    },

    // === Empty States ===
    {
      type: 'group',
      name: 'emptyStates',
      label: 'Empty States',
      fields: [
        {
          name: 'noToolsTitle',
          type: 'text',
          label: 'No Tools Title',
          localized: true,
          defaultValue: 'Nog geen tools',
        },
        {
          name: 'noToolsBody',
          type: 'textarea',
          label: 'No Tools Body',
          localized: true,
          defaultValue: 'We zijn bezig met het toevoegen van tools. Kom snel terug!',
        },
        {
          name: 'noResultsTitle',
          type: 'text',
          label: 'No Results Title',
          localized: true,
          defaultValue: 'Geen resultaten',
        },
        {
          name: 'noResultsBody',
          type: 'textarea',
          label: 'No Results Body',
          localized: true,
          defaultValue: 'Probeer een andere zoekopdracht of filter.',
        },
      ],
    },

    // === Submit Tool CTA ===
    {
      type: 'group',
      name: 'submitCta',
      label: 'Submit Tool CTA',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show Submit CTA',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'CTA Label',
          localized: true,
          defaultValue: 'Tool toevoegen',
        },
        {
          name: 'href',
          type: 'text',
          label: 'CTA URL',
          defaultValue: '/submit-tool',
        },
      ],
    },

    // === Detail Page Labels ===
    {
      type: 'group',
      name: 'detailPage',
      label: 'Tool Detail Page',
      fields: [
        {
          name: 'visitToolLabel',
          type: 'text',
          label: 'Visit Tool Button',
          localized: true,
          defaultValue: 'Bezoek tool',
        },
        {
          name: 'makerLabel',
          type: 'text',
          label: 'Maker Link Label',
          localized: true,
          defaultValue: 'Website maker',
        },
        {
          name: 'pricingLabel',
          type: 'text',
          label: 'Pricing Section Label',
          localized: true,
          defaultValue: 'Pricing',
        },
        {
          name: 'freeLabel',
          type: 'text',
          label: 'Free Badge Label',
          localized: true,
          defaultValue: 'Gratis',
        },
        {
          name: 'freemiumLabel',
          type: 'text',
          label: 'Freemium Badge Label',
          localized: true,
          defaultValue: 'Freemium',
        },
        {
          name: 'paidLabel',
          type: 'text',
          label: 'Paid Badge Label',
          localized: true,
          defaultValue: 'Betaald',
        },
        {
          name: 'enterpriseLabel',
          type: 'text',
          label: 'Enterprise Badge Label',
          localized: true,
          defaultValue: 'Enterprise',
        },
        {
          name: 'unknownPricingLabel',
          type: 'text',
          label: 'Unknown Pricing Label',
          localized: true,
          defaultValue: 'Prijs onbekend',
        },
        {
          name: 'trialLabel',
          type: 'text',
          label: 'Trial Available Label',
          localized: true,
          defaultValue: 'Proefperiode beschikbaar',
        },
        {
          name: 'startingFromLabel',
          type: 'text',
          label: 'Starting From Label',
          localized: true,
          defaultValue: 'Vanaf',
        },
      ],
    },

    // === Detail Page Sections ===
    {
      type: 'group',
      name: 'detailSections',
      label: 'Detail Page Section Headers',
      fields: [
        {
          name: 'bestForLabel',
          type: 'text',
          label: 'Best For Section',
          localized: true,
          defaultValue: 'Ideaal voor',
        },
        {
          name: 'notForLabel',
          type: 'text',
          label: 'Not For Section',
          localized: true,
          defaultValue: 'Minder geschikt voor',
        },
        {
          name: 'featuresLabel',
          type: 'text',
          label: 'Features Section',
          localized: true,
          defaultValue: 'Belangrijkste features',
        },
        {
          name: 'usedInCasesLabel',
          type: 'text',
          label: 'Used In Cases Section',
          localized: true,
          defaultValue: 'Gebruikt in cases',
        },
        {
          name: 'alternativesLabel',
          type: 'text',
          label: 'Alternatives Section',
          localized: true,
          defaultValue: 'Alternatieven',
        },
        {
          name: 'backLabel',
          type: 'text',
          label: 'Back to Tools Link',
          localized: true,
          defaultValue: 'Terug naar tools',
        },
      ],
    },

    // === Pricing Badges ===
    {
      type: 'group',
      name: 'badges',
      label: 'Badge Labels',
      fields: [
        {
          name: 'newBadge',
          type: 'text',
          label: 'New Badge',
          localized: true,
          defaultValue: 'Nieuw',
        },
        {
          name: 'popularBadge',
          type: 'text',
          label: 'Popular Badge',
          localized: true,
          defaultValue: 'Populair',
        },
        {
          name: 'featuredBadge',
          type: 'text',
          label: 'Featured Badge',
          localized: true,
          defaultValue: 'Uitgelicht',
        },
      ],
    },
  ],
}

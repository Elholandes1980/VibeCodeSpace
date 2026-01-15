/**
 * payload/blocks/PricingBlock.ts
 *
 * Pricing block for pricing tables.
 * Supports multiple plans with features and CTAs.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/PricingSection.tsx
 */

import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Pricing',
    plural: 'Pricing Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (Kicker)',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
    },
    {
      name: 'usp',
      type: 'text',
      label: 'USP Line',
      localized: true,
      admin: {
        description: 'E.g., "Je case verschijnt automatisch in 3 talen"',
      },
    },
    {
      name: 'plans',
      type: 'array',
      label: 'Pricing Plans',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Plan Name',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price',
          required: true,
          admin: {
            description: 'E.g., "€0", "€10 / maand", "Custom"',
          },
        },
        {
          name: 'period',
          type: 'text',
          label: 'Period (optional)',
          admin: {
            description: 'E.g., "maand", "jaar"',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          localized: true,
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              label: 'Feature',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Label',
          required: true,
          localized: true,
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'CTA URL',
          required: true,
        },
        {
          name: 'highlight',
          type: 'checkbox',
          label: 'Highlight (Best Value)',
          defaultValue: false,
        },
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text (optional)',
          localized: true,
          admin: {
            description: 'E.g., "Meest gekozen"',
          },
        },
      ],
    },
    {
      name: 'contactSalesText',
      type: 'text',
      label: 'Contact Sales Text',
      localized: true,
    },
    {
      name: 'contactSalesHref',
      type: 'text',
      label: 'Contact Sales URL',
    },
  ],
}

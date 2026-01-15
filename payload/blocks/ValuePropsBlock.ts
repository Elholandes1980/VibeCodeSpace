/**
 * payload/blocks/ValuePropsBlock.ts
 *
 * Value propositions block for feature grids.
 * Supports multiple items with icons and CTAs.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/FeaturesSection.tsx
 */

import type { Block } from 'payload'

export const ValuePropsBlock: Block = {
  slug: 'valueProps',
  labels: {
    singular: 'Value Props',
    plural: 'Value Props',
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
      name: 'items',
      type: 'array',
      label: 'Value Props',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          localized: true,
        },
        {
          name: 'iconKey',
          type: 'text',
          label: 'Icon Key (optional)',
          admin: {
            description: 'Internal key for icon mapping: pulse, explore, workspace',
          },
        },
        {
          name: 'href',
          type: 'text',
          label: 'Link URL (optional)',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Label (optional)',
          localized: true,
        },
        {
          name: 'comingSoon',
          type: 'checkbox',
          label: 'Coming Soon',
          defaultValue: false,
        },
      ],
    },
  ],
}

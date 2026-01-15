/**
 * payload/blocks/ShowcaseStripBlock.ts
 *
 * Showcase strip block for displaying case studies.
 * Supports latest, manual, or featured modes.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/FeaturedShowcases.tsx
 */

import type { Block } from 'payload'

export const ShowcaseStripBlock: Block = {
  slug: 'showcaseStrip',
  labels: {
    singular: 'Showcase Strip',
    plural: 'Showcase Strips',
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
      type: 'text',
      label: 'Subtitle (optional)',
      localized: true,
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'latest',
      options: [
        { label: 'Latest Published', value: 'latest' },
        { label: 'Manual Selection', value: 'manual' },
        { label: 'Featured Only', value: 'featured' },
      ],
    },
    {
      name: 'manualCases',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      label: 'Manual Cases Selection',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'manual',
        description: 'Select specific cases to display',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Max Cases to Show',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Label',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'CTA URL',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}

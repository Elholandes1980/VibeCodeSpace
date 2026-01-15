/**
 * payload/blocks/HeroBlock.ts
 *
 * Hero block for page hero sections.
 * Supports eyebrow, headline, CTAs, and hero image.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/HeroSection.tsx
 */

import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (Kicker)',
      localized: true,
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      required: true,
      localized: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryCtaLabel',
          type: 'text',
          label: 'Primary CTA Label',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'primaryCtaHref',
          type: 'text',
          label: 'Primary CTA URL',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryCtaLabel',
          type: 'text',
          label: 'Secondary CTA Label',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'secondaryCtaHref',
          type: 'text',
          label: 'Secondary CTA URL',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image (optional)',
    },
    {
      name: 'trustLine',
      type: 'text',
      label: 'Trust Line (optional)',
      localized: true,
      admin: {
        description: 'E.g., "Trusted by 100+ builders"',
      },
    },
  ],
}

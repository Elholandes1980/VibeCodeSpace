/**
 * payload/blocks/MicroProblemCtaBlock.ts
 *
 * Micro problem CTA block.
 * Encourages users to submit micro-problems.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/MicroProblemCtaSection.tsx
 */

import type { Block } from 'payload'

export const MicroProblemCtaBlock: Block = {
  slug: 'microProblemCta',
  labels: {
    singular: 'Micro Problem CTA',
    plural: 'Micro Problem CTAs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Label',
          required: true,
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'CTA URL',
          required: true,
          defaultValue: '/micro-probleem',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}

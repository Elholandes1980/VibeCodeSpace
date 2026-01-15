/**
 * payload/blocks/CourseCtaBlock.ts
 *
 * Course CTA block for promotional banners.
 * Supports locale-specific visibility.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/CourseCtaSection.tsx
 */

import type { Block } from 'payload'

export const CourseCtaBlock: Block = {
  slug: 'courseCta',
  labels: {
    singular: 'Course CTA',
    plural: 'Course CTAs',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enabled',
      defaultValue: true,
    },
    {
      name: 'showOnlyNl',
      type: 'checkbox',
      label: 'Show Only on NL',
      defaultValue: true,
      admin: {
        description: 'Only display this block on Dutch locale',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (Kicker)',
      localized: true,
    },
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
          defaultValue: 'https://www.vibecodemadness.nl/',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Note (optional)',
      localized: true,
      admin: {
        description: 'Small text below CTA',
      },
    },
  ],
}

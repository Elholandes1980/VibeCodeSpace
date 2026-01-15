/**
 * payload/blocks/NewsletterBlock.ts
 *
 * Newsletter signup block.
 * Supports custom messages and placeholder text.
 *
 * Related:
 * - payload/blocks/index.ts
 * - features/home/components/NewsletterSection.tsx
 */

import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletters',
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
      name: 'placeholder',
      type: 'text',
      label: 'Email Placeholder',
      localized: true,
      defaultValue: 'jouw@email.nl',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      required: true,
      localized: true,
      defaultValue: 'Aanmelden',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: 'Success Message',
      localized: true,
    },
    {
      name: 'errorMessage',
      type: 'text',
      label: 'Error Message',
      localized: true,
    },
  ],
}

/**
 * payload/globals/CoursePromo.ts
 *
 * CMS-driven course promotion content.
 * Supports both hero-style and compact CTAs.
 * All text fields are localized (nl source, en translation).
 *
 * Related:
 * - features/home/components/CourseCtaHero.tsx
 * - features/course/components/CourseCtaCompact.tsx
 * - lib/payload.ts
 */

import type { GlobalConfig } from 'payload'

export const CoursePromo: GlobalConfig = {
  slug: 'course-promo',
  label: 'Course Promotion',
  admin: {
    group: 'Promotions',
    description: 'VibeCoding Madness course promotion content',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === Enable/Disable ===
    {
      type: 'group',
      name: 'settings',
      label: 'Display Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Course Promo',
          defaultValue: true,
          admin: {
            description: 'Master switch to enable/disable all course promos',
          },
        },
        {
          name: 'showOnHomepage',
          type: 'checkbox',
          label: 'Show on Homepage',
          defaultValue: true,
        },
        {
          name: 'showOnCases',
          type: 'checkbox',
          label: 'Show on Case Detail Pages',
          defaultValue: true,
        },
        {
          name: 'showOnTools',
          type: 'checkbox',
          label: 'Show on Tools Page',
          defaultValue: false,
        },
        {
          name: 'showOnBuilders',
          type: 'checkbox',
          label: 'Show on Builder Profiles',
          defaultValue: false,
        },
      ],
    },

    // === Author Info ===
    {
      type: 'group',
      name: 'author',
      label: 'Author Attribution',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Author Name',
          required: true,
          defaultValue: 'Mitchel van Duuren',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Author Description',
          localized: true,
          admin: {
            description: 'Short description shown with author name',
          },
        },
      ],
    },

    // === Hero CTA (Homepage) ===
    {
      type: 'group',
      name: 'hero',
      label: 'Hero CTA (Homepage)',
      admin: {
        description: 'Large promotional block for the homepage',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Text',
          localized: true,
          admin: {
            description: 'Small text above the headline (authority statement)',
          },
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
          admin: {
            description: 'Supporting text under the headline',
          },
        },
        {
          name: 'bullets',
          type: 'array',
          label: 'Benefit Bullets',
          maxRows: 4,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Bullet Text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          required: true,
          localized: true,
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button URL',
          required: true,
          defaultValue: 'https://www.vibecodemadness.nl/',
        },
      ],
    },

    // === Compact CTA (Case pages, etc.) ===
    {
      type: 'group',
      name: 'compact',
      label: 'Compact CTA (Case Pages)',
      admin: {
        description: 'Smaller promotional block for case details and other pages',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          localized: true,
          admin: {
            description: 'One or two sentences max',
          },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          required: true,
          localized: true,
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button URL',
          required: true,
          defaultValue: 'https://www.vibecodemadness.nl/',
        },
      ],
    },
  ],
}

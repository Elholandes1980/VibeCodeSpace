/**
 * payload/collections/Pages.ts
 *
 * Pages collection for CMS-driven marketing pages.
 * Uses blocks field for modular content composition.
 * Home page is the primary use case; expandable for other pages.
 *
 * Related:
 * - payload/blocks/index.ts
 * - app/(frontend)/(public)/[locale]/page.tsx
 */

import type { CollectionConfig } from 'payload'
import {
  HeroBlock,
  ValuePropsBlock,
  ShowcaseStripBlock,
  PricingBlock,
  CourseCtaBlock,
  NewsletterBlock,
  MicroProblemCtaBlock,
} from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Marketing pages with modular blocks',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const slug = data?.slug || 'home'
        const localePrefix = locale || 'nl'
        if (slug === 'home') {
          return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${localePrefix}`
        }
        return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${localePrefix}/${slug}`
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300,
      },
    },
  },
  fields: [
    // === Identity ===
    {
      name: 'title',
      type: 'text',
      label: 'Page Title',
      required: true,
      localized: true,
      admin: {
        description: 'Internal title for this page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug (use "home" for homepage)',
        position: 'sidebar',
      },
    },

    // === SEO ===
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
          localized: true,
        },
      ],
    },

    // === Blocks ===
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Content Blocks',
      blocks: [
        HeroBlock,
        ValuePropsBlock,
        ShowcaseStripBlock,
        PricingBlock,
        CourseCtaBlock,
        NewsletterBlock,
        MicroProblemCtaBlock,
      ],
    },
  ],
  timestamps: true,
}

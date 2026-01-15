/**
 * payload/collections/Cases.ts
 *
 * Core collection for showcase cases (vibecoding builds).
 * All content fields are localized. NL is source of truth.
 * Links to Builders for ownership and attribution.
 *
 * Related:
 * - payload/collections/Builders.ts
 * - payload/collections/Media.ts
 * - payload/collections/Tags.ts
 * - payload/collections/Tools.ts
 * - payload/hooks/autoTranslate.ts
 */

import type { CollectionConfig } from 'payload'
import { autoTranslateHook } from '../hooks/autoTranslate'

export const Cases: CollectionConfig = {
  slug: 'cases',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Showcase cases - vibecoding builds',
    defaultColumns: ['title', 'status', 'visibility', 'source', 'updatedAt'],
  },
  access: {
    // Public read: only published cases
    read: ({ req }) => {
      // Admin can read all
      if (req.user) return true
      // Public can only read published
      return {
        status: { equals: 'published' },
      }
    },
    // Only authenticated users can create/update/delete
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [autoTranslateHook],
  },
  fields: [
    // === Identity ===
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "factuurflow")',
        position: 'sidebar',
      },
    },

    // === Status & Visibility ===
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'visibility',
          type: 'select',
          label: 'Visibility',
          required: true,
          defaultValue: 'public',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Featured', value: 'featured' },
            // Future: paid placements for marketplace
            { label: 'Paid Placement', value: 'paid' },
          ],
          admin: {
            width: '33%',
            description: 'Featured/paid for marketplace (future)',
          },
        },
        {
          name: 'source',
          type: 'select',
          label: 'Source',
          required: true,
          defaultValue: 'editorial',
          options: [
            { label: 'Editorial', value: 'editorial' },
            // Future: community submissions
            { label: 'Community', value: 'community' },
          ],
          admin: {
            width: '33%',
            description: 'Editorial or community submission',
          },
        },
      ],
    },

    // === Hero Content (localized) ===
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      admin: {
        description: 'Case title (localized)',
      },
    },
    {
      name: 'oneLiner',
      type: 'text',
      label: 'One-liner',
      required: true,
      localized: true,
      admin: {
        description: 'Short description for cards (localized)',
      },
    },

    // === Featured Image ===
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Hero image (shared across all locales)',
      },
    },

    // === Relationships ===
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
      admin: {
        description: 'Categories for this case',
      },
    },
    {
      name: 'tools',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      label: 'Tools',
      admin: {
        description: 'AI/coding tools used',
      },
    },

    // === Detail Content (localized) ===
    {
      name: 'problem',
      type: 'textarea',
      label: 'Problem',
      localized: true,
      admin: {
        description: 'What problem does this solve? (localized)',
      },
    },
    {
      name: 'solution',
      type: 'textarea',
      label: 'Solution',
      localized: true,
      admin: {
        description: 'How was it solved? (localized)',
      },
    },
    {
      name: 'stack',
      type: 'text',
      label: 'Stack',
      admin: {
        description: 'Comma-separated tech stack (e.g., "Next.js, Prisma, Tailwind")',
      },
    },
    {
      name: 'learnings',
      type: 'textarea',
      label: 'Learnings',
      localized: true,
      admin: {
        description: 'What was learned? (localized)',
      },
    },

    // === Builder Ownership ===
    {
      name: 'ownerBuilder',
      type: 'relationship',
      relationTo: 'builders',
      label: 'Owner Builder',
      admin: {
        position: 'sidebar',
        description: 'Builder who created this case',
      },
    },
    // === Future: Profile Linking ===
    {
      name: 'ownerProfileId',
      type: 'text',
      label: 'Owner Profile ID',
      admin: {
        position: 'sidebar',
        description: 'Future: link to Clerk/Convex profile for community submissions',
      },
    },

    // === Timestamps ===
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
        description: 'When this case was published',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}

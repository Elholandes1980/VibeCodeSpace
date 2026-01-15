/**
 * payload/collections/Builders.ts
 *
 * Builders collection for community members who create cases.
 * Includes social stats snapshot fields for X/Twitter data.
 * Supports free/pro/studio plans with visibility controls.
 *
 * Related:
 * - payload/collections/Cases.ts
 * - features/builders/
 * - lib/social/
 */

import type { CollectionConfig } from 'payload'

export const Builders: CollectionConfig = {
  slug: 'builders',
  admin: {
    useAsTitle: 'name',
    group: 'Community',
    description: 'Community builders who create cases',
    defaultColumns: ['name', 'plan', 'visible', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // === Identity ===
    {
      name: 'name',
      type: 'text',
      label: 'Display Name',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in /builders/[slug] URL',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Bio',
      localized: true,
      admin: {
        description: 'Brief description (max 280 chars)',
      },
      maxLength: 280,
    },

    // === Avatar ===
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar Image',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'External Avatar URL',
      admin: {
        description: 'Use if avatar is hosted externally (e.g., Twitter)',
      },
    },

    // === Links ===
    {
      type: 'group',
      name: 'links',
      label: 'Social Links',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'xHandle',
              type: 'text',
              label: 'X Handle (without @)',
              admin: { width: '50%' },
            },
            {
              name: 'xUrl',
              type: 'text',
              label: 'X Profile URL',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkedinUrl',
              type: 'text',
              label: 'LinkedIn URL',
              admin: { width: '50%' },
            },
            {
              name: 'websiteUrl',
              type: 'text',
              label: 'Website URL',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'githubUrl',
          type: 'text',
          label: 'GitHub URL',
        },
      ],
    },

    // === Plan & Visibility ===
    {
      name: 'plan',
      type: 'select',
      label: 'Plan',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
        { label: 'Studio', value: 'studio' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible on Site',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show in builders listing',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured sections',
      },
    },

    // === Social Stats (Snapshot) ===
    {
      type: 'group',
      name: 'socialStats',
      label: 'Social Stats (X/Twitter)',
      admin: {
        description: 'Snapshot data - updated via refresh script',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'xFollowers',
              type: 'number',
              label: 'Followers',
              admin: {
                readOnly: true,
                width: '33%',
              },
            },
            {
              name: 'xFollowing',
              type: 'number',
              label: 'Following',
              admin: {
                readOnly: true,
                width: '33%',
              },
            },
            {
              name: 'xPosts',
              type: 'number',
              label: 'Posts',
              admin: {
                readOnly: true,
                width: '33%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lastFetched',
              type: 'date',
              label: 'Last Fetched',
              admin: {
                readOnly: true,
                width: '50%',
                date: {
                  displayFormat: 'd MMM yyyy HH:mm',
                },
              },
            },
            {
              name: 'fetchStatus',
              type: 'select',
              label: 'Fetch Status',
              defaultValue: 'never',
              options: [
                { label: 'Never Fetched', value: 'never' },
                { label: 'OK', value: 'ok' },
                { label: 'Failed', value: 'failed' },
              ],
              admin: {
                readOnly: true,
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'fetchError',
          type: 'text',
          label: 'Last Error',
          admin: {
            readOnly: true,
            description: 'Error message from last failed fetch',
          },
        },
      ],
    },

    // === Denormalized Stats ===
    {
      name: 'caseCount',
      type: 'number',
      label: 'Case Count',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-updated when cases change',
      },
    },
  ],
  timestamps: true,
}

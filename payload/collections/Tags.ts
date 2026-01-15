/**
 * payload/collections/Tags.ts
 *
 * Tags collection for categorizing cases.
 * Name is localized, slug is shared across locales.
 *
 * Related:
 * - payload/collections/Cases.ts
 * - payload.config.ts
 */

import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    description: 'Categories for organizing cases',
  },
  access: {
    // Public read for frontend
    read: () => true,
    // Only authenticated users can manage
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "ai-native")',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      localized: true,
      admin: {
        description: 'Display name (localized)',
      },
    },
  ],
  timestamps: true,
}

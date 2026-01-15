/**
 * payload/collections/ToolCategories.ts
 *
 * Tool categories for organizing AI/coding tools in the mega menu.
 * Supports nesting via parent relationship and mega menu grouping.
 * All display text is localized (nl source, en/es fallback).
 *
 * Related:
 * - payload/collections/Tools.ts
 * - payload/globals/Navigation.ts
 * - components/nav/MegaMenu.tsx
 */

import type { CollectionConfig } from 'payload'

export const ToolCategories: CollectionConfig = {
  slug: 'tool-categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Categories for organizing tools in the mega menu',
    defaultColumns: ['title', 'slug', 'megaMenuGroup', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      admin: {
        description: 'Category display name (e.g., "AI Assistenten")',
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
        description: 'URL-friendly identifier (e.g., "ai-assistants"). NOT localized.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      admin: {
        description: 'Optional description for category landing pages',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'tool-categories',
      label: 'Parent Category',
      admin: {
        description: 'Optional parent for nested categories',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Order',
      defaultValue: 0,
      admin: {
        description: 'Sort order within the same level (lower = first)',
      },
    },
    // === Mega Menu Configuration ===
    {
      type: 'collapsible',
      label: 'Mega Menu Settings',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'showInMegaMenu',
          type: 'checkbox',
          label: 'Show in Mega Menu',
          defaultValue: true,
          admin: {
            description: 'Whether to display this category in the Tools mega menu',
          },
        },
        {
          name: 'megaMenuGroup',
          type: 'select',
          label: 'Mega Menu Group',
          defaultValue: 'build-code',
          options: [
            { label: 'Build & Code', value: 'build-code' },
            { label: 'Models & Providers', value: 'models-providers' },
            { label: 'Create & Media', value: 'create-media' },
            { label: 'Automate', value: 'automate' },
          ],
          admin: {
            description: 'Which section group this category belongs to in the mega menu',
            condition: (data) => data?.showInMegaMenu,
          },
        },
        {
          name: 'megaMenuColumn',
          type: 'select',
          label: 'Mega Menu Column',
          defaultValue: 'core',
          options: [
            { label: 'Core Categories', value: 'core' },
            { label: 'Use Cases', value: 'usecases' },
            { label: 'Compare & Guides', value: 'compare' },
          ],
          admin: {
            description: 'Which column this category appears in',
            condition: (data) => data?.showInMegaMenu,
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon Name',
          admin: {
            description: 'Lucide icon name (e.g., "code", "sparkles", "video")',
            condition: (data) => data?.showInMegaMenu,
          },
        },
      ],
    },
  ],
  timestamps: true,
}

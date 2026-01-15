/**
 * payload/collections/Tools.ts
 *
 * Tools collection for AI/coding tools - affiliate-ready money pages.
 * Includes mega menu display, category relationships, and affiliate features.
 * Name and descriptions are localized (nl source, en/es auto-translated).
 *
 * Related:
 * - payload/collections/Cases.ts
 * - payload/collections/ToolCategories.ts
 * - payload/globals/Navigation.ts
 * - payload/globals/ToolsSettings.ts
 * - payload/hooks/toolsAutoTranslate.ts
 * - payload/hooks/toolsUrlIngest.ts
 * - payload.config.ts
 */

import type { CollectionConfig } from 'payload'
import { toolsAutoTranslateHook } from '../hooks/toolsAutoTranslate'
import { toolsUrlIngestHook } from '../hooks/toolsUrlIngest'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    description: 'AI and coding tools - affiliate-ready pages',
    defaultColumns: ['name', 'slug', 'category', 'status', 'pricingModel'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [toolsAutoTranslateHook],
    beforeChange: [toolsUrlIngestHook],
  },
  fields: [
    // === Core Identity ===
    {
      type: 'row',
      fields: [
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '50%',
            description: 'URL-friendly identifier (e.g., "claude")',
          },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          defaultValue: 'review',
          index: true,
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'In Review', value: 'review' },
            { label: 'Published', value: 'published' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
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
    {
      name: 'shortOneLiner',
      type: 'text',
      label: 'Short One-Liner',
      required: true,
      localized: true,
      admin: {
        description: 'Brief description for cards and mega menu (max 100 chars)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Full Description',
      required: true,
      localized: true,
      admin: {
        description: 'Editorial paragraph about this tool (2-4 sentences)',
      },
    },

    // === URLs ===
    {
      type: 'collapsible',
      label: 'URLs & Links',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'websiteUrl',
          type: 'text',
          label: 'Website URL',
          required: true,
          admin: {
            description: 'Official tool website (canonical URL)',
          },
        },
        {
          name: 'makerUrl',
          type: 'text',
          label: 'Maker Website',
          admin: {
            description: 'Company/maker website if different from tool URL',
          },
        },
        {
          name: 'affiliateUrl',
          type: 'text',
          label: 'Affiliate URL',
          admin: {
            description: 'Affiliate/referral link (takes priority over websiteUrl)',
          },
        },
      ],
    },

    // === Categorization ===
    {
      type: 'collapsible',
      label: 'Categorization',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'tool-categories',
          label: 'Primary Category',
          admin: {
            description: 'Main category for this tool',
          },
        },
        {
          name: 'additionalCategories',
          type: 'relationship',
          relationTo: 'tool-categories',
          hasMany: true,
          label: 'Additional Categories',
          admin: {
            description: 'Secondary categories (optional)',
          },
        },
        {
          name: 'primaryUseCase',
          type: 'text',
          label: 'Primary Use Case',
          localized: true,
          admin: {
            description: 'Main use case (e.g., "Code completion", "Image generation")',
          },
        },
      ],
    },

    // === Editorial Content ===
    {
      type: 'collapsible',
      label: 'Editorial Content',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'bestFor',
          type: 'array',
          label: 'Best For (Bullets)',
          localized: true,
          admin: {
            description: '3-5 bullet points: when/why to use this tool',
          },
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'notFor',
          type: 'array',
          label: 'Not For (Bullets)',
          localized: true,
          admin: {
            description: '2-4 bullet points: when NOT to use this tool',
          },
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'keyFeatures',
          type: 'array',
          label: 'Key Features',
          localized: true,
          admin: {
            description: 'Optional: highlight specific features',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Feature Name',
            },
            {
              name: 'detail',
              type: 'text',
              label: 'Detail/Description',
            },
          ],
        },
      ],
    },

    // === Pricing ===
    {
      type: 'collapsible',
      label: 'Pricing & Business',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pricingModel',
              type: 'select',
              label: 'Pricing Model',
              defaultValue: 'unknown',
              options: [
                { label: 'Free', value: 'free' },
                { label: 'Freemium', value: 'freemium' },
                { label: 'Paid', value: 'paid' },
                { label: 'Enterprise', value: 'enterprise' },
                { label: 'Unknown', value: 'unknown' },
              ],
              admin: {
                width: '33%',
              },
            },
            {
              name: 'pricingFrom',
              type: 'text',
              label: 'Starting Price',
              admin: {
                width: '33%',
                description: 'e.g., "$20/mo", "Free tier"',
              },
            },
            {
              name: 'trialAvailable',
              type: 'checkbox',
              label: 'Trial Available',
              defaultValue: false,
              admin: {
                width: '33%',
              },
            },
          ],
        },
      ],
    },

    // === Media ===
    {
      type: 'collapsible',
      label: 'Media',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                width: '50%',
                description: 'Tool logo (square, min 128x128)',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
              admin: {
                width: '50%',
                description: 'Hero image for detail page',
              },
            },
          ],
        },
        {
          name: 'ogImageUrl',
          type: 'text',
          label: 'OG Image URL',
          admin: {
            description: 'Auto-captured from metadata (can be downloaded later)',
          },
        },
        {
          name: 'faviconUrl',
          type: 'text',
          label: 'Favicon URL',
          admin: {
            description: 'Auto-captured from metadata',
          },
        },
      ],
    },

    // === Ingest & Metadata ===
    {
      type: 'collapsible',
      label: 'Ingest & Metadata',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ingestSource',
              type: 'select',
              label: 'Ingest Source',
              defaultValue: 'manual',
              options: [
                { label: 'Manual', value: 'manual' },
                { label: 'URL Ingest', value: 'url-ingest' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'lastIngestedAt',
              type: 'date',
              label: 'Last Ingested',
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title (from URL)',
          admin: {
            description: 'Captured from page <title>',
          },
        },
        {
          name: 'metaDescription',
          type: 'text',
          label: 'Meta Description (from URL)',
          admin: {
            description: 'Captured from meta description',
          },
        },
        {
          name: 'ingestError',
          type: 'text',
          label: 'Ingest Error',
          admin: {
            readOnly: true,
            description: 'Last error from URL ingest',
          },
        },
        {
          name: 'ingestWarnings',
          type: 'array',
          label: 'Ingest Warnings',
          admin: {
            readOnly: true,
          },
          fields: [
            {
              name: 'warning',
              type: 'text',
            },
          ],
        },
      ],
    },

    // === Translation Settings ===
    {
      type: 'collapsible',
      label: 'Translation Settings',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'syncTranslationsFromNL',
          type: 'checkbox',
          label: 'Sync Translations from NL',
          defaultValue: true,
          admin: {
            description: 'When enabled, NL changes auto-fill EN/ES (if empty)',
          },
        },
      ],
    },

    // === Admin Sidebar ===
    {
      name: 'featuredInMenu',
      type: 'checkbox',
      label: 'Featured in Menu',
      defaultValue: false,
      admin: {
        description: 'Eligible to be featured in mega menu',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

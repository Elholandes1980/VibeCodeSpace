/**
 * payload/globals/Navigation.ts
 *
 * Global singleton for navigation configuration including the Tools mega menu.
 * All menu labels, sections, and links are CMS-driven and localized.
 *
 * Related:
 * - payload/collections/ToolCategories.ts
 * - payload/collections/Tools.ts
 * - components/nav/MegaMenu.tsx
 * - lib/cms/navigation.ts
 */

import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
    description: 'Configure main navigation and mega menus',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === Tools Mega Menu Configuration ===
    {
      type: 'group',
      name: 'toolsMegaMenu',
      label: 'Tools Mega Menu',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Mega Menu',
          defaultValue: true,
          admin: {
            description: 'Show mega menu dropdown for Tools navigation item',
          },
        },

        // === Column A: Core Categories Sections ===
        {
          name: 'coreSections',
          type: 'array',
          label: 'Core Sections (Column A)',
          admin: {
            description: 'Grouped category sections for the main column',
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Section Heading',
              required: true,
              localized: true,
              admin: {
                description: 'e.g., "Build & Code", "Models & Providers"',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'tool-categories',
              hasMany: true,
              label: 'Categories',
              admin: {
                description: 'Categories to show in this section',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Order',
              defaultValue: 0,
            },
          ],
        },

        // === Column B: Use Cases ===
        {
          name: 'useCasesHeading',
          type: 'text',
          label: 'Use Cases Column Heading',
          localized: true,
          defaultValue: 'Gebruik dit als je…',
          admin: {
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
        },
        {
          name: 'useCaseLinks',
          type: 'array',
          label: 'Use Case Links (Column B)',
          admin: {
            description: 'Contextual links like "snel een MVP bouwen"',
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              localized: true,
              admin: {
                description: 'e.g., "snel een MVP bouwen"',
              },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Link URL',
              admin: {
                description: 'Direct URL (overrides filter if set)',
              },
            },
            {
              name: 'filterCategory',
              type: 'relationship',
              relationTo: 'tool-categories',
              label: 'Filter by Category',
              admin: {
                description: 'Filter tools page by this category',
                condition: (_, siblingData) => !siblingData?.href,
              },
            },
            {
              name: 'filterQuery',
              type: 'text',
              label: 'Filter Query',
              admin: {
                description: 'Custom query parameter (e.g., "type=mvp")',
                condition: (_, siblingData) => !siblingData?.href,
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon Name',
              admin: {
                description: 'Optional Lucide icon name',
              },
            },
          ],
        },

        // === Column C: Compare & Guides ===
        {
          name: 'compareHeading',
          type: 'text',
          label: 'Compare Column Heading',
          localized: true,
          defaultValue: 'Vergelijk & Begrijp',
          admin: {
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
        },
        {
          name: 'compareLinks',
          type: 'array',
          label: 'Compare Links (Column C)',
          admin: {
            description: 'Comparison and guide links',
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              localized: true,
              admin: {
                description: 'e.g., "Claude vs GPT vs Gemini"',
              },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Link URL',
              required: true,
              admin: {
                description: 'URL to comparison page',
              },
            },
            {
              name: 'badge',
              type: 'text',
              label: 'Badge',
              localized: true,
              admin: {
                description: 'Optional badge text (e.g., "Nieuw", "Populair")',
              },
            },
          ],
        },

        // === Column D: Featured Tool ===
        {
          name: 'showFeatured',
          type: 'checkbox',
          label: 'Show Featured Tool',
          defaultValue: true,
          admin: {
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
        },
        {
          name: 'featuredLabel',
          type: 'text',
          label: 'Featured Label',
          localized: true,
          defaultValue: 'Tool van de week',
          admin: {
            condition: (data) => data?.toolsMegaMenu?.enabled && data?.toolsMegaMenu?.showFeatured,
          },
        },
        {
          name: 'featuredTool',
          type: 'relationship',
          relationTo: 'tools',
          label: 'Featured Tool',
          admin: {
            description: 'Select tool to feature in mega menu',
            condition: (data) => data?.toolsMegaMenu?.enabled && data?.toolsMegaMenu?.showFeatured,
          },
        },
        {
          name: 'featuredDescription',
          type: 'textarea',
          label: 'Featured Description',
          localized: true,
          admin: {
            description: 'Short description for the featured tool',
            condition: (data) => data?.toolsMegaMenu?.enabled && data?.toolsMegaMenu?.showFeatured,
          },
        },
        {
          name: 'featuredCtaLabel',
          type: 'text',
          label: 'Featured CTA Label',
          localized: true,
          defaultValue: 'Bekijk tool',
          admin: {
            condition: (data) => data?.toolsMegaMenu?.enabled && data?.toolsMegaMenu?.showFeatured,
          },
        },

        // === Footer Links ===
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Menu Footer Links',
          admin: {
            description: 'Optional links at bottom of mega menu',
            condition: (data) => data?.toolsMegaMenu?.enabled,
          },
          maxRows: 3,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              label: 'URL',
              required: true,
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon Name',
            },
          ],
        },
      ],
    },
  ],
}

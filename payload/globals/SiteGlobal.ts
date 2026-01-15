/**
 * payload/globals/SiteGlobal.ts
 *
 * Global singleton for site-wide content.
 * Includes navigation, footer, CTAs, and page intros.
 * All text fields are localized (nl source, en/es auto-translated).
 *
 * Related:
 * - payload.config.ts
 * - components/site-header.tsx
 * - components/site-footer.tsx
 */

import type { GlobalConfig } from 'payload'

export const SiteGlobal: GlobalConfig = {
  slug: 'site-global',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === Site Identity ===
    {
      type: 'group',
      name: 'identity',
      label: 'Site Identity',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Site Name',
          required: true,
          defaultValue: 'VibeCodeSpace',
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          localized: true,
          defaultValue: 'Vibe coding in praktijk',
        },
      ],
    },

    // === Primary Navigation ===
    {
      type: 'group',
      name: 'navigation',
      label: 'Navigation',
      fields: [
        {
          name: 'primaryNav',
          type: 'array',
          label: 'Primary Navigation',
          admin: {
            description: 'Main navigation items (max 6)',
          },
          maxRows: 8,
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
              admin: {
                description: 'Use relative paths like /explore or absolute URLs',
              },
            },
            {
              name: 'style',
              type: 'select',
              label: 'Style',
              defaultValue: 'default',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Highlight', value: 'highlight' },
              ],
            },
            {
              name: 'visibility',
              type: 'select',
              label: 'Visibility',
              defaultValue: 'public',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Logged In Only', value: 'loggedIn' },
                { label: 'Pro Only', value: 'pro' },
                { label: 'Studio Only', value: 'studio' },
              ],
            },
          ],
        },
      ],
    },

    // === Header CTAs ===
    {
      type: 'group',
      name: 'headerCtas',
      label: 'Header CTAs',
      fields: [
        {
          name: 'primaryCtaLabel',
          type: 'text',
          label: 'Primary CTA Label',
          localized: true,
          defaultValue: 'Dien micro-probleem in',
        },
        {
          name: 'primaryCtaHref',
          type: 'text',
          label: 'Primary CTA URL',
          defaultValue: '/micro-probleem',
        },
      ],
    },

    // === Footer ===
    {
      type: 'group',
      name: 'footer',
      label: 'Footer',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright Text',
          localized: true,
          defaultValue: 'Alle rechten voorbehouden.',
        },
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          maxRows: 6,
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
          ],
        },
      ],
    },

    // === Page Intros ===
    {
      type: 'group',
      name: 'pageIntros',
      label: 'Page Intros',
      admin: {
        description: 'Intro text for section pages',
      },
      fields: [
        {
          name: 'exploreTitle',
          type: 'text',
          label: 'Explore Page Title',
          localized: true,
          defaultValue: 'Ontdek',
        },
        {
          name: 'exploreDescription',
          type: 'textarea',
          label: 'Explore Page Description',
          localized: true,
          defaultValue: 'Ontdek wat bouwers creëren in het vibecoding-tijdperk.',
        },
        {
          name: 'toolsTitle',
          type: 'text',
          label: 'Tools Page Title',
          localized: true,
          defaultValue: 'Tools',
        },
        {
          name: 'toolsDescription',
          type: 'textarea',
          label: 'Tools Page Description',
          localized: true,
          defaultValue: 'Tools en technologieën gebruikt in vibecoding-projecten.',
        },
        {
          name: 'pulseTitle',
          type: 'text',
          label: 'Pulse Page Title',
          localized: true,
          defaultValue: 'Pulse',
        },
        {
          name: 'pulseDescription',
          type: 'textarea',
          label: 'Pulse Page Description',
          localized: true,
          defaultValue: 'Gecureerde updates uit de wereld van AI-assisted development.',
        },
      ],
    },

    // === Course CTA (NL-only banner) ===
    {
      type: 'group',
      name: 'courseCta',
      label: 'Course CTA (NL Only)',
      admin: {
        description: 'Promotional banner for VibeCoding course',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          localized: true,
          defaultValue: 'Van idee naar werkende app in 21 dagen',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Description',
          localized: true,
          defaultValue: 'Leer vibecoding en bouw je eigen software — voordat iemand anders jouw idee realiseert.',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button Label',
          localized: true,
          defaultValue: 'Bekijk de cursus',
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'Button URL',
          defaultValue: 'https://www.vibecodemadness.nl/',
        },
        {
          name: 'subtext',
          type: 'text',
          label: 'Subtext (optional)',
          localized: true,
        },
      ],
    },

    // === Case Detail CTAs ===
    {
      type: 'group',
      name: 'caseCtas',
      label: 'Case Detail CTAs',
      fields: [
        {
          name: 'submitCaseTitle',
          type: 'text',
          label: 'Submit Case CTA Title',
          localized: true,
          defaultValue: 'Ook iets gebouwd met AI?',
        },
        {
          name: 'submitCaseText',
          type: 'textarea',
          label: 'Submit Case CTA Text',
          localized: true,
          defaultValue: 'Deel je project met de vibecoding community.',
        },
        {
          name: 'submitCaseButtonLabel',
          type: 'text',
          label: 'Submit Case Button Label',
          localized: true,
          defaultValue: 'Dien je case in',
        },
        {
          name: 'submitCaseButtonHref',
          type: 'text',
          label: 'Submit Case Button URL',
          defaultValue: '/micro-probleem',
        },
      ],
    },

    // === SEO Defaults ===
    {
      type: 'group',
      name: 'seoDefaults',
      label: 'SEO Defaults',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          label: 'Default Title',
          localized: true,
          defaultValue: 'VibeCodeSpace — Software gebouwd in het vibecoding-tijdperk',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          label: 'Default Description',
          localized: true,
          defaultValue: 'Showcases, nieuws en micro-oplossingen — zodat jij sneller bouwt en betere keuzes maakt.',
        },
      ],
    },
  ],
}

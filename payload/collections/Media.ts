/**
 * payload/collections/Media.ts
 *
 * Media uploads collection for images.
 * Shared across all locales (same image for NL/EN/ES).
 * Alt text is localized for accessibility.
 *
 * Related:
 * - payload/collections/Cases.ts
 * - payload.config.ts
 */

import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
    description: 'Upload images for cases and content',
  },
  access: {
    // Public read for images
    read: () => true,
    // Only authenticated users can upload
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  upload: {
    staticDir: 'media',
    // Vercel Blob storage plugin will override this when BLOB_READ_WRITE_TOKEN is set
    disableLocalStorage: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 225,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 450,
        position: 'centre',
      },
      {
        name: 'featured',
        width: 1200,
        height: 675,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      localized: true,
      required: true,
      admin: {
        description: 'Describe the image for accessibility',
      },
    },
    // === Attribution Fields ===
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      defaultValue: 'upload',
      options: [
        { label: 'Upload', value: 'upload' },
        { label: 'Unsplash', value: 'unsplash' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Where this image came from',
        position: 'sidebar',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source URL',
      admin: {
        description: 'Original URL where image was sourced from',
        position: 'sidebar',
        condition: (data) => data?.source !== 'upload',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Credit',
      admin: {
        description: 'Photographer or creator attribution',
        position: 'sidebar',
      },
    },
    {
      name: 'license',
      type: 'text',
      label: 'License',
      admin: {
        description: 'License type (e.g., "Unsplash License", "CC BY 4.0")',
        position: 'sidebar',
      },
    },
    {
      name: 'licenseNotes',
      type: 'textarea',
      label: 'License Notes',
      admin: {
        description: 'Additional licensing information or restrictions',
        position: 'sidebar',
      },
    },
  ],
}

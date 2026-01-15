/**
 * payload.config.ts
 *
 * Payload CMS configuration - single source of truth for public content.
 * Uses SQLite for local storage.
 * Localization enabled: nl (default), en, es.
 *
 * Architecture:
 * - Payload: editorial content (cases, tools, tags)
 * - Convex: community submissions, workflow, marketplace logic
 *
 * Related:
 * - app/(payload)/admin/[[...segments]]/page.tsx
 * - app/(payload)/api/[...slug]/route.ts
 * - payload/collections/
 */

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Profiles } from './payload/collections/Profiles'
import { Media } from './payload/collections/Media'
import { Tags } from './payload/collections/Tags'
import { ToolCategories } from './payload/collections/ToolCategories'
import { Tools } from './payload/collections/Tools'
import { Cases } from './payload/collections/Cases'
import { Builders } from './payload/collections/Builders'
import { Pages } from './payload/collections/Pages'
import { SiteGlobal, CoursePromo, Navigation, ToolsSettings } from './payload/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // === Localization ===
  localization: {
    locales: [
      {
        code: 'nl',
        label: 'Nederlands',
      },
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'es',
        label: 'Español',
      },
    ],
    defaultLocale: 'nl',
    fallback: true,
  },

  // === Admin Panel ===
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— VibeCodeSpace Admin',
    },
  },

  // === Collections ===
  collections: [
    // Auth & Admin
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'editor',
        },
      ],
    },
    Profiles,
    // Content (CMS-managed)
    Media,
    Tags,
    ToolCategories,
    Tools,
    Cases,
    Builders,
    Pages,
  ],

  // === Globals ===
  globals: [SiteGlobal, CoursePromo, Navigation, ToolsSettings],

  // === Editor ===
  editor: lexicalEditor(),

  // === Security ===
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  // === TypeScript ===
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // === Database ===
  db: sqliteAdapter({
    client: {
      url: `file:${path.resolve(dirname, 'payload.db')}`,
    },
  }),

  // === Upload Storage ===
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})

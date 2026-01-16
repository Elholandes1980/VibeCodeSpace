/**
 * payload.config.ts
 *
 * Payload CMS configuration - single source of truth for public content.
 * Uses PostgreSQL (Neon) in production, local SQLite file in development.
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
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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

// Database configuration: PostgreSQL in production, local SQLite in development
const getDatabaseAdapter = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (databaseUrl) {
    // Production: Use PostgreSQL (Neon/Supabase)
    return postgresAdapter({
      pool: {
        connectionString: databaseUrl,
      },
      push: true, // Auto-push schema changes without prompting
    })
  }

  // Development: Use local SQLite file
  return sqliteAdapter({
    client: {
      url: `file:${path.resolve(dirname, 'payload.db')}`,
    },
  })
}

export default buildConfig({
  // === Server URL (required for production) ===
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',

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
  db: getDatabaseAdapter(),

  // === Upload Storage ===
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // === Cloud Storage (Vercel Blob in production) ===
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})

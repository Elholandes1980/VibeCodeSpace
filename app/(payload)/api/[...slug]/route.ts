/**
 * app/(payload)/api/[...slug]/route.ts
 *
 * Payload CMS API route handler.
 * Handles all /api/* routes for Payload operations.
 *
 * Related:
 * - payload.config.ts
 * - app/(payload)/admin/[[...segments]]/page.tsx
 */

/* eslint-disable */
// @ts-nocheck - Payload generates types dynamically
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'

// Ensure Payload API runs on Node.js runtime
export const runtime = 'nodejs'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)

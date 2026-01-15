/**
 * app/(payload)/admin/[[...segments]]/page.tsx
 *
 * Payload CMS admin page handler.
 * Catches all /admin/* routes and renders Payload admin UI.
 * Force dynamic to prevent static prerendering issues.
 *
 * Related:
 * - payload.config.ts
 * - app/(payload)/layout.tsx
 */

/* eslint-disable */
// @ts-nocheck - Payload generates types dynamically
import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import configPromise from '@payload-config'

// Prevent static prerendering - Payload admin must be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({ config: configPromise, params, searchParams, importMap })
}

export default Page

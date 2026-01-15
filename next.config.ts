/**
 * next.config.ts
 *
 * Next.js configuration for VibeCodeSpace.
 * Configures App Router settings and build options.
 * Uses withPayload wrapper for Payload CMS compatibility.
 *
 * Related:
 * - app/layout.tsx
 * - payload.config.ts
 */

import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
}

export default withPayload(nextConfig)

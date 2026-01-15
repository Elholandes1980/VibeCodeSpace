/**
 * lib/convex/client.ts
 *
 * Convex HTTP client for server-side usage.
 * Returns null if Convex is not configured.
 *
 * Related:
 * - convex/schema.ts
 * - components/providers/convex-provider.tsx
 */

import { ConvexHttpClient } from 'convex/browser'

// Convex deployment is now configured
const CONVEX_ENABLED = true
const convexUrl = CONVEX_ENABLED ? process.env.NEXT_PUBLIC_CONVEX_URL : undefined

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null

export function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    throw new Error(
      'Convex is disabled. Set CONVEX_ENABLED=true in lib/convex/client.ts when deployment is ready.'
    )
  }
  return convexClient
}

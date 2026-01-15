/**
 * components/providers/convex-provider.tsx
 *
 * Convex React provider for client-side data fetching.
 * Wraps the app with ConvexProvider for reactive queries.
 * Gracefully handles missing configuration during setup.
 *
 * Related:
 * - lib/convex/client.ts
 * - app/layout.tsx
 */

'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ReactNode, useMemo, useEffect } from 'react'

interface ConvexClientProviderProps {
  children: ReactNode
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  // Convex deployment is now configured
  const CONVEX_ENABLED = true

  const convexUrl = CONVEX_ENABLED ? process.env.NEXT_PUBLIC_CONVEX_URL : undefined

  useEffect(() => {
    console.log('[ConvexProvider] Mounted, enabled:', CONVEX_ENABLED, 'URL:', convexUrl || 'NOT SET')
  }, [convexUrl])

  const convex = useMemo(() => {
    if (!convexUrl) {
      console.log('[ConvexProvider] No URL, skipping client creation')
      return null
    }
    console.log('[ConvexProvider] Creating client for:', convexUrl)
    return new ConvexReactClient(convexUrl)
  }, [convexUrl])

  // If Convex is not configured, render children without provider
  if (!convex) {
    console.log('[ConvexProvider] Rendering without provider')
    return <>{children}</>
  }

  console.log('[ConvexProvider] Rendering with provider')
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}

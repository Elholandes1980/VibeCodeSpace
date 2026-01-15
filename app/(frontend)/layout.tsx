/**
 * app/(frontend)/layout.tsx
 *
 * Root layout for frontend routes.
 * Contains html/body tags (required by Next.js).
 * Includes ConvexProvider for reactive data fetching.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/layout.tsx
 * - components/providers/convex-provider.tsx
 * - app/globals.css
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeCodeSpace',
  description: 'Software gebouwd in het vibecoding-tijdperk',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}

/**
 * app/(frontend)/layout.tsx
 *
 * Root layout for FitVibe 3D fitness app.
 * Contains html/body tags required by Next.js.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/fitness/page.tsx
 */

import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'FitVibe 3D - Fitness Oefeningen',
  description: 'Interactieve 3D fitness oefeningen met geanimeerde demonstraties',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

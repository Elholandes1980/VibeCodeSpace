/**
 * app/(frontend)/(public)/[locale]/layout.tsx
 *
 * Simple layout for locale-based routes.
 * No header/footer needed for standalone fitness app.
 *
 * Related:
 * - app/(frontend)/layout.tsx
 */

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>
}

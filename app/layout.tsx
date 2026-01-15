/**
 * app/layout.tsx
 *
 * Minimal root layout - each route group defines its own html/body.
 * This allows Payload admin to have isolated context providers.
 *
 * Related:
 * - app/(frontend)/layout.tsx - frontend routes with ConvexProvider
 * - app/(payload)/layout.tsx - Payload admin routes
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

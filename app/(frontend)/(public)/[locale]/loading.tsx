/**
 * app/(frontend)/(public)/[locale]/loading.tsx
 *
 * Loading skeleton for locale home page.
 * Displays animated placeholders while content loads.
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded bg-muted" />
        <div className="h-4 w-3/4 max-w-xl rounded bg-muted" />
      </div>
    </div>
  )
}

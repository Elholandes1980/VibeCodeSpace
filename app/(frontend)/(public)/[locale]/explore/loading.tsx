/**
 * app/(frontend)/(public)/[locale]/explore/loading.tsx
 *
 * Loading skeleton for explore page.
 * Displays grid placeholders while cases load.
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-32 rounded bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

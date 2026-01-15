/**
 * app/(frontend)/(public)/[locale]/tools/loading.tsx
 *
 * Loading skeleton for tools page.
 * Displays grid placeholders while tools load.
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-24 rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

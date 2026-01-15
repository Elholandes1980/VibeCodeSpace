/**
 * app/(frontend)/(public)/[locale]/pulse/loading.tsx
 *
 * Loading skeleton for pulse page.
 * Displays list placeholders while pulse items load.
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-28 rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * features/pulse/components/LoadingSkeleton.tsx
 *
 * Loading skeleton for Pulse feed.
 * Shows placeholder items while content loads.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/pulse/loading.tsx
 */

function SkeletonItem() {
  return (
    <div className="flex gap-4 py-4 animate-pulse">
      {/* Source badge skeleton */}
      <div className="w-10 h-6 bg-muted rounded" />

      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-12" />
          <div className="h-3 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-0 divide-y divide-border/50">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  )
}

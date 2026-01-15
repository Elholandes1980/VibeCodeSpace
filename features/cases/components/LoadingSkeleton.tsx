/**
 * features/cases/components/LoadingSkeleton.tsx
 *
 * Skeleton loading state for cases grid.
 * Displays placeholder cards during data fetching.
 *
 * Related:
 * - features/cases/components/CasesGrid.tsx
 * - features/cases/CasesExplore.tsx
 */

interface LoadingSkeletonProps {
  count?: number
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {/* Title skeleton */}
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

      {/* Description skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
      </div>

      {/* Tags skeleton */}
      <div className="mt-4 flex gap-1.5">
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Tools skeleton */}
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-18 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

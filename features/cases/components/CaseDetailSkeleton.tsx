/**
 * features/cases/components/CaseDetailSkeleton.tsx
 *
 * Skeleton loading state for case detail page.
 * Matches the layout of CaseDetail component.
 *
 * Related:
 * - features/cases/components/CaseDetail.tsx
 * - features/cases/CaseDetailPage.tsx
 */

export function CaseDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Featured Image Skeleton */}
      <div className="aspect-video max-h-[280px] w-full rounded-lg bg-muted" />

      {/* Hero Section Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-6 w-full rounded bg-muted" />

        {/* Tags + Tools Skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-20 rounded-full bg-muted" />
          <div className="h-7 w-24 rounded-full bg-muted" />
          <div className="h-7 w-16 rounded-full bg-muted" />
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="h-7 w-32 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <div className="h-7 w-28 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>

        {/* Stack Skeleton */}
        <div className="space-y-3">
          <div className="h-7 w-24 rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-20 rounded-md bg-muted" />
            <div className="h-8 w-16 rounded-md bg-muted" />
            <div className="h-8 w-24 rounded-md bg-muted" />
            <div className="h-8 w-18 rounded-md bg-muted" />
          </div>
        </div>
      </div>

      {/* CTA Skeleton */}
      <div className="border-t border-border pt-8">
        <div className="h-11 w-40 rounded-md bg-muted" />
      </div>
    </div>
  )
}

/**
 * features/builders/components/BuildersLoadingSkeleton.tsx
 *
 * Loading skeleton for the builders grid.
 *
 * Related:
 * - features/builders/BuildersExplore.tsx
 */

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BuildersLoadingSkeletonProps {
  count?: number
}

export function BuildersLoadingSkeleton({ count = 6 }: BuildersLoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            {/* Header skeleton */}
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {/* Bio skeleton */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            {/* Stats skeleton */}
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

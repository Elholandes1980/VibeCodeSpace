/**
 * components/ui/skeleton.tsx
 *
 * Skeleton loading placeholder component.
 * Used for loading states across the application.
 *
 * Related:
 * - features/builders/components/BuildersLoadingSkeleton.tsx
 * - features/cases/components/LoadingSkeleton.tsx
 */

import { cn } from '@/lib/utils'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

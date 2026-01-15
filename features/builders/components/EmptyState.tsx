/**
 * features/builders/components/EmptyState.tsx
 *
 * Empty state component for when no builders match filters.
 *
 * Related:
 * - features/builders/BuildersExplore.tsx
 */

import { Button } from '@/components/ui/button'
import type { BuildersDictionary } from '../types'

interface EmptyStateProps {
  dictionary: BuildersDictionary['empty']
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({ dictionary, hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{dictionary.title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{dictionary.description}</p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          {dictionary.clearFilters}
        </Button>
      )}
    </div>
  )
}

/**
 * features/cases/components/EmptyState.tsx
 *
 * Empty state display when no cases match filters.
 * Shows message and option to clear filters.
 *
 * Related:
 * - features/cases/types/index.ts
 * - features/cases/CasesExplore.tsx
 */

import type { ExploreDictionary } from '../types'

interface EmptyStateProps {
  dictionary: ExploreDictionary['empty']
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({
  dictionary,
  hasFilters,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {dictionary.title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {dictionary.description}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {dictionary.clearFilters}
        </button>
      )}
    </div>
  )
}

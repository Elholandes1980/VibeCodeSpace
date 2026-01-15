/**
 * features/builders/BuildersExplore.tsx
 *
 * Orchestrator component for the Builders page.
 * Receives data from server, handles client-side filtering.
 * Data is fetched from Payload CMS on the server.
 *
 * Related:
 * - features/builders/components/BuildersGrid.tsx
 * - features/builders/components/BuildersFilters.tsx
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { BuildersGrid } from './components/BuildersGrid'
import { BuildersFilters } from './components/BuildersFilters'
import { EmptyState } from './components/EmptyState'
import type { Builder, BuilderFilterState, BuildersDictionary, Locale } from './types'

interface BuildersExploreProps {
  locale: Locale
  dictionary: BuildersDictionary
  initialBuilders: Builder[]
}

export function BuildersExplore({
  locale,
  dictionary,
  initialBuilders,
}: BuildersExploreProps) {
  const [filters, setFilters] = useState<BuilderFilterState>({
    plan: null,
  })

  const hasFilters = filters.plan !== null

  // Sort: featured first, then by case count
  const sortedBuilders = useMemo(() => {
    return [...initialBuilders].sort((a, b) => {
      // Featured first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then by case count
      return b.caseCount - a.caseCount
    })
  }, [initialBuilders])

  // Filter builders client-side
  const filteredBuilders = useMemo(() => {
    let result = sortedBuilders

    if (filters.plan) {
      result = result.filter((b) => b.plan === filters.plan)
    }

    return result
  }, [sortedBuilders, filters])

  const handleFilterChange = useCallback((newFilters: BuilderFilterState) => {
    setFilters(newFilters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({ plan: null })
  }, [])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <BuildersFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        dictionary={dictionary.filters}
      />

      {/* Content */}
      {filteredBuilders.length === 0 ? (
        <EmptyState
          dictionary={dictionary.empty}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <BuildersGrid
          builders={filteredBuilders}
          locale={locale}
          dictionary={dictionary}
        />
      )}
    </div>
  )
}

/**
 * features/pulse/PulseFeed.tsx
 *
 * Orchestrator component for the Pulse feed page.
 * Receives data from server, handles client-side filtering.
 * Follows pattern from CasesExplore.tsx.
 *
 * Related:
 * - features/pulse/components/PulseList.tsx
 * - features/pulse/components/PulseFilters.tsx
 * - app/(frontend)/(public)/[locale]/pulse/page.tsx
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { PulseList } from './components/PulseList'
import { PulseFilters } from './components/PulseFilters'
import { EmptyState } from './components/EmptyState'
import type { PulseItem, PulseFilterState, PulseDictionary, Locale } from './types'

interface PulseFeedProps {
  locale: Locale
  dictionary: PulseDictionary
  items: PulseItem[]
}

export function PulseFeed({ locale, dictionary, items }: PulseFeedProps) {
  const [filters, setFilters] = useState<PulseFilterState>({
    category: null,
    source: null,
  })

  const filteredItems = useMemo(() => {
    let result = items

    if (filters.category) {
      result = result.filter((item) => item.category === filters.category)
    }

    if (filters.source) {
      result = result.filter((item) => item.source === filters.source)
    }

    return result
  }, [items, filters])

  const handleFilterChange = useCallback((newFilters: PulseFilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="space-y-6">
      <PulseFilters filters={filters} onFilterChange={handleFilterChange} dictionary={dictionary.filters} />

      {filteredItems.length === 0 ? (
        <EmptyState dictionary={dictionary.empty} />
      ) : (
        <PulseList items={filteredItems} dictionary={dictionary} locale={locale} />
      )}
    </div>
  )
}

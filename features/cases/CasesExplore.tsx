/**
 * features/cases/CasesExplore.tsx
 *
 * Orchestrator component for the Explore page.
 * Receives data from server, handles client-side filtering.
 * Data is fetched from Payload CMS on the server.
 *
 * Related:
 * - features/cases/components/CasesGrid.tsx
 * - features/cases/components/ExploreFilters.tsx
 * - lib/cms/payload.ts
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { CasesGrid } from './components/CasesGrid'
import { ExploreFilters } from './components/ExploreFilters'
import { EmptyState } from './components/EmptyState'
import type { Locale, FilterState, ExploreDictionary, Case, Tag, Tool } from './types'

interface CasesExploreProps {
  locale: Locale
  dictionary: ExploreDictionary
  initialCases: Case[]
  tags: Tag[]
  tools: Tool[]
}

export function CasesExplore({
  locale,
  dictionary,
  initialCases,
  tags,
  tools,
}: CasesExploreProps) {
  const [filters, setFilters] = useState<FilterState>({
    tagSlug: null,
    toolSlug: null,
  })

  const hasFilters = filters.tagSlug !== null || filters.toolSlug !== null

  // Filter cases client-side
  const filteredCases = useMemo(() => {
    let result = initialCases

    if (filters.tagSlug) {
      result = result.filter((c) =>
        c.tags.some((tag) => tag.slug === filters.tagSlug)
      )
    }

    if (filters.toolSlug) {
      result = result.filter((c) =>
        c.tools.some((tool) => tool.slug === filters.toolSlug)
      )
    }

    return result
  }, [initialCases, filters])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({ tagSlug: null, toolSlug: null })
  }, [])

  // Sort tags and tools alphabetically
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name))
  }, [tags])

  const sortedTools = useMemo(() => {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name))
  }, [tools])

  return (
    <div className="space-y-8">
      {/* Filters - always visible */}
      <ExploreFilters
        tags={sortedTags}
        tools={sortedTools}
        filters={filters}
        onFilterChange={handleFilterChange}
        dictionary={dictionary.filters}
      />

      {/* Content */}
      {filteredCases.length === 0 ? (
        <EmptyState
          dictionary={dictionary.empty}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <CasesGrid cases={filteredCases} locale={locale} />
      )}
    </div>
  )
}

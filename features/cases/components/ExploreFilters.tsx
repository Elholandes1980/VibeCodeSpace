/**
 * features/cases/components/ExploreFilters.tsx
 *
 * Filter controls for the explore page.
 * Allows filtering by tag and tool.
 * Always visible (no drawer).
 *
 * Related:
 * - features/cases/types/index.ts
 * - features/cases/CasesExplore.tsx
 */

'use client'

import { useCallback } from 'react'
import type { Tag, Tool, FilterState, ExploreDictionary } from '../types'

interface ExploreFiltersProps {
  tags: Tag[]
  tools: Tool[]
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  dictionary: ExploreDictionary['filters']
}

export function ExploreFilters({
  tags,
  tools,
  filters,
  onFilterChange,
  dictionary,
}: ExploreFiltersProps) {
  const handleTagChange = useCallback(
    (tagSlug: string | null) => {
      onFilterChange({ ...filters, tagSlug })
    },
    [filters, onFilterChange]
  )

  const handleToolChange = useCallback(
    (toolSlug: string | null) => {
      onFilterChange({ ...filters, toolSlug })
    },
    [filters, onFilterChange]
  )

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      {/* Tag filter */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="tag-filter"
          className="text-sm font-medium text-muted-foreground"
        >
          {dictionary.tags}:
        </label>
        <select
          id="tag-filter"
          value={filters.tagSlug ?? ''}
          onChange={(e) => handleTagChange(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">{dictionary.all}</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tool filter */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="tool-filter"
          className="text-sm font-medium text-muted-foreground"
        >
          {dictionary.tools}:
        </label>
        <select
          id="tool-filter"
          value={filters.toolSlug ?? ''}
          onChange={(e) => handleToolChange(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">{dictionary.all}</option>
          {tools.map((tool) => (
            <option key={tool.id} value={tool.slug}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

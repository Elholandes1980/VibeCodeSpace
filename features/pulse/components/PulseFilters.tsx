/**
 * features/pulse/components/PulseFilters.tsx
 *
 * Filter controls for Pulse feed.
 * Allows filtering by category and source.
 *
 * Related:
 * - features/pulse/PulseFeed.tsx
 */

import type { PulseFilterState, PulseCategory, PulseSource, PulseDictionary } from '../types'

interface PulseFiltersProps {
  filters: PulseFilterState
  onFilterChange: (filters: PulseFilterState) => void
  dictionary: PulseDictionary['filters']
}

const CATEGORIES: PulseCategory[] = ['tool-launch', 'success-story', 'tips-tutorial']
const SOURCES: PulseSource[] = ['hn', 'ph', 'devto', 'ih']

export function PulseFilters({ filters, onFilterChange, dictionary }: PulseFiltersProps) {
  const handleCategoryChange = (category: PulseCategory | null) => {
    onFilterChange({ ...filters, category })
  }

  const handleSourceChange = (source: PulseSource | null) => {
    onFilterChange({ ...filters, source })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border">
      {/* Category Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {dictionary.category}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filters.category === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {dictionary.all}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {dictionary.categories[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Source Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {dictionary.source}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSourceChange(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filters.source === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {dictionary.all}
          </button>
          {SOURCES.map((src) => (
            <button
              key={src}
              onClick={() => handleSourceChange(src)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.source === src
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {dictionary.sources[src]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

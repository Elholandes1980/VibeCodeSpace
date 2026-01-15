/**
 * features/builders/components/BuildersFilters.tsx
 *
 * Filter controls for the builders grid.
 * Allows filtering by plan type.
 *
 * Related:
 * - features/builders/BuildersExplore.tsx
 * - features/builders/types/index.ts
 */

'use client'

import { Button } from '@/components/ui/button'
import type { BuilderPlan, BuilderFilterState, BuildersDictionary } from '../types'

interface BuildersFiltersProps {
  filters: BuilderFilterState
  onFilterChange: (filters: BuilderFilterState) => void
  dictionary: BuildersDictionary['filters']
}

export function BuildersFilters({
  filters,
  onFilterChange,
  dictionary,
}: BuildersFiltersProps) {
  const plans: Array<{ value: BuilderPlan | null; label: string }> = [
    { value: null, label: dictionary.all },
    { value: 'studio', label: dictionary.studio },
    { value: 'pro', label: dictionary.pro },
    { value: 'free', label: dictionary.free },
  ]

  const handlePlanChange = (plan: BuilderPlan | null) => {
    onFilterChange({ ...filters, plan })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">{dictionary.plans}:</span>
      {plans.map((plan) => (
        <Button
          key={plan.value ?? 'all'}
          variant={filters.plan === plan.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePlanChange(plan.value)}
        >
          {plan.label}
        </Button>
      ))}
    </div>
  )
}

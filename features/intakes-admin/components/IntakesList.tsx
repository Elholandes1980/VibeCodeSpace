/**
 * features/intakes-admin/components/IntakesList.tsx
 *
 * Table list of problem intakes with filtering.
 * Displays intake summary and allows selection.
 *
 * Related:
 * - features/intakes-admin/hooks/useIntakesAdmin.ts
 * - features/intakes-admin/components/StatusBadge.tsx
 */

'use client'

import { StatusBadge } from './StatusBadge'
import type { ProblemIntake, IntakeStatus } from '../types'
import type { Id } from '@/convex/_generated/dataModel'

interface IntakesListProps {
  intakes: ProblemIntake[]
  selectedId: Id<'problemIntakes'> | null
  onSelect: (id: Id<'problemIntakes'>) => void
  isLoading: boolean
}

export function IntakesList({
  intakes,
  selectedId,
  onSelect,
  isLoading,
}: IntakesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading intakes...</div>
      </div>
    )
  }

  if (intakes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">No intakes found</div>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {intakes.map((intake) => (
        <button
          key={intake._id}
          onClick={() => onSelect(intake._id)}
          className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
            selectedId === intake._id ? 'bg-muted' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{intake.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {intake.email}
              </p>
            </div>
            <StatusBadge status={intake.status as IntakeStatus} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{intake.country}</span>
            <span>·</span>
            <span>{intake.language.toUpperCase()}</span>
            <span>·</span>
            <span>{new Date(intake.createdAt).toLocaleDateString()}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

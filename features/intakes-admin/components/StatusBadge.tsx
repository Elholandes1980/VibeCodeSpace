/**
 * features/intakes-admin/components/StatusBadge.tsx
 *
 * Status badge component for intake statuses.
 * Displays colored badge based on status value.
 *
 * Related:
 * - features/intakes-admin/types/index.ts
 */

import { STATUS_LABELS, STATUS_COLORS } from '../types'
import type { IntakeStatus } from '../types'

interface StatusBadgeProps {
  status: IntakeStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

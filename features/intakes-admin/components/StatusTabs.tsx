/**
 * features/intakes-admin/components/StatusTabs.tsx
 *
 * Filter tabs for intake status filtering.
 * Allows switching between status views.
 *
 * Related:
 * - features/intakes-admin/types/index.ts
 */

'use client'

import { Button } from '@/components/ui/button'
import type { IntakeStatus } from '../types'

interface StatusTabsProps {
  activeStatus: IntakeStatus | 'all'
  onStatusChange: (status: IntakeStatus | 'all') => void
  counts?: Record<IntakeStatus | 'all', number>
}

const TABS: Array<{ value: IntakeStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
]

export function StatusTabs({ activeStatus, onStatusChange, counts }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b pb-2">
      {TABS.map((tab) => (
        <Button
          key={tab.value}
          variant={activeStatus === tab.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
          {counts && counts[tab.value] > 0 && (
            <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-1.5 text-xs">
              {counts[tab.value]}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}

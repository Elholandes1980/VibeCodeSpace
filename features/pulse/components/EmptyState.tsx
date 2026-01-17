/**
 * features/pulse/components/EmptyState.tsx
 *
 * Empty state when no pulse items match filters.
 *
 * Related:
 * - features/pulse/PulseFeed.tsx
 */

import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  dictionary: {
    title: string
    description: string
  }
}

export function EmptyState({ dictionary }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{dictionary.title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{dictionary.description}</p>
    </div>
  )
}

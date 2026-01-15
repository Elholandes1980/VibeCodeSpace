/**
 * components/layout/Divider.tsx
 *
 * Subtle horizontal divider for visual separation.
 * Ultra-thin line that doesn't distract from content.
 *
 * Related:
 * - components/layout/Section.tsx
 * - app/globals.css
 */

import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
  spacing?: 'default' | 'lg' | 'sm' | 'none'
}

const spacingClasses: Record<string, string> = {
  default: 'my-8 sm:my-12',
  lg: 'my-12 sm:my-16',
  sm: 'my-4 sm:my-6',
  none: '',
}

export function Divider({ className, spacing = 'default' }: DividerProps) {
  return (
    <hr
      className={cn(
        'h-px w-full border-0 bg-border',
        spacingClasses[spacing],
        className
      )}
    />
  )
}

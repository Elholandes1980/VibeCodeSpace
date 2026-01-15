/**
 * components/ui/badge.tsx
 *
 * Badge component for tags, tools, and status indicators.
 * Pill-shaped with subtle styling variants.
 *
 * Related:
 * - features/cases/components/CaseCard.tsx
 * - app/globals.css
 */

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'primary' | 'accent' | 'tag' | 'tool'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  as?: 'span' | 'div' | 'a'
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border bg-background text-foreground',
  primary: 'bg-primary/10 text-primary',
  accent: 'badge-accent',
  tag: 'badge-tag',
  tool: 'badge-tool',
}

export function Badge({
  children,
  variant = 'default',
  className,
  as: Component = 'span',
}: BadgeProps) {
  return (
    <Component
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Component>
  )
}

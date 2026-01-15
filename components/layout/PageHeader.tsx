/**
 * components/layout/PageHeader.tsx
 *
 * Editorial page header with kicker, title, and subtitle.
 * Provides consistent typography hierarchy across pages.
 *
 * Related:
 * - components/layout/Container.tsx
 * - app/globals.css
 */

import { cn } from '@/lib/utils'

interface PageHeaderProps {
  kicker?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
  size?: 'default' | 'lg'
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  className,
  align = 'left',
  size = 'default',
}: PageHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  const titleSize = size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl'

  return (
    <header className={cn('max-w-3xl space-y-4', alignClass, className)}>
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className={cn(titleSize, 'font-semibold tracking-tight')}>{title}</h1>
      {subtitle && (
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  )
}

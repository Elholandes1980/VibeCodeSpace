/**
 * components/layout/Section.tsx
 *
 * Section component with consistent vertical spacing.
 * Supports alternate backgrounds and size variants.
 *
 * Related:
 * - components/layout/Container.tsx
 * - app/globals.css
 */

import { cn } from '@/lib/utils'

type SectionSize = 'default' | 'lg' | 'sm'
type SectionBackground = 'default' | 'alt' | 'panel' | 'accent' | 'hero'

interface SectionProps {
  children: React.ReactNode
  className?: string
  size?: SectionSize
  background?: SectionBackground
  id?: string
  /** Add decorative divider below section */
  divider?: boolean
}

const sizeClasses: Record<SectionSize, string> = {
  default: 'py-12 sm:py-16 md:py-20 lg:py-24',
  lg: 'py-16 sm:py-20 md:py-24 lg:py-32',
  sm: 'py-8 sm:py-10 md:py-12',
}

const backgroundClasses: Record<SectionBackground, string> = {
  default: '',
  alt: 'section-alt',
  panel: 'panel-subtle border-y',
  accent: 'section-accent',
  hero: 'section-hero',
}

export function Section({
  children,
  className,
  size = 'default',
  background = 'default',
  id,
  divider = false,
}: SectionProps) {
  return (
    <>
      <section
        id={id}
        className={cn(sizeClasses[size], backgroundClasses[background], className)}
      >
        {children}
      </section>
      {divider && <div className="section-divider" />}
    </>
  )
}

/**
 * components/layout/Container.tsx
 *
 * Responsive container component with consistent max-width.
 * Used as the main content wrapper throughout the site.
 *
 * Related:
 * - components/layout/Section.tsx
 * - app/globals.css
 */

import { cn } from '@/lib/utils'

type ContainerSize = 'default' | 'tight' | 'wide'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: ContainerSize
  as?: 'div' | 'section' | 'article' | 'main'
}

const sizeClasses: Record<ContainerSize, string> = {
  default: 'max-w-6xl', // ~1152px
  tight: 'max-w-4xl', // ~896px
  wide: 'max-w-7xl', // ~1280px
}

export function Container({
  children,
  className,
  size = 'default',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
    >
      {children}
    </Component>
  )
}

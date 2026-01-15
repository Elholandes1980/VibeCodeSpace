/**
 * features/builders/components/BuildersGrid.tsx
 *
 * Responsive grid layout for builder cards.
 * Displays builders in 1-3 columns based on viewport.
 *
 * Related:
 * - features/builders/components/BuilderCard.tsx
 * - features/builders/BuildersExplore.tsx
 */

import { BuilderCard } from './BuilderCard'
import type { Builder, BuildersDictionary, Locale } from '../types'

interface BuildersGridProps {
  builders: Builder[]
  locale: Locale
  dictionary: BuildersDictionary
}

export function BuildersGrid({ builders, locale, dictionary }: BuildersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {builders.map((builder) => (
        <BuilderCard
          key={builder.id}
          builder={builder}
          locale={locale}
          dictionary={dictionary.card}
        />
      ))}
    </div>
  )
}

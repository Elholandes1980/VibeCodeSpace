/**
 * features/cases/components/CasesGrid.tsx
 *
 * Responsive grid layout for displaying case cards.
 * 1 column on mobile, 2 on tablet, 3 on desktop.
 *
 * Related:
 * - features/cases/components/CaseCard.tsx
 * - features/cases/CasesExplore.tsx
 */

import { CaseCard } from './CaseCard'
import type { Case, Locale } from '../types'

interface CasesGridProps {
  cases: Case[]
  locale: Locale
}

export function CasesGrid({ cases, locale }: CasesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseData) => (
        <CaseCard key={caseData.id} caseData={caseData} locale={locale} />
      ))}
    </div>
  )
}

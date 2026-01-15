/**
 * features/cases/components/CaseNotFound.tsx
 *
 * Not found state for case detail page.
 * Shows when case doesn't exist or isn't published.
 *
 * Related:
 * - features/cases/types/index.ts
 * - features/cases/CaseDetailPage.tsx
 */

import Link from 'next/link'
import type { Locale, CaseDetailDictionary } from '../types'

interface CaseNotFoundProps {
  locale: Locale
  dictionary: CaseDetailDictionary['notFound']
}

export function CaseNotFound({ locale, dictionary }: CaseNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        {dictionary.title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {dictionary.description}
      </p>
      <Link
        href={`/${locale}/explore`}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {dictionary.backToExplore}
      </Link>
    </div>
  )
}

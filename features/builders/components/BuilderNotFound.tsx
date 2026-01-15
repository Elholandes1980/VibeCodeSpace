/**
 * features/builders/components/BuilderNotFound.tsx
 *
 * 404 state for when a builder is not found.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/builders/[slug]/page.tsx
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { BuilderDetailDictionary, Locale } from '../types'

interface BuilderNotFoundProps {
  locale: Locale
  dictionary: BuilderDetailDictionary['notFound']
}

export function BuilderNotFound({ locale, dictionary }: BuilderNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-muted p-4 mb-6">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{dictionary.title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">{dictionary.description}</p>
      <Button asChild>
        <Link href={`/${locale}/builders`}>{dictionary.backToBuilders}</Link>
      </Button>
    </div>
  )
}

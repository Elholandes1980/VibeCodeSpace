/**
 * app/(frontend)/(public)/[locale]/pulse/page.tsx
 *
 * Pulse page with curated updates from the vibecoding ecosystem.
 * Placeholder until PulseList and DigestSignup are built.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/layout.tsx
 * - lib/payload.ts
 */

import { getDictionary, validateLocale } from '@/lib/i18n'
import { getPageIntro } from '@/lib/payload'
import type { Locale } from '@/features/cases/types'

interface PulsePageProps {
  params: Promise<{ locale: string }>
}

export default async function PulsePage({ params }: PulsePageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Get page intro from CMS with dictionary fallback
  const pageIntro = await getPageIntro('pulse', locale, {
    title: dict.pulse.title,
    description: dict.pulse.description,
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{pageIntro.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {pageIntro.description}
      </p>
    </div>
  )
}

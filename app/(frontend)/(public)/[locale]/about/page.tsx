/**
 * app/(frontend)/(public)/[locale]/about/page.tsx
 *
 * About page explaining VibeCodeSpace mission and principles.
 * Placeholder until story blocks and content are added.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/layout.tsx
 * - lib/i18n/getDictionary.ts
 * - docs/VIBECODESPACE-MASTERPLAN.md
 */

import { getDictionary, validateLocale } from '@/lib/i18n'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const dict = getDictionary(locale)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{dict.about.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {dict.about.description}
      </p>
    </div>
  )
}

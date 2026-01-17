/**
 * app/(frontend)/(public)/[locale]/pulse/page.tsx
 *
 * Pulse page with curated updates from the vibecoding ecosystem.
 * Displays AI-filtered content from HN, PH, Dev.to, Indie Hackers.
 * All content is localized and auto-translated.
 *
 * Related:
 * - features/pulse/PulseFeed.tsx
 * - lib/payload.ts
 * - payload/collections/PulseItems.ts
 */

import { Suspense } from 'react'
import { getDictionary, validateLocale } from '@/lib/i18n'
import { getPageIntro, getPulseItems } from '@/lib/payload'
import { PulseFeed, LoadingSkeleton } from '@/features/pulse'
import type { Locale, PulseDictionary, PulseItem } from '@/features/pulse'

interface PulsePageProps {
  params: Promise<{ locale: string }>
}

export default async function PulsePage({ params }: PulsePageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Get page intro from CMS with dictionary fallback
  const [pageIntro, pulseItemsRaw] = await Promise.all([
    getPageIntro('pulse', locale, {
      title: dict.pulse.title,
      description: dict.pulse.description,
    }),
    getPulseItems(locale, 100),
  ])

  // Transform to PulseItem type
  const pulseItems: PulseItem[] = pulseItemsRaw.map((item) => ({
    id: item.id,
    externalId: item.externalId,
    source: item.source,
    sourceUrl: item.sourceUrl,
    category: item.category,
    title: item.title,
    summary: item.summary,
    author: item.author,
    upvotes: item.upvotes,
    commentsCount: item.commentsCount,
    sourcePublishedAt: item.sourcePublishedAt,
    publishedAt: item.publishedAt,
  }))

  // Build dictionary for PulseFeed
  const pulseDictionary: PulseDictionary = {
    title: pageIntro.title,
    description: pageIntro.description,
    filters: dict.pulse.filters,
    empty: dict.pulse.empty,
    timeAgo: dict.pulse.timeAgo,
    viewSource: dict.pulse.viewSource,
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">{pageIntro.title}</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          {pageIntro.description}
        </p>
      </header>

      {/* Feed */}
      <Suspense fallback={<LoadingSkeleton />}>
        <PulseFeed locale={locale} dictionary={pulseDictionary} items={pulseItems} />
      </Suspense>

      {/* Newsletter CTA - uses dictionary strings */}
      {pulseItems.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2">{dict.pulse.newsletter.kicker}</p>
            <h2 className="text-2xl font-bold mb-3">{dict.pulse.newsletter.title}</h2>
            <p className="text-muted-foreground mb-6">{dict.pulse.newsletter.description}</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder={dict.home.newsletter.placeholder}
                className="flex-1 px-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                {dict.home.newsletter.button}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * app/(frontend)/(public)/[locale]/builders/page.tsx
 *
 * Builders listing page displaying filterable grid.
 * Server component that fetches from Payload CMS.
 * Passes data to client component for filtering.
 *
 * Related:
 * - features/builders/BuildersExplore.tsx
 * - lib/cms/payload.ts
 */

import { Suspense } from 'react'
import { getDictionary, validateLocale } from '@/lib/i18n'
import { getVisibleBuilders } from '@/lib/cms/payload'
import { BuildersExplore, BuildersLoadingSkeleton } from '@/features/builders'
import { Container, Section, PageHeader } from '@/components/layout'
import type { Locale, Builder, BuildersDictionary } from '@/features/builders'

interface BuildersPageProps {
  params: Promise<{ locale: string }>
}

async function BuildersList({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)

  // Fetch builders from Payload CMS (server-side, cached)
  const buildersData = await getVisibleBuilders(locale)

  // Transform to feature types
  const builders: Builder[] = buildersData.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    bio: b.bio,
    avatar: b.avatar,
    avatarUrl: b.avatarUrl,
    links: b.links,
    plan: b.plan,
    visible: b.visible,
    featured: b.featured,
    socialStats: b.socialStats,
    caseCount: b.caseCount,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }))

  // Extract builders dictionary
  const buildersDictionary: BuildersDictionary = {
    title: dict.builders.title,
    description: dict.builders.description,
    filters: dict.builders.filters,
    card: dict.builders.card,
    empty: dict.builders.empty,
    loading: dict.builders.loading,
  }

  return (
    <BuildersExplore
      locale={locale}
      dictionary={buildersDictionary}
      initialBuilders={builders}
    />
  )
}

export default async function BuildersPage({ params }: BuildersPageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  return (
    <Section size="lg">
      <Container>
        <PageHeader
          title={dict.builders.title}
          subtitle={dict.builders.description}
          size="lg"
        />

        <Suspense fallback={<BuildersLoadingSkeleton count={6} />}>
          <BuildersList locale={locale} />
        </Suspense>
      </Container>
    </Section>
  )
}

/**
 * app/(frontend)/(public)/[locale]/explore/page.tsx
 *
 * Explore page displaying filterable cases grid.
 * Server component that fetches from Payload CMS.
 * Passes data to client component for filtering.
 *
 * Related:
 * - features/cases/CasesExplore.tsx
 * - lib/cms/payload.ts
 * - lib/payload.ts
 */

import { getDictionary, validateLocale } from '@/lib/i18n'
import { getPublishedCases, getTags, getTools } from '@/lib/cms/payload'
import { getPageIntro } from '@/lib/payload'
import { CasesExplore, LoadingSkeleton } from '@/features/cases'
import { Container, Section, PageHeader } from '@/components/layout'
import type { Locale, ExploreDictionary, Case, Tag, Tool } from '@/features/cases'
import { Suspense } from 'react'

interface ExplorePageProps {
  params: Promise<{ locale: string }>
}

async function ExploreCases({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)

  // Fetch data from Payload CMS (server-side, cached)
  const [casesData, tagsData, toolsData] = await Promise.all([
    getPublishedCases(locale),
    getTags(locale),
    getTools(locale),
  ])

  // Transform to feature types
  const cases: Case[] = casesData.map((c) => ({
    id: c.id,
    slug: c.slug,
    status: c.status,
    visibility: c.visibility,
    source: c.source,
    title: c.title,
    oneLiner: c.oneLiner,
    tags: c.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    tools: c.tools.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    featuredImage: c.featuredImage
      ? {
          id: c.featuredImage.id,
          url: c.featuredImage.url || '',
          alt: c.featuredImage.alt || '',
          sizes: c.featuredImage.sizes,
        }
      : null,
    ownerBuilder: c.ownerBuilder
      ? { id: c.ownerBuilder.id, slug: c.ownerBuilder.slug, name: c.ownerBuilder.name }
      : null,
    problem: c.problem || undefined,
    solution: c.solution || undefined,
    stack: c.stack || undefined,
    learnings: c.learnings || undefined,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }))

  const tags: Tag[] = tagsData.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    createdAt: '',
    updatedAt: '',
  }))

  const tools: Tool[] = toolsData.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    createdAt: '',
    updatedAt: '',
  }))

  // Extract explore dictionary
  const exploreDictionary: ExploreDictionary = {
    title: dict.explore.title,
    description: dict.explore.description,
    filters: dict.explore.filters,
    empty: dict.explore.empty,
    loading: dict.explore.loading,
  }

  return (
    <CasesExplore
      locale={locale}
      dictionary={exploreDictionary}
      initialCases={cases}
      tags={tags}
      tools={tools}
    />
  )
}

export default async function ExplorePage({ params }: ExplorePageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Get page intro from CMS with dictionary fallback
  const pageIntro = await getPageIntro('explore', locale, {
    title: dict.explore.title,
    description: dict.explore.description,
  })

  return (
    <Section size="lg">
      <Container>
        <PageHeader
          title={pageIntro.title}
          subtitle={pageIntro.description}
          size="lg"
        />

        <Suspense fallback={<LoadingSkeleton count={6} />}>
          <ExploreCases locale={locale} />
        </Suspense>
      </Container>
    </Section>
  )
}

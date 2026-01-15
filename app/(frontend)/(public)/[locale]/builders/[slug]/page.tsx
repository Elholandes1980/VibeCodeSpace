/**
 * app/(frontend)/(public)/[locale]/builders/[slug]/page.tsx
 *
 * Builder detail page showing profile and their cases.
 * Server component that fetches from Payload CMS.
 *
 * Related:
 * - features/builders/components/BuilderDetail.tsx
 * - lib/cms/payload.ts
 */

import { Suspense } from 'react'
import { getDictionary, validateLocale } from '@/lib/i18n'
import { getBuilderBySlug, getCasesByBuilder } from '@/lib/cms/payload'
import {
  BuilderDetail,
  BuilderNotFound,
  BuilderDetailSkeleton,
} from '@/features/builders'
import { Container, Section } from '@/components/layout'
import type {
  Locale,
  Builder,
  BuilderCase,
  BuilderDetailDictionary,
} from '@/features/builders'

interface BuilderPageProps {
  params: Promise<{ locale: string; slug: string }>
}

async function BuilderContent({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const dict = getDictionary(locale)

  // Fetch builder and their cases
  const builderData = await getBuilderBySlug(locale, slug)

  if (!builderData) {
    return (
      <BuilderNotFound locale={locale} dictionary={dict.builderDetail.notFound} />
    )
  }

  const casesData = await getCasesByBuilder(locale, builderData.id)

  // Transform to feature types
  const builder: Builder = {
    id: builderData.id,
    name: builderData.name,
    slug: builderData.slug,
    bio: builderData.bio,
    avatar: builderData.avatar,
    avatarUrl: builderData.avatarUrl,
    links: builderData.links,
    plan: builderData.plan,
    visible: builderData.visible,
    featured: builderData.featured,
    socialStats: builderData.socialStats,
    caseCount: builderData.caseCount,
    createdAt: builderData.createdAt,
    updatedAt: builderData.updatedAt,
  }

  const cases: BuilderCase[] = casesData.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    oneLiner: c.oneLiner,
    featuredImage: c.featuredImage
      ? {
          url: c.featuredImage.url || undefined,
          alt: c.featuredImage.alt || undefined,
        }
      : null,
  }))

  // Extract builder detail dictionary
  const detailDictionary: BuilderDetailDictionary = {
    sections: dict.builderDetail.sections,
    social: dict.builderDetail.social,
    cta: dict.builderDetail.cta,
    badges: dict.builderDetail.badges,
    empty: dict.builderDetail.empty,
    notFound: dict.builderDetail.notFound,
    loading: dict.builderDetail.loading,
  }

  return (
    <BuilderDetail
      builder={builder}
      cases={cases}
      locale={locale}
      dictionary={detailDictionary}
    />
  )
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam) as Locale

  return (
    <Section size="lg">
      <Container>
        <Suspense fallback={<BuilderDetailSkeleton />}>
          <BuilderContent locale={locale} slug={slug} />
        </Suspense>
      </Container>
    </Section>
  )
}

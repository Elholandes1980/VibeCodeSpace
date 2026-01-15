/**
 * app/(frontend)/(public)/[locale]/cases/[slug]/page.tsx
 *
 * Premium case detail page displaying a single showcase case.
 * Server component with SEO metadata and related cases.
 *
 * Related:
 * - features/cases/components/CaseDetail.tsx
 * - lib/cms/payload.ts
 * - lib/payload.ts
 */

import type { Metadata } from 'next'
import { getDictionary, validateLocale } from '@/lib/i18n'
import { getCaseBySlug, getRelatedCases } from '@/lib/cms/payload'
import { getCaseCta, getCoursePromo } from '@/lib/payload'
import { CaseDetail, CaseNotFound } from '@/features/cases'
import { Container, Section } from '@/components/layout'
import { CourseCtaCompact } from '@/components/course/CourseCtaCompact'
import type { Locale, CaseDetailDictionary, Case } from '@/features/cases'

interface CasePageProps {
  params: Promise<{ locale: string; slug: string }>
}

// === SEO Metadata ===

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  const caseData = await getCaseBySlug(locale, slug)

  if (!caseData) {
    return {
      title: dict.caseDetail.notFound.title,
    }
  }

  const title = `${caseData.title} ${dict.caseDetail.meta.titleSuffix}`
  const description = caseData.oneLiner || dict.caseDetail.meta.defaultDescription

  // OG Image URL
  const ogImage =
    caseData.featuredImage?.sizes?.featured?.url ||
    caseData.featuredImage?.url ||
    '/og-default.png'

  // Build base URL for alternates
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vibecodespace.com'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/${locale}/cases/${slug}`,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: caseData.title,
        },
      ],
      locale: locale === 'nl' ? 'nl_NL' : locale === 'es' ? 'es_ES' : 'en_US',
      siteName: 'VibeCodeSpace',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/cases/${slug}`,
      languages: {
        nl: `${baseUrl}/nl/cases/${slug}`,
        en: `${baseUrl}/en/cases/${slug}`,
        es: `${baseUrl}/es/cases/${slug}`,
      },
    },
  }
}

// === Page Component ===

export default async function CasePage({ params }: CasePageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Fetch case and course promo from Payload CMS (server-side, cached)
  const [caseData, coursePromo] = await Promise.all([
    getCaseBySlug(locale, slug),
    getCoursePromo(locale),
  ])

  // Get CTA content from CMS with dictionary fallback
  const caseCta = await getCaseCta(locale, {
    title: dict.caseDetail.cta.title,
    text: dict.caseDetail.cta.description,
    buttonLabel: dict.caseDetail.cta.button,
    buttonHref: `/${locale}/micro-probleem`,
  })

  // Extract case detail dictionary with CMS CTA content
  const detailDictionary: CaseDetailDictionary = {
    sections: dict.caseDetail.sections,
    cta: {
      title: caseCta.title,
      description: caseCta.text,
      button: caseCta.buttonLabel,
    },
    relatedCases: dict.caseDetail.relatedCases,
    meta: dict.caseDetail.meta,
    notFound: dict.caseDetail.notFound,
    loading: dict.caseDetail.loading,
  }

  // Handle not found
  if (!caseData) {
    return (
      <Section size="lg">
        <Container size="tight">
          <CaseNotFound locale={locale} dictionary={detailDictionary.notFound} />
        </Container>
      </Section>
    )
  }

  // Extract tag and tool IDs for related cases query
  const tagIds = caseData.tags.map((t) => t.id)
  const toolIds = caseData.tools.map((t) => t.id)

  // Fetch related cases (max 3, based on shared tags/tools)
  const relatedCasesData =
    tagIds.length > 0 || toolIds.length > 0
      ? await getRelatedCases(locale, caseData.id, tagIds, toolIds, 3)
      : []

  // Transform main case to feature type
  const transformedCase: Case = {
    id: caseData.id,
    slug: caseData.slug,
    status: caseData.status,
    visibility: caseData.visibility,
    source: caseData.source,
    title: caseData.title,
    oneLiner: caseData.oneLiner,
    tags: caseData.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    tools: caseData.tools.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
    })),
    featuredImage: caseData.featuredImage
      ? {
          id: caseData.featuredImage.id,
          url: caseData.featuredImage.url || '',
          alt: caseData.featuredImage.alt || '',
          sizes: caseData.featuredImage.sizes,
        }
      : null,
    ownerBuilder: caseData.ownerBuilder
      ? { id: caseData.ownerBuilder.id, slug: caseData.ownerBuilder.slug, name: caseData.ownerBuilder.name }
      : null,
    problem: caseData.problem || undefined,
    solution: caseData.solution || undefined,
    stack: caseData.stack || undefined,
    learnings: caseData.learnings || undefined,
    createdAt: caseData.createdAt,
    updatedAt: caseData.updatedAt,
  }

  // Transform related cases to feature type
  const relatedCases: Case[] = relatedCasesData.map((rc) => ({
    id: rc.id,
    slug: rc.slug,
    status: rc.status,
    visibility: rc.visibility,
    source: rc.source,
    title: rc.title,
    oneLiner: rc.oneLiner,
    tags: rc.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    tools: rc.tools.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    featuredImage: rc.featuredImage
      ? {
          id: rc.featuredImage.id,
          url: rc.featuredImage.url || '',
          alt: rc.featuredImage.alt || '',
          sizes: rc.featuredImage.sizes,
        }
      : null,
    ownerBuilder: rc.ownerBuilder
      ? { id: rc.ownerBuilder.id, slug: rc.ownerBuilder.slug, name: rc.ownerBuilder.name }
      : null,
    problem: rc.problem || undefined,
    solution: rc.solution || undefined,
    stack: rc.stack || undefined,
    learnings: rc.learnings || undefined,
    createdAt: rc.createdAt,
    updatedAt: rc.updatedAt,
  }))

  return (
    <Section size="lg">
      <Container size="tight">
        <CaseDetail
          caseData={transformedCase}
          locale={locale}
          dictionary={detailDictionary}
          relatedCases={relatedCases}
        />

        {/* Course CTA - VibeCoding Madness */}
        {coursePromo?.settings.showOnCases && (
          <div className="mt-16 sm:mt-20">
            <CourseCtaCompact promo={coursePromo.compact} />
          </div>
        )}
      </Container>
    </Section>
  )
}

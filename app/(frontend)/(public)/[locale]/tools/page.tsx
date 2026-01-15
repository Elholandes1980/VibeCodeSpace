/**
 * app/(frontend)/(public)/[locale]/tools/page.tsx
 *
 * Tools listing page - affiliate-ready money page with Webflow feel.
 * All labels and copy driven by ToolsSettings CMS global.
 * Features category filtering, pricing badges, and search-ready structure.
 *
 * Related:
 * - payload/collections/Tools.ts
 * - payload/collections/ToolCategories.ts
 * - payload/globals/ToolsSettings.ts
 * - lib/cms/tools-settings.ts
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Container, Section } from '@/components/layout'
import { validateLocale } from '@/lib/i18n'
import { getToolsSettings, getPricingLabel, getPricingBadgeClass } from '@/lib/cms/tools-settings'
import type { Locale } from '@/lib/cms/tools-settings'
import type { Media } from '@/payload-types'
import { ArrowRight, Plus } from 'lucide-react'
import { PricingFilter } from './PricingFilter'

interface ToolsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; pricing?: string }>
}

// SEO Metadata
export async function generateMetadata({ params }: ToolsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const settings = await getToolsSettings(locale)

  return {
    title: `${settings.indexPage.title} | VibeCodeSpace`,
    description: settings.indexPage.intro,
  }
}

export default async function ToolsPage({ params, searchParams }: ToolsPageProps) {
  const { locale: localeParam } = await params
  const { category: categorySlug, pricing: pricingFilter } = await searchParams
  const locale = validateLocale(localeParam) as Locale

  const payload = await getPayload({ config })
  const settings = await getToolsSettings(locale)

  // Fetch category if filtering
  let selectedCategory: {
    id: number | string
    title: string
    slug: string
    description?: string | null
  } | null = null

  if (categorySlug) {
    const categoryResult = await payload.find({
      collection: 'tool-categories',
      locale,
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })
    if (categoryResult.docs.length > 0) {
      const cat = categoryResult.docs[0]
      selectedCategory = {
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        description: cat.description || null,
      }
    }
  }

  // Build query for tools
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toolsWhere: any = { status: { equals: 'published' } }

  if (selectedCategory) {
    toolsWhere.and = [
      { status: { equals: 'published' } },
      {
        or: [
          { category: { equals: selectedCategory.id } },
          { additionalCategories: { contains: selectedCategory.id } },
        ],
      },
    ]
    delete toolsWhere.status
  }

  if (pricingFilter && pricingFilter !== 'all') {
    const pricingCondition = { pricingModel: { equals: pricingFilter } }
    if (toolsWhere.and) {
      toolsWhere.and.push(pricingCondition)
    } else {
      toolsWhere.and = [{ status: { equals: 'published' } }, pricingCondition]
      delete toolsWhere.status
    }
  }

  const toolsResult = await payload.find({
    collection: 'tools',
    locale,
    where: toolsWhere,
    sort: 'name',
    limit: 50,
    depth: 1,
  })

  // Fetch all categories for filter display
  const categoriesResult = await payload.find({
    collection: 'tool-categories',
    locale,
    where: { showInMegaMenu: { equals: true } },
    sort: 'order',
    limit: 50,
  })

  const tools = toolsResult.docs
  const categories = categoriesResult.docs

  // Build filter URL helper
  const buildFilterUrl = (newCategory?: string, newPricing?: string) => {
    const params = new URLSearchParams()
    if (newCategory) params.set('category', newCategory)
    if (newPricing && newPricing !== 'all') params.set('pricing', newPricing)
    const query = params.toString()
    return `/${locale}/tools${query ? `?${query}` : ''}`
  }

  return (
    <Section size="lg">
      <Container>
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {selectedCategory ? selectedCategory.title : settings.indexPage.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {selectedCategory?.description || settings.indexPage.intro}
          </p>

          {/* Active Filter Breadcrumb */}
          {selectedCategory && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Link
                href={`/${locale}/tools`}
                className="text-muted-foreground hover:text-foreground"
              >
                {settings.indexPage.title}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground">{selectedCategory.title}</span>
              <Link
                href={`/${locale}/tools`}
                className="ml-2 text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </Link>
            </div>
          )}
        </header>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl(undefined, pricingFilter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {settings.indexPage.filterAllLabel}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildFilterUrl(cat.slug, pricingFilter)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory?.slug === cat.slug
                    ? 'bg-[hsl(var(--accent))] text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>

          {/* Pricing Filter */}
          <PricingFilter
            currentValue={pricingFilter || 'all'}
            categorySlug={categorySlug}
            locale={locale}
            labels={{
              pricingLabel: settings.indexPage.filterPricingLabel,
              allLabel: settings.indexPage.filterAllLabel,
              freeLabel: settings.detailPage.freeLabel,
              freemiumLabel: settings.detailPage.freemiumLabel,
              paidLabel: settings.detailPage.paidLabel,
              enterpriseLabel: settings.detailPage.enterpriseLabel,
            }}
          />
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={{
                  id: tool.id,
                  name: tool.name,
                  slug: tool.slug,
                  shortOneLiner: tool.shortOneLiner || '',
                  pricingModel: tool.pricingModel || null,
                  trialAvailable: tool.trialAvailable || false,
                  logo:
                    tool.logo && typeof tool.logo === 'object'
                      ? { url: (tool.logo as Media).url || '', alt: (tool.logo as Media).alt || tool.name }
                      : null,
                }}
                locale={locale}
                labels={settings}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={selectedCategory ? settings.emptyStates.noResultsTitle : settings.emptyStates.noToolsTitle}
            body={selectedCategory ? settings.emptyStates.noResultsBody : settings.emptyStates.noToolsBody}
            showCta={settings.submitCta.enabled && !selectedCategory}
            ctaLabel={settings.submitCta.label}
            ctaHref={`/${locale}${settings.submitCta.href}`}
          />
        )}

        {/* Submit CTA (bottom) */}
        {tools.length > 0 && settings.submitCta.enabled && (
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}${settings.submitCta.href}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              {settings.submitCta.label}
            </Link>
          </div>
        )}
      </Container>
    </Section>
  )
}

// === Tool Card Component ===

interface ToolCardProps {
  tool: {
    id: number | string
    name: string
    slug: string
    shortOneLiner: string
    pricingModel: string | null
    trialAvailable: boolean
    logo: { url: string; alt: string } | null
  }
  locale: string
  labels: Awaited<ReturnType<typeof getToolsSettings>>
}

function ToolCard({ tool, locale, labels }: ToolCardProps) {
  const pricingLabel = getPricingLabel(tool.pricingModel, labels.detailPage)
  const pricingClass = getPricingBadgeClass(tool.pricingModel)

  return (
    <Link
      href={`/${locale}/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-[hsl(var(--accent)_/_0.3)] hover:shadow-lg"
    >
      {/* Top Row: Logo + Pricing Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Logo */}
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          {tool.logo ? (
            <img
              src={tool.logo.url}
              alt={tool.logo.alt}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
              {tool.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Pricing Badge */}
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pricingClass}`}>
          {pricingLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--accent))]">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {tool.shortOneLiner}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-sm font-medium text-[hsl(var(--accent))] group-hover:underline">
          {labels.indexPage.cardCtaLabel}
        </span>
        <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1" />
      </div>

      {/* Trial Badge */}
      {tool.trialAvailable && (
        <div className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
          Trial
        </div>
      )}
    </Link>
  )
}

// === Empty State Component ===

interface EmptyStateProps {
  title: string
  body: string
  showCta: boolean
  ctaLabel: string
  ctaHref: string
}

function EmptyState({ title, body, showCta, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
      {showCta && (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[hsl(var(--accent)_/_0.9)]"
        >
          <Plus className="h-4 w-4" />
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}


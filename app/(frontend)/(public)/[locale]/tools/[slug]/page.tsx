/**
 * app/(frontend)/(public)/[locale]/tools/[slug]/page.tsx
 *
 * Tool detail page - affiliate-ready money page with editorial quality.
 * Features hero section, pricing info, best/not-for sections, and CTAs.
 * All labels driven by ToolsSettings CMS global.
 *
 * Related:
 * - payload/collections/Tools.ts
 * - payload/globals/ToolsSettings.ts
 * - lib/cms/tools-settings.ts
 * - app/(frontend)/(public)/[locale]/tools/page.tsx
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Container, Section } from '@/components/layout'
import { validateLocale } from '@/lib/i18n'
import { getToolsSettings, getPricingLabel, getPricingBadgeClass } from '@/lib/cms/tools-settings'
import type { Locale } from '@/lib/cms/tools-settings'
import type { Media } from '@/payload-types'

// Local type for ToolCategoryDoc (payload-types.ts may not be up to date)
interface ToolCategoryDoc {
  id: number | string
  title: string
  slug: string
  description?: string | null
}
import {
  ArrowLeft,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Globe,
  Building2,
} from 'lucide-react'

interface ToolDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

// SEO Metadata
export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam) as Locale

  const payload = await getPayload({ config })
  const toolResult = await payload.find({
    collection: 'tools',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (toolResult.docs.length === 0) {
    return { title: 'Tool Not Found | VibeCodeSpace' }
  }

  const tool = toolResult.docs[0]

  return {
    title: `${tool.name} | VibeCodeSpace`,
    description: tool.shortOneLiner || tool.description?.slice(0, 160),
    openGraph: {
      title: tool.name,
      description: tool.shortOneLiner || undefined,
      images: tool.ogImageUrl ? [{ url: tool.ogImageUrl }] : undefined,
    },
  }
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam) as Locale

  const payload = await getPayload({ config })
  const settings = await getToolsSettings(locale)

  // Fetch tool
  const toolResult = await payload.find({
    collection: 'tools',
    locale,
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  if (toolResult.docs.length === 0) {
    notFound()
  }

  const tool = toolResult.docs[0]

  // Get primary CTA URL (affiliate takes priority)
  const primaryUrl = tool.affiliateUrl || tool.websiteUrl || '#'
  const isAffiliate = Boolean(tool.affiliateUrl)

  // Extract media
  const logo = tool.logo && typeof tool.logo === 'object' ? (tool.logo as Media) : null
  const featuredImage = tool.featuredImage && typeof tool.featuredImage === 'object'
    ? (tool.featuredImage as Media)
    : null
  const category = tool.category && typeof tool.category === 'object'
    ? (tool.category as ToolCategoryDoc)
    : null

  // Extract array fields with type safety
  const bestFor = (tool.bestFor as Array<{ point?: string }> | null) || []
  const notFor = (tool.notFor as Array<{ point?: string }> | null) || []
  const keyFeatures = (tool.keyFeatures as Array<{ title?: string; detail?: string }> | null) || []

  // Pricing info
  const pricingLabel = getPricingLabel(tool.pricingModel, settings.detailPage)
  const pricingClass = getPricingBadgeClass(tool.pricingModel)

  return (
    <>
      {/* Hero Section */}
      <Section size="default" className="bg-gradient-to-b from-muted/30 to-background">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href={`/${locale}/tools`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {settings.detailSections.backLabel}
            </Link>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
            {/* Main Content */}
            <div>
              {/* Logo + Name + Category */}
              <div className="flex items-start gap-5 mb-6">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-md border border-border">
                  {logo ? (
                    <img
                      src={logo.url || ''}
                      alt={logo.alt || tool.name}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground bg-muted">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {category && (
                    <Link
                      href={`/${locale}/tools?category=${category.slug}`}
                      className="text-sm text-[hsl(var(--accent))] hover:underline"
                    >
                      {category.title}
                    </Link>
                  )}
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mt-1">
                    {tool.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    {tool.shortOneLiner}
                  </p>
                </div>
              </div>

              {/* Description */}
              {tool.description && (
                <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                  <p className="text-base leading-relaxed">{tool.description}</p>
                </div>
              )}

              {/* Primary CTA - Mobile */}
              <div className="flex flex-wrap gap-3 lg:hidden mb-8">
                <a
                  href={primaryUrl}
                  target="_blank"
                  rel={isAffiliate ? 'sponsored noopener' : 'noopener'}
                  className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[hsl(var(--accent)_/_0.9)]"
                >
                  {settings.detailPage.visitToolLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
                {tool.makerUrl && (
                  <a
                    href={tool.makerUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Building2 className="h-4 w-4" />
                    {settings.detailPage.makerLabel}
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar Card - Desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                {/* Pricing Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {settings.detailPage.pricingLabel}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${pricingClass}`}>
                    {pricingLabel}
                  </span>
                </div>

                {/* Price Details */}
                {(tool.pricingFrom || tool.trialAvailable) && (
                  <div className="mb-6 pb-4 border-b border-border">
                    {tool.pricingFrom && (
                      <p className="text-sm text-muted-foreground">
                        {settings.detailPage.startingFromLabel}{' '}
                        <span className="font-semibold text-foreground">{tool.pricingFrom}</span>
                      </p>
                    )}
                    {tool.trialAvailable && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        {settings.detailPage.trialLabel}
                      </p>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="space-y-3">
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel={isAffiliate ? 'sponsored noopener' : 'noopener'}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[hsl(var(--accent)_/_0.9)]"
                  >
                    {settings.detailPage.visitToolLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {tool.makerUrl && (
                    <a
                      href={tool.makerUrl}
                      target="_blank"
                      rel="noopener"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Building2 className="h-4 w-4" />
                      {settings.detailPage.makerLabel}
                    </a>
                  )}
                </div>

                {/* Website URL */}
                {tool.websiteUrl && (
                  <p className="mt-4 text-xs text-muted-foreground text-center truncate">
                    <Globe className="inline h-3 w-3 mr-1" />
                    {new URL(tool.websiteUrl).hostname}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Content Sections */}
      <Section size="default">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Best For */}
            {bestFor.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Check className="h-5 w-5 text-green-500" />
                  {settings.detailSections.bestForLabel}
                </h2>
                <ul className="space-y-3">
                  {bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Not For */}
            {notFor.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <X className="h-5 w-5 text-amber-500" />
                  {settings.detailSections.notForLabel}
                </h2>
                <ul className="space-y-3">
                  {notFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
                <Sparkles className="h-5 w-5 text-[hsl(var(--accent))]" />
                {settings.detailSections.featuresLabel}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {keyFeatures.map((feature, idx) => (
                  <div key={idx} className="rounded-lg bg-muted/50 p-4">
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    {feature.detail && (
                      <p className="text-xs text-muted-foreground mt-1">{feature.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Featured Image */}
      {(featuredImage || tool.ogImageUrl) && (
        <Section size="sm">
          <Container>
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={featuredImage?.url || tool.ogImageUrl || ''}
                alt={featuredImage?.alt || `${tool.name} screenshot`}
                className="w-full h-auto"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Bottom CTA */}
      <Section size="default" className="bg-muted/30">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{tool.name}</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {tool.shortOneLiner}
            </p>
            <a
              href={primaryUrl}
              target="_blank"
              rel={isAffiliate ? 'sponsored noopener' : 'noopener'}
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[hsl(var(--accent)_/_0.9)]"
            >
              {settings.detailPage.visitToolLabel}
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}

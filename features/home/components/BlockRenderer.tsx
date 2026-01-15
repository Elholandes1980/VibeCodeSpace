/**
 * features/home/components/BlockRenderer.tsx
 *
 * Renders Payload CMS blocks dynamically.
 * Maps block types to React components.
 *
 * Related:
 * - payload/blocks/index.ts
 * - app/(frontend)/(public)/[locale]/page.tsx
 */

import type { PageBlock } from '@/lib/payload'
import type { Locale } from '@/features/cases/types'
import type { CaseWithRelations } from '@/lib/cms/payload'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { FeaturedShowcases } from './FeaturedShowcases'
import { PricingSection } from './PricingSection'
import { NewsletterSection } from './NewsletterSection'
import { CourseCtaSection } from './CourseCtaSection'
import { MicroProblemCtaSection } from './MicroProblemCtaSection'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

interface BlockRendererProps {
  blocks: PageBlock[]
  locale: Locale
  cases?: CaseWithRelations[]
}

export function BlockRenderer({ blocks, locale, cases = [] }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <HeroBlock
                key={block.id}
                block={block}
                locale={locale}
              />
            )

          case 'valueProps':
            return (
              <ValuePropsBlock
                key={block.id}
                block={block}
                locale={locale}
              />
            )

          case 'showcaseStrip':
            return (
              <ShowcaseStripBlock
                key={block.id}
                block={block}
                locale={locale}
                cases={cases}
              />
            )

          case 'pricing':
            return (
              <PricingBlockComponent
                key={block.id}
                block={block}
                locale={locale}
              />
            )

          case 'courseCta':
            return (
              <CourseCtaBlock
                key={block.id}
                block={block}
                locale={locale}
              />
            )

          case 'newsletter':
            return (
              <ConvexClientProvider key={block.id}>
                <NewsletterBlock
                  block={block}
                  locale={locale}
                />
              </ConvexClientProvider>
            )

          case 'microProblemCta':
            return (
              <MicroProblemCtaBlock
                key={block.id}
                block={block}
                locale={locale}
              />
            )

          default:
            return null
        }
      })}
    </>
  )
}

// === Block Adapters ===

interface HeroBlockData extends PageBlock {
  eyebrow?: string
  headline: string
  subheadline?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

function HeroBlock({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as HeroBlockData
  return (
    <HeroSection
      locale={locale}
      dictionary={{
        kicker: data.eyebrow || '',
        headline: data.headline,
        subheadline: data.subheadline || '',
        primaryCta: data.primaryCtaLabel || 'Explore',
        secondaryCta: data.secondaryCtaLabel || 'Learn more',
      }}
      primaryHref={data.primaryCtaHref}
      secondaryHref={data.secondaryCtaHref}
    />
  )
}

interface ValuePropsBlockData extends PageBlock {
  eyebrow?: string
  title: string
  items: Array<{
    title: string
    description: string
    iconKey?: string
    href?: string
    ctaLabel?: string
    comingSoon?: boolean
  }>
}

function ValuePropsBlock({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as ValuePropsBlockData
  return (
    <FeaturesSection
      locale={locale}
      dictionary={{
        kicker: data.eyebrow || '',
        title: data.title,
        features: data.items.map((item) => ({
          icon: item.iconKey || 'explore',
          title: item.title,
          description: item.description,
          href: item.href || '',
          cta: item.ctaLabel || '',
          comingSoon: item.comingSoon,
        })),
      }}
    />
  )
}

interface ShowcaseStripBlockData extends PageBlock {
  eyebrow?: string
  title: string
  subtitle?: string
  mode: 'latest' | 'manual' | 'featured'
  limit: number
  ctaLabel?: string
  ctaHref?: string
}

function ShowcaseStripBlock({
  block,
  locale,
  cases,
}: {
  block: PageBlock
  locale: Locale
  cases: CaseWithRelations[]
}) {
  const data = block as ShowcaseStripBlockData
  // For now, use the provided cases (already fetched)
  // In the future, could fetch based on mode
  const displayCases = cases?.slice(0, data.limit || 3) || []

  return (
    <FeaturedShowcases
      locale={locale}
      cases={displayCases}
      dictionary={{
        kicker: data.eyebrow || '',
        title: data.title,
        viewAll: data.ctaLabel || 'View all',
      }}
      viewAllHref={data.ctaHref}
    />
  )
}

interface PricingBlockData extends PageBlock {
  eyebrow?: string
  title: string
  subtitle?: string
  usp?: string
  plans: Array<{
    name: string
    price: string
    period?: string
    description?: string
    features: Array<{ feature: string }>
    ctaLabel: string
    ctaHref: string
    highlight?: boolean
    badge?: string
  }>
  contactSalesText?: string
  contactSalesHref?: string
}

function PricingBlockComponent({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as PricingBlockData
  return (
    <PricingSection
      locale={locale}
      dictionary={{
        kicker: data.eyebrow || '',
        title: data.title,
        subtitle: data.subtitle || '',
        plans: data.plans.map((plan) => ({
          name: plan.name,
          price: plan.price,
          period: plan.period || '',
          description: plan.description || '',
          features: plan.features.map((f) => f.feature),
          cta: plan.ctaLabel,
          href: plan.ctaHref,
          highlighted: plan.highlight,
          badge: plan.badge,
        })),
        contactSales: data.contactSalesText || '',
      }}
    />
  )
}

interface CourseCtaBlockData extends PageBlock {
  enabled?: boolean
  showOnlyNl?: boolean
  eyebrow?: string
  title: string
  text?: string
  ctaLabel: string
  ctaHref: string
  note?: string
}

function CourseCtaBlock({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as CourseCtaBlockData

  // Skip if disabled or wrong locale
  if (!data.enabled) return null
  if (data.showOnlyNl && locale !== 'nl') return null

  return (
    <CourseCtaSection
      dictionary={{
        eyebrow: data.eyebrow || '',
        title: data.title,
        text: data.text || '',
        ctaLabel: data.ctaLabel,
        note: data.note || '',
      }}
      ctaHref={data.ctaHref}
    />
  )
}

interface NewsletterBlockData extends PageBlock {
  eyebrow?: string
  title: string
  text?: string
  placeholder?: string
  buttonLabel: string
  successMessage?: string
  errorMessage?: string
}

function NewsletterBlock({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as NewsletterBlockData
  return (
    <NewsletterSection
      locale={locale}
      dictionary={{
        kicker: data.eyebrow || '',
        title: data.title,
        description: data.text || '',
        placeholder: data.placeholder || 'your@email.com',
        button: data.buttonLabel,
        success: data.successMessage || '',
        error: data.errorMessage || '',
      }}
    />
  )
}

interface MicroProblemCtaBlockData extends PageBlock {
  title: string
  text?: string
  ctaLabel: string
  ctaHref: string
}

function MicroProblemCtaBlock({ block, locale }: { block: PageBlock; locale: Locale }) {
  const data = block as MicroProblemCtaBlockData
  return (
    <MicroProblemCtaSection
      locale={locale}
      dictionary={{
        title: data.title,
        text: data.text || '',
        ctaLabel: data.ctaLabel,
      }}
      ctaHref={data.ctaHref}
    />
  )
}

/**
 * app/(frontend)/(public)/[locale]/page.tsx
 *
 * Premium homepage with editorial SaaS design.
 * Fetches content from Payload CMS Pages collection.
 * Falls back to dictionary-based content if CMS page not found.
 *
 * Related:
 * - features/home/index.ts
 * - lib/payload.ts
 * - payload/collections/Pages.ts
 */

import { getDictionary, validateLocale } from '@/lib/i18n'
import { getPublishedCases, getVisibleBuilders, type Locale } from '@/lib/cms/payload'
import { getHomePage, getCoursePromo } from '@/lib/payload'
import {
  HeroSection,
  FeaturesSection,
  FeaturedShowcases,
  FeaturedBuilders,
  AudienceSection,
  PricingSection,
  NewsletterSection,
  CourseCtaHero,
  BlockRenderer,
} from '@/features/home'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Fetch featured cases, builders, and course promo from Payload CMS
  const [cases, builders, coursePromo] = await Promise.all([
    getPublishedCases(locale),
    getVisibleBuilders(locale),
    getCoursePromo(locale),
  ])

  // Try to fetch CMS-driven home page
  const homePage = await getHomePage(locale)

  // If CMS page exists with blocks, render dynamically
  if (homePage?.blocks?.length) {
    return (
      <BlockRenderer
        blocks={homePage.blocks}
        locale={locale}
        cases={cases}
      />
    )
  }

  // Fallback to dictionary-based rendering
  return (
    <>
      {/* Hero */}
      <HeroSection locale={locale} dictionary={dict.home.hero} />

      {/* Features (What You Get) */}
      <FeaturesSection
        locale={locale}
        dictionary={{
          kicker: dict.home.features.kicker,
          title: dict.home.features.title,
          features: dict.home.features.items,
        }}
      />

      {/* Featured Showcases */}
      <FeaturedShowcases
        locale={locale}
        cases={cases}
        dictionary={dict.home.showcases}
      />

      {/* Featured Builders */}
      <FeaturedBuilders
        locale={locale}
        builders={builders}
        dictionary={dict.home.builders}
      />

      {/* Course CTA - VibeCoding Madness */}
      {coursePromo?.settings.showOnHomepage && (
        <CourseCtaHero promo={coursePromo.hero} />
      )}

      {/* Who It's For */}
      <AudienceSection
        dictionary={{
          kicker: dict.home.audience.kicker,
          title: dict.home.audience.title,
          audiences: dict.home.audience.items,
        }}
      />

      {/* Pricing */}
      <PricingSection
        locale={locale}
        dictionary={{
          kicker: dict.home.pricing.kicker,
          title: dict.home.pricing.title,
          subtitle: dict.home.pricing.subtitle,
          plans: dict.home.pricing.plans,
          contactSales: dict.home.pricing.contactSales,
        }}
      />

      {/* Newsletter - needs Convex provider for client component */}
      <ConvexClientProvider>
        <NewsletterSection locale={locale} dictionary={dict.home.newsletter} />
      </ConvexClientProvider>
    </>
  )
}

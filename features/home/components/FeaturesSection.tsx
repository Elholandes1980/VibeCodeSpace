/**
 * features/home/components/FeaturesSection.tsx
 *
 * Three-column feature cards showing platform offerings.
 * Clean editorial card design with icons.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - components/layout/Section.tsx
 */

import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { ArrowRight, Newspaper, Layers, Bookmark } from 'lucide-react'

interface Feature {
  icon: string
  title: string
  description: string
  href: string
  cta: string
  comingSoon?: boolean
}

interface FeaturesSectionProps {
  locale: string
  dictionary: {
    kicker: string
    title: string
    features: Feature[]
  }
}

const iconMap: Record<string, typeof Newspaper> = {
  pulse: Newspaper,
  explore: Layers,
  workspace: Bookmark,
}

export function FeaturesSection({ locale, dictionary }: FeaturesSectionProps) {
  return (
    <Section background="alt">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="kicker">{dictionary.kicker}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {dictionary.title}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <div
                key={feature.icon}
                className="group relative card-base p-6 sm:p-8 card-hover"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--accent-soft))]">
                  <Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* CTA */}
                {feature.comingSoon ? (
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-muted-foreground">
                    {feature.cta}
                  </span>
                ) : (
                  <Link
                    href={`/${locale}${feature.href}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] group-hover:underline"
                  >
                    {feature.cta}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}

                {/* Coming soon badge */}
                {feature.comingSoon && (
                  <span className="absolute right-4 top-4 rounded-full badge-accent px-2.5 py-0.5 text-xs font-medium">
                    Coming soon
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

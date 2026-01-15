/**
 * features/home/components/HeroSection.tsx
 *
 * Editorial hero section with gradient background.
 * Clean, confident messaging with dual CTAs.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - components/layout/Container.tsx
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/layout'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  locale: string
  dictionary: {
    kicker: string
    headline: string
    subheadline: string
    primaryCta: string
    secondaryCta: string
  }
  primaryHref?: string
  secondaryHref?: string
}

export function HeroSection({
  locale,
  dictionary,
  primaryHref,
  secondaryHref,
}: HeroSectionProps) {
  return (
    <Section size="lg" background="hero" className="relative overflow-hidden">
      {/* Accent gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(234_89%_59%_/_0.08),transparent)]" />

      <Container className="text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Kicker */}
          <p className="kicker">{dictionary.kicker}</p>

          {/* Headline */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {dictionary.headline}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {dictionary.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full btn-hover-lift px-8"
            >
              <Link href={primaryHref || `/${locale}/explore`}>
                {dictionary.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href={secondaryHref || `/${locale}/micro-probleem`}>
                {dictionary.secondaryCta}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

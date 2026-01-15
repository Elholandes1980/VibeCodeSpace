/**
 * features/home/components/CourseCtaHero.tsx
 *
 * Premium hero-style CTA for VibeCoding Madness course.
 * Webflow-inspired design with author attribution.
 * Content driven by Payload CMS CoursePromo global.
 *
 * Related:
 * - payload/globals/CoursePromo.ts
 * - lib/payload.ts (getCoursePromo)
 * - app/(frontend)/(public)/[locale]/page.tsx
 */

import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'
import type { CoursePromoHero } from '@/lib/payload'

interface CourseCtaHeroProps {
  promo: CoursePromoHero
}

export function CourseCtaHero({ promo }: CourseCtaHeroProps) {
  // Don't render if no headline
  if (!promo.headline) return null

  return (
    <section className="section-cta-premium py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow - authority statement */}
          {promo.eyebrow && (
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
                <Sparkles className="h-4 w-4" />
                {promo.eyebrow}
              </span>
            </div>
          )}

          {/* Headline */}
          <h2 className="text-3xl font-semibold tracking-tight text-white text-center sm:text-4xl lg:text-5xl">
            {promo.headline}
          </h2>

          {/* Subheadline */}
          {promo.subheadline && (
            <p className="mt-6 text-lg text-white/75 text-center max-w-2xl mx-auto leading-relaxed">
              {promo.subheadline}
            </p>
          )}

          {/* Benefit Bullets */}
          {promo.bullets.length > 0 && (
            <ul className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
              {promo.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-white"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA Button */}
          <div className="mt-12 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-foreground hover:bg-white/90 btn-hover-lift px-8 py-6 text-base font-semibold shadow-lg"
            >
              <Link
                href={promo.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {promo.buttonLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Author Attribution */}
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 border border-white/10 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {promo.authorName.charAt(0)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-white font-medium">
                  {promo.authorName}
                </span>
                {promo.authorDescription && (
                  <span className="text-white/60 ml-1">· {promo.authorDescription}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

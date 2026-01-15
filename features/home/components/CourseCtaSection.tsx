/**
 * features/home/components/CourseCtaSection.tsx
 *
 * Promotional CTA section for the VibeCoding course.
 * Shows only on Dutch locale by default.
 *
 * Related:
 * - payload/blocks/index.ts (courseCta block)
 * - app/(frontend)/(public)/[locale]/page.tsx
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CourseCtaSectionProps {
  dictionary: {
    eyebrow: string
    title: string
    text: string
    ctaLabel: string
    note: string
  }
  ctaHref?: string
}

export function CourseCtaSection({ dictionary, ctaHref = 'https://www.vibecodemadness.nl/' }: CourseCtaSectionProps) {
  return (
    <section className="section-cta-premium py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow with icon */}
          {dictionary.eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
              <Sparkles className="h-4 w-4" />
              {dictionary.eyebrow}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {dictionary.title}
          </h2>

          {/* Description */}
          {dictionary.text && (
            <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
              {dictionary.text}
            </p>
          )}

          {/* CTA */}
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-foreground hover:bg-white/90 btn-hover-lift px-8 shadow-lg"
            >
              <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                {dictionary.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Note */}
          {dictionary.note && (
            <p className="mt-4 text-sm text-white/60">
              {dictionary.note}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}

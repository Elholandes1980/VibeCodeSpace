/**
 * features/home/components/MicroProblemCtaSection.tsx
 *
 * Simple CTA section encouraging micro-problem submissions.
 * Clean, minimal design to not compete with main content.
 *
 * Related:
 * - payload/blocks/index.ts (microProblemCta block)
 * - app/(frontend)/(public)/[locale]/page.tsx
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/layout'
import { ArrowRight } from 'lucide-react'

interface MicroProblemCtaSectionProps {
  locale: string
  dictionary: {
    title: string
    text: string
    ctaLabel: string
  }
  ctaHref?: string
}

export function MicroProblemCtaSection({
  locale,
  dictionary,
  ctaHref = '/micro-probleem',
}: MicroProblemCtaSectionProps) {
  const href = ctaHref.startsWith('/') ? `/${locale}${ctaHref}` : ctaHref

  return (
    <Section>
      <Container>
        <div className="rounded-2xl bg-muted/50 border border-border p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {dictionary.title}
              </h2>
              {dictionary.text && (
                <p className="mt-2 text-muted-foreground">
                  {dictionary.text}
                </p>
              )}
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full btn-accent btn-hover-lift px-8 whitespace-nowrap"
            >
              <Link href={href}>
                {dictionary.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/**
 * features/home/components/PricingSection.tsx
 *
 * Webflow-style pricing tables with clear hierarchy.
 * Highlights "Pro" as best value option.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - app/(frontend)/(public)/[locale]/pricing/page.tsx
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/layout'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Plan {
  id?: string
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta: string
  href?: string
  highlighted?: boolean
  badge?: string
}

interface PricingSectionProps {
  locale: string
  dictionary: {
    kicker: string
    title: string
    subtitle: string
    plans: Plan[]
    contactSales: string
  }
}

export function PricingSection({ locale, dictionary }: PricingSectionProps) {
  return (
    <Section id="pricing">
      <Container size="wide">
        <div className="text-center mb-12 sm:mb-16">
          <p className="kicker">{dictionary.kicker}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {dictionary.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {dictionary.plans.map((plan, index) => (
            <PricingCard
              key={plan.id || `plan-${index}`}
              plan={plan}
              locale={locale}
            />
          ))}
        </div>

        {/* Enterprise callout */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/pricing#contact`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {dictionary.contactSales}
          </Link>
        </div>
      </Container>
    </Section>
  )
}

// === Pricing Card ===

interface PricingCardProps {
  plan: Plan
  locale: string
}

function PricingCard({ plan, locale }: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-300',
        plan.highlighted
          ? 'highlight-best-value bg-card'
          : 'bg-card hover:shadow-md'
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--accent))] px-3 py-1 text-xs font-medium text-white">
          {plan.badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-muted-foreground">/{plan.period}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <Check className={cn(
              'mt-0.5 h-4 w-4 flex-shrink-0',
              plan.highlighted ? 'text-[hsl(var(--accent))]' : 'text-muted-foreground'
            )} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        asChild
        variant={plan.highlighted ? 'default' : 'outline'}
        className={cn(
          'w-full rounded-full',
          plan.highlighted && 'btn-accent btn-hover-lift'
        )}
      >
        <Link href={plan.href || `/${locale}/pricing`}>{plan.cta}</Link>
      </Button>
    </div>
  )
}

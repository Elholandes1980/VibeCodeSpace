/**
 * app/(frontend)/(public)/[locale]/pricing/page.tsx
 *
 * Pricing page with plan details, FAQ, and contact form.
 * Webflow-style layout with clear commercial messaging.
 *
 * Related:
 * - features/home/components/PricingSection.tsx
 * - lib/i18n/getDictionary.ts
 */

import { getDictionary, validateLocale } from '@/lib/i18n'
import { Container, Section, PageHeader } from '@/components/layout'
import { PricingSection } from '@/features/home'
import { ContactSalesForm } from './ContactSalesForm'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import type { Locale } from '@/lib/cms/payload'

interface PricingPageProps {
  params: Promise<{ locale: string }>
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam) as Locale
  const dict = getDictionary(locale)

  // Get pricing dictionary with defaults for missing keys
  const pricingDict = dict.pricing || {
    title: 'Prijzen',
    subtitle: 'Kies het plan dat bij je past',
    faq: {
      title: 'Veelgestelde vragen',
      items: []
    },
    contact: {
      title: 'Enterprise oplossing nodig?',
      subtitle: 'Neem contact met ons op voor een plan op maat.',
      form: {
        name: 'Naam',
        email: 'E-mail',
        company: 'Bedrijf',
        message: 'Bericht',
        submit: 'Versturen',
        success: 'Bedankt! We nemen snel contact op.',
        error: 'Er ging iets mis. Probeer het opnieuw.'
      }
    }
  }

  return (
    <>
      {/* Hero */}
      <Section size="lg" className="text-center">
        <Container size="tight">
          <PageHeader
            kicker={dict.home?.pricing?.kicker || 'Prijzen'}
            title={pricingDict.title}
            subtitle={pricingDict.subtitle}
            align="center"
            size="lg"
          />
        </Container>
      </Section>

      {/* Pricing Tables */}
      <PricingSection
        locale={locale}
        dictionary={{
          kicker: '',
          title: '',
          subtitle: '',
          plans: dict.home?.pricing?.plans || [],
          contactSales: '',
        }}
      />

      {/* FAQ Section */}
      {pricingDict.faq?.items?.length > 0 && (
        <Section background="alt">
          <Container size="tight">
            <h2 className="text-2xl font-semibold text-center mb-8 sm:text-3xl">
              {pricingDict.faq.title}
            </h2>
            <div className="space-y-4">
              {pricingDict.faq.items.map((item: { question: string; answer: string }, idx: number) => (
                <details
                  key={idx}
                  className="group rounded-lg border bg-card p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    {item.question}
                    <svg
                      className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Contact Sales */}
      <Section id="contact">
        <Container size="tight" className="text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {pricingDict.contact.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {pricingDict.contact.subtitle}
          </p>
          <div className="mt-8 mx-auto max-w-md text-left">
            <ConvexClientProvider>
              <ContactSalesForm
                locale={locale}
                dictionary={pricingDict.contact.form}
              />
            </ConvexClientProvider>
          </div>
        </Container>
      </Section>
    </>
  )
}

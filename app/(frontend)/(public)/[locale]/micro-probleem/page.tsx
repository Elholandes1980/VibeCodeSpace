/**
 * app/(frontend)/(public)/[locale]/micro-probleem/page.tsx
 *
 * Problem intake page for lead generation.
 * Clean Airbnb-style form for submitting micro-problems.
 *
 * Related:
 * - features/intake/index.ts
 * - lib/i18n/dictionaries/*.json
 */

import { getDictionary } from '@/lib/i18n'
import { IntakePageContent } from './IntakePageContent'
import { Container, Section, PageHeader } from '@/components/layout'
import type { IntakeDictionary } from '@/features/intake'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MicroProbleemPage({ params }: PageProps) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  const intakeDictionary = dictionary.intake as IntakeDictionary

  return (
    <Section size="lg">
      <Container size="tight">
        <PageHeader
          title={intakeDictionary.title}
          subtitle={intakeDictionary.subtitle}
          align="center"
          size="lg"
        />

        <div className="mx-auto max-w-xl">
          <IntakePageContent
            locale={locale}
            dictionary={intakeDictionary}
          />
        </div>
      </Container>
    </Section>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  const intakeDictionary = dictionary.intake as IntakeDictionary

  return {
    title: intakeDictionary.title,
    description: intakeDictionary.subtitle,
  }
}

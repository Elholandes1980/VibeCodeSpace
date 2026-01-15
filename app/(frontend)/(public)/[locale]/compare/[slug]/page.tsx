/**
 * app/(frontend)/(public)/[locale]/compare/[slug]/page.tsx
 *
 * Individual comparison page showing coming soon placeholder.
 * MVP stub - full comparison content in future iteration.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/compare/page.tsx
 * - payload/globals/Navigation.ts (compareLinks)
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { validateLocale } from '@/lib/i18n'
import { ArrowLeft, Clock } from 'lucide-react'

interface CompareDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

// Comparison data - will be CMS-driven in future
const COMPARISONS: Record<string, {
  nl: { title: string; description: string };
  en: { title: string; description: string };
  es: { title: string; description: string };
}> = {
  llm: {
    nl: {
      title: 'Claude vs GPT vs Gemini',
      description: 'Een uitgebreide vergelijking van de beste AI assistenten voor coding en algemene taken.',
    },
    en: {
      title: 'Claude vs GPT vs Gemini',
      description: 'A comprehensive comparison of the best AI assistants for coding and general tasks.',
    },
    es: {
      title: 'Claude vs GPT vs Gemini',
      description: 'Una comparación completa de los mejores asistentes de IA para programación y tareas generales.',
    },
  },
  'code-editors': {
    nl: {
      title: 'AI Code Editors Vergeleken',
      description: 'Cursor, Windsurf, VS Code met Copilot - welke editor past het beste bij jouw workflow?',
    },
    en: {
      title: 'AI Code Editors Compared',
      description: 'Cursor, Windsurf, VS Code with Copilot - which editor fits your workflow best?',
    },
    es: {
      title: 'Editores de Código con IA Comparados',
      description: 'Cursor, Windsurf, VS Code con Copilot - ¿cuál editor se adapta mejor a tu flujo de trabajo?',
    },
  },
  'ai-studios': {
    nl: {
      title: 'AI Video Studios Vergeleken',
      description: 'Runway, Pika, Veo - de beste tools voor AI-gestuurde video generatie.',
    },
    en: {
      title: 'AI Video Studios Compared',
      description: 'Runway, Pika, Veo - the best tools for AI-powered video generation.',
    },
    es: {
      title: 'Estudios de Video IA Comparados',
      description: 'Runway, Pika, Veo - las mejores herramientas para generación de video con IA.',
    },
  },
}

export async function generateMetadata({
  params,
}: CompareDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const comparison = COMPARISONS[slug]
  const localeData = comparison?.[locale as keyof typeof comparison] || comparison?.nl

  if (!localeData) {
    return {
      title: 'Comparison | VibeCodeSpace',
    }
  }

  return {
    title: `${localeData.title} | VibeCodeSpace`,
    description: localeData.description,
  }
}

export default async function CompareDetailPage({ params }: CompareDetailPageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)

  const comparison = COMPARISONS[slug]
  const content = comparison?.[locale as keyof typeof comparison] || comparison?.nl

  // Labels
  const labels = {
    nl: {
      comingSoon: 'Binnenkort beschikbaar',
      placeholder: 'We werken aan een gedetailleerde vergelijking. Kom snel terug voor objectieve analyses, prijsvergelijkingen en use-case aanbevelingen.',
      backToCompare: 'Alle vergelijkingen',
      backToTools: 'Terug naar Tools',
      notFound: 'Vergelijking niet gevonden',
      notFoundDesc: 'Deze vergelijkingspagina bestaat niet.',
    },
    en: {
      comingSoon: 'Coming Soon',
      placeholder: 'We are working on a detailed comparison. Check back soon for objective analyses, price comparisons, and use-case recommendations.',
      backToCompare: 'All comparisons',
      backToTools: 'Back to Tools',
      notFound: 'Comparison not found',
      notFoundDesc: 'This comparison page does not exist.',
    },
    es: {
      comingSoon: 'Próximamente',
      placeholder: 'Estamos trabajando en una comparación detallada. Vuelve pronto para análisis objetivos, comparaciones de precios y recomendaciones de casos de uso.',
      backToCompare: 'Todas las comparaciones',
      backToTools: 'Volver a Herramientas',
      notFound: 'Comparación no encontrada',
      notFoundDesc: 'Esta página de comparación no existe.',
    },
  }

  const l = labels[locale as keyof typeof labels] || labels.nl

  // Handle unknown comparison
  if (!content) {
    return (
      <Section size="lg">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold">{l.notFound}</h1>
            <p className="mt-4 text-muted-foreground">{l.notFoundDesc}</p>
            <Link
              href={`/${locale}/compare`}
              className="mt-6 inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {l.backToCompare}
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section size="lg">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href={`/${locale}/compare`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {l.backToCompare}
          </Link>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-200 mb-4">
            <Clock className="h-4 w-4" />
            {l.comingSoon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {content.description}
          </p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--accent-soft))]">
              <Clock className="h-8 w-8 text-[hsl(var(--accent))]" />
            </div>
            <p className="text-muted-foreground">
              {l.placeholder}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/compare`}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                {l.backToCompare}
              </Link>
              <Link
                href={`/${locale}/tools`}
                className="inline-flex items-center justify-center rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(var(--accent)_/_0.9)] transition-colors"
              >
                {l.backToTools}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

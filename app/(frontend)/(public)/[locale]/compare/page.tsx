/**
 * app/(frontend)/(public)/[locale]/compare/page.tsx
 *
 * Compare landing page - lists available tool comparisons.
 * MVP stub - full implementation in future iteration.
 *
 * Related:
 * - payload/globals/Navigation.ts (compareLinks)
 * - components/nav/MegaMenu.tsx
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { validateLocale } from '@/lib/i18n'
import { ArrowRight } from 'lucide-react'

interface ComparePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    nl: 'Vergelijk AI Tools',
    en: 'Compare AI Tools',
    es: 'Comparar Herramientas de IA',
  }

  const descriptions: Record<string, string> = {
    nl: 'Vergelijk populaire AI tools en maak de beste keuze voor jouw project.',
    en: 'Compare popular AI tools and make the best choice for your project.',
    es: 'Compara herramientas de IA populares y elige la mejor para tu proyecto.',
  }

  return {
    title: `${titles[locale] || titles.nl} | VibeCodeSpace`,
    description: descriptions[locale] || descriptions.nl,
  }
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)

  // Labels
  const content = {
    nl: {
      title: 'Vergelijk AI Tools',
      description: 'Objectieve vergelijkingen om je te helpen de beste tool te kiezen voor jouw project.',
      comingSoon: 'Vergelijkingspagina\'s worden binnenkort toegevoegd.',
      placeholder: 'We werken aan gedetailleerde vergelijkingen van populaire AI tools. Kom snel terug!',
      backToTools: 'Terug naar Tools',
      comparisons: [
        { title: 'Claude vs GPT vs Gemini', description: 'De beste AI assistenten vergeleken', href: '/compare/llm' },
        { title: 'AI Code Editors', description: 'Cursor, Windsurf, Claude Code vergeleken', href: '/compare/code-editors' },
        { title: 'AI Studios', description: 'Veo, Runway, Pika voor video generatie', href: '/compare/ai-studios' },
      ],
    },
    en: {
      title: 'Compare AI Tools',
      description: 'Objective comparisons to help you choose the best tool for your project.',
      comingSoon: 'Comparison pages coming soon.',
      placeholder: 'We are working on detailed comparisons of popular AI tools. Check back soon!',
      backToTools: 'Back to Tools',
      comparisons: [
        { title: 'Claude vs GPT vs Gemini', description: 'Best AI assistants compared', href: '/compare/llm' },
        { title: 'AI Code Editors', description: 'Cursor, Windsurf, Claude Code compared', href: '/compare/code-editors' },
        { title: 'AI Studios', description: 'Veo, Runway, Pika for video generation', href: '/compare/ai-studios' },
      ],
    },
    es: {
      title: 'Comparar Herramientas de IA',
      description: 'Comparaciones objetivas para ayudarte a elegir la mejor herramienta.',
      comingSoon: 'Páginas de comparación próximamente.',
      placeholder: 'Estamos trabajando en comparaciones detalladas. ¡Vuelve pronto!',
      backToTools: 'Volver a Herramientas',
      comparisons: [
        { title: 'Claude vs GPT vs Gemini', description: 'Los mejores asistentes de IA comparados', href: '/compare/llm' },
        { title: 'AI Code Editors', description: 'Cursor, Windsurf, Claude Code comparados', href: '/compare/code-editors' },
        { title: 'AI Studios', description: 'Veo, Runway, Pika para generación de video', href: '/compare/ai-studios' },
      ],
    },
  }

  const c = content[locale as keyof typeof content] || content.nl

  return (
    <Section size="lg">
      <Container>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {c.description}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {c.comparisons.map((comparison, idx) => (
            <Link
              key={idx}
              href={`/${locale}${comparison.href}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-[hsl(var(--accent)_/_0.3)] hover:shadow-md"
            >
              <h3 className="font-semibold text-foreground group-hover:text-[hsl(var(--accent))]">
                {comparison.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {comparison.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-[hsl(var(--accent))]">
                <span>{c.comingSoon}</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">{c.placeholder}</p>
          <Link
            href={`/${locale}/tools`}
            className="mt-4 inline-flex items-center text-sm font-medium text-[hsl(var(--accent))] hover:underline"
          >
            {c.backToTools}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

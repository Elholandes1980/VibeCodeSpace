/**
 * features/cases/components/CaseDetail.tsx
 *
 * Editorial case detail view for storytelling.
 * Clean, readable layout: Hero → Problem → Solution → Learnings → CTA.
 * Webflow-inspired with generous whitespace and typography focus.
 *
 * Related:
 * - features/cases/types/index.ts
 * - app/(frontend)/(public)/[locale]/cases/[slug]/page.tsx
 */

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import type { Case, Locale, CaseDetailDictionary } from '../types'

interface CaseDetailProps {
  caseData: Case
  locale: Locale
  dictionary: CaseDetailDictionary
  relatedCases?: Case[]
}

export function CaseDetail({
  caseData,
  locale,
  dictionary,
  relatedCases = [],
}: CaseDetailProps) {
  const imageUrl =
    caseData.featuredImage?.sizes?.featured?.url || caseData.featuredImage?.url

  // Parse stack string into array
  const stackItems = caseData.stack
    ? caseData.stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <article>
      {/* === HERO === */}
      <header className="mb-12 sm:mb-16">
        {/* Featured Image - editorial aspect ratio */}
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-muted mb-8">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={caseData.featuredImage?.alt || caseData.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="h-16 w-16 rounded-2xl bg-muted-foreground/10" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {caseData.title}
        </h1>

        {/* Builder attribution */}
        {caseData.ownerBuilder && (
          <p className="mt-3 text-base text-muted-foreground">
            door{' '}
            <Link
              href={`/${locale}/builders/${caseData.ownerBuilder.slug}`}
              className="font-medium text-foreground hover:text-[hsl(var(--accent))] transition-colors"
            >
              {caseData.ownerBuilder.name}
            </Link>
          </p>
        )}

        {/* One-liner */}
        <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
          {caseData.oneLiner}
        </p>

        {/* Meta: Tags + Tools */}
        <div className="mt-6 flex flex-wrap gap-2">
          {caseData.tags.map((tag) => (
            <Link key={tag.id} href={`/${locale}/explore?tag=${tag.slug}`}>
              <Badge variant="tag" className="hover:opacity-80 transition-opacity">
                {tag.name}
              </Badge>
            </Link>
          ))}
          {caseData.tools.map((tool) => (
            <Badge key={tool.id} variant="tool">
              {tool.name}
            </Badge>
          ))}
        </div>

        {/* Subtle divider */}
        <div className="section-divider mt-10" />
      </header>

      {/* === CONTENT SECTIONS === */}
      <div className="space-y-12 sm:space-y-16">
        {/* Problem */}
        {caseData.problem && (
          <ContentSection title={dictionary.sections.problem}>
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground">
              <ReactMarkdown>{caseData.problem}</ReactMarkdown>
            </div>
          </ContentSection>
        )}

        {/* Solution */}
        {caseData.solution && (
          <ContentSection title={dictionary.sections.solution}>
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground">
              <ReactMarkdown>{caseData.solution}</ReactMarkdown>
            </div>

            {/* Stack integrated into solution */}
            {stackItems.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  {dictionary.sections.stack}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stackItems.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </ContentSection>
        )}

        {/* Learnings */}
        {caseData.learnings && (
          <ContentSection title={dictionary.sections.learnings}>
            <LearningsList learnings={caseData.learnings} />
          </ContentSection>
        )}
      </div>

      {/* === CTA BLOCK === */}
      <div className="mt-16 sm:mt-20">
        <div className="rounded-2xl bg-[hsl(var(--accent-soft))] border border-[hsl(var(--accent)_/_0.1)] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold sm:text-2xl">
                {dictionary.cta.title}
              </h3>
              <p className="mt-2 text-muted-foreground max-w-lg">
                {dictionary.cta.description}
              </p>
            </div>
            <Link
              href={`/${locale}/micro-probleem`}
              className="inline-flex items-center justify-center gap-2 rounded-full btn-accent px-6 py-3 text-sm font-semibold btn-hover-lift whitespace-nowrap"
            >
              {dictionary.cta.button}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* === RELATED CASES === */}
      {relatedCases.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl font-semibold mb-8">
            {dictionary.relatedCases.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCases.map((relatedCase) => (
              <RelatedCaseCard
                key={relatedCase.id}
                caseData={relatedCase}
                locale={locale}
                viewLabel={dictionary.relatedCases.viewCase}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

// === Content Section ===

interface ContentSectionProps {
  title: string
  children: React.ReactNode
}

function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 sm:mb-6">
        {title}
      </h2>
      {children}
    </section>
  )
}

// === Learnings List ===

interface LearningsListProps {
  learnings: string
}

function LearningsList({ learnings }: LearningsListProps) {
  // Render as markdown - it will handle lists, bold, etc.
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground">
      <ReactMarkdown>{learnings}</ReactMarkdown>
    </div>
  )
}

// === Related Case Card ===

interface RelatedCaseCardProps {
  caseData: Case
  locale: Locale
  viewLabel: string
}

function RelatedCaseCard({ caseData, locale, viewLabel }: RelatedCaseCardProps) {
  const imageUrl =
    caseData.featuredImage?.sizes?.card?.url ||
    caseData.featuredImage?.sizes?.thumbnail?.url ||
    caseData.featuredImage?.url

  return (
    <Link
      href={`/${locale}/cases/${caseData.slug}`}
      className="group flex flex-col overflow-hidden card-base card-hover"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={caseData.featuredImage?.alt || caseData.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 rounded-lg bg-muted-foreground/10" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold line-clamp-1 group-hover:text-[hsl(var(--accent))] transition-colors">
          {caseData.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {caseData.oneLiner}
        </p>
        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[hsl(var(--accent))] opacity-0 transition-opacity group-hover:opacity-100">
          {viewLabel}
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  )
}

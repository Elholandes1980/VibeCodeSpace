/**
 * features/cases/components/CaseDetail.tsx
 *
 * Premium case detail view optimized for storytelling and conversion.
 * Features: Strong visual hierarchy, section icons, sticky CTA,
 * tech stack showcase, and compelling narrative structure.
 *
 * Related:
 * - features/cases/types/index.ts
 * - app/(frontend)/(public)/[locale]/cases/[slug]/page.tsx
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  AlertCircle,
  Lightbulb,
  GraduationCap,
  Layers,
  User,
  Calendar,
  ChevronUp,
} from 'lucide-react'
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
  const [showStickyNav, setShowStickyNav] = useState(false)

  // Show sticky nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const imageUrl =
    caseData.featuredImage?.sizes?.featured?.url || caseData.featuredImage?.url

  // Parse stack string into array
  const stackItems = caseData.stack
    ? caseData.stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  // Format date
  const publishDate = caseData.publishedAt
    ? new Date(caseData.publishedAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      {/* === STICKY NAVIGATION BAR === */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-transform duration-300 ${
          showStickyNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md">
            {caseData.title}
          </h2>
          <Link
            href={`/${locale}/micro-probleem`}
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[hsl(var(--accent)_/_0.9)] hover:scale-105"
          >
            {dictionary.cta.button}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <article className="relative">
        {/* === HERO SECTION === */}
        <header className="relative mb-12 sm:mb-16">
          {/* Full-width Hero Image with Gradient Overlay */}
          <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-muted">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={caseData.featuredImage?.alt || caseData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[hsl(var(--accent)_/_0.1)] to-[hsl(var(--accent)_/_0.05)]">
                <div className="h-20 w-20 rounded-2xl bg-[hsl(var(--accent)_/_0.2)]" />
              </div>
            )}

            {/* Hero Content Overlay */}
            {imageUrl && (
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <div className="max-w-3xl">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseData.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white backdrop-blur-sm text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  {/* Title on image */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                    {caseData.title}
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Title below image (when no image) */}
          {!imageUrl && (
            <h1 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {caseData.title}
            </h1>
          )}

          {/* === META BAR === */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            {caseData.ownerBuilder && (
              <Link
                href={`/${locale}/builders/${caseData.ownerBuilder.slug}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[hsl(var(--accent)_/_0.1)] flex items-center justify-center">
                  <User className="h-4 w-4 text-[hsl(var(--accent))]" />
                </div>
                <span className="font-medium">{caseData.ownerBuilder.name}</span>
              </Link>
            )}
            {publishDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishDate}</span>
              </div>
            )}
            {stackItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>{stackItems.length} technologieën</span>
              </div>
            )}
          </div>

          {/* === ONE-LINER / SUMMARY === */}
          <div className="mt-6 p-6 rounded-xl bg-[hsl(var(--accent)_/_0.05)] border border-[hsl(var(--accent)_/_0.1)]">
            <p className="text-lg sm:text-xl text-foreground leading-relaxed font-medium">
              {caseData.oneLiner}
            </p>
          </div>

          {/* === TOOLS USED === */}
          {caseData.tools.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tools gebruikt
              </p>
              <div className="flex flex-wrap gap-2">
                {caseData.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)_/_0.05)] transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* === CONTENT SECTIONS === */}
        <div className="space-y-12 sm:space-y-16">
          {/* PROBLEM SECTION */}
          {caseData.problem && (
            <PremiumSection
              icon={<AlertCircle className="h-6 w-6" />}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              number="01"
              title={dictionary.sections.problem}
            >
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground prose-p:leading-relaxed">
                <ReactMarkdown>{caseData.problem}</ReactMarkdown>
              </div>
            </PremiumSection>
          )}

          {/* SOLUTION SECTION */}
          {caseData.solution && (
            <PremiumSection
              icon={<Lightbulb className="h-6 w-6" />}
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
              number="02"
              title={dictionary.sections.solution}
            >
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground prose-p:leading-relaxed">
                <ReactMarkdown>{caseData.solution}</ReactMarkdown>
              </div>

              {/* Tech Stack Grid */}
              {stackItems.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    <Layers className="h-4 w-4" />
                    {dictionary.sections.stack}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {stackItems.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-[hsl(var(--accent)_/_0.3)] hover:shadow-sm transition-all"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(var(--accent)_/_0.1)] to-[hsl(var(--accent)_/_0.05)] flex items-center justify-center">
                          <span className="text-sm font-bold text-[hsl(var(--accent))]">
                            {tech.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PremiumSection>
          )}

          {/* LEARNINGS SECTION */}
          {caseData.learnings && (
            <PremiumSection
              icon={<GraduationCap className="h-6 w-6" />}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              number="03"
              title={dictionary.sections.learnings}
            >
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-headings:text-foreground prose-p:leading-relaxed">
                <ReactMarkdown>{caseData.learnings}</ReactMarkdown>
              </div>
            </PremiumSection>
          )}
        </div>

        {/* === PRIMARY CTA BLOCK === */}
        <div className="mt-16 sm:mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent)_/_0.8)] p-8 sm:p-12 text-white">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {dictionary.cta.title}
                </h3>
                <p className="mt-3 text-white/80 text-lg leading-relaxed">
                  {dictionary.cta.description}
                </p>
              </div>
              <Link
                href={`/${locale}/micro-probleem`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-[hsl(var(--accent))] transition-all hover:bg-white/90 hover:scale-105 hover:shadow-xl whitespace-nowrap"
              >
                {dictionary.cta.button}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* === RELATED CASES === */}
        {relatedCases.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {dictionary.relatedCases.title}
              </h2>
              <Link
                href={`/${locale}/explore`}
                className="text-sm font-medium text-[hsl(var(--accent))] hover:underline flex items-center gap-1"
              >
                Alle cases
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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

      {/* === SCROLL TO TOP BUTTON === */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all hover:bg-muted ${
          showStickyNav ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  )
}

// === Premium Section Component ===

interface PremiumSectionProps {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  number: string
  title: string
  children: React.ReactNode
}

function PremiumSection({
  icon,
  iconColor,
  iconBg,
  number,
  title,
  children,
}: PremiumSectionProps) {
  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Icon */}
        <div
          className={`flex-shrink-0 h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          {/* Number */}
          <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            Stap {number}
          </span>
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="pl-0 sm:pl-16">{children}</div>
    </section>
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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-[hsl(var(--accent)_/_0.3)] hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={caseData.featuredImage?.alt || caseData.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="h-10 w-10 rounded-lg bg-muted-foreground/10" />
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[hsl(var(--accent)_/_0)] group-hover:bg-[hsl(var(--accent)_/_0.1)] transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors">
          {caseData.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {caseData.oneLiner}
        </p>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm font-medium text-[hsl(var(--accent))]">
            {viewLabel}
          </span>
          <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

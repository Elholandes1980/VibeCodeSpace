/**
 * features/home/components/FeaturedShowcases.tsx
 *
 * Editorial showcase cards featuring recent cases.
 * Fetches from Payload CMS with premium card layout.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - lib/cms/payload.ts
 */

import Link from 'next/link'
import Image from 'next/image'
import { Container, Section } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { CaseWithRelations } from '@/lib/cms/payload'

interface FeaturedShowcasesProps {
  locale: string
  cases: CaseWithRelations[]
  dictionary: {
    kicker: string
    title: string
    viewAll: string
    viewCase?: string
  }
  viewAllHref?: string
}

export function FeaturedShowcases({
  locale,
  cases,
  dictionary,
  viewAllHref,
}: FeaturedShowcasesProps) {
  const viewAllLink = viewAllHref || `/${locale}/explore`
  const viewCaseLabel = dictionary.viewCase || 'View case'
  if (cases.length === 0) return null

  return (
    <Section background="alt" divider>
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <p className="kicker">{dictionary.kicker}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {dictionary.title}
            </h2>
          </div>
          <Link
            href={viewAllLink}
            className="hidden items-center text-sm font-medium text-[hsl(var(--accent))] hover:underline sm:flex"
          >
            {dictionary.viewAll}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.slice(0, 3).map((caseItem) => (
            <ShowcaseCard
              key={caseItem.id}
              caseItem={caseItem}
              locale={locale}
              viewLabel={viewCaseLabel}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={viewAllLink}
            className="inline-flex items-center text-sm font-medium text-[hsl(var(--accent))]"
          >
            {dictionary.viewAll}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

// === Showcase Card ===

interface ShowcaseCardProps {
  caseItem: CaseWithRelations
  locale: string
  viewLabel: string
}

function ShowcaseCard({ caseItem, locale, viewLabel }: ShowcaseCardProps) {
  const imageUrl =
    caseItem.featuredImage?.sizes?.card?.url ||
    caseItem.featuredImage?.url

  return (
    <Link
      href={`/${locale}/cases/${caseItem.slug}`}
      className="group flex flex-col overflow-hidden card-base card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={caseItem.featuredImage?.alt || caseItem.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 rounded-lg bg-muted-foreground/10" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {caseItem.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant="tag" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-[hsl(var(--accent))] transition-colors">
          {caseItem.title}
        </h3>

        {/* One-liner */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {caseItem.oneLiner}
        </p>

        {/* Tools */}
        {caseItem.tools.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {caseItem.tools.slice(0, 3).map((tool) => (
              <Badge key={tool.id} variant="tool" className="text-xs">
                {tool.name}
              </Badge>
            ))}
          </div>
        )}

        {/* View link */}
        <div className="mt-4 flex items-center text-sm font-medium text-[hsl(var(--accent))] opacity-0 transition-opacity group-hover:opacity-100">
          {viewLabel}
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  )
}

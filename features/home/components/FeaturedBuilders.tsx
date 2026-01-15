/**
 * features/home/components/FeaturedBuilders.tsx
 *
 * Featured builders section for homepage.
 * Displays top builders with avatar, name, and case count.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/page.tsx
 * - lib/cms/payload.ts
 */

import Link from 'next/link'
import Image from 'next/image'
import { Container, Section } from '@/components/layout'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { BuilderWithRelations } from '@/lib/cms/payload'
import { formatCompactNumber } from '@/features/builders'

interface FeaturedBuildersDictionary {
  kicker: string
  title: string
  viewAll: string
  viewProfile: string
  casesLabel: string
}

interface FeaturedBuildersProps {
  locale: string
  builders: BuilderWithRelations[]
  dictionary: FeaturedBuildersDictionary
}

export function FeaturedBuilders({
  locale,
  builders,
  dictionary,
}: FeaturedBuildersProps) {
  if (builders.length === 0) return null

  return (
    <Section divider>
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
            href={`/${locale}/builders`}
            className="hidden items-center text-sm font-medium text-[hsl(var(--accent))] hover:underline sm:flex"
          >
            {dictionary.viewAll}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>

        {/* Builder Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {builders.slice(0, 4).map((builder) => (
            <BuilderCard
              key={builder.id}
              builder={builder}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/builders`}
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

// === Builder Card ===

interface BuilderCardProps {
  builder: BuilderWithRelations
  locale: string
  dictionary: FeaturedBuildersDictionary
}

function BuilderCard({ builder, locale, dictionary }: BuilderCardProps) {
  const avatarUrl =
    builder.avatar?.sizes?.thumbnail?.url ||
    builder.avatar?.url ||
    builder.avatarUrl

  const xFollowers = builder.socialStats?.xFollowers

  return (
    <Link
      href={`/${locale}/builders/${builder.slug}`}
      className="group flex flex-col items-center text-center p-6 card-base card-hover"
    >
      {/* Avatar */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted mb-4">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={builder.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent)_/_0.7)]">
            <span className="text-2xl font-semibold text-white">
              {builder.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold group-hover:text-[hsl(var(--accent))] transition-colors">
        {builder.name}
      </h3>

      {/* Stats Row */}
      <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
        {/* Case count */}
        <span>
          {builder.caseCount} {dictionary.casesLabel}
        </span>

        {/* X followers if available */}
        {xFollowers && xFollowers > 0 && (
          <>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {formatCompactNumber(xFollowers)}
            </span>
          </>
        )}
      </div>

      {/* Bio preview */}
      {builder.bio && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {builder.bio}
        </p>
      )}

      {/* View profile link */}
      <div className="mt-4 flex items-center text-sm font-medium text-[hsl(var(--accent))] opacity-0 transition-opacity group-hover:opacity-100">
        {dictionary.viewProfile}
        <ArrowRight className="ml-1 h-3 w-3" />
      </div>
    </Link>
  )
}

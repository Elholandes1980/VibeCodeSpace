/**
 * features/builders/components/BuilderDetail.tsx
 *
 * Detail view for a single builder.
 * Shows profile info, social stats, public links, and their cases.
 * Social links are always visible (they're public anyway).
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/builders/[slug]/page.tsx
 * - features/builders/utils/formatters.ts
 */

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  formatCompactNumber,
  getBuilderAvatarUrl,
  getXProfileUrl,
} from '../utils/formatters'
import type { Builder, BuilderCase, BuilderDetailDictionary, Locale } from '../types'

interface BuilderDetailProps {
  builder: Builder
  cases: BuilderCase[]
  locale: Locale
  dictionary: BuilderDetailDictionary
}

export function BuilderDetail({
  builder,
  cases,
  locale,
  dictionary,
}: BuilderDetailProps) {
  const avatarUrl = getBuilderAvatarUrl(builder.avatar, builder.avatarUrl)
  const xUrl = getXProfileUrl(builder.links?.xHandle, builder.links?.xUrl)

  // Social links are always visible - they're public anyway
  const hasAnyLinks = xUrl || builder.links?.linkedinUrl || builder.links?.githubUrl || builder.links?.websiteUrl

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-muted">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={builder.name}
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-medium text-muted-foreground">
              {builder.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Name + Badges */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{builder.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {builder.plan === 'pro' && (
                <Badge variant="secondary">{dictionary.badges.pro}</Badge>
              )}
              {builder.plan === 'studio' && (
                <Badge variant="default">{dictionary.badges.studio}</Badge>
              )}
              {builder.featured && (
                <Badge variant="outline">{dictionary.badges.featured}</Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          {builder.bio && (
            <p className="text-lg text-muted-foreground max-w-2xl">{builder.bio}</p>
          )}

          {/* Social Stats */}
          {builder.socialStats?.fetchStatus === 'ok' && (
            <div className="flex flex-wrap gap-6 pt-2">
              {builder.socialStats.xFollowers !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCompactNumber(builder.socialStats.xFollowers)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dictionary.social.followers}
                  </div>
                </div>
              )}
              {builder.socialStats.xFollowing !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCompactNumber(builder.socialStats.xFollowing)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dictionary.social.following}
                  </div>
                </div>
              )}
              {builder.socialStats.xPosts !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCompactNumber(builder.socialStats.xPosts)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dictionary.social.posts}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links - always visible (they're public) */}
          {hasAnyLinks && (
            <div className="flex flex-wrap gap-3 pt-2">
              {xUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={xUrl} target="_blank" rel="noopener noreferrer">
                    X / Twitter
                  </a>
                </Button>
              )}
              {builder.links?.linkedinUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={builder.links.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              )}
              {builder.links?.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={builder.links.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </Button>
              )}
              {builder.links?.websiteUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={builder.links.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cases Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {dictionary.sections.cases} ({cases.length})
        </h2>

        {cases.length === 0 ? (
          <p className="text-muted-foreground">{dictionary.empty.noCases}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/${locale}/cases/${caseItem.slug}`}
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-foreground/20">
                  <CardContent className="p-4">
                    {caseItem.featuredImage?.url && (
                      <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={caseItem.featuredImage.url}
                          alt={caseItem.featuredImage.alt || caseItem.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-foreground mb-1">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {caseItem.oneLiner}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

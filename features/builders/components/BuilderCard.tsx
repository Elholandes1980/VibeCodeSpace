/**
 * features/builders/components/BuilderCard.tsx
 *
 * Card component for displaying a builder in the grid.
 * Shows avatar, name, bio, plan badge, case count, and followers.
 *
 * Related:
 * - features/builders/components/BuildersGrid.tsx
 * - features/builders/utils/formatters.ts
 */

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCompactNumber, getBuilderAvatarUrl } from '../utils/formatters'
import type { Builder, BuildersDictionary, Locale } from '../types'

interface BuilderCardProps {
  builder: Builder
  locale: Locale
  dictionary: BuildersDictionary['card']
}

export function BuilderCard({ builder, locale, dictionary }: BuilderCardProps) {
  const avatarUrl = getBuilderAvatarUrl(builder.avatar, builder.avatarUrl)
  const hasFollowers = builder.socialStats?.xFollowers && builder.socialStats.xFollowers > 0

  return (
    <Link href={`/${locale}/builders/${builder.slug}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-foreground/20">
        <CardContent className="p-6">
          {/* Header: Avatar + Name + Badge */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={builder.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-medium text-muted-foreground">
                  {builder.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Plan Badge */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {builder.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {builder.plan === 'pro' && (
                  <Badge variant="secondary" className="text-xs">
                    Pro
                  </Badge>
                )}
                {builder.plan === 'studio' && (
                  <Badge variant="default" className="text-xs">
                    Studio
                  </Badge>
                )}
                {builder.featured && (
                  <Badge variant="outline" className="text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {builder.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {builder.bio}
            </p>
          )}

          {/* Stats: Cases + Followers */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {builder.caseCount} {dictionary.cases}
            </span>
            {hasFollowers && (
              <span>
                {formatCompactNumber(builder.socialStats?.xFollowers)} {dictionary.followers}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

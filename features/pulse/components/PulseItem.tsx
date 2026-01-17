/**
 * features/pulse/components/PulseItem.tsx
 *
 * Individual pulse item row in HN/PH style.
 * Clean, scannable design with source badge.
 *
 * Related:
 * - features/pulse/components/PulseList.tsx
 * - features/pulse/components/SourceBadge.tsx
 */

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SourceBadge } from './SourceBadge'
import { formatTimeAgo } from '../utils/formatTime'
import type { PulseItem as PulseItemType, PulseDictionary } from '../types'

interface PulseItemProps {
  item: PulseItemType
  dictionary: PulseDictionary
}

export function PulseItem({ item, dictionary }: PulseItemProps) {
  return (
    <article className="group flex gap-4 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-lg">
      {/* Source Badge */}
      <div className="flex-shrink-0 pt-0.5">
        <SourceBadge source={item.source} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-start gap-1.5"
        >
          <h3 className="font-medium text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-1 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </Link>

        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{item.summary}</p>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {item.author && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                {item.author.charAt(0).toUpperCase()}
              </span>
              {item.author}
            </span>
          )}
          <span>{formatTimeAgo(item.publishedAt, dictionary.timeAgo)}</span>
          {item.upvotes && item.upvotes > 0 && (
            <span className="flex items-center gap-0.5">
              <span className="text-orange-500">▲</span>
              {item.upvotes}
            </span>
          )}
          {item.commentsCount && item.commentsCount > 0 && (
            <span>{item.commentsCount} comments</span>
          )}
        </div>
      </div>
    </article>
  )
}

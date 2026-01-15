/**
 * features/cases/components/CaseCard.tsx
 *
 * Card component displaying a single showcase case.
 * Shows title, builder, one-liner, tags, tools, and optional featured image.
 * Entire card is clickable linking to case detail.
 *
 * Related:
 * - features/cases/types/index.ts
 * - features/cases/components/CasesGrid.tsx
 */

import Image from 'next/image'
import Link from 'next/link'
import type { Case, Locale } from '../types'

interface CaseCardProps {
  caseData: Case
  locale: Locale
}

export function CaseCard({ caseData, locale }: CaseCardProps) {
  const href = `/${locale}/cases/${caseData.slug}`
  const imageUrl = caseData.featuredImage?.sizes?.card?.url || caseData.featuredImage?.url

  return (
    <div className="group overflow-hidden card-base card-hover">
      <Link href={href} className="block">
        {/* Featured Image */}
        {imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={caseData.featuredImage?.alt || caseData.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--accent))] transition-colors">
            {caseData.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {caseData.oneLiner}
          </p>
        </div>
      </Link>

      <div className="px-6 pb-6">
        {/* Builder link */}
        {caseData.ownerBuilder && (
          <Link
            href={`/${locale}/builders/${caseData.ownerBuilder.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs">door</span>
            <span className="font-medium">{caseData.ownerBuilder.name}</span>
          </Link>
        )}

        {/* Tags - accent colored */}
        {caseData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {caseData.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full badge-tag px-2.5 py-0.5 text-xs font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Tools - subtle style */}
        {caseData.tools.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {caseData.tools.map((tool) => (
              <span
                key={tool.id}
                className="inline-flex items-center rounded-full badge-tool px-2.5 py-0.5 text-xs font-medium"
              >
                {tool.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

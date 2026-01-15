/**
 * components/course/CourseCtaCompact.tsx
 *
 * Compact CTA for VibeCoding Madness course.
 * Used on case detail pages, tools pages, and builder profiles.
 * Content driven by Payload CMS CoursePromo global.
 *
 * Related:
 * - payload/globals/CoursePromo.ts
 * - lib/payload.ts (getCoursePromo)
 * - features/cases/components/CaseDetail.tsx
 */

import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import type { CoursePromoCompact } from '@/lib/payload'

interface CourseCtaCompactProps {
  promo: CoursePromoCompact
}

export function CourseCtaCompact({ promo }: CourseCtaCompactProps) {
  // Don't render if no headline
  if (!promo.headline) return null

  return (
    <div className="rounded-2xl border border-[hsl(var(--accent)_/_0.2)] bg-[hsl(var(--accent-soft))] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-xl bg-[hsl(var(--accent)_/_0.1)] flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-[hsl(var(--accent))]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">
            {promo.headline}
          </h3>
          {promo.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {promo.description}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground/80">
            door {promo.authorName}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <Link
            href={promo.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full btn-accent px-5 py-2.5 text-sm font-semibold btn-hover-lift whitespace-nowrap"
          >
            {promo.buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * app/(frontend)/(public)/[locale]/tools/PricingFilter.tsx
 *
 * Client-side pricing filter component for tools listing.
 * Uses window.location for navigation to support SSR.
 *
 * Related:
 * - app/(frontend)/(public)/[locale]/tools/page.tsx
 */

'use client'

interface PricingFilterProps {
  currentValue: string
  categorySlug?: string
  locale: string
  labels: {
    pricingLabel: string
    allLabel: string
    freeLabel: string
    freemiumLabel: string
    paidLabel: string
    enterpriseLabel: string
  }
}

export function PricingFilter({ currentValue, categorySlug, locale, labels }: PricingFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams()
    if (categorySlug) params.set('category', categorySlug)
    if (e.target.value !== 'all') params.set('pricing', e.target.value)
    const query = params.toString()
    window.location.href = `/${locale}/tools${query ? `?${query}` : ''}`
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {labels.pricingLabel}:
      </span>
      <select
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        defaultValue={currentValue}
        onChange={handleChange}
      >
        <option value="all">{labels.allLabel}</option>
        <option value="free">{labels.freeLabel}</option>
        <option value="freemium">{labels.freemiumLabel}</option>
        <option value="paid">{labels.paidLabel}</option>
        <option value="enterprise">{labels.enterpriseLabel}</option>
      </select>
    </div>
  )
}

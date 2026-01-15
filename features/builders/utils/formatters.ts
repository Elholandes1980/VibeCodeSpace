/**
 * features/builders/utils/formatters.ts
 *
 * Utility functions for formatting builder data.
 * Pure functions with no side effects.
 *
 * Related:
 * - features/builders/components/BuilderCard.tsx
 * - features/builders/components/BuilderDetail.tsx
 */

/**
 * Format a number compactly (e.g., 1.2k, 12k, 1.1M).
 * Used for social stats like follower counts.
 */
export function formatCompactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return ''

  if (num >= 1_000_000) {
    const millions = num / 1_000_000
    return millions >= 10
      ? `${Math.floor(millions)}M`
      : `${millions.toFixed(1).replace(/\.0$/, '')}M`
  }

  if (num >= 1_000) {
    const thousands = num / 1_000
    return thousands >= 10
      ? `${Math.floor(thousands)}k`
      : `${thousands.toFixed(1).replace(/\.0$/, '')}k`
  }

  return num.toString()
}

/**
 * Get the display avatar URL for a builder.
 * Prefers uploaded avatar, falls back to external URL.
 */
export function getBuilderAvatarUrl(
  avatar: { url?: string; sizes?: { thumbnail?: { url?: string | null } } } | null | undefined,
  avatarUrl: string | null | undefined
): string | null {
  if (avatar?.sizes?.thumbnail?.url) {
    return avatar.sizes.thumbnail.url
  }
  if (avatar?.url) {
    return avatar.url
  }
  if (avatarUrl) {
    return avatarUrl
  }
  return null
}

/**
 * Get the X profile URL from handle or direct URL.
 */
export function getXProfileUrl(
  xHandle: string | null | undefined,
  xUrl: string | null | undefined
): string | null {
  if (xUrl) return xUrl
  if (xHandle) return `https://x.com/${xHandle}`
  return null
}

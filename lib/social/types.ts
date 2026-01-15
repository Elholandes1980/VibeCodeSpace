/**
 * lib/social/types.ts
 *
 * Types for social stats providers.
 * Designed for async snapshot-based stats (no live scraping).
 *
 * Related:
 * - lib/social/providers/
 * - payload/collections/Builders.ts
 */

/**
 * Stats snapshot from X/Twitter profile.
 */
export interface XStats {
  followers: number
  following: number
  posts: number
}

/**
 * Result from a social stats fetch attempt.
 */
export interface SocialFetchResult {
  success: boolean
  stats?: XStats
  error?: string
  fetchedAt: Date
}

/**
 * Interface for social stats providers.
 * Implementations can be mock, API-based, or scraping-based.
 */
export interface SocialStatsProvider {
  /**
   * Fetch X/Twitter stats for a given handle.
   * @param handle - X handle without @ symbol
   * @returns Stats snapshot or error
   */
  fetchXStats(handle: string): Promise<SocialFetchResult>

  /**
   * Provider name for logging/debugging.
   */
  readonly name: string
}

/**
 * Builder with social stats for update operations.
 */
export interface BuilderSocialUpdate {
  id: number
  xHandle?: string
  socialStats?: {
    xFollowers?: number
    xFollowing?: number
    xPosts?: number
    lastFetched?: string
    fetchStatus?: 'never' | 'ok' | 'failed'
    fetchError?: string
  }
}

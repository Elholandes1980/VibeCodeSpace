/**
 * lib/social/providers/mock.ts
 *
 * Mock social stats provider for testing.
 * Generates random but realistic-looking stats.
 *
 * Related:
 * - lib/social/types.ts
 * - scripts/social-refresh.ts
 */

import type { SocialStatsProvider, SocialFetchResult } from '../types'

/**
 * Mock provider that generates random stats.
 * Used for testing and development.
 */
export class MockSocialProvider implements SocialStatsProvider {
  readonly name = 'mock'

  async fetchXStats(handle: string): Promise<SocialFetchResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

    // 10% chance of failure for realistic testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Mock error: Rate limited',
        fetchedAt: new Date(),
      }
    }

    // Generate realistic-looking stats based on handle
    const seed = this.hashHandle(handle)
    const multiplier = this.getMultiplier(seed)

    return {
      success: true,
      stats: {
        followers: Math.floor(100 + seed * multiplier * 10000),
        following: Math.floor(50 + (seed % 500) * 2),
        posts: Math.floor(10 + (seed % 1000) * 5),
      },
      fetchedAt: new Date(),
    }
  }

  /**
   * Simple hash function for consistent random-ish results per handle.
   */
  private hashHandle(handle: string): number {
    let hash = 0
    for (let i = 0; i < handle.length; i++) {
      const char = handle.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash % 1000)
  }

  /**
   * Get multiplier for varied follower counts.
   */
  private getMultiplier(seed: number): number {
    if (seed < 100) return 0.1  // ~1k followers
    if (seed < 300) return 0.5  // ~5k followers
    if (seed < 700) return 1    // ~10k followers
    if (seed < 900) return 5    // ~50k followers
    return 10                    // ~100k followers
  }
}

/**
 * Singleton instance of mock provider.
 */
export const mockSocialProvider = new MockSocialProvider()

/**
 * lib/social/index.ts
 *
 * Social stats provider exports and factory.
 * Currently only mock provider is implemented.
 *
 * Related:
 * - lib/social/types.ts
 * - lib/social/providers/
 */

export * from './types'
export { mockSocialProvider, MockSocialProvider } from './providers/mock'

import type { SocialStatsProvider } from './types'
import { mockSocialProvider } from './providers/mock'

/**
 * Get the configured social stats provider.
 * Currently returns mock provider.
 * Future: read from env to choose real provider.
 */
export function getSocialProvider(): SocialStatsProvider {
  // Future: check env for SOCIAL_PROVIDER=x_api|scraper|mock
  return mockSocialProvider
}

/**
 * features/pulse/types/index.ts
 *
 * TypeScript types for the Pulse feature.
 * Matches Payload CMS PulseItems collection.
 *
 * Related:
 * - payload/collections/PulseItems.ts
 * - features/pulse/PulseFeed.tsx
 */

export type Locale = 'nl' | 'en' | 'es'

export type PulseSource = 'hn' | 'ph' | 'devto' | 'ih' | 'twitter' | 'manual'

export type PulseCategory = 'tool-launch' | 'success-story' | 'tips-tutorial' | 'twitter-thread'

export interface PulseItem {
  id: number
  externalId: string
  source: PulseSource
  sourceUrl: string
  category: PulseCategory
  title: string
  summary: string
  author?: string
  upvotes?: number
  commentsCount?: number
  sourcePublishedAt?: string
  publishedAt: string
}

export interface PulseFilterState {
  category: PulseCategory | null
  source: PulseSource | null
}

export interface PulseDictionary {
  title: string
  description: string
  filters: {
    all: string
    category: string
    source: string
    categories: Record<PulseCategory, string>
    sources: Record<PulseSource, string>
  }
  empty: {
    title: string
    description: string
  }
  timeAgo: {
    now: string
    minutes: string
    hours: string
    days: string
  }
  viewSource: string
}

/**
 * lib/services/pulse-ingest.ts
 *
 * Core ingestion logic for Pulse feature.
 * Fetches from RSS feeds, processes with Claude AI, stores in Payload.
 * Used by both the cron endpoint and CLI script.
 *
 * Related:
 * - scripts/pulse-ingest.ts (CLI wrapper)
 * - app/(frontend)/(api)/api/cron/pulse-ingest/route.ts
 * - payload/collections/PulseItems.ts
 */

import Parser from 'rss-parser'
import { getPayload } from 'payload'
import config from '../../payload.config'
import { analyzePulseItem } from './pulse-ai'
import type { PulseItemInput } from './pulse-ai'

// === Configuration ===
const RELEVANCE_THRESHOLD = 70 // Auto-publish if score >= 70
const MAX_ITEMS_PER_FEED = 10 // Limit items per feed to control API costs

type PulseSource = 'hn' | 'ph' | 'devto' | 'ih'

interface FeedConfig {
  url: string
  source: PulseSource
  name: string
}

// RSS Feed sources
const FEEDS: FeedConfig[] = [
  // Hacker News - frontpage and Show HN
  { url: 'https://hnrss.org/frontpage', source: 'hn', name: 'HN Frontpage' },
  { url: 'https://hnrss.org/show', source: 'hn', name: 'HN Show' },

  // Product Hunt
  { url: 'https://www.producthunt.com/feed', source: 'ph', name: 'Product Hunt' },

  // Dev.to - AI and building in public tags
  { url: 'https://dev.to/feed/tag/ai', source: 'devto', name: 'Dev.to AI' },
  { url: 'https://dev.to/feed/tag/buildinpublic', source: 'devto', name: 'Dev.to BuildInPublic' },

  // Indie Hackers
  { url: 'https://www.indiehackers.com/feed.xml', source: 'ih', name: 'Indie Hackers' },
]

interface FeedItem {
  id: string
  title: string
  link: string
  author?: string
  published?: Date
  content?: string
  source: PulseSource
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'VibeCodeSpace Pulse Bot/1.0',
  },
})

/**
 * Generate a unique external ID for deduplication.
 */
function generateExternalId(source: PulseSource, link: string): string {
  // Use a hash of the URL for consistent IDs
  const urlHash = Buffer.from(link).toString('base64').replace(/[+/=]/g, '').substring(0, 20)
  return `${source}-${urlHash}`
}

/**
 * Fetch and parse a single RSS feed.
 */
async function fetchFeed(feedConfig: FeedConfig): Promise<FeedItem[]> {
  try {
    console.log(`📡 Fetching: ${feedConfig.name}`)
    const feed = await parser.parseURL(feedConfig.url)

    const items: FeedItem[] = feed.items.slice(0, MAX_ITEMS_PER_FEED).map((item) => ({
      id: generateExternalId(feedConfig.source, item.link || item.guid || ''),
      title: item.title || 'Untitled',
      link: item.link || '',
      author: item.creator || item.author,
      published: item.pubDate ? new Date(item.pubDate) : undefined,
      content: item.contentSnippet || item.content || '',
      source: feedConfig.source,
    }))

    console.log(`   Found ${items.length} items`)
    return items
  } catch (error) {
    console.error(`   ❌ Failed to fetch ${feedConfig.name}:`, error)
    return []
  }
}

/**
 * Main ingestion function.
 * Can be called from CLI or cron endpoint.
 */
export async function ingestPulseItems(): Promise<{ created: number; skipped: number; failed: number }> {
  console.log('🤖 Starting Pulse content ingestion...\n')

  const payload = await getPayload({ config })
  const stats = { created: 0, skipped: 0, failed: 0 }

  // Fetch all feeds in parallel
  const feedResults = await Promise.all(FEEDS.map(fetchFeed))
  const allItems = feedResults.flat()

  console.log(`\n📊 Total items fetched: ${allItems.length}\n`)

  // Process each item
  for (const item of allItems) {
    // Skip items without valid links
    if (!item.link) {
      stats.skipped++
      continue
    }

    // Check if already processed (dedupe by externalId)
    const existing = await payload.find({
      collection: 'pulse-items',
      where: { externalId: { equals: item.id } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`⏭ Skip (exists): ${item.title.substring(0, 50)}...`)
      stats.skipped++
      continue
    }

    console.log(`🔍 Analyzing: ${item.title.substring(0, 60)}...`)

    // Analyze with Claude AI
    const input: PulseItemInput = {
      source: item.source.toUpperCase(),
      title: item.title,
      url: item.link,
      content: item.content?.substring(0, 1000), // Limit content length
      author: item.author,
    }

    const analysis = await analyzePulseItem(input)

    if (!analysis) {
      console.log(`   ❌ Analysis failed`)
      stats.failed++
      continue
    }

    console.log(`   Score: ${analysis.relevanceScore} | Category: ${analysis.category}`)

    // Skip low-relevance items
    if (analysis.relevanceScore < 50) {
      console.log(`   ⏭ Skip (low relevance)`)
      stats.skipped++
      continue
    }

    // Determine status based on relevance score
    const status = analysis.relevanceScore >= RELEVANCE_THRESHOLD ? 'published' : 'review'

    try {
      // Create pulse item in Payload
      await payload.create({
        collection: 'pulse-items',
        locale: 'nl',
        data: {
          externalId: item.id,
          source: item.source,
          sourceUrl: item.link,
          category: analysis.category,
          status,
          relevanceScore: analysis.relevanceScore,
          autoPublish: true,
          titleOriginal: item.title,
          title: analysis.titleNL,
          summary: analysis.summaryNL,
          author: item.author || undefined,
          sourcePublishedAt: item.published?.toISOString(),
          publishedAt: status === 'published' ? new Date().toISOString() : undefined,
          aiReasoning: analysis.reasoning,
          aiSuggestedCategory: analysis.category,
          processedAt: new Date().toISOString(),
        },
      })

      console.log(`   ✓ Created (${status}): ${analysis.titleNL.substring(0, 50)}...`)
      stats.created++
    } catch (error) {
      console.error(`   ❌ Failed to create:`, error)
      stats.failed++
    }

    // Rate limiting - wait between items
    await new Promise((r) => setTimeout(r, 1000))
  }

  console.log(`\n✅ Ingestion complete!`)
  console.log(`   Created: ${stats.created}`)
  console.log(`   Skipped: ${stats.skipped}`)
  console.log(`   Failed: ${stats.failed}`)

  return stats
}

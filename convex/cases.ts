/**
 * convex/cases.ts
 *
 * Queries for showcase cases.
 * Provides listing and detail retrieval with locale/filter support.
 *
 * Related:
 * - convex/schema.ts
 * - convex/tools.ts
 * - convex/tags.ts
 */

import { query } from './_generated/server'
import { v } from 'convex/values'

/**
 * List published cases with optional filters.
 * Returns cases with resolved tag and tool names.
 */
export const listPublished = query({
  args: {
    locale: v.union(v.literal('nl'), v.literal('en'), v.literal('es')),
    tagSlug: v.optional(v.string()),
    toolSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all published cases for locale
    let cases = await ctx.db
      .query('cases')
      .withIndex('by_locale_status', (q) =>
        q.eq('locale', args.locale).eq('status', 'published')
      )
      .collect()

    // Filter by tag if specified
    if (args.tagSlug) {
      const tag = await ctx.db
        .query('tags')
        .withIndex('by_slug', (q) => q.eq('slug', args.tagSlug!))
        .first()
      if (tag) {
        cases = cases.filter((c) => c.tagIds.includes(tag._id))
      } else {
        cases = []
      }
    }

    // Filter by tool if specified
    if (args.toolSlug) {
      const tool = await ctx.db
        .query('tools')
        .withIndex('by_slug', (q) => q.eq('slug', args.toolSlug!))
        .first()
      if (tool) {
        cases = cases.filter((c) => c.toolIds.includes(tool._id))
      } else {
        cases = []
      }
    }

    // Resolve tag and tool names for each case
    const casesWithRelations = await Promise.all(
      cases.map(async (caseDoc) => {
        const tags = await Promise.all(
          caseDoc.tagIds.map((id) => ctx.db.get(id))
        )
        const tools = await Promise.all(
          caseDoc.toolIds.map((id) => ctx.db.get(id))
        )
        return {
          ...caseDoc,
          tags: tags.filter(Boolean).map((t) => ({ slug: t!.slug, name: t!.name })),
          tools: tools.filter(Boolean).map((t) => ({ slug: t!.slug, name: t!.name })),
        }
      })
    )

    return casesWithRelations
  },
})

/**
 * Get a single case by slug and locale.
 * Returns null if not found or not published.
 */
export const getBySlug = query({
  args: {
    locale: v.union(v.literal('nl'), v.literal('en'), v.literal('es')),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db
      .query('cases')
      .withIndex('by_slug_locale', (q) =>
        q.eq('slug', args.slug).eq('locale', args.locale)
      )
      .first()

    if (!caseDoc || caseDoc.status !== 'published') {
      return null
    }

    // Resolve relations
    const tags = await Promise.all(caseDoc.tagIds.map((id) => ctx.db.get(id)))
    const tools = await Promise.all(caseDoc.toolIds.map((id) => ctx.db.get(id)))

    return {
      ...caseDoc,
      tags: tags.filter(Boolean).map((t) => ({ slug: t!.slug, name: t!.name })),
      tools: tools.filter(Boolean).map((t) => ({ slug: t!.slug, name: t!.name })),
    }
  },
})

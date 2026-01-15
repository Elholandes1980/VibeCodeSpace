/**
 * convex/newsletterLeads.ts
 *
 * Convex functions for newsletter signup management.
 * Handles subscription from homepage and other sources.
 *
 * Related:
 * - convex/schema.ts
 * - features/home/components/NewsletterForm.tsx
 */

import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
    locale: v.union(v.literal('nl'), v.literal('en'), v.literal('es')),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query('newsletterLeads')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first()

    if (existing) {
      // Already subscribed, return success silently
      return { success: true, alreadySubscribed: true }
    }

    // Insert new subscriber
    await ctx.db.insert('newsletterLeads', {
      email: args.email.toLowerCase(),
      locale: args.locale,
      source: args.source,
      createdAt: Date.now(),
    })

    return { success: true, alreadySubscribed: false }
  },
})

// Get subscriber count (for admin)
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query('newsletterLeads').collect()
    return leads.length
  },
})

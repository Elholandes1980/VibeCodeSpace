/**
 * convex/salesLeads.ts
 *
 * Convex functions for sales/enterprise inquiry management.
 * Handles contact form submissions from pricing page.
 *
 * Related:
 * - convex/schema.ts
 * - features/pricing/components/ContactSalesForm.tsx
 */

import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Submit sales inquiry
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    companySize: v.optional(
      v.union(
        v.literal('solo'),
        v.literal('2_10'),
        v.literal('11_50'),
        v.literal('51_200'),
        v.literal('over_200')
      )
    ),
    message: v.string(),
    plan: v.optional(v.string()),
    locale: v.union(v.literal('nl'), v.literal('en'), v.literal('es')),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('salesLeads', {
      name: args.name,
      email: args.email.toLowerCase(),
      company: args.company,
      companySize: args.companySize,
      message: args.message,
      plan: args.plan,
      locale: args.locale,
      createdAt: Date.now(),
    })

    return { success: true }
  },
})

// List all sales leads (for admin)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query('salesLeads')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
  },
})

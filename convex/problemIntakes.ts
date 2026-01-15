/**
 * convex/problemIntakes.ts
 *
 * Convex functions for problem intake submissions.
 * Includes public create and admin management functions.
 *
 * Related:
 * - convex/schema.ts
 * - features/intake/hooks/useIntakeForm.ts
 * - features/intakes-admin/hooks/useIntakesAdmin.ts
 */

import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// === Type validators ===
const intakeLocale = v.union(
  v.literal('nl'),
  v.literal('en'),
  v.literal('es'),
  v.literal('other')
)

const intakeStatus = v.union(
  v.literal('new'),
  v.literal('reviewing'),
  v.literal('accepted'),
  v.literal('declined')
)

const urgency = v.union(
  v.literal('low'),
  v.literal('medium'),
  v.literal('high'),
  v.literal('urgent')
)

const budgetRange = v.union(
  v.literal('under_1k'),
  v.literal('1k_5k'),
  v.literal('5k_15k'),
  v.literal('15k_50k'),
  v.literal('over_50k')
)

const companySize = v.union(
  v.literal('solo'),
  v.literal('2_10'),
  v.literal('11_50'),
  v.literal('51_200'),
  v.literal('over_200')
)

// === Public mutations ===

export const create = mutation({
  args: {
    title: v.string(),
    problemDescription: v.string(),
    desiredOutcome: v.string(),
    country: v.string(),
    language: intakeLocale,
    email: v.string(),
    companySize: v.optional(companySize),
    budgetRange: v.optional(budgetRange),
    urgency: v.optional(urgency),
  },
  handler: async (ctx, args) => {
    const intakeId = await ctx.db.insert('problemIntakes', {
      title: args.title,
      problemDescription: args.problemDescription,
      desiredOutcome: args.desiredOutcome,
      country: args.country,
      language: args.language,
      email: args.email,
      companySize: args.companySize,
      budgetRange: args.budgetRange,
      urgency: args.urgency,
      status: 'new',
      createdAt: Date.now(),
    })

    return intakeId
  },
})

// === Admin queries ===

export const list = query({
  args: {
    status: v.optional(intakeStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const intakes = await ctx.db
        .query('problemIntakes')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .order('desc')
        .collect()
      return intakes
    }

    // Return all, sorted by createdAt descending
    const intakes = await ctx.db
      .query('problemIntakes')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
    return intakes
  },
})

export const getById = query({
  args: { id: v.id('problemIntakes') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// === Admin mutations ===

export const updateStatus = mutation({
  args: {
    id: v.id('problemIntakes'),
    status: intakeStatus,
    processedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      processedBy: args.processedBy,
      updatedAt: Date.now(),
    })
  },
})

export const updateNotes = mutation({
  args: {
    id: v.id('problemIntakes'),
    internalNotes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      internalNotes: args.internalNotes,
      updatedAt: Date.now(),
    })
  },
})

export const linkPayloadCase = mutation({
  args: {
    id: v.id('problemIntakes'),
    payloadCaseId: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      payloadCaseId: args.payloadCaseId,
      updatedAt: Date.now(),
    })
  },
})

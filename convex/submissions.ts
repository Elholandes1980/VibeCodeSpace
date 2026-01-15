/**
 * convex/submissions.ts
 *
 * Queries and mutations for case submissions (moderation queue).
 * Handles submission creation, approval, and rejection workflow.
 *
 * Related:
 * - convex/schema.ts
 * - convex/cases.ts
 */

import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

/**
 * List all pending submissions for moderation.
 * Sorted by creation date (oldest first).
 */
export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db
      .query('caseSubmissions')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect()

    // Sort oldest first for FIFO moderation
    return submissions.sort((a, b) => a.createdAt - b.createdAt)
  },
})

/**
 * Create a new case submission.
 * Starts in pending status for moderation.
 */
export const create = mutation({
  args: {
    title: v.string(),
    oneLiner: v.string(),
    locale: v.union(v.literal('nl'), v.literal('en'), v.literal('es')),
    tagSlugs: v.array(v.string()),
    toolSlugs: v.array(v.string()),
    stackText: v.string(),
    links: v.object({
      demo: v.optional(v.string()),
      repo: v.optional(v.string()),
    }),
    email: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert('caseSubmissions', {
      ...args,
      status: 'pending',
      createdAt: Date.now(),
    })
    return submissionId
  },
})

/**
 * Approve a submission and create a published case.
 * Resolves tag/tool slugs to IDs, creates missing ones.
 *
 * NOTE: No auth guard yet - will be added when Clerk is integrated.
 * For now, this is admin-only by convention.
 */
export const approve = mutation({
  args: {
    submissionId: v.id('caseSubmissions'),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId)
    if (!submission) {
      throw new Error('Submission not found')
    }
    if (submission.status !== 'pending') {
      throw new Error('Submission is not pending')
    }

    // Resolve or create tags
    const tagIds = await Promise.all(
      submission.tagSlugs.map(async (slug) => {
        const existing = await ctx.db
          .query('tags')
          .withIndex('by_slug', (q) => q.eq('slug', slug))
          .first()
        if (existing) return existing._id
        return await ctx.db.insert('tags', {
          slug,
          name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
          createdAt: Date.now(),
        })
      })
    )

    // Resolve or create tools
    const toolIds = await Promise.all(
      submission.toolSlugs.map(async (slug) => {
        const existing = await ctx.db
          .query('tools')
          .withIndex('by_slug', (q) => q.eq('slug', slug))
          .first()
        if (existing) return existing._id
        return await ctx.db.insert('tools', {
          slug,
          name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
          createdAt: Date.now(),
        })
      })
    )

    // Generate slug from title
    const slug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Create the published case
    const caseId = await ctx.db.insert('cases', {
      slug,
      title: submission.title,
      oneLiner: submission.oneLiner,
      locale: submission.locale,
      status: 'published',
      tagIds,
      toolIds,
      stack: submission.stackText.split(',').map((s) => s.trim()),
      createdAt: Date.now(),
    })

    // Mark submission as approved
    await ctx.db.patch(args.submissionId, { status: 'approved' })

    return caseId
  },
})

/**
 * Reject a submission.
 *
 * NOTE: No auth guard yet - will be added when Clerk is integrated.
 */
export const reject = mutation({
  args: {
    submissionId: v.id('caseSubmissions'),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId)
    if (!submission) {
      throw new Error('Submission not found')
    }
    if (submission.status !== 'pending') {
      throw new Error('Submission is not pending')
    }

    await ctx.db.patch(args.submissionId, { status: 'rejected' })
  },
})

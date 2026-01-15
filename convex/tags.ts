/**
 * convex/tags.ts
 *
 * Queries for tags used to categorize showcase cases.
 *
 * Related:
 * - convex/schema.ts
 * - convex/cases.ts
 */

import { query } from './_generated/server'

/**
 * List all tags.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tags').collect()
  },
})

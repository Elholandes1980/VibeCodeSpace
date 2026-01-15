/**
 * convex/tools.ts
 *
 * Queries for tools used in showcase cases.
 *
 * Related:
 * - convex/schema.ts
 * - convex/cases.ts
 */

import { query } from './_generated/server'

/**
 * List all tools.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tools').collect()
  },
})

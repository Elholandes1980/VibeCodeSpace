/**
 * convex/schema.ts
 *
 * Convex database schema for VibeCodeSpace showcase.
 * Defines tables for cases, tools, tags, submissions, and problem intakes.
 *
 * Related:
 * - convex/cases.ts
 * - convex/tools.ts
 * - convex/tags.ts
 * - convex/submissions.ts
 * - convex/problemIntakes.ts
 */

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Status enums as literal unions
const caseStatus = v.union(v.literal('published'), v.literal('draft'))
const submissionStatus = v.union(
  v.literal('pending'),
  v.literal('approved'),
  v.literal('rejected')
)
const intakeStatus = v.union(
  v.literal('new'),
  v.literal('reviewing'),
  v.literal('accepted'),
  v.literal('declined')
)
const locale = v.union(v.literal('nl'), v.literal('en'), v.literal('es'))
const intakeLocale = v.union(
  v.literal('nl'),
  v.literal('en'),
  v.literal('es'),
  v.literal('other')
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

export default defineSchema({
  // Showcase cases - featured builds
  cases: defineTable({
    slug: v.string(),
    title: v.string(),
    oneLiner: v.string(),
    locale: locale,
    status: caseStatus,
    tagIds: v.array(v.id('tags')),
    toolIds: v.array(v.id('tools')),
    stack: v.array(v.string()),
    // Detail page content
    featuredImageUrl: v.optional(v.string()),
    problem: v.optional(v.string()),
    solution: v.optional(v.string()),
    learnings: v.optional(v.string()),
    // Metadata
    builderProfileId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_locale_status', ['locale', 'status'])
    .index('by_slug_locale', ['slug', 'locale']),

  // Tools used in cases
  tools: defineTable({
    slug: v.string(),
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_slug', ['slug']),

  // Tags for categorization
  tags: defineTable({
    slug: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index('by_slug', ['slug']),

  // Submission queue for moderation
  caseSubmissions: defineTable({
    title: v.string(),
    oneLiner: v.string(),
    locale: locale,
    tagSlugs: v.array(v.string()),
    toolSlugs: v.array(v.string()),
    stackText: v.string(),
    links: v.object({
      demo: v.optional(v.string()),
      repo: v.optional(v.string()),
    }),
    email: v.string(),
    notes: v.optional(v.string()),
    status: submissionStatus,
    createdAt: v.number(),
  }).index('by_status', ['status']),

  // Problem intake submissions for lead generation
  problemIntakes: defineTable({
    // Required fields
    title: v.string(),
    problemDescription: v.string(),
    desiredOutcome: v.string(),
    country: v.string(),
    language: intakeLocale,
    email: v.string(),
    // Optional fields
    companySize: v.optional(companySize),
    budgetRange: v.optional(budgetRange),
    urgency: v.optional(urgency),
    // Admin processing fields
    internalNotes: v.optional(v.string()),
    processedBy: v.optional(v.string()),
    payloadCaseId: v.optional(v.number()),
    // Metadata
    status: intakeStatus,
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  // Newsletter signups
  newsletterLeads: defineTable({
    email: v.string(),
    locale: locale,
    source: v.optional(v.string()), // e.g., 'homepage', 'footer', 'pricing'
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_createdAt', ['createdAt']),

  // Sales/enterprise inquiry leads
  salesLeads: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    companySize: v.optional(companySize),
    message: v.string(),
    plan: v.optional(v.string()), // Which plan they're interested in
    locale: locale,
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_createdAt', ['createdAt']),
})

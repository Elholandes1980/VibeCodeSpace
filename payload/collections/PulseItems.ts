/**
 * payload/collections/PulseItems.ts
 *
 * Pulse items collection for curated AI/vibecoding content.
 * Auto-ingested from RSS feeds, filtered by AI for relevance.
 * Dutch content is primary, with EN/ES auto-translations.
 *
 * Related:
 * - scripts/pulse-ingest.ts
 * - payload/hooks/pulseAutoTranslate.ts
 * - features/pulse/
 */

import type { CollectionConfig } from 'payload'
import { pulseAutoTranslateHook } from '../hooks/pulseAutoTranslate'

export const PulseItems: CollectionConfig = {
  slug: 'pulse-items',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Curated pulse items from RSS feeds',
    defaultColumns: ['title', 'source', 'category', 'relevanceScore', 'status', 'publishedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [pulseAutoTranslateHook],
  },
  fields: [
    // === Identity & Source ===
    {
      name: 'externalId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Unique ID from source (e.g., HN story ID, PH post ID)' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Hacker News', value: 'hn' },
        { label: 'Product Hunt', value: 'ph' },
        { label: 'Dev.to', value: 'devto' },
        { label: 'Indie Hackers', value: 'ih' },
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      required: true,
      admin: { description: 'Original URL to the content' },
    },

    // === Category ===
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Tool Launches & Updates', value: 'tool-launch' },
        { label: 'Success Stories & Case Studies', value: 'success-story' },
        { label: 'Tips & Tutorials', value: 'tips-tutorial' },
        { label: 'X/Twitter Threads', value: 'twitter-thread' },
      ],
    },

    // === Status & Scoring ===
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'review',
          options: [
            { label: 'Pending Review', value: 'review' },
            { label: 'Published', value: 'published' },
            { label: 'Rejected', value: 'rejected' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'relevanceScore',
          type: 'number',
          min: 0,
          max: 100,
          admin: { width: '33%', description: 'AI-assigned relevance score (0-100)' },
        },
        {
          name: 'autoPublish',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%', description: 'Auto-publish if score >= threshold' },
        },
      ],
    },

    // === Content (Localized) ===
    {
      name: 'titleOriginal',
      type: 'text',
      required: true,
      admin: { description: 'Original title from source' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Dutch title (AI-generated or edited)' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Dutch summary (1-2 sentences, AI-generated)' },
    },

    // === Metadata ===
    {
      name: 'author',
      type: 'text',
      admin: { description: 'Original author/submitter' },
    },
    {
      name: 'upvotes',
      type: 'number',
      admin: { description: 'Upvotes/points from source (for sorting)' },
    },
    {
      name: 'commentsCount',
      type: 'number',
      admin: { description: 'Comment count from source' },
    },
    {
      name: 'sourcePublishedAt',
      type: 'date',
      admin: { description: 'Original publish date from source' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', description: 'When published on VibeCodeSpace' },
    },

    // === AI Processing ===
    {
      type: 'collapsible',
      label: 'AI Processing Info',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'aiReasoning',
          type: 'textarea',
          admin: { description: 'AI explanation for relevance score' },
        },
        {
          name: 'aiSuggestedCategory',
          type: 'text',
          admin: { description: 'Category suggested by AI' },
        },
        {
          name: 'processedAt',
          type: 'date',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
}

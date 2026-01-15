/**
 * lib/cms/payload.ts
 *
 * Server-side helpers for fetching content from Payload CMS.
 * Uses Payload local API for direct database access.
 * Includes caching with 60s revalidation.
 *
 * IMPORTANT: Only use in Server Components or server actions.
 * DO NOT import in client components.
 *
 * Related:
 * - payload.config.ts
 * - payload/collections/Cases.ts
 */

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Case, Tag, Tool, Media } from '@/payload-types'

// === Types ===

export type Locale = 'nl' | 'en' | 'es'

export interface BuilderPreview {
  id: number
  slug: string
  name: string
}

export interface CaseWithRelations extends Omit<Case, 'tags' | 'tools' | 'featuredImage' | 'ownerBuilder'> {
  tags: Pick<Tag, 'id' | 'slug' | 'name'>[]
  tools: Pick<Tool, 'id' | 'slug' | 'name'>[]
  featuredImage: Media | null
  ownerBuilder: BuilderPreview | null
}

// === Helper Functions ===

/**
 * Get Payload instance (cached).
 */
async function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Get all published cases for a locale.
 * Cached for 60 seconds.
 */
export const getPublishedCases = unstable_cache(
  async (locale: Locale): Promise<CaseWithRelations[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'cases',
      locale,
      where: {
        status: { equals: 'published' },
      },
      sort: '-createdAt',
      depth: 1, // Populate relationships one level deep
    })

    // Transform to typed response
    return result.docs.map((doc) => ({
      ...doc,
      tags: Array.isArray(doc.tags)
        ? doc.tags.map((tag) =>
            typeof tag === 'object'
              ? { id: tag.id, slug: tag.slug, name: tag.name }
              : { id: tag, slug: '', name: '' }
          )
        : [],
      tools: Array.isArray(doc.tools)
        ? doc.tools.map((tool) =>
            typeof tool === 'object'
              ? { id: tool.id, slug: tool.slug, name: tool.name }
              : { id: tool, slug: '', name: '' }
          )
        : [],
      featuredImage:
        doc.featuredImage && typeof doc.featuredImage === 'object'
          ? doc.featuredImage
          : null,
      ownerBuilder:
        doc.ownerBuilder && typeof doc.ownerBuilder === 'object'
          ? { id: doc.ownerBuilder.id, slug: doc.ownerBuilder.slug, name: doc.ownerBuilder.name }
          : null,
    })) as CaseWithRelations[]
  },
  ['published-cases'],
  { revalidate: 60, tags: ['cases'] }
)

/**
 * Get a single case by slug and locale.
 * Returns null if not found or not published.
 * Cached for 60 seconds.
 */
export const getCaseBySlug = unstable_cache(
  async (locale: Locale, slug: string): Promise<CaseWithRelations | null> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'cases',
      locale,
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      depth: 1,
      limit: 1,
    })

    const doc = result.docs[0]
    if (!doc) return null

    // Transform to typed response
    return {
      ...doc,
      tags: Array.isArray(doc.tags)
        ? doc.tags.map((tag) =>
            typeof tag === 'object'
              ? { id: tag.id, slug: tag.slug, name: tag.name }
              : { id: tag, slug: '', name: '' }
          )
        : [],
      tools: Array.isArray(doc.tools)
        ? doc.tools.map((tool) =>
            typeof tool === 'object'
              ? { id: tool.id, slug: tool.slug, name: tool.name }
              : { id: tool, slug: '', name: '' }
          )
        : [],
      featuredImage:
        doc.featuredImage && typeof doc.featuredImage === 'object'
          ? doc.featuredImage
          : null,
      ownerBuilder:
        doc.ownerBuilder && typeof doc.ownerBuilder === 'object'
          ? { id: doc.ownerBuilder.id, slug: doc.ownerBuilder.slug, name: doc.ownerBuilder.name }
          : null,
    } as CaseWithRelations
  },
  ['case-by-slug'],
  { revalidate: 60, tags: ['cases'] }
)

/**
 * Get all tags for a locale.
 * Cached for 60 seconds.
 */
export const getTags = unstable_cache(
  async (locale: Locale): Promise<Pick<Tag, 'id' | 'slug' | 'name'>[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tags',
      locale,
      sort: 'name',
      limit: 100,
    })

    return result.docs.map((doc) => ({
      id: Number(doc.id),
      slug: doc.slug,
      name: doc.name,
    }))
  },
  ['tags'],
  { revalidate: 60, tags: ['tags'] }
)

/**
 * Get all tools for a locale.
 * Cached for 60 seconds.
 */
export const getTools = unstable_cache(
  async (locale: Locale): Promise<Pick<Tool, 'id' | 'slug' | 'name'>[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tools',
      locale,
      sort: 'name',
      limit: 100,
    })

    return result.docs.map((doc) => ({
      id: Number(doc.id),
      slug: doc.slug,
      name: doc.name,
    }))
  },
  ['tools'],
  { revalidate: 60, tags: ['tools'] }
)

// === Builders ===

export interface BuilderWithRelations {
  id: number
  name: string
  slug: string
  bio?: string | null
  avatar?: {
    id: number
    url: string
    alt: string
    sizes?: {
      thumbnail?: { url?: string | null }
      card?: { url?: string | null }
    }
  } | null
  avatarUrl?: string | null
  links?: {
    xHandle?: string | null
    xUrl?: string | null
    linkedinUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
  }
  plan: 'free' | 'pro' | 'studio'
  visible: boolean
  featured: boolean
  socialStats?: {
    xFollowers?: number | null
    xFollowing?: number | null
    xPosts?: number | null
    lastFetched?: string | null
    fetchStatus?: 'never' | 'ok' | 'failed'
    fetchError?: string | null
  }
  caseCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Get all visible builders for a locale.
 * Cached for 60 seconds.
 */
export const getVisibleBuilders = unstable_cache(
  async (locale: Locale): Promise<BuilderWithRelations[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'builders',
      locale,
      where: {
        visible: { equals: true },
      },
      sort: '-featured,-caseCount',
      depth: 1,
    })

    return result.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      bio: doc.bio || null,
      avatar:
        doc.avatar && typeof doc.avatar === 'object'
          ? {
              id: doc.avatar.id,
              url: doc.avatar.url || '',
              alt: doc.avatar.alt || '',
              sizes: doc.avatar.sizes,
            }
          : null,
      avatarUrl: doc.avatarUrl || null,
      links: doc.links || undefined,
      plan: doc.plan as 'free' | 'pro' | 'studio',
      visible: doc.visible ?? true,
      featured: doc.featured ?? false,
      socialStats: doc.socialStats || undefined,
      caseCount: doc.caseCount ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })) as BuilderWithRelations[]
  },
  ['visible-builders'],
  { revalidate: 60, tags: ['builders'] }
)

/**
 * Get a single builder by slug.
 * Returns null if not found or not visible.
 * Cached for 60 seconds.
 */
export const getBuilderBySlug = unstable_cache(
  async (locale: Locale, slug: string): Promise<BuilderWithRelations | null> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'builders',
      locale,
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
        ],
      },
      depth: 1,
      limit: 1,
    })

    const doc = result.docs[0]
    if (!doc) return null

    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      bio: doc.bio || null,
      avatar:
        doc.avatar && typeof doc.avatar === 'object'
          ? {
              id: doc.avatar.id,
              url: doc.avatar.url || '',
              alt: doc.avatar.alt || '',
              sizes: doc.avatar.sizes,
            }
          : null,
      avatarUrl: doc.avatarUrl || null,
      links: doc.links || undefined,
      plan: doc.plan as 'free' | 'pro' | 'studio',
      visible: doc.visible ?? true,
      featured: doc.featured ?? false,
      socialStats: doc.socialStats || undefined,
      caseCount: doc.caseCount ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    } as BuilderWithRelations
  },
  ['builder-by-slug'],
  { revalidate: 60, tags: ['builders'] }
)

/**
 * Get cases by builder ID.
 * Returns published cases owned by the builder.
 * Cached for 60 seconds.
 */
export const getCasesByBuilder = unstable_cache(
  async (locale: Locale, builderId: number): Promise<CaseWithRelations[]> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'cases',
      locale,
      where: {
        and: [
          { status: { equals: 'published' } },
          { ownerBuilder: { equals: builderId } },
        ],
      },
      sort: '-createdAt',
      depth: 1,
    })

    return result.docs.map((doc) => ({
      ...doc,
      tags: Array.isArray(doc.tags)
        ? doc.tags.map((tag) =>
            typeof tag === 'object'
              ? { id: tag.id, slug: tag.slug, name: tag.name }
              : { id: tag, slug: '', name: '' }
          )
        : [],
      tools: Array.isArray(doc.tools)
        ? doc.tools.map((tool) =>
            typeof tool === 'object'
              ? { id: tool.id, slug: tool.slug, name: tool.name }
              : { id: tool, slug: '', name: '' }
          )
        : [],
      featuredImage:
        doc.featuredImage && typeof doc.featuredImage === 'object'
          ? doc.featuredImage
          : null,
    })) as CaseWithRelations[]
  },
  ['cases-by-builder'],
  { revalidate: 60, tags: ['cases', 'builders'] }
)

/**
 * Get related cases based on shared tags/tools.
 * Returns max 3 published cases excluding the current one.
 * Cached for 60 seconds.
 */
export const getRelatedCases = unstable_cache(
  async (
    locale: Locale,
    currentCaseId: number,
    tagIds: number[],
    toolIds: number[],
    limit = 3
  ): Promise<CaseWithRelations[]> => {
    const payload = await getPayloadClient()

    // Find cases that share at least one tag or tool
    const result = await payload.find({
      collection: 'cases',
      locale,
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: currentCaseId } },
          {
            or: [
              ...(tagIds.length > 0 ? [{ tags: { in: tagIds } }] : []),
              ...(toolIds.length > 0 ? [{ tools: { in: toolIds } }] : []),
            ],
          },
        ],
      },
      depth: 1,
      limit,
      sort: '-createdAt',
    })

    return result.docs.map((doc) => ({
      ...doc,
      tags: Array.isArray(doc.tags)
        ? doc.tags.map((tag) =>
            typeof tag === 'object'
              ? { id: tag.id, slug: tag.slug, name: tag.name }
              : { id: tag, slug: '', name: '' }
          )
        : [],
      tools: Array.isArray(doc.tools)
        ? doc.tools.map((tool) =>
            typeof tool === 'object'
              ? { id: tool.id, slug: tool.slug, name: tool.name }
              : { id: tool, slug: '', name: '' }
          )
        : [],
      featuredImage:
        doc.featuredImage && typeof doc.featuredImage === 'object'
          ? doc.featuredImage
          : null,
    })) as CaseWithRelations[]
  },
  ['related-cases'],
  { revalidate: 60, tags: ['cases'] }
)

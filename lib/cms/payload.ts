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

// === Media URL Transformation ===

/**
 * Transform a Payload media URL to the correct storage URL.
 * When Vercel Blob is configured, converts /api/media/file/filename.jpg
 * to the correct blob storage URL.
 */
function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // If already a full URL (blob storage or external), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Check if Vercel Blob storage is configured
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    // No blob storage, return local URL
    return url
  }

  // Parse store ID from token
  const storeIdMatch = blobToken.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)
  if (!storeIdMatch) {
    return url
  }

  const storeId = storeIdMatch[1].toLowerCase()

  // Transform local API URL to blob URL
  // /api/media/file/filename.jpg -> https://<storeId>.public.blob.vercel-storage.com/media/filename.jpg
  if (url.startsWith('/api/media/file/')) {
    let filename = url.replace('/api/media/file/', '')
    // Remove number suffix (e.g., "pitchdeck-2.jpg" -> "pitchdeck.jpg")
    filename = filename.replace(/-\d+\./, '.')
    return `https://${storeId}.public.blob.vercel-storage.com/media/${filename}`
  }

  return url
}

/**
 * Transform all URLs in a media object.
 */
function transformMediaUrls<T extends { url?: string | null; sizes?: Record<string, { url?: string | null }> }>(
  media: T | null
): T | null {
  if (!media) return null

  return {
    ...media,
    url: getMediaUrl(media.url),
    sizes: media.sizes
      ? Object.fromEntries(
          Object.entries(media.sizes).map(([key, size]) => [
            key,
            size ? { ...size, url: getMediaUrl(size.url) } : size,
          ])
        )
      : undefined,
  } as T
}

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
          ? transformMediaUrls(doc.featuredImage)
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
          ? transformMediaUrls(doc.featuredImage)
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

    return result.docs.map((doc) => {
      const transformedAvatar = doc.avatar && typeof doc.avatar === 'object'
        ? transformMediaUrls(doc.avatar)
        : null
      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        bio: doc.bio || null,
        avatar: transformedAvatar
          ? {
              id: transformedAvatar.id,
              url: transformedAvatar.url || '',
              alt: transformedAvatar.alt || '',
              sizes: transformedAvatar.sizes,
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
      }
    }) as BuilderWithRelations[]
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

    const transformedAvatar = doc.avatar && typeof doc.avatar === 'object'
      ? transformMediaUrls(doc.avatar)
      : null

    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      bio: doc.bio || null,
      avatar: transformedAvatar
        ? {
            id: transformedAvatar.id,
            url: transformedAvatar.url || '',
            alt: transformedAvatar.alt || '',
            sizes: transformedAvatar.sizes,
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
          ? transformMediaUrls(doc.featuredImage)
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
          ? transformMediaUrls(doc.featuredImage)
          : null,
    })) as CaseWithRelations[]
  },
  ['related-cases'],
  { revalidate: 60, tags: ['cases'] }
)

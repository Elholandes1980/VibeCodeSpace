/**
 * features/cases/types/index.ts
 *
 * TypeScript types for the cases feature.
 * Types match Payload CMS structure with localized fields.
 *
 * Related:
 * - lib/cms/payload.ts
 * - payload/collections/Cases.ts
 */

export type Locale = 'nl' | 'en' | 'es'

export interface TagRef {
  id: number
  slug: string
  name: string
}

export interface ToolRef {
  id: number
  slug: string
  name: string
}

export interface MediaRef {
  id: number
  url: string
  alt: string
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: { url?: string | null }
    card?: { url?: string | null }
    featured?: { url?: string | null }
  }
}

export interface BuilderRef {
  id: number
  slug: string
  name: string
}

export interface Case {
  id: number
  slug: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'featured' | 'paid'
  source: 'editorial' | 'community'
  title: string
  oneLiner: string
  tags: TagRef[]
  tools: ToolRef[]
  featuredImage: MediaRef | null
  problem?: string
  solution?: string
  stack?: string
  learnings?: string
  ownerBuilder?: BuilderRef | null
  ownerProfileId?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  slug: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Tool {
  id: number
  slug: string
  name: string
  websiteUrl?: string
  createdAt: string
  updatedAt: string
}

export interface FilterState {
  tagSlug: string | null
  toolSlug: string | null
}

export interface ExploreDictionary {
  title: string
  description: string
  filters: {
    all: string
    tags: string
    tools: string
  }
  empty: {
    title: string
    description: string
    clearFilters: string
  }
  loading: string
}

export interface CaseDetailDictionary {
  sections: {
    problem: string
    solution: string
    stack: string
    learnings: string
  }
  cta: {
    title: string
    description: string
    button: string
  }
  relatedCases: {
    title: string
    viewCase: string
  }
  meta: {
    titleSuffix: string
    defaultDescription: string
  }
  notFound: {
    title: string
    description: string
    backToExplore: string
  }
  loading: string
}

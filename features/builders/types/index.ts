/**
 * features/builders/types/index.ts
 *
 * TypeScript types for the builders feature.
 * Types match Payload CMS structure with localized fields.
 *
 * Related:
 * - lib/cms/payload.ts
 * - payload/collections/Builders.ts
 */

export type Locale = 'nl' | 'en' | 'es'

export type BuilderPlan = 'free' | 'pro' | 'studio'

export interface BuilderLinks {
  xHandle?: string | null
  xUrl?: string | null
  linkedinUrl?: string | null
  websiteUrl?: string | null
  githubUrl?: string | null
}

export interface BuilderSocialStats {
  xFollowers?: number | null
  xFollowing?: number | null
  xPosts?: number | null
  lastFetched?: string | null
  fetchStatus?: 'never' | 'ok' | 'failed'
  fetchError?: string | null
}

export interface BuilderAvatar {
  id: number
  url: string
  alt: string
  sizes?: {
    thumbnail?: { url?: string | null }
    card?: { url?: string | null }
  }
}

export interface Builder {
  id: number
  name: string
  slug: string
  bio?: string | null
  avatar?: BuilderAvatar | null
  avatarUrl?: string | null
  links?: BuilderLinks
  plan: BuilderPlan
  visible: boolean
  featured: boolean
  socialStats?: BuilderSocialStats
  caseCount: number
  createdAt: string
  updatedAt: string
}

export interface BuilderCase {
  id: number
  slug: string
  title: string
  oneLiner: string
  featuredImage?: {
    url?: string
    alt?: string
  } | null
}

export interface BuilderFilterState {
  plan: BuilderPlan | null
}

export interface BuildersDictionary {
  title: string
  description: string
  filters: {
    all: string
    plans: string
    free: string
    pro: string
    studio: string
  }
  card: {
    cases: string
    followers: string
    viewProfile: string
  }
  empty: {
    title: string
    description: string
    clearFilters: string
  }
  loading: string
}

export interface BuilderDetailDictionary {
  sections: {
    about: string
    cases: string
    links: string
  }
  social: {
    followers: string
    following: string
    posts: string
  }
  cta: {
    contactTitle: string
    contactDescription: string
    registerToContact: string
    contact: string
  }
  badges: {
    pro: string
    studio: string
    featured: string
  }
  empty: {
    noCases: string
  }
  notFound: {
    title: string
    description: string
    backToBuilders: string
  }
  loading: string
}

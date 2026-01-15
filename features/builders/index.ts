/**
 * features/builders/index.ts
 *
 * Public exports for the builders feature.
 * Re-exports components and types for use in pages.
 *
 * Related:
 * - features/builders/BuildersExplore.tsx
 * - features/builders/components/BuilderDetail.tsx
 * - features/builders/types/index.ts
 */

export { BuildersExplore } from './BuildersExplore'
export { BuilderDetail } from './components/BuilderDetail'
export { BuilderNotFound } from './components/BuilderNotFound'
export { BuildersLoadingSkeleton } from './components/BuildersLoadingSkeleton'
export { BuilderDetailSkeleton } from './components/BuilderDetailSkeleton'
export { formatCompactNumber, getBuilderAvatarUrl, getXProfileUrl } from './utils/formatters'
export type {
  Builder,
  BuilderCase,
  BuilderPlan,
  BuilderLinks,
  BuilderSocialStats,
  BuilderAvatar,
  BuilderFilterState,
  BuildersDictionary,
  BuilderDetailDictionary,
  Locale,
} from './types'

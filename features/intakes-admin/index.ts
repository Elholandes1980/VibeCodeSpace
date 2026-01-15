/**
 * features/intakes-admin/index.ts
 *
 * Public exports for the intakes admin feature.
 * Entry point for admin intake management components.
 *
 * Related:
 * - features/intakes-admin/components/*.tsx
 * - features/intakes-admin/hooks/useIntakesAdmin.ts
 */

export { IntakesList } from './components/IntakesList'
export { IntakeDetail } from './components/IntakeDetail'
export { StatusBadge } from './components/StatusBadge'
export { StatusTabs } from './components/StatusTabs'
export { useIntakesList, useIntakeDetail, useIntakeMutations } from './hooks/useIntakesAdmin'
export type {
  ProblemIntake,
  IntakeStatus,
  IntakeLocale,
  Urgency,
  BudgetRange,
  CompanySize,
} from './types'

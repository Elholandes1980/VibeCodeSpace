/**
 * features/intake/index.ts
 *
 * Public exports for the problem intake feature.
 * Entry point for intake form and related components.
 *
 * Related:
 * - features/intake/components/IntakeForm.tsx
 * - features/intake/components/IntakeConfirmation.tsx
 */

export { IntakeForm } from './components/IntakeForm'
export { IntakeConfirmation } from './components/IntakeConfirmation'
export { useIntakeForm } from './hooks/useIntakeForm'
export type {
  IntakeFormData,
  IntakeDictionary,
  IntakeLocale,
  Urgency,
  BudgetRange,
  CompanySize,
} from './types'

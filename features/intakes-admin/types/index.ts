/**
 * features/intakes-admin/types/index.ts
 *
 * Type definitions for the intakes admin feature.
 * Defines intake status types and admin-specific interfaces.
 *
 * Related:
 * - convex/schema.ts
 * - convex/problemIntakes.ts
 */

import type { Id } from '@/convex/_generated/dataModel'

export type IntakeStatus = 'new' | 'reviewing' | 'accepted' | 'declined'
export type IntakeLocale = 'nl' | 'en' | 'es' | 'other'
export type Urgency = 'low' | 'medium' | 'high' | 'urgent'
export type BudgetRange = 'under_1k' | '1k_5k' | '5k_15k' | '15k_50k' | 'over_50k'
export type CompanySize = 'solo' | '2_10' | '11_50' | '51_200' | 'over_200'

export interface ProblemIntake {
  _id: Id<'problemIntakes'>
  _creationTime: number
  title: string
  problemDescription: string
  desiredOutcome: string
  country: string
  language: IntakeLocale
  email: string
  companySize?: CompanySize
  budgetRange?: BudgetRange
  urgency?: Urgency
  internalNotes?: string
  processedBy?: string
  payloadCaseId?: number
  status: IntakeStatus
  createdAt: number
  updatedAt?: number
}

export const STATUS_LABELS: Record<IntakeStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  accepted: 'Accepted',
  declined: 'Declined',
}

export const STATUS_COLORS: Record<IntakeStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
}

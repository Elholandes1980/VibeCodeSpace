/**
 * features/intake/types/index.ts
 *
 * Type definitions for the problem intake feature.
 * Defines form data types and dictionary structure.
 *
 * Related:
 * - convex/schema.ts
 * - features/intake/hooks/useIntakeForm.ts
 */

export type IntakeLocale = 'nl' | 'en' | 'es' | 'other'
export type Urgency = 'low' | 'medium' | 'high' | 'urgent'
export type BudgetRange = 'under_1k' | '1k_5k' | '5k_15k' | '15k_50k' | 'over_50k'
export type CompanySize = 'solo' | '2_10' | '11_50' | '51_200' | 'over_200'

export interface IntakeFormData {
  title: string
  problemDescription: string
  desiredOutcome: string
  country: string
  language: IntakeLocale
  email: string
  companySize?: CompanySize
  budgetRange?: BudgetRange
  urgency?: Urgency
}

export interface IntakeDictionary {
  title: string
  subtitle: string
  form: {
    title: string
    titlePlaceholder: string
    problemDescription: string
    problemDescriptionPlaceholder: string
    desiredOutcome: string
    desiredOutcomePlaceholder: string
    country: string
    countryPlaceholder: string
    language: string
    languageOptions: {
      nl: string
      en: string
      es: string
      other: string
    }
    companySize: string
    companySizeOptions: {
      solo: string
      '2_10': string
      '11_50': string
      '51_200': string
      over_200: string
    }
    budgetRange: string
    budgetRangeOptions: {
      under_1k: string
      '1k_5k': string
      '5k_15k': string
      '15k_50k': string
      over_50k: string
    }
    urgency: string
    urgencyOptions: {
      low: string
      medium: string
      high: string
      urgent: string
    }
    email: string
    emailPlaceholder: string
    submit: string
    submitting: string
    optional: string
  }
  confirmation: {
    title: string
    message: string
    nextSteps: string
    backHome: string
  }
  validation: {
    required: string
    invalidEmail: string
  }
}

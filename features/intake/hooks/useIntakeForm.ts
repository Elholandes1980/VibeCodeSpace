/**
 * features/intake/hooks/useIntakeForm.ts
 *
 * Hook for managing problem intake form state and submission.
 * Handles validation and Convex mutation.
 *
 * Related:
 * - convex/problemIntakes.ts
 * - features/intake/components/IntakeForm.tsx
 */

'use client'

import { useState, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { IntakeFormData, IntakeDictionary } from '../types'

interface UseIntakeFormProps {
  dictionary: IntakeDictionary
  onSuccess?: () => void
}

interface FormErrors {
  title?: string
  problemDescription?: string
  desiredOutcome?: string
  country?: string
  language?: string
  email?: string
}

const initialFormData: IntakeFormData = {
  title: '',
  problemDescription: '',
  desiredOutcome: '',
  country: '',
  language: 'nl',
  email: '',
  companySize: undefined,
  budgetRange: undefined,
  urgency: undefined,
}

export function useIntakeForm({ dictionary, onSuccess }: UseIntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const createIntake = useMutation(api.problemIntakes.create)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = dictionary.validation.required
    }
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = dictionary.validation.required
    }
    if (!formData.desiredOutcome.trim()) {
      newErrors.desiredOutcome = dictionary.validation.required
    }
    if (!formData.country.trim()) {
      newErrors.country = dictionary.validation.required
    }
    if (!formData.language) {
      newErrors.language = dictionary.validation.required
    }
    if (!formData.email.trim()) {
      newErrors.email = dictionary.validation.required
    } else if (!validateEmail(formData.email)) {
      newErrors.email = dictionary.validation.invalidEmail
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, dictionary.validation])

  const updateField = useCallback(<K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createIntake({
        title: formData.title.trim(),
        problemDescription: formData.problemDescription.trim(),
        desiredOutcome: formData.desiredOutcome.trim(),
        country: formData.country.trim(),
        language: formData.language,
        email: formData.email.trim(),
        companySize: formData.companySize,
        budgetRange: formData.budgetRange,
        urgency: formData.urgency,
      })
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to submit intake:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validate, createIntake, onSuccess])

  const reset = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setIsSubmitted(false)
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    updateField,
    handleSubmit,
    reset,
  }
}

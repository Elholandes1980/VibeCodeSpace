/**
 * app/(frontend)/(public)/[locale]/micro-probleem/IntakePageContent.tsx
 *
 * Client component for intake page content.
 * Manages form/confirmation state transition.
 *
 * Related:
 * - features/intake/components/IntakeForm.tsx
 * - features/intake/components/IntakeConfirmation.tsx
 */

'use client'

import { useState } from 'react'
import { IntakeForm, IntakeConfirmation } from '@/features/intake'
import type { IntakeDictionary } from '@/features/intake'

interface IntakePageContentProps {
  locale: string
  dictionary: IntakeDictionary
}

export function IntakePageContent({ locale, dictionary }: IntakePageContentProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (isSubmitted) {
    return <IntakeConfirmation dictionary={dictionary} locale={locale} />
  }

  return (
    <IntakeForm
      dictionary={dictionary}
      onSuccess={() => setIsSubmitted(true)}
    />
  )
}

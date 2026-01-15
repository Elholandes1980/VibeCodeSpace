/**
 * features/intake/components/IntakeConfirmation.tsx
 *
 * Success confirmation screen after form submission.
 * Shows thank you message and next steps.
 *
 * Related:
 * - features/intake/components/IntakeForm.tsx
 * - features/intake/types/index.ts
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import type { IntakeDictionary } from '../types'

interface IntakeConfirmationProps {
  dictionary: IntakeDictionary
  locale: string
}

export function IntakeConfirmation({ dictionary, locale }: IntakeConfirmationProps) {
  const d = dictionary.confirmation

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-4 dark:bg-green-900/20">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        {d.title}
      </h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        {d.message}
      </p>

      <div className="mb-8 max-w-md rounded-lg border bg-muted/50 p-6 text-left">
        <h2 className="mb-2 font-semibold">{d.nextSteps}</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>We review your submission within 24-48 hours</li>
          <li>You&apos;ll receive an email with initial feedback</li>
          <li>We may reach out for clarification if needed</li>
        </ul>
      </div>

      <Button asChild>
        <Link href={`/${locale}`}>
          {d.backHome}
        </Link>
      </Button>
    </div>
  )
}

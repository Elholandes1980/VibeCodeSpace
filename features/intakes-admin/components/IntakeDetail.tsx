/**
 * features/intakes-admin/components/IntakeDetail.tsx
 *
 * Detail panel for viewing and managing a single intake.
 * Shows all fields and provides status management actions.
 *
 * Related:
 * - features/intakes-admin/hooks/useIntakesAdmin.ts
 * - features/intakes-admin/components/StatusBadge.tsx
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge } from './StatusBadge'
import { useIntakeMutations } from '../hooks/useIntakesAdmin'
import type { ProblemIntake, IntakeStatus } from '../types'

interface IntakeDetailProps {
  intake: ProblemIntake
  onAccept?: (intake: ProblemIntake) => Promise<void>
}

export function IntakeDetail({ intake, onAccept }: IntakeDetailProps) {
  const [notes, setNotes] = useState(intake.internalNotes ?? '')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const { updateStatus, updateNotes } = useIntakeMutations()

  const handleStatusChange = async (newStatus: IntakeStatus) => {
    setIsUpdatingStatus(true)
    try {
      await updateStatus(intake._id, newStatus)
      if (newStatus === 'accepted' && onAccept) {
        await onAccept(intake)
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    try {
      await updateNotes(intake._id, notes)
    } finally {
      setIsSavingNotes(false)
    }
  }

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString()
  }

  const formatBudget = (budget?: string) => {
    const labels: Record<string, string> = {
      under_1k: '< €1,000',
      '1k_5k': '€1,000 - €5,000',
      '5k_15k': '€5,000 - €15,000',
      '15k_50k': '€15,000 - €50,000',
      over_50k: '> €50,000',
    }
    return budget ? labels[budget] ?? budget : '-'
  }

  const formatCompanySize = (size?: string) => {
    const labels: Record<string, string> = {
      solo: 'Solo / Freelancer',
      '2_10': '2-10 employees',
      '11_50': '11-50 employees',
      '51_200': '51-200 employees',
      over_200: '200+ employees',
    }
    return size ? labels[size] ?? size : '-'
  }

  const formatUrgency = (urgency?: string) => {
    const labels: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    }
    return urgency ? labels[urgency] ?? urgency : '-'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{intake.title}</h2>
          <p className="text-sm text-muted-foreground">{intake.email}</p>
        </div>
        <StatusBadge status={intake.status as IntakeStatus} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Country:</span>{' '}
          <span className="font-medium">{intake.country}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Language:</span>{' '}
          <span className="font-medium">{intake.language.toUpperCase()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Company size:</span>{' '}
          <span className="font-medium">{formatCompanySize(intake.companySize)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Budget:</span>{' '}
          <span className="font-medium">{formatBudget(intake.budgetRange)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Urgency:</span>{' '}
          <span className="font-medium">{formatUrgency(intake.urgency)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Created:</span>{' '}
          <span className="font-medium">{formatDate(intake.createdAt)}</span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Problem Description</Label>
        <div className="rounded-md border bg-muted/50 p-3 text-sm">
          {intake.problemDescription}
        </div>
      </div>

      {/* Desired Outcome */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Desired Outcome</Label>
        <div className="rounded-md border bg-muted/50 p-3 text-sm">
          {intake.desiredOutcome}
        </div>
      </div>

      {/* Internal Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Internal Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
          placeholder="Add internal notes..."
          rows={3}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleSaveNotes}
          disabled={isSavingNotes || notes === (intake.internalNotes ?? '')}
        >
          {isSavingNotes ? 'Saving...' : 'Save Notes'}
        </Button>
      </div>

      {/* Actions */}
      <div className="space-y-2 border-t pt-4">
        <Label className="text-sm font-medium">Actions</Label>
        <div className="flex flex-wrap gap-2">
          {intake.status === 'new' && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('reviewing')}
              disabled={isUpdatingStatus}
            >
              Mark as Reviewing
            </Button>
          )}
          {(intake.status === 'new' || intake.status === 'reviewing') && (
            <>
              <Button
                variant="default"
                onClick={() => handleStatusChange('accepted')}
                disabled={isUpdatingStatus}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange('declined')}
                disabled={isUpdatingStatus}
              >
                Decline
              </Button>
            </>
          )}
          {(intake.status === 'accepted' || intake.status === 'declined') && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('reviewing')}
              disabled={isUpdatingStatus}
            >
              Move back to Reviewing
            </Button>
          )}
        </div>
      </div>

      {/* Payload Case Link */}
      {intake.payloadCaseId && (
        <div className="rounded-md border bg-green-50 p-3 text-sm dark:bg-green-900/20">
          <span className="font-medium">Payload Case created:</span>{' '}
          <a
            href={`/admin/collections/cases/${intake.payloadCaseId}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View in CMS
          </a>
        </div>
      )}
    </div>
  )
}

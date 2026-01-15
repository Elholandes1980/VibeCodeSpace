/**
 * app/(frontend)/(public)/[locale]/admin/intakes/IntakesAdminContent.tsx
 *
 * Main content component for the intakes admin page.
 * Contains list, filters, and detail panel.
 *
 * Related:
 * - features/intakes-admin/index.ts
 * - app/(frontend)/(public)/[locale]/admin/intakes/page.tsx
 */

'use client'

import { useState, useCallback } from 'react'
import {
  IntakesList,
  IntakeDetail,
  StatusTabs,
  useIntakesList,
  useIntakeDetail,
  useIntakeMutations,
} from '@/features/intakes-admin'
import type { IntakeStatus, ProblemIntake } from '@/features/intakes-admin'
import type { Id } from '@/convex/_generated/dataModel'

interface IntakesAdminContentProps {
  locale: string
}

export function IntakesAdminContent({ locale }: IntakesAdminContentProps) {
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<Id<'problemIntakes'> | null>(null)

  const { intakes, isLoading } = useIntakesList(
    statusFilter === 'all' ? undefined : statusFilter
  )
  const { intake: selectedIntake } = useIntakeDetail(selectedId)
  const { linkPayloadCase } = useIntakeMutations()

  // Calculate counts for tabs
  const counts = intakes.reduce(
    (acc, intake) => {
      acc.all++
      acc[intake.status as IntakeStatus]++
      return acc
    },
    { all: 0, new: 0, reviewing: 0, accepted: 0, declined: 0 } as Record<
      IntakeStatus | 'all',
      number
    >
  )

  const handleAccept = useCallback(
    async (intake: ProblemIntake) => {
      try {
        const response = await fetch('/api/admin/create-case', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intakeId: intake._id,
            title: intake.title,
            problemDescription: intake.problemDescription,
            desiredOutcome: intake.desiredOutcome,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.caseId) {
            await linkPayloadCase(intake._id, data.caseId)
          }
        }
      } catch (error) {
        console.error('Failed to create case:', error)
      }
    },
    [linkPayloadCase]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problem Intakes</h1>
          <p className="text-muted-foreground">
            Manage incoming problem submissions
          </p>
        </div>
        <a
          href={`/${locale}/micro-probleem`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View intake form →
        </a>
      </div>

      {/* Filters */}
      <StatusTabs
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
        counts={counts}
      />

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: List */}
        <div className="rounded-lg border bg-card">
          <IntakesList
            intakes={intakes as ProblemIntake[]}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Detail */}
        <div className="rounded-lg border bg-card p-6">
          {selectedIntake ? (
            <IntakeDetail
              intake={selectedIntake as ProblemIntake}
              onAccept={handleAccept}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select an intake to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * features/intakes-admin/hooks/useIntakesAdmin.ts
 *
 * Hook for managing problem intakes in the admin panel.
 * Provides CRUD operations and status management.
 *
 * Related:
 * - convex/problemIntakes.ts
 * - features/intakes-admin/components/IntakesList.tsx
 */

'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import type { IntakeStatus } from '../types'

export function useIntakesList(statusFilter?: IntakeStatus) {
  const intakes = useQuery(api.problemIntakes.list, {
    status: statusFilter,
  })

  return {
    intakes: intakes ?? [],
    isLoading: intakes === undefined,
  }
}

export function useIntakeDetail(id: Id<'problemIntakes'> | null) {
  const intake = useQuery(
    api.problemIntakes.getById,
    id ? { id } : 'skip'
  )

  return {
    intake,
    isLoading: id !== null && intake === undefined,
  }
}

export function useIntakeMutations() {
  const updateStatusMutation = useMutation(api.problemIntakes.updateStatus)
  const updateNotesMutation = useMutation(api.problemIntakes.updateNotes)
  const linkPayloadCaseMutation = useMutation(api.problemIntakes.linkPayloadCase)

  const updateStatus = async (
    id: Id<'problemIntakes'>,
    status: IntakeStatus,
    processedBy?: string
  ) => {
    await updateStatusMutation({ id, status, processedBy })
  }

  const updateNotes = async (
    id: Id<'problemIntakes'>,
    internalNotes: string
  ) => {
    await updateNotesMutation({ id, internalNotes })
  }

  const linkPayloadCase = async (
    id: Id<'problemIntakes'>,
    payloadCaseId: number
  ) => {
    await linkPayloadCaseMutation({ id, payloadCaseId })
  }

  return {
    updateStatus,
    updateNotes,
    linkPayloadCase,
  }
}

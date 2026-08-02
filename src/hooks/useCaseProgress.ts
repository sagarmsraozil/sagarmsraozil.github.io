'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  recordAnswer,
  resetAnswers,
  type CaseAnswer,
  type CaseAnswers,
} from '@/lib/caseStore'

export function useCaseAnswer(caseId: string): CaseAnswer | undefined {
  const getSelected = useCallback(() => getSnapshot()[caseId], [caseId])
  const getSelectedServer = useCallback(() => getServerSnapshot()[caseId], [caseId])
  return useSyncExternalStore(subscribe, getSelected, getSelectedServer)
}

export function useAllAnswers(): CaseAnswers {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useSolvedCount(total: number): number {
  const getCount = useCallback(() => Math.min(Object.keys(getSnapshot()).length, total), [total])
  const getServerCount = useCallback(() => 0, [])
  return useSyncExternalStore(subscribe, getCount, getServerCount)
}

export { recordAnswer, resetAnswers }

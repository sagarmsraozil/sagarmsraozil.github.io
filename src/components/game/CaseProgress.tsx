'use client'

import { TOTAL_CASES } from '@/lib/cases'
import { useSolvedCount } from '@/hooks/useCaseProgress'
import styles from './CaseProgress.module.scss'

export function CaseProgress() {
  const solved = useSolvedCount(TOTAL_CASES)

  if (solved === 0) return null

  return (
    <span
      className={styles.progress}
      aria-label={`${solved} of ${TOTAL_CASES} cases explored`}
    >
      Cases {solved}/{TOTAL_CASES}
    </span>
  )
}

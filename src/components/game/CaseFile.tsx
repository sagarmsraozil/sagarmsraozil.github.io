'use client'

import type { CaseData } from '@/types/portfolio'
import { useHydrated } from '@/hooks/useHydrated'
import { useCaseAnswer } from '@/hooks/useCaseProgress'
import { recordAnswer } from '@/lib/caseStore'
import styles from './CaseFile.module.scss'

interface CaseFileProps {
  caseId: string
  data: CaseData
}

export function CaseFile({ caseId, data }: Readonly<CaseFileProps>) {
  const isHydrated = useHydrated()
  const answer = useCaseAnswer(caseId)
  const selectedOption = answer
    ? data.options.find((option) => option.id === answer.optionId)
    : undefined

  return (
    <div className={styles.caseFile}>
      <p className={styles.kicker}>Case file</p>
      <p className={styles.symptom}>{data.symptom}</p>

      {!isHydrated && (
        <details className={styles.fallback}>
          <summary className={styles.fallbackSummary}>{data.prompt}</summary>
          <p className={styles.fallbackDiagnosis}>{data.diagnosis}</p>
        </details>
      )}

      {isHydrated && (
        <>
          <p className={styles.prompt}>{data.prompt}</p>

          <div className={styles.options} role="group" aria-label={data.prompt}>
            {data.options.map((option) => {
              const isSelected = answer?.optionId === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => recordAnswer(caseId, option.id, option.correct)}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className={styles.response} aria-live="polite">
            {selectedOption && (
              <>
                <p className={styles.responseText}>{selectedOption.response}</p>
                <p className={styles.diagnosis}>
                  <span className={styles.diagnosisLabel}>Diagnosis</span>
                  {data.diagnosis}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

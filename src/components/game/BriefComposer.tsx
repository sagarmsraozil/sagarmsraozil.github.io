'use client'

import { useState } from 'react'
import { CASE_REGISTRY, TOTAL_CASES } from '@/lib/cases'
import { useAllAnswers, useSolvedCount } from '@/hooks/useCaseProgress'
import styles from './BriefComposer.module.scss'

const REASONS = [
  { id: 'hiring', label: 'Hiring', subject: 'Role at' },
  { id: 'collaboration', label: 'Collaboration', subject: 'Working together' },
  { id: 'question', label: 'Just a question', subject: 'Quick question' },
] as const

type ReasonId = (typeof REASONS)[number]['id']

interface BriefComposerProps {
  email: string
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function BriefComposer({ email }: Readonly<BriefComposerProps>) {
  const solved = useSolvedCount(TOTAL_CASES)
  const answers = useAllAnswers()
  const [reasonId, setReasonId] = useState<ReasonId>('hiring')
  const [copied, setCopied] = useState(false)

  if (solved < TOTAL_CASES) return null

  const engagedLabels = CASE_REGISTRY.filter((c) => answers[c.id]).map((c) => c.label)
  const reason = REASONS.find((r) => r.id === reasonId)!

  const subject = `${reason.subject} — via the case files`
  const casesLine =
    engagedLabels.length > 0
      ? `I went through the ${formatList(engagedLabels)} case file${engagedLabels.length > 1 ? 's' : ''} on your site.`
      : 'I went through the case files on your site.'
  const body = `Hi Sagar,\n\n${casesLine}\n\n[Add a line about what you're reaching out for]\n\n—`

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — the "Open in email" link below still works.
    }
  }

  return (
    <div className={styles.brief}>
      <p className={styles.briefLabel}>All four cases explored</p>
      <p className={styles.briefHeading}>Here's a starting draft — already knows what you looked at.</p>

      <div className={styles.briefReasons} role="group" aria-label="Reason for reaching out">
        {REASONS.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`${styles.briefReason} ${reasonId === r.id ? styles.briefReasonSelected : ''}`}
            onClick={() => setReasonId(r.id)}
            aria-pressed={reasonId === r.id}
          >
            {r.label}
          </button>
        ))}
      </div>

      <pre className={styles.briefPreview}>{body}</pre>

      <div className={styles.briefActions}>
        <a href={mailtoHref} className={styles.briefSend}>
          Open in email →
        </a>
        <button type="button" className={styles.briefCopy} onClick={handleCopy}>
          Copy draft
        </button>
        <span className={styles.briefCopyStatus} aria-live="polite">
          {copied ? 'Copied to clipboard' : ''}
        </span>
      </div>
    </div>
  )
}

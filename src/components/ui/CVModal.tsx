'use client'

import { useEffect, useRef } from 'react'
import styles from './CVModal.module.scss'

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
  pdfHref: string
}

export function CVModal({ isOpen, onClose, pdfHref }: Readonly<CVModalProps>) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="CV Preview"
    >
      <div
        ref={panelRef}
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className={styles.panelBar}>
          <span className={styles.panelTitle}>Curriculum Vitae</span>
          <div className={styles.panelActions}>
            <a href={pdfHref} download className={styles.panelDownload}>
              Download ↓
            </a>
            <button
              className={styles.panelClose}
              onClick={onClose}
              aria-label="Close preview"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        <div className={styles.panelBody}>
          <iframe
            src={pdfHref}
            className={styles.panelFrame}
            title="Sagar Mishra — Curriculum Vitae"
          />
        </div>
      </div>
    </div>
  )
}

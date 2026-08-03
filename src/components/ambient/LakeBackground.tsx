'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { LakeRenderer } from '@/lib/lake/renderer'
import { LAKE_CONFIG } from '@/lib/lake/config'
import styles from './LakeBackground.module.scss'

// Ripples are for the open background, not for anything a visitor is meant
// to operate — without this guard every nav click, CV button, case-file
// option, and link chip would fire a ripple.
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, summary, details, [role="button"]'

export function LakeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new LakeRenderer(canvas, LAKE_CONFIG, {
      onFail: () => setReady(false),
    })

    if (!renderer.init()) return

    renderer.start()
    setReady(true)

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) return

      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      renderer.addRipple(x, y, 1.0)
      // Same guard as the ripple above — a click on the fish or anywhere on
      // the open water flashes all of them, not just automatic droplets.
      renderer.triggerFishFlash()
    }

    function handleResize() {
      renderer.resize()
    }

    function handleVisibilityChange() {
      if (document.hidden) renderer.stop()
      else renderer.start()
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      renderer.destroy()
      setReady(false)
    }
  }, [reducedMotion])

  const canvasStyle = { '--lake-fade-in-ms': `${LAKE_CONFIG.fadeInMs}ms` } as CSSProperties

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.fallback} />
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`}
          style={canvasStyle}
        />
      )}
    </div>
  )
}

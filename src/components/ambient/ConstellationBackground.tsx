'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CONSTELLATION_CONFIG } from '@/lib/constellation/config'
import { ConstellationRenderer, readPalette } from '@/lib/constellation/renderer'
import styles from './ConstellationBackground.module.scss'

// Bursts are for the open background, not for anything a visitor is meant to
// operate — without this guard every nav click, CV button and link chip would
// fire one, and a click inside the CV preview would burst behind the overlay.
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, details, [role="button"], [role="dialog"]'
// Only a real cursor joins the network; on touch, a tap fires a burst instead.
const FINE_POINTER_QUERY = '(pointer: fine)'

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = ConstellationRenderer.create(canvas, CONSTELLATION_CONFIG, readPalette())
    // No 2D context: the CSS glow on the wrapper is the whole background.
    if (!renderer) return

    let resizeTimer: number | undefined
    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => renderer.resize(), CONSTELLATION_CONFIG.resizeDebounceMs)
    }

    renderer.setScroll(window.scrollY, window.innerHeight)
    renderer.resize()
    window.addEventListener('resize', handleResize, { passive: true })

    // Reduced motion is a hard branch, not a slowdown: one static frame, no reactions.
    if (reducedMotion) {
      return () => {
        window.clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
      }
    }

    const handleScroll = () => {
      renderer.setScroll(window.scrollY, window.innerHeight)
    }

    const handlePointerMove = (event: PointerEvent) => {
      renderer.setPointer(event.clientX, event.clientY)
    }

    const handlePointerLeave = () => {
      renderer.clearPointer()
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) return
      renderer.burst(event.clientX, event.clientY)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) renderer.stop()
      else renderer.start()
    }

    const tracksPointer = window.matchMedia(FINE_POINTER_QUERY).matches
    const root = document.documentElement

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    if (tracksPointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      root.addEventListener('pointerleave', handlePointerLeave)
    }
    renderer.start()

    return () => {
      renderer.stop()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [reducedMotion])

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}

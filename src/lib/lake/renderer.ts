import { VERTEX_SHADER, FRAGMENT_SHADER } from './shader'
import type { LakeConfig } from './config'

interface RippleRecord {
  x: number
  y: number
  birth: number
  strength: number
  ambient: boolean
}

interface FishState {
  speedX: number
  speedY: number
  phaseX: number
  phaseY: number
  ampX: number
  ampY: number
  centreX: number
  centreY: number
  wagSeed: number
}

interface LakeRendererCallbacks {
  /** Called once when adaptive degradation has already dropped quality and is
   *  still too slow, or when the WebGL context is lost. The caller should
   *  stop rendering the canvas and rely on the CSS fallback layer. */
  onFail?: () => void
}

type RgbFloat = [number, number, number]

const MAX_RIPPLE_SLOTS = 12
const MAX_FISH_SLOTS = 5
const RIPPLE_UNIFORM_TAIL_SEC = 0.4 // keep a ripple alive slightly past its lifetime so its final fade is drawn
const FISH_VELOCITY_SAMPLE_DT = 0.05 // seconds, for approximating heading from the path function

function hexToRgbFloat(hex: string, fallback: RgbFloat): RgbFloat {
  const clean = hex.trim().replace('#', '')
  if (clean.length !== 6) return fallback
  const value = Number.parseInt(clean, 16)
  if (Number.isNaN(value)) return fallback
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

/**
 * Hand-written WebGL1 renderer for the ambient lake background — one draw
 * call per frame (a full-screen triangle), no dependency. See
 * 04-design-system.md ("Ambient Background") for why this exists and what
 * it is deliberately not allowed to do.
 */
export class LakeRenderer {
  private readonly canvas: HTMLCanvasElement
  private readonly config: LakeConfig
  private readonly callbacks: LakeRendererCallbacks
  private readonly onContextLost = (event: Event) => {
    event.preventDefault()
    this.stop()
    this.callbacks.onFail?.()
  }

  private gl: WebGLRenderingContext | null = null
  private program: WebGLProgram | null = null
  private uniforms: Record<string, WebGLUniformLocation | null> = {}
  private rafId: number | null = null

  private startTime = 0
  private lastFrameAt = 0
  private frameTimes: number[] = []
  private degraded = false
  private failed = false

  private ripples: RippleRecord[] = []
  private nextAmbientAtMs = 0

  private fish: FishState[] = []
  private lastFishFlashAtSec = -1000

  private dpr = 1
  private colHalfNorm = 0.15
  private colFeatherNorm = 0.06
  private colWidthPx = 720

  private colors = {
    bg: [0, 0, 0] as RgbFloat,
    link: [0, 0, 0] as RgbFloat,
    violet: [0, 0, 0] as RgbFloat,
    gold: [0, 0, 0] as RgbFloat,
    auroraGreen: [0, 0, 0] as RgbFloat,
  }

  constructor(canvas: HTMLCanvasElement, config: LakeConfig, callbacks: LakeRendererCallbacks = {}) {
    this.canvas = canvas
    this.config = config
    this.callbacks = callbacks
  }

  /** Returns false if WebGL is unavailable or shader compilation fails — the
   *  caller should leave the CSS fallback layer in place and not call start(). */
  init(): boolean {
    const gl =
      (this.canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) ??
      (this.canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    if (!gl) return false
    this.gl = gl

    const vertexShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return false

    const program = gl.createProgram()
    if (!program) return false
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return false
    }
    this.program = program
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // A single triangle whose corners sit outside clip space still fully covers it.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    this.cacheUniforms()
    this.readDesignTokens()
    this.initFish()
    this.resize()

    this.canvas.addEventListener('webglcontextlost', this.onContextLost, false)

    this.startTime = performance.now()
    this.lastFrameAt = this.startTime
    this.scheduleNextAmbientDroplet(this.startTime)

    return true
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl!
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  private cacheUniforms(): void {
    const gl = this.gl!
    const program = this.program!
    const names = [
      'uResolution',
      'uTime',
      'uAuroraOpacity',
      'uDimFactor',
      'uRippleDimFactor',
      'uColHalf',
      'uColFeather',
      'uRippleFrequency',
      'uRipples',
      'uRippleCount',
      'uFish',
      'uFishCount',
      'uFishFlashTime',
      'uFishOpacity',
      'uColorBg',
      'uColorLink',
      'uColorViolet',
      'uColorGold',
      'uColorAuroraGreen',
    ]
    for (const name of names) {
      this.uniforms[name] = gl.getUniformLocation(program, name)
    }
  }

  /** Reads the live mika CSS custom properties so the shader palette and the
   *  reading-column width can never drift out of sync with the design tokens. */
  private readDesignTokens(): void {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string, fallback: RgbFloat) => hexToRgbFloat(style.getPropertyValue(name), fallback)

    this.colors = {
      bg: read('--bg-base', [0.059, 0.086, 0.141]),
      link: read('--link', [0.361, 0.733, 1]),
      violet: read('--accent-violet', [0.502, 0.533, 1]),
      gold: read('--accent-gold', [1, 0.784, 0.341]),
      auroraGreen: read('--accent-aurora-green', [0.263, 0.910, 0.627]),
    }

    const parsed = Number.parseFloat(style.getPropertyValue('--max-width-reading'))
    this.colWidthPx = Number.isFinite(parsed) && parsed > 0 ? parsed : 720
  }

  /** Sets up each fish's swimming path once — a stable per-fish identity for
   *  the session, not re-randomised every frame. */
  private initFish(): void {
    this.fish = Array.from({ length: Math.min(this.config.fishCount, MAX_FISH_SLOTS) }, () => ({
      speedX: 0.12 + Math.random() * 0.08,
      speedY: 0.10 + Math.random() * 0.08,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      ampX: 0.26 + Math.random() * 0.14,
      ampY: 0.18 + Math.random() * 0.12,
      centreX: 0.5 + (Math.random() - 0.5) * 0.6,
      centreY: 0.5 + (Math.random() - 0.5) * 0.5,
      wagSeed: Math.random() * 1000,
    }))
  }

  private fishPositionAt(f: FishState, t: number): { x: number; y: number } {
    return {
      x: f.centreX + f.ampX * Math.cos(t * f.speedX + f.phaseX),
      y: f.centreY + f.ampY * Math.sin(t * f.speedY + f.phaseY),
    }
  }

  resize(): void {
    const gl = this.gl
    if (!gl) return

    this.dpr = Math.min(window.devicePixelRatio || 1, this.degraded ? 1 : this.config.dprCap)
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * this.dpr))
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * this.dpr))
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
      gl.viewport(0, 0, width, height)
    }

    const viewportWidth = Math.max(1, this.canvas.clientWidth)
    this.colHalfNorm = this.colWidthPx / 2 / viewportWidth
    this.colFeatherNorm = this.config.columnFeatherPx / viewportWidth
  }

  /** x/y are normalised 0-1, with y=1 at the top of the viewport (matching
   *  the shader's vUv convention) — the caller is expected to flip clientY. */
  addRipple(x: number, y: number, strength: number, ambient = false): void {
    if (this.ripples.length >= this.config.maxRipples) this.ripples.shift()
    this.ripples.push({
      x,
      y,
      birth: (performance.now() - this.startTime) / 1000,
      strength,
      ambient,
    })
  }

  /** Flashes every fish bright aurora green, decaying over a couple of
   *  seconds. Called on any qualifying click/tap — deliberately not called
   *  from the ambient-droplet scheduler, so only a real touch triggers it. */
  triggerFishFlash(): void {
    this.lastFishFlashAtSec = (performance.now() - this.startTime) / 1000
  }

  private scheduleNextAmbientDroplet(nowMs: number): void {
    const { ambientDropletMinIntervalSec, ambientDropletMaxIntervalSec } = this.config
    const delaySec =
      ambientDropletMinIntervalSec + Math.random() * (ambientDropletMaxIntervalSec - ambientDropletMinIntervalSec)
    this.nextAmbientAtMs = nowMs + delaySec * 1000
  }

  private maybeSpawnAmbientDroplet(nowMs: number): void {
    if (nowMs < this.nextAmbientAtMs) return

    const nowSec = (nowMs - this.startTime) / 1000
    const aliveAmbient = this.ripples.filter(
      (r) => r.ambient && nowSec - r.birth < this.config.rippleLifetimeSec,
    ).length

    if (aliveAmbient < this.config.maxAmbientDropletsAlive) {
      this.addRipple(Math.random(), Math.random(), this.config.ambientDropletStrength, true)
    }
    this.scheduleNextAmbientDroplet(nowMs)
  }

  start(): void {
    if (this.rafId != null || this.failed) return
    const loop = (nowMs: number) => {
      this.rafId = requestAnimationFrame(loop)

      const frameBudgetMs = 1000 / this.config.targetFps
      if (nowMs - this.lastFrameAt < frameBudgetMs) return
      this.lastFrameAt = nowMs

      this.maybeSpawnAmbientDroplet(nowMs)

      // Measure the draw call itself, not the gap since the last accepted
      // frame — that gap is dominated by the fps-cap throttle above (it is
      // *always* >= frameBudgetMs by construction) and says nothing about
      // whether the device is actually struggling.
      const drawStart = performance.now()
      this.draw(nowMs)
      const drawCostMs = performance.now() - drawStart

      if (nowMs - this.startTime > this.config.warmupMs) {
        this.trackFrameTime(drawCostMs)
      }
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private trackFrameTime(ms: number): void {
    this.frameTimes.push(ms)
    const windowSize = Math.max(4, Math.ceil(this.config.degradeWindowMs / (1000 / this.config.targetFps)))
    if (this.frameTimes.length < windowSize) return

    const average = this.frameTimes.reduce((sum, t) => sum + t, 0) / this.frameTimes.length
    this.frameTimes = []
    if (average <= this.config.degradeFrameBudgetMs) return

    if (!this.degraded) {
      // First strike: drop to native resolution and give it another window to recover.
      this.degraded = true
      this.resize()
    } else {
      // Still too slow even at native resolution — give up cleanly.
      this.failed = true
      this.stop()
      this.callbacks.onFail?.()
    }
  }

  private draw(nowMs: number): void {
    const gl = this.gl
    if (!gl) return

    const t = (nowMs - this.startTime) / 1000
    gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height)
    gl.uniform1f(this.uniforms.uTime, t)
    gl.uniform1f(this.uniforms.uAuroraOpacity, this.config.auroraOpacity)
    gl.uniform1f(this.uniforms.uDimFactor, this.config.dimFactor)
    gl.uniform1f(this.uniforms.uRippleDimFactor, this.config.rippleDimFactor)
    gl.uniform1f(this.uniforms.uColHalf, this.colHalfNorm)
    gl.uniform1f(this.uniforms.uColFeather, this.colFeatherNorm)
    gl.uniform1f(this.uniforms.uRippleFrequency, this.config.rippleFrequency)
    gl.uniform1f(this.uniforms.uFishFlashTime, this.lastFishFlashAtSec)
    gl.uniform1f(this.uniforms.uFishOpacity, this.config.fishOpacity)
    gl.uniform3f(this.uniforms.uColorBg, ...this.colors.bg)
    gl.uniform3f(this.uniforms.uColorLink, ...this.colors.link)
    gl.uniform3f(this.uniforms.uColorViolet, ...this.colors.violet)
    gl.uniform3f(this.uniforms.uColorGold, ...this.colors.gold)
    gl.uniform3f(this.uniforms.uColorAuroraGreen, ...this.colors.auroraGreen)

    const maxAge = this.config.rippleLifetimeSec + RIPPLE_UNIFORM_TAIL_SEC
    this.ripples = this.ripples.filter((r) => t - r.birth < maxAge)

    const rippleFlat = new Float32Array(MAX_RIPPLE_SLOTS * 4)
    const rippleCount = Math.min(this.ripples.length, MAX_RIPPLE_SLOTS)
    // Most recent `count` ripples — if more than the buffer size are somehow
    // alive at once, older ones simply stop being drawn rather than erroring.
    const visibleRipples = this.ripples.slice(this.ripples.length - rippleCount)
    visibleRipples.forEach((r, i) => {
      rippleFlat[i * 4 + 0] = r.x
      rippleFlat[i * 4 + 1] = r.y
      rippleFlat[i * 4 + 2] = r.birth
      rippleFlat[i * 4 + 3] = r.strength
    })
    gl.uniform4fv(this.uniforms.uRipples, rippleFlat)
    gl.uniform1i(this.uniforms.uRippleCount, rippleCount)

    const fishFlat = new Float32Array(MAX_FISH_SLOTS * 4)
    this.fish.forEach((f, i) => {
      const now = this.fishPositionAt(f, t)
      const prev = this.fishPositionAt(f, t - FISH_VELOCITY_SAMPLE_DT)
      const heading = Math.atan2(now.y - prev.y, now.x - prev.x)
      const wag = Math.sin(t * 4.0 + f.wagSeed) * 0.6

      fishFlat[i * 4 + 0] = now.x
      fishFlat[i * 4 + 1] = now.y
      fishFlat[i * 4 + 2] = heading
      fishFlat[i * 4 + 3] = wag
    })
    gl.uniform4fv(this.uniforms.uFish, fishFlat)
    gl.uniform1i(this.uniforms.uFishCount, this.fish.length)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  destroy(): void {
    this.stop()
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)

    const gl = this.gl
    if (gl && this.program) {
      gl.deleteProgram(this.program)
    }
    this.gl = null
    this.program = null
    this.ripples = []
    this.fish = []
  }
}

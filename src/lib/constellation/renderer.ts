import type { ConstellationConfig } from './config'

/** Comma-separated RGB channels, e.g. "0, 98, 65" — ready to drop into rgba(). */
type RgbChannels = string

export interface ConstellationPalette {
  ink: RgbChannels
  warm: RgbChannels
}

interface GraphNode {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hub: boolean
  warm: boolean
  /** Parallax layer, 0.4-1: deeper nodes move less with the pointer. */
  depth: number
  /** Breathing offset so hubs don't pulse in lockstep. */
  phase: number
}

interface Pulse {
  from: GraphNode
  to: GraphNode
  start: number
  duration: number
  warm: boolean
}

interface BurstRing {
  x: number
  y: number
  start: number
}

interface NodeFlash {
  node: GraphNode
  start: number
}

interface PointerState {
  x: number
  y: number
  targetX: number
  targetY: number
  active: boolean
}

const PALETTE_TOKENS = {
  ink: '--constellation-ink',
  warm: '--constellation-warm',
} as const

const FALLBACK_PALETTE: ConstellationPalette = { ink: '0, 98, 65', warm: '203, 162, 88' }

// Hub ring and the inner burst ring sit at these proportions of their parent.
const INNER_RING_SCALE = 0.62
const INNER_RING_ALPHA = 0.5
const RING_LINE_WIDTH = 1.5
// Flash response curve — how much a burst lifts a node's alpha, size and glow.
const FLASH_ALPHA_BOOST = 0.6
const FLASH_RADIUS_BOOST = 2.6
const FLASH_GLOW_PX = 14
const FLASH_RING_BOOST = 0.3
const FLASH_VISIBLE_THRESHOLD = 0.05
/** Scheduled flashes may light this early so a hop reads as arriving, not late. */
const FLASH_LEAD_MS = 50
const GLOW_ALPHA = 0.8
const PULSE_ALPHA = 0.85
const MAX_NODE_ALPHA = 0.95
/** Burst sparks live this many hops long so the chain visibly overlaps. */
const SPARK_DURATION_HOPS = 2.4
/** Nodes closer than this to the pointer stop being pulled (no clumping on the cursor). */
const CURSOR_DEAD_ZONE_PX = 20
const PULSE_PAIR_ATTEMPTS = 12

function hexToChannels(hex: string): RgbChannels | null {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim())
  if (!match) return null
  const digits = match[1].length === 3 ? [...match[1]].map((d) => d + d).join('') : match[1]
  const value = Number.parseInt(digits, 16)
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

/** Colours come from CSS tokens so globals.scss stays the single source of truth. */
export function readPalette(): ConstellationPalette {
  const styles = getComputedStyle(document.documentElement)
  return {
    ink: hexToChannels(styles.getPropertyValue(PALETTE_TOKENS.ink)) ?? FALLBACK_PALETTE.ink,
    warm: hexToChannels(styles.getPropertyValue(PALETTE_TOKENS.warm)) ?? FALLBACK_PALETTE.warm,
  }
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/**
 * Imperative 2D-canvas renderer. All per-frame state lives here, never in
 * React — it changes 60 times a second and nothing else needs to read it.
 */
export class ConstellationRenderer {
  private width = 0
  private height = 0
  private nodes: GraphNode[] = []
  private pulses: Pulse[] = []
  private sparks: Pulse[] = []
  private rings: BurstRing[] = []
  private flashes: NodeFlash[] = []
  private running = false
  private rafId: number | null = null
  private lastPulseAt = 0
  private lastBurstAt = 0
  private scrollFade = 1
  private readonly pointer: PointerState = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: false }

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly config: ConstellationConfig,
    private readonly palette: ConstellationPalette,
  ) {}

  /** Returns null when the browser can't give us a 2D context. */
  static create(
    canvas: HTMLCanvasElement,
    config: ConstellationConfig,
    palette: ConstellationPalette,
  ): ConstellationRenderer | null {
    const ctx = canvas.getContext('2d')
    return ctx ? new ConstellationRenderer(canvas, ctx, config, palette) : null
  }

  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, this.config.dprCap)
    this.width = this.canvas.clientWidth || window.innerWidth
    this.height = this.canvas.clientHeight || window.innerHeight
    this.canvas.width = Math.round(this.width * dpr)
    this.canvas.height = Math.round(this.height * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.seed()
    if (!this.running) this.drawFrame(performance.now())
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    this.running = false
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  setPointer(clientX: number, clientY: number): void {
    this.aimPointer(clientX, clientY)
    this.pointer.active = true
  }

  clearPointer(): void {
    this.pointer.active = false
  }

  setScroll(scrollY: number, viewportHeight: number): void {
    const { scrollFadeFloor, scrollFadeRate } = this.config
    this.scrollFade = Math.max(scrollFadeFloor, 1 - (scrollY / Math.max(1, viewportHeight)) * scrollFadeRate)
  }

  /** Shockwave at the tap, then a chain reaction hop-by-hop through the graph. */
  burst(clientX: number, clientY: number): void {
    const c = this.config
    const now = performance.now()
    if (now - this.lastBurstAt < c.burstDebounceMs) return
    this.lastBurstAt = now

    // Snap the parallax toward the touch point so the burst originates under the finger.
    this.aimPointer(clientX, clientY)

    this.rings.push({ x: clientX, y: clientY, start: now })
    if (this.rings.length > c.maxBurstRings) this.rings.shift()

    const origin = this.nearestNode(clientX, clientY)
    if (!origin) return

    const maxD2 = c.linkDistancePx ** 2
    const hops = new Map<GraphNode, number>([[origin, 0]])
    const queue: GraphNode[] = [origin]
    this.flashes.push({ node: origin, start: now })

    for (let head = 0; head < queue.length; head++) {
      const current = queue[head]
      const hop = hops.get(current) ?? 0
      if (hop >= c.maxHops) continue
      for (const node of this.nodes) {
        if (hops.has(node)) continue
        if ((current.x - node.x) ** 2 + (current.y - node.y) ** 2 >= maxD2) continue
        hops.set(node, hop + 1)
        queue.push(node)
        this.flashes.push({ node, start: now + (hop + 1) * c.hopMs })
        this.sparks.push({
          from: current,
          to: node,
          start: now + hop * c.hopMs,
          duration: c.hopMs * SPARK_DURATION_HOPS,
          warm: node.warm,
        })
      }
    }

    if (this.flashes.length > c.maxFlashes) this.flashes.splice(0, this.flashes.length - c.maxFlashes)
    if (this.sparks.length > c.maxSparks) this.sparks.splice(0, this.sparks.length - c.maxSparks)
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return
    this.step()
    if (now - this.lastPulseAt > this.config.pulseIntervalMs) {
      this.lastPulseAt = now
      this.spawnPulse(now)
    }
    this.drawFrame(now)
    this.rafId = requestAnimationFrame(this.tick)
  }

  private aimPointer(clientX: number, clientY: number): void {
    this.pointer.targetX = clientX / Math.max(1, this.width)
    this.pointer.targetY = clientY / Math.max(1, this.height)
  }

  private nodeCount(): number {
    const c = this.config
    const cap = this.width < c.narrowViewportPx ? c.maxNodesNarrow : c.maxNodesWide
    return Math.max(c.minNodes, Math.min(cap, Math.round((this.width * this.height) / c.areaPerNode)))
  }

  private seed(): void {
    const c = this.config
    this.nodes = Array.from({ length: this.nodeCount() }, () => {
      let x = Math.random()
      const y = Math.random()
      // Keep the hero copy block (left-centre) readable.
      const inHeroBlock = x < c.heroBlock.maxX && y > c.heroBlock.minY && y < c.heroBlock.maxY
      if (inHeroBlock && Math.random() < c.heroAvoidChance) x = 0.5 + Math.random() * 0.5
      const hub = Math.random() < c.hubChance
      return {
        x: x * this.width,
        y: y * this.height,
        vx: (Math.random() - 0.5) * c.initialSpeed,
        vy: (Math.random() - 0.5) * c.initialSpeed,
        radius: hub ? c.hubRadius : c.nodeRadiusMin + Math.random() * c.nodeRadiusJitter,
        hub,
        warm: Math.random() < c.warmChance,
        depth: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      }
    })
    this.pulses = []
    this.sparks = []
    this.rings = []
    this.flashes = []
  }

  private nearestNode(x: number, y: number): GraphNode | null {
    let nearest: GraphNode | null = null
    let best = Infinity
    for (const node of this.nodes) {
      const d2 = (node.x - x) ** 2 + (node.y - y) ** 2
      if (d2 < best) {
        best = d2
        nearest = node
      }
    }
    return nearest
  }

  private spawnPulse(now: number): void {
    const c = this.config
    if (this.pulses.length >= c.maxAmbientPulses || this.nodes.length < 2) return
    const maxD2 = c.linkDistancePx ** 2
    for (let attempt = 0; attempt < PULSE_PAIR_ATTEMPTS; attempt++) {
      const from = this.nodes[Math.floor(Math.random() * this.nodes.length)]
      const to = this.nodes[Math.floor(Math.random() * this.nodes.length)]
      if (from === to || (from.x - to.x) ** 2 + (from.y - to.y) ** 2 >= maxD2) continue
      this.pulses.push({
        from,
        to,
        start: now,
        duration: c.pulseDurationMinMs + Math.random() * c.pulseDurationJitterMs,
        warm: Math.random() < c.pulseWarmChance,
      })
      return
    }
  }

  /** Physics: gentle pull toward the pointer, damping, a floor on stillness, wrap-around. */
  private step(): void {
    const c = this.config
    const { pointer } = this
    const cx = pointer.x * this.width
    const cy = pointer.y * this.height
    const cursorD2 = c.cursorDistancePx ** 2
    const deadZoneD2 = CURSOR_DEAD_ZONE_PX ** 2

    for (const node of this.nodes) {
      if (pointer.active) {
        const dx = cx - node.x
        const dy = cy - node.y
        const d2 = dx * dx + dy * dy
        if (d2 > deadZoneD2 && d2 < cursorD2) {
          const d = Math.sqrt(d2)
          const pull = (1 - d / c.cursorDistancePx) * c.cursorPull
          node.vx += (dx / d) * pull
          node.vy += (dy / d) * pull
        }
      }
      node.vx *= c.damping
      node.vy *= c.damping
      if (Math.hypot(node.vx, node.vy) < c.minSpeed) {
        node.vx += (Math.random() - 0.5) * c.jitter
        node.vy += (Math.random() - 0.5) * c.jitter
      }
      node.x += node.vx
      node.y += node.vy

      const m = c.wrapMarginPx
      if (node.x < -m) node.x = this.width + m
      else if (node.x > this.width + m) node.x = -m
      if (node.y < -m) node.y = this.height + m
      else if (node.y > this.height + m) node.y = -m
    }

    pointer.x += (pointer.targetX - pointer.x) * c.pointerEase
    pointer.y += (pointer.targetY - pointer.y) * c.pointerEase
  }

  private drawFrame(now: number): void {
    const c = this.config
    this.ctx.clearRect(0, 0, this.width, this.height)

    const offsetX = (this.pointer.x - 0.5) * c.parallaxX
    const offsetY = (this.pointer.y - 0.5) * c.parallaxY
    // Interactions stay lively even after the ambient layer has faded on scroll.
    const liveFade = Math.max(this.scrollFade, c.liveFadeFloor)

    this.drawLinks(offsetX, offsetY)
    if (this.pointer.active) this.drawPointerLinks(offsetX, offsetY, liveFade)
    this.drawNodes(now, offsetX, offsetY, this.collectFlashes(now), liveFade)
    this.drawRings(now, liveFade)
    this.drawPulses(this.pulses, now, offsetX, offsetY, this.scrollFade, c.pulseRadius, c.pulseGlow)
    this.drawPulses(this.sparks, now, offsetX, offsetY, liveFade, c.sparkRadius, c.sparkGlow)
  }

  private strokeLine(x1: number, y1: number, x2: number, y2: number, color: RgbChannels, alpha: number): void {
    const { ctx } = this
    ctx.strokeStyle = `rgba(${color}, ${alpha.toFixed(3)})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  private drawLinks(offsetX: number, offsetY: number): void {
    const c = this.config
    const { nodes } = this
    const maxD2 = c.linkDistancePx ** 2
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]
      const ax = a.x + offsetX * a.depth
      const ay = a.y + offsetY * a.depth
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]
        const bx = b.x + offsetX * b.depth
        const by = b.y + offsetY * b.depth
        const d2 = (ax - bx) ** 2 + (ay - by) ** 2
        if (d2 >= maxD2) continue
        const alpha = (1 - Math.sqrt(d2) / c.linkDistancePx) * c.edgeAlpha * this.scrollFade
        this.strokeLine(ax, ay, bx, by, this.palette.ink, alpha)
      }
    }
  }

  /** The pointer joins the network: links from the cursor to every nearby node. */
  private drawPointerLinks(offsetX: number, offsetY: number, liveFade: number): void {
    const c = this.config
    const cx = this.pointer.x * this.width
    const cy = this.pointer.y * this.height
    const maxD2 = c.cursorDistancePx ** 2
    for (const node of this.nodes) {
      const nx = node.x + offsetX * node.depth
      const ny = node.y + offsetY * node.depth
      const d2 = (cx - nx) ** 2 + (cy - ny) ** 2
      if (d2 >= maxD2) continue
      const alpha = (1 - Math.sqrt(d2) / c.cursorDistancePx) * c.cursorLinkAlpha * liveFade
      this.strokeLine(cx, cy, nx, ny, this.palette.ink, alpha)
    }
  }

  /** Per-node flash strength for this frame, pruning flashes that have finished. */
  private collectFlashes(now: number): Map<GraphNode, number> {
    const c = this.config
    const boost = new Map<GraphNode, number>()
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i]
      const dt = now - flash.start
      if (dt > c.flashLifetimeMs) {
        this.flashes.splice(i, 1)
        continue
      }
      if (dt < -FLASH_LEAD_MS) continue
      const strength = Math.exp(-((dt / c.flashWidthMs) ** 2))
      boost.set(flash.node, Math.max(boost.get(flash.node) ?? 0, strength))
    }
    return boost
  }

  private drawNodes(
    now: number,
    offsetX: number,
    offsetY: number,
    flashBoost: Map<GraphNode, number>,
    liveFade: number,
  ): void {
    const c = this.config
    const { ctx } = this
    for (const node of this.nodes) {
      const x = node.x + offsetX * node.depth
      const y = node.y + offsetY * node.depth
      const color = node.warm ? this.palette.warm : this.palette.ink
      const breathe = node.hub ? Math.sin(now / c.breathePeriodMs + node.phase) * c.breatheAmount : 0
      const boost = flashBoost.get(node) ?? 0
      const flashing = boost > FLASH_VISIBLE_THRESHOLD
      const baseAlpha = node.hub ? c.hubAlpha : c.nodeAlpha
      const alpha = Math.min(MAX_NODE_ALPHA, (baseAlpha + boost * FLASH_ALPHA_BOOST) * (flashing ? liveFade : this.scrollFade))
      const radius = node.radius + breathe + boost * FLASH_RADIUS_BOOST

      if (flashing) {
        ctx.shadowColor = `rgba(${color}, ${(GLOW_ALPHA * boost).toFixed(3)})`
        ctx.shadowBlur = FLASH_GLOW_PX * boost
      }
      ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      if (node.hub) {
        const ringAlpha = (c.hubRingAlpha + boost * FLASH_RING_BOOST) * this.scrollFade
        ctx.strokeStyle = `rgba(${color}, ${ringAlpha.toFixed(3)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, radius + c.hubRingGapPx, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  private drawRings(now: number, liveFade: number): void {
    const c = this.config
    const { ctx } = this
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i]
      // rAF timestamps can trail performance.now() slightly — clamp at zero.
      const t = Math.max(0, (now - ring.start) / c.burstRingDurationMs)
      if (t >= 1) {
        this.rings.splice(i, 1)
        continue
      }
      const radius = easeOutCubic(t) * c.burstRingRadiusPx
      const alpha = (1 - t) * c.burstRingAlpha * liveFade
      ctx.lineWidth = RING_LINE_WIDTH
      ctx.strokeStyle = `rgba(${this.palette.ink}, ${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = `rgba(${this.palette.ink}, ${(alpha * INNER_RING_ALPHA).toFixed(3)})`
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, radius * INNER_RING_SCALE, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  private drawPulses(
    list: Pulse[],
    now: number,
    offsetX: number,
    offsetY: number,
    fade: number,
    size: number,
    glow: number,
  ): void {
    const { ctx } = this
    for (let i = list.length - 1; i >= 0; i--) {
      const pulse = list[i]
      const t = (now - pulse.start) / pulse.duration
      if (t >= 1) {
        list.splice(i, 1)
        continue
      }
      if (t < 0) continue
      const eased = easeInOutQuad(t)
      const x = pulse.from.x + (pulse.to.x - pulse.from.x) * eased + offsetX * pulse.from.depth
      const y = pulse.from.y + (pulse.to.y - pulse.from.y) * eased + offsetY * pulse.from.depth
      const color = pulse.warm ? this.palette.warm : this.palette.ink
      const intensity = Math.sin(t * Math.PI) * fade
      ctx.fillStyle = `rgba(${color}, ${(PULSE_ALPHA * intensity).toFixed(3)})`
      ctx.shadowColor = `rgba(${color}, ${(GLOW_ALPHA * intensity).toFixed(3)})`
      ctx.shadowBlur = glow
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }
}

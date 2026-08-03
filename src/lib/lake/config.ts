export interface LakeConfig {
  /** Peak aurora contribution mixed over the base background, 0-1. */
  auroraOpacity: number
  /** Ambient (no-touch) aurora strength behind the reading column, relative to the margins. */
  dimFactor: number
  /** Ripple aurora strength behind the reading column — kept higher than dimFactor so a
   *  tap on top of a paragraph still feels responsive. */
  rippleDimFactor: number
  /** How long a ripple's visible life is, in seconds. */
  rippleLifetimeSec: number
  /** Ring frequency — higher reads as a tighter, more "droplet" ripple. */
  rippleFrequency: number
  /** Ripple buffer size. Oldest is evicted once full. */
  maxRipples: number
  /** Random interval range between unprompted ("it's alive") droplets, in seconds. */
  ambientDropletMinIntervalSec: number
  ambientDropletMaxIntervalSec: number
  /** Ambient droplets are fainter than a real tap. */
  ambientDropletStrength: number
  /** Caps how many ambient droplets can be alive at once, so the "calm" read holds. */
  maxAmbientDropletsAlive: number
  /** devicePixelRatio hard cap — a 3x phone screen quadruples fragment cost for no visible gain. */
  dprCap: number
  /** Soft frame-rate cap. Water is slow; this halves GPU work with no perceptible difference. */
  targetFps: number
  /** If the rolling average *draw-call* cost (JS-side wall time for uniform
   *  uploads + drawArrays submission — not the throttled inter-frame gap,
   *  which is dominated by the fps cap itself, not device performance)
   *  exceeds this for degradeWindowMs, drop quality. */
  degradeFrameBudgetMs: number
  degradeWindowMs: number
  /** Grace period after start() before frame-time samples count toward
   *  degradation — shader-compile/JIT warm-up can spike the first frame or
   *  two even on a healthy device. */
  warmupMs: number
  /** Canvas opacity fade-in on successful first frame, in ms. Also read by LakeBackground's
   *  inline style so the SCSS transition and this value never drift apart. */
  fadeInMs: number
  /** Feather width, in px, for the soft edge of the reading-column dim mask. */
  columnFeatherPx: number
  /** Number of fish drawn — small on purpose, this is a detail, not a school. */
  fishCount: number
  /** Baseline fish visibility, independent of auroraOpacity — fish are meant
   *  to read clearly as a detail, not be washed out by the water's own subtlety. */
  fishOpacity: number
  /** Exponential decay rate for the click-triggered fish flash — higher fades faster. */
  fishFlashDecaySec: number
}

/**
 * "Calm — a living lake." Every tunable number lives here so dialling the intensity
 * (e.g. down to "whisper") is a config edit, never a shader rewrite.
 */
export const LAKE_CONFIG: LakeConfig = {
  auroraOpacity: 0.1,
  dimFactor: 0.3,
  rippleDimFactor: 0.6,
  rippleLifetimeSec: 2.0,
  rippleFrequency: 18.0,
  maxRipples: 12,
  ambientDropletMinIntervalSec: 4,
  ambientDropletMaxIntervalSec: 9,
  ambientDropletStrength: 0.35,
  maxAmbientDropletsAlive: 2,
  dprCap: 1.75,
  targetFps: 30,
  degradeFrameBudgetMs: 24,
  degradeWindowMs: 2000,
  warmupMs: 1000,
  fadeInMs: 600,
  columnFeatherPx: 220,
  fishCount: 5,
  fishOpacity: 0.42,
  fishFlashDecaySec: 3.0,
}

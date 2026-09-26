/**
 * "A living architecture diagram." Nodes are services, links are connections,
 * pulses are data in flight. Behaviour is modelled on amitj.me's hero
 * constellation, re-drawn for a light cream canvas.
 *
 * Every tunable number lives here so the whole feel can be dialled up or down
 * with a config edit, never a renderer rewrite.
 */
export const CONSTELLATION_CONFIG = {
  /** devicePixelRatio cap — a 3x screen triples fill cost for no visible gain. */
  dprCap: 2,

  // --- node field ---------------------------------------------------------
  /** One node per this many square CSS pixels of viewport. */
  areaPerNode: 26000,
  minNodes: 24,
  maxNodesWide: 72,
  maxNodesNarrow: 34,
  /** Viewports narrower than this use maxNodesNarrow. */
  narrowViewportPx: 720,
  /** Nodes that start in the hero copy block are pushed right this often. */
  heroAvoidChance: 0.55,
  heroBlock: { maxX: 0.55, minY: 0.2, maxY: 0.75 },
  hubChance: 0.16,
  warmChance: 0.14,
  hubRadius: 2.2,
  nodeRadiusMin: 1.1,
  nodeRadiusJitter: 0.6,
  /** Nodes wrap around once this far outside the viewport. */
  wrapMarginPx: 20,

  // --- drift --------------------------------------------------------------
  initialSpeed: 0.12,
  damping: 0.985,
  /** Below this speed a node gets a tiny random nudge — never fully still. */
  minSpeed: 0.05,
  jitter: 0.02,
  /** Hub nodes breathe on this period (ms per radian). */
  breathePeriodMs: 1200,
  breatheAmount: 0.35,

  // --- links --------------------------------------------------------------
  linkDistancePx: 150,
  /** Alphas are pre-boosted for a light canvas: deep ink on cream carries
   *  less weight than glow on night. */
  edgeAlpha: 0.16,
  nodeAlpha: 0.4,
  hubAlpha: 0.62,
  hubRingAlpha: 0.22,
  hubRingGapPx: 3.5,

  // --- pointer ------------------------------------------------------------
  cursorDistancePx: 190,
  cursorLinkAlpha: 0.45,
  /** How strongly nodes lean toward the pointer. */
  cursorPull: 0.012,
  /** Pointer position easing per frame — the network follows, it doesn't snap. */
  pointerEase: 0.04,
  /** Max parallax offset (px) at the viewport edges, scaled by node depth. */
  parallaxX: 14,
  parallaxY: 10,

  // --- ambient pulses (data in flight) ------------------------------------
  pulseIntervalMs: 1100,
  maxAmbientPulses: 4,
  pulseDurationMinMs: 900,
  pulseDurationJitterMs: 700,
  pulseWarmChance: 0.25,
  pulseRadius: 1.6,
  pulseGlow: 8,

  // --- click / tap burst --------------------------------------------------
  burstDebounceMs: 140,
  hopMs: 110,
  maxHops: 6,
  maxBurstRings: 3,
  burstRingDurationMs: 900,
  burstRingRadiusPx: 260,
  burstRingAlpha: 0.28,
  flashLifetimeMs: 650,
  flashWidthMs: 260,
  sparkRadius: 1.9,
  sparkGlow: 10,
  maxFlashes: 200,
  maxSparks: 220,

  // --- scroll -------------------------------------------------------------
  /** Ambient layer fades to this floor as the visitor scrolls into content. */
  scrollFadeFloor: 0.25,
  scrollFadeRate: 0.6,
  /** Interactions stay at least this visible even when the ambient layer has faded. */
  liveFadeFloor: 0.55,

  /** Resize is debounced — re-seeding on every pixel of a drag is wasted work. */
  resizeDebounceMs: 150,
} as const

export type ConstellationConfig = typeof CONSTELLATION_CONFIG

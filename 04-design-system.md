# Design System

> Typography, colors, spacing, iconography, responsive rules, and styling conventions. Consult when changing visual design, adding components, or adjusting responsive behavior.
>
> **Updated 2026** for the mika re-skin. This file previously documented a warm-white/Playfair light theme that no longer exists — if you find guidance elsewhere in the repo referring to `#fafaf8`, Playfair Display, or "monochrome only", it is stale and this file wins.

## Design Philosophy

- **Dark, cinematic ground.** Deep navies stacked for subtle banding; warm gold reads as lamplight against cool blue-grey text.
- **Accents carry meaning, never decoration.** Gold = primary action / "this is mine". Blue = informational link. Nothing is coloured just to look colourful.
- **Typography-first** — engraved display face (Cinzel) for headings, readable body (Lato), monospace (JetBrains Mono) for data.
- **Whitespace** — generous vertical rhythm between sections.
- **Restrained UI motion** — 150ms micro, 240ms reveal. No confetti, no bounce, no scroll-triggered animation on content.
- **Ambient vs. UI motion (2026).** The background may breathe; the interface may not. Ambient motion (the lake) is slow — multi-second cycles, never signals state, never reacts to reading or scrolling. UI motion stays at the 150ms/240ms scale above. Ripples are the one deliberate exception: a direct, physical acknowledgement of touch, not a state signal. This is the line that keeps the ambient background from becoming a licence to animate everything — see [Ambient Background](#ambient-background) below.

## Color Palette (CSS Custom Properties in `globals.scss`)

### Backgrounds
| Variable | Value | Usage |
|---|---|---|
| `--bg-base` / `--color-bg` | `#0f1624` | Page background |
| `--bg-deep` | `#0a0f19` | Recessed surfaces — link chips, case options |
| `--bg-deepest` / `--color-cta-bg` | `#0a0f18` | Contact section, text on gold buttons |
| `--surface-raised` / `--color-surface` | `#151e30` | Raised panels — case files, stack tags |
| `--surface-tab` | `#394a65` | Reserved (tab-active from the source system) |

### Text
| Variable | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#f1f1f1` | Headings, emphasis |
| `--color-text-secondary` | `#b3c0d5` | Body copy, bullets |
| `--color-text-muted` | `#7989a3` | Labels, meta, notes. **5.14:1 on `--bg-base`** — passes AA, but it is the weakest token: never use it alone to signal interactivity |
| `--color-text-info` | `#d0e4ff` | Reserved |

### Rules & accents
| Variable | Value | Usage |
|---|---|---|
| `--color-rule` | `#27334a` | Hairline dividers, default borders |
| `--color-rule-strong` | `#506380` | Emphasised/selected borders |
| `--accent-gold` | `#ffc857` | Primary CTA fill, focus ring, "the product I built" |
| `--accent-gold-hover` | `#ffd479` | Gold hover |
| `--accent-gold-deep` | `#c7a740` | Bullet markers, avatar rings, chip hover borders |
| `--accent-orange` | `#f46b29` | Reserved (logo accent in the source system) |
| `--link` / `--link-hover` | `#5cbbff` / `#7cc8ff` | Informational/utility link hovers |
| `--accent-violet` | `#8088ff` | Ambient background only — the aurora ramp's midpoint. From the original mika palette (Discord/community accent), not invented |

## Typography

| Variable | Font | Weights | Usage |
|---|---|---|---|
| `--font-lato` → `--font-body` | Lato | 300, 400, 700 | Body, nav, chips, buttons |
| `--font-cinzel` → `--font-display` | Cinzel | 400, 700 | Headings, gold button labels (engraved substitute for Copperplate Gothic) |
| `--font-jetbrains` → `--font-mono` | JetBrains Mono | 400 | Stack tags, dates, progress chip |

### Type Scale
| Element | Size | Font |
|---|---|---|
| Name (intro) | `clamp(40px, 6vw, 64px)` | Cinzel |
| Section headings | `clamp(24px, 3.5vw, 38px)` | Cinzel |
| Card titles | `clamp(20px, 2.8vw, 28px)` | Cinzel |
| Body | 17px | Lato |
| Bullets / chips | 14–16px | Lato |
| Section & group labels | 11px, uppercase, letter-spacing `0.12em` | Lato |
| Stack tags, dates | 12px | JetBrains Mono |

Line heights: body 1.75, bullets 1.7, headings ~1.3.

## Iconography

The site was text-only until 2026; icons now exist but the bar is high — **an icon must add meaning a label can't**, e.g. "this link is source code."

- **Line icons only** — Lucide geometry, `strokeWidth 1.75`, rounded joins, `stroke="currentColor"` so they inherit hover states.
- **Inline SVG, never a dependency or CDN.** This is a static export with no external asset requests; see `src/components/ui/icons.tsx`.
- Always `aria-hidden="true"` + `focusable="false"` — the adjacent text label carries all meaning.
- Current set: `ExternalIcon` (arrow-up-right), `GithubIcon`.
- **Still avoided:** tech-stack logo grids, decorative flourishes, emoji as UI.

## Spacing & Radii

| Variable | Value |
|---|---|
| `--section-padding` / mobile | 96px / 64px |
| `--max-width-reading` | 720px |
| `--max-width-hero` | 900px |
| `--header-height` | 72px |
| `--radius-xs` / `-sm` / `-md` / `-pill` | 2 / 4 / 8 / 28px |

Base unit 8px. Nothing is heavily rounded.

## Interaction & Accessibility

- **Focus:** a global `:focus-visible` gold outline (2px, 2px offset) lives in `globals.scss` — component styles must not remove it.
- **Motion:** a global `prefers-reduced-motion` block collapses all transitions/animations. New components need no extra handling.
- **Tap targets:** interactive elements are ≥44px tall. Small muted text is not a tap target.
- **Interactivity must be signalled by more than colour** — a border, an icon, or an underline. `--color-text-muted` text with only a hover colour change reads as metadata, which is exactly the bug `ResourceLinks` was built to fix.

## Styling Pattern: CSS Modules

Every component has a paired `*.module.scss`; camelCase class names; nested `&` selectors; media queries at the bottom of the file.

Shared typography (e.g. the 11px uppercase label) is intentionally **duplicated locally** rather than imported across modules — cross-module class overrides in CSS Modules depend on stylesheet import order and are fragile. This matches the existing per-card duplication of `.cardTag`.

## Responsive Design

- **Single breakpoint: 640px** (plus 480px for hiding the case-progress chip).
- Desktop: side-by-side header/meta, wrapping chip rows.
- Mobile: single column, 24px horizontal padding, stacked card headers.
- Fluid type via `clamp()`.

## Ambient Background

A single fixed WebGL layer (`LakeBackground`) sits behind the whole page — calm flowing "water," a handful of small fish drifting through it, and an aurora-coloured ripple wherever the visitor clicks or taps. Purely atmospheric: no particle systems, no geometric shapes, nothing that competes for attention with the content sitting on top of it.

- **Intensity is "calm," not "immersive."** ~10% peak aurora opacity, slow drift (time coefficients in the 0.01–0.02 range inside the noise field — this specific range is what reads as calm rather than a lava lamp). Every tunable number lives in `LAKE_CONFIG` (`src/lib/lake/config.ts`) — dialling the whole feel down is a config edit, never a shader rewrite.
- **Palette is the aurora ramp above** (`--bg-base → --link → --accent-violet → --accent-gold`), plus `--accent-aurora-green` reserved for one thing only: the fish flash below. No colours exist here that don't carry meaning.
- **Fish (2026).** `LAKE_CONFIG.fishCount` (5) small silhouettes, each following its own slow Lissajous-style wander, computed per-frame in JS and uploaded as a compact uniform array — not per-pixel shader math, to keep the fragment cost down. They render as a dim shadow of the water at rest. **Any click or tap on the background — the water or a fish — flashes every fish bright `--accent-aurora-green` together**, decaying over ~2 seconds (`fishFlashDecaySec`). One shared trigger (`LakeRenderer.triggerFishFlash()`), fired from the exact same click handler and interactive-element guard as ripples — a click on a nav link or the CV button never triggers it, same as it never triggers a ripple.
- **Auto-dim under the reading column.** The aurora — and the fish — are measurably darker behind `--max-width-reading` than in the margins, because the ambient effect must never threaten `--color-text-muted`'s already-thin 5.14:1 contrast margin. This is a hard, calculated luminance ceiling, not a visual judgement call — see the renderer's `readDesignTokens()`/`resize()` for the mask math.
- **Ripples never fire on interactive elements** (`a`, `button`, `input`, `summary`, `details`, `[role="button"]`) — otherwise every nav click and CV download would ripple, turning a delight into noise competing with the UI.
- **Reduced motion is a hard branch, not a slowdown.** `prefers-reduced-motion: reduce` renders one static frame; no ripples, no drift, no fish, live-watched via `useReducedMotion` in case the OS setting changes mid-session.
- **Degrades to nothing broken.** No WebGL, a lost context, or a rolling average frame cost that's genuinely too slow all fall back to a static CSS gradient in the same palette — never a blank or broken-looking page. That average is measured from the draw call's own JS-side wall time (`performance.now()` around uniform uploads + `drawArrays`), *not* the gap between throttled frames — an earlier version measured the wrong thing and the fps cap itself guaranteed that gap would always look "too slow," causing the whole background to give up on a fixed ~4-second timer on every device, unconditionally. Fixed 2026; if you touch the render loop again, keep those two measurements separate.

## Signature Components

| Element | Style |
|---|---|
| Ambient background (`LakeBackground`) | Fixed, `z-index: 0`, WebGL flow field + aurora ripples, CSS-gradient fallback beneath |
| Header (scrolled) | Fixed, `rgba(10,15,25,0.9)` + `blur(10px)`, 1px bottom rule |
| Primary CTA | Solid gold, Cinzel uppercase label, dark text, `--radius-md`, inset white bloom |
| Link chip (`ResourceLinks`) | Bordered, icon + label + optional note, 44px min-height, gold border on hover |
| Case file (`CaseFile`) | `--surface-raised` panel, gold kicker, option buttons on `--bg-deep` |
| Stack tag | `--surface-raised` pill, 1px rule, 12px mono |
| Bullets | Custom 6px gold-deep dash marker, not a disc |
| Avatars | Circular, 2px `--accent-gold-deep` ring |

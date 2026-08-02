# Design System

> Typography, colors, spacing, iconography, responsive rules, and styling conventions. Consult when changing visual design, adding components, or adjusting responsive behavior.
>
> **Updated 2026** for the mika re-skin. This file previously documented a warm-white/Playfair light theme that no longer exists — if you find guidance elsewhere in the repo referring to `#fafaf8`, Playfair Display, or "monochrome only", it is stale and this file wins.

## Design Philosophy

- **Dark, cinematic ground.** Deep navies stacked for subtle banding; warm gold reads as lamplight against cool blue-grey text.
- **Accents carry meaning, never decoration.** Gold = primary action / "this is mine". Blue = informational link. Nothing is coloured just to look colourful.
- **Typography-first** — engraved display face (Cinzel) for headings, readable body (Lato), monospace (JetBrains Mono) for data.
- **Whitespace** — generous vertical rhythm between sections.
- **Restrained motion** — 150ms micro, 240ms reveal. No confetti, no bounce, no scroll animation.

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

## Signature Components

| Element | Style |
|---|---|
| Header (scrolled) | Fixed, `rgba(10,15,25,0.9)` + `blur(10px)`, 1px bottom rule |
| Primary CTA | Solid gold, Cinzel uppercase label, dark text, `--radius-md`, inset white bloom |
| Link chip (`ResourceLinks`) | Bordered, icon + label + optional note, 44px min-height, gold border on hover |
| Case file (`CaseFile`) | `--surface-raised` panel, gold kicker, option buttons on `--bg-deep` |
| Stack tag | `--surface-raised` pill, 1px rule, 12px mono |
| Bullets | Custom 6px gold-deep dash marker, not a disc |
| Avatars | Circular, 2px `--accent-gold-deep` ring |

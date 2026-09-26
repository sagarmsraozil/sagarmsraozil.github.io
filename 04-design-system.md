# Design System

> Typography, colors, spacing, elevation, responsive rules, and the ambient background. Consult when changing visual design, adding components, or adjusting responsive behavior.
>
> **Updated Sept 2026 — the Starbucks re-skin.** The site now follows the Starbucks design system, fetched with `npx getdesign@latest add starbucks` into [`DESIGN.md`](./DESIGN.md). `DESIGN.md` is the **upstream reference**, left as published; **this file is how the site adapts it**, and wins wherever the two differ. Anything elsewhere in the repo that mentions navy `#0f1624`, gold-as-primary, Cinzel, Lato, JetBrains Mono, the lake, fish or aurora is stale.

## Design Philosophy

- **Warm, confident, legible.** A cream canvas (`#f2f0eb`) instead of cold white, white cards on top, and dark House Green bands as colour-block bookends. It should read like clean café signage: never shouting.
- **Four greens, four jobs.** Starbucks Green names things (headings, company and project names). Green Accent is the thing you press (CTAs, links, focus). House Green is the dark band. Green Light is a quiet fill (tags, avatars, selection). Picking "one brand green" everywhere flattens the system.
- **Gold is ceremony, not decoration.** It appears only as the constellation's warm nodes and the `--gold-lightest` note surface. Never as text: `#cba258` on white is ~2.2:1.
- **One typeface.** Manrope everywhere, tight tracking (`-0.01em`). Hierarchy comes from **weight and colour**, not big size jumps. No serif, no mono.
- **Pills and cards.** Every button is a 50px full pill that compresses to `scale(0.95)` on press. Every content container is a 12px-radius white card with a whisper-soft layered shadow.
- **Whitespace, not dividers.** Sections are separated by space and colour-block changes. Hairlines only appear *inside* cards.
- **Ambient vs. UI motion.** The background may move; the interface may not. UI motion stays at 0.2s button transitions and a 0.3s modal ease-out. See [Ambient Background](#ambient-background).

## Color Palette (CSS custom properties in `globals.scss`)

### Surfaces
| Variable | Value | Usage |
|---|---|---|
| `--canvas` | `#f2f0eb` | Page canvas (Starbucks "Neutral Warm") |
| `--canvas-ceramic` | `#edebe9` | Recessed wash — CV iframe backdrop |
| `--surface` | `#ffffff` | Cards, modal, scrolled header, mobile drawer |
| `--surface-cool` | `#f9f9f9` | Reserved (quiet utility surface) |

### Greens
| Variable | Value | Usage |
|---|---|---|
| `--green-starbucks` | `#006241` | Hero name, company/project/institution names, section eyebrows, constellation ink |
| `--green-accent` | `#00754a` | Primary pill fill, outlined pills, link chips, bullet dots, focus ring |
| `--green-house` | `#1e3932` | AI feature band, contact/footer band, brand wordmark |
| `--green-uplift` | `#2b5148` | Hover fill for outlined pills on House Green |
| `--green-light` | `#d4e9e2` | Stack tags, avatar fill, work-rights pill, `::selection`, eyebrows on dark bands |

### Gold
| Variable | Value | Usage |
|---|---|---|
| `--gold` | `#cba258` | Constellation warm nodes and pulses only |
| `--gold-light` | `#dfc49d` | Reserved |
| `--gold-lightest` | `#faf6ee` | "Private repo" code-note surface in project cards; background warm glow |

### Text & rules
| Variable | Value | Usage |
|---|---|---|
| `--text` | `rgba(0,0,0,0.87)` | Headings and body — never pure black on the warm canvas |
| `--text-soft` | `rgba(0,0,0,0.58)` | Meta, product lines, tags. ~5.1:1 on `--canvas`, ~5.3:1 on white — passes AA at every size used |
| `--text-on-dark` | `#ffffff` | Headings/links on House Green |
| `--text-on-dark-soft` | `rgba(255,255,255,0.7)` | Body copy on House Green |
| `--rule` | `rgba(0,0,0,0.1)` | Hairlines inside cards |
| `--rule-strong` | `#d6dbde` | Resting underline on contact links |
| `--rule-on-dark` | `rgba(255,255,255,0.2)` | Footer divider, resting social-link underline |

## Typography

Manrope (Google Fonts via `next/font`, variable weight) stands in for Starbucks' proprietary **SoDoSans** — DESIGN.md lists Inter, Manrope and Nunito Sans as substitutes; Manrope was chosen for its rounder, friendlier geometry. Token: `--font-body`. Global `letter-spacing: var(--tracking)` (`-0.01em`).

| Element | Size / weight | Colour |
|---|---|---|
| Hero name | `clamp(44px, 7vw, 80px)` / 800, `-0.02em` | `--green-starbucks` |
| Hero title | `clamp(19px, 2.2vw, 24px)` / 600 | `--text` |
| Section heading (`section-heading` mixin) | `clamp(28px, 3.6vw, 40px)` / 700 | `--text` (white on bands) |
| Card title | `clamp(22px, 2.6vw, 26px)` / 700 | `--green-starbucks` |
| Body (summary, bands) | 18px / 400, line-height 1.75 | `--text` / `--text-on-dark-soft` |
| Bullets | 16px / 400, line-height 1.65 | `--text` |
| Eyebrow (`eyebrow` mixin) | 13px / 700, uppercase, `0.15em` | `--green-starbucks` |
| Card tags, group labels | 12px / 700, uppercase, `0.1em` | `--text-soft` |
| Dates | 14px / 600, `tabular-nums` | `--text` |

Dates use `font-variant-numeric: tabular-nums` instead of a monospace face.

## Components

Shared primitives live as Sass mixins in `src/styles/_mixins.scss` (see [08-sass-styling-guide.md](./08-sass-styling-guide.md)).

| Element | Style |
|---|---|
| Primary pill (`pill` + `pill-filled`) | Green Accent fill, white 16px/600 label, 50px radius, ≥44px tall, `scale(0.95)` on press. Hover deepens to Starbucks Green |
| Outlined pill (`pill` + `pill-outlined`) | Transparent, Green Accent border and label. Header CV, Download CV, reference LinkedIn |
| Inverted pill (`pill-inverted`) | White fill, Green Accent label — the primary action on House Green (contact Download CV) |
| Card (`card`) | White, 12px radius, `--shadow-card`. Experience, projects, skills, education, references |
| Link chip (`ResourceLinks`) | Outlined pill with icon + label + optional second-line note, 44px min height |
| Stack tag | `--green-light` pill, House Green 13px/600 |
| Bullets | 6px Green Accent dot |
| Code note | `--gold-lightest` panel, 4px radius, soft text, underlined Green Accent link |
| Header | Transparent at top; white + `--shadow-nav` once scrolled or when the mobile drawer is open |
| House band (`house-band`) | `--green-house`, white type, eyebrow in `--green-light`, focus ring switched to white |
| Avatars | Circular. Photo: 6px white border + `--shadow-float`. Reference initials: `--green-light` fill, House Green text |
| CV modal | White, 12px radius, `--shadow-float`, 50% black overlay, 0.3s `cubic-bezier(0.25,0.46,0.45,0.94)` entrance |

## Spacing, Radii, Elevation

| Variable | Value |
|---|---|
| `--section-padding` / `-mobile` | 64px / 48px |
| `--gutter` / `--gutter-mobile` | 40px / 16px (Starbucks outer gutters) |
| `--max-width-reading` | 720px |
| `--max-width-hero` | 900px |
| `--header-height` | 72px (also `scroll-padding-top`, so anchors land below the fixed header) |
| `--radius-input` / `-card` / `-pill` | 4 / 12 / 50px |
| `--shadow-card` | `0 0 0.5px rgba(0,0,0,.14), 0 1px 1px rgba(0,0,0,.24)` |
| `--shadow-nav` | three-layer soft lift on the scrolled header |
| `--shadow-float` | `0 0 6px rgba(0,0,0,.24), 0 8px 12px rgba(0,0,0,.14)` — photo and modal only |

Shadows are always 2–3 stacked low-alpha layers, never one heavy drop.

## Page Rhythm

Cream hero (constellation at full strength) → cream sections with white cards → **House Green AI band** → cream education/references → **House Green contact/footer band**. The two dark bands are opaque on purpose: the constellation stops at their edges, which is what makes them read as colour blocks.

## Interaction & Accessibility

- **Focus:** global `:focus-visible` Green Accent outline (2px, 2px offset). The `house-band` mixin switches it to white inside dark bands. Component styles must not remove it.
- **Motion:** a global `prefers-reduced-motion` block collapses all transitions/animations; the background has its own hard branch (below).
- **Tap targets:** every pill and link chip is ≥44px tall (36px for the `small` pill variant in the desktop header and reference rows, which sit in 44px+ rows).
- **Interactivity is signalled by more than colour:** pills have borders or fills, text links are underlined.

## Responsive Design

- **Single breakpoint: 640px.** Below it: 16px gutters, card padding drops to 20–24px, card headers stack, hero pills go full-width, nav collapses to a hamburger drawer.
- Earlier-projects cards are a 2-up grid on desktop, 1-up on mobile.
- Fluid type via `clamp()`.

## Ambient Background

A single fixed 2D-canvas layer (`ConstellationBackground`) behind the whole page: a **living architecture diagram** whose design is taken from [amitj.me](https://amitj.me/). Nodes are services, links are connections, pulses are data in flight. It is a fresh implementation in this repo's patterns, not a copy of that site's script.

- **Palette:** `--constellation-ink` (→ Starbucks Green) for nodes, links, rings; `--constellation-warm` (→ Gold) for ~14% of nodes and ~25% of pulses. The renderer reads both tokens at mount, so `globals.scss` stays the single source of truth. Alphas are pre-boosted for a light canvas (deep ink on cream carries less weight than glow on night).
- **Behaviour:** nodes drift and wrap; any two within 150px are linked with distance-faded lines; hubs breathe and carry a ring; an ambient pulse travels a link roughly every 1.1s.
- **Pointer (fine pointers only):** the cursor joins the network (links drawn to nodes within 190px), nodes lean gently toward it, and the whole field parallaxes by depth.
- **Click / tap:** a shockwave ring plus a chain reaction that propagates hop-by-hop (up to 6 hops, 110ms per hop) through the current graph, flashing each node it reaches. **Never fires on interactive elements or the CV dialog** — nav clicks and downloads must not burst.
- **Scroll fade:** the ambient layer fades to 25% as you scroll into content, so it never competes with reading; interactions stay at least 55% visible.
- **Hero readability:** seeding pushes ~55% of nodes that land in the hero copy block (left-centre) to the right half.
- **Behind the network:** two soft radial glows on the wrapper (mint top-right, warm cream bottom-left). This is the only gradient on the site, confined to the ambient layer; surfaces stay solid colour-block per DESIGN.md. It is also the whole background when there is no JS or no 2D context.
- **Reduced motion is a hard branch, not a slowdown:** one static frame, no drift, no pointer, no bursts, watched live via `useReducedMotion`.
- **Tuning:** every number lives in `CONSTELLATION_CONFIG` (`src/lib/constellation/config.ts`). Changing the feel is a config edit, never a renderer rewrite.

# Design System

> Typography, colors, spacing, responsive rules, and styling conventions. Consult when changing visual design, adding components, or adjusting responsive behavior.

## Design Philosophy

- **Monochromatic restraint** — no color accents. Confidence in simplicity.
- **Typography-first** — serif headlines (Playfair), readable body (Lato), monospace for data (JetBrains Mono).
- **Whitespace** — generous margins and breathing room between sections.
- **Hierarchy via typography and layout**, not color.
- **No decorative elements** — no scroll animations, particle effects, skill bars, or project screenshots.

## Color Palette (CSS Custom Properties in `globals.scss`)

| Variable | Value | Usage |
|---|---|---|
| `--color-bg` | `#fafaf8` | Warm white page background |
| `--color-surface` | `#f2f1ee` | Card/surface background, tag pills |
| `--color-text-primary` | `#111111` | Headings, primary text |
| `--color-text-secondary` | `#555555` | Body text, subheadings |
| `--color-text-muted` | `#888888` | Labels, tags, tertiary info |
| `--color-rule` | `#dddddd` | Thin dividers, borders |
| `--color-cta-bg` | `#111111` | CTA section dark background |
| `--color-cta-text` | `#fafaf8` | Light text on CTA background |

## Typography

### Font Families (loaded via `next/font` in `layout.tsx`)

| Variable | Font | Weights | Usage |
|---|---|---|---|
| `--font-lato` → `--font-body` | Lato | 300, 400, 700 | Body text, navigation |
| `--font-playfair` → `--font-display` | Playfair Display | 400, 700 | Hero headline, section headings, case study titles |
| `--font-jetbrains` → `--font-mono` | JetBrains Mono | 400 | Stack tags, skill items, monospace elements |

### Type Scale (fluid, using `clamp()`)

| Element | Size | Font |
|---|---|---|
| Hero headline | `clamp(36px, 5.5vw, 60px)` | Playfair Display |
| Section headings | `clamp(24px, 3.5vw, 38px)` | Playfair Display |
| Case study titles | `clamp(20px, 2.8vw, 28px)` | Playfair Display |
| Body text | 17px fixed | Lato |
| Section labels | 11-12px, small caps, letter-spacing +100 | Lato |
| Stack/skill tags | 12px | JetBrains Mono |
| Navigation | 14-15px | Lato |

### Line Heights
- Body: 1.75
- Headings: ~1.3
- Paragraph spacing: 1em between paragraphs

## Spacing

| Variable | Value | Mobile |
|---|---|---|
| `--section-padding` | 96px | 64px (`--section-padding-mobile`) |
| `--max-width-reading` | 720px | — |
| `--max-width-hero` | 900px | — |
| `--header-height` | 72px | — |
| Base unit | 8px | — |

## Responsive Design

- **Single breakpoint**: 640px (mobile/tablet split)
- **Desktop**: 2-column layouts, full spacing, side-by-side elements
- **Mobile**: Single-column, reduced padding (24px horizontal instead of 32px), `flex-direction: column`
- **Fluid type**: `clamp()` scales smoothly between breakpoints

## Styling Pattern: CSS Modules

Every component has a paired `*.module.scss` file:

```tsx
import styles from './ComponentName.module.scss'
// Usage: className={styles.className}
```

### Naming Convention
- camelCase class names: `.heroSection`, `.heroHeadline`, `.heroInner`
- Nested selectors via SCSS `&` syntax
- Media queries at bottom of each module file

## Special Visual Components

| Element | Style |
|---|---|
| Header (scrolled) | Fixed position, `backdrop-filter: blur(8px)`, 1px bottom border |
| CVModal | Overlay with `backdrop-filter: blur(4px)`, centered iframe |
| Section labels | Small caps, muted color, letter-spacing +100, above headings |
| Stack tags | Light grey pill (`--color-surface` bg), monospace, 12px |
| About avatar | 120px circle, initials "SM" when no photo |
| Reference avatars | 44px circle, computed initials from names |
| CTA section | Dark background (`#111111`), light text, email as text link with arrow |

## What This Design Intentionally Avoids

- No color accents — monochrome only
- No animations on scroll — everything visible on load
- No project screenshots — writing does the work
- No skill bars/radar charts — text-only skills section
- No tech stack logo grid — text with dot separators
- No testimonials section — references listed simply
- No contact form — direct email link
- No "download CV" in hero — positioned as a nav item instead

## Global Reset (in `globals.scss`)

```scss
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background-color: var(--color-bg); font-family: var(--font-body); font-size: 17px; line-height: 1.75; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
```

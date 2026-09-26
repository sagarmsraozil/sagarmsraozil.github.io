# Sass & Styling Guide

> How styles are structured in this project: CSS Modules with SCSS, design tokens as custom properties, modern Sass patterns. Consult when writing new component styles or modifying the visual system.

## Styling Architecture

```
globals.scss            — CSS custom properties (design tokens), reset, base styles
src/styles/_mixins.scss — shared component primitives as Sass mixins (pill, card, eyebrow, section, …)
*.module.scss           — Per-component scoped styles (CSS Modules)
```

- **CSS custom properties** for anything that changes at runtime or is shared across components
- **SCSS** for compile-time helpers: nesting, math, variables within a module
- **CSS Modules** for scoping: each component imports its own `*.module.scss`

## How to Style a Component

```tsx
// MyComponent.tsx
import styles from './MyComponent.module.scss'

export function MyComponent() {
  return <div className={styles.myComponent}>...</div>
}
```

```scss
// MyComponent.module.scss
@use '../../styles/mixins' as *;

.myComponent {
  @include section;       // section padding + gutters, mobile included
}

.myComponentInner {
  max-width: var(--max-width-reading);
  margin: 0 auto;
}
```

### Naming Convention
- camelCase class names in SCSS modules: `.heroSection`, `.heroHeadline`, `.ctaInner`
- Nested selectors via SCSS `&`: `&Scrolled`, `&Open`
- Media queries at the bottom of each module file

## Design Tokens (from `globals.scss`)

The full table, with what each token is *for*, lives in [04-design-system.md](./04-design-system.md). The groups:

```scss
// surfaces
--canvas, --canvas-ceramic, --surface, --surface-cool
// the four greens (one job each) + gold
--green-starbucks, --green-accent, --green-house, --green-uplift, --green-light
--gold, --gold-light, --gold-lightest
// text & rules
--text, --text-soft, --text-on-dark, --text-on-dark-soft
--rule, --rule-strong, --rule-on-dark
// radii, elevation, motion
--radius-input (4px), --radius-card (12px), --radius-pill (50px)
--shadow-card, --shadow-nav, --shadow-float
--press-scale (0.95), --duration-button (0.2s)
// type & layout
--font-body (Manrope), --tracking (-0.01em), --tracking-caps, --tracking-caps-loose
--section-padding, --section-padding-mobile, --gutter, --gutter-mobile
--max-width-reading, --max-width-hero, --header-height
// ambient background (read at runtime by the canvas renderer)
--constellation-ink, --constellation-warm
```

Never re-type a token's hex in a module. For a tinted variant, mix the token:
`color-mix(in srgb, var(--green-accent) 6%, transparent)`.

## Shared Mixins (`src/styles/_mixins.scss`)

Pulled out once a pattern hit its third copy (WET-then-DRY). Mixins rather than global classes, so each module still owns its selector and CSS Modules scoping/stylesheet order stay irrelevant.

| Mixin | Emits |
|---|---|
| `pill($size: default \| small)` | Full-pill shape, 44px (36px small) min height, 600 label, `scale(var(--press-scale))` on `:active` |
| `pill-filled` / `pill-outlined` | Green Accent fill / Green Accent outline — for light surfaces |
| `pill-inverted` / `pill-outlined-on-dark` | White fill + green label / white outline — for House Green bands |
| `card` | White surface, 12px radius, `--shadow-card` |
| `eyebrow` | 13px/700 uppercase, `0.15em`, Starbucks Green |
| `section` | Section padding + gutters, with the 640px mobile override built in |
| `section-heading` | `clamp(28px, 3.6vw, 40px)` / 700 section headline |
| `house-band` | House Green background, white text, white focus ring |

Always pair `pill` with one colour mixin:

```scss
.introActionPrimary {
  @include pill;
  @include pill-filled;
}
```

**Overriding a shared component's colour from a parent** (e.g. `SectionLabel` on a dark band): use a two-class selector in the parent module (`.ai .aiLabel { color: … }`). A single-class override would depend on stylesheet import order.

## Responsive Pattern

**Single breakpoint at 640px:**

```scss
.component {
  display: flex;
  gap: 32px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
}
```

**Fluid typography with `clamp()`:**

```scss
.heading {
  font-size: clamp(22px, 2.6vw, 26px);
  font-weight: 700;
}
```

## Common Patterns in This Codebase

### Section Container
```scss
.section {
  @include section;
}

.sectionInner {
  max-width: var(--max-width-reading);
  margin: 0 auto;
}
```

### Section Label (SectionLabel component)
```scss
.sectionLabel {
  @include eyebrow;
  margin-bottom: 12px;
}
```

### Stack Tag (StackTag component)
```scss
.stackTag {
  font-size: 13px;
  font-weight: 600;
  color: var(--green-house);
  background-color: var(--green-light);
  padding: 3px 12px;
  border-radius: var(--radius-pill);
}
```

### Card Layout
```scss
.card {
  @include card;
  padding: 32px;          // 24px 20px below 640px
}
```

## Modern Sass Practices (for future reference)

### Use `@use` / `@forward` (not `@import`)
```scss
@use 'sass:math';
@use 'sass:color';
```

### Use `math.div()` for division
```scss
// Not: $x / $y
// Use: math.div($x, $y)
```

### Use logical properties for RTL-readiness
```scss
// Instead of: margin-left / margin-right
margin-inline-start: 16px;
padding-inline: 24px;
```

### Use container queries for component-level responsiveness
```scss
.card {
  container-type: inline-size;

  @container (min-width: 30em) {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

## Layout Primitives (for future components)

### Stack (vertical rhythm)
```scss
.stack { display: flex; flex-direction: column; gap: var(--gap, 16px); }
```

### Cluster (wrapping horizontal)
```scss
.cluster { display: flex; flex-wrap: wrap; gap: var(--gap, 12px); align-items: center; }
```

### Grid (responsive auto-fill)
```scss
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
}
```

## Checklist for New Component Styles

- [ ] Create `ComponentName.module.scss` next to the component
- [ ] Use design tokens (CSS custom properties) for colors, fonts, spacing
- [ ] Add responsive styles at `@media (max-width: 640px)`
- [ ] Use `clamp()` for fluid typography
- [ ] Use `var(--max-width-reading)` for content width
- [ ] Use `@include section` for section spacing and `@include card` / `pill` for containers and buttons
- [ ] Never re-type a token's hex; `color-mix()` the token for tints
- [ ] Keep class names camelCase

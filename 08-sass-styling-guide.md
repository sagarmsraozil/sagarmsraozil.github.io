# Sass & Styling Guide

> How styles are structured in this project: CSS Modules with SCSS, design tokens as custom properties, modern Sass patterns. Consult when writing new component styles or modifying the visual system.

## Styling Architecture

```
globals.scss         — CSS custom properties (design tokens), reset, base styles
*.module.scss        — Per-component scoped styles (CSS Modules)
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
.myComponent {
  max-width: var(--max-width-reading);
  margin: 0 auto;
  padding: var(--section-padding) 32px;

  @media (max-width: 640px) {
    padding: var(--section-padding-mobile) 24px;
  }
}
```

### Naming Convention
- camelCase class names in SCSS modules: `.heroSection`, `.heroHeadline`, `.ctaInner`
- Nested selectors via SCSS `&`: `&Scrolled`, `&Open`
- Media queries at the bottom of each module file

## Design Tokens (from `globals.scss`)

### Colors
```scss
--color-bg:              #fafaf8     // Warm white background
--color-surface:         #f2f1ee     // Cards, tag pills
--color-text-primary:    #111111     // Headings, primary
--color-text-secondary:  #555555     // Body text
--color-text-muted:      #888888     // Labels, tertiary
--color-rule:            #dddddd     // Dividers, borders
--color-cta-bg:          #111111     // CTA section background
--color-cta-text:        #fafaf8     // CTA section text
```

### Typography
```scss
--font-body:     var(--font-lato), -apple-system, BlinkMacSystemFont, sans-serif
--font-display:  var(--font-playfair), Georgia, 'Times New Roman', serif
--font-mono:     var(--font-jetbrains), 'Courier New', monospace
```

### Spacing
```scss
--section-padding:        96px       // Desktop section vertical padding
--section-padding-mobile: 64px       // Mobile section vertical padding
--max-width-reading:      720px      // Reading column max width
--max-width-hero:         900px      // Hero section max width
--header-height:          72px       // Fixed header height
```

## Responsive Pattern

**Single breakpoint at 640px:**

```scss
.component {
  display: flex;
  gap: 32px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    padding: var(--section-padding-mobile) 24px;
  }
}
```

**Fluid typography with `clamp()`:**

```scss
.heading {
  font-size: clamp(24px, 3.5vw, 38px);
  font-family: var(--font-display);
}
```

## Common Patterns in This Codebase

### Section Container
```scss
.section {
  max-width: var(--max-width-reading);
  margin: 0 auto;
  padding: var(--section-padding) 32px;

  @media (max-width: 640px) {
    padding: var(--section-padding-mobile) 24px;
  }
}
```

### Section Label (SectionLabel component)
```scss
.label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

### Stack Tag (StackTag component)
```scss
.tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: 2px 8px;
  border-radius: 4px;
}
```

### Card Layout
```scss
.card {
  border-top: 1px solid var(--color-rule);
  padding-top: 32px;
  margin-top: 32px;
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
- [ ] Use `var(--section-padding)` for section spacing
- [ ] Keep class names camelCase

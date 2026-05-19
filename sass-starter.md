# Modern Sass Starter — SMACSS reborn

> Modernisation of `sshikhrakar/Sass-Starter` (last 2016-era; Bootstrap-grid floats, `@import` everywhere, Node 12). This file documents an updated architecture: Sass modules (`@use`/`@forward`), Flexbox + CSS Grid (no floats), modern Sass features (`math.div`, `color.adjust`), CSS custom properties, container queries, logical properties. Cross-refs: [09-frontend-system-design.md](./09-frontend-system-design.md).

## The two architectures: original vs modernised

### Original (legacy)
- SMACSS folder structure (`base/`, `layout/`, `module/`, `state/`, `theme/`).
- BEM mixins.
- `@import` chains.
- **Bootstrap grid** based on `float` and clearfix.
- Print CSS, Normalize.
- BrowserSync for live reload.

### Modernised (this guide)
- Same SMACSS folder structure (still a fine organising principle).
- Sass modules: `@use` / `@forward` with namespaces.
- **Flexbox + CSS Grid** for layout. No `float`, no clearfix.
- CSS custom properties as the design-token API; SCSS for compile-time helpers (math, mixins, loops).
- **Modern Sass APIs**: `sass:math`, `sass:color`, `sass:list`, `sass:map`, `sass:string`, `sass:meta`. `@import` is deprecated.
- Logical properties (`margin-inline`, `padding-block`) for RTL-ready layouts.
- Container queries (`@container`) for component-level responsiveness.
- Vite (or PostCSS + autoprefixer + cssnano) instead of legacy gulp/BrowserSync.

## Why Sass at all in 2026?

CSS has caught up on a lot (nesting, custom properties, `color-mix()`, `@container`). Sass still adds value for:

- **Compile-time mathematics** on tokens (`math.div`, ratios, modular type scales).
- **Loops** and **maps** when generating utility classes or theme variants.
- **Mixins** with logic (e.g. fluid type, responsive helpers, focus rings).
- **Authoring ergonomics** that a build step bakes away — your runtime CSS stays small.

Use **CSS custom properties** for anything that should change at runtime (theme switch, responsive overrides). Use **SCSS variables** for compile-time only values.

## Folder structure

```
src/styles/
├── abstracts/                # 0-runtime utilities
│   ├── _functions.scss       # math helpers, unit conversions
│   ├── _mixins.scss          # media queries, container queries, focus, visually-hidden
│   ├── _tokens.scss          # SCSS maps for design tokens
│   └── _index.scss           # @forward of all of the above
├── base/                     # browser defaults, resets
│   ├── _reset.scss           # modern reset (e.g. Andy Bell's reset, slightly customised)
│   ├── _typography.scss
│   └── _index.scss
├── layout/                   # large structural pieces: header, footer, grid system
│   ├── _container.scss
│   ├── _grid.scss            # CSS Grid utilities
│   ├── _stack.scss           # Flexbox "stack" / "cluster" / "switcher" primitives
│   └── _index.scss
├── module/                   # reusable BEM-style components
│   ├── _button.scss
│   ├── _card.scss
│   └── _index.scss
├── state/                    # is-, has-, is-active, .is-hidden
│   └── _index.scss
├── theme/                    # light/dark, brand variants
│   └── _index.scss
└── main.scss                 # entry — @use's everything
```

## Entry file with `@use`

```scss
// src/styles/main.scss
@use 'abstracts' as *;          // helpers as global namespace where appropriate
@use 'base';
@use 'layout';
@use 'module';
@use 'state';
@use 'theme';
```

Each subfolder has an `_index.scss` that forwards its partials:

```scss
// abstracts/_index.scss
@forward 'functions';
@forward 'mixins';
@forward 'tokens';
```

Modules are private by default. `as *` opts a module into the consumer's namespace. Generally prefer named namespaces (`@use 'abstracts/mixins' as mq;`) for clarity.

## Design tokens

```scss
// abstracts/_tokens.scss
@use 'sass:map';

$brand: (
  primary:    hsl(220 90% 56%),
  primary-dark: hsl(220 90% 40%),
  surface:    hsl(220 20% 98%),
  surface-2:  hsl(220 20% 94%),
  text:       hsl(220 20% 10%),
);

$spacing: (
  0: 0,
  1: 0.25rem,
  2: 0.5rem,
  3: 0.75rem,
  4: 1rem,
  5: 1.5rem,
  6: 2rem,
  8: 3rem,
  10: 4rem,
);

$radius: (sm: 4px, md: 8px, lg: 12px, full: 999px);

$breakpoints: (
  xs: 30em,    // 480px
  sm: 48em,    // 768px
  md: 64em,    // 1024px
  lg: 80em,    // 1280px
  xl: 96em,    // 1536px
);

// Expose as CSS variables for runtime use
:root {
  @each $name, $value in $brand {
    --color-#{$name}: #{$value};
  }
  @each $name, $value in $spacing {
    --space-#{$name}: #{$value};
  }
  @each $name, $value in $radius {
    --radius-#{$name}: #{$value};
  }
}

[data-theme='dark'] {
  --color-surface: hsl(220 20% 8%);
  --color-surface-2: hsl(220 20% 14%);
  --color-text: hsl(220 20% 96%);
}
```

## Functions

```scss
// abstracts/_functions.scss
@use 'sass:math';
@use 'sass:map';
@use 'tokens';

@function rem($px) {
  @return math.div($px, 16) * 1rem;
}

@function space($key) {
  @return map.get(tokens.$spacing, $key);
}

@function color($key) {
  @return map.get(tokens.$brand, $key);
}
```

## Mixins — modern responsive helpers

```scss
// abstracts/_mixins.scss
@use 'sass:map';
@use 'tokens';

@mixin mq($key) {
  $bp: map.get(tokens.$breakpoints, $key);
  @if not $bp { @error "Unknown breakpoint: #{$key}"; }
  @media (min-width: #{$bp}) { @content; }
}

@mixin container($key) {
  $bp: map.get(tokens.$breakpoints, $key);
  @container (min-width: #{$bp}) { @content; }
}

@mixin visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}

@mixin focus-ring {
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

@mixin fluid-type($min, $max, $vw-min: 320, $vw-max: 1280) {
  $slope: ($max - $min) / ($vw-max - $vw-min);
  $intercept: $min - $slope * $vw-min;
  font-size: clamp(#{$min}px, #{$intercept}px + #{$slope * 100}vw, #{$max}px);
}
```

## Layout primitives — Flexbox & Grid replacing floats

### Stack (vertical rhythm)

```scss
// layout/_stack.scss
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--stack-gap, var(--space-4));
}
```

```html
<div class="stack" style="--stack-gap: var(--space-6)">
  <h2>Heading</h2>
  <p>Paragraph</p>
  <button>Action</button>
</div>
```

### Cluster (wrapping horizontal group — tags, nav items)

```scss
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cluster-gap, var(--space-3));
  align-items: center;
}
```

### Switcher (flex with a breakpoint via min-width on flex items)

```scss
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--switcher-gap, var(--space-4));
}
.switcher > * {
  flex-grow: 1;
  flex-basis: calc((var(--switcher-threshold, 30rem) - 100%) * 999);
}
```

When the container is wider than `--switcher-threshold`, children sit side-by-side; below it, they stack.

### Sidebar layout

```scss
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap, var(--space-4));
}
.with-sidebar > .sidebar { flex-basis: 16rem; flex-grow: 1; }
.with-sidebar > .content { flex-basis: 0; flex-grow: 999; min-inline-size: 50%; }
```

### Grid (replaces Bootstrap row/col)

```scss
// layout/_grid.scss
.grid {
  display: grid;
  gap: var(--grid-gap, var(--space-4));
  grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min, 16rem)), 1fr));
}
```

```html
<ul class="grid" style="--grid-min: 18rem">
  <li>Card</li><li>Card</li><li>Card</li>
</ul>
```

This single class beats the entire Bootstrap 12-column grid: responsive without media queries, no float clearfix, RTL-ready, accessible.

### Container

```scss
.container {
  max-inline-size: var(--container-max, 72rem);
  margin-inline: auto;
  padding-inline: var(--space-4);
}
```

Logical properties (`inline-size`, `margin-inline`, `padding-block`) ship correctly in RTL languages.

## A modern reset (replace the legacy Normalize)

```scss
// base/_reset.scss
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { block-size: 100%; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-inline-size: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
:root { color-scheme: light dark; }
```

## Components — BEM with logical props

```scss
// module/_button.scss
@use '../abstracts' as *;

.button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding-inline: var(--space-4);
  padding-block: var(--space-2);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover { background: var(--color-primary-dark); }
  @include focus-ring;

  &--secondary {
    background: var(--color-surface-2);
    color: var(--color-text);
  }

  &--small { padding-inline: var(--space-3); padding-block: var(--space-1); }

  &[disabled] { opacity: 0.5; cursor: not-allowed; }
}
```

## Container queries for components

```scss
// module/_card.scss
.card {
  container-type: inline-size;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4);

  &__media { aspect-ratio: 16 / 9; }

  @container (min-width: 30em) {
    display: grid;
    grid-template-columns: 12rem 1fr;
    gap: var(--space-4);
    .card__media { aspect-ratio: 4 / 3; }
  }
}
```

Cards adapt to their parent column width, not the viewport — exactly what a real component library needs.

## Migration cheat sheet — old → new

| Old (legacy)                                   | New (modern)                                                    |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `@import 'partial'`                            | `@use 'partial';` / `@forward 'partial';`                       |
| `$variable: red;` used everywhere              | CSS custom property `--color-x` + SCSS for compile-time math    |
| `($x / $y)` division                           | `math.div($x, $y)`                                              |
| `darken($c, 10%)`                              | `color.adjust($c, $lightness: -10%)` or `color.mix(black, $c, 10%)` |
| Bootstrap `row` + `col-*-N`                    | CSS Grid or Flexbox `switcher`/`grid`                           |
| `float: left;` + `.clearfix`                   | `display: flex` / `display: grid`                               |
| `margin-left`, `padding-right`                 | `margin-inline-start`, `padding-inline-end`                     |
| Media queries everywhere                       | Container queries for components; media queries for layout shifts |
| `mixin bem-block($b)` helpers                  | Native nesting + Sass `&` selectors                             |
| BrowserSync + gulp                             | Vite (preferred) or webpack + sass-loader                       |

## Build setup (Vite — recommended)

```jsonc
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "sass": "^1.77.0",
    "vite": "^6.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

```js
// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },     // use the modern Sass API
    },
    postcss: {
      plugins: [require('autoprefixer')],
    },
  },
});
```

Inside a Next.js project (App Router), Sass works out of the box: rename files to `.module.scss`, import them, and Next handles the rest.

## Quick checklist for modernisation

- [ ] Replace every `@import` with `@use`/`@forward`.
- [ ] Replace `darken`/`lighten`/`transparentize` with `color.adjust`/`color.mix`.
- [ ] Replace `/` division with `math.div`.
- [ ] Replace all floats and clearfixes with Flex/Grid.
- [ ] Replace `margin-left`/`right` with `margin-inline-start`/`end`.
- [ ] Move dynamic values (theme colours, spacing tokens) to CSS custom properties.
- [ ] Introduce a fluid type scale via `clamp()` instead of step-wise breakpoints.
- [ ] Adopt container queries for component-internal responsiveness.
- [ ] Bring in a modern reset (Andy Bell / Josh Comeau style).
- [ ] Switch the dev server to Vite (or update gulp/webpack to current Sass API).
- [ ] Enable `color-scheme: light dark` and `@media (prefers-color-scheme: dark)` overrides.

## Why this matters

The legacy starter is fine pedagogy for SMACSS but ships layout that fails in modern contexts: no RTL support, no container queries, deprecated Sass APIs that won't compile under Dart Sass 2.0. The modernised version keeps SMACSS's organising principles (which still hold up) and swaps the runtime CSS for the layout primitives the platform now supports natively.
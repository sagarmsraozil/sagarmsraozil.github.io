# Frontend System Design — The Thinking Framework

> A meta-file: how to *think* about frontend systems before writing code. Built on the chess-player framework (interrogation → search → review). Cross-refs: every other file in this pack.

## The frame

Frontend system design is the same activity as backend system design, with different load-bearing concerns:

| Backend             | Frontend                                              |
| ------------------- | ----------------------------------------------------- |
| Throughput, latency | Perceived performance, TTI, INP                       |
| Consistency, CAP    | Cache invalidation across views, sync state           |
| Scaling             | Component composition, bundle splitting               |
| Failure modes       | Network failure UX, stale data, offline               |
| Schema migrations   | Component API evolution, design-system versioning     |

When asked to design a frontend system, your job is **not** to immediately list components or routes. It is to identify the load-bearing decisions and make them deliberately.

## The seven axes of a frontend system

Every meaningful frontend system has a position on each of these. Make the choice; don't drift into it.

### 1. Rendering strategy

```
Static (SSG)            Pre-rendered at build; CDN-served. Marketing pages, blog, docs.
Server-rendered (SSR)   Rendered per request on the server. Authenticated dashboards.
Incremental (ISR)       Pre-rendered + revalidated. E-commerce catalogues.
Client-only (CSR/SPA)   No SSR; everything in the browser. Internal tools.
Hybrid (App Router)     Per-route choice; Server Components by default.
```

Pick per-route, not per-app. The home page might be static, the dashboard SSR, the chat client-only.

### 2. Data fetching boundary

```
Server (RSC, loaders)       Fast first paint, no waterfall, SEO-friendly.
Client (TanStack Query)     Interactivity-driven, polling, mutations, optimistic.
Hybrid                       Server fetches initial; client takes over for live updates.
```

Default to server for "first view" data, client for "user-driven interaction" data. Hand off via `initialData` or `HydrationBoundary`.

### 3. State location

```
URL                         Filters, search, pagination, selected tab.
Server                      Persistent data. Owned by the database.
Server-state cache (Query)   Read-through cache of server.
Local component state        Hovers, open/close, transient input.
Global client state (Zustand) Cross-tree client-only — themes, cart-during-checkout, multi-step wizards.
```

The default order: URL → server → local → global. Reach for global only when nothing else fits.

### 4. Composition unit

```
Page                         A route in the app.
Layout                       Persistent shell across pages.
Feature                      A vertical slice (its components, queries, store, types).
UI primitive                 Buttons, inputs, cards — design-system level.
Hook                         Behaviour-with-state, reusable across UIs.
```

A healthy codebase moves volume **downward**: pages are thin, features carry logic, primitives are shared.

### 5. Styling and design tokens

```
Tokens                      Source-of-truth values: colour, spacing, type, radius, motion.
Token surface               How tokens reach code: CSS custom props, Tailwind config, design system JSON.
Layout primitives           Stack, cluster, switcher, grid — replacing Bootstrap-style grid scaffolding.
Component styles            Scoped (CSS Modules, CSS-in-JS, BEM) — see [08-sass-modern-starter.md](./08-sass-modern-starter.md).
Theme switching             CSS custom props at the root, swapped by `data-theme` attribute or prefers-color-scheme.
```

### 6. Performance budgets

Pick numbers before writing the page. Targets:

```
LCP (Largest Contentful Paint)    < 2.5s on slow 3G
INP (Interaction to Next Paint)   < 200ms
CLS (Cumulative Layout Shift)     < 0.1
TTFB (Time to First Byte)         < 600ms
JS bundle (first-route, gzipped)  < 200 KB
CSS (first-route, gzipped)        < 50 KB
Image total (above the fold)       reserved (no CLS) and optimised
```

If you know the budgets, you know the architecture. If you don't, you're optimising blind.

### 7. Resilience

```
Network failure               Retry with backoff, show actionable error UI.
Stale cache                   Revalidation strategy, `staleTime`, manual refresh.
Schema drift                  Validate responses with [Zod](./06-zod-validation.md) at boundaries.
Auth expiry                   Single source of truth for "logged in"; redirect on 401.
Hydration mismatches          Avoid `Date.now()`, locale-dependent formatting in initial render; gate with `suppressHydrationWarning` only as last resort.
```

## The chess-player loop for a UI feature

Before writing code, walk this loop:

```
1. INTERROGATE the requirement
   - Who is this for? (logged-out browser, authed user, admin?)
   - What is the success criterion? (loaded in <2s, can search 1M items, ...)
   - What's the failure mode? (data dies, network drops, browser back, deeplink)
   - Which boundaries are crossed? (URL → server → API → DB)

2. SEARCH the solution space — three candidates minimum
   - The obvious solution.
   - The opposite-constraint solution (what if we didn't use a state library? what if it were all server-rendered?)
   - The simplest possible thing.
   For each candidate:
     - Option activity: does it close off any future change?
     - Coupling: where are the dependencies and are they visible?
     - Initiative: does our system define the contract, or react to whoever calls it?

3. REVIEW — adversarial check the chosen candidate
   - What if data is huge?
   - What if the user does this twice quickly?
   - What if the API returns the wrong shape?
   - What if a junior touches this in 6 months?
```

## The quiet moves that buy you the most

These are the small investments that pay off disproportionately:

1. **A `queryKeys` factory per feature.** Five extra minutes; surgical invalidation forever.
2. **Atomic Zustand selectors via hooks.** Prevents accidental over-rendering as the store grows.
3. **Zod schemas at every untrusted boundary.** Compile-time and runtime safety from one source.
4. **`<Suspense>` boundaries co-located with the data they wrap.** Streamed UI without manual loading-state plumbing.
5. **Design tokens as CSS custom properties.** Theme switching becomes one attribute change.
6. **Logical CSS properties.** RTL languages work without a rewrite.
7. **Container queries on components.** Components adapt to their *container*, not the viewport.
8. **An `error.tsx` and `loading.tsx` per meaningful segment.** No more bare white screens or spinners.
9. **A typed `env.ts` parsed by Zod at startup.** Bad config fails the build, not the user request.
10. **One source of truth for "logged-in user"** (server-supplied via layout, never duplicated).

## Standard request: "design the home page of X"

The structured answer is always:

1. **Audience and intent.** Who lands here, what do they want, what do they leave with?
2. **Above-the-fold content inventory.** What must render before LCP?
3. **Rendering strategy choice.** With reasons.
4. **Data dependencies.** Server-fetched / client-fetched / static.
5. **Component decomposition.** Tree of features and primitives.
6. **State decisions.** What's URL, what's server, what's local, what's global.
7. **Performance budgets.** Specific numbers.
8. **Resilience plan.** Failure UX, validation, observability.
9. **The quiet moves.** Investments that pay off later.
10. **What's *not* in v1.** Explicit, so scope doesn't drift.

See `airbnb-homepage-system-design.pdf` in this pack for a worked example.

## Common system-design traps

| Trap                                     | Fix                                                              |
| ---------------------------------------- | ---------------------------------------------------------------- |
| "Let's put it in Redux/Zustand"          | Start with: server? URL? Local? Then global as last resort.       |
| "We'll add caching later"                | Cache layout and naming are *first-design* concerns.              |
| One mega-context for the whole app       | Split by update frequency.                                        |
| Client components all the way down       | Push `'use client'` to the leaves; server-render the rest.        |
| Designing components, not data flow      | Decide what data each component owns *before* drawing the box.    |
| Optimising for a single page             | Plan the design system before the third page lands.               |
| Treating mobile and desktop separately   | Design fluid; layout primitives + container queries collapse the gap. |
| "Just fetch in `useEffect`"              | Pick a server-state library before any non-trivial UI.            |
| "We'll worry about accessibility later"  | A11y is cheap if designed in, expensive to retrofit.              |
| Performance work without measurement     | Lighthouse + RUM (e.g. web-vitals) is non-negotiable.             |

## The shipping checklist (per route)

- [ ] Rendering strategy decided and documented.
- [ ] Data fetched at the right boundary, with cache strategy.
- [ ] State in the right place (re-read section 3).
- [ ] Loading and error UI at each meaningful Suspense boundary.
- [ ] Inputs validated (Zod). Outputs typed.
- [ ] Metadata (title, OG, canonical) set, dynamic where needed.
- [ ] Images served via `<Image>` (Next.js) with `priority` on LCP element.
- [ ] Font loaded via `next/font` (no FOUT).
- [ ] No layout shift (aspect ratios reserved, skeletons sized).
- [ ] Keyboard navigable; visible focus rings; semantic HTML.
- [ ] Works without JS for content pages.
- [ ] Bundle inspected (no `lodash`, no full-icon-libraries).
- [ ] Analytics events fired only after a real interaction.
- [ ] Behaviour under slow network tested.
- [ ] Mutations idempotent or guarded against double-submit.

## The reading order for these files when starting a project

1. [09-frontend-system-design.md](./09-frontend-system-design.md) (this file) — to frame the architecture.
2. [02-nextjs-app-router.md](./02-nextjs-app-router.md) — to pick the routing/rendering model.
3. [01-react-fundamentals.md](./01-react-fundamentals.md) — to align on state-vs-effect discipline.
4. [03-tanstack-query.md](./03-tanstack-query.md) — for the server-state cache layer.
5. [05-zustand-atomic.md](./05-zustand-atomic.md) — for the client-state model.
6. [06-zod-validation.md](./06-zod-validation.md) — at boundaries.
7. [07-tanstack-form.md](./07-tanstack-form.md) — for form-heavy surfaces.
8. [04-tkdodo-patterns.md](./04-tkdodo-patterns.md) — the integration-level wisdom.
9. [08-sass-modern-starter.md](./08-sass-modern-starter.md) — if your styling layer is Sass.

The decisions in this file get you a defensible starting position. The other files tell you *how* to execute each one.
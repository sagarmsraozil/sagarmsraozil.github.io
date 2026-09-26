# React & Next.js Patterns

> React 19 and Next.js 15 (App Router) patterns relevant to this project and future iterations. Consult when adding interactivity, new pages, or changing the rendering model.

## This Project's React Model

This is a **static portfolio site**. Almost everything is a Server Component that renders once at build time. Client-side React is limited to Header/CVModal and the ambient constellation background (`components/ambient/`). The 2026 "Diagnosis Layer" game components were removed in Sept 2026.

```
Server Components (default): IntroSection, SummarySection, SkillsSection, ExperienceSection,
                              ProjectsSection, AiEngineeringSection, EducationSection,
                              ReferencesSection, CTASection, SectionLabel, StackTag,
                              ExperienceCard, ProjectCard, AdditionalProjectCard
Client Components ('use client'): Header, CVModal, ConstellationBackground
```

`'use client'` components still render to static HTML at build time (this is a Next.js static export, not a browser-only app) — they just also ship JS to hydrate. Any content a client component renders is still real, crawlable HTML in `/out`, not an empty div waiting for JS.

## React Core Mental Model

UI = `f(state)`. React renders pure functions of state. Your job:
1. Keep state in the right place
2. Keep render functions pure (no side effects during render)
3. Push side effects to event handlers first, Effects last

## State Placement Decision Tree

```
Is the value derived from other state/props?
  yes -> compute during render (no useState, no useEffect)
  no  -> does it survive renders without triggering re-renders?
    yes -> useRef
    no  -> does it come from the server?
      yes -> TanStack Query (or server fetch for static sites)
      no  -> is it shared across far-apart components?
        yes -> Zustand (or Context for rare-change values)
        no  -> useState
```

For this project: everything is static JSON props. The only `useState` is in Header.

## Server Components vs Client Components

| | Server Component | Client Component |
|---|---|---|
| Default? | Yes (App Router) | Opt-in with `'use client'` |
| Can be async? | Yes | No |
| Has state/effects? | No | Yes |
| Uses browser APIs? | No | Yes |
| Bundle impact | Zero (not sent to browser) | Included in JS bundle |

**Rules:**
- You cannot import a server component into a client component, but you CAN pass server components as `children` props
- Don't pass functions, class instances, or Date objects across the boundary
- Push `'use client'` as far down the tree as possible — keep most of the tree server-rendered

## Effects Discipline

You probably **don't need an Effect** for:
- Transforming data for rendering -> compute during render or `useMemo`
- Handling user events -> put logic in the event handler
- Resetting state on prop change -> set a `key` on the component
- Fetching data -> use server fetch or TanStack Query

You **do need an Effect** for:
- Subscribing to browser APIs (scroll, resize, intersection observer)
- Third-party widget integration
- Websocket connections

The dep array must list every reactive value the Effect reads. Always return cleanup for subscriptions/timers.

## React 19 Key Features

```ts
use(promise | context)       // Suspends on promise; reads context conditionally
useActionState(action, init) // Form actions with state
useFormStatus()              // Pending state inside forms
useOptimistic(state, update) // Instant UI feedback before server confirmation
```

- `forwardRef` no longer required — pass `ref` as a normal prop
- `<Context.Provider>` can be written as `<Context>`
- Ref cleanup functions supported (return from ref callback)

## Next.js 15 App Router Specifics

### File Conventions (`/app`)

| File | Purpose |
|---|---|
| `layout.tsx` | Persistent wrapper, doesn't unmount on navigation |
| `page.tsx` | The leaf that makes a route accessible |
| `loading.tsx` | Suspense fallback for the segment |
| `error.tsx` | Error boundary (must be client component) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API route handler |

### Static Export (`output: 'export'`)

This project uses static export — no server runtime. Implications:
- No Server Actions (they need a server)
- No Route Handlers at runtime
- No dynamic routes without `generateStaticParams`
- All content baked into HTML at build time
- Images must be `unoptimized: true`

### Metadata API

```tsx
// Static
export const metadata: Metadata = { title: 'Home', description: '...' }

// Dynamic
export async function generateMetadata({ params }): Promise<Metadata> { ... }
```

### Navigation Patterns

```tsx
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
```

This project uses anchor links (`href="#work"`) with `scroll-behavior: smooth` instead of Next.js routing.

## Patterns to Follow When Extending

### Adding Interactivity to a Section

```tsx
// Keep the section as server component
// Extract interactive part as a small client component

// ServerSection.tsx (no 'use client')
export function ServerSection({ data }) {
  return (
    <section>
      <h2>{data.heading}</h2>
      <InteractivePart items={data.items} />  {/* client leaf */}
    </section>
  )
}

// InteractivePart.tsx
'use client'
export function InteractivePart({ items }) {
  const [selected, setSelected] = useState(null)
  // ...
}
```

### Adding a New Page (if needed in future)

1. Create `src/app/new-page/page.tsx`
2. Add metadata export
3. Use `Link` from `next/link` for navigation
4. Ensure `generateStaticParams` if dynamic

> **Removed Sept 2026:** the `localStorage` case store (`caseStore.ts` + atomic `useSyncExternalStore` selectors) and the `useHydrated` progressive-enhancement hook went away with the gamification layer. If either pattern is needed again, both are in git history at commit `e765dc1`. Rule of thumb that still stands: if client state grows past a handful of small stores, bring in Zustand for real rather than hand-rolling more.

## Imperative Browser API Ownership: the Canvas Lifecycle Pattern

`ConstellationBackground` (`src/components/ambient/ConstellationBackground.tsx`) owns a 2D canvas and a `requestAnimationFrame` loop — this is the canonical case the Effects Discipline section already calls out ("Subscribing to browser APIs... do need an Effect"), not an exception to "hooks over Effects."

The shape to reuse for any future component that owns an imperative resource (a canvas, a `<video>` element, a websocket, a third-party widget):

```tsx
'use client'
useEffect(() => {
  const resource = ImperativeThing.create(ref.current)  // returns null instead of throwing
  if (!resource) return                                 // failed setup leaves nothing to clean up

  const onEvent = () => resource.doSomething()          // arrow consts, not function declarations:
  window.addEventListener('event', onEvent)             // hoisted declarations lose TS null-narrowing

  if (someGuardCondition) {                             // e.g. reducedMotion — static frame only
    return () => window.removeEventListener('event', onEvent)
  }

  resource.start()
  return () => {                                        // cleanup mirrors setup
    resource.stop()
    window.removeEventListener('event', onEvent)
  }
}, [someGuardCondition])
```

Rules this pattern enforces, taken from `ConstellationBackground`/`ConstellationRenderer`:
- **All imperative state lives in a plain class (`ConstellationRenderer`), not in React state.** Node positions, pulses and pointer easing change 60 times a second; routing that through `useState` would mean 60 re-renders a second for nothing. The component has **zero** `useState` — React only tracks whether reduced motion is active.
- **Factory returns `null` rather than throwing.** A synchronous exception inside an Effect on a static export has no error boundary to catch it gracefully; a nullable result the caller checks does not.
- **Reduced motion is a branch inside the effect, not a skipped effect.** The renderer is still created and draws one static frame (and redraws on resize); only the loop and the pointer/scroll/click listeners are skipped.
- **Cleanup is exhaustive and symmetric with setup** — every `addEventListener` has a matching `removeEventListener`. This is what makes React StrictMode's dev-time mount→unmount→mount double-invoke safe.
- **Failure has a visual answer.** The wrapper's CSS radial glows are always painted beneath the canvas, so no-JS, no-2D-context and pre-mount all look intentional, never blank.
- **Colours come from CSS tokens** (`readPalette()` reads `--constellation-ink`/`--constellation-warm` from `:root`), so a palette change is a `globals.scss` edit only.

## Anti-Patterns to Avoid

| Don't | Do |
|---|---|
| `useEffect(() => setX(deriveFrom(prop)))` | Compute inline during render |
| `useEffect(() => fetch(...))` | Use server fetch or TanStack Query |
| Mutate state directly (`state.push(x)`) | Create new objects/arrays |
| Store derived data in state | Derive during render |
| Put `'use client'` on section components | Keep sections as server components |
| One huge Context for everything | Split by update frequency |

# React & Next.js Patterns

> React 19 and Next.js 15 (App Router) patterns relevant to this project and future iterations. Consult when adding interactivity, new pages, or changing the rendering model.

## This Project's React Model

This is a **static portfolio site**. Almost everything is a Server Component that renders once at build time. Client-side React is limited to Header/CVModal (existing), the opt-in "Diagnosis Layer" game components (`components/game/`, 2026), and the ambient background (`components/ambient/`, 2026).

```
Server Components (default): IntroSection, SummarySection, SkillsSection, ExperienceSection,
                              ProjectsSection, AiEngineeringSection, EducationSection,
                              ReferencesSection, CTASection, SectionLabel, StackTag,
                              ExperienceCard, ProjectCard, AdditionalProjectCard
Client Components ('use client'): Header, CVModal, CaseFile, CaseProgress, BriefComposer,
                                   LakeBackground
```

`'use client'` components still render to static HTML at build time (this is a Next.js static export, not a browser-only app) — they just also ship JS to hydrate. This matters for the game components: their build-time HTML output is real, crawlable content, not empty divs waiting for JS.

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

## localStorage State via `useSyncExternalStore` (no Zustand)

CLAUDE.md's rule of thumb is "Zustand for client state," but Zustand isn't a project dependency, and the one piece of client state this site has — case-diagnosis answers, persisted to `localStorage` — is small enough (~80 lines total) that `useSyncExternalStore` (a React 19 built-in) covers it without adding a package. The *spirit* of the rule (atomic selectors, no whole-store subscriptions) is kept:

```ts
// src/lib/caseStore.ts — module-level singleton store, not a hook
let snapshot: CaseAnswers = readFromStorage()      // eager read on the client only
export function subscribe(listener) { /* Set<listener>, plus a `storage` event bridge */ }
export function getSnapshot() { return snapshot }           // client value
export function getServerSnapshot() { return EMPTY }        // SSR / pre-hydration value
export function recordAnswer(id, optionId, correct) { /* replace snapshot, persist, notify */ }
```

```ts
// src/hooks/useCaseProgress.ts — atomic selectors over the store
export function useCaseAnswer(caseId: string) {
  const getSelected = useCallback(() => getSnapshot()[caseId], [caseId])
  const getSelectedServer = useCallback(() => getServerSnapshot()[caseId], [caseId])
  return useSyncExternalStore(subscribe, getSelected, getSelectedServer)
}
```

Each hook slices the snapshot down to exactly what one component needs (`useCaseAnswer(id)`, `useSolvedCount(total)`), so answering one case only re-renders that case's `CaseFile` — not every case on the page. If client state ever grows past a handful of small stores, that's the signal to bring in Zustand for real; don't reach for it preemptively.

**If you need this pattern again:** reuse `caseStore.ts`'s shape (module-scope snapshot + `Set<listener>` + a `storage` event bridge for cross-tab sync) rather than inventing a new one — it's the whole pattern in ~50 lines, and it's already wrapped in the try/catch needed for Safari private-mode `localStorage` throwing on write.

## Progressive Enhancement: Detecting Hydration Without `useEffect`

When a component must render different markup before vs. after hydration (e.g. a no-JS `<details>` fallback that upgrades to an interactive picker), don't use `useEffect(() => setMounted(true), [])` — that's an extra render pass and violates "hooks over Effects." Use `useSyncExternalStore` with a no-op subscribe:

```ts
// src/hooks/useHydrated.ts
function subscribe() { return () => {} }
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
```

Server and the first client (hydration) render both resolve to `false` — output matches, no hydration-mismatch warning. Immediately after mount, React detects `getSnapshot()` (`true`) differs from what was rendered and forces a resync render, flipping the value to `true` — no manual state, no Effect. Used by `CaseFile` to swap its `<details>` fallback for the interactive option-picker only once the client has taken over.

## Imperative Browser API Ownership: the WebGL Lifecycle Pattern

`LakeBackground` (`src/components/ambient/LakeBackground.tsx`) owns a WebGL context and a `requestAnimationFrame` loop — this is the canonical case doc's own Effects Discipline section already calls out ("Subscribing to browser APIs... do need an Effect"), not an exception to "hooks over Effects."

The shape to reuse for any future component that owns an imperative resource (WebGL, a `<video>` element, a websocket, a third-party widget):

```tsx
'use client'
useEffect(() => {
  if (someGuardCondition) return           // e.g. reducedMotion — bail before creating anything

  const resource = new ImperativeThing(ref.current)
  if (!resource.init()) return             // failed setup leaves nothing to clean up
  resource.start()

  function onEvent() { resource.doSomething() }
  window.addEventListener('event', onEvent)

  return () => {                           // cleanup mirrors setup, in reverse
    window.removeEventListener('event', onEvent)
    resource.destroy()
  }
}, [someGuardCondition])
```

Rules this pattern enforces, taken from `LakeBackground`/`LakeRenderer`:
- **All imperative state lives in a plain class (`LakeRenderer`), not in React state.** Frame time, ripple positions, and GL handles change up to 30x/second — routing that through `useState` would mean 30 re-renders/second for no reason. React only tracks the two things a render actually needs: whether reduced-motion is active, and whether the canvas is ready to fade in.
- **The guard condition is checked before any resource is created**, not after — `if (reducedMotion) return` is the first line of the effect, so a reduced-motion visitor never even gets a WebGL context allocated.
- **`init()` returns success/failure rather than throwing.** A synchronous exception inside an Effect on a static export has no error boundary to catch it gracefully; a boolean the caller checks does not.
- **Cleanup is exhaustive and symmetric with setup** — every `addEventListener` in the effect has a matching `removeEventListener` in its cleanup, in the same order reversed. This is what makes React StrictMode's mount→unmount→mount dev-time double-invoke safe to develop against.
- **Failure has a visual answer, not just a caught error.** `LakeBackground` always renders a CSS-gradient fallback `<div>` beneath the canvas; the effect's early returns and the renderer's `onFail` callback all funnel toward "the fallback stays visible," never toward a blank layer.

## Anti-Patterns to Avoid

| Don't | Do |
|---|---|
| `useEffect(() => setX(deriveFrom(prop)))` | Compute inline during render |
| `useEffect(() => fetch(...))` | Use server fetch or TanStack Query |
| Mutate state directly (`state.push(x)`) | Create new objects/arrays |
| Store derived data in state | Derive during render |
| Put `'use client'` on section components | Keep sections as server components |
| One huge Context for everything | Split by update frequency |

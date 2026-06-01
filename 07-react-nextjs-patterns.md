# React & Next.js Patterns

> React 19 and Next.js 15 (App Router) patterns relevant to this project and future iterations. Consult when adding interactivity, new pages, or changing the rendering model.

## This Project's React Model

This is a **static portfolio site**. Almost everything is a Server Component that renders once at build time. The only client-side React runs in Header (scroll/menu state) and CVModal (modal behavior).

```
Server Components (default): HeroSection, ProblemSection, WorkSection, ExperienceSection,
                              AboutSection, EducationSection, SkillsSection, ReferencesSection,
                              CTASection, SectionLabel, StackTag, CaseStudyCard,
                              AdditionalProjectCard, ExperienceCard
Client Components ('use client'): Header, CVModal
```

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

## Anti-Patterns to Avoid

| Don't | Do |
|---|---|
| `useEffect(() => setX(deriveFrom(prop)))` | Compute inline during render |
| `useEffect(() => fetch(...))` | Use server fetch or TanStack Query |
| Mutate state directly (`state.push(x)`) | Create new objects/arrays |
| Store derived data in state | Derive during render |
| Put `'use client'` on section components | Keep sections as server components |
| One huge Context for everything | Split by update frequency |

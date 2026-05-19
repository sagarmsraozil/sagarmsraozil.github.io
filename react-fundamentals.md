# React Fundamentals

> Version pin: React 19.2 (October 2025), 19.2.1 (December 2025). Cross-refs: [02-nextjs-app-router.md](./02-nextjs-app-router.md), [03-tanstack-query.md](./03-tanstack-query.md), [05-zustand-atomic.md](./05-zustand-atomic.md).

## Mental model first

React renders **pure functions of state**. UI = `f(state)`. Your job is to:
1. Keep state in the right place.
2. Keep render functions pure (no side effects during render).
3. Push side effects to event handlers first, Effects last.

If you find yourself reaching for an Effect, ask: "Can this be computed during render, or run from a handler?" 90% of the time, yes.

## State: where does it go?

| State type            | Put it in                                           |
| --------------------- | --------------------------------------------------- |
| Local UI (open/close) | `useState` in the component                         |
| Form input            | `useState` or [TanStack Form](./07-tanstack-form.md)|
| URL-shareable filter  | URL search params (Next router / TanStack Router)   |
| Server data           | [TanStack Query](./03-tanstack-query.md) — NOT state|
| Cross-tree client     | [Zustand](./05-zustand-atomic.md)                   |
| Theme, locale, user   | React Context (rarely changes) or Zustand+Context   |

**Rule:** server state is not client state. Don't `useState(data)` and `useEffect(fetch)`. Use a server-state library.

## Core hooks — exact signatures

```ts
useState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>]
useReducer<S, A>(reducer: (s: S, a: A) => S, initial: S): [S, Dispatch<A>]
useEffect(setup: () => void | (() => void), deps?: unknown[]): void
useLayoutEffect(setup, deps): void                       // runs sync after DOM mutations, before paint
useMemo<T>(factory: () => T, deps: unknown[]): T
useCallback<T extends Function>(fn: T, deps: unknown[]): T
useRef<T>(initial: T): { current: T }
useContext<T>(ctx: Context<T>): T
useTransition(): [isPending: boolean, startTransition: (cb: () => void) => void]
useDeferredValue<T>(value: T, initial?: T): T
useId(): string
useSyncExternalStore<T>(subscribe, getSnapshot, getServerSnapshot?): T
useImperativeHandle(ref, factory, deps?): void
```

### React 19 additions

```ts
use<T>(resource: Promise<T> | Context<T>): T            // suspends until promise resolves; can read context conditionally
useActionState<S, P>(action: (prev: S, payload: P) => Promise<S>, initial: S): [state, dispatch, isPending]
useFormStatus(): { pending, data, method, action }      // from 'react-dom'; child-of-form only
useOptimistic<S, U>(state: S, update: (s: S, u: U) => S): [optimistic, addOptimistic]
```

### React 19.2 additions

```ts
<Activity mode="visible" | "hidden">{children}</Activity>   // prerender hidden subtrees; preserve state
useEffectEvent(handler): stableNonReactiveFn                // separate event logic from reactive logic
cacheSignal()                                                // RSC only: lifetime end signal for cache()
```

## Effects — the discipline

You probably **don't need an Effect** if you are:

- Transforming data for rendering → compute during render or with `useMemo`.
- Handling user events → put logic in the event handler.
- Resetting state on prop change → set a `key` on the component.
- Adjusting state based on prop change → calculate it inline during render (rare); or lift state up.
- Notifying parent of state change → call parent's callback in the same handler that changed state.
- Initializing the app once → call it outside the component module.
- Subscribing to external store → use `useSyncExternalStore`.
- Fetching data → use [TanStack Query](./03-tanstack-query.md) or framework loaders.

You **do need an Effect** when synchronising with a non-React system: subscriptions, browser APIs, manual DOM, third-party widgets, websockets.

### Effect rules

1. The dep array lists **every reactive value** the Effect reads. ESLint rule `react-hooks/exhaustive-deps` is non-negotiable.
2. Each Effect should describe **one synchronisation**. Split unrelated logic into separate Effects.
3. Return a cleanup whenever the Effect attaches something (listener, subscription, timer, fetch with AbortController).
4. Non-reactive logic inside an Effect goes in `useEffectEvent` (R19.2). Example: read latest analytics URL inside a chat-room Effect without re-firing on URL change.

```tsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showToast('Connected to ' + roomId, theme);  // reads latest theme, never re-runs Effect
  });
  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on('connect', onConnected);
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]);   // theme NOT in deps; that's the point
}
```

## Refs

- `useRef` for values that survive renders but **don't trigger re-render** when changed.
- Mutate `ref.current` outside render (in handlers/Effects only).
- For DOM nodes: in R19 you pass `ref` as a normal prop — no more `forwardRef` for new components.

```tsx
// React 19+
function MyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputProps) {
  return <input ref={ref} {...props} />;
}
```

- Ref callbacks can now return a cleanup function (R19).

## Suspense, transitions, and concurrent rendering

- **Suspense** = "if something inside isn't ready, show a fallback". Use for code-splitting (`React.lazy`), data via `use(promise)`, and Server Components streaming.
- **Transitions** (`useTransition`, `startTransition`) mark updates as **non-urgent**. React keeps the old UI interactive while preparing the new one. Use for tab switches, large list filters, route changes.
- `useDeferredValue` is the lower-level cousin: lets the UI show stale value while computing the new one.

```tsx
const [isPending, startTransition] = useTransition();
function selectTab(id: string) {
  startTransition(() => setTab(id));   // input stays responsive
}
```

## Forms with Actions (React 19)

```tsx
async function submit(prevState, formData: FormData) {
  const r = await api.update(formData.get('name'));
  return r.ok ? { ok: true } : { error: r.message };
}

function Form() {
  const [state, dispatch, isPending] = useActionState(submit, { ok: false });
  return (
    <form action={dispatch}>
      <input name="name" />
      <SubmitButton />
      {state.error && <p>{state.error}</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Save</button>;
}
```

Couple with `useOptimistic` for instant UI feedback before server confirmation.

## Server Components vs Client Components

- Server Components (RSC): render on server, **no state, no effects, no browser APIs**. Can be async. Default in App Router.
- Client Components: marked with `'use client'`. Have state/effects. Hydrated on the client.
- Pass server data **as props** down to client components. Don't try to pass functions or class instances across the boundary.
- See [02-nextjs-app-router.md](./02-nextjs-app-router.md) for framework specifics.

## Context — the right way

- Context is for **dependency injection**, not state management.
- Cheap to read; expensive when value changes (every consumer re-renders).
- Split contexts by update frequency. Don't put everything in one mega-context.
- For client state that changes often, use [Zustand with Context](./05-zustand-atomic.md) — the context only shares the store *instance*, not the values.

## Performance — when to optimise

Compiler-first: if you adopt the React Compiler (still rolling out), most `useMemo`/`useCallback` becomes unnecessary. Without the compiler:

| Symptom                                  | Fix                                       |
| ---------------------------------------- | ----------------------------------------- |
| Child re-renders unnecessarily on parent | `React.memo` + stable prop refs           |
| Stable callback identity needed          | `useCallback`                             |
| Expensive computation re-runs            | `useMemo`                                 |
| Big list re-renders on every keystroke   | `useDeferredValue` or virtualise          |
| Tab switch janks                         | `useTransition`                           |
| Off-screen subtree wastes work           | `<Activity mode="hidden">` (R19.2)        |

**Don't pre-optimise.** Profile first (React DevTools Profiler tab). Most performance problems are state-in-wrong-place problems, not memoisation problems.

## Common anti-patterns to avoid

| Don't                                          | Do                                                |
| ---------------------------------------------- | ------------------------------------------------- |
| `useEffect(() => setX(deriveFrom(prop)))`      | Compute inline during render                      |
| `useEffect(() => fetch(...))`                  | Use TanStack Query / framework loader              |
| Mutate state directly (`state.push(x)`)        | Create new objects/arrays                          |
| Store derived data in state                    | Derive during render                               |
| Conditional hooks                              | Always call hooks unconditionally                  |
| Index as `key` for reorderable lists           | Stable IDs                                         |
| Forget cleanup in subscriptions/timers         | Return cleanup from Effect                         |
| One huge Context for everything                | Split by update frequency                          |

## Key React 19 breaking-change reminders

- `forwardRef` no longer required for function components.
- Refs are mutable by default; ref cleanup functions supported.
- `useRef` requires an initial argument.
- `<Context.Provider>` can be written as `<Context>`.
- Legacy string refs, `defaultProps` on function components, `propTypes`, and `createFactory` removed.
- See the [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) before migrating.

## When to use what — quick decision tree

```
Is the value derived from other state/props?
  yes → compute during render (no useState, no useEffect)
  no  → does it survive across renders without triggering renders?
    yes → useRef
    no  → does it come from the server?
      yes → TanStack Query
      no  → is it shared across far-apart components?
        yes → Zustand (or Context for rare-change values like theme)
        no  → useState
```
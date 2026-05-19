# TKDodo Patterns — Distilled

> Dominik Dorfmeister (TKDodo) maintains TanStack Query and writes deeply about React Query, Zustand, and React patterns. This file distills the load-bearing ideas. Cross-refs: [03-tanstack-query.md](./03-tanstack-query.md), [05-zustand-atomic.md](./05-zustand-atomic.md).

## The framing that runs through everything

**Server state and client state are different problems.** Solve them with different tools, never mix.

- Server state: TanStack Query.
- URL state: router search params.
- Client UI state: `useState` locally, Zustand globally.
- Form state: TanStack Form (or React Hook Form), not global state.

Most "state management is hard" problems disappear once you stop putting server data in client stores.

---

## React Query — the essentials TKDodo keeps repeating

### 1. Always think in **query keys**

The key is the dependency array of your data. Anything the `queryFn` reads from a closure must be in the key. ESLint plugin (`@tanstack/eslint-plugin-query`) enforces this — turn it on.

```ts
// ❌ bug waiting to happen
useQuery({ queryKey: ['todos'], queryFn: () => fetch(`/todos?status=${status}`) });

// ✅ status is in the key
useQuery({ queryKey: ['todos', { status }], queryFn: () => fetch(`/todos?status=${status}`) });
```

### 2. Use a **query keys factory** per feature

```ts
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (f: Filter) => [...todoKeys.lists(), f] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};
```

Surgical invalidation: `invalidateQueries({ queryKey: todoKeys.lists() })` flushes every list query regardless of filter, leaves details alone.

### 3. Status checks: `data` before `isLoading`

TKDodo's recommended order:

```tsx
if (query.isPending) return <Skeleton />;
if (query.isError)   return <Err error={query.error} retry={query.refetch} />;
return <List items={query.data} />;
```

If you have `placeholderData` or `initialData`, switch to `isFetching && !isPlaceholderData` to show a subtle refresh indicator.

### 4. `select` to transform — and to **subscribe narrowly**

```ts
const count = useQuery({
  queryKey: todoKeys.lists(),
  queryFn: fetchTodos,
  select: (todos) => todos.length,    // component only re-renders when length changes
});
```

`select` runs after every fetch but the component only re-renders when the selected output changes by reference (or shallow-equals, depending on config). Combined with the dedup of identical query keys, this is React Query's render-optimisation lever.

### 5. Render optimisation rules

- Many components calling `useQuery` with the same key share one network request and one cached entry.
- Each `useQuery` subscriber re-renders on cache update **only if their `select` (or full data) changed**.
- Prefer multiple `useQuery` calls with narrow `select` over one big query feeding props down.

### 6. Mutations: invalidate at the end, optimistic when fast feedback matters

Default flow:

```ts
onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
```

Optimistic flow (cache-touching):

```ts
onMutate: async (input) => {
  await qc.cancelQueries({ queryKey: todoKeys.lists() });
  const prev = qc.getQueryData(todoKeys.lists());
  qc.setQueryData(todoKeys.lists(), (old) => [...old ?? [], optimistic(input)]);
  return { prev };
},
onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(todoKeys.lists(), ctx.prev),
onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.lists() }),
```

v5 alternative: read `mutation.variables` in render to draw a pending row without touching the cache.

### 7. Don't sync server state into client state

The classic anti-pattern:

```tsx
// ❌
const { data } = useQuery(...);
const [items, setItems] = useState([]);
useEffect(() => setItems(data ?? []), [data]);
```

`data` is already a render-stable value. Just use it. If you need to *edit* a copy (forms), drive the form library with `data` as `defaultValues` and let the form own its state from there.

### 8. Errors are values

Don't try-catch the hook. The hook returns `{ error, isError }`. Wrap fetch errors meaningfully in your `queryFn`:

```ts
queryFn: async ({ signal }) => {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new HttpError(r.status, await r.text());
  return r.json();
}
```

Global handling: `queryCache: new QueryCache({ onError })` for cross-cutting concerns (toasts, auth redirects on 401).

### 9. Testing

- Wrap renders in a fresh `QueryClient` per test with `retry: false`, `gcTime: Infinity`.
- Mock at the network boundary (MSW), not the hook.
- Tests of the data-fetching component should reflect real loading→success/error transitions.

---

## Zustand — the patterns TKDodo prescribes

### Pattern 1: only export custom hooks

```ts
// ❌
export const useBearStore = create<BearState>(...);

// ✅
const useBearStore = create<BearState>(...);
export const useBears = () => useBearStore((s) => s.bears);
export const useFish  = () => useBearStore((s) => s.fish);
export const useBearActions = () => useBearStore((s) => s.actions);
```

Components subscribe to atomic slices. If you ever add a field to the store, no consumer accidentally re-renders for it.

### Pattern 2: actions in one stable object, selected atomically

```ts
type Store = {
  bears: number;
  fish: number;
  actions: {
    increasePopulation: () => void;
    eatFish: () => void;
  };
};

const useBearStore = create<Store>((set) => ({
  bears: 0,
  fish: 10,
  actions: {
    increasePopulation: () => set((s) => ({ bears: s.bears + 1 })),
    eatFish: () => set((s) => ({ fish: s.fish - 1 })),
  },
}));

export const useBearActions = () => useBearStore((s) => s.actions);
```

`actions` is a stable reference (never reassigned), so subscribing to the whole `actions` object is fine. Components that only dispatch don't need to read state at all.

### Pattern 3: multiple small stores, not one mega-store

Each store owns one concern. Combine in components via custom hooks. Most apps need very few stores because server state isn't here.

### Pattern 4: business logic lives in the store, not in components

The store exposes verbs (`addToCart(item)`), not setters (`setCart(newCart)`). Components fire the verb; the store decides what changes.

### Pattern 5: scope stores via React Context when needed

Global stores have drawbacks:
- Can't initialise with props.
- Tests must reset the store between runs.
- Instantiating a component twice shares state — usually wrong.

The fix: keep the *store instance* in React Context (not the values).

```ts
import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

const BearStoreCtx = createContext<ReturnType<typeof createBearStore> | null>(null);

const createBearStore = (initial: { bears: number }) =>
  createStore<BearStore>((set) => ({
    bears: initial.bears,
    actions: {
      increase: () => set((s) => ({ bears: s.bears + 1 })),
    },
  }));

export function BearStoreProvider({ initial, children }: Props) {
  const storeRef = useRef<ReturnType<typeof createBearStore>>();
  if (!storeRef.current) storeRef.current = createBearStore(initial);
  return <BearStoreCtx.Provider value={storeRef.current}>{children}</BearStoreCtx.Provider>;
}

const useBearStore = <T,>(sel: (s: BearStore) => T) => {
  const store = useContext(BearStoreCtx);
  if (!store) throw new Error('Missing BearStoreProvider');
  return useStore(store, sel);
};

export const useBears = () => useBearStore((s) => s.bears);
export const useBearActions = () => useBearStore((s) => s.actions);
```

Now the store is:
- Initialisable with props.
- Naturally scoped to a subtree (Dashboard route, modal, list item with its own form).
- Trivially testable — just render under a Provider.

This is what React Query does with `QueryClientProvider`, what Redux does with `<Provider store>`. Move the store *instance* through Context; subscribers still read via Zustand's own subscription system, not Context (so no over-rendering).

### When to combine Zustand with Query

Zustand stores filters; the filter is in the query key:

```ts
// Filters live in Zustand (client state)
const useFilters = () => useFilterStore((s) => s.filters);
const useFilterActions = () => useFilterStore((s) => s.actions);

// Query depends on filters
function useFilteredTodos() {
  const filters = useFilters();
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => api.todos.list(filters),
  });
}
```

Change a filter → query key changes → React Query refetches automatically.

---

## React general — TKDodo themes

### Custom hooks are the architecture

Custom hooks are the only abstraction React gives you for behaviour-with-state. Use them generously:

- `useUser()` wraps the underlying query + selector.
- `useDebouncedSearch()` wraps state + effect + debouncing.
- `useDarkMode()` wraps the matchMedia + state + class toggle.

Components should read like prose: what they show, not how they get it.

### Use `useState` for one-time initializations

```tsx
// ❌ runs every render
const obj = expensive();
// ❌ runs every render, only memoises
const obj = useMemo(() => expensive(), []);
// ✅ runs once, lazy initial state
const [obj] = useState(() => expensive());
```

`useMemo` is a performance optimisation, not a correctness guarantee — React may discard memoised values. For values that must be created exactly once, use lazy `useState` or `useRef`.

### Don't fight URLs

URL state is shareable, browser-back-friendly, bookmarkable, and free. Filters, search, pagination, selected tab — these usually belong in the URL, not in a store.

```ts
// Next.js
const sp = useSearchParams();
const status = sp.get('status') ?? 'all';
```

---

## The mental shift

When you're tempted to reach for a state management library, ask:

1. Is this data the server's truth? → TanStack Query.
2. Should this URL be shareable? → Search params.
3. Is this purely UI for this subtree? → `useState` / `useReducer`.
4. Is this **client-only state shared across far-apart components**? → Zustand.

If your answer to #4 is "yes" only occasionally, you have a healthy architecture.
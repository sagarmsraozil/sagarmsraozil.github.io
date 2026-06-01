# Engineering Thinking

> Problem-solving methodology, the chess-player approach to software design, and frontend system design framework. Consult before any non-trivial feature or architectural decision.

## The Three Cognitive Modes

```
Phase 1 -- INTERROGATION   "Do I understand the problem deeply enough to solve it?"
Phase 2 -- SEARCH          "What are the possible solutions, and which one is strongest?"
Phase 3 -- REVIEW          "Does my chosen solution survive adversarial examination?"
```

Most engineers skip Phase 2 — they ask one question, get one answer, and immediately start poking holes. Phase 2 is where the best solutions live.

## The Candidate Move Method

When facing a non-trivial problem, generate **at least three candidates** before evaluating any:

```
Candidate 1 -- The Obvious Solution
"What would most engineers do here, immediately, without overthinking?"

Candidate 2 -- The Opposite Constraint
"What if the obvious constraint were removed?"
If the obvious solution adds a library, what if we wrote it in 40 lines?
If the obvious solution adds a new endpoint, what if we reused an existing one?

Candidate 3 -- The Simplest Possible Thing
"What is the smallest change to the existing system that produces the desired behaviour?"
Not the cleanest. Not the most extensible. The smallest.
```

If you can't generate three distinct candidates, you don't understand the problem well enough.

## Positional Evaluation

A chess player's real skill is evaluating positions, not calculating moves. For each candidate:

### 1. Option Activity — Does this keep future options open?
The candidate that closes off the fewest important options is in the best position.

### 2. Coupling Structure — Are the weaknesses minimal and explicit?
The candidate with the most explicit, minimal couplings is in the best position.

### 3. Initiative — Does this give you control or react to others?
The candidate that keeps initiative in your hands is in the best position.

## Finding Refutations

For each candidate, find its best refutation:

```
Data at scale        -> Does this still work with 10M rows? 10k concurrent requests?
Requirements change  -> What if the client adds a new field? Changes the pricing model?
Unexpected user      -> What's the worst valid input? What does a duplicate request do?
Dependency failure   -> What happens when Redis is down? When the DB is slow?
Codebase evolution   -> What happens when a new enum value is added?
```

If the refutation requires rethinking the core -> discard the candidate.
If no refutation can be found -> this is your strongest candidate.

## The Quiet Move

Small investments that don't solve the immediate problem but dramatically improve the position for future work:

- `assertCannotReach` in every switch statement -> compile-safe future enum extensions
- A typed `env.ts` parsed by Zod at startup -> bad config fails the build, not the user
- Query key factories per feature -> surgical invalidation forever
- Design tokens as CSS custom properties -> theme switching becomes one attribute change
- `error.tsx` and `loading.tsx` per meaningful segment -> no bare white screens

**Ask:** "Is there a quiet move available that costs less now but produces a better position later?"

## Frontend System Design — The Seven Axes

Every meaningful frontend system has a position on each of these:

### 1. Rendering Strategy
Static (SSG), Server-rendered (SSR), Incremental (ISR), Client-only (CSR), Hybrid (App Router). Pick per-route.

### 2. Data Fetching Boundary
Server (RSC, loaders) for first paint. Client (TanStack Query) for interactivity. Hybrid for live updates.

### 3. State Location
Default order: **URL -> server -> local -> global**. Reach for global only when nothing else fits.

| State type | Put it in |
|---|---|
| URL-shareable filter | URL search params |
| Server data | TanStack Query / server fetch |
| Local UI (open/close) | `useState` |
| Cross-tree client | Zustand |
| Form input | TanStack Form or `useState` |

### 4. Composition Unit
Pages are thin, features carry logic, primitives are shared.

### 5. Styling and Design Tokens
CSS custom properties at runtime, SCSS for compile-time helpers. CSS Modules for scoping.

### 6. Performance Budgets
```
LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 600ms
JS bundle < 200KB gzipped, CSS < 50KB gzipped
```

### 7. Resilience
Network failure -> retry + actionable error UI. Stale cache -> revalidation. Schema drift -> Zod at boundaries.

## The Chess-Player Loop for a UI Feature

```
1. INTERROGATE the requirement
   - Who is this for? What's the success criterion? What's the failure mode?

2. SEARCH the solution space -- three candidates minimum
   - The obvious solution. The opposite constraint. The simplest possible thing.
   - For each: option activity, coupling structure, initiative.

3. REVIEW -- adversarial check
   - What if data is huge? What if the user does this twice quickly?
   - What if the API returns the wrong shape? What if a junior touches this in 6 months?
```

## Common System-Design Traps

| Trap | Fix |
|---|---|
| "Let's put it in Redux/Zustand" | URL -> server -> local -> global (in that order) |
| "We'll add caching later" | Cache layout is a first-design concern |
| Client components all the way down | Push `'use client'` to the leaves |
| Designing components, not data flow | Decide what data each component owns first |
| "Just fetch in useEffect" | Pick a server-state library before any non-trivial UI |
| Performance work without measurement | Lighthouse + RUM is non-negotiable |

## TKDodo Integration Patterns

### Server state != client state
TanStack Query for server, Zustand for client, URL for shareable. Never mix.

### Query key factories per feature
```ts
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (f: Filter) => [...todoKeys.lists(), f] as const,
  detail: (id: string) => [...todoKeys.all, 'detail', id] as const,
}
```

### Zustand: only export custom hooks with atomic selectors
```ts
const useBearStore = create<State>(...)
export const useBears = () => useBearStore((s) => s.bears)
export const useBearActions = () => useBearStore((s) => s.actions)
```

### Custom hooks are the architecture
Components read like prose: what they show, not how they get it.

### URL state is best state
Anything shareable, back-button-able, or bookmarkable goes in the URL.

## The Five Rules of Thumb

1. **Server state != client state.** TanStack Query for the first, Zustand only for the second.
2. **URL state is best state.** Shareable, back-button-friendly, free.
3. **Hooks over Effects.** If you can compute it during render or in a handler, don't `useEffect`.
4. **Atomic selectors.** Subscribing to "the store" instead of "the field" is the most common Zustand bug.
5. **Validate at boundaries, trust within.** Zod once at the edge; pure typed code in the middle.

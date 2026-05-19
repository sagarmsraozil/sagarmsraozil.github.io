# Frontend Knowledge Pack — Index

> A web-structured knowledge base for working on React/Next.js frontends. Optimised for LLM context: each file is a self-contained decision-rule reference card. Cross-links create the web — no file is read in isolation.

## The pack

| File | Topic | Version pin | Read when |
| --- | --- | --- | --- |
| [01-react-fundamentals.md](./01-react-fundamentals.md) | React core mental model, hooks, Effects, Suspense, R19 features | React 19.2 | Starting any React work |
| [02-nextjs-app-router.md](./02-nextjs-app-router.md) | App Router, RSC, Server Actions, caching, Next 16 changes | Next.js 16 | Designing routes / pages |
| [03-tanstack-query.md](./03-tanstack-query.md) | Server-state cache, queries, mutations, keys, SSR | Query v5 | Any remote data |
| [04-tkdodo-patterns.md](./04-tkdodo-patterns.md) | Distilled best practices (Query + Zustand + React) | Library-agnostic | Always — read after each tool |
| [05-zustand-atomic.md](./05-zustand-atomic.md) | Zustand v5, atomic selectors, Context-scoped stores | Zustand v5 | Client state needed |
| [06-zod-validation.md](./06-zod-validation.md) | Schema validation at boundaries | Zod v4 | Any untrusted input |
| [07-tanstack-form.md](./07-tanstack-form.md) | Form library, validators, async, mutations | Form v1 | Form-heavy surfaces |
| [08-sass-modern-starter.md](./08-sass-modern-starter.md) | Modern SMACSS + Flex/Grid + Sass modules | Dart Sass 1.77+ | Sass-based styling |
| [09-frontend-system-design.md](./09-frontend-system-design.md) | Meta — how to think about frontend systems | – | Before any non-trivial feature |
| `airbnb-homepage-system-design.pdf` | Worked system-design article | – | Reference example |

## The web — how concepts connect

```
                            [09 System Design]
                                    │
                  ┌─────────────────┼─────────────────┐
                  ▼                 ▼                 ▼
        [01 React]         [02 Next.js]       Performance/Resilience
            │                   │
            │           Server/Client boundary
            │                   │
            ▼                   ▼
       ┌────────────────────────────────────┐
       │  Where does state live?            │
       └────────────────────────────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
     [03 TanStack Query]  [05 Zustand]      URL / local useState
     (server state)       (client state)    (always default first)
            │                   │
            └────┬──────────────┘
                 ▼
        [04 TKDodo Patterns]
        (integration-level wisdom)
                 │
                 ▼
     ┌───────────────────────┐
     │  At every boundary    │
     └───────────────────────┘
            │
            ▼
       [06 Zod]
       (validation)
            │
            ▼
       [07 TanStack Form]    [08 Sass Modern]
       (form surfaces)        (styling layer)
```

## The decision tree (start here for any feature)

```
Step 1 — Where does the data live?
    Server (DB)             → use [02] App Router, [03] Query
    URL                     → use Next/TanStack router search params
    Local UI                → useState in component
    Cross-tree client       → [05] Zustand
    Form input              → [07] TanStack Form

Step 2 — Where does it cross trust boundaries?
    HTTP request            → [06] Zod safeParse before use
    URL params              → [06] Zod with z.coerce
    Form submission         → [06] Zod via [07] form validator
    External API response   → [06] Zod at the fetch wrapper

Step 3 — How does the user see it?
    First view, no JS needed → Server Component [02]
    Interactive              → 'use client' leaf [01]
    Loading / errors         → loading.tsx / error.tsx [02]
    Optimistic mutation      → useOptimistic [01] or Query optimistic [03]

Step 4 — How does it stay correct over time?
    Mutations invalidate     → revalidateTag [02] or queryClient.invalidateQueries [03]
    Server pushes            → polling [03] or WebSocket + setQueryData [03]
    User comes back later    → staleTime / refetch policies [03]
```

## The five rules of thumb (memorise)

1. **Server state ≠ client state.** TanStack Query for the first, Zustand only for the second.
2. **URL state is best state.** Anything that should be shareable, back-button-able, or bookmarkable goes in the URL.
3. **Hooks over Effects.** If you can compute it during render or in an event handler, don't `useEffect`.
4. **Atomic selectors.** Subscribing to "the store" instead of "the field" is the most common Zustand bug.
5. **Validate at boundaries, trust within.** Zod once at the edge; pure typed code in the middle.

## Versions verified at pack creation

| Library | Version |
| --- | --- |
| React | 19.2 (Oct 2025, patches through 19.2.1 Dec 2025) |
| Next.js | 16 (Oct 2025; uses React Canary including 19.2 features) |
| TanStack Query | 5.84+ (v5 line) |
| Zustand | 5.0.13 (May 2026) |
| Zod | v4 stable (≥ 4.0.6 for clean TanStack interop) |
| TanStack Form | v1 stable (mid-2025) |
| Dart Sass | 1.77+ (modern API) |

If your project pins older versions, re-read these files with a grain of salt and verify the deltas — the conceptual frame still holds even when specific APIs differ.

## How to use this pack with Claude

When starting a new project, feed Claude:
1. **This index file** (`00-index.md`) — gives the map.
2. **Whichever files match the task** — typically [09], [01], [02], plus one of {[03], [05], [07]}.

When working on a specific feature:
1. Reference the **decision tree** above.
2. Open the **specific file** for the API you're touching.
3. The **TKDodo patterns** [04] file is the integration glue — read alongside anything else.

When debugging:
1. Open the relevant tool file and check the **anti-patterns table** at the bottom.
2. If the symptom matches an entry, the fix is usually one line.

## Maintenance

When library versions change, update only:
- The version pin at the top of the affected file.
- Any API signature in that file that has changed.
- The version table in this index.

Conceptual frames (mental models, decision trees, anti-patterns) usually outlive multiple major versions. Patch the surface, keep the foundation.
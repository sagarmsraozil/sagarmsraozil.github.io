# Next.js App Router

> Version pin: Next.js 16 (October 2025). Built on React 19.2. App Router is the default; Pages Router is in maintenance. Cross-refs: [01-react-fundamentals.md](./01-react-fundamentals.md), [03-tanstack-query.md](./03-tanstack-query.md).

## Mental model

Next.js App Router = **file-system routing over React Server Components**. The default is server; you opt in to client. Layouts nest. Loading and error UI are file conventions.

The five execution boundaries:
1. **Build time** — `generateStaticParams`, static pages.
2. **Request time on server** — Server Components, Route Handlers, Server Actions.
3. **Edge runtime** — middleware, edge route handlers (limited APIs).
4. **Client (browser)** — `'use client'` boundary, hooks, browser APIs.
5. **Cache layer** — Cache Components (`use cache`), Data Cache, Full Route Cache, Router Cache.

## File conventions (`/app`)

| File                | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `layout.tsx`        | Persistent wrapper for a segment + children. Receives `{ children }`. Doesn't unmount on navigation within segment. |
| `page.tsx`          | The leaf — makes the route publicly accessible.    |
| `loading.tsx`       | Suspense fallback for the segment.                  |
| `error.tsx`         | Error boundary (client component, `'use client'`). |
| `not-found.tsx`     | Rendered when `notFound()` is called or matches no route. |
| `route.ts`          | API route (Route Handler). Exports `GET`, `POST`, etc. |
| `template.tsx`      | Like layout but re-mounts on navigation.            |
| `default.tsx`       | Parallel-route fallback.                            |
| `global-error.tsx`  | Root-level error UI.                                |
| `middleware.ts` → `proxy.ts` | Edge logic before request hits route. **Renamed `proxy` in Next.js 16.** |

Special folders: `(group)` for route grouping without URL impact, `[param]` for dynamic, `[...slug]` catch-all, `[[...slug]]` optional catch-all, `@slot` for parallel routes, `(.)folder` for intercepting routes.

## Async request APIs (mandatory in Next.js 16)

Sync access is **removed**. All request-bound APIs return promises:

```tsx
// Next.js 16
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const cookieStore = await cookies();
  const h = await headers();
  return <h1>{slug}</h1>;
}
```

The codemod: `npx @next/codemod@canary upgrade latest`.

## Server vs Client Components

Default = Server. Opt into client with `'use client'` at the top of a file. That marks the **boundary**; everything imported from a client file remains client.

```
RSC tree:
  RootLayout (server)
    Page (server, async, fetches data)
      <ClientCard />  ← 'use client', interactive
        ChildComponent (also client, no need to repeat 'use client')
```

Rules:
- Server components can be `async`. They can `await` data directly.
- You cannot import server components into client components, but you can pass them as `children` or props.
- Don't pass functions, class instances, or `Date` objects across the boundary unless they're serialisable — they get serialised through RSC payload.
- Browser-only APIs (`window`, `document`, `localStorage`) — client only.

## Data fetching

Server Components fetch directly with `fetch` (extended) or any async API:

```tsx
// app/blog/page.tsx — server component
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60, tags: ['posts'] }
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
export default async function Page() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}
```

`fetch` options (Next.js extensions):
- `cache: 'force-cache' | 'no-store'`
- `next: { revalidate: seconds, tags: string[] }`
- Use `revalidateTag('posts')` or `revalidatePath('/blog')` from Server Actions to invalidate.

**Default caching (Next.js 15+):** `fetch` is uncached by default. `GET` Route Handlers uncached by default. You opt in to caching explicitly.

### Cache Components (Next.js 16, stable)

```tsx
// Mark a function or component as cacheable
'use cache';
async function getPosts() {
  return await db.posts.findMany();
}
// Use cacheLife / cacheTag to control TTL and invalidation (no more unstable_ prefix in 16)
```

### Parallel data fetching

```tsx
// Avoid waterfalls — request in parallel
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

## Streaming and Suspense

Wrap slow data in `<Suspense>` to stream the rest of the page:

```tsx
export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowSection />
      </Suspense>
    </>
  );
}
```

`loading.tsx` creates an automatic Suspense boundary at the segment level.

### Partial Pre-rendering → Cache Components (Next.js 16)

Static shell prerendered + CDN-served, dynamic holes streamed at request. In Next.js 16 this graduated into the **Cache Components** model. If you were using `experimental.ppr` in Next.js 15, stay on 15 canary until you migrate.

## Server Actions

Functions marked with `'use server'`. Callable from client components, executed on the server. They're POST endpoints under the hood.

```tsx
// app/actions.ts
'use server';
export async function updateName(formData: FormData) {
  const name = formData.get('name') as string;
  await db.users.update({ name });
  revalidateTag('user');
}

// In a client component
<form action={updateName}>...</form>
```

Pair with `useActionState` (R19) for stateful forms with progressive enhancement.

**Security:** every Server Action is a public endpoint. Validate inputs (use [Zod](./06-zod-validation.md)). Check auth inside the action. Never trust client-passed IDs without checking ownership.

## Route Handlers (`route.ts`)

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ title: z.string().min(1) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json(parsed.error, { status: 400 });
  const created = await db.posts.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
```

Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. Return `Response` or `NextResponse`.

## Middleware → Proxy (Next.js 16)

`middleware.ts` is now `proxy.ts`. The runtime is Node.js; the edge runtime is no longer supported in proxy.

```ts
// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  if (!req.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
```

If you need edge runtime, keep using `middleware.ts` for now (transitional).

## Navigation

```tsx
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

<Link href="/about" prefetch>About</Link>

const router = useRouter();
router.push('/dashboard');
router.replace('/login');
router.refresh();        // re-fetches current route from server, keeps client state
router.back();
```

Next.js 16: routing/navigation got a complete overhaul — layout deduplication on prefetch, incremental prefetching. You'll see more prefetch requests but lower total bytes.

## Metadata

```tsx
// Static
export const metadata: Metadata = { title: 'Home', description: '...' };

// Dynamic
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post.title, openGraph: { images: [post.image] } };
}
```

File conventions: `app/icon.png`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## Styling options (in order of preference for App Router)

1. **CSS Modules** — `Button.module.css`, scoped, zero runtime.
2. **Tailwind CSS** — works perfectly with RSC; recommended for new projects.
3. **Sass/SCSS** — built-in support (`Button.module.scss`). See [08-sass-modern-starter.md](./08-sass-modern-starter.md).
4. **CSS-in-JS** — works but needs client-component bridge (styled-components/Emotion via registry). Avoid if you can stay server.

## Client-side caching layers

| Layer            | Scope              | Invalidate via                              |
| ---------------- | ------------------ | ------------------------------------------- |
| Request memo     | Single request     | Per-request, automatic                      |
| Data Cache       | All requests       | `revalidateTag`, `revalidatePath`, `revalidate` |
| Full Route Cache | Build / on revalidate | Same as above                               |
| Router Cache     | Browser, in-memory | `router.refresh()`, navigation              |

When using TanStack Query alongside (for client interactivity), don't double-cache. Server-load the initial data, then hand it to Query via `initialData`. See [03-tanstack-query.md](./03-tanstack-query.md).

## Pages Router status

Fully supported, no new features, security/critical-bug fixes only. New projects should use App Router. Existing Pages projects can stay; migration is incremental (App Router and Pages Router coexist).

## Common gotchas

| Symptom                                          | Cause                                                          |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `useState`/event handlers fail                   | Missing `'use client'` at top of file                          |
| Hydration mismatch                               | Server rendered different output than client (e.g. `Date.now()`, `Math.random()`, locale formatting) |
| Stale data after Server Action                   | Forgot `revalidateTag`/`revalidatePath`                         |
| "params should be awaited" error                 | Next.js 16 — params are async now                              |
| `headers()`/`cookies()` throws "outside request" | Called from a non-request context (build, top-level module)    |
| Big client bundle                                | Too much `'use client'`; push state down to leaves             |
| Image looks blurry / slow                        | Use `next/image` with `priority` for LCP                        |

## Production checklist

- [ ] `next/image` for all images (with `priority` on hero / LCP element).
- [ ] `next/font` for fonts (no FOUT, self-hosted).
- [ ] `loading.tsx` and `error.tsx` at meaningful boundaries.
- [ ] Server Actions validate input with [Zod](./06-zod-validation.md) and check auth.
- [ ] Public `route.ts` endpoints rate-limited.
- [ ] `revalidateTag` wired into mutation flows.
- [ ] `'use client'` boundaries pushed as far down the tree as practical.
- [ ] Metadata: static where possible, dynamic only where needed.
- [ ] CSP headers in `proxy.ts` (CVEs in 2025 affected RSC; keep Next.js patched).

## Quick decision tree

```
New page needs interactivity?
  no  → server component (default), fetch directly
  yes → split: server component fetches data + renders shell,
        client component handles state/events as a leaf
Data is per-user / per-request?
  yes → server fetch, no cache (or short revalidate)
  no  → 'use cache' with cacheTag for surgical invalidation
Need to mutate?
  inside a form → Server Action + useActionState
  client-only flow → Route Handler + TanStack Query mutation
```
# Component Map

> Every component in the project, its props, render boundary (server/client), and relationships. Consult when adding sections, modifying component APIs, or debugging render issues.

## Component Hierarchy

The site is a CV-style single page whose section order mirrors amitj.me/cv.

```
RootLayout (server)                    — layout.tsx
├── ConstellationBackground (client)   — fixed, z-index: 0, ambient 2D-canvas network (see 04-design-system.md)
└── HomePage (server)                  — page.tsx
    ├── Header (client)                — 'use client', scroll + menu + CV modal state
    │   └── CVModal (client)           — 'use client', modal with PDF iframe
    ├── IntroSection (server)          — profile header block: name/title/photo/contact/visa/CTAs
    ├── SummarySection (server)        — SectionLabel + narrative summary + spoken languages
    ├── SkillsSection (server)
    │   └── SectionLabel
    ├── ExperienceSection (server)
    │   ├── SectionLabel
    │   └── ExperienceCard[]           — white card, bulleted achievements
    │       ├── StackTag[]
    │       └── ResourceLinks
    ├── ProjectsSection (server)
    │   ├── SectionLabel
    │   ├── ProjectCard[]              — detailed projects (Nexus, Aroma), bulleted
    │   │   └── StackTag[]
    │   └── AdditionalProjectCard[]    — "Earlier projects" (Hospital, Futsal)
    │       └── StackTag[]
    ├── AiEngineeringSection (server)  — House Green feature band
    │   └── SectionLabel
    ├── EducationSection (server)
    │   └── SectionLabel
    ├── ReferencesSection (server)
    │   └── SectionLabel
    └── CTASection (server)            — House Green footer band: email, Download-CV button, socials, copyright
        └── SectionLabel
```

### Ambient Background (`components/ambient/`)

The constellation background (design modelled on amitj.me), mounted once in `layout.tsx` — outside `HomePage`, so it persists as a single instance regardless of what the page renders. See [04-design-system.md](./04-design-system.md#ambient-background) for the design rationale and [07-react-nextjs-patterns.md](./07-react-nextjs-patterns.md) for the canvas lifecycle pattern.

| Module | Role |
|---|---|
| `ConstellationBackground.tsx` | Mounts the canvas, owns the renderer lifecycle via one `useEffect` (canonical Effect use case — a browser API subscription, not a data transform), wires `resize`/`scroll`/`pointermove`/`pointerdown`/`visibilitychange`, and suppresses bursts on interactive elements and the CV dialog |
| `src/lib/constellation/renderer.ts` | `ConstellationRenderer` class — node seeding, drift physics, pointer pull, BFS burst propagation, ambient pulses, and the 2D-canvas draw loop. Reads its two colours from CSS tokens (`readPalette()`) |
| `src/lib/constellation/config.ts` | `CONSTELLATION_CONFIG` — every tunable number in one place |
| `src/hooks/useReducedMotion.ts` | Live `matchMedia` via `useSyncExternalStore`; re-checks on change since the OS setting can flip mid-session |

Zero server-component involvement — this is the one part of the tree that's a pure client leaf mounted directly from the server-rendered `RootLayout`, which is exactly the pattern doc 07 already recommends ("push `'use client'` as far down the tree as possible").

## Section Components

All section components follow the same pattern:
- Accept `data` prop typed from `@/types/portfolio`
- Props wrapped in `Readonly<>`
- Render semantic HTML (`<section>`, `<article>`)
- Paired with `*.module.scss` file
- Server components by default (no `'use client'`)

| Component | File | Data Prop | Section ID | Notes |
|---|---|---|---|---|
| IntroSection | `sections/IntroSection.tsx` | `HeaderData` | — | Profile header: name, title + stack line, round photo, contact line (`·` separated), work-rights/visa, CTAs (See work / Download CV) |
| SummarySection | `sections/SummarySection.tsx` | `SummaryData` | `#summary` | Bold heading + narrative summary + spoken-language pills |
| SkillsSection | `sections/SkillsSection.tsx` | `SkillsData` | `#skills` | 8 categories in one white card, inline text with dots |
| ExperienceSection | `sections/ExperienceSection.tsx` | `ExperienceData` | `#experience` | Entries via ExperienceCard (bulleted) |
| ProjectsSection | `sections/ProjectsSection.tsx` | `ProjectsData` | `#projects` | Detailed ProjectCard[] + "Earlier projects" AdditionalProjectCard[] |
| AiEngineeringSection | `sections/AiEngineeringSection.tsx` | `AiEngineeringData` | `#ai-engineering` | House Green feature band, heading + short prose |
| EducationSection | `sections/EducationSection.tsx` | `EducationData` | `#education` | 2 institutions, clickable links |
| ReferencesSection | `sections/ReferencesSection.tsx` | `ReferencesData` | `#references` | 5 people with initials avatars, LinkedIn links |
| CTASection | `sections/CTASection.tsx` | `CTAData` | `#contact` | House Green band (`--green-house`), email link, Download-CV button, social links, copyright |

## Sub-Components (within sections/)

| Component | Props | Used By |
|---|---|---|
| ExperienceCard | `entry: ExperienceEntry` | ExperienceSection — white card, bulleted `<ul>`, optional stack and links |
| ProjectCard | `project: ProjectEntry` | ProjectsSection — white card, name/description, bulleted `<ul>`, stack, links, optional code note |
| AdditionalProjectCard | `project: EarlierProject` | ProjectsSection — compact card for earlier projects |

## UI Primitives (components/ui/)

| Component | Props | Purpose |
|---|---|---|
| SectionLabel | `text: string`, `className?: string`, `as?: 'p' \| 'h2'` | 13px uppercase eyebrow in Starbucks Green above section headings (default `<p>`). On dark bands, override the colour with a two-class selector (`.ai .aiLabel`) so stylesheet order can't break it |
| StackTag | `label: string` | Full pill, `--green-light` fill, House Green 13px/600 label |
| ResourceLinks | `links: ResourceLinkData[]`, `label?: string` | **The single outbound-link primitive.** Small-caps group label + row of Green Accent outlined pill chips (icon · label · optional note), 44px min tap target. Server component — adds zero client JS. Group label derives from data: all `kind: 'repo'` → "Source", else "Visit" |
| icons.tsx | `className?: string` | `ExternalIcon` (Lucide arrow-up-right) and `GithubIcon` (Lucide github, line style). Inline SVG, `aria-hidden`, no dependency and no CDN — the static export must not request external assets |
| CVModal | `isOpen: boolean`, `onClose: () => void`, `pdfHref: string` | White 12px-radius modal with PDF iframe, Green Accent download pill, Escape to close |

**All outbound links go through `ResourceLinks`.** Before this primitive existed, each card styled its own `<a>` as 13px muted text with no underline, border, or icon — making links the least visible element on the card. Don't reintroduce ad-hoc link styling; add to `links[]` in the data instead.

Note: `ExperienceCard`'s company name is deliberately **not** a link. Linking the heading *and* showing chips would mean two links to different URLs from one card, one of which (a 28px heading with only a hover colour change) had no affordance at all.

## Client Components

| Component | Why Client | State Used |
|---|---|---|
| Header | Scroll listener, hamburger toggle, CV modal trigger | `scrolled`, `menuOpen`, `cvOpen` |
| CVModal | Modal behavior, keyboard handling, focus management | Uses `useEffect` + `useRef` |
| ConstellationBackground | Owns a 2D canvas and its rAF loop — a canonical Effect use case | `useReducedMotion` (`useSyncExternalStore`); no React state at all — the `ConstellationRenderer` instance lives inside the effect |

## Data Flow

```
portfolio.json
    ↓ (imported at build time)
page.tsx (casts to PortfolioData)
    ↓ (destructured and passed as props)
Each section component receives its typed slice
    ↓ (renders HTML)
Static HTML output in /out
```

## How to Add a New Section

1. Create `src/components/sections/NewSection.tsx` + `.module.scss`
2. Define the data interface in `src/types/portfolio.ts`
3. Add the data key to `PortfolioData` interface
4. Add content to `src/data/portfolio.json`
5. Import and render in `src/app/page.tsx` in the correct position
6. Add section ID (e.g. `id="new-section"`) if it needs anchor navigation
7. Update `portfolio.json` navigation links if needed

## Accessibility Patterns Used

- Semantic HTML: `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<address>`
- ARIA: `aria-label` on navs, `aria-expanded` on hamburger, `aria-modal` on CVModal
- `role="list"` on reference items
- Keyboard: Escape closes CVModal
- Focus management: CVModal receives focus on open via `ref.focus()`
- Global `:focus-visible` outline (Green Accent) in `globals.scss` — applies site-wide; the `house-band` mixin switches it to white on dark bands
- Global `@media (prefers-reduced-motion: reduce)` collapses all transitions/animations to near-zero
- ConstellationBackground: `aria-hidden="true"` on the whole wrapper (it is decoration, screen readers should never announce it); `prefers-reduced-motion` is watched live, not read once; the canvas never intercepts pointer events (`pointer-events: none`) so it cannot block or steal focus from anything

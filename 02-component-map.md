# Component Map

> Every component in the project, its props, render boundary (server/client), and relationships. Consult when adding sections, modifying component APIs, or debugging render issues.

## Component Hierarchy

The site is a CV-style single page whose section order mirrors amitj.me/cv.

```
RootLayout (server)                    — layout.tsx
└── HomePage (server)                  — page.tsx
    ├── Header (client)                — 'use client', scroll + menu + CV modal state
    │   └── CVModal (client)           — 'use client', modal with PDF iframe
    ├── IntroSection (server)          — profile header block: name/title/photo/contact/visa/CTAs
    ├── SummarySection (server)        — SectionLabel + narrative summary + spoken languages
    ├── SkillsSection (server)
    │   └── SectionLabel
    ├── ExperienceSection (server)
    │   ├── SectionLabel
    │   └── ExperienceCard[]           — bulleted achievements
    │       ├── CaseFile (client)      — optional, only when entry.case is set
    │       └── StackTag[]
    ├── ProjectsSection (server)
    │   ├── SectionLabel
    │   ├── ProjectCard[]              — detailed projects (Nexus, Aroma), bulleted
    │   │   ├── CaseFile (client)      — optional, only when project.case is set
    │   │   └── StackTag[]
    │   └── AdditionalProjectCard[]    — "Earlier projects" (Hospital, Futsal)
    │       └── StackTag[]
    ├── AiEngineeringSection (server)
    │   └── SectionLabel
    ├── EducationSection (server)
    │   └── SectionLabel
    ├── ReferencesSection (server)
    │   └── SectionLabel
    └── CTASection (server)            — email, Download-CV button, socials, copyright
        ├── SectionLabel
        └── BriefComposer (client)     — renders null until all 4 cases are attempted
```

### The Diagnosis Layer (`components/game/`)

An opt-in interactive layer on top of Experience and Projects — see [05-content-strategy.md](./05-content-strategy.md) for the mechanic and [07-react-nextjs-patterns.md](./07-react-nextjs-patterns.md) for the `useSyncExternalStore` state pattern.

| Component | Role | Mounted by |
|---|---|---|
| CaseFile | The core mechanic: `<details>` fallback pre-hydration, three-option picker post-hydration | ExperienceCard, ProjectCard (only when `entry.case`/`project.case` is present) |
| CaseProgress | "Cases N/4" chip; returns `null` until the first case is attempted | Header |
| BriefComposer | Post-completion outreach draft (reason picker + pre-filled `mailto:`); returns `null` until all 4 cases are attempted | CTASection |

Supporting, non-component modules:
- `src/lib/caseStore.ts` — localStorage-backed external store (answers keyed by case id)
- `src/lib/cases.ts` — `CASE_REGISTRY` (the 4 case ids + labels) and `TOTAL_CASES`
- `src/hooks/useHydrated.ts` — hydration-safe "is client" signal
- `src/hooks/useCaseProgress.ts` — atomic selectors (`useCaseAnswer`, `useAllAnswers`, `useSolvedCount`) over the store

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
| SummarySection | `sections/SummarySection.tsx` | `SummaryData` | `#summary` | Serif heading + narrative summary + spoken languages block |
| SkillsSection | `sections/SkillsSection.tsx` | `SkillsData` | `#skills` | 7 categories, inline text with dots |
| ExperienceSection | `sections/ExperienceSection.tsx` | `ExperienceData` | `#experience` | Entries via ExperienceCard (bulleted) |
| ProjectsSection | `sections/ProjectsSection.tsx` | `ProjectsData` | `#projects` | Detailed ProjectCard[] + "Earlier projects" AdditionalProjectCard[] |
| AiEngineeringSection | `sections/AiEngineeringSection.tsx` | `AiEngineeringData` | `#ai-engineering` | Serif heading + short prose |
| EducationSection | `sections/EducationSection.tsx` | `EducationData` | `#education` | 2 institutions, clickable links |
| ReferencesSection | `sections/ReferencesSection.tsx` | `ReferencesData` | `#references` | 5 people with initials avatars, LinkedIn links |
| CTASection | `sections/CTASection.tsx` | `CTAData` | `#contact` | Dark bg (#111111), email link, Download-CV button, social links, copyright |

## Sub-Components (within sections/)

| Component | Props | Used By |
|---|---|---|
| ExperienceCard | `entry: ExperienceEntry` | ExperienceSection — bulleted `<ul>`, linked company name, optional stack, optional CaseFile |
| ProjectCard | `project: ProjectEntry` | ProjectsSection — name/description, bulleted `<ul>`, stack, website/GitHub links, optional CaseFile |
| AdditionalProjectCard | `project: EarlierProject` | ProjectsSection — compact card for earlier projects |

## UI Primitives (components/ui/)

| Component | Props | Purpose |
|---|---|---|
| SectionLabel | `text: string`, `className?: string`, `as?: 'p' \| 'h2'` | Small caps label above section headings (default `<p>`) |
| StackTag | `label: string` | Monospace pill badge — surface bg, 12px JetBrains Mono |
| ResourceLinks | `links: ResourceLinkData[]`, `label?: string` | **The single outbound-link primitive.** Small-caps group label + row of bordered chips (icon · label · optional note), 44px min tap target. Server component — adds zero client JS. Group label derives from data: all `kind: 'repo'` → "Source", else "Visit" |
| icons.tsx | `className?: string` | `ExternalIcon` (Lucide arrow-up-right) and `GithubIcon` (Lucide github, line style). Inline SVG, `aria-hidden`, no dependency and no CDN — the static export must not request external assets |
| CVModal | `isOpen: boolean`, `onClose: () => void`, `pdfHref: string` | Modal with PDF iframe, blur overlay, Escape to close |

**All outbound links go through `ResourceLinks`.** Before this primitive existed, each card styled its own `<a>` as 13px muted text with no underline, border, or icon — making links the least visible element on the card. Don't reintroduce ad-hoc link styling; add to `links[]` in the data instead.

Note: `ExperienceCard`'s company name is deliberately **not** a link. Linking the heading *and* showing chips would mean two links to different URLs from one card, one of which (a 28px heading with only a hover colour change) had no affordance at all.

## Client Components

| Component | Why Client | State Used |
|---|---|---|
| Header | Scroll listener, hamburger toggle, CV modal trigger | `scrolled`, `menuOpen`, `cvOpen` |
| CVModal | Modal behavior, keyboard handling, focus management | Uses `useEffect` + `useRef` |
| CaseFile | Reads/writes case answers, detects hydration to swap fallback → picker | `useHydrated`, `useCaseAnswer` (both `useSyncExternalStore`) |
| CaseProgress | Reads solved-case count | `useSolvedCount` (`useSyncExternalStore`) |
| BriefComposer | Reads all answers, local reason/copy UI state | `useAllAnswers`, `useSolvedCount` + local `useState` |

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
- Global `:focus-visible` outline (gold) in `globals.scss` — applies site-wide, not just to new components
- Global `@media (prefers-reduced-motion: reduce)` collapses all transitions/animations to near-zero
- CaseFile: options are real `<button>`s in a `role="group"`; the response renders into an `aria-live="polite"` region; no-JS fallback is a native `<details>`/`<summary>` (keyboard- and screen-reader-operable with zero extra markup)

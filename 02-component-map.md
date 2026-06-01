# Component Map

> Every component in the project, its props, render boundary (server/client), and relationships. Consult when adding sections, modifying component APIs, or debugging render issues.

## Component Hierarchy

```
RootLayout (server)                    — layout.tsx
└── HomePage (server)                  — page.tsx
    ├── Header (client)                — 'use client', scroll + menu + CV modal state
    │   └── CVModal (client)           — 'use client', modal with PDF iframe
    ├── HeroSection (server)
    ├── ProblemSection (server)
    ├── WorkSection (server)
    │   ├── SectionLabel
    │   ├── CaseStudyCard[]
    │   │   └── StackTag[]
    │   └── AdditionalProjectCard[]
    │       └── StackTag[]
    ├── ExperienceSection (server)
    │   ├── SectionLabel
    │   └── ExperienceCard[]
    │       └── StackTag[]
    ├── AboutSection (server)
    │   └── SectionLabel
    ├── EducationSection (server)
    │   └── SectionLabel
    ├── SkillsSection (server)
    │   └── SectionLabel
    ├── ReferencesSection (server)
    │   └── SectionLabel
    └── CTASection (server)
        └── SectionLabel
```

## Section Components

All section components follow the same pattern:
- Accept `data` prop typed from `@/types/portfolio`
- Props wrapped in `Readonly<>`
- Render semantic HTML (`<section>`, `<article>`)
- Paired with `*.module.scss` file
- Server components by default (no `'use client'`)

| Component | File | Data Prop | Section ID | Notes |
|---|---|---|---|---|
| HeroSection | `sections/HeroSection.tsx` | `HeroData` | — | Two-weight headline, dual CTAs, thin divider |
| ProblemSection | `sections/ProblemSection.tsx` | `ProblemData` | — | Italic intro, body paragraphs |
| WorkSection | `sections/WorkSection.tsx` | `WorkData` | `#work` | 3 case studies + 2 earlier projects |
| ExperienceSection | `sections/ExperienceSection.tsx` | `ExperienceData` | `#experience` | Experience entries with ExperienceCard |
| AboutSection | `sections/AboutSection.tsx` | `AboutData` | `#about` | Photo placeholder (initials "SM"), languages list |
| EducationSection | `sections/EducationSection.tsx` | `EducationData` | — | 2 institutions, clickable links |
| SkillsSection | `sections/SkillsSection.tsx` | `SkillsData` | — | 5 categories, inline text with dots |
| ReferencesSection | `sections/ReferencesSection.tsx` | `ReferencesData` | — | 5 people with initials avatars, LinkedIn links |
| CTASection | `sections/CTASection.tsx` | `CTAData` | `#contact` | Dark bg (#111111), email link, social links |

## Sub-Components (within sections/)

| Component | Props | Used By |
|---|---|---|
| CaseStudyCard | `study: CaseStudy` | WorkSection |
| AdditionalProjectCard | `project: AdditionalProject` | WorkSection |
| ExperienceCard | `entry: ExperienceEntry` | ExperienceSection |

## UI Primitives (components/ui/)

| Component | Props | Purpose |
|---|---|---|
| SectionLabel | `text: string`, `className?: string`, `as?: 'p' \| 'h2'` | Small caps label above section headings (default `<p>`) |
| StackTag | `label: string` | Monospace pill badge — grey bg, 12px JetBrains Mono |
| CVModal | `isOpen: boolean`, `onClose: () => void`, `pdfHref: string` | Modal with PDF iframe, blur overlay, Escape to close |

## Client Components (only 2)

| Component | Why Client | State Used |
|---|---|---|
| Header | Scroll listener, hamburger toggle, CV modal trigger | `scrolled`, `menuOpen`, `cvOpen` |
| CVModal | Modal behavior, keyboard handling, focus management | Uses `useEffect` + `useRef` |

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

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
    │       └── StackTag[]
    ├── ProjectsSection (server)
    │   ├── SectionLabel
    │   ├── ProjectCard[]              — detailed projects (Nexus, Aroma), bulleted
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
| IntroSection | `sections/IntroSection.tsx` | `HeaderData` | — | Profile header: name, title + stack line, round photo, contact line (`·` separated), work-rights/visa, CTAs (See work / Download CV) |
| SummarySection | `sections/SummarySection.tsx` | `SummaryData` | `#summary` | Serif heading + narrative summary + spoken languages block |
| SkillsSection | `sections/SkillsSection.tsx` | `SkillsData` | `#skills` | 6 categories, inline text with dots |
| ExperienceSection | `sections/ExperienceSection.tsx` | `ExperienceData` | `#experience` | Entries via ExperienceCard (bulleted) |
| ProjectsSection | `sections/ProjectsSection.tsx` | `ProjectsData` | `#projects` | Detailed ProjectCard[] + "Earlier projects" AdditionalProjectCard[] |
| AiEngineeringSection | `sections/AiEngineeringSection.tsx` | `AiEngineeringData` | `#ai-engineering` | Serif heading + short prose |
| EducationSection | `sections/EducationSection.tsx` | `EducationData` | `#education` | 2 institutions, clickable links |
| ReferencesSection | `sections/ReferencesSection.tsx` | `ReferencesData` | `#references` | 5 people with initials avatars, LinkedIn links |
| CTASection | `sections/CTASection.tsx` | `CTAData` | `#contact` | Dark bg (#111111), email link, Download-CV button, social links, copyright |

## Sub-Components (within sections/)

| Component | Props | Used By |
|---|---|---|
| ExperienceCard | `entry: ExperienceEntry` | ExperienceSection — bulleted `<ul>`, linked company name, optional stack |
| ProjectCard | `project: ProjectEntry` | ProjectsSection — name/description, bulleted `<ul>`, stack, website/GitHub links |
| AdditionalProjectCard | `project: EarlierProject` | ProjectsSection — compact card for earlier projects |

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

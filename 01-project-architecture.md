# Project Architecture

> Quick-reference for the full tech stack, file tree, build pipeline, and deployment. Read this first when touching anything structural.

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router, static export) | 15.3.2 |
| UI | React | 19.0.0 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Sass (CSS Modules, `*.module.scss`) | 1.77.0 |
| Fonts | Google Fonts via `next/font` (Lato, Playfair Display, JetBrains Mono) | — |
| Linting | ESLint + `eslint-config-next` | 9.x |
| Deploy | GitHub Pages via GitHub Actions | — |
| Node | 20 (CI) | — |

## File Tree

```
PersonalWebsite/
├── .github/workflows/deploy.yml    # CI/CD — builds and deploys to GitHub Pages
├── public/
│   ├── Sagar-Mishra-CV.pdf         # Resume (served statically, opened in CVModal)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── .nojekyll
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: fonts, metadata, JSON-LD schemas
│   │   ├── page.tsx                # Home page: imports all sections, passes data
│   │   └── globals.scss            # CSS reset + custom properties (design tokens)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # 'use client' — scroll detection, hamburger, CV modal trigger
│   │   │   └── Header.module.scss
│   │   ├── sections/               # 9 section components + 3 sub-components
│   │   │   ├── HeroSection.tsx + .module.scss
│   │   │   ├── ProblemSection.tsx + .module.scss
│   │   │   ├── WorkSection.tsx + .module.scss
│   │   │   ├── CaseStudyCard.tsx + .module.scss
│   │   │   ├── AdditionalProjectCard.tsx + .module.scss
│   │   │   ├── ExperienceSection.tsx + .module.scss
│   │   │   ├── ExperienceCard.tsx + .module.scss
│   │   │   ├── AboutSection.tsx + .module.scss
│   │   │   ├── EducationSection.tsx + .module.scss
│   │   │   ├── SkillsSection.tsx + .module.scss
│   │   │   ├── ReferencesSection.tsx + .module.scss
│   │   │   └── CTASection.tsx + .module.scss
│   │   └── ui/
│   │       ├── CVModal.tsx + .module.scss
│   │       ├── SectionLabel.tsx + .module.scss
│   │       └── StackTag.tsx + .module.scss
│   ├── data/
│   │   └── portfolio.json          # Single source of truth for all content
│   └── types/
│       ├── portfolio.ts            # TypeScript interfaces for all data shapes
│       └── declarations.d.ts
├── next.config.ts                  # output: 'export', images: unoptimized, trailingSlash
├── tsconfig.json                   # strict, path alias @/* -> ./src/*
└── package.json
```

## Build & Deploy

```bash
npm run dev       # Dev server with hot reload
npm run build     # Static export to /out
npm run start     # Serve built site
npm run lint      # ESLint check
```

### Next.js Config

```ts
output: 'export'        // Static site generation — no server
images: { unoptimized: true }  // Required for static export
trailingSlash: true      // URLs end with /
```

### GitHub Actions Pipeline (`.github/workflows/deploy.yml`)

- Trigger: push to `master` or manual dispatch
- Steps: checkout -> Node 20 -> `npm ci` -> `npm run build` -> upload `out/` -> deploy to GitHub Pages
- Concurrency: cancels in-progress deploys

### Site URL

`https://sagarmsraozil.github.io`

## Key Architectural Decisions

1. **Single-page portfolio** — one route (`page.tsx`), anchor-link navigation (`#work`, `#experience`, `#about`, `#contact`)
2. **Static export** — no server runtime, pure HTML/CSS/JS served from CDN
3. **Data-driven** — all content in `portfolio.json`, typed via `portfolio.ts`, passed as props
4. **Minimal client JS** — only `Header` and `CVModal` are `'use client'`; all sections are Server Components
5. **CSS Modules** — scoped styling per component, zero runtime CSS-in-JS
6. **No external state library** — `useState` in Header is the only state; everything else is static props
7. **No images** — avatar uses initials fallback; references use computed initials

## Path Alias

`@/*` maps to `./src/*` in `tsconfig.json`. Use for all imports:

```ts
import type { PortfolioData } from '@/types/portfolio'
import { Header } from '@/components/layout/Header'
```

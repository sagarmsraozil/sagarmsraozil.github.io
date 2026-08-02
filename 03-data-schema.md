# Data Schema

> The single source of truth is `src/data/portfolio.json`. Every content change goes there. Types live in `src/types/portfolio.ts`. Read this file when editing content or adding new data fields.

## Portfolio JSON Structure

```
portfolio.json
├── meta              — title, description, phone, location, workRights, social{linkedin,github,x}
├── navigation        — header name + nav links array (anchors + CV download)
├── header            — name, title, titleStack, photoSrc, photoAlt, workRights, contact{}, 2 CTAs
├── summary           — label, heading, body[], languages[]
├── skills            — label, categories[]
├── experience        — label, heading, entries[] (bulleted)
├── projects          — label, heading, entries[] + earlierLabel, earlier[]
├── aiEngineering     — label, heading, body[]
├── education         — label, entries[]
├── references        — label, heading, people[], closing
└── cta               — label, heading, body[], email, cvHref, links[], copyright
```

Section render order (mirrors amitj.me/cv): Intro → Summary → Skills → Experience → Projects → AI-Assisted Engineering → Education → References → Contact.

## TypeScript Interfaces (from `src/types/portfolio.ts`)

### Navigation
```ts
NavLink:    { label, href, newTab?, download? }
NavData:    { name, links: NavLink[] }
```

### Header (Intro block)
```ts
ContactLink:   { label, href }
HeaderCTA:     { label, href }
HeaderContact: { location, phone, phoneHref, email, links: ContactLink[] }
HeaderData:    { name, title, titleStack, photoSrc, photoAlt, workRights, contact: HeaderContact, ctaPrimary: HeaderCTA, ctaSecondary: HeaderCTA }
```

### Summary
```ts
Language:    { name, level }
SummaryData: { label, heading, body: string[], languages: Language[] }
```

### Diagnosis case (optional, on Experience/Project entries)
```ts
CaseOption: { id, label, correct: boolean, response }
CaseData:   { symptom, prompt, options: CaseOption[], diagnosis }
```
Exactly 3 `options`. `correct` picks which option's response is treated as the "right call" for
styling purposes only — all three responses are written to be substantive, never a buzzer.
`symptom`, `prompt`, and `diagnosis` are the only case text guaranteed to render in the static
(no-JS/crawler) HTML, via a native `<details>` fallback — see [07-react-nextjs-patterns.md](./07-react-nextjs-patterns.md).

### Outbound links (shared by Experience, Projects, Earlier projects)
```ts
ResourceLinkData: { label, href, note?, kind?: 'site' | 'repo' }
CodeNote:         { text, linkLabel?, linkHref? }
```
`kind` picks the icon (`repo` → GitHub mark, otherwise → external arrow) and drives the group
label ("SOURCE" when every link is a repo, else "VISIT"). `note` is the small second line inside
a chip — used to mark `programiz.pro` as *"the product I built"* vs `programiz.com` as *"parent
site"*, and to flag the one E-Ticketing repo that lives under a teammate's account.

`CodeNote` is for projects with **no** public code: it states the repo is private and offers a
walkthrough, with `linkHref` a `mailto:`. Prefer this over silence — an unexplained absence of
links on your strongest projects reads worse than a stated reason.

> **Superseded (2026):** `GithubLink`, `ExperienceEntry.companyUrl`, `ProjectEntry.websiteUrl`,
> and `githubLinks[]` were all replaced by `links[]`. Don't reintroduce per-card link fields.

### Experience
```ts
ExperienceEntry: { id, company, product, role, period, location, tags[], bullets: string[], stack?, links?: ResourceLinkData[], case?: CaseData }
ExperienceData:  { label, heading, entries: ExperienceEntry[] }
```

### Projects
```ts
ProjectEntry:  { id, name, description, period, tags[], bullets: string[], stack[], links?: ResourceLinkData[], codeNote?: CodeNote, case?: CaseData }
EarlierProject:{ id, name, period, tags[], summary, stack[], links?: ResourceLinkData[] }
ProjectsData:  { label, heading, entries: ProjectEntry[], earlierLabel, earlier: EarlierProject[] }
```

### AI-Assisted Engineering
```ts
AiEngineeringData: { label, heading, body: string[] }
```

### Education
```ts
EducationEntry: { institution, location, period, degree, url }
EducationData:  { label, entries: EducationEntry[] }
```

### Skills
```ts
SkillCategory: { name, items: string[] }
SkillsData:    { label, categories: SkillCategory[] }
```

### References
```ts
ReferencePerson: { name, role, company, linkedinUrl }
ReferencesData:  { label, heading, people: ReferencePerson[], closing }
```

### CTA
```ts
CTALink: { label, href }
CTAData: { label, heading, body[], email, cvHref, links: CTALink[], copyright }
```

### Root
```ts
MetaData: { title, description, phone, location, workRights, social: { linkedin, github, x } }
PortfolioData: { meta, navigation, header, summary, skills, experience, projects, aiEngineering, education, references, cta }
```

## Current Content Summary

| Section | Key Data Points |
|---|---|
| Intro (header) | Name, "Full-Stack Engineer" + stack line (incl. Django), photo (`/sagar.jpeg`), contact (Melbourne VIC · phone · email · LinkedIn · GitHub), work-rights ("Full working rights in Australia.") |
| Summary | "I work out what to build before I build it." — 4 narrative paragraphs + 3 spoken languages (English, Nepali, Hindi) |
| Skills | 7 categories: Languages, Frameworks & Libraries, Data, Architecture, Cloud & DevOps, Practices, Tools |
| Experience | 2 entries: Jobs.ai (Intern/Team Lead, Feb–May 2026, Melbourne), ParewaLabs/Programiz (SWE, Oct 2021–Nov 2023, Kathmandu) — bulleted, both carry a `case` |
| Projects | Detailed: Nexus, Aroma (both carry a `case`). Earlier: Hospital E-Ticketing, Futsal Finder |
| AI-Assisted Engineering | "The tools speed up the work. The judgment stays mine." — 2 paragraphs |
| Education | VIT Melbourne (Master's, Feb 2024–Jul 2026), Softwarica Kathmandu (BSc, Nov 2018–Oct 2021) |
| References | 5 people from Programiz (Sanjeev, Ranjit, Raman, Abidit, Shirish) |
| CTA | Email: sagarcrcoc@gmail.com, Download CV (`/Sagar_Mishra_CV.pdf`), Links: LinkedIn, GitHub, X, copyright |

## Common Edit Tasks

### Add a new experience entry
1. Add entry to `portfolio.json` → `experience.entries[]`
2. Required fields: `id`, `company`, `companyUrl` (string or null), `product`, `role`, `period`, `location`, `tags[]`, `bullets[]`; optional `stack[]`
3. Bullets render as a `<ul>`; the company name links out when `companyUrl` is set

### Add a new project
1. Detailed project → `projects.entries[]` (`ProjectEntry`: `id`, `name`, `description`, `period`, `tags[]`, `bullets[]`, `stack[]`, optional `links[]` / `codeNote` / `case`)
2. Compact "earlier" project → `projects.earlier[]` (`EarlierProject`: `id`, `name`, `period`, `tags[]`, `summary`, `stack[]`, optional `links[]`)

### Add or change an outbound link (site or repo)
1. Add a `ResourceLinkData` entry to the item's `links[]` — that's the only step; `ExperienceCard`, `ProjectCard`, and `AdditionalProjectCard` all render `ResourceLinks` automatically
2. Set `kind: 'repo'` for source code, `kind: 'site'` (or omit) for websites — this picks the icon and the group label
3. Use `note` when the destination needs a word of explanation ("the product I built", "teammate's repo")
4. Never hand-roll an `<a>` in a card — see [02-component-map.md](./02-component-map.md) for why the primitive exists

### Add a diagnostic case to an Experience or Project entry
1. Add a `case: CaseData` object to the entry in `portfolio.json` (see the "Diagnosis case" interface above) — exactly 3 `options`, one `correct: true`
2. Register the entry's `id` + a short label in `CASE_REGISTRY` in `src/lib/cases.ts` (used by the progress chip and the outreach draft — keep it in sync or the total/labels drift)
3. Write all 3 option `response` strings as substantive, never punitive — see [05-content-strategy.md](./05-content-strategy.md) for the "nobody loses" rule
4. No component change needed — `ExperienceCard`/`ProjectCard` already render `CaseFile` whenever `entry.case`/`project.case` is present

### Add a new skill category
1. Add entry to `portfolio.json` → `skills.categories[]`
2. Required fields: `name`, `items: string[]`

### Add a navigation link
1. Add entry to `portfolio.json` → `navigation.links[]`
2. Required fields: `label`, `href`; optional: `newTab`, `download`
3. Links with `download: true` trigger the CV modal instead of navigation
4. Anchor links (`href: "#skills"`) must match a section `id`

### Update personal photo
1. Add image file to `public/`
2. Set `header.photoSrc` in `portfolio.json` to the path (e.g. `"/sagar.jpeg"`) and `header.photoAlt`
3. Also update the Person JSON-LD `image` in `src/app/layout.tsx` and OG/Twitter image paths

### Update the CV PDF
1. Replace `public/Sagar_Mishra_CV.pdf` (keep the filename, or update every reference)
2. The path appears in `navigation.links[]` (CV), `header.ctaSecondary.href`, and `cta.cvHref`

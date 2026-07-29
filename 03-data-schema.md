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

### Experience
```ts
ExperienceEntry: { id, company, companyUrl: string | null, product, role, period, location, tags[], bullets: string[], stack? }
ExperienceData:  { label, heading, entries: ExperienceEntry[] }
```

### Projects
```ts
GithubLink:    { label, href }
ProjectEntry:  { id, name, description, period, tags[], bullets: string[], stack[], websiteUrl: string | null, githubLinks: GithubLink[] }
EarlierProject:{ id, name, period, tags[], summary, stack[], githubLinks: GithubLink[] }
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
| Intro (header) | Name, "Full-Stack Engineer" + stack line, photo (`/sagar.jpeg`), contact (Melbourne VIC · phone · email · LinkedIn · GitHub), work-rights/visa (subclass 485) |
| Summary | "I work out what to build before I build it." — 4 narrative paragraphs + 3 spoken languages (English, Nepali, Hindi) |
| Skills | 6 categories: Languages, Frameworks & Libraries, Data, Architecture, Cloud & DevOps, Tools |
| Experience | 2 entries: Jobs.ai (Intern/Team Lead, Feb–May 2026, Melbourne), ParewaLabs/Programiz (SWE, Oct 2021–Nov 2023, Kathmandu) — bulleted |
| Projects | Detailed: Nexus, Aroma. Earlier: Hospital E-Ticketing, Futsal Finder |
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
1. Detailed project → `projects.entries[]` (`ProjectEntry`: `id`, `name`, `description`, `period`, `tags[]`, `bullets[]`, `stack[]`, `websiteUrl`, `githubLinks[]`)
2. Compact "earlier" project → `projects.earlier[]` (`EarlierProject`: `id`, `name`, `period`, `tags[]`, `summary`, `stack[]`, `githubLinks[]`)

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

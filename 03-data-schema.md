# Data Schema

> The single source of truth is `src/data/portfolio.json`. Every content change goes there. Types live in `src/types/portfolio.ts`. Read this file when editing content or adding new data fields.

## Portfolio JSON Structure

```
portfolio.json
├── meta              — site title, description, social links
├── navigation        — header name + nav links array
├── hero              — headline (normal + bold), subheadline, 2 CTAs
├── problem           — label, heading, body paragraphs[]
├── work              — label, heading, intro, caseStudies[], additionalProjects[]
├── experience        — label, heading, entries[]
├── about             — label, headingLines[], photoSrc, body[], languages[]
├── education         — label, entries[]
├── skills            — label, categories[]
├── references        — label, heading, people[], closing
└── cta               — label, heading, body[], email, links[]
```

## TypeScript Interfaces (from `src/types/portfolio.ts`)

### Navigation
```ts
NavLink:    { label, href, newTab?, download? }
NavData:    { name, links: NavLink[] }
```

### Hero
```ts
HeroCTA:    { label, href }
HeroData:   { headlineNormal, headlineBold, subheadline, ctaPrimary: HeroCTA, ctaSecondary: HeroCTA }
```

### Problem
```ts
ProblemData: { label, heading, body: string[] }
```

### Work
```ts
CaseStudy:          { id, tags[], title, body[], stack[], github: string | null }
GithubLink:         { label, href }
AdditionalProject:  { id, name, period, tags[], summary, stack[], githubLinks: GithubLink[] }
WorkData:           { label, heading, intro, caseStudies[], additionalLabel, additionalProjects[] }
```

### Experience
```ts
ExperienceEntry: { id, company, product, role, period, location, tags[], body[], websiteUrl: string | null }
ExperienceData:  { label, heading, entries: ExperienceEntry[] }
```

### About
```ts
Language:  { name, level }
AboutData: { label, headingLines[], photoSrc: string | null, body[], languages: Language[] }
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
CTAData: { label, heading, body[], email, links: CTALink[] }
```

### Root
```ts
MetaData: { title, description, social: { linkedin, github } }
PortfolioData: { meta, navigation, hero, problem, work, experience, about, education, skills, references, cta }
```

## Current Content Summary

| Section | Key Data Points |
|---|---|
| Hero | "Most engineers build what you ask for..." / "The interesting ones ask..." |
| Problem | "A working product is not the same as a solved problem." — 5 paragraphs |
| Work | 3 case studies (Programiz Pro, Nexus, Aroma) + 2 earlier (Futsal Finder, Hospital E-Ticketing) |
| Experience | 1 entry: ApplyKart / Jobss AI, Intern — Team Lead, Feb–May 2026, Melbourne |
| About | Nepal origin, Melbourne based, ~6 years coding, 3 languages (English, Nepali, Hindi) |
| Education | VIT Melbourne (Master's, Feb 2024–Jul 2026), Softwarica Kathmandu (BSc, Nov 2018–Oct 2021) |
| Skills | 6 categories: Languages, Frameworks, Databases, Tools, Architecture |
| References | 5 people from Programiz (Sanjeev, Ranjit, Raman, Abidit, Shirish) |
| CTA | Email: sagarcrcoc@gmail.com, Links: LinkedIn, GitHub, X |

## Common Edit Tasks

### Add a new case study
1. Add entry to `portfolio.json` → `work.caseStudies[]`
2. Required fields: `id` (kebab-case), `tags[]`, `title`, `body[]`, `stack[]`, `github` (string or null)

### Add a new experience entry
1. Add entry to `portfolio.json` → `experience.entries[]`
2. Required fields: `id`, `company`, `product`, `role`, `period`, `location`, `tags[]`, `body[]`, `websiteUrl` (string or null)

### Add a new skill category
1. Add entry to `portfolio.json` → `skills.categories[]`
2. Required fields: `name`, `items: string[]`

### Add a navigation link
1. Add entry to `portfolio.json` → `navigation.links[]`
2. Required fields: `label`, `href`; optional: `newTab`, `download`
3. Links with `download: true` trigger CV modal instead of navigation

### Update personal photo
1. Add image file to `public/`
2. Set `about.photoSrc` in `portfolio.json` to the filename (e.g. `"/photo.jpg"`)
3. The AboutSection renders an `<img>` when `photoSrc` is not null, falls back to initials "SM" otherwise

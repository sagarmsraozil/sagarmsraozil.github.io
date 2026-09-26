# SEO & Metadata

> Everything about search engine optimization, structured data, social sharing, and metadata for this site. Consult when updating meta tags, improving search visibility, or adding pages.

## Current Metadata (in `layout.tsx`)

### Meta Tags

The description is a single `SITE_DESCRIPTION` constant reused across meta, OG, and Twitter.

```
Title:       "Sagar Mishra -- Full-Stack Engineer"
Description: "Full-stack engineer in Melbourne. Two years of production work at
              Programiz (100,000+ paid learners), recent technical lead at Jobss.ai.
              React, Next.js, Node.js, TypeScript, PostgreSQL, Laravel. Full working rights in Australia."
Keywords:    Sagar Mishra, full-stack engineer Melbourne, software engineer Melbourne,
             React developer Melbourne, Next.js developer, Node.js engineer,
             Laravel developer, Django developer, hire software engineer Melbourne,
             Programiz Pro engineer
```

### Open Graph

```
og:title       "Sagar Mishra -- Full-Stack Engineer"
og:description  <SITE_DESCRIPTION>
og:type        website
og:url         https://sagarmsraozil.github.io
og:siteName    "Sagar Mishra"
og:locale      en_AU
og:image       https://sagarmsraozil.github.io/sagar.jpeg
```

### Twitter Card

```
twitter:card        summary_large_image
twitter:title       "Sagar Mishra -- Full-Stack Engineer"
twitter:description  <SITE_DESCRIPTION>
twitter:creator     @SagarMi31569172
twitter:image       https://sagarmsraozil.github.io/sagar.jpeg
```

## JSON-LD Structured Data (in `layout.tsx <head>`)

### Person Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sagar Mishra",
  "jobTitle": "Full-Stack Engineer",
  "email": "sagarcrcoc@gmail.com",
  "telephone": "+61424308228",
  "url": "https://sagarmsraozil.github.io",
  "image": "https://sagarmsraozil.github.io/sagar.jpeg",
  "sameAs": [
    "https://www.linkedin.com/in/sagar-mishra-a3455121b/",
    "https://github.com/sagarmsraozil",
    "https://x.com/SagarMi31569172"
  ],
  "knowsAbout": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Laravel", "Django", "Full-stack Engineering", "Software Architecture"],
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Victorian Institute of Technology", "url": "https://vit.edu.au" },
    { "@type": "CollegeOrUniversity", "name": "Softwarica College of IT and E-commerce", "url": "https://softwarica.edu.np" }
  ],
  "address": { "@type": "PostalAddress", "addressLocality": "Melbourne", "addressCountry": "AU" }
}
```

### WebSite Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sagar Mishra",
  "url": "https://sagarmsraozil.github.io",
  "description": "Personal website of Sagar Mishra, full-stack engineer based in Melbourne."
}
```

## Static SEO Files (in `public/`)

### robots.txt
Standard crawlers directive — allows all bots.

### sitemap.xml
XML sitemap listing the site URL for search engines.

### .nojekyll
Disables Jekyll processing on GitHub Pages (required for Next.js static export).

## SEO Design Decisions

1. **Single-page site** — all content on one URL, maximizing content density for the primary landing page
2. **Semantic HTML** — `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<address>` for crawlers
3. **No JavaScript-dependent content** — all section text renders in the static HTML (Server Components)
4. **Keywords embedded naturally** — tech stack, role titles, and location woven into body copy
5. **Social links in JSON-LD** — `sameAs` array connects LinkedIn, GitHub, X profiles
6. **Canonical URL set** — prevents duplicate content issues

## Site URL

`https://sagarmsraozil.github.io`

Defined as `SITE_URL` constant in `layout.tsx`. Update there if domain changes.

## When to Update Metadata

- **Changed job title or location** — update `metadata.title`, `metadata.description`, `personSchema.jobTitle`, `personSchema.address`
- **New social profile** — add to `personSchema.sameAs[]` and `portfolio.json` → `cta.links[]`
- **New skill or technology** — add to `personSchema.knowsAbout[]` and `metadata.keywords[]`
- **Custom domain** — update `SITE_URL` in `layout.tsx`, `sitemap.xml`, and `robots.txt`
- **Added a photo** — update `personSchema.image`, `openGraph.images`, and `twitter.images` to match the actual file path (currently `/sagar.jpeg`)
- **Changed the description** — edit the single `SITE_DESCRIPTION` constant in `layout.tsx` (feeds meta, OG, and Twitter)

## SEO Thinking Framework (Distilled)

For a personal portfolio site, the core SEO principles are:

1. **Search is a matching problem** — optimize for what recruiters/collaborators actually search for (name, role + city, tech + city)
2. **Specificity is the signal** — "100,000+ paid learners" ranks better than "large-scale platform"
3. **Trust proxies matter** — LinkedIn/GitHub links, named references, university credentials all feed E-E-A-T
4. **The SERP is ground truth** — search your own name and target keywords to verify what Google actually shows
5. **Time compounds** — domain authority grows with consistent publishing and backlinks over months

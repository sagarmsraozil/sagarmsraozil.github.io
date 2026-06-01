# SEO & Metadata

> Everything about search engine optimization, structured data, social sharing, and metadata for this site. Consult when updating meta tags, improving search visibility, or adding pages.

## Current Metadata (in `layout.tsx`)

### Meta Tags

```
Title:       "Sagar Mishra -- Full-stack Engineer"
Description: "Full-stack engineer based in Melbourne. Two years of product experience
              at Programiz Pro (100,000+ learners). React, Next.js, Node.js.
              Open to engineering roles and serious collaboration."
Keywords:    Sagar Mishra, full-stack engineer Melbourne, software engineer Melbourne,
             React developer Melbourne, Next.js developer, Node.js engineer,
             hire software engineer Melbourne, Programiz Pro engineer
```

### Open Graph

```
og:title       "Sagar Mishra -- Full-stack Engineer"
og:description "Full-stack engineer based in Melbourne..."
og:type        website
og:url         https://sagarmsraozil.github.io
og:siteName    "Sagar Mishra"
og:locale      en_AU
```

### Twitter Card

```
twitter:card        summary
twitter:title       "Sagar Mishra -- Full-stack Engineer"
twitter:description "Full-stack engineer based in Melbourne..."
twitter:creator     @SagarMi31569172
```

## JSON-LD Structured Data (in `layout.tsx <head>`)

### Person Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sagar Mishra",
  "jobTitle": "Full-stack Engineer",
  "email": "sagarcrcoc@gmail.com",
  "url": "https://sagarmsraozil.github.io",
  "image": "https://sagarmsraozil.github.io/photo.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/sagar-mishra-a3455121b/",
    "https://github.com/sagarmsraozil",
    "https://x.com/SagarMi31569172"
  ],
  "knowsAbout": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Full-stack Engineering", "Software Architecture"],
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
- **Added a photo** — update `personSchema.image` to match the actual file path

## SEO Thinking Framework (Distilled)

For a personal portfolio site, the core SEO principles are:

1. **Search is a matching problem** — optimize for what recruiters/collaborators actually search for (name, role + city, tech + city)
2. **Specificity is the signal** — "100,000+ paid learners" ranks better than "large-scale platform"
3. **Trust proxies matter** — LinkedIn/GitHub links, named references, university credentials all feed E-E-A-T
4. **The SERP is ground truth** — search your own name and target keywords to verify what Google actually shows
5. **Time compounds** — domain authority grows with consistent publishing and backlinks over months

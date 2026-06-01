# Sagar Mishra's Personal Website — Wisdom Files

> 10 self-contained reference files capturing everything about this codebase, its design decisions, content strategy, and engineering patterns. Read the relevant file instead of exploring the codebase from scratch.

## The Wisdom Files

| # | File | Topic | Read when |
|---|---|---|---|
| 01 | [01-project-architecture.md](./01-project-architecture.md) | Tech stack, file tree, build/deploy, config, key architectural decisions | Starting any work; need to understand the project structure |
| 02 | [02-component-map.md](./02-component-map.md) | All components, props, hierarchy, client vs server boundaries, how to add sections | Adding/modifying components; debugging render issues |
| 03 | [03-data-schema.md](./03-data-schema.md) | portfolio.json structure, TypeScript interfaces, common edit tasks | Editing content; adding new data fields or sections |
| 04 | [04-design-system.md](./04-design-system.md) | Colors, typography, spacing, CSS variables, responsive rules, visual philosophy | Changing visual design; adding new styled components |
| 05 | [05-content-strategy.md](./05-content-strategy.md) | Persuasion architecture, section mechanics, copywriting voice, page order rationale | Editing copy; reordering sections; adding new content |
| 06 | [06-seo-metadata.md](./06-seo-metadata.md) | JSON-LD schemas, Open Graph, meta tags, sitemap, SEO decisions | Updating metadata; improving search visibility |
| 07 | [07-react-nextjs-patterns.md](./07-react-nextjs-patterns.md) | React 19 + Next.js 15 patterns, state placement, server/client boundary rules | Adding interactivity; new pages; changing rendering model |
| 08 | [08-sass-styling-guide.md](./08-sass-styling-guide.md) | CSS Modules with SCSS, design tokens, responsive patterns, modern Sass practices | Writing new component styles; modifying visual system |
| 09 | [09-engineering-thinking.md](./09-engineering-thinking.md) | Chess-player problem solving, frontend system design axes, TKDodo patterns | Before any non-trivial feature or architectural decision |
| 10 | [10-owner-profile.md](./10-owner-profile.md) | Sagar's career history, skills, education, references, contact info | Updating portfolio content; ensuring personal info accuracy |

## How the files connect

```
[01 Architecture]  +  [02 Components]  +  [03 Data]
        |                    |                 |
        +-------- code structure layer --------+
                             |
        [04 Design System]  +  [08 Sass Guide]
                   |                 |
                   +- visual layer --+
                             |
        [05 Content Strategy]  +  [06 SEO]  +  [10 Owner Profile]
                   |                 |               |
                   +------- content layer -----------+
                             |
        [07 React/Next.js]  +  [09 Engineering Thinking]
                   |                 |
                   +-- patterns & methodology layer -+
```

## Quick-start for common tasks

### "Change the content of a section"
Read: [03-data-schema.md](./03-data-schema.md) -> edit `src/data/portfolio.json`

### "Add a new section to the page"
Read: [02-component-map.md](./02-component-map.md) (how to add a section) + [03-data-schema.md](./03-data-schema.md) (data interface) + [08-sass-styling-guide.md](./08-sass-styling-guide.md) (styling patterns)

### "Change the visual design"
Read: [04-design-system.md](./04-design-system.md) (tokens & philosophy) + [08-sass-styling-guide.md](./08-sass-styling-guide.md) (implementation)

### "Update personal info or career details"
Read: [10-owner-profile.md](./10-owner-profile.md) (source of truth) -> update [03-data-schema.md](./03-data-schema.md) fields in `portfolio.json`

### "Improve SEO or metadata"
Read: [06-seo-metadata.md](./06-seo-metadata.md) -> edit `src/app/layout.tsx`

### "Add interactivity or a new feature"
Read: [07-react-nextjs-patterns.md](./07-react-nextjs-patterns.md) + [09-engineering-thinking.md](./09-engineering-thinking.md) (methodology)

### "Understand the build/deploy pipeline"
Read: [01-project-architecture.md](./01-project-architecture.md)

## Project versions (actual, not knowledge-pack reference)

| Dependency | Version |
|---|---|
| Next.js | 15.3.2 |
| React | 19.0.0 |
| TypeScript | 5.x |
| Sass | 1.77.0 |
| Node (CI) | 20 |

## Five rules of thumb

1. **Server state != client state.** TanStack Query for the first, Zustand only for the second.
2. **URL state is best state.** Anything shareable or bookmarkable goes in the URL.
3. **Hooks over Effects.** If you can compute it during render or in a handler, don't `useEffect`.
4. **Atomic selectors.** Subscribing to "the store" instead of "the field" is the most common Zustand bug.
5. **Validate at boundaries, trust within.** Zod once at the edge; pure typed code in the middle.

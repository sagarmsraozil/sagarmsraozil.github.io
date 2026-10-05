# Content Strategy

> The persuasion architecture, section mechanics, copywriting principles, and editorial voice. Consult when editing copy, reordering sections, or adding new content.

## Persuasion Architecture — The Visitor's Emotional Journey

```
Arrives with a problem (need to hire, need to collaborate, need to evaluate)
        |
Realises the problem is slightly different from what they thought
        |
Sees evidence that this person understands the real problem
        |
Begins to wonder what it would look like if this person worked on their thing
        |
Reaches the CTA already having mentally said yes
```

Every design and copy decision serves this arc. Nothing on the page is decorative.

> **Format note (2026 rebuild):** the site was restructured into a CV-style single page whose information architecture mirrors amitj.me/cv (sticky section nav → header block → factual, reverse-chronological sections). The tone is **hybrid**: narrative voice is preserved in the Summary; Experience, Projects, and Skills are factual and bulleted. The visual design is now the Starbucks-derived system in [04-design-system.md](./04-design-system.md).

> **Gamification removed (Sept 2026):** the interactive "Diagnosis Layer" (case-file quizzes on four entries, a "Cases N/4" header chip, and an unlock-on-completion email composer) was removed entirely, including the symptom/diagnosis copy. The page is plain CV content again: nothing to play, nothing gated. Don't reintroduce quiz mechanics without a fresh decision from Sagar.

> **The resume is the source of truth (Oct 2026):** where the site and `public/Sagar_Mishra_Resume.pdf` disagree on a fact (stack, metric, spelling), the resume wins. One deliberate exception: the site keeps the "Full-Stack Engineer" title (Sagar's decision). Site-only detail that doesn't contradict the resume is kept.

## Section-by-Section Mechanics

### Section 01 — Intro / Profile Header (Identity + Scannability)

**Mechanic:** A recruiter's first five seconds. Everything needed to place and contact the candidate, above the fold.

- Name (large, Starbucks Green), title, and a stack line kept from the old CV headline (`React · Next.js · Node.js · TypeScript · PostgreSQL · Laravel`).
- Round profile photo to the side — the CV-format equivalent of a résumé header.
- Contact line with `·` separators: location · phone · email · LinkedIn · GitHub. Work-rights/visa stated plainly (important for AU roles).
- Two CTAs: "See the work" (anchor) and "Download CV" (the PDF).

### Section 02 — Summary (Voice + Positioning)

**Mechanic:** The one section that keeps the narrative voice. Factual credentials first, then how this person actually works.

- Opens with the CV summary (Programiz scale, Jobss.ai technical-lead role, two connected systems built during the Master's), then a short paragraph on approach (asks questions before writing code).
- Bold sans heading, comfortable line height. No bolding inside body — paragraph rhythm does the work.
- Spoken languages listed simply at the end — no flags, no bars.

### Section 03 — Skills (ATS + Human Scanner)

**Mechanic:** Complete and easy to scan. A hiring manager finds a specific technology in under 5 seconds. Placed early, like the reference site.

- No skill bars, radar charts, or proficiency indicators.
- Eight categories, the old CV grouping kept on purpose with the resume's new items folded in (Languages, Frontend, Backend, Data, Testing & CI, Practices, Tools, Currently learning), items as inline text separated by dots. Docker and AWS sit under "Currently learning", because the resume is explicit that they're not yet production skills.

### Section 04 — Experience (Social Proof Through Specificity)

**Mechanic:** Bulleted achievements, reverse-chronological. Each bullet is a concrete thing built and why it mattered.

- Company name links out; period + location as right-aligned meta.
- Bullets, not prose — factual CV register.
- Stack tags are data, not decoration.

### Section 05 — Projects (Evidence of Range)

**Mechanic:** Systems built end to end, separated from paid work as on the CV.

- Nexus and Aroma detailed (bulleted, with stack). Hospital E-Ticketing and Futsal Finder kept as a compact "Earlier projects" group with GitHub links.

### Section 06 — AI-Assisted Engineering (Modern Signal)

**Mechanic:** Addresses head-on how the candidate uses agentic tooling — delegate, then verify. Short, in the narrative voice.

### Section 07 — CTA (Closing the Loop)

**Mechanic:** The sections above did the selling. CTA makes the next step obvious and low-friction.

- Dark background signals conclusion. No contact form — a direct email link, a Download-CV button, socials, and a copyright line.
- "I reply to every message" makes it feel safe to send something imperfect.

## Voice and Tone

> **Unslop pass (Oct 2026):** all copy was rewritten to remove AI-writing patterns. No em dashes anywhere in rendered copy (titles use `|` or `:`), no slogan closers, plain first person. Keep it that way when editing.

- **Confident but not arrogant.** State things directly. Don't hedge unnecessarily.
- **Specific over vague.** "100,000+ paid learners" not "large-scale platform."
- **Show the thinking, not just the output.** "The real problem was not X. It was Y."
- **No jargon for its own sake.** Technical terms only when they add precision.
- **No superlatives.** Don't say "passionate" or "world-class" — let the work speak.
- **Third person in case studies, first person in about/CTA.** The shift is intentional — professional distance in the work, personal directness in the close.

## Section Labels

Every section begins with a small-caps label above the heading:

| Section | Label |
|---|---|
| Summary | SUMMARY |
| Skills | TECHNICAL SKILLS |
| Experience | EXPERIENCE |
| Projects | PROJECTS |
| AI-Assisted Engineering | AI-ASSISTED ENGINEERING |
| Education | EDUCATION |
| References | REFERENCES |
| CTA | WHAT'S NEXT |

(The Intro/profile header has no small-caps label — it leads with the name.)

## The Page Order (and Why)

1. **Intro** — name, title, contact, visa; everything a recruiter needs up top
2. **Summary** — positioning in the candidate's own voice
3. **Skills** — scannable technology list, placed early like the reference site
4. **Experience** — bulleted proof, reverse-chronological
5. **Projects** — systems built end to end
6. **AI-Assisted Engineering** — how modern tooling is used responsibly
7. **Education** — academic credentials
8. **References** — named vouchers
9. **CTA** — close the loop (email + Download CV)

This mirrors amitj.me/cv while keeping the candidate's distinctive summary voice.

## What This Page Is Not

- No animations on scroll — fade-in is filler
- No project screenshots — they invite doubt when not in production
- No skill bars or radar charts — text-only, scannable
- No tech stack logos in a row — identical on every developer site
- No contact form — a direct email link and a Download-CV button instead

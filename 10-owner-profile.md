# Owner Profile

> Sagar Mishra's professional details, career history, education, skills, and contact info. Consult when updating portfolio content or ensuring accuracy of personal information.
>
> **Source of truth is `public/Sagar_Mishra_FullStack_Resume.pdf`** (Oct 2026). It replaces the earlier Oct 2026 resume and the Sept 2026 CV. Items marked *(earlier resume)* were on the previous Oct 2026 resume but cut from this one for space; they are still true and stay on the site. Where this file and the resume disagree, the resume wins; this file was re-synced to it in Oct 2026.
>
> **Deliberate exceptions (Sagar's decision):** the site uses the "Full-Stack Engineer" title (the resume says "Full stack software engineer"), and keeps site-only details the resume omits. Those are marked *(site-only)* below. Don't delete them.

## Identity

| Field | Value |
|---|---|
| Name | Sagar Mishra |
| Date of Birth | 14 December, 1999 |
| Email | sagarcrcoc@gmail.com |
| Phone | 0424308228 (resume: +61 424 308 228) |
| Location | Melbourne, Australia |
| Work rights | Full working rights in Australia (subclass 485) |
| Origin | Nepal |
| LinkedIn | https://www.linkedin.com/in/sagar-mishra-a3455121b/ |
| GitHub | https://github.com/sagarmsraozil |
| X/Twitter | https://x.com/SagarMi31569172 |
| Site title | Full-Stack Engineer (matches the resume) |

## Professional Experience

### Programiz Pro (Oct 2021 -- Nov 2023)

Organization: ParewaLabs. Role: Software Engineer, Kathmandu. EdTech platform: "Make learning to code easy and beginner friendly." Over 100,000 paid learners.

**Contributions (per resume):**
1. Course flow APIs in Node.js, TypeScript and MySQL, and the learner dashboard, for over 100,000 paid learners
2. Paddle payment integration. Wrote the webhooks and the checkout iframe messaging. Still in use today. *(earlier resume: every paid learner pays through it)*
3. Certificate engine in Node.js and TypeScript. Has issued over 100,000 verified completion certificates
4. Owned the online compiler. Fixed Python output arriving over the socket in pieces with a heartbeat that joins it into one response. *(earlier resume: around 23 million visits a month from Google search; fix made with the principal engineer)*
5. *(earlier resume)* sensAI, an LLM-backed tutor inside the exercise page. Learners ask it over 300 questions a day
6. End-to-end tests in Playwright and Cypress, run in a GitHub Actions CI workflow

**Site-only (not on the resume, kept):**
- Interactive learning paths for courses
- Conversion-focused landing pages
- Analytics (Mixpanel, Microsoft Clarity)

**Leadership:**
- Led "Programiz Reports" (a feature for beginners learning to program), team of six. Took it from content-team requirements to release in two weeks
- Whiteboard sessions, groomed backlogs, weekly delivery cycles
- Sat in on board-level product direction conversations

**Tools:** React.js, Next.js, Node.js, TypeScript, MySQL, Paddle, C#, Directus, Jira, Agile (Scrum/Kanban), Python, Playwright, Cypress, GitHub Actions

**Links:**
- Platform: https://programiz.pro/
- Compiler: https://www.programiz.com/python-programming/online-compiler/

### ApplyKart / Jobss AI (Feb 2026 -- May 2026)

Melbourne startup. Job/task distribution platform between employers and task-seekers. Live in production.

**Role:** Software Engineering Intern. Led four engineers and reviewed every pull request before it merged.

**Stack (per resume):** Laravel, PHP, Blade views built from Figma designs. *Not* React/Next.js. The site previously listed that stack for this role and was corrected in Sept 2026.

**Contributions (per resume):**
- Owned authentication and role-based access control for four roles, all checked against one permission model
- Employer workspace in Laravel and Blade. Applicants move through review, shortlist and rejection
- Marketplace search on one index that serves both sides, people looking for work and people looking to hire

**Site-only (not on the resume, kept):**
- Job/task posting dashboard
- Category-based marketing pages
- Paginated and cursor-based APIs
- Employee slot distribution (allocation) algorithm

**Website:** https://jobss.ai/

## Projects

Nexus and Aroma were built by a **team of three that Sagar led**, during the Master's. They are not solo personal projects. He architected both, wrote the spikes and specs, and reviewed every pull request, over 400 in two years. AI models implemented against the frozen specs (spec-driven development).

### Nexus: warehouse management platform (Feb 2025 -- Jan 2026)

Digital warehouse management system. Born from real problems running an anime apparel side business.

**Problems solved:** Missing stock tracking, no supplier onboarding workflow, irregular supply, chaotic market pricing, random stock fulfillment, no return-to-order flow, no stock pipeline visibility.

**Per resume:**
- Stock ledger in PostgreSQL with `SELECT FOR UPDATE` row locks, so two buyers cannot claim one unit
- Fulfilment pipeline: cron jobs batch retail orders, and each order is tracked as its own state machine
- Product drops modelled as a state machine through supplier onboarding, lot negotiation, intake and pricing
- Now being rebuilt as **e-warehouse** with an agentic workflow in Claude Code. Sagar writes the specs, agents implement, and he reviews every change

**Site-only (not on the resume, kept):** hierarchical labelled-tree digital warehouse, replenishment system, lot-level tracking, addon system for sales/discounts, return-to-order flow, order marshalling and allocation logic.

**Stack:** TypeScript, Node.js, PostgreSQL, Redis, Next.js (site also lists React)

### Aroma: multi-tenant eCommerce storefront (Mar 2024 -- Jan 2026)

Clothing marketplace for sellers currently relying on social media DMs. Built by the same team, same spec-driven process as Nexus.

**Per resume:**
- Tenancy model: each seller runs an isolated storefront on one shared backend
- Checkout reserves stock on order confirmation. An idempotency key stops a retry creating a duplicate order
- Buyer path designed front to back in Next.js: search, product pages, cart, checkout, order history
- Rendering split by page, server-side for the catalogue. Lighthouse put LCP under 2 seconds
- *(earlier resume)* Payments separated into their own service, with the eSewa and Khalti gateways behind one interface
- *(earlier resume)* Orders handed to Nexus through a shared Redis instance, with REST as the fallback. Catalogue cached in Redis

**Site-only (not on the resume, kept):** order-status view; the static-generation half of the rendering split; React Query and Zustand.

**Stack:** TypeScript, Node.js, PostgreSQL, Redis, Next.js (site also lists React, Directus)

### Futsal matchmaking app (Oct 2020 -- Jul 2021)

**Per resume:** Android app built in Kotlin and MongoDB. Players find venues and opponents by their preferences.

**Site-only (not on the resume, kept):** Tinder-style team matching, team creation, Clash of Clans-style dashboards, league/knockout/Champions League tournament formats, battle seasons with tier progression (Bronze to Champion), court booking. The linked repos below are a React/Node/MongoDB web version.

**Stack:** Kotlin (Android). Web repos: React.js, Node.js, Chart.js, MongoDB
**GitHub:** Backend: https://github.com/sagarmsraozil/FutsalBooking-Backend_Node- | Frontend: https://github.com/sagarmsraozil/FutsalBooking_Frontend-React-

### Hospital E-Ticketing Platform (Aug 2021 -- Oct 2021) *(site-only, not on the resume)*

University group project: online doctor appointment booking for Nepal.

**Features:** Digital hospital/doctor registration, weekly slot management, inversion test algorithm for double-booking prevention, dashboards for doctor/patient/admin, notification system, role-based auth.

**Stack:** React.js, Node.js, Chart.js
**GitHub:** Backend: https://github.com/sagarmsraozil/ETicketing-Backend | Frontend: https://github.com/Abishek180181/E-ticketing-Frontend

## Education

| Institution | Location | Period | Degree |
|---|---|---|---|
| Victorian Institute of Technology (VIT) | Melbourne, Australia | Feb 2024 -- Jul 2026 | Master of Information Technology and Systems (Software Engineering) |
| Softwarica College of IT and E-commerce | Kathmandu, Nepal | Nov 2018 -- Oct 2021 | BSc (Hons) Software Engineering |

## Technical Skills

As listed on the resume (Oct 2026):

**Languages & Frameworks:** TypeScript, JavaScript, Node.js, Express, Kotlin, PHP, Laravel, Python, SQL, React, Next.js
**Backend:** REST APIs, payment integration, webhooks, authentication, role-based access control, idempotency, caching
**Cloud Platforms:** Vercel. Currently learning AWS (EC2, RDS, S3) and Docker
**DevOps & Tools:** Git, GitHub Actions CI, Playwright, Cypress, Postman, Sentry, Jira, Directus, Claude Code
**Databases:** PostgreSQL (Postgres), MySQL, MongoDB, Redis, Drizzle, Sequelize, row-level locking
**Practices:** Code review, Agile, spec-driven development, AI-assisted development

New on the resume vs the old CV: Postman, Sentry, Vercel, Claude Code, payment integration, webhooks, idempotency, AI-assisted development.

Kept on the website though the resume omits them (they don't contradict it): HTML, CSS, React Query, Zustand, Tailwind CSS, server-side rendering, static generation, technical SEO, Django, multi-tenancy, state machines, schema design, concurrency control, Scrum, Kanban, sprint planning, requirements gathering, Trello, Asana, Mixpanel, Microsoft Clarity, Lighthouse, Java, C#, Mongoose, data modelling, microservices, monoliths, sharding, product analytics & instrumentation.

## Soft Skills

- **Leadership:** Led a team of six on Programiz Reports; led four engineers at Jobss.ai; led the team of three that built Nexus and Aroma
- **Whiteboard sessions:** Facilitated brainstorming for complex problems
- **Strategic thinking:** Board-level product direction discussions at ParewaLabs
- **Communication:** Understands professional vs day-to-day communication nuance

## Languages

| Language | Level |
|---|---|
| English | Fluent |
| Nepali | Native |
| Hindi | Fluent |

## Professional References (from Programiz)

| Name | Role | LinkedIn |
|---|---|---|
| Sanjeev Kumar Pandit | Principal Engineer | https://www.linkedin.com/in/sanjeevkpandit/ |
| Ranjit Bhatta | Founder | https://www.linkedin.com/in/ranjit-bhatta/ |
| Raman Koju | Project Manager | https://www.linkedin.com/in/raman-koju-89822622a/ |
| Abidit Shrestha | Full Stack Engineer | https://www.linkedin.com/in/abidit-shrestha-ba6707206/ |
| Shirish Shikhrakar | Chief Creative Officer | https://www.linkedin.com/in/sshikhrakar/ |

## Personal Norms

- Understand the scope and possible achievements before starting
- Stay close to responsibility
- Be authentic
- Be a source of trust for surroundings
- Respect the job and people
- Understand the problem before focusing on the outcome

## Hobbies

Reading, traveling, watching anime

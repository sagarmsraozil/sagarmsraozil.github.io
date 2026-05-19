# SEO Analyst Playbook — Study Agenda

> Companion outline for `02_SEO_Analyst_Playbook.pdf`.
> Goal: give you a scannable map of the whole playbook so you can dip into any section, track what you've internalised, and revisit the questions that matter.

---

## How to use this agenda

- Each `##` heading maps to a Part in the PDF.
- `Core idea` = the single sentence I want to remember if I forget everything else.
- `Key takeaways` = the operative claims, distilled.
- `Questions for me` = what to ask myself when applying that section.
- `Status` checkboxes are for you to tick as you study.

---

## Foreword — Why a playbook, not a checklist

- [ ] Read

**Core idea:** A checklist tells you *what* to do; a framework tells you *how to think*. Checklists go stale; reasoning compounds.

**Key takeaways**
- The playbook contains four kinds of material: first-principles breakdowns, chess-style mental models, diagnostic + solution frameworks, and a questions catalog.
- Thesis: live upstream in the reasoning, not downstream in the tactics — that's the only part that survives algorithm updates.

---

## Part 1 — First-Principles Thinking Applied to SEO

- [ ] Read
- [ ] Can re-derive Premises 1–5 from memory

**Core idea:** Strip SEO back to physical/economic reality, then rebuild. Tactics are downstream of premises; reasoning upstream survives algorithm changes.

### Premise 1 — Search is a matching problem
- Google is a market intermediary; the **searcher** is the real customer.
- Anything that improves searcher satisfaction *is* an SEO move (UX, speed, comprehensiveness, mobile).
- When a core update hurts rankings, ask "what was I getting away with that users didn't love?" — not "what did Google change?"

### Premise 2 — Attention is finite; the SERP is a marketplace
- 10 organic positions per SERP → ranking is **relative**, not absolute.
- Competition isn't context — it's the substance. SERP analysis *is* keyword research.
- Picking the wrong battle is the most expensive analyst mistake.
- "Better content" is meaningless without a named comparison.

### Premise 3 — Trust is the bottleneck
- Google can't verify quality directly → it uses proxies (backlinks, E-E-A-T, author history, citations).
- SEO at scale = a reputation game disguised as a content game.
- Invest in trust signals (author bios, niche consistency, partnerships) as deliberately as content.

### Premise 4 — Time is the most underrated variable
- Authority compounds over years. Algorithms re-evaluate on rolling time scales.
- **6-month rule:** evaluate major SEO investments on a 6–12 month horizon. Anyone using a 30-day window is using the wrong instrument.

### Premise 5 — The map is not the territory
- KWFinder, Ahrefs, Semrush, GSC are *models* of Google. None are ground truth.
- Rule: when the tool says one thing and the SERP says another, **the SERP wins**.

### Questions for me
- Can I re-derive title tags / mobile / backlinks / patience from these 5 premises alone?
- Am I optimising for Google, or for the searcher Google is trying to satisfy?
- What am I currently treating as ground truth that's actually a tool estimate?

---

## Part 2 — The Chess-Player's Mental Model

- [ ] Read
- [ ] Have an evaluation function for SERPs I can apply in <5 minutes
- [ ] Have memorised the blunders list

**Core idea:** SEO is positional, slow-clock, incomplete-information, compounding, and evaluation-driven — same as chess. Play it that way.

### Why the analogy holds
- Positional, incomplete-information, slow-clock, compounding, evaluation-driven.

### Phase 1 — Opening (choose the battlefield)
- Niche selection > tactics. Wide niche = playing NerdWallet. Narrow niche = your game.
- Control the centre — nail one cluster before sprawling.
- Develop every page with a purpose (informational / commercial / transactional).
- Don't move the same piece twice (no compulsive re-publishing).
- Castle early — get HTTPS, mobile, speed, indexability right *before* going on offence.

### Phase 2 — Middlegame (build positional advantage)
- **Outposts** = featured snippets — fortified positions competitors can't easily dislodge.
- **Pawn structure** = internal linking — every link reinforces every page.
- **Trade favourably** = prune underperforming pages so the strong ones get crawl budget + link equity.
- **Prophylaxis** = anticipate competitor moves. If they're about to publish a definitive guide on X, beat them to it.

### Phase 3 — Endgame (convert advantage)
- Ranking #1 without converting is a chess game won on the board, lost on the scoresheet.
- Priorities: page-level CRO, GSC→GA4 revenue tracking, defensive moves (refresh, internal links, monitoring).

### The evaluation function (rough starting weights)
| Factor | What I evaluate | Weight |
|---|---|---|
| Content quality | Depth, expertise, originality, freshness vs. top 3 | 25% |
| Search intent match | Does the page actually answer what users want? | 20% |
| Domain authority | Backlink profile + trust signals | 20% |
| Technical health | Indexability, speed, mobile, structured data | 15% |
| Internal linking | Is this page well-supported by other site pages? | 10% |
| UX & engagement | Layout, readability, bounce, dwell time, CTR | 10% |

> Force a score on every SERP candidate; don't trust gut.

### Calculate variations
- For every intervention, articulate the expected chain of effects (CTR → position → clicks → ...). No chain = no plan, just an action.

### Blunders to avoid (5-minute check before any big move)
- Noindexing important pages.
- URL migrations without 301s.
- PBN backlinks.
- Removing ranking content because stakeholders dislike it.
- Cannibalising your own pages.
- Building backlinks faster than is natural.

### Questions for me
- Where am I in the game right now — opening, middlegame, endgame?
- If I score this SERP using my evaluation function, where's the gap I can actually fill?
- Before this change goes live, am I about to commit one of the six blunders?

---

## Part 3 — The Diagnostic Framework: "Can this site rank?"

- [ ] Read
- [ ] Can run all 5 passes on a real site in ≤2 hours

**Core idea:** "Can this site rank?" is the wrong question — the answer is always "yes, for *something*." The real question: **for which queries, in what timeframe, with what investment?**

### Pass 1 — Is the site visible to Google at all?
- `site:domain.com` search → does indexed page count match reality?
- `/robots.txt` → no accidental `Disallow: /`.
- View source on key pages → no rogue `noindex`.
- GSC Coverage → check Excluded vs Indexed.
- HTTP status codes → 200s, not 301 chains or 404s.
- Canonicals → pointing at the correct URL, ideally self-canonical.

> **First-fix rule:** if Pass 1 fails, stop everything. Fixing visibility is the highest-leverage move possible.

### Pass 2 — Is the site technically healthy enough to compete?
- Speed (PageSpeed Insights, mobile) — <50/100 is a red flag.
- Core Web Vitals: LCP, INP, CLS — green on all three.
- Mobile-friendliness — Google's mobile-friendly test.
- HTTPS + no mixed-content warnings.
- Internal linking — orphan pages, depth from homepage, broken links (Screaming Frog).
- Schema — Rich Results Test on representative templates.
- Duplicate content — resolve with/without trailing slash, www, http variants.

### Pass 3 — Does content match search intent?
Work backwards:
1. What's the business actually selling/promoting?
2. What keywords would qualify a buyer? Map the full funnel (info / commercial / transactional).
3. For the top 10–20 keywords, is there a target page?
4. Does that page match the SERP's intent?
5. Is it comprehensive enough to compete with the current top 3?

Failure modes: intent mismatch, topical thinness, cannibalisation, missing pages, outdated content.

### Pass 4 — Trust signals
- Backlink profile (Ahrefs / LinkMiner / Majestic): referring domains, quality, anchor mix.
- Brand presence: unlinked mentions, social, Wikipedia, news.
- Author credentials visible.
- About / contact / privacy / legal pages present and complete.
- Domain age + publishing consistency.

### Pass 5 — Competitive environment
For the 10–20 keywords that matter:
- Who's in the top 10? Domain mix?
- Average DA/DR?
- Format that dominates (listicle / guide / product / video)?
- How recent is the ranking content?
- Which SERP features are present?

### The verdict — a one-page memo
- **Diagnosis** — what works, what's broken, what's missing.
- **Realistic targets** — 5–10 keywords winnable in 3–6 months, 5–10 in 12–18, which are out of reach.
- **Investment required** — content output, technical, link-building per tier.

> The honest verdict matters more than the encouraging one.

### Questions for me
- Did I pass Pass 1 before I touched anything else?
- Are my "winnable" labels based on the SERP, or based on tool difficulty scores?
- If this site truly can't compete, am I prepared to say so?

---

## Part 4 — The Solution Framework: How to actually win

- [ ] Read
- [ ] Can place any proposed intervention into the right layer

**Core idea:** Good plans are **sequenced, prioritised, falsifiable.** Each of the four layers is a precondition for the next.

### Plan properties
- Sequenced — work in physical order. Don't build content on a broken indexation problem.
- Prioritised — highest impact, lowest cost first.
- Falsifiable — every intervention has an expected outcome + measurement window.

### Layer 1 — Foundation (remove blockers)
- Indexability, speed, HTTPS, mobile usability, 3-click internal linking, critical schema.
- Often achievable in 2–6 weeks. Highest ROI work in the program.

### Layer 2 — Content alignment (rank what you already have)
**Striking-distance rule:** pages ranked 11–20 are the cheapest fastest wins.

Sequence:
1. Pull GSC query/page combos ranked 8–30 with meaningful impressions.
2. SERP-check each: intent, gaps, top 3 angles.
3. Rewrite: intent match, depth, freshness, title, meta.
4. Internal re-link: 3–5 new contextual links from related pages.
5. Resubmit to GSC. Wait 4–8 weeks. Measure.

### Layer 3 — Content expansion (topical hubs)
- **Pillar pages** = anchors of topical claim (rarely rank fast).
- **Cluster pages** = narrower, more rankable, link back to pillar.
- **Commercial pages** = product / service / comparison / review for bottom-funnel intent.
- Prioritise clusters: `(traffic estimate × commercial intent) / difficulty`. Highest first.

### Layer 4 — Authority building (trust signals)
- Linkable assets (original research, free tools, definitive guides).
- Digital PR — reporter pitches with newsworthy data.
- Targeted outreach (competitor backlink mining, broken-link, unlinked-mention reclamation).
- Guest content — only on truly relevant sites.
- Brand-building (podcasts, conferences, community).

### Effort budget across layers
| Phase | Foundation | Alignment | Expansion | Authority |
|---|---|---|---|---|
| Month 1–2 | 70% | 20% | 10% | — |
| Month 3–4 | 10% | 50% | 30% | 10% |
| Month 5–8 | — | 20% | 50% | 30% |
| Month 9+ | — | 15% | 40% | 45% |

### Situation playbooks (preloaded for common scenarios)
- **#4 but can't crack #1** → ruthless top-3 analysis, fill the specific gap (video / data / freshness), 3–5 targeted links, internal-link push, 8-week measurement.
- **Lost 30% in core update** → don't panic, diagnose which pages/queries lost, read Google's update notes + Search Quality Rater Guidelines, triage to target the quality bar, wait one full update cycle.
- **New site, zero authority** → niche down hard, KD <20 only for the first 50 articles, internal linking from day one, zero-cost backlinks (niche directories, small guest posts, small original research), 6–12 month horizon.
- **Big established site, flat traffic** → content audit, prune/consolidate/redirect zero-traffic-zero-backlink pages, identify high-impression declining-CTR pages, build a 6-month refresh schedule (one cornerstone per week).

### Questions for me
- For this intervention, what's the expected outcome and on what horizon?
- Am I trying to skip a layer? (Building Layer 4 without Layer 1 = a common, expensive trap.)
- Which of the four situations is this site closest to? Use that playbook as the starting point.

---

## Part 5 — The Questions Catalog

- [ ] Read
- [ ] Pull the right cluster of questions before each project / decision

**Core idea:** Senior vs junior is mostly about which questions get asked, in which order.

### About the business
- What is this business actually trying to do — revenue / leads / brand / retention?
- How does organic fit into the wider acquisition stack?
- LTV from an organic-acquired customer? Per-visit budget?
- Who are the *business* competitors (not just SERP competitors)?
- If SEO fully failed, what's the next-best channel? (Tells me risk tolerance.)

### About the audience
- Who is the searcher — job, mood, expertise?
- What does "good enough" look like to them?
- What language do *they* use vs. what we use?
- Where else do they research (Reddit, YouTube, TikTok, forums)?
- What's the next thing they'll need after this — can our site own that adjacency?

### About the SERP
- Why is the current #1 the current #1? Reverse-engineer.
- Which format dominates? Is the format an implicit part of the query?
- How recent is the top-ranking content?
- Which SERP features exist and what share of clicks do they take?
- Has the SERP changed in the last 6 months — new entrants, dropouts?
- Commercial / informational / mixed? What does that say about Google's read of intent?

### About the site
- Can Google crawl + index every important page?
- Mobile speed, mobile usability, Core Web Vitals?
- Internal linking — logical navigationally and topically?
- Any pages actively hurting rankings (thin / low quality / duplicate)?
- Author credentials, About, contact, policies — all in order?
- Off-site brand visibility?

### About each page I'm working on
- Single focus keyword? (If I can't name it in one phrase, the page has no strategy.)
- Search intent → does the page match it?
- How does this page compare to top 3 — what specifically am I beating?
- Which internal pages should link here, and which already do?
- Where in the funnel does this page sit — is the next step clear?
- When was this last updated? When next?

### When something changes
- Is this signal or noise? (Daily = noise. Weekly/monthly = signal.)
- Did anything change on my side recently?
- Did Google announce an update / change SERP features / run a layout test?
- Did competitors change anything?
- What single hypothesis explains all observed changes simultaneously?
- What's the cheapest experiment to distinguish my top hypothesis from runner-up?

### Before any big move
- What's the smallest version I could ship to test the idea?
- Worst-case outcome — could the business absorb it?
- If this works, how would I know? Metric + time horizon?
- Am I solving a real problem, or one I find intellectually interesting?
- Have I considered doing nothing?

---

## Part 6 — A 90-Day Personal Roadmap

- [ ] Read
- [ ] Picked the laboratory site
- [ ] Set up GSC + GA4
- [ ] Day-90 retrospective written

**Core idea (one sentence):** Pick one real site I care about, treat it as my laboratory, and run the diagnostic + solution frameworks weekly — measuring real outcomes, not absorbing theory.

### Days 1–14 — Foundation
- [ ] Set up GSC and GA4 on the lab site.
- [ ] Read Google's Search Quality Rater Guidelines, end-to-end.
- [ ] Pick one paid keyword tool (free trial) + one backlink tool.
- [ ] Run Screaming Frog crawl. Note technical issues.
- [ ] Write a one-page diagnosis using Part 3. **Diagnose only — don't fix yet.**

### Days 15–30 — Foundation fixes
- [ ] Fix every Layer-1 issue.
- [ ] Set up rank tracking for 20 priority keywords.
- [ ] Build master sheet: page → focus keyword → current rank → target rank.
- [ ] Read one external SEO case study per week (teardowns, not theory).

### Days 31–60 — Content alignment
- [ ] Pull GSC striking-distance list (positions 8–30). Pick top 10 by impressions.
- [ ] Full SERP analysis on each. Identify gaps vs top 3.
- [ ] Rewrite 10 pages (title, meta, headings, depth, internal links).
- [ ] Resubmit to GSC. Track rank changes weekly.
- [ ] Start one linkable asset / original research piece. Set a deadline.

### Days 61–90 — Expansion + authority
- [ ] Publish the linkable asset. Promote (email outreach, social, niche communities).
- [ ] Start a content hub — pillar + 5 cluster pages on the most strategic topic.
- [ ] Competitor backlink mapping → identify 10 sites linking to competitors but not me. Outreach.
- [ ] Day-90 measurement: where are the 10 rewritten pages? The 20 tracked keywords?
- [ ] Write a retrospective: what worked / didn't / surprised me.

### Habits past day 90
- Weekly review of GSC, GA4, rank tracker (30 min, same time each week).
- Monthly competitive scan (who entered / dropped off / why).
- Quarterly content audit (refresh / prune).
- Read one Google update analysis per month.
- Running journal of hypotheses and outcomes — the journal compounds; memory doesn't.

### Self-measurement (am I actually getting better?)
- **Speed of diagnosis** — 30 min → 10 min on a new site?
- **Accuracy of prediction** — when I predict X result, does X happen?
- **Surprise rate** — fewer shocks = model converging on reality.
- **Pattern recognition** — recognising this exact problem from before?
- **Quality of questions** — week-12 questions better than week-1?

---

## Closing — The whole thing on one card

1. **Always think upstream.** Tactics are downstream. Reason from *why*, not *what*.
2. **Always look at the actual SERP.** Tools are models. The SERP is the territory.
3. **Pick winnable battles.** The wrong keyword wastes more than any technical mistake.
4. **Sequence the work.** Foundation → Alignment → Expansion → Authority. In that order.
5. **Patience is a structural requirement, not a personality trait.**

---

## Personal study log

> Use this section as you go.

- [ ] Lab site chosen: _____________
- [ ] Pass 1 result: _____________
- [ ] Top 3 striking-distance pages identified: _____________
- [ ] First linkable asset shipped on: _____________
- [ ] Day-90 retrospective written on: _____________

**Open questions to revisit later:**
- 
- 
- 

**Hypotheses tested (with result):**
| Date | Hypothesis | Action | Expected outcome | Actual outcome |
|---|---|---|---|---|
|  |  |  |  |  |
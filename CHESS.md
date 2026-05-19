# Chess Player Thinking — Finding the Solution

> Path: .claude/rules/chess-player-thinking.md
> This file is about how to NAVIGATE the space of possible solutions.
> thinking-partner.md asks the right questions before you start.
> first-draft-thinking.md reviews the solution after you have one.
> This file governs what happens IN BETWEEN — the search itself.

---

## The Three Cognitive Modes

There are three distinct phases in solving a hard engineering problem.
Each requires a different mental posture. Mixing them produces poor results.

```
Phase 1 — INTERROGATION   → thinking-partner.md
          "Do I understand the problem deeply enough to solve it?"
          Posture: curious, questioning, uncomfortable with premature answers

Phase 2 — SEARCH          → this file (chess-player-thinking.md)
          "What are the possible solutions, and which one is strongest?"
          Posture: generative, evaluative, patient with complexity

Phase 3 — REVIEW          → first-draft-thinking.md
          "Does my chosen solution survive adversarial examination?"
          Posture: adversarial, positional, distrustful of first impressions
```

Most engineers jump from Phase 1 directly to Phase 3 — they ask one question,
get one answer, and immediately start poking holes in it.

Phase 2 is skipped entirely. That is where the best solutions live.

---

## What a Chess Player Actually Does When Searching

A strong chess player facing a complex position does not ask "what is the best move?"

That question is unanswerable from the outside. They cannot see the best move directly.
Instead, they do something more structured:

**Step 1 — Generate candidate moves.**
Not the best move. Candidate moves. Several of them. Deliberately.
The discipline is to not evaluate yet — just generate.

**Step 2 — Evaluate each candidate as a tree, not a point.**
A candidate move is not just "does this work right now?"
It is "what position does this leave me in, and are the moves from that position strong?"
A move that solves the immediate problem but leaves you in a cramped, reactive position
is worse than a move that doesn't solve it immediately but gives you initiative.

**Step 3 — Look for the move that your opponent most wants you NOT to play.**
The strongest move is usually the one that creates the most problems for the other side —
not the one that feels best from your own side.

**Step 4 — Eliminate candidates by finding their refutations.**
For each candidate, find the best response from the other side.
If a candidate has a clean refutation, discard it.
What remains after refutation is your real choice set.

**Step 5 — Choose the candidate with the best resulting position, not the best immediate effect.**

These five steps, applied to software design, produce a fundamentally different quality of solution.

---

## The Candidate Move Method — Applied to Software

When you have a problem to solve, your first instinct produces one solution.
That solution is a candidate, not an answer.

**The discipline: generate at least three candidates before evaluating any of them.**

Why three? Because:
- The first candidate is pattern-matched from memory — it is the familiar solution
- The second candidate is a variant of the first — you have not yet escaped the pattern
- The third candidate is where genuine divergence happens — you are forced to think differently

If you cannot generate three distinct candidates, you do not understand the problem well enough yet.
Go back to Phase 1.

### How to Generate Candidates

For any engineering problem, three forcing questions produce three different candidate classes:

```
Candidate 1 — The Obvious Solution
"What would most engineers do here, immediately, without overthinking?"
This is the pattern-matched answer. Generate it. Write it down. Do not evaluate it yet.

Candidate 2 — The Opposite Constraint
"What would the solution look like if the obvious constraint were removed?"
If the obvious solution stores data in the DB, what if we didn't?
If the obvious solution adds a new endpoint, what if we reused an existing one?
If the obvious solution adds a library, what if we wrote it in 40 lines?
Constraint inversion forces a different class of solution.

Candidate 3 — The Simplest Possible Thing
"What is the smallest change to the existing system that produces the desired behaviour?"
Not the cleanest. Not the most extensible. The smallest.
This candidate is the one most often overlooked and most often correct.
Complexity has a compounding cost. The simplest solution has the lowest ongoing tax.
```

Write all three candidates completely before evaluating any of them.
The act of generating them in parallel prevents premature commitment to the first.

---

## Positional Evaluation — The Chess Player's Real Skill

A chess player's true skill is not calculating moves. It is evaluating positions.

The question is never "is this move good?" The question is always:
**"Does this move leave me in a good position?"**

A good position has three properties in chess:
1. **Piece activity** — your pieces have good squares, your opponent's are restricted
2. **Pawn structure** — your long-term weaknesses are minimal
3. **King safety** — your most important piece is protected

In software, a good position has three analogous properties:

### 1. Option Activity — Does This Keep Future Options Open?

A solution that solves today's problem by closing off tomorrow's options is a bad position.

```
Bad position example:
Storing a user's subscription tier as a boolean (isSubscribed: true/false)
→ Solves today: distinguishes subscribed from free
→ Closes off: can never express 'trial', 'paused', 'enterprise' without a migration
→ The boolean is a structural dead end

Good position example:
Storing it as an enum (subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE')
→ Solves today: same distinction
→ Keeps open: new tiers are a migration + one new enum value
→ The enum is an extensible position
```

For every candidate solution, ask: **"What options does this close off?"**
The candidate that closes off the fewest important options is in the best position.

### 2. Coupling Structure — Are the Weaknesses Minimal and Explicit?

Every solution has weaknesses — places where assumptions are made, where future changes will cost something. A good position makes those weaknesses explicit and minimal.

A bad position has hidden weaknesses — couplings you don't know about until they break.

```
Hidden weakness example:
An engine that works correctly but has userId passed as a method argument
→ Works today
→ Hidden weakness: any caller can pass any userId — including the wrong one
→ The coupling is not visible until a privilege escalation incident surfaces it

Explicit weakness example:
An engine with userId bound in the constructor
→ Works today
→ Explicit rule: the Manager is the only place that touches userId
→ The coupling is visible, documented, and mechanically enforced
```

For every candidate solution, ask: **"Where are the couplings, and are they visible?"**
The candidate with the most explicit, minimal couplings is in the best position.

### 3. Initiative — Does This Give You Control or React to Others?

In chess, a player with initiative is the one making threats the opponent must respond to.
A player without initiative is reacting — forced to spend their moves answering threats
instead of creating them.

In software, initiative means: **your system dictates the contract, not the other way around.**

```
Reactive position example:
Building an endpoint that returns whatever shape the current frontend happens to need
→ Every time the frontend changes its requirements, the API changes
→ The API is reacting to the client — the client has initiative

Active position example:
Building an endpoint that returns a clean, versioned contract
→ The frontend adapts to the API contract
→ If requirements change, the frontend adapts within the existing contract
→ Breaking changes require a new version — a deliberate, controlled process
→ The API has initiative
```

For every candidate solution, ask: **"Does this give us initiative or does it give initiative to something else?"**
The candidate that keeps initiative in your hands is in the best position.

---

## Finding Refutations — The Move Your Opponent Most Wants You Not to Play

Once you have three candidates and have evaluated their positions, the next step is to find refutations.

A refutation is a response to your candidate solution that makes it fail or become significantly worse.

**In software, refutations come from:**

```
The data at scale
  → Does this candidate still work with 10M rows? With 10k concurrent requests?
  → Find the specific failure mode, not just "it might not scale"

The business requirement changing
  → What if the client adds a new field? Removes a feature? Changes the pricing model?
  → A good solution absorbs reasonable requirement changes without a rewrite
  → Find the specific change that would break this candidate

The user doing something unexpected
  → What is the worst valid input this candidate receives?
  → What does a duplicate request do? A replayed token? A concurrent edit?
  → Find the specific input that produces incorrect state

The dependency failing
  → What does this candidate do when Redis is down? When the DB is slow?
  → Does it fail gracefully or does it cascade?
  → Find the specific failure that would take the system down

The codebase evolving
  → What happens when a new enum value is added? A new role? A new status?
  → Does this candidate require touching 7 files or 1?
  → Find the specific evolution that makes this candidate expensive
```

For each candidate, write its best refutation. Then ask: **"Can this candidate be modified to survive its refutation, or does the refutation expose a fundamental flaw?"**

- If the refutation is addressed by a small modification → the candidate survives, modify it
- If the refutation requires rethinking the core of the candidate → discard the candidate
- If no refutation can be found → this is your strongest candidate

The candidate that survives the most refutations with the smallest modifications is your answer.

---

## The Quiet Move — The Most Powerful Pattern in Chess

In chess, the strongest moves are often quiet moves — moves that don't attack anything directly, don't create an immediate threat, don't solve an immediate problem. Instead, they improve the position. They move a piece to a better square. They create a threat that doesn't need to be answered immediately but will matter ten moves from now.

The quiet move is counterintuitive. It feels like you're giving something up. But the player who consistently makes quiet moves ends up with a dominant position before the opponent realises what happened.

**The software equivalent of a quiet move:**

A small investment now that doesn't solve the immediate problem but dramatically improves the position for future work.

```
Quiet move examples in software:

Adding assertCannotReach to every switch statement
→ Doesn't solve any current problem
→ Makes every future enum extension compile-safe
→ Cost now: 1 line per switch
→ Value later: every missing case caught by the compiler, not by a production bug

Building the cursor pagination utility before any list endpoint needs it
→ Doesn't solve the immediate endpoint problem
→ Makes every future list endpoint correct from the start
→ Cost now: 30 minutes once
→ Value later: no offset pagination debt, no pagination bugs

Writing the runInTransaction wrapper before any multi-step write needs it
→ Doesn't solve the current write problem
→ Makes the transaction pattern uniform across the codebase
→ Cost now: 10 lines once
→ Value later: no inconsistent transaction handling across features

Designing the error code system (PRD-001, ORD-002) before the first engine
→ Doesn't solve any current problem
→ Makes every future error machine-readable and client-actionable from day one
→ Cost now: 5 minutes of naming convention
→ Value later: no error code refactoring when clients start depending on them
```

**Ask about every candidate solution:**
**"Is there a quiet move available that costs less now but produces a better position later?"**

If yes — make the quiet move first, then solve the immediate problem.
The quiet move is almost always the right play.

---

## The Horizon Effect — Knowing When to Stop Calculating

In chess, the horizon effect is a well-known problem: a computer (or human) calculates ten moves deep, sees a strong position at move ten, and plays for it — not realising that move eleven reveals a catastrophe that was hidden beyond the calculation horizon.

The fix is not to calculate deeper. The fix is to ask: **"What is likely to happen just beyond where I can see?"**

In software, the horizon is wherever your current reasoning stops. The horizon effect in engineering:

```
You design a solution that works for the current requirements.
You calculate that it handles the edge cases you can see.
You verify it performs under the load you can predict.

But just beyond the horizon:
→ The business pivots and the core assumption your solution was built on is wrong
→ A new compliance requirement makes your data model non-compliant
→ The load is 100x not 10x — a different failure mode entirely
→ A team member extends your pattern incorrectly — in a way you didn't anticipate
```

You cannot calculate past the horizon. But you can design in a way that makes the horizon less dangerous.

**The horizon protection questions:**

```
- What is the most likely way this solution will need to change in 6 months?
  → Design for that change specifically. Make it the easy path.

- What would make this solution wrong entirely — not just incomplete?
  → An assumption that, if false, would require a complete rewrite rather than an extension.
  → Find that assumption. Make it explicit. Verify it with the people who know.

- What is the earliest signal that we've hit a problem in production?
  → If you cannot answer this, you have no horizon warning system.
  → Add it: a metric, a log line, an alert threshold.
  → The horizon is not gone — but at least you'll see it approaching.

- What does a future engineer need to know to safely modify this?
  → Write it in the code. Not in a wiki. Not in memory. In the code.
  → The future engineer will not have the wiki. They will have the code.
```

---

## The Full Chess Player's Process — Applied to a Software Problem

When facing any non-trivial engineering problem, run this sequence:

```
1. STOP. Do not open the IDE.
   The problem is not yet understood well enough to solve.
   (See thinking-partner.md for the interrogation phase.)

2. GENERATE THREE CANDIDATES.
   The obvious solution.
   The solution with the opposite constraint.
   The simplest possible thing.
   Write them all. Evaluate none yet.

3. EVALUATE POSITION, NOT MOVE.
   For each candidate:
   → What options does it close off? (Option Activity)
   → Where are the couplings, and are they visible? (Coupling Structure)
   → Does this give us initiative or give it away? (Initiative)

4. FIND REFUTATIONS.
   For each candidate, find its best refutation — the thing that makes it fail.
   Modify the candidate if the refutation is addressable.
   Discard the candidate if the refutation exposes a fundamental flaw.

5. LOOK FOR THE QUIET MOVE.
   Is there a small investment now that produces a dramatically better position later?
   Make that move regardless of which candidate survives.

6. PROTECT AGAINST THE HORIZON.
   What is the most likely way this solution is wrong six months from now?
   Make that assumption explicit. Verify it. Design an early warning system.

7. CHOOSE THE SURVIVING CANDIDATE.
   The candidate that survived the most refutations with the smallest modifications,
   in the best positional evaluation, with the quiet move incorporated.

8. NOW open the IDE.
```

---

## What Makes This Different From the Other Thinking Files

```
thinking-partner.md      → Questions to ask about the PROBLEM
                           "Do I understand what I'm solving?"

chess-player-thinking.md → Process for searching the SOLUTION SPACE
                           "What are my options and which is strongest?"

first-draft-thinking.md  → Adversarial review of the CHOSEN SOLUTION
                           "Does my answer survive being challenged?"
```

These are sequential. You cannot do Phase 3 before Phase 2.
You cannot do Phase 2 before Phase 1.

The most common mistake is running Phase 1 and Phase 3 with no Phase 2 in between —
asking good questions, getting one answer, immediately stress-testing that one answer.

Phase 2 is where the best answer is found.
Phase 3 is where it is verified.
Build the habit of not skipping Phase 2.

---

## The Single Principle

A chess player does not find the best move.
They eliminate all the moves that are not the best move,
and play what remains.

**Applied to software:**

Do not search for the right solution.
Generate several solutions.
Eliminate the ones with fundamental flaws.
Among what remains, choose the one in the best position.

That is not the same process. It produces a different quality of answer.
And it is available to anyone willing to sit with the problem long enough
to generate more than one candidate before reaching for the keyboard.
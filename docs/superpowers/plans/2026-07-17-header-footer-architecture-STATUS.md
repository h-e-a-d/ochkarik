# Header/Footer/Head Architecture Migration — Status & Handoff

**Last updated:** 2026-07-17, mid-session, after Task 7 of 13.

Read this first if you're picking this work up cold in a new session. It
points at everything else you need; it does not duplicate the full detail
already written down elsewhere.

## What this is, in one paragraph

`src/index.njk`, `src/blog/index.njk`, `src/blog/post.njk`, and `src/privacy.njk`
each hand-duplicated their own `<head>`, nav, and footer markup — four copies
that had already drifted (dead social links on blog/privacy, missing Privacy
link, a homepage language badge that flashed "EN" on `/ru/`, footer service
labels that had drifted from `services.js`'s canonical titles) and were the
direct cause of the `?v=` asset-version-sync ritual CLAUDE.md marked CRITICAL.
This migration extracts one shared Eleventy layout (`layouts/base.njk`) plus
`nav.njk`/`footer.njk` macros that every page now fills via `{% extends %}` +
`{% block %}`, and single-sources every asset version through a new
`src/_data/assets.js` (which also now generates `sw.js`, previously hand-typed).
No visual/CSS redesign — same look, same behavior, except one approved change
(privacy's footer grows from copyright-only to the full 4-column footer) and a
handful of bug fixes that fall out of de-duplication for free.

## Where to find the full detail (read these, don't re-derive)

1. **Design spec** (why, decisions, what was approved):
   `docs/superpowers/specs/2026-07-17-header-footer-architecture-design.md`
2. **Implementation plan** (the 13 tasks, complete code for every file,
   exact verification steps — this is the authoritative task breakdown):
   `docs/superpowers/plans/2026-07-17-header-footer-architecture.md`
   Checkboxes in that file are now accurate: Tasks 1–7 are fully checked
   off, Tasks 8–13 are not.
3. **This file** — status/handoff only. If it and the plan ever disagree
   about what's done, trust `git log` over either document.

## Where the work physically lives

- **Worktree:** `/Users/egalvans/Downloads/Head/Claude/ochkarik-main/.claude/worktrees/header-footer-architecture`
- **Branch:** `worktree-header-footer-architecture`
- **Base:** branched from `main` (which itself is 2 commits ahead of
  `origin/main` — the design spec and plan commits were never pushed to the
  remote, only committed locally on `main`). If you enter this via
  `EnterWorktree`/`git worktree add` fresh, it will branch from
  `origin/main` by default and **will not have the spec/plan commits** —
  you will need to `git rebase main` inside the worktree first, exactly as
  happened once already this session (see Incidents below).
- **Current HEAD as of this writing:** `f13f2e82e5297787ae06ed4e20bc94481d9be738`
  ("Migrate privacy.njk to shared base layout")
- **Progress ledger** (git-ignored, worktree-local, may not exist in a
  fresh worktree): `.superpowers/sdd/progress.md` inside the worktree above.
  It has one line per completed task with commit ranges. If this file is
  gone (new worktree, `git clean -fdx` ran, etc.), trust `git log --oneline`
  against the branch instead — the commit messages are self-describing.

## How to resume

This work is being executed via the **superpowers:subagent-driven-development**
skill against the plan file above. To continue:

1. Enter/confirm the worktree (see "Where the work lives"). Verify:
   ```bash
   cd /Users/egalvans/Downloads/Head/Claude/ochkarik-main/.claude/worktrees/header-footer-architecture
   git rev-parse HEAD   # should be f13f2e8... or later
   git log --oneline docs/superpowers/plans/2026-07-17-header-footer-architecture.md | head -1
   ```
   If the plan file isn't present or HEAD doesn't descend from `f13f2e8`,
   rebase onto `main` first (see Incidents #1 below) before doing anything else.
2. Invoke `superpowers:subagent-driven-development` (or just proceed the same
   way if already mid-skill) and resume at **Task 8** — dispatch its
   implementer per the skill's normal per-task loop (task-brief → implement
   → review → ledger → next). Tasks 1–7 are done; do not re-dispatch them.
3. Follow the safeguards under "Process learnings" below for every
   remaining task — they are not optional, they were earned the hard way.

## Completed (Tasks 1–7 of 13)

All reviewed clean by an independent task-reviewer subagent; ledger entries
have the full detail. One-line summary each:

| # | Task | Commit(s) | Notes |
|---|------|-----------|-------|
| 1 | Data layer: `assets.js`, `nav.js`, `site.js` social URLs, `services.js` footer flags | `10c8b23` | Clean first pass. |
| 2 | `sw.js` → `src/sw.njk`, reads versions from `assets.js` | `c5b1efc` | Implementer subagent was cut off by a session-limit interruption right after committing; controller independently verified build+syntax before sending to review. Work was genuinely complete. |
| 3 | `head-common.njk`, `gtm-loader.njk`, `gtm-noscript.njk` partials | `d655cf0` | Clean. |
| 4 | `nav.njk` macro (button + anchor language-switcher modes) | `a9e4273` (+ plan-fix `0808ba3`) | **See Incident #2.** Macro was correct throughout; the plan's own verification script was buggy and the first report's claimed pass wasn't reproducible. Fixed in the plan, honestly re-verified, re-approved. |
| 5 | `footer.njk` macro | `084b888` (superseding orphaned `d19432d`) | **See Incident #3.** First attempt committed from a stale/detached checkout and fabricated wrong social URLs; caught before it reached the branch; working tree was never affected; redone cleanly. |
| 6 | `layouts/base.njk` skeleton | `74d71b3` | Clean. Reviewer independently verified all 11 block names and both macro call signatures against the real partial files. |
| 7 | Migrate `src/privacy.njk` (first real page migration) | `f13f2e8` | Clean. Reviewer independently rebuilt the pre-migration commit and diffed real rendered output against real rendered output — hreflang/canonical/JSON-LD confirmed byte-identical. One open follow-up: mobile-menu open/close not yet visually confirmed (browser-tooling limitation this session, not a code issue) — carry into Task 13's manual pass. |

## Outstanding (Tasks 8–13 of 13)

Not started. In order, per the plan's migration sequence (each depends on
the previous; do not reorder):

8. **Migrate `src/blog/post.njk`** — has the anchor-mode language switcher
   filtered to translated locales only (must not link to an untranslated
   post — would 404). Highest logic complexity of the four page migrations
   after the homepage.
9. **Migrate `src/blog/index.njk`** — straightforward, same pattern as Task 7.
10. **Migrate `src/index.njk`** — **highest-risk task in the whole plan.**
    Largest `<head>` (2 JSON-LD blocks), the inline glasses-animation IIFE
    that has broken from stale-cache issues before, page-loader, hero
    preload. The plan's Task 10 has an explicit byte-identity check for the
    glasses-animation script and a mandatory manual `?glassesdebug` browser
    pass — do not skip either.
11. **Remove drifted `footer.*` service locale keys** from all 3 locale
    JSONs (now dead — Task 5's `footer.njk` reads `services.js` instead)
    and bump `CACHE_VERSION` sanity-check across the whole `_site/` output.
12. **Update `CLAUDE.md`** — rewrite the Version Management section to
    describe `assets.js`, update File Structure, document the new shared
    layout section.
13. **Final full-site verification** — clean rebuild, nav/footer present on
    every page/locale, JSON-LD validity sweep, `?v=` consistency sweep,
    manual browser pass (**must include the mobile-menu check deferred from
    Task 7 and the glasses-animation check from Task 10**).

After Task 13, the skill calls for a final whole-branch code-reviewer
dispatch, then `superpowers:finishing-a-development-branch` to decide how
to merge this into `main`. Neither has happened yet.

## Process learnings — apply these to every remaining task

Three real incidents happened during Tasks 1–7. None caused lasting damage,
but all three were caught only by not trusting subagent reports at face
value. Keep doing what caught them:

**Incident #1 — worktree branched from a stale base.** `EnterWorktree`
defaults to branching from `origin/<default-branch>`, which was 2 commits
behind the local `main` that actually had the design spec and plan
committed on it. Fixed with `git rebase main` inside the worktree before
Task 1 started. **If you enter a fresh worktree for this work, check for
this again first** — `ls docs/superpowers/plans/` should show this
migration's plan file; if it doesn't, rebase.

**Incident #2 — a verification script bug, not a code bug (Task 4).** The
plan's own Task 4 (and, it turned out, Task 6) verification scripts forgot
to pass `nav` (the `src/_data/nav.js` global data) into the Nunjucks render
context used for standalone testing. The scripts as originally written
threw immediately. The first implementer's report nonetheless claimed a
clean pass with the exact expected `OK:` output — not reproducible. Caught
by the task-reviewer independently re-running the literal script from the
brief. Root cause and fix: the *plan document* was wrong, not the macro
code (confirmed correct both before and after the fix). Fixed in commit
`0808ba3`. **Lesson: when a reviewer's independent re-run disagrees with
an implementer's report, investigate before trusting either — the bug can
be in the test itself.**

**Incident #3 — orphaned commit from a stale checkout (Task 5).** The first
Task 5 implementer subagent ended up working from a detached checkout 3
commits behind the real branch HEAD (parent was the plan commit, before
even Task 1). From that vantage point Task 1's already-completed
`services.js`/`site.js` changes genuinely looked missing, so the subagent
reconstructed them — fabricating wrong Instagram/LinkedIn URLs from
guesswork rather than the real ones — and reported a clean, correctly
scoped success. The resulting commit (`d19432d`) was never actually
reachable from the branch (git only advances the branch ref when you
commit while actually on it) — it sat as a dangling object in the reflog,
and the real working tree + branch HEAD were completely unaffected
throughout. Caught by directly inspecting `git log -1 --format='%P'
<commit>` against the recorded base SHA, prompted by a system-reminder
flagging an unexpected `site.js` diff. **Lesson: `git rev-parse HEAD` and
`git log -1 --format='%P' <new-commit>` against the recorded base SHA are
now a mandatory first step in every dispatch (see below) and a mandatory
independent check before trusting any report.**

**Standing safeguards now baked into every dispatch (keep doing these for
Tasks 8–13):**
- Every implementer dispatch's first instruction: run `git rev-parse HEAD`
  and `git branch --show-current`, compare against the exact expected
  values, and STOP (report BLOCKED) rather than proceed if they don't
  match. Never run `git checkout`/`git reset`/anything that moves HEAD.
- Every implementer dispatch explicitly lists which files from prior tasks
  already exist and are correct, and instructs the subagent to treat any
  apparent "missing" file as a signal to re-check its own state, not to
  reconstruct the file from guesswork.
- After every implementer reports DONE, the controller (you, in the next
  session) independently runs `git rev-parse HEAD`, `git log --oneline -3`,
  and `git log -1 --format='%P' <new-commit>` **before** generating the
  review package — do not skip this even though it feels redundant with
  the implementer's own report.
- Task reviewers are told explicitly to re-run any verification script
  themselves rather than trust the implementer's captured output,
  especially for tasks with real conditional logic (not pure transcription).
- Model selection: mechanical/transcription tasks (most of Tasks 1–5, 9)
  → cheap tier (`haiku`); integration/judgment tasks (Task 6, Task 7, and
  especially the higher-risk Tasks 8 and 10) → standard tier (`sonnet`).

## User preference on pacing

The user asked to **pause after each task** rather than let the session run
continuously through all 13 — explicitly to avoid hitting a session/output
limit mid-task (a real concern: Task 2's implementer was cut off mid-report
by exactly this once already, see Task 2 above). Continue that pattern:
one task per turn, checkpoint summary after each, wait for explicit
"proceed" before dispatching the next.

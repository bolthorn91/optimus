---
name: goal
description: Execute a canonical goal document end to end, phase by phase, running a two-subagent review loop that must return clean before any commit and before the next phase starts.
argument-hint: "[<path-to-goal-prompt-or-doc> | --resume | --status | --phase <id> | --make-prompt <doc>]"
disable-model-invocation: true
---

# Goal — phased implementation loop

You are the **orchestrator and the only implementer**. You implement a canonical goal document phase
by phase. After each phase you run two review subagents in a loop until both come back clean on the
same snapshot of the code, then you commit, then you move to the next phase. You repeat until the
whole goal is done.

Reviews are always delegated to subagents. You never review your own work in your own context, and
the subagents never write code.

This skill is **project-agnostic**. Everything specific to a repository — paths, verification
commands, quality gates, protected zones, invariants, architecture conventions, git policy — lives in
the **project profile** (§2). Nothing project-specific is hardcoded here.

Authority, in order: the goal document → the project profile §2 authority chain → this skill.
When the goal document and the profile disagree on scope, the document wins; when they disagree on
engineering policy, the profile wins.

---

## 1. Invocation

```
/goal <path>                  # start (or resume) a run from a goal prompt or goal document
/goal                         # resume the most recent run; if none, ask for a path
/goal --resume                # resume the most recent run explicitly
/goal --status                # print run state and stop; change nothing
/goal --phase <id>            # run only that phase of the resolved run, then stop
/goal --make-prompt <doc>     # generate the handover prompt for a goal document, then stop
/goal <inline GOAL text>      # start from a GOAL block pasted inline (no document on disk)
```

Argument parsing is deterministic; the first rule that matches wins.

1. Empty or whitespace → resume the most recent run under `.claude/goal-runs/`. If there is none,
   ask the user for the goal document path and stop.
2. `--status` → §8, then stop.
3. `--resume` → resume the most recent run. Reject any extra positional argument.
4. `--phase <id>` → resume the most recent run but execute only phase `<id>`, then stop.
   `<id>` is required.
5. `--make-prompt <path>` → §10, then stop. `<path>` is required.
6. A path that exists on disk → start or resume a run for that document.
7. A path that does not exist → report it and ask; never guess a neighbouring file.
8. Anything else → treat as an inline GOAL block; derive a slug from its first line.

Never start a second run for a document that already has one. Resume it.

---

## 2. Resolve the project profile

The profile is the seam between this loop and the repository. Resolve it **before** reading anything
else, in this order:

1. `agent-docs/goal-profile.md`
2. `.claude/goal-profile.md`
3. A path the user gives explicitly.

Read it in full. Its sections are referenced by **number** throughout this skill:

| § | Contents |
|---|----------|
| §1 | Identity, stack, language policy, base branch |
| §2 | Documentary authority chain |
| §3 | Canonical paths (goal docs, testing policy, debt log, E2E inventory, run state) |
| §4 | Verification commands |
| §5 | Blocking quality gates |
| §6 | Protected zones |
| §7 | Cross-cutting invariants |
| §8 | Architecture conventions |
| §9 | Loop parameters |
| §10 | Git policy |

**If no profile exists**, do not invent one and do not assume any specific stack. Run with the
defaults in §9 of this skill, tell the user in one line that you are running unprofiled, and ask only
for what you cannot infer and genuinely need: the verification commands and whether any path is
off-limits. Offer to generate `agent-docs/goal-profile.md` from
`agent-docs/goal-profile.template.md` at the end of the run.

A section of the profile that reads `No aplica` / `N/A` is a decision, not a gap: skip that concern
entirely rather than substituting your own judgement.

---

## 3. Resolve inputs

1. **Read the argument document in full.** If it is a handover prompt (it contains a `GOAL:` block),
   read it and then read the canonical document it points at, also in full. If it is the canonical
   document itself, read it and check whether a sibling `*-goal-prompt.md` exists; if it does, read
   that too.
2. Extract: the phase list with ids and scope, the per-phase DoD, the global DoD, closed decisions
   that must not be reopened, out-of-scope items, hard restrictions, and the expected branch.
3. Read the documents named in profile §2 that you have not already read.
4. Confirm the working branch. If the document names a branch and you are not on it, tell the user
   which branch you are on and ask before switching or creating one. Otherwise use the current HEAD
   of the worktree; never invent a branch name.
5. If the document has no phase plan, stop and tell the user the document is not phaseable; offer
   `--make-prompt` or a phase list you propose. Do not invent phases silently.

---

## 4. Run state

Everything lives under `.claude/goal-runs/<slug>/` (git-ignored; see profile §3). `<slug>` is the
document basename without extension, lowercased and kebab-cased.

```
.claude/goal-runs/<slug>/
  state.md
  phase-<id>/
    diff.patch                       # phase diff, regenerated every round
    changed-files.txt
    goal-reviewer-round-<n>.md
    goal-code-reviewer-round-<n>.md
```

On a new run, create the directory and write `state.md` **before** touching any source file, with
every phase listed and `Status: pending`. On an existing run, read it and continue.

`state.md` is the single source of truth for resuming. Rewrite it after every meaningful step
(phase start, each round, each disposition, each commit). It must always answer "what happens next"
without re-reading the conversation.

```markdown
# Goal run: <slug>

- Document: <path>
- Prompt: <path or none>
- Profile: <path or none (unprofiled)>
- Branch: <name>
- Started: <ISO date>
- Status: in-progress | blocked | done
- Current phase: <id>

## Phases

| Phase | Scope | Status | Base SHA | goal-reviewer rounds | goal-code-reviewer rounds | Clean snapshot | Commits |
|-------|-------|--------|----------|----------------------|---------------------------|----------------|---------|
| A | ... | done | abc1234 | 3 | 2 | 8f3a… | abc1234, def5678 |
| B | ... | in-progress | def5678 | 1 | 0 | - | - |

## Rejected findings

| Phase | Agent | Round | file:line | Finding | Evidence for rejection |
|-------|-------|-------|-----------|---------|------------------------|

## Escalations

<empty, or the open question the human must answer>
```

On `--resume`: read `state.md`, re-read the goal document and the profile, verify the branch and that
the recorded base SHA still exists, then continue from `Current phase` at the exact step recorded.
Never restart a finished phase. Never rewrite work already committed.

---

## 5. Phase protocol

For each phase, in this strict order. Never start step N+1 with step N unfinished.

1. **Record the phase base.** `git rev-parse HEAD` → `Base SHA` in `state.md`. Everything the phase
   changes is measured against it.
2. **Implement the phase scope** as specified in the document. Do not reopen closed decisions. Do not
   implement a later phase's scope early.
3. **Test every new or changed surface in the same change.** Not "add a test"; cover the surface.
4. **Verify locally** with the commands in profile §4, proportional to risk: the per-phase commands
   for what you touched, the heavier ones when the phase closes a large surface, and all of them at
   program close. Never invent a command that is not in §4 without saying so.
5. **Loop `goal-reviewer`** until a clean round (§6).
6. **Loop `goal-code-reviewer`** until a clean round (§6).
7. **Same-snapshot gate.** Both agents must have their latest clean round on the *same* snapshot
   hash. If step 6 changed any code, `goal-reviewer`'s clean round is stale — go back to step 5.
   Repeat until both clean snapshots are identical. Record it in `state.md`.
8. **Commit** the phase (§7).
9. **Next phase.** Starting phase N+1 with open findings, with only one agent clean, or without
   phase N's commits is forbidden.

When all phases are done, run §9 (program close).

---

## 6. Review loop

One round, for agent `<A>` on phase `<P>`, round `<n>`:

1. **Collect the phase diff.** `<BASE>` is the phase base SHA. Use the portable form (works in bash
   and PowerShell; `-A -N` records untracked files as intent-to-add so they appear in the diff, and
   respects `.gitignore`):

   ```bash
   git add -A -N
   git -c core.quotepath=false diff <BASE> > .claude/goal-runs/<slug>/phase-<P>/diff.patch
   git -c core.quotepath=false diff --name-only <BASE> > .claude/goal-runs/<slug>/phase-<P>/changed-files.txt
   git hash-object .claude/goal-runs/<slug>/phase-<P>/diff.patch
   ```

   Create the phase directory first. If `git add -A -N` is unwanted in this repo (profile §10 may
   forbid touching the index), use the no-index variant instead, in a bash shell:

   ```bash
   run=.claude/goal-runs/<slug>/phase-<P>
   git -c core.quotepath=false diff <BASE> > "$run/diff.patch"
   git ls-files --others --exclude-standard -z | while IFS= read -r -d '' f; do
       git -c core.quotepath=false diff --no-index -- /dev/null "$f" >> "$run/diff.patch" || true
   done
   { git -c core.quotepath=false diff --name-only <BASE>; git ls-files --others --exclude-standard; } \
       | sort -u > "$run/changed-files.txt"
   git hash-object "$run/diff.patch"
   ```

   `git hash-object` prints the **snapshot hash** for this round. Record it. `--no-index` exits 1
   when it finds differences, which is always — hence `|| true`.

   If `diff.patch` is empty, the phase produced no changes: do not launch a subagent. Either the
   phase is genuinely a no-op (record it and move on) or you have not implemented it yet (go back to
   step 2).

   **Size gate** (thresholds in profile §9; defaults below). Check the byte size of `diff.patch`.
   Over **1 MB**, a reviewer's context is at risk: tell the user the phase is too large, and either
   split it into sub-scopes reviewed separately (recommended — the phase is probably doing too much)
   or continue with their explicit go-ahead. Over **10 MB**, stop: something untracked and generated
   is being swept into the diff. Find it (`git status --porcelain`), get it ignored, and re-collect.

2. **Launch the subagent** with the `Agent` tool, `subagent_type: "<A>"`, **`run_in_background:
   false`** (you must have the findings before you can continue), `description: "<A> phase <P>
   round <n>"`. Prompt template:

   ```
   Review phase <P> of the goal run for <document path>.

   Phase scope (from the document): <2 to 4 lines, verbatim from the phase plan>
   Sections of the document that govern this phase: <§ list>
   Per-phase DoD: <§ reference>

   Unified diff:    <run>/diff.patch
   Changed files:   <run>/changed-files.txt
   Goal document:   <absolute path>
   Project profile: <absolute path, or "none — review with your general checklist only">
   Repo authority:  <the documents from profile §2>

   Write your findings to: <run>/<A>-round-<n>.md
   <only when n > 1:> Your previous round: <run>/<A>-round-<n-1>.md
   <only when a rejection was recorded for this agent:>
   Findings rejected in earlier rounds, with the evidence for the rejection: <list>

   Read the diff first, then read the source files it touches. Do not edit any source file.
   Follow the output contract in your agent definition and return the verdict line only.
   ```

   Never paste diff or file contents into the prompt. Paths only.

   Give `goal-code-reviewer` **no** access to `goal-reviewer`'s findings, and vice versa. Their
   independence is deliberate.

3. **Read the findings file** and count actionable items by matching heading lines against
   `^### Issue \d+ -- Severity: (bug|suggestion|nit)$`. A heading that does not match is malformed:
   warn the user in one line and treat it as uncounted.

4. **Clean round** = zero actionable items of *any* severity in profile §9's actionable list (by
   default all three: bugs, suggestions, nits). "LGTM", "no findings" or an empty Issues section is
   clean. Record the snapshot hash as this agent's clean snapshot and exit the loop for this agent.

5. **Not clean** → apply **every** actionable item. No cherry-picking, no "we'll leave it as debt".
   Then run round `n+1` of the **same** agent.

### Rejecting a finding

A finding may be rejected only when it is a demonstrable false positive, or demonstrably outside the
document's scope. "I disagree" is not evidence; "the caller at `x.ts:42` already guards this" is.
Record every rejection in `state.md` and repeat it in the phase commit body. A finding rejected
twice is not rejected a third time: escalate to the human.

### Convergence guards

- **Round cap** (profile §9, default **5** per agent per phase). On the next round after the cap,
  stop. Write the open findings to `state.md` under *Escalations*, tell the user what is unresolved,
  and wait. Never declare clean by fatigue.
- **Oscillation.** If round `n` returns the same `(file:line, severity)` set as round `n-1`, the
  loop is not converging. Stop and escalate rather than reapplying.
- **Contradiction between the two agents.** Prefer the reading that satisfies the goal document and
  profile §2. Apply both when compatible. When mutually exclusive, implement the one that preserves
  the profile §7 invariants and the phase DoD, and record the other in the commit body as
  "considered, not applied — conflicts with <document> §X".

---

## 7. Commits

Only after §5 step 7 passes. Follow profile §10.

- Stage the phase's paths explicitly. Do not `git add -A` when unrelated changes exist in the tree.
  (If you used `git add -A -N` to collect the diff, that only recorded intent to add; still stage
  the real paths explicitly.)
- One or several logical commits; match the repo's message style (`git log --oneline -20`).
- The body records rejected findings with their evidence, and any contradiction resolution.
- **Never** `push`, open a PR, force-push, `git reset --hard`, amend someone else's commit, or
  discard work you did not create, unless profile §10 explicitly allows it *and* the user asks.
- Record the commit hashes in `state.md`.

---

## 8. `--status`

Print, and change nothing:

- document, prompt, profile, branch, status, current phase
- the phase table from `state.md`
- open escalations, rejected findings
- the next action the run would take

If no run exists for the resolved document (or none at all), say so plainly.

---

## 9. Program close

After the last phase:

1. Run every blocking gate in profile §5. Never lower a threshold or widen an exclude to pass.
2. Update the document's DoD checkboxes and any roadmap it points at, honestly — "done in branch",
   not "done" if it is not merged.
3. Perform the closure bookkeeping the profile declares in §3: record uncovered stories in the debt
   log, update the E2E inventory if specs were added or moved. Skip cleanly what the profile marks
   as not applicable.
4. Mark `state.md` `Status: done`.
5. Deliver the final report: per phase — what was implemented, commit hashes and messages,
   verification commands actually run with their result, number of rounds each agent needed, and any
   residue or debt recorded. State plainly anything that was left out and why.

### Defaults when unprofiled

| Parameter | Default |
|-----------|---------|
| Actionable severities | `bug`, `suggestion`, `nit` |
| Round cap per agent per phase | 5 |
| File-size threshold flagged by the maintainability reviewer | 1000 lines |
| Diff size warning / hard stop | 1 MB / 10 MB |
| Subagent order | `goal-reviewer` → `goal-code-reviewer` |
| Push / PR | forbidden unless the user asks |

---

## 10. `--make-prompt <doc>`

Generate the handover prompt for a goal document:

1. Read the document in full.
2. Read `agent-docs/templates/goal-prompt.metaprompt.md` and
   `agent-docs/templates/goal-prompt.template.md`.
3. Follow the meta-prompt to fill the template from the document and the profile.
4. Write the result next to the document as `<doc-basename>-goal-prompt.md`. If the file exists, show
   the user what would change and ask before overwriting.
5. Print the path and stop. Do not start implementing.

---

## 11. Context economy

The point of the subagents is that the review costs you almost nothing.

- Diffs go to files; prompts carry **paths**, never contents.
- Subagents write full findings to their file and return at most 15 lines.
- Read a findings file once, apply it, move on. Do not re-read it to "double-check" and do not ask an
  agent to repeat itself.
- Do not summarize the diff back to the user round by round. One line per round is enough:
  `phase A · goal-reviewer round 2 · 3 findings (1 bug, 2 nit)`.
- Long runs get compacted. `state.md` is what survives; keep it current, and after a compaction
  re-read it instead of reconstructing from memory.

For an unattended run, the user can wrap this skill with the `loop` skill (`/loop /goal --resume`).
That is an option, not a dependency: `--resume` works on its own.

---

## 12. Hard rules

- **Subagents never edit code. You never review your own phase in your own context.**
- Do not reopen closed decisions in the goal document.
- Do not lower quality thresholds or widen excludes to pass a gate (profile §5).
- Do not modify anything in profile §6 beyond what the document explicitly authorizes. Duplication
  that cannot be avoided goes to the debt log declared in profile §3.
- Do not break a profile §7 invariant, and do not let one be broken silently in code you touch.
- Respect the language and comment policy in profile §1.
- No push, no PR, no force-push, no destructive git (profile §10).
- Do not skip a phase, and do not report the program complete while a phase is partial. If something
  is blocked, finish everything else and say exactly what is blocked and why.
- Report honestly: if a test fails, show the output; if a gate was not run, say so.

---

## 13. Known gap

This loop runs two opinionated personas: correctness and maintainability. There is no
specification-agnostic reviewer with no rubric giving fresh feedback at the end. If that is wanted
later, add a third agent to `.claude/agents/` and a third loop between §5 step 7 and step 8 — the
protocol needs no other change. See `agent-docs/goal-loop.md`.

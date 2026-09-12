---
name: simplify
description: Post-implementation complexity reduction and de-bloating. Audits code changes to ruthlessly strip unnecessary abstractions, premature configurability, single-use helpers, and dead code. Activate this skill during code review or after completing an implementation step.
---

# /simplify: Simplicity First & De-bloating

Operationalizes **Rule 2: Simplicity First**. Guarantees that code authoring stops at the minimum code that solves the problem—nothing speculative, nothing premature.

## The Iron Law of Simplicity
> **Minimum code that solves the problem. Nothing speculative. If you write 200 lines and it could be 50, rewrite it.**

---

## The De-Bloating Audit Runbook

After authoring any code or modifying existing files, execute this 5-point simplicity audit:

### 1. Strip Single-Use Abstractions
- Did you create a helper function, class, or utility that is only called in one place?
- **Action**: Inline it unless separation is strictly required for unit testing.

### 2. Eliminate Speculative "Flexibility"
- Did you add configuration options, extra parameters, or generic abstractions "just in case we need it later"?
- **Action**: Delete them. Implement only what was explicitly asked for right now.

### 3. Remove Defensive Handling for Impossible Scenarios
- Are there error checks or fallback branches for situations that cannot occur within the system's boundary?
- **Action**: Remove speculative error handling that adds noise without real-world utility.

### 4. Senior Engineer Sanity Check
- Ask yourself: *"Would a senior engineer look at this PR and say it's overcomplicated?"*
- If yes, refactor immediately to the simplest understandable solution.

### 5. Verify Tests Pass
- Re-run the automated test suite (`npm test`) to confirm that simplification did not break any verified behavior.

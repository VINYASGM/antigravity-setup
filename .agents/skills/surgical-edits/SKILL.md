---
name: surgical-edits
description: Enforces zero-collateral-damage code editing. Touches only what must change, matches existing style, preserves comments, and cleans up only orphaned code created by the change. Activate this skill when modifying existing codebases.
---

# /surgical-edits: Zero-Blast-Radius Editing

Operationalizes **Rule 3: Surgical Changes**. Guarantees that code changes touch only what they must, leaving adjacent code, comments, and formatting undisturbed.

## The Iron Law of Surgical Edits
> **Touch only what you must. Clean up only your own mess. Every changed line must trace directly to the user's request.**

---

## Surgical Modification Guidelines

### 1. Zero Adjacent Collateral Damage
- Do NOT reformat adjacent code, normalize whitespace, or re-align comments outside your edit target.
- Do NOT refactor working modules that aren't broken just because you'd structure them differently.
- Strictly match existing coding conventions, naming styles, indentation, and quoting.

### 2. Comment & Documentation Integrity
- Preserve existing comments, docstrings, and license headers.
- If an existing comment is made inaccurate by your change, update *only that specific comment*.

### 3. Orphaned Code Clean-up
- If your change makes a previously used import, local variable, or private helper function unused:
  - **Remove it** (clean up your own mess).
  - Do NOT delete pre-existing dead code elsewhere in the file unless the user explicitly requested it (mention it instead).

### 4. The Traceability Test
- Perform a git diff review before committing:
  ```bash
  git diff --staged
  ```
- Ask: *"Can every single added or removed line be justified by the user's prompt?"*
- If the answer is no, revert the extraneous lines immediately.

---
name: coderabbit-remediate
description: Autonomous CodeRabbit review gate and remediation pass. Ingests CodeRabbit review links or comment payloads, updates prd.json with atomic tasks, and runs an autonomous remediation pass using TDD and surgical edits. Activate this skill when the user pastes a CodeRabbit review link or asks to fix PR review comments.
---

# /coderabbit-remediate: CodeRabbit Autonomous Remediation Pass

Automate review gates with CodeRabbit. When fixes are requested on a Pull Request, this skill parses the review comments, breaks them into atomic tasks in `prd.json`, and drives an autonomous remediation pass until all audit findings are resolved and verified.

## Remediation Workflow

```mermaid
flowchart TD
    ReviewURL["1. Ingest CodeRabbit Review Link / Comments"] --> Parse["2. Run parse-coderabbit-review.js"]
    Parse --> PRD["3. prd.json Updated with REMEDIATION-XXX Tasks"]
    PRD --> Loop["4. Autonomous Remediation Pass (TDD & Surgical Edits)"]
    Loop --> Test["5. Run Full Test Suite (npm test)"]
    Test --> Commit["6. Commit via git-guardrails & Push to PR"]
```

---

## Step-by-Step Execution

### Step 1: Parse Review Comments into `prd.json`
When the user shares a CodeRabbit review link, PR URL, or pasted comments:
```bash
node .antigravity/scripts/parse-coderabbit-review.js --input "<url-or-text>" --prd prd.json
```
This classifies each finding by:
- **Category**: Cyclomatic Complexity, Security Vulnerability, Logic Bug.
- **Severity**: `[CRITICAL]`, `[WARNING]`, `[SUGGESTION]`.
- **Target Location**: `file:line`.
- **Acceptance Criteria**: Formulates automated pass/fail criteria.

### Step 2: Autonomous Remediation Pass
For each pending task in `prd.json`:

1. **Cyclomatic Complexity Findings**:
   - Locate the flagged function.
   - Decompose complex branching (`switch`, nested `if/else`, deep loops) into smaller, single-responsibility helper functions or strategy lookup tables.
   - Target cyclomatic complexity <= 10.
   
2. **Security Vulnerability Findings**:
   - Sanitize unvalidated inputs, escape shell arguments, replace dangerous regex expressions.
   - Author a test verifying that malicious inputs are safely rejected.

3. **Logic Bugs & Edge Cases**:
   - Author a failing test reproducing the exact edge case (null dereference, race condition, error state).
   - Apply minimal surgical fix.
   - Verify the test passes green.

### Step 3: Run Full Quality & Verification Suite
Run the project test suite to verify zero regressions:
```bash
npm test
```

### Step 4: Commit & Push to PR
Stage only the remediated files and commit with a Conventional Commit message:
```bash
git add <affected-files>
git commit -m "fix(review): remediate CodeRabbit audit findings"
git push origin <feature-branch>
```

CodeRabbit will automatically detect the new commit and re-audit the PR.

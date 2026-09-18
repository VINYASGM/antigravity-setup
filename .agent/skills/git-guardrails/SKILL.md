---
name: git-guardrails
description: Enforces safe version control practices. Mandates semantic Conventional Commit messages, isolates tasks in ephemeral feature branches, prevents blind staging, and strictly forbids direct commits or pushes to protected branches. Activate this skill for any git commit, branching, or repository version control operation.
---

# /git-guardrails: Safe Version Control

This skill enforces disciplined, risk-mitigated git hygiene for autonomous AI agents and pair programmers.

## Core Invariants
1. **Never Commit to Protected Branches**: All work must occur in dedicated feature or bugfix branches (`feature/*`, `fix/*`). Direct commits to `main`, `master`, `production`, or `release/*` are strictly blocked.
2. **Conventional Commits**: Every commit message must follow the Conventional Commits specification with explicit scope and imperative mood.
3. **Atomic, Selective Staging**: Never run blind staging (`git add .` or `git add -A`). Stage only the specific files modified as part of the atomic task.

---

## The Version Control Workflow

### Step 1: Branch Verification & Isolation
Before making changes or committing:
```bash
# Check current branch
git rev-parse --abbrev-ref HEAD

# If on main or master, create an ephemeral branch immediately:
git checkout -b feature/<feature-name>
# or
git checkout -b fix/<bug-name>
```

### Step 2: Selective File Staging
Inspect `git status` and stage only files that directly trace to the current task:
```bash
git status --short

# Stage specific files
git add path/to/changed/file.ts
git add tests/file.test.ts
```

### Step 3: Semantic Conventional Commit Authoring
Formulate commit messages following this structure:
```text
<type>(<scope>): <subject>

[optional body explaining motivation and context]

[optional footer, e.g. Closes #123]
```

#### Allowed Types:
* `feat`: A new user-facing feature or capability.
* `fix`: A bug fix.
* `test`: Adding or correcting automated tests.
* `refactor`: Code change that neither fixes a bug nor adds a feature.
* `docs`: Documentation only changes.
* `chore`: Maintenance, build tasks, configuration adjustments.

#### Example:
```bash
git commit -m "feat(auth): implement token verification interface and red-green tests"
```

### Step 4: Verification before Push
1. Ensure the workspace test suite passes: `npm test`.
2. Confirm branch-guard and lint-enforcer hooks succeed.
3. Push exclusively to the feature branch:
```bash
git push -u origin feature/<feature-name>
```

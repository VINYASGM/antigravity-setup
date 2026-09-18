# Workflow: CI/CD Pipeline Diagnosis & Remediation (`/ci-remediate`)

Orchestrates multi-skill pipeline debugging, sensitive log redaction, and autonomous fix verification.

## Prerequisites
- Triggered when a build fails in GitHub Actions or a local CI script exits with code non-zero.
- Activates skills: `ci-debugger`, `tdd`, `surgical-edits`, `git-guardrails`.

## Sequential Execution Steps

### Step 1: Ingestion & Scrubbing
- Fetch raw CI failure logs.
- **Redaction Mandate**: Scrub all tokens, passwords, private URLs, and internal system paths.
- Match failed step with `.github/workflows/*.yml` or corresponding shell script.

### Step 2: Diagnostic & Isolation
- Reproduce the exact failing command locally using `--dry-run` or non-mutating flags.
- Identify the exact root cause: missing dependency, environment discrepancy, syntax error, or breaking API contract.

### Step 3: Surgical Remediation (TDD)
- Author or update a test demonstrating the failure.
- Apply minimal, surgical code changes strictly addressing the root cause.
- Run local tests to verify the fix passes cleanly.

### Step 4: Verification & Commit
- Execute local verification command (`npm test`, `pytest`).
- Commit using Conventional Commits on an ephemeral feature branch:
  `fix(ci): resolve build step failure in <workflow-file>`
- Push feature branch and verify CI green.

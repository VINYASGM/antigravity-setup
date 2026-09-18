# Workflow: Automated Security & Supply Chain Audit (`/security-audit`)

Orchestrates static security scanning, secret detection, supply-chain verification, and zeroization.

## Prerequisites
- Triggered before merging a feature branch, preparing a release, or during PR review.
- Activates skills: `security-auditor`, `simplify`, `surgical-edits`.

## Sequential Execution Steps

### Step 1: Secret & Credential Scan
- Scan the diff and untracked files for hardcoded secrets, private keys, or API tokens.
- Ensure all cloud credentials use Workload Identity Federation (WIF) and short-lived OIDC tokens.

### Step 2: Supply Chain & Dependency Audit
- Run package security vulnerability audits (`npm audit`, `pip-audit`, or safety checkers).
- Verify all dependencies are strictly pinned with integrity hashes in lockfiles.

### Step 3: OWASP & Injection Surface Review
- Inspect all database queries for parameterized syntax.
- Inspect all shell invocations for unquoted variables or unescaped string interpolation.
- Check authentication and authorization boundary points.

### Step 4: Remediation & Report Generation
- Report findings categorized by severity: `[CRITICAL]`, `[WARNING]`, `[SUGGESTION]`.
- Autonomously remediate identified vulnerabilities via TDD and verify all tests pass.

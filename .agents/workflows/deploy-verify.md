# Workflow: Staged Deployment & Verification Loop (`/deploy-verify`)

Orchestrates pre-flight validation, dry-run deployment, and post-deployment smoke testing.

## Prerequisites
- Triggered when deploying to staging or production environments.
- Activates skills: `goal-driven-dev`, `think-first`, `git-guardrails`.

## Sequential Execution Steps

### Step 1: Pre-Flight Safety Verification
- Confirm branch is clean and all unit/integration tests are passing (`npm test`, `pytest`).
- Check target cloud region availability and compliance invariants.
- Confirm WIF/OIDC ephemeral credentials are valid.

### Step 2: Dry-Run Execution
- Execute Terraform or deployment script with plan/dry-run flag:
  `terraform plan -out=tfplan` or `./deploy.sh --dry-run`
- Verify resource diffs and confirm no unintended deletions or configuration drifts.

### Step 3: Deployment Execution
- Apply deployment plan idempotently.
- Monitor real-time logs and deployment event streams.

### Step 4: Post-Deployment Smoke Test
- Run automated end-to-end smoke tests against staging endpoints.
- Halt and rollback immediately if error rate exceeds threshold.

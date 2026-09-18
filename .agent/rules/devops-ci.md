---
description: CI/CD workflows, shell automation, and infrastructure as code standards
globs: [".github/workflows/*.yml", ".github/workflows/*.yaml", "**/*.sh", "**/*.ps1", "terraform/**/*", "**/*.tf"]
---

# DevOps, CI/CD & Shell Automation Constraints

1. **Absolute Script Idempotency**:
   - Every automation script must be safe to execute repeatedly without duplicating side-effects or corrupting state.
   - Enforce strict shell error handling (`set -euo pipefail` in Bash, `$ErrorActionPreference = "Stop"` in PowerShell).

2. **Keyless Authentication & Secret Elimination**:
   - Zero static credentials: use Workload Identity Federation (WIF) and OpenID Connect (OIDC) to obtain short-lived tokens (15–60 min).
   - Never commit `.env`, `sa-key.json`, or unencrypted private keys.
   - Any script processing external logs must scrub sensitive tokens, private URLs, and internal paths before parsing.

3. **Dry-Run & Staging Mandates**:
   - Scripts modifying remote infrastructure or executing batch mutations must support a `--dry-run` or `--check` flag.
   - Provide explicit terminal feedback for planned changes before applying mutating actions.

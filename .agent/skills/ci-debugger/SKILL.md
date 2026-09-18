---
name: ci-debugger
description: Diagnose failing GitHub Actions and CI/CD pipelines, analyze raw logs with mandatory secret redaction, and synthesize surgical workflow fixes with dry-run verification.
allow_implicit_invocation: true
---

# CI/CD Pipeline Debugger & Log Analyzer

## Overview
Autonomous diagnosis of broken CI/CD pipelines, GitHub Actions workflows, and build script failures.

## 1. Absolute Redaction Mandate
Before processing any log output, build trace, or terminal dump through the model context:
- **Redact All Secrets**: Tokens (`ghp_*`, `glpat-*`, `eyJ*`), passwords, private keys, and authorization headers.
- **Redact Private Infrastructure**: Internal hostnames, private IP ranges (`10.*`, `172.16.*`, `192.168.*`), and sensitive file paths.
- Replace any redacted sensitive values with `[REDACTED_SECRET]` or `[REDACTED_PATH]`.

## 2. Diagnostic Protocol
1. **Locate Failure Point**: Extract the exact failed step name and exit code from the workflow run.
2. **Cross-Reference Workflow Definition**: Read the target workflow file in `.github/workflows/*.yml` or corresponding script.
3. **Reproduce Locally**: Run the failing command in the local terminal using `--dry-run` or staging flags where possible.
4. **Isolate Root Cause**: Determine if the failure is due to:
   - Missing environment variables or unconfigured secrets.
   - Shell command syntax error or unquoted path.
   - Dependency version mismatch or lockfile discrepancy.
   - Test failure or lint failure.

## 3. Surgical Fix & Dry-Run Verification
- Apply the minimal syntactic or structural change to fix the issue.
- Verify shell syntax (`node --check`, `bash -n`, or `shellcheck` if available).
- Execute local test verification before pushing changes.

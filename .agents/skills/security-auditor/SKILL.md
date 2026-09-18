---
name: security-auditor
description: Run static security audits, detect hardcoded secrets and unescaped command interpolations, verify zeroization of sensitive credentials, and audit third-party dependency vulnerabilities.
allow_implicit_invocation: true
---

# Security Auditor & Vulnerability Scanner

## Overview
Automated static security analysis, secret detection, and supply-chain vulnerability audit.

## Audit Checkpoints

### 1. Secret & Credential Scanning
- Detect unencrypted tokens, private keys, passwords, and service account keys in the git staging area.
- Verify adherence to Workload Identity Federation (WIF) and OpenID Connect (OIDC).
- Flag any long-lived credentials (`sa-key.json`, `.pem`, `.env`).

### 2. Injection Flaw Analysis
- **Shell Commands**: Flag any `execSync`, `exec`, or child process calls using template string interpolation (`${var}`) instead of structured parameter arrays with `{ shell: false }`.
- **SQL / NoSQL**: Flag any database queries concatenating raw input instead of using parameterized bindings or ORM models.
- **Cross-Site Scripting (XSS)**: Verify HTML templates use context-aware escaping.

### 3. Supply Chain Security
- Run `npm audit` or equivalent dependency scanners.
- Flag dependencies with known CVEs (severity High or Critical).
- Ensure lockfiles (`package-lock.json`, `poetry.lock`, `Cargo.lock`) are committed and checked.

### 4. Zeroization & Memory Safety
- In security-sensitive code handling cryptography or passphrases, verify sensitive buffers are zeroed out (`buffer.fill(0)`) immediately after use.

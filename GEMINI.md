# Antigravity Workspace Invariants: Knowledge Substrate & Lifecycle Safety

This repository is configured with automated lifecycle hooks and a persistent memory substrate.

## 1. Persistent Knowledge Sources
- **AST Dependency Graph**: `.antigravity/graph.json` (ground-truth AST symbols, function calls, module links, and community clusters).
- **Architecture Decision Records**: `docs/adr/` (Obsidian vault with formal ADRs and invariants).
- **Architecture Visual Vault**: `docs/architecture/` (visual canvas and component notes).

## 2. Feature Planning Anti-Hallucination Policy
- When planning any feature, refactor, or architectural change:
  1. Inspect `.antigravity/graph.json` to identify caller/callee chains and AST relationships before declaring dependencies.
  2. Do not hallucinate imports or speculative APIs.
  3. Ensure alignment with accepted decisions in `docs/adr/`.

## 3. Lifecycle Safety Guardrails
- Direct pushes or commits to protected branches (`main`, `master`, `production`, `release/*`) are locked by `branch-guard`.
- Shell commands are sandboxed against destructive actions by `shell-sandbox`.
- Syntax integrity and linting are enforced by `lint-enforcer`.

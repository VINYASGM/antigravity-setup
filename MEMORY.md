# MEMORY.md: Autonomous Persistent State Substrate

> **Purpose**: Survives Antigravity 135,000-token automated context compaction.
> Holds dense, high-signal structural anchors, architectural invariants, verified task progress, and unresolved items.
> **Last Synchronized**: 2026-09-17

---

## 1. Architectural Invariants & Topology Anchors
- **Workspace Primary Stack**: Node.js lifecycle hooks, PowerShell / Windows 11 host environment, git-governed repository.
- **Hook Discovery Path**: Solely discovered at `.agents/hooks.json` (pointing to `.antigravity/scripts/*.js`). All duplicate hook files removed.
- **Persistent Knowledge Sources**:
  - Codebase AST Topology: `.antigravity/graph.json` (146 nodes, 177 edges, 15 communities). Checked for freshness against source file mtimes.
  - Architecture Decision Records: `docs/adr/` (ADR-0001 through ADR-0007). Hand-authored ground truth.
  - Visual Vault: `docs/architecture/` (regenerable build artifacts, gitignored).
- **Core Security Directives**:
  - `branch-guard.js`: Blocks direct push, direct commit, deletion, or hard-reset on `main`, `master`, `release/*`, `production*`.
  - `shell-sandbox.js`: Blocks recursive wipes (`rmdir /s /q`, `Remove-Item -Recurse -Force`), disk partitioning (`diskpart`, `Clear-Disk`), registry wipes, credential dumps, unescaped pipes (`curl|bash`), and unrecoverable git wipes (`git clean -fdx`, `git reflog expire`).
  - `lint-enforcer.js`: Multi-language syntax verification (.json, .js, .py, .ts) with pre-commit and stop validation.
  - `open-pr-on-goal.js`: Auto-PR dispatch strictly upon verified `prd.json` completion, with test verification and injection-safe `spawnSync`.
- **Continuous Evaluation Quality Gates**:
  - Framework: `coder-eval` with declarative YAML benchmark tasks (`evals/tasks/`).
  - Engine: `scripts/coder-eval-runner.js` computing `skill_triggered`, continuous weighted score (min 0.85), telemetry economics, and A/B prompt comparisons.
  - Workflow: `.github/workflows/coder-eval.yml` gating PRs and running on weekly schedule.

---

## 2. Canonical Directory Structure Reference
- `AGENTS.md`: Three-layer master directive (Directive, Orchestration, Execution).
- `MEMORY.md`: This file. High-density state persistence across context compactions.
- `evals/`: Continuous evaluation configuration (`coder-eval.config.yml`), tasks (`tasks/`), and reports (`results/`).
- `.agent/rules/` & `.agents/rules/`: Contextual targeting via YAML frontmatter `globs` arrays.
- `.agent/skills/` & `.agents/skills/`: Semantic skills with progressive disclosure (`SKILL.md` frontmatter with `allow_implicit_invocation: true`).
- `.agent/workflows/` & `.agents/workflows/`: Sequential process definitions mapping human intent to execution steps.
- `mcp_config.json`: Standard Model Context Protocol server configuration.

---

## 3. Active Persona States & Capabilities
- `[id: architect]`: Invariants and ADR maintenance active (ADR-0001 to ADR-0007).
- `[id: dev]`: TDD, surgical edits, and code generation evaluation active.
- `[id: devops]`: Shell sandboxing, CI/CD log redaction, and `coder-eval.yml` quality gates active.
- `[id: data_engineer]`: Partitioning, RLS, and parameterized queries active.

---

## 4. Current Verification State
- **Automated Verification Suite**: 41 / 41 tests passing (100%).
- **Coder-Eval Benchmark**: 100.0% weighted score, all 6 skills triggered semantically, quality gates passed.
- **Topological Integrity**: 146 nodes, 177 edges in `.antigravity/graph.json`, zero staleness warnings.

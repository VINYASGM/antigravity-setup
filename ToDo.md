# ToDo / Roadmap: Canonical Antigravity Architecture, Guardrails & Continuous Evaluation

## Phase 1: Planning & Governance Documentation [COMPLETED]
- [x] Create Product Requirements Document (`PRD.md`)
- [x] Create Technical Requirements Document (`TRD.md`)
- [x] Create System Architecture Document (`Architecture.md`)
- [x] Create Roadmap / ToDo list (`ToDo.md`)
- [x] Initialize Project State (`State.md`)
- [x] Document Context & Runtime Metadata (`context.md`)

## Phase 2: Configuration & Discovery Path Realignment [COMPLETED]
- [x] Eliminate redundant `.antigravity/hooks.json` dead duplicate
- [x] Eliminate decorative, unparsed `settings.json` files
- [x] Standardize on `.agents/hooks.json` as authoritative hook registration
- [x] Maintain scripts in `.antigravity/scripts/`

## Phase 3: Shell Injection Remediation [COMPLETED]
- [x] Migrate `open-pr-on-goal.js` to `spawnSync` with `{ shell: false }`
- [x] Migrate `parse-coderabbit-review.js` to `spawnSync` with `{ shell: false }`
- [x] Implement strict input sanitization on PR numbers and repository strings
- [x] Migrate `lint-enforcer.js` node syntax checking to `spawnSync`

## Phase 4: Shell Sandbox & Environment Hardening [COMPLETED]
- [x] Intercept PowerShell destructive cmdlets (`Remove-Item -Recurse -Force`, `Clear-Disk`, `Remove-Item Env:\`)
- [x] Intercept unrecoverable Git data loss commands (`git clean -fdx`, `git reflog expire`)
- [x] Require interactive user confirmation for broad staging (`git add .`, `git add -A`)
- [x] Enforce fail-closed policy (`deny`) on unexpected exceptions in security hooks

## Phase 5: Goal-Driven & Branch-Agnostic PR Dispatch [COMPLETED]
- [x] Gate `open-pr-on-goal.js` strictly on completed tasks in `prd.json`
- [x] Dynamically detect repository base branch (`main` vs `master`)
- [x] Run local test suite synchronously before checking quality checkboxes

## Phase 6: Mechanical Substrate Freshness & Repository Hygiene [COMPLETED]
- [x] Implement mtime freshness comparison in `knowledge-injector.js`
- [x] Inject real-time warning if `.antigravity/graph.json` is older than modified source files
- [x] Add `docs/architecture/` to `.gitignore`
- [x] Untrack and clean 159 single-identifier generated files from git
- [x] Preserve hand-authored `docs/adr/` Obsidian vault

## Phase 7: Multi-Language Syntax Validation & ESLint Integration [COMPLETED]
- [x] Add Python syntax validation (`py_compile`) to `lint-enforcer.js`
- [x] Author modern flat `eslint.config.mjs` for CodeRabbit automated static analysis
- [x] Document fail-safe rationale for lint-enforcer

## Phase 8: Canonical Directory Structure & Scaffolding [COMPLETED]
- [x] Author `AGENTS.md` implementing Three-Layer Architecture (Directive, Orchestration, Execution)
- [x] Author `MEMORY.md` persistent state document to survive 135,000-token context compaction
- [x] Implement `mcp_config.json` adhering to Model Context Protocol specification
- [x] Author `.agent/rules/` with contextual targeting via YAML frontmatter `globs` arrays
- [x] Author high-leverage skills (`ci-debugger`, `doc-updater`, `security-auditor`) with semantic frontmatter
- [x] Author `.agent/workflows/` multi-step process automations (`ci-remediate`, `security-audit`, `deploy-verify`)
- [x] Mirror `.agent/` and `.agents/` structures for complete discovery parity

## Phase 9: Continuous Evaluation Infrastructure (`coder-eval`) [COMPLETED]
- [x] Author `evals/coder-eval.config.yml` with quality thresholds (0.85 min score, 100% skill trigger)
- [x] Author declarative benchmark task suites (`evals/tasks/skill-routing.yml`, `code-generation.yml`, `ab-experiments.yml`)
- [x] Implement zero-dependency evaluation engine (`scripts/coder-eval-runner.js`)
- [x] Integrate GitHub Actions CI/CD quality gate workflow (`.github/workflows/coder-eval.yml`)
- [x] Record `ADR-0007: Continuous Evaluation Infrastructure via Coder-Eval & CI/CD Quality Gates` in `docs/adr/`
- [x] Register `"eval"` script in `package.json`
- [x] Expand verification suite (`tests/test-hooks.js`) -> 41 / 41 tests passing (100%)
- [x] Verify benchmark runner -> 100% score on all quality gates
- [x] Refresh codebase topology via Graphify -> 146 AST nodes, 177 edges, 15 communities
- [x] Synchronize all governance documents (`PRD.md`, `TRD.md`, `Architecture.md`, `State.md`, `ToDo.md`, `context.md`, `MEMORY.md`)

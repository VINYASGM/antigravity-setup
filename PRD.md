# Product Requirements Document (PRD)

## Project: Canonical Antigravity Architecture, Safety Guardrails, Memory Substrate & Continuous Evaluation (`coder-eval`)

### 1. Overview & Objective
This project establishes a production-grade, canonical Antigravity agentic workspace scaffolding adhering strictly to Google Antigravity's real configuration discovery paths, enterprise security invariants, and automated quality gates. The environment coordinates:
1. **Master Directive & Persona Architecture (`AGENTS.md`)**: Implements the Three-Layer Architecture:
   - **Layer 1: The Directive**: Topology Navigation Discipline, 90% confidence threshold pattern matching, and ambiguity halt gate.
   - **Layer 2: Orchestration**: Subagent personas (`[id: architect]`, `[id: dev]`, `[id: devops]`, `[id: data_engineer]`) implementing the BMad method.
   - **Layer 3: Execution**: Immutable boundaries (no global package installs, isolated `.venv`/`package.json`, and autonomous TDD verification loops).
2. **Context Compaction Resilience (`MEMORY.md`)**: Maintains dense, high-signal structural anchors to survive the Antigravity 135,000-token automated context compaction threshold without context rot.
3. **Contextual Rule Targeting (`.agent/rules/` & `.agents/rules/`)**: Enforces file-scoped constraints using YAML frontmatter glob arrays (`globs: ["..."]`), preventing token waste and hallucination.
4. **Progressive Disclosure & Semantic Skills (`.agent/skills/` & `.agents/skills/`)**: Modular capabilities triggered via semantic frontmatter (`name`, `description`, `allow_implicit_invocation: true`), including CI/CD log debugging with secret redaction (`ci-debugger`), live documentation synchronization (`doc-updater`), and static security auditing (`security-auditor`).
5. **Multi-Step Workflows (`.agent/workflows/` & `.agents/workflows/`)**: Standard operating procedures mapping human intent to sequential execution steps (`/ci-remediate`, `/security-audit`, `/deploy-verify`).
6. **Model Context Protocol (`mcp_config.json`)**: Preconfigured, modular integrations for GitHub, PostgreSQL, Firebase, Firecrawl, and framework orchestration.
7. **Hardened Lifecycle Hooks (`.agents/hooks.json`)**:
   - **`branch-guard.js`**: Fail-closed branch locking preventing direct commits, pushes, or deletions on protected branches (`main`, `master`, `release/*`, `production*`).
   - **`shell-sandbox.js`**: Fail-closed execution containment blocking destructive filesystem wipes (including PowerShell cmdlets `Remove-Item -Recurse -Force`, `Clear-Disk`), registry wipes, piped executions (`curl|bash`), and unrecoverable git commands (`git clean -fdx`, `git reflog expire`), requiring interactive confirmation for broad staging (`git add .`).
   - **`lint-enforcer.js`**: Multi-language syntax verification (`.json`, `.js`, `.py`, `.ts`) with pre-commit gating and stop verification.
   - **`knowledge-injector.js`**: PreInvocation knowledge reminder with mechanical mtime staleness detection for `.antigravity/graph.json`.
   - **`open-pr-on-goal.js`**: Goal-driven, injection-safe (`spawnSync`) PR dispatcher with dynamic base-branch detection and test verification.
8. **Memory Substrate (Graphify AST & Obsidian ADRs)**: Codebase topology mapped into `.antigravity/graph.json` and architectural invariants recorded in Obsidian vault `docs/adr/`.
9. **Continuous Evaluation Infrastructure (`coder-eval`) & CI/CD Quality Gates**:
   - Declarative benchmark task suites (`evals/tasks/`) for `skill_triggered` semantic routing, code generation accuracy, and prompt A/B experimentation.
   - Automated quality gates integrated into `.github/workflows/coder-eval.yml`, blocking regressions and model drift.

---

### 2. Functional Requirements

#### FR-1: Master Directive & Persona Architecture (`AGENTS.md`)
* **FR-1.1**: Mandate pre-flight codebase exploration before generating code. Declare pattern match immutable only when confidence exceeds 90%.
* **FR-1.2**: Halt and surface clarifying questions whenever user prompts are ambiguous.
* **FR-1.3**: Provide distinct operational constraints for subagent personas (`architect`, `dev`, `devops`, `data_engineer`).
* **FR-1.4**: Enforce strict local dependency isolation (no global `npm install -g` or global `pip`).

#### FR-2: Contextual Rule Targeting via Glob Patterns
* **FR-2.1**: Define rules in `.agent/rules/` and `.agents/rules/` with frontmatter `globs` arrays.
* **FR-2.2**: Scope frontend React rules, backend database standards, and devops CI constraints exclusively to relevant files.

#### FR-3: Semantic Skills & Progressive Disclosure
* **FR-3.1**: Every skill directory contains `SKILL.md` with explicit `name`, `description`, and `allow_implicit_invocation: true`.
* **FR-3.2**: `ci-debugger` enforces a mandatory secret redaction protocol (scrubbing tokens, passwords, private IPs/paths) and `--dry-run` validation.
* **FR-3.3**: `doc-updater` provides cross-platform documentation fetching (`scripts/update_docs.js`).
* **FR-3.4**: `security-auditor` scans for injection vulnerabilities, hardcoded credentials, and supply-chain risks.

#### FR-4: Lifecycle Hook Enforcement & Security Hardening
* **FR-4.1**: Workspace hooks register exclusively in `.agents/hooks.json`.
* **FR-4.2**: Security hooks (`branch-guard.js`, `shell-sandbox.js`) fail closed (`deny`) on unhandled errors.
* **FR-4.3**: All shell executions in hook handlers use `spawnSync` with `{ shell: false }` and structured argument arrays to prevent command injection.
* **FR-4.4**: `shell-sandbox.js` intercepts PowerShell cmdlets (`Remove-Item -Recurse -Force`, `Clear-Disk`, `Remove-Item Env:\`) and Git data loss commands (`git clean -fdx`, `git reflog expire`).
* **FR-4.5**: Require confirmation (`decision: "ask"`) for `git add .` and `git add -A`.
* **FR-4.6**: `knowledge-injector.js` mechanically compares `.antigravity/graph.json` mtime against source files and injects a warning if stale.

#### FR-5: Continuous Evaluation Infrastructure (`coder-eval`)
* **FR-5.1**: Define root configuration in `evals/coder-eval.config.yml` with strict quality thresholds (`min_weighted_score: 0.85`, `require_skill_triggered: true`).
* **FR-5.2 (skill_triggered)**: Assert that specific natural language prompts match `SKILL.md` frontmatter descriptions and load the intended skills.
* **FR-5.3 (Weighted Scoring)**: Evaluate accuracy of generated files using continuous 0.0–1.0 scoring based on AST syntax and pattern rubrics.
* **FR-5.4 (Telemetry Tracking)**: Audit token economics and tool call counts (bash, MCP, file writes) to catch infinite loops or budget waste.
* **FR-5.5 (A/B Experimentation)**: Benchmark modifications to `AGENTS.md` and rule sets to measure grounding improvements and token reduction.
* **FR-5.6 (CI/CD Quality Gate)**: Scheduled and PR GitHub Actions workflow (`.github/workflows/coder-eval.yml`) that fails if routing or scoring degrades.

---

### 3. Non-Functional Requirements
* **Continuous Testability**: Agent configuration is an observable, benchmarked software system rather than static text.
* **Command Injection Immunity**: 100% elimination of unescaped shell string interpolations in security boundaries.
* **Fail-Safe Integrity**: Fail closed on security boundaries; fail safe with explanatory diagnostic on non-critical metadata parsers.
* **Cross-Platform Compatibility**: Fully compatible with Windows 11 PowerShell/cmd and Unix-like environments.
* **Zero External Dependency Bloat**: Core lifecycle hooks and benchmark runner operate natively.

---

### 4. Verification & Success Criteria
* [x] Canonical directory structure scaffolded: `AGENTS.md`, `MEMORY.md`, `mcp_config.json`, `.agent/rules/`, `.agent/skills/`, `.agent/workflows/`.
* [x] Dead duplicate `.antigravity/hooks.json` and inert `settings.json` eliminated.
* [x] Shell injection vulnerabilities remediated via `spawnSync` `{ shell: false }`.
* [x] Shell sandbox covers PowerShell cmdlets, Git data loss, and broad staging gating.
* [x] Knowledge substrate staleness mechanically detected and warned.
* [x] Multi-language linting (.json, .js, .py, .ts) and flat `eslint.config.mjs` active.
* [x] Coder-Eval benchmark engine (`scripts/coder-eval-runner.js`) and task suites (`evals/tasks/`) operational.
* [x] GitHub Actions CI/CD quality gate workflow (`.github/workflows/coder-eval.yml`) configured.
* [x] ADR-0007 recorded and indexed in `docs/adr/`.
* [x] 41 / 41 automated verification tests passing (100% pass rate).
* [x] Codebase topology fresh with 146 AST nodes and 177 edges in `.antigravity/graph.json`.

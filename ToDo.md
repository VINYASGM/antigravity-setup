# ToDo / Roadmap: Workspace Safety Guardrails, Memory Substrate & Behavioral Skills

## Phase 1: Planning & Documentation [COMPLETED]
- [x] Create Product Requirements Document (`PRD.md`)
- [x] Create Technical Requirements Document (`TRD.md`)
- [x] Create System Architecture Document (`Architecture.md`)
- [x] Create Roadmap / ToDo list (`ToDo.md`)
- [x] Initialize Project State (`State.md`)
- [x] Document Context & Runtime Metadata (`context.md`)

## Phase 2: Configuration & Directory Setup [COMPLETED]
- [x] Create `.antigravity/` directory and `.antigravity/scripts/` directory
- [x] Create `.antigravity/hooks.json` specifying `lint-enforcer`, `branch-guard`, and `shell-sandbox`
- [x] Establish fallback / compatibility mirror in `.agents/hooks.json`

## Phase 3: Hook Handlers Implementation [COMPLETED]
- [x] Implement `.antigravity/scripts/branch-guard.js`
- [x] Implement `.antigravity/scripts/shell-sandbox.js`
- [x] Implement `.antigravity/scripts/lint-enforcer.js`

## Phase 4: Verification & Automated Testing [COMPLETED]
- [x] Execute automated mock input tests for all hooks (`tests/test-hooks.js`)
- [x] 19 / 19 unit tests passing

## Phase 5: Memory Substrate: Graphify + Obsidian [COMPLETED]
- [x] Initialize `docs/adr/` directory with Obsidian vault configuration (`.obsidian/app.json`)
- [x] Create ADR Index (`docs/adr/README.md`) and standard template
- [x] Record `ADR-0001: Establish Memory Substrate with Graphify + Obsidian`
- [x] Record `ADR-0002: Antigravity Lifecycle Safety & Quality Guardrails`
- [x] Record `ADR-0003: Architecture Decision Records Standards & Invariants`
- [x] Implement `scripts/graphify-cli.js` bridge and register `package.json` bin
- [x] Execute `npx graphify --output .antigravity/graph.json --obsidian docs/architecture`
- [x] Verify `.antigravity/graph.json` contains AST nodes and edges
- [x] Verify `docs/architecture/` contains Obsidian markdown notes and `graph.canvas`

## Phase 6: Antigravity Knowledge Injection & Anti-Hallucination Planning [COMPLETED]
- [x] Create `.antigravity/settings.json` mounting `docs/` and `.antigravity/graph.json`
- [x] Create `.agents/settings.json` mirror for standard discovery
- [x] Implement `.agents/rules/knowledge-substrate.md` and root `GEMINI.md`
- [x] Implement `.antigravity/scripts/knowledge-injector.js` PreInvocation hook
- [x] Register `knowledge-injector` in `.antigravity/hooks.json` and `.agents/hooks.json`
- [x] Mount Knowledge Item in `<appDataDir>\knowledge\start-codebase-topology\metadata.json`
- [x] Record `ADR-0004: Antigravity Knowledge Injection & Anti-Hallucination Policy`

## Phase 7: Comprehensive Behavioral Skills Suite [COMPLETED]
- [x] Install `.agents/skills/to-prd/SKILL.md` (Requirements -> `prd.json`)
- [x] Install `.agents/skills/design-an-interface/SKILL.md` (Contract-first interfaces)
- [x] Install `.agents/skills/tdd/SKILL.md` (Red-Green-Refactor enforcement)
- [x] Install `.agents/skills/git-guardrails/SKILL.md` (Conventional Commits & Ephemeral Branches)
- [x] Install `.agents/skills/think-first/SKILL.md` (Rule 1: Think Before Coding)
- [x] Install `.agents/skills/simplify/SKILL.md` (Rule 2: Simplicity First & De-bloating)
- [x] Install `.agents/skills/surgical-edits/SKILL.md` (Rule 3: Surgical Changes & Zero Collateral Damage)
- [x] Install `.agents/skills/goal-driven-dev/SKILL.md` (Rule 4: Goal-Driven Execution & Verification Loops)
- [x] Record `ADR-0005: Comprehensive Behavioral Skills Suite` in `docs/adr/`

## Phase 8: CodeRabbit Integration & Automated Review Gates [COMPLETED]
- [x] Initialize Git repository baseline on `main` branch with `.gitignore`
- [x] Author `.coderabbit.yaml` auditing for cyclomatic complexity (> 10), security, and logic bugs
- [x] Create `.github/workflows/coderabbit.yml` GitHub Actions automated audit workflow
- [x] Implement `.antigravity/scripts/open-pr-on-goal.js` auto-PR creator on `Stop` event
- [x] Implement `.antigravity/scripts/parse-coderabbit-review.js` review-to-`prd.json` parser
- [x] Install `.agents/skills/coderabbit-remediate/SKILL.md` autonomous remediation runbook
- [x] Register `goal-pr-creator` in `hooks.json` and configure `reviewGate` in `settings.json`
- [x] Record `ADR-0006: CodeRabbit Review Gates, Automated PR Dispatch & Autonomous Remediation Pass`
- [x] Expand automated test suite to 28 / 28 passing tests
- [x] Refresh codebase topology via Graphify (144 AST nodes, 165 edges, 13 communities)
- [x] Update all governance documents (`PRD.md`, `TRD.md`, `Architecture.md`, `State.md`, `context.md`, `walkthrough.md`)

# Product Requirements Document (PRD)

## Project: Antigravity Workspace Safety Guardrails, Memory Substrate, Behavioral Skills & CodeRabbit Review Gates

### 1. Overview & Objective
This project establishes automated lifecycle guardrails, persistent memory substrate, anti-hallucination knowledge injection, a comprehensive 8-skill suite of Matt Pocock behavioral skills, and automated CodeRabbit PR review gates for the agentic development environment within the workspace. By leveraging Antigravity lifecycle hooks (`hooks.json`), Graphify AST extraction, Obsidian Architecture Decision Records (ADRs), Antigravity 2.0 Project Settings, workspace skills (`.agents/skills/`), and CodeRabbit PR review automation, the system automatically enforces:
1. **Automated Linting & Code Hygiene**: Guarantees that syntax errors and unformatted/invalid code are detected and resolved before completion or commits.
2. **Branch Protection (Branch Locking)**: Prevents accidental direct commits, merges, checkouts, or destructive pushes to sensitive branches (e.g., `main`, `master`, `release/*`, `production`).
3. **Shell Action Sandboxing**: Intercepts shell execution requests to protect the developer machine from destructive system commands, disk modifications, and out-of-boundary directory mutations.
4. **Memory Substrate (Graphify + Obsidian ADRs)**: Prevents agents from ingesting tens of thousands of tokens of raw code by routing codebase context through structured graph topology files (`.antigravity/graph.json`) and linked architectural decision notes (`docs/adr/`, `docs/architecture/`).
5. **Antigravity Knowledge Injection & Anti-Hallucination Planning**: Mounts `docs/` and `.antigravity/graph.json` as persistent knowledge sources in Antigravity 2.0 Project Settings and lifecycle hooks so that feature planning queries the ground-truth topological graph instead of hallucinating dependency chains.
6. **Dual-Tier Behavioral Skills Suite**:
   - **Tier 1 (Workflow & Delivery)**: `to-prd` (requirements formalization), `design-an-interface` (contract-first design), `tdd` (Red-Green-Refactor development), and `git-guardrails` (safe version control).
   - **Tier 2 (Cognitive Discipline)**: `think-first` (explicit assumptions & trade-offs), `simplify` (de-bloating & de-abstraction), `surgical-edits` (zero collateral damage), and `goal-driven-dev` (autonomous verification loops).
7. **Automated Review Gates & CodeRabbit Remediation**:
   - Automatically opens a Pull Request once the `/goal` task queue is exhausted on a feature branch (`open-pr-on-goal.js`).
   - CodeRabbit automatically audits the PR for cyclomatic complexity (> 10), security vulnerabilities, and logic bugs, posting structured comments (`.coderabbit.yaml`).
   - Ingests CodeRabbit review links, parses comments into atomic tasks in `prd.json`, and drives an autonomous remediation pass using TDD and surgical edits (`coderabbit-remediate`).

---

### 2. User Personas & Problem Statement
* **Developer / Workspace Owner**: Needs assurance that autonomous agent actions will not overwrite production branches, wipe system drives, execute unvetted destructive shell scripts, or leave syntax-broken code behind. Needs PRs automatically opened and reviewed by CodeRabbit, and needs review findings autonomously remediated without manual back-and-forth.
* **Agent / Pair Programmer**: Needs fast, deterministic, non-cryptic feedback when an action violates repository policy so it can self-correct immediately. Needs ground-truth AST dependency information when planning features, and explicit runbooks to parse review comments into executable `prd.json` tasks.

---

### 3. Functional Requirements

#### FR-1: Linting Enforcement
* **FR-1.1**: Upon tool executions modifying code (`write_to_file`, `replace_file_content`, `multi_replace_file_content`), track affected files and verify syntax/validity.
* **FR-1.2**: Intercept `git commit` commands in `PreToolUse`. If tracked files have syntax/lint failures, deny execution with actionable error diagnostics.
* **FR-1.3**: Intercept agent loop termination (`Stop`). If syntax or lint violations remain unaddressed, instruct the agent loop to continue and fix the issues.

#### FR-2: Sensitive Branch Locking
* **FR-2.1**: Intercept `run_command` invocations containing Git operations.
* **FR-2.2**: Inspect target branch names against protected patterns: `main`, `master`, `prod*`, `production*`, `release*`.
* **FR-2.3**: Deny direct destructive operations (push to protected branches, direct commit on protected branch, deletion or hard reset).
* **FR-2.4**: Return explicit feedback detailing why the action was blocked and guiding the agent to use a feature branch instead.

#### FR-3: Shell Action Sandboxing
* **FR-3.1**: Intercept all `run_command` calls before execution (`PreToolUse`).
* **FR-3.2**: Enforce a strict blacklist of destructive commands (`format`, `rmdir /s /q`, system deletes, privilege escalation).
* **FR-3.3**: Validate working directories (`Cwd`) against workspace containment.
* **FR-3.4**: Require interactive confirmation (`decision: "ask"`) for system-wide package modifications.

#### FR-4: Memory Substrate & Context Token Optimization
* **FR-4.1**: Initialize `docs/adr/` configured as an Obsidian vault to record Architecture Decision Records (ADRs).
* **FR-4.2**: Extract AST relationships using Graphify, serializing the machine-readable graph to `.antigravity/graph.json`.
* **FR-4.3**: Export an interactive Obsidian architecture vault with `.canvas` visual maps in `docs/architecture/`.
* **FR-4.4**: Provide seamless CLI execution through `npx graphify --output .antigravity/graph.json --obsidian docs/architecture`.

#### FR-5: Antigravity Knowledge Injection & Anti-Hallucination Planning
* **FR-5.1**: Mount `docs/` and `.antigravity/graph.json` as persistent knowledge sources in Antigravity 2.0 Project Settings (`.antigravity/settings.json` and `.agents/settings.json`).
* **FR-5.2**: Enforce `planningPolicy.requireGraphTopologyQuery = true` and `disallowHallucinatedDependencies = true`.
* **FR-5.3**: Implement a `PreInvocation` hook (`knowledge-injector.js`) injecting persistent knowledge awareness into agent execution.
* **FR-5.4**: Establish always-on workspace rules (`.agents/rules/knowledge-substrate.md` and `GEMINI.md`) directing feature planning to ground-truth graph nodes.
* **FR-5.5**: Mount Knowledge Item (KI) in `<appDataDir>\knowledge\start-codebase-topology` for cross-session IDE recognition.

#### FR-6: Comprehensive Behavioral Skills Suite
* **FR-6.1**: Install `to-prd`, `design-an-interface`, `tdd`, and `git-guardrails` for Delivery Workflow.
* **FR-6.2**: Install `think-first`, `simplify`, `surgical-edits`, and `goal-driven-dev` for Cognitive Discipline.

#### FR-7: CodeRabbit Automated Review Gates & Autonomous Remediation Loop
* **FR-7.1**: Automatically push feature branches and dispatch Pull Requests upon `/goal` queue exhaustion via `open-pr-on-goal.js`.
* **FR-7.2**: Configure `.coderabbit.yaml` to audit for cyclomatic complexity (> 10), security vulnerabilities, and logic bugs with structured comments (`[CRITICAL]`, `[WARNING]`, `[SUGGESTION]`).
* **FR-7.3**: Ingest CodeRabbit review links via `parse-coderabbit-review.js`, translating review findings into atomic `REMEDIATION-XXX` tasks in `prd.json`.
* **FR-7.4**: Execute autonomous remediation passes using `coderabbit-remediate` skill via TDD and surgical edits, committing and pushing fixes back to the PR.

---

### 4. Non-Functional Requirements
* **Performance**: Hook handlers must execute within < 200ms. Skills must use progressive disclosure to avoid token bloat.
* **Zero External Dependencies**: Core hook handlers and skills run natively without requiring third-party `node_modules`.
* **Cross-Platform Compatibility**: Tuned for Windows (`cmd /c`) and PowerShell while maintaining cross-platform standard schemas.
* **Robust Fail-Safe**: Fail safely with explanatory diagnostics rather than silently permitting dangerous actions.

---

### 5. Success Criteria & Verification
* [x] Configuration file `.antigravity/hooks.json` conforms to Antigravity hook schema.
* [x] `docs/adr/` initialized as an Obsidian vault containing ADR-0001 to ADR-0006.
* [x] Codebase topology extracted into `.antigravity/graph.json` and `docs/architecture/` (144 nodes, 165 edges).
* [x] Persistent knowledge sources mounted in `.antigravity/settings.json` and `.agents/settings.json`.
* [x] 8 behavioral skills installed in `.agents/skills/` and registered in `.agents/skills.json`.
* [x] CodeRabbit configured via `.coderabbit.yaml` and `.github/workflows/coderabbit.yml`.
* [x] Automated PR dispatch on `/goal` exhaustion and review parser (`parse-coderabbit-review.js`) verified via automated test suite (28/28 tests passing).

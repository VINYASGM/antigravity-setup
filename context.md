# Context & Workspace Environment

## Environment Specifications
- **Operating System**: Windows 11 (AMD64)
- **Shell**: PowerShell / cmd.exe (Hooks dispatched via `cmd /c` on Windows)
- **Project Root**: `c:\Users\Vinyas G M\OneDrive\Desktop\start`
- **Antigravity Customization Root**: `.antigravity/` (and `.agents/`)
- **Node.js**: v22.20.0
- **Python**: 3.13.7 (with `graphifyy` library installed)
- **Git**: 2.52.0.windows.1

## Key Components & Subsystems

### 1. Comprehensive Behavioral Skills Suite (8 Skills)
Located in [.agents/skills/](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.agents/skills/) and registered in [.agents/skills.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.agents/skills.json):

#### Delivery Workflow Tier:
- **to-prd**: Translates prompts into atomic `prd.json` task lists with binary acceptance criteria.
- **design-an-interface**: Enforces contract-first type and boundary definitions prior to implementation.
- **tdd**: Enforces Red-Green-Refactor development, requiring a failing test prior to production code.
- **git-guardrails**: Enforces Conventional Commits and isolation in ephemeral feature branches.

#### Cognitive Discipline Tier (Operationalizing Core Rules):
- **think-first**: Operationalizes Rule 1 (Think Before Coding). Assumptions, trade-offs, and alternative analysis.
- **simplify**: Operationalizes Rule 2 (Simplicity First). De-bloating and single-use abstraction stripping.
- **surgical-edits**: Operationalizes Rule 3 (Surgical Changes). Zero adjacent edits, 100% diff traceability.
- **goal-driven-dev**: Operationalizes Rule 4 (Goal-Driven Execution). Binary success criteria with autonomous loop execution.

#### Review Gate & Remediation Tier:
- **coderabbit-remediate**: Ingests CodeRabbit review links, populates `prd.json`, and drives autonomous remediation pass.

### 2. Antigravity 2.0 Project Settings & Knowledge Mounting
- **Settings File**: [.antigravity/settings.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/settings.json) & [.agents/settings.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.agents/settings.json)
  - Mounts `.antigravity/graph.json` as primary topological knowledge source.
  - Mounts `docs/adr/` and `docs/architecture/` as Obsidian vaults.
  - Enforces `planningPolicy.requireGraphTopologyQuery = true` and `disallowHallucinatedDependencies = true`.
  - Declares `goalPolicy.openPrOnExhaustion = true` and `reviewGate` remediation configuration.
- **PreInvocation Hook**: [.antigravity/scripts/knowledge-injector.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/knowledge-injector.js)
  - Injects persistent knowledge context before model invocation.
- **Always-on Rules**: [.agents/rules/knowledge-substrate.md](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.agents/rules/knowledge-substrate.md) and [GEMINI.md](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/GEMINI.md).
- **IDE Knowledge Item**: Mounted at `<appDataDir>\knowledge\start-codebase-topology\metadata.json`.

### 3. CodeRabbit Integration & Review Gates
- **Audit Rules Configuration**: [.coderabbit.yaml](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.coderabbit.yaml)
  - Cyclomatic complexity ceiling (> 10 flagged for refactoring).
  - Security audit (shell injections, escaping, secrets).
  - Logic bug prevention & unhandled error paths.
- **Automated Workflow**: [.github/workflows/coderabbit.yml](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.github/workflows/coderabbit.yml)
- **Auto-PR Dispatch on Goal**: [.antigravity/scripts/open-pr-on-goal.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/open-pr-on-goal.js)
- **Review Parser**: [.antigravity/scripts/parse-coderabbit-review.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/parse-coderabbit-review.js)

### 4. Memory Substrate
- **Obsidian ADR Vault**: [docs/adr/](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/docs/adr/)
  - Configured as an Obsidian vault via `.obsidian/app.json`.
  - Maintains `README.md` index and individual ADR markdown documents (ADR-0001 to ADR-0006).
- **Codebase Graph Topology**: [.antigravity/graph.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/graph.json) (144 AST nodes, 165 edges, 13 communities).
- **Obsidian Architecture Notes**: [docs/architecture/](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/docs/architecture/) (157 notes + `graph.canvas`).
- **CLI Bridge**: [scripts/graphify-cli.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/scripts/graphify-cli.js) and [package.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/package.json).

### 5. Lifecycle Safety Guardrails
- **Config**: [.antigravity/hooks.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/hooks.json) & [.agents/hooks.json](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.agents/hooks.json)
- **Branch Guard**: [.antigravity/scripts/branch-guard.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/branch-guard.js)
- **Shell Sandbox**: [.antigravity/scripts/shell-sandbox.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/shell-sandbox.js)
- **Lint Enforcer**: [.antigravity/scripts/lint-enforcer.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/lint-enforcer.js)
- **Auto-PR Creator**: [.antigravity/scripts/open-pr-on-goal.js](file:///c:/Users/Vinyas%20G%20M/OneDrive/Desktop/start/.antigravity/scripts/open-pr-on-goal.js)


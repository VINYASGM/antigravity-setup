# Context & Environment Metadata

## 1. Operating Environment
* **OS**: Windows 11 Home Single Language (Build 26100)
* **Shell**: PowerShell (`powershell.exe`) & Windows Command Processor (`cmd.exe`)
* **Node.js**: Modern LTS runtime supporting ES modules and CommonJS
* **Version Control**: Git 2.47+ with GitHub CLI (`gh`)
* **Workspace Directory**: `c:\Users\Vinyas G M\OneDrive\Desktop\start`
* **App Data Directory**: `C:\Users\Vinyas G M\.gemini\antigravity-ide`
* **Customization Roots**:
  - Global: `%USERPROFILE%\.gemini\config`
  - Workspace: `.agents` and canonical `.agent/`

---

## 2. Canonical Directory Structure Reference

```
start/
├── AGENTS.md                   # Three-Layer Master Directive (Directive, Orchestration, Execution)
├── MEMORY.md                   # State persistence substrate (survives 135k context compaction)
├── mcp_config.json             # Model Context Protocol configuration
├── eslint.config.mjs           # Flat ESLint configuration for CodeRabbit
├── .coderabbit.yaml            # CodeRabbit assertiveness profile and audit rules
├── .gitignore                  # Ignores node_modules, cache, and docs/architecture/
├── package.json                # Project scripts (graphify, test, eval)
│
├── .github/workflows/
│   ├── coderabbit.yml          # Automated PR static & AI audit
│   └── coder-eval.yml          # Continuous evaluation CI/CD quality gate
│
├── evals/                      # Coder-Eval Continuous Evaluation Infrastructure
│   ├── coder-eval.config.yml   # Quality thresholds and evaluation configuration
│   ├── tasks/                  # Declarative YAML evaluation suites
│   │   ├── skill-routing.yml   # Semantic routing integrity (skill_triggered)
│   │   ├── code-generation.yml # Code correctness, AST syntax & guardrails
│   │   └── ab-experiments.yml  # A/B prompt & scoping benchmarks
│   └── results/                # Evaluation output reports (report.json, summary.md)
│
├── .agent/ & .agents/          # Antigravity customization roots (mirrored for total parity)
│   ├── hooks.json              # Authoritative lifecycle hook registration
│   ├── rules/                  # Contextual rules with frontmatter glob targeting
│   │   ├── frontend-react.md   # Scoped to frontend components and styles
│   │   ├── backend-database.md # Scoped to backend services, SQL, and migrations
│   │   ├── devops-ci.md        # Scoped to CI workflows, scripts, and Terraform
│   │   └── knowledge-substrate.md # Scoped globally to enforce AST topology navigation
│   ├── skills/                 # Semantic skills with progressive disclosure
│   │   ├── ci-debugger/        # CI/CD log debugging with secret redaction mandate
│   │   ├── doc-updater/        # Live documentation scraping & synchronization
│   │   ├── security-auditor/   # Static security, secret scanning & zeroization
│   │   ├── to-prd/             # Requirements formalization into prd.json
│   │   ├── design-an-interface/ # Contract-first API and schema design
│   │   ├── tdd/                # Test-Driven Development (Red-Green-Refactor)
│   │   ├── git-guardrails/     # Conventional commits on ephemeral branches
│   │   ├── think-first/        # Pre-flight assumptions and trade-off analysis
│   │   ├── simplify/           # De-bloating and de-abstraction pass
│   │   ├── surgical-edits/     # Zero adjacent edits, 100% diff traceability
│   │   ├── goal-driven-dev/    # Autonomous verification loops
│   │   └── coderabbit-remediate/ # Autonomous CodeRabbit PR remediation loop
│   └── workflows/              # Multi-step process automations & slash commands
│       ├── ci-remediate.md     # /ci-remediate workflow
│       ├── security-audit.md   # /security-audit workflow
│       └── deploy-verify.md    # /deploy-verify workflow
│
├── .antigravity/
│   ├── graph.json              # Ground-truth AST dependency topology (146 nodes, 177 edges)
│   ├── .cache/                 # Local syntax cache for modified files
│   └── scripts/                # Hardened hook handlers
│       ├── branch-guard.js     # Fail-closed branch locking
│       ├── shell-sandbox.js    # Fail-closed PowerShell & shell sandbox
│       ├── lint-enforcer.js    # Multi-language syntax verification
│       ├── knowledge-injector.js # PreInvocation injection with mtime staleness check
│       ├── open-pr-on-goal.js  # Injection-immune, goal-driven PR dispatcher
│       └── parse-coderabbit-review.js # Injection-immune review comment parser
│
├── docs/
│   ├── adr/                    # Hand-authored Obsidian ADRs (ADR-0001 - ADR-0007)
│   └── architecture/           # Regenerable visual canvas & AST notes (gitignored)
│
└── tests/
    └── test-hooks.js           # Automated verification test suite (41 / 41 tests passing)
```

---

## 3. Active Security & Operational Invariants
1. **Continuous Evaluation Quality Gates**: Every PR and weekly schedule executes `coder-eval` checking semantic routing, weighted scoring, and telemetry.
2. **Zero Command Injection**: All hook scripts execute commands via `spawnSync` with `{ shell: false }` and argument arrays.
3. **Fail-Closed Security Boundaries**: `branch-guard.js` and `shell-sandbox.js` unconditionally deny execution upon unhandled errors.
4. **PowerShell Containment**: Destructive cmdlets (`Remove-Item -Recurse -Force`, `Clear-Disk`, `Remove-Item Env:\`) are blocked.
5. **Git Data Loss Prevention**: `git clean -fdx` and `git reflog expire` are blocked; `git add .` / `git add -A` triggers confirmation gating.
6. **Dynamic Base Branch Detection**: Scripts resolve `main` or `master` at runtime rather than hardcoding.
7. **Mechanical Knowledge Freshness**: `knowledge-injector.js` checks filesystem mtimes on every invocation, alerting immediately if `.antigravity/graph.json` drifts stale.

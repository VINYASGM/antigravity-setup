# Architecture Document: Workspace Guardrails, Memory Substrate & Automated Review Gates

## 1. High-Level Architecture Overview

The workspace integrates a complete closed-loop engineering system:
1. **Antigravity Lifecycle Hooks**: Real-time safety gating, branch locking, shell sandboxing, syntax checking, and goal-exhaustion PR dispatch.
2. **Memory Substrate**: Graphify AST topology (`.antigravity/graph.json`) and Obsidian Architecture Decision Records (`docs/adr/`).
3. **Project Settings & Knowledge Injection**: Persistent knowledge mounting in Antigravity 2.0 with anti-hallucination planning invariants.
4. **Behavioral Skills Suite**: 9 modular skills spanning Delivery Workflows, Cognitive Discipline, and Review Remediation.
5. **Automated Review Gates (CodeRabbit)**: Automated PR creation on goal completion, static & AI auditing, and closed-loop remediation via `prd.json`.

```mermaid
flowchart TD
    subgraph Antigravity Project Settings & Knowledge Mounting
        Settings[".antigravity/settings.json"] -->|Mount Source 1| GJSON[".antigravity/graph.json"]
        Settings -->|Mount Source 2| OADR["docs/adr/"]
        Settings -->|Mount Source 3| OArch["docs/architecture/"]
        Settings -->|Enforce Policy| PlanPol["requireGraphTopologyQuery = true"]
        Settings -->|Configure Review Gate| RG["reviewGate + goalPolicy"]
    end

    subgraph Behavioral Skills Suite [.agents/skills/]
        W1["to-prd"] --> W2["design-an-interface"]
        W2 --> W3["tdd"]
        W3 --> W4["git-guardrails"]
        
        Remed["coderabbit-remediate"] --> W1
    end

    subgraph Memory & Context Substrate
        Codebase[Source Code & Files] -->|AST Analysis| GExt[Graphify Engine]
        GExt -->|JSON Graph| GJSON
        GExt -->|Vault Notes & Canvas| OArch
        
        Dev[Architects / Developers] -->|Author & Maintain| OADR
        OADR -.->|Wikilinks| OArch
    end

    subgraph Execution Loop & Automated Review Gates
        Model[Agent LLM Model] --> W1
        PreInv[PreInvocation: knowledge-injector.js] -->|Inject Knowledge & Policy| Model
        
        W4 --> ToolDecision[Tool Step: git / run_command]
        ToolDecision --> HookDispatch{Lifecycle Guard}
        
        HookDispatch -- PreToolUse --> BG[branch-guard.js]
        HookDispatch -- PreToolUse --> SS[shell-sandbox.js]
        HookDispatch -- PreToolUse (Commit) --> LE1[lint-enforcer.js]
        
        BG -->|Allow / Deny| Exec[Execute Tool]
        SS -->|Allow / Deny / Ask| Exec
        LE1 -->|Allow / Deny| Exec
        
        Exec --> PostCheck[PostToolUse: lint-enforcer.js]
        PostCheck --> Model
        
        Model -- /goal Queue Exhausted --> StopHook{Stop Hooks}
        StopHook --> LE2[lint-enforcer.js (stop)]
        StopHook --> PRDisp["open-pr-on-goal.js<br/>(Push Feature Branch & Open PR)"]
        
        PRDisp --> GHPR["GitHub Pull Request"]
        GHPR --> CR["CodeRabbit AI Review<br/>(.coderabbit.yaml)"]
        CR -->|Review Comments: Complexity, Security, Bugs| CRLink["Review URL / Comments"]
        CRLink --> Remed
    end
```

---

## 2. Review Gate & Remediation Subsystem

1. **Auto-PR Dispatch (`open-pr-on-goal.js`)**:
   - Executes during the `Stop` event when `fullyIdle: true`.
   - Confirms active branch is a feature branch and verifies commit history.
   - Pushes branch and invokes `gh pr create` with `@coderabbitai review` tag.
2. **CodeRabbit Audit Engine (`.coderabbit.yaml`)**:
   - Audits cyclomatic complexity (> 10 threshold).
   - Scans for security vulnerabilities and injection flaws.
   - Flags logic bugs and unhandled exceptions with structured comments (`[CRITICAL]`, `[WARNING]`, `[SUGGESTION]`).
3. **Review Parser & Remediation Pass (`parse-coderabbit-review.js` & `coderabbit-remediate`)**:
   - Translates line-level findings into atomic `REMEDIATION-XXX` tasks in `prd.json`.
   - Executes autonomous TDD remediation pass and pushes fixes back to the PR.

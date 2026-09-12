# Architecture Decision Records (ADR) Vault

Welcome to the **Architecture Decision Records (ADR)** repository for this project. This folder is structured as an **Obsidian Vault** to enable bi-directional wikilinking, graph visualization, and persistent memory retention for human developers and autonomous AI agents.

## Purpose & Principles
Autonomous agents consume significant context windows when reading raw codebases from scratch. This ADR vault, coupled with the Graphify AST topology in `docs/architecture/` and `.antigravity/graph.json`, forms the project's **Memory Substrate**:
1. **Decision Integrity**: Every major technical decision (state management, API invariants, schema migrations, guardrails) is codified with rationale and consequences.
2. **Token Efficiency**: Agents consult structured ADR summaries and graph relationships before opening source files.
3. **Traceability**: All ADRs are immutable once accepted unless superseded by a subsequent ADR.

---

## Index of Architecture Decision Records

| ID | Title | Status | Date |
| :--- | :--- | :--- | :--- |
| [[0001-memory-substrate-graphify-obsidian\|ADR-0001]] | Establish Memory Substrate: Graphify + Obsidian | Accepted | 2026-09-12 |
| [[0002-antigravity-lifecycle-hooks\|ADR-0002]] | Antigravity Lifecycle Safety & Quality Guardrails | Accepted | 2026-09-12 |
| [[0003-adr-specification-and-invariants\|ADR-0003]] | Architecture Decision Records Standards & Invariants | Accepted | 2026-09-12 |
| [[0004-antigravity-knowledge-injection\|ADR-0004]] | Antigravity Knowledge Injection & Anti-Hallucination Policy | Accepted | 2026-09-12 |
| [[0005-behavioral-skills-suite\|ADR-0005]] | Comprehensive Behavioral Skills Suite (Workflow & Cognitive Discipline) | Accepted | 2026-09-12 |
| [[0006-coderabbit-review-gates-remediation\|ADR-0006]] | CodeRabbit Review Gates, Automated PR Dispatch & Autonomous Remediation Pass | Accepted | 2026-09-12 |

---

## ADR Template
When proposing a new ADR, create `XXXX-short-title.md` following this structure:
```markdown
# ADR-XXXX: [Title]

- **Status**: [Proposed | Accepted | Deprecated | Superseded by ADR-YYYY]
- **Date**: YYYY-MM-DD
- **Authors**: [Names / Agent IDs]
- **Tags**: #architecture #security #memory

## Context & Problem Statement
[Describe the context, user request, and technical problem]

## Decision Drivers
- [Driver 1]
- [Driver 2]

## Considered Options
1. [Option 1]
2. [Option 2]

## Decision Outcome
Chosen Option: [Option X] because [rationale].

### Positive Consequences
- [...]

### Negative Consequences / Tradeoffs
- [...]

## Invariants & Compliance Rules
- [Rule 1 that all agents and developers must strictly follow]
```

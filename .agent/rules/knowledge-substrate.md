---
description: Topological Graph First and Anti-Hallucination Planning Invariant
globs: ["**/*"]
---

# Knowledge Substrate & Anti-Hallucination Planning Invariant

This workspace mounts `.antigravity/graph.json` and `docs/` as persistent knowledge sources.

## Mandatory Rules for Feature Planning & Code Modification

1. **Topological Graph First**:
   - Before proposing changes, declaring dependencies, or modifying existing modules, you **MUST** query `.antigravity/graph.json` to inspect ground-truth AST relationships (callers, callees, symbol exports, imports).
   - Alternatively, invoke `npm run graphify` to inspect or update community clusters.
   - **Do NOT hallucinate dependency chains or invent module relationships.** If an edge does not exist in `.antigravity/graph.json`, verify with existing files before assuming it exists.

2. **Obsidian Architecture Decision Records (ADRs)**:
   - When deciding on new architectural patterns, schemas, or invariants, consult `docs/adr/` first to ensure consistency with prior accepted decisions ([[ADR-0001]], [[ADR-0002]], [[ADR-0003]], [[ADR-0004]], [[ADR-0005]], [[ADR-0006]]).
   - Any new major architectural commitment must be recorded as a new ADR in `docs/adr/`.

3. **Incremental Graph Refresh**:
   - After completing code modifications, refresh the codebase topology by executing `npm run graphify -- --output .antigravity/graph.json --obsidian docs/architecture` to ensure downstream agents operate on updated AST context.

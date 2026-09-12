---
name: to-prd
description: Translates natural language prompts, feature requests, or user requirements into an atomic, machine-readable prd.json task list. Activate this skill whenever the user asks to plan a feature, break down requirements, formalize a PRD, or create a task list.
---

# /to-prd: Requirements Formalization

Transform ambiguous, natural language feature requests and user requirements into a rigorous, atomic, machine-readable `prd.json` task specification.

## Core Principles
1. **Atomic Decomposition**: Every task in `prd.json` must be self-contained and completable in a single, focused execution loop.
2. **Binary Acceptance Criteria**: Criteria must be unambiguously testable (pass/fail)—never fuzzy or subjective.
3. **Explicit Dependencies**: Tasks must declare prerequisites (`dependsOn`) to prevent circular or premature execution.

---

## Schema Specification (`prd.json`)

```json
{
  "$schema": "https://antigravity.google/schemas/prd.json",
  "project": "project-name",
  "version": "1.0.0",
  "epic": {
    "title": "Feature or Epic Title",
    "description": "High-level objective and value proposition",
    "targetPersona": "Developer / End User"
  },
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Atomic Task Title",
      "description": "Precise description of what needs to be implemented.",
      "type": "interface | test | implementation | documentation",
      "dependsOn": [],
      "acceptanceCriteria": [
        "Given [context], when [action], then [expected outcome].",
        "Automated test XYZ exits with status code 0."
      ],
      "affectedComponents": [
        "src/module/auth.ts",
        "tests/auth.test.ts"
      ],
      "status": "pending"
    }
  ]
}
```

---

## Step-by-Step Workflow

### Step 1: Intent Extraction & Boundary Identification
1. Analyze the user's prompt to identify:
   - Primary goal and user personas.
   - Non-goals (what should explicitly NOT be built).
   - Invariants and non-negotiables.
2. If major ambiguity exists, stop and surface trade-offs or clarify before generating tasks.

### Step 2: Contract-First Decomposition
Always order task dependencies following the Matt Pocock delivery sequence:
1. **Contract/Interface Task**: Define types, interfaces, schemas (`design-an-interface`).
2. **Verification Task**: Write failing tests reproducing or verifying the specification (`tdd`).
3. **Implementation Task**: Minimal viable code satisfying the tests and interfaces.
4. **Integration & Docs Task**: Wire into the system and update governance docs.

### Step 3: Write and Verify `prd.json`
Write the task list to the root or designated directory:
```bash
# Save to prd.json
write_to_file "prd.json"
```

### Step 4: Verification Checklist
- [ ] Are all tasks uniquely numbered (`TASK-001`, `TASK-002`)?
- [ ] Does every task have at least one verifiable automated acceptance criterion?
- [ ] Are dependency cycles absent?
- [ ] Does each task touch the minimal blast radius of files?

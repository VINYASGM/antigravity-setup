---
name: think-first
description: Enforces explicit pre-flight thinking before coding. Requires stating assumptions, surfacing trade-offs, considering simpler alternatives, and clarifying ambiguity before modifying code. Activate this skill before starting implementation on non-trivial tasks.
---

# /think-first: Pre-Flight Analysis & Explicit Assumptions

Operationalizes **Rule 1: Think Before Coding**. Before authoring code, you must surface hidden assumptions, evaluate trade-offs, and ensure the simplest path is taken.

## The Iron Law of Thinking First
> **Don't assume. Don't hide confusion. Surface trade-offs. Push back when warranted.**

---

## The Pre-Flight Checklist

Before touching code on any task:

### 1. State Assumptions Explicitly
- List all underlying assumptions regarding:
  - Input shapes and data volume.
  - Environment dependencies (OS, Node version, available binaries).
  - Consumer expectations and backward compatibility.
- If uncertain about ANY requirement, **STOP** and state what is confusing. Ask.

### 2. Present Multiple Interpretations
- If a user prompt can be interpreted in multiple ways, **present them explicitly**.
- Never pick an ambiguous interpretation silently.

### 3. Identify the Simplest Approach
- Ask: *"Is there a simpler way to do this without writing new abstractions or dependencies?"*
- If writing 200 lines when 50 will do, choose the 50-line approach.
- Push back respectfully if the user's proposed architecture is overcomplicated.

### 4. Formulate Verifiable Steps
Structure the planned execution into clear, checkable steps:
1. `[Step 1]` → verify: `[check]`
2. `[Step 2]` → verify: `[check]`
3. `[Step 3]` → verify: `[check]`

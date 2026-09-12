---
name: goal-driven-dev
description: Enforces goal-driven execution and autonomous verification loops. Transforms ambiguous tasks into binary success criteria and loops autonomously until all criteria are verified. Activate this skill when managing multi-step tasks, bugfixes, or feature delivery.
---

# /goal-driven-dev: Goal-Driven Execution & Verification Loops

Operationalizes **Rule 4: Goal-Driven Execution**. Guarantees that every task is transformed into verifiable goals and executed through autonomous verification loops.

## The Iron Law of Goal-Driven Development
> **Define success criteria before acting. Loop autonomously until verified. Strong success criteria enable independent execution.**

---

## The Verification Loop Runbook

```mermaid
flowchart TD
    Define["1. Define Binary Success Criteria"] --> Exec["2. Execute Planned Step"]
    Exec --> Verify["3. Run Automated Check"]
    Verify --> Check{Passed?}
    Check -- No --> Diagnose["4. Diagnose Failure & Adapt"]
    Diagnose --> Exec
    Check -- Yes --> Done["5. Task Concluded"]
```

### 1. Transform Tasks into Verifiable Criteria
- **"Add validation"** → *"Write test with 5 invalid inputs; all must return HTTP 400 with expected error codes."*
- **"Fix the bug"** → *"Write a reproducing test that fails on the bug; make it pass without regressing existing tests."*
- **"Refactor module"** → *"Run existing test suite before changes (100% green); make changes; verify suite remains 100% green."*

### 2. Formulate Multi-Step Verifiable Plan
Before making tool calls, state the verifiable plan:
1. `[Step 1]` → verify: `[automated test command or assertion]`
2. `[Step 2]` → verify: `[automated test command or assertion]`
3. `[Step 3]` → verify: `[automated test command or assertion]`

### 3. Loop Independently
- Execute the command or test.
- If the test fails, use the diagnostic output to fix the underlying issue immediately.
- Never stop and ask the user to verify something that an automated script or command can verify.

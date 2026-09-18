# Technical Requirements Document (TRD)

## Project: Canonical Antigravity Architecture, Safety Guardrails, Memory Substrate & Continuous Evaluation (`coder-eval`)

### 1. Architectural Interface & Hook Discovery Contract
Antigravity discovers workspace-level configurations exclusively under `.agents/` (and `.agent/` mirrored for canonical compliance) and global configurations under `~/.gemini/config/`.
* **Workspace Hooks**: Discovered at `.agents/hooks.json`. Handlers reside in `.antigravity/scripts/`.
* **Process Execution**: Executed synchronously via `spawnSync` on Windows (`cmd /c` wrapper neutralized in handler code).
* **Input Protocol**: JSON payload streamed via standard input (`process.stdin`).
* **Output Protocol**: JSON payload emitted to standard output (`process.stdout`).

---

### 2. Fail-Safe & Security Policy Matrix

| Subsystem | Hook Event | Fail Mode | Rationale |
| :--- | :--- | :--- | :--- |
| `branch-guard` | `PreToolUse` | **Fail Closed (`deny`)** | Unauthorized push, commit, or deletion on protected branches is unacceptable under any condition. |
| `shell-sandbox` | `PreToolUse` | **Fail Closed (`deny`)** | Accidental execution of unvalidated or corrupt shell payloads could destroy host disks or data. |
| `lint-enforcer` | `PreToolUse` / `Stop` | **Fail Safe Open (`allow`)** | Unparseable metadata from the IDE must not permanently deadlock the agent execution loop; explicit syntax errors in code files still trigger `deny` or `continue`. |
| `knowledge-injector` | `PreInvocation` | **Fail Safe (`injectSteps: []`)** | Hook failure must never block conversation startup. |
| `goal-pr-creator` | `Stop` | **Fail Safe (`allow`)** | Auto-PR failure must not deadlock loop exit. |

---

### 3. Coder-Eval Continuous Evaluation Engine (`scripts/coder-eval-runner.js`)

#### 3.1 Evaluation Dimensions & Metrics Specification

| Metric Identifier | Purpose | Mathematical / Algorithmic Implementation |
| :--- | :--- | :--- |
| **`skill_triggered`** | Semantic routing integrity | Token-level lexical vector similarity between prompt tokens $P$ and description tokens $S$: <br/>$Score = \min\left(1.0, \frac{\|P \cap S\|}{\sqrt{\|P\| \cdot \|S\|}} \times 1.8\right)$ |
| **`Weighted Scoring`** | Code correctness & AST integrity | Continuous $0.0 - 1.0$ scoring against declarative syntax checks, AST validity, required pattern matches ($+0.25$), and forbidden regex violations ($-0.5$). |
| **`Telemetry Tracking`** | Economics & budget audit | Total estimated token consumption ($Tokens_{est} = \frac{\text{chars}}{4}$), tool execution count ($N_{bash} + N_{mcp} + N_{file}$), and mean execution latency. |
| **`A/B Experimentation`** | Prompt & rule optimization | Comparative delta between baseline variant $A$ and 3-layer `AGENTS.md` variant $B$: <br/>$\Delta_{token} = \frac{Tokens_A - Tokens_B}{Tokens_A}$, $\Delta_{grounding} = Grounding_B - Grounding_A$. |

#### 3.2 CI/CD Quality Gate Contract (`.github/workflows/coder-eval.yml`)
* Threshold criteria:
  - $\text{Weighted Score} \ge 0.85$ (85.0%)
  - $\text{Skill Trigger Rate} = 100\%$
  - $\text{Token Budget} \le 12,000$ tokens per task
* Exit code: exits with code `0` on gate pass, code `1` on failure (blocking PR merge).

---

### 4. Hook Execution Matrix

| Hook Name | Event | Matcher | Handler Command | Timeout |
| :--- | :--- | :--- | :--- | :--- |
| `lint-enforcer` | `PostToolUse` | `write_to_file\|replace_file_content\|multi_replace_file_content` | `node ../.antigravity/scripts/lint-enforcer.js post-tool` | 20s |
| `lint-enforcer` | `PreToolUse` | `run_command` | `node ../.antigravity/scripts/lint-enforcer.js pre-tool` | 20s |
| `lint-enforcer` | `Stop` | N/A (flat) | `node ../.antigravity/scripts/lint-enforcer.js stop` | 30s |
| `branch-guard` | `PreToolUse` | `run_command` | `node ../.antigravity/scripts/branch-guard.js` | 15s |
| `shell-sandbox` | `PreToolUse` | `run_command` | `node ../.antigravity/scripts/shell-sandbox.js` | 15s |
| `knowledge-injector` | `PreInvocation` | N/A (flat) | `node ../.antigravity/scripts/knowledge-injector.js` | 10s |
| `goal-pr-creator` | `Stop` | N/A (flat) | `node ../.antigravity/scripts/open-pr-on-goal.js` | 30s |

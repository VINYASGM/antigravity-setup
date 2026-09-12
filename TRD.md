# Technical Requirements Document (TRD)

## Project: Antigravity Workspace Safety Guardrails, Memory Substrate, Behavioral Skills & CodeRabbit Review Gates

### 1. Architectural Interface & Hook Contract
Antigravity executes hook handlers synchronously as subprocesses via `cmd /c` on Windows.
* **Input**: JSON payload streamed via standard input (`process.stdin`).
* **Output**: JSON payload emitted to standard output (`process.stdout`).
* **Execution Working Directory**: Set by Antigravity runtime to the directory containing `hooks.json` (i.e., `.antigravity/`).

---

### 2. Payload Schema Specifications

#### 2.1 Common Input Payload (stdin)
```json
{
  "conversationId": "string",
  "workspacePaths": ["string"],
  "transcriptPath": "string",
  "artifactDirectoryPath": "string",
  "modelName": "string",
  "stepIdx": 10,
  "toolCall": {
    "name": "run_command",
    "args": {
      "CommandLine": "git push origin main",
      "Cwd": "c:\\Users\\..."
    }
  }
}
```

#### 2.2 Stop Hook Contracts
* `lint-enforcer` Stop contract:
  ```json
  { "decision": "continue", "reason": "Unresolved syntax errors exist in modified files." }
  ```
* `open-pr-on-goal` Stop contract:
  ```json
  { "decision": "allow" }
  ```

---

### 3. Hook Execution Matrix

| Hook Name | Event | Matcher | Handler Command | Timeout |
| :--- | :--- | :--- | :--- | :--- |
| `lint-enforcer` | `PostToolUse` | `write_to_file\|replace_file_content\|multi_replace_file_content` | `node ./scripts/lint-enforcer.js post-tool` | 20s |
| `lint-enforcer` | `PreToolUse` | `run_command` | `node ./scripts/lint-enforcer.js pre-tool` | 20s |
| `lint-enforcer` | `Stop` | N/A (flat) | `node ./scripts/lint-enforcer.js stop` | 30s |
| `branch-guard` | `PreToolUse` | `run_command` | `node ./scripts/branch-guard.js` | 15s |
| `shell-sandbox` | `PreToolUse` | `run_command` | `node ./scripts/shell-sandbox.js` | 15s |
| `knowledge-injector` | `PreInvocation` | N/A (flat) | `node ./scripts/knowledge-injector.js` | 10s |
| `goal-pr-creator` | `Stop` | N/A (flat) | `node ./scripts/open-pr-on-goal.js` | 30s |

---

### 4. CodeRabbit Review Parser Specification (`parse-coderabbit-review.js`)

#### Input Contract:
- GitHub PR URL (e.g. `https://github.com/owner/repo/pull/12`), PR number, or raw markdown/JSON review payload.

#### Output Contract (`prd.json` format):
```json
{
  "id": "REMEDIATION-001",
  "title": "[CRITICAL] Fix Security Vulnerability in auth.js:42",
  "description": "...",
  "type": "implementation",
  "acceptanceCriteria": [
    "Resolve Security Vulnerability reported at auth.js:42.",
    "Write test verifying edge case or security fix.",
    "Automated test suite exits with code 0."
  ],
  "affectedComponents": ["auth.js"],
  "status": "pending"
}
```

---

### 5. Behavioral Skills Matrix (`.agents/skills/`)

| Skill Name | Operationalized Area | Core Runbook Action |
| :--- | :--- | :--- |
| `to-prd` | Requirements Breakdown | Translates prompts into atomic `prd.json` task lists |
| `design-an-interface` | Contract-First Design | Authors strict types/schemas prior to logic |
| `tdd` | Test-Driven Development | Red (fail test) -> Green (pass code) -> Refactor |
| `git-guardrails` | Safe Version Control | Conventional Commits on ephemeral feature branches |
| `think-first` | Rule 1: Think Before Coding | States assumptions, surfaces trade-offs, halts on ambiguity |
| `simplify` | Rule 2: Simplicity First | Audits for single-use abstractions and speculative bloat |
| `surgical-edits` | Rule 3: Surgical Changes | Zero adjacent collateral damage, 100% diff traceability |
| `goal-driven-dev` | Rule 4: Goal-Driven Execution | Binary success criteria with autonomous loop execution |
| `coderabbit-remediate` | Automated Review Gates | Ingests review link, updates `prd.json`, drives remediation pass |

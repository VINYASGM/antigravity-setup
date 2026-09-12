---
name: design-an-interface
description: Enforces contract-first design. Requires strict schema, interface, type definition, and boundary specification prior to authoring any implementation logic. Activate this skill when creating new modules, APIs, data contracts, or component interfaces.
---

# /design-an-interface: Contract-First Design

Enforce contract-first engineering. By designing interfaces and schemas before writing implementation code, systems remain modular, testable, and resistant to architectural rot.

## Core Principles
1. **Contract Precedes Implementation**: Types, schemas, parameters, and return types must be declared and reviewed before writing function bodies.
2. **Implementation Hiding**: Internal state, implementation quirks, and helper details must not leak into the public interface.
3. **Consumer-Centric Ergonomics**: Design from the caller's perspective, optimizing for readability, predictability, and minimal friction.

---

## The Contract-First Workflow

### Step 1: Define the Boundary & Data Shapes
Identify all data entering and exiting the boundary:
* Input arguments / payload types.
* Output / return types.
* Error types and failure states.

### Step 2: Write the Interface Definition File First
Place interfaces in a dedicated contract file or module header:
```typescript
/**
 * Contract: UserAuthenticationService
 */
export interface AuthenticateRequest {
  readonly email: string;
  readonly token: string;
  readonly clientMetadata?: Record<string, string>;
}

export type AuthResult = 
  | { status: 'success'; userId: string; sessionId: string; expiresAt: number }
  | { status: 'rejected'; reason: 'invalid_credentials' | 'expired_token' }
  | { status: 'rate_limited'; retryAfterMs: number };

export interface AuthServiceContract {
  authenticate(request: AuthenticateRequest): Promise<AuthResult>;
  revokeSession(sessionId: string): Promise<boolean>;
}
```

### Step 3: Audit against Invariants
Before proceeding to TDD (`tdd`) or implementation:
- [ ] Are parameter types strict (no loose `any` or untyped `object`)?
- [ ] Are error states explicitly modeled (discriminated unions rather than unhandled thrown exceptions where appropriate)?
- [ ] Is the interface minimal—containing only methods currently required by consumers?
- [ ] Does this interface align with the repository's accepted Architecture Decision Records in `docs/adr/`?

### Step 4: Hand Off to TDD
Once the interface is defined, pass the contract directly to the `tdd` skill to author tests mocking or calling the interface before writing production code.

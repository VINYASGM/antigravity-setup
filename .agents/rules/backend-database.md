---
description: Backend service architecture, database schemas, and data security standards
globs: ["src/backend/**/*.{ts,js,py}", "schema/**/*.sql", "migrations/**/*", "**/*service*.{js,ts,py}"]
---

# Backend & Database Architecture Standards

1. **Database Schema Design**:
   - Enforce partitioning (by date/range) and clustering (by access keys) on large analytical and transaction tables.
   - Implement Row-Level Security (RLS) policies for multi-tenant or sensitive user data tables.
   - Author forward and rollback migration steps for every schema change.

2. **Injection Immunity**:
   - Every database query must use parameterized inputs or ORM prepared statements.
   - Direct string interpolation or concatenated SQL templates are strictly prohibited.

3. **Concurrency & Boundary Integrity**:
   - Guard against race conditions and lost updates using database transactions or optimistic locking.
   - Handle connection pooling and graceful disconnection during process shutdown.
   - Return structured API errors with sanitized messages (never leak raw stack traces or internal DB credentials).

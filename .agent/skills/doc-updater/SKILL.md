---
name: doc-updater
description: Fetch and update the latest external framework documentation and API references, convert to clean Markdown, and synchronize project references without hallucinating deprecated APIs.
allow_implicit_invocation: true
---

# Dynamic Documentation Synchronizer & Web Extractor

## Overview
Empowers the agent to bypass knowledge cutoffs by fetching, scraping, and normalizing current framework documentation directly into project reference vaults.

## Execution Procedure

### 1. Document URL Identification
- Identify the canonical documentation URL for the framework, library, or cloud API in question (e.g. Google Cloud docs, Next.js, React).

### 2. Extraction via Firecrawl or Fetch Script
- If the `firecrawl` MCP server is active, invoke `@firecrawl/mcp-server` to extract structured Markdown:
  ```json
  { "url": "https://docs.framework.dev/api", "formats": ["markdown"] }
  ```
- Alternatively, run the local cross-platform synchronization script:
  ```bash
  node ./scripts/update_docs.js --url "<doc-url>" --output docs/external/
  ```

### 3. Local Reference Storage & Anti-Hallucination
- Store extracted reference files in `docs/external/<library-name>.md`.
- Consult these fresh local notes before authoring code using newly released library features.
- Never assume syntax for APIs released past model cutoff dates without consulting freshly extracted references.

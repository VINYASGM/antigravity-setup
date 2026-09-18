#!/usr/bin/env node
/**
 * knowledge-injector.js
 * Antigravity PreInvocation Lifecycle Hook Handler
 * 
 * Injects persistent knowledge context before model invocation:
 * - Alerts the agent to .antigravity/graph.json (AST topology) and docs/adr/ (Obsidian ADRs).
 * - Mechanically detects whether .antigravity/graph.json is stale relative to modified source files.
 * - Enforces querying the topological graph during feature planning to avoid hallucinated dependencies.
 */

const fs = require('fs');
const path = require('path');

function isGraphStale(graphPath, workspaceRoot) {
  try {
    if (!fs.existsSync(graphPath)) return false;
    const graphMtime = fs.statSync(graphPath).mtimeMs;

    const checkDirs = [
      path.join(workspaceRoot, '.antigravity', 'scripts'),
      path.join(workspaceRoot, 'scripts'),
      path.join(workspaceRoot, 'src')
    ];

    for (const dir of checkDirs) {
      if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && /\.(js|ts|py|json)$/i.test(entry.name)) {
            const filePath = path.join(dir, entry.name);
            if (fs.statSync(filePath).mtimeMs > graphMtime) {
              return true;
            }
          }
        }
      }
    }

    const pkgPath = path.join(workspaceRoot, 'package.json');
    if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).mtimeMs > graphMtime) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function main() {
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const workspaceRoot = path.resolve(__dirname, '..', '..');
      const graphPath = path.resolve(__dirname, '..', 'graph.json');
      const adrPath = path.resolve(workspaceRoot, 'docs', 'adr');

      const graphExists = fs.existsSync(graphPath);
      const adrExists = fs.existsSync(adrPath);
      const graphStale = graphExists && isGraphStale(graphPath, workspaceRoot);

      let summary = 'Persistent Knowledge Sources Active:';
      if (graphExists) {
        summary += ' [1] Codebase AST topology mounted at .antigravity/graph.json (query this graph during feature planning to inspect ground-truth dependency chains).';
      }
      if (adrExists) {
        summary += ' [2] Architecture Decision Records mounted at docs/adr/ (consult existing ADRs before proposing architectural changes).';
      }

      let staleWarning = '';
      if (graphStale) {
        staleWarning = ' [WARNING: Codebase topology (.antigravity/graph.json) is STALE. Source files were modified since last graph generation. Run \'npm run graphify\' to synchronize AST dependencies.]';
      }

      const message = `${summary}${staleWarning} Anti-hallucination invariant: Do not assume or hallucinate dependency chains; inspect real nodes and links from .antigravity/graph.json.`;

      const response = {
        injectSteps: [
          {
            ephemeralMessage: message
          }
        ]
      };

      process.stdout.write(JSON.stringify(response));
    } catch (err) {
      // In case of error, emit empty step to avoid blocking the agent loop
      process.stdout.write(JSON.stringify({ injectSteps: [] }));
    }
  });
}

main();

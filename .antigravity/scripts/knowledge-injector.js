#!/usr/bin/env node
/**
 * knowledge-injector.js
 * Antigravity PreInvocation Lifecycle Hook Handler
 * 
 * Injects persistent knowledge context before model invocation:
 * - Alerts the agent to .antigravity/graph.json (AST topology) and docs/adr/ (Obsidian ADRs).
 * - Enforces querying the topological graph during feature planning to avoid hallucinated dependencies.
 */

const fs = require('fs');
const path = require('path');

function main() {
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const graphPath = path.resolve(__dirname, '..', 'graph.json');
      const adrPath = path.resolve(__dirname, '..', '..', 'docs', 'adr');

      const graphExists = fs.existsSync(graphPath);
      const adrExists = fs.existsSync(adrPath);

      let summary = 'Persistent Knowledge Sources Active:';
      if (graphExists) {
        summary += ' [1] Codebase AST topology mounted at .antigravity/graph.json (query this graph during feature planning to inspect ground-truth dependency chains).';
      }
      if (adrExists) {
        summary += ' [2] Architecture Decision Records mounted at docs/adr/ (consult existing ADRs before proposing architectural changes).';
      }

      const message = `${summary} Anti-hallucination invariant: Do not assume or hallucinate dependency chains; inspect real nodes and links from .antigravity/graph.json.`;

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

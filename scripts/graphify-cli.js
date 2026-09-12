#!/usr/bin/env node
/**
 * graphify-cli.js
 * CLI Shim connecting 'npx graphify' / 'npm run graphify' to the Python Graphify engine.
 * 
 * Flags supported:
 *   --output <path>    Destination for the extracted JSON graph (e.g. .antigravity/graph.json)
 *   --obsidian <path>  Destination for the exported Obsidian vault notes (e.g. docs/architecture)
 *   --input <path>     Directory to scan (defaults to project root)
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function parseArgs(argv) {
  const options = {
    output: null,
    obsidian: null,
    input: '.',
    codeOnly: true
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output' && i + 1 < argv.length) {
      options.output = argv[++i];
    } else if (arg === '--obsidian' && i + 1 < argv.length) {
      options.obsidian = argv[++i];
    } else if (arg === '--input' && i + 1 < argv.length) {
      options.input = argv[++i];
    } else if (arg === '--all') {
      options.codeOnly = false;
    }
  }

  return options;
}

function runPython(args) {
  const result = spawnSync('python', args, {
    stdio: 'inherit',
    encoding: 'utf8',
    cwd: process.cwd()
  });

  if (result.error) {
    console.error('Error invoking Python:', result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function main() {
  const options = parseArgs(process.argv);
  const cwd = process.cwd();

  console.log('[graphify-bridge] Scanning codebase topology with Graphify...');

  // 1. Run Graphify extraction
  const extractArgs = ['-m', 'graphify', 'extract', options.input];
  if (options.codeOnly) {
    extractArgs.push('--code-only');
  }

  runPython(extractArgs);

  const defaultGraphPath = path.join(cwd, 'graphify-out', 'graph.json');

  // 2. Handle --output destination
  if (options.output) {
    const targetPath = path.resolve(cwd, options.output);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(defaultGraphPath)) {
      fs.copyFileSync(defaultGraphPath, targetPath);
      const graphData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      const nodeCount = graphData.nodes ? graphData.nodes.length : 0;
      const edgeCount = graphData.links ? graphData.links.length : (graphData.edges ? graphData.edges.length : 0);
      console.log(`[graphify-bridge] Extracted ${nodeCount} AST nodes and ${edgeCount} edges -> ${options.output}`);
    } else {
      console.warn(`[graphify-bridge] Warning: ${defaultGraphPath} not found.`);
    }
  }

  // 3. Handle --obsidian destination
  if (options.obsidian) {
    const obsidianDir = options.obsidian;
    console.log(`[graphify-bridge] Exporting Obsidian vault to ${obsidianDir}...`);
    
    runPython(['-m', 'graphify', 'export', 'obsidian', '--dir', obsidianDir]);
    console.log(`[graphify-bridge] Obsidian vault generated at ${obsidianDir}`);
  }

  console.log('[graphify-bridge] Codebase topology extraction complete.');
}

main();

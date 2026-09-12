#!/usr/bin/env node
/**
 * parse-coderabbit-review.js
 * CodeRabbit Review Comment Parser & prd.json Generator
 * 
 * Ingests a CodeRabbit review link, GitHub PR number, or raw review comment JSON/markdown.
 * Parses line-level review comments (complexity, security, logic bugs) and
 * outputs or updates prd.json with atomic REMEDIATION-XXX tasks for autonomous remediation.
 * 
 * Usage:
 *   node ./scripts/parse-coderabbit-review.js --input <url-or-file-or-json> [--prd prd.json]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseReviewComments(inputContent) {
  const findings = [];

  // Try parsing as JSON first (from gh api or CodeRabbit webhook)
  try {
    const data = JSON.parse(inputContent);
    const comments = Array.isArray(data) ? data : (data.comments || [data]);

    for (const c of comments) {
      const body = c.body || c.comment || '';
      const filePath = c.path || c.file || 'unknown';
      const line = c.line || c.original_line || 1;

      // Extract severity
      let severity = 'WARNING';
      if (/\[CRITICAL\]/i.test(body) || /critical/i.test(body)) severity = 'CRITICAL';
      else if (/\[SUGGESTION\]/i.test(body)) severity = 'SUGGESTION';

      // Extract category
      let category = 'General Code Quality';
      if (/cyclomatic\s+complexity/i.test(body) || /complexity/i.test(body)) category = 'Cyclomatic Complexity';
      else if (/security|injection|vulnerability|redos|token/i.test(body)) category = 'Security Vulnerability';
      else if (/logic\s+bug|race\s+condition|null\s+dereference|undefined/i.test(body)) category = 'Logic Bug';

      findings.push({
        file: filePath,
        line,
        severity,
        category,
        body: body.trim()
      });
    }

    if (findings.length > 0) return findings;
  } catch {
    // Fall through to text/markdown regex parsing
  }

  // Regex parser for markdown reviews (e.g. pasted directly from CodeRabbit UI)
  const commentBlocks = inputContent.split(/(?=###?\s+|_\*\*File:\*\*|\*\*\[(?:CRITICAL|WARNING|SUGGESTION)\]\*\*)/i);

  for (const block of commentBlocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.length < 15) continue;

    const fileMatch = trimmed.match(/(?:file:\s*`?|`)([a-zA-Z0-9_\-\.\/\\]+\.[a-zA-Z0-9]+)(?:`|:(\d+))?/i);
    const filePath = fileMatch ? fileMatch[1] : 'src/codebase';
    const line = fileMatch && fileMatch[2] ? parseInt(fileMatch[2], 10) : 1;

    let severity = 'WARNING';
    if (/\[CRITICAL\]/i.test(trimmed)) severity = 'CRITICAL';
    else if (/\[SUGGESTION\]/i.test(trimmed)) severity = 'SUGGESTION';

    let category = 'Code Quality';
    if (/cyclomatic\s+complexity/i.test(trimmed)) category = 'Cyclomatic Complexity';
    else if (/security|vulnerability|injection/i.test(trimmed)) category = 'Security Vulnerability';
    else if (/logic\s+bug|error/i.test(trimmed)) category = 'Logic Bug';

    findings.push({
      file: filePath,
      line,
      severity,
      category,
      body: trimmed
    });
  }

  return findings;
}

function updatePrdWithRemediations(findings, prdPath) {
  let prd = {
    project: 'workspace-remediation',
    version: '1.0.0',
    epic: {
      title: 'CodeRabbit Review Remediation',
      description: 'Autonomous remediation pass addressing CodeRabbit PR audit findings.',
      targetPersona: 'Developer & Pair Programming Agent'
    },
    tasks: []
  };

  if (fs.existsSync(prdPath)) {
    try {
      prd = JSON.parse(fs.readFileSync(prdPath, 'utf8'));
      if (!prd.tasks) prd.tasks = [];
    } catch {
      // Use fresh template if corrupted
    }
  }

  let index = 1;
  const newTasks = [];

  for (const f of findings) {
    const taskId = `REMEDIATION-${String(index++).padStart(3, '0')}`;
    const task = {
      id: taskId,
      title: `[${f.severity}] Fix ${f.category} in ${path.basename(f.file)}:${f.line}`,
      description: f.body.slice(0, 300) + (f.body.length > 300 ? '...' : ''),
      type: 'implementation',
      dependsOn: [],
      acceptanceCriteria: [
        `Resolve ${f.category} issue reported at ${f.file}:${f.line}.`,
        f.category === 'Cyclomatic Complexity' ? 'Refactor function so cyclomatic complexity is reduced below threshold 10.' : 'Write test verifying edge case or security fix.',
        'Automated test suite exits with code 0.'
      ],
      affectedComponents: [f.file],
      status: 'pending'
    };
    prd.tasks.push(task);
    newTasks.push(task);
  }

  fs.writeFileSync(prdPath, JSON.stringify(prd, null, 2), 'utf8');
  return newTasks;
}

function fetchGithubPrComments(urlOrNumber) {
  try {
    let prNumber = urlOrNumber;
    let repo = '';

    const urlMatch = urlOrNumber.match(/github\.com\/([^\/]+\/[^\/]+)\/pull\/(\d+)/i);
    if (urlMatch) {
      repo = urlMatch[1];
      prNumber = urlMatch[2];
    }

    const repoArg = repo ? `-R ${repo}` : '';
    const output = execSync(`gh pr view ${prNumber} ${repoArg} --json comments,reviews`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 15000
    });
    return output;
  } catch (err) {
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  let inputArg = '';
  let prdPath = path.resolve(process.cwd(), 'prd.json');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && i + 1 < args.length) {
      inputArg = args[++i];
    } else if (args[i] === '--prd' && i + 1 < args.length) {
      prdPath = path.resolve(process.cwd(), args[++i]);
    } else if (!inputArg) {
      inputArg = args[i];
    }
  }

  let content = '';

  if (!inputArg) {
    // Read from stdin if available
    try {
      content = fs.readFileSync(0, 'utf8');
    } catch {
      console.error('Usage: node parse-coderabbit-review.js --input <url|file|text> [--prd prd.json]');
      process.exit(1);
    }
  } else if (inputArg.startsWith('http://') || inputArg.startsWith('https://') || /^\d+$/.test(inputArg)) {
    console.log(`[coderabbit-parser] Attempting to fetch comments from: ${inputArg}...`);
    const fetched = fetchGithubPrComments(inputArg);
    content = fetched || inputArg;
  } else if (fs.existsSync(inputArg)) {
    content = fs.readFileSync(inputArg, 'utf8');
  } else {
    content = inputArg;
  }

  const findings = parseReviewComments(content);

  if (findings.length === 0) {
    console.log('[coderabbit-parser] No structured CodeRabbit findings detected in input.');
    return;
  }

  console.log(`[coderabbit-parser] Detected ${findings.length} review findings:`);
  findings.forEach((f, idx) => {
    console.log(`  ${idx + 1}. [${f.severity}] ${f.category} -> ${f.file}:${f.line}`);
  });

  const generatedTasks = updatePrdWithRemediations(findings, prdPath);
  console.log(`[coderabbit-parser] Successfully generated ${generatedTasks.length} tasks in ${path.basename(prdPath)}.`);
}

if (require.main === module) {
  main();
}

module.exports = { parseReviewComments, updatePrdWithRemediations };

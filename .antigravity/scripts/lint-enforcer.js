#!/usr/bin/env node
/**
 * lint-enforcer.js
 * Antigravity Lifecycle Hook Handler
 * 
 * Enforces linting and syntax hygiene:
 * - post-tool: Tracks edited files and validates syntax.
 * - pre-tool: Gating git commit if syntax/lint errors remain.
 * - stop: Gating agent termination loop if syntax/lint errors remain.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CACHE_DIR = path.resolve(__dirname, '..', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'modified_files.json');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function loadCache() {
  ensureCacheDir();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch {
    // ignore corrupted cache
  }
  return { files: [], errors: {} };
}

function saveCache(cache) {
  ensureCacheDir();
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // best-effort write
  }
}

/**
 * Validates syntax of a single file.
 * Returns null if valid, or error message string if invalid.
 */
function validateFileSyntax(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const ext = path.extname(filePath).toLowerCase();

  // 1. JSON validation
  if (ext === '.json') {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      return null;
    } catch (err) {
      return `Invalid JSON syntax in ${path.basename(filePath)}: ${err.message}`;
    }
  }

  // 2. JavaScript / Node script validation
  if (ext === '.js' || ext === '.mjs' || ext === '.cjs') {
    try {
      const res = spawnSync(process.execPath, ['--check', filePath], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 5000,
        shell: false
      });
      if (res.status !== 0) {
        const stderr = res.stderr ? res.stderr.toString('utf8').trim() : 'Syntax check failed';
        return `JavaScript syntax error in ${path.basename(filePath)}:\n${stderr.split('\n').slice(0, 3).join('\n')}`;
      }
      return null;
    } catch (err) {
      return `JavaScript syntax check error in ${path.basename(filePath)}: ${err.message}`;
    }
  }

  // 3. Python syntax validation (cross-platform python / py)
  if (ext === '.py') {
    try {
      let res = spawnSync('python', ['-m', 'py_compile', filePath], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 5000,
        shell: false
      });
      if (res.error && res.error.code === 'ENOENT') {
        res = spawnSync('py', ['-m', 'py_compile', filePath], {
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 5000,
          shell: false
        });
      }
      if (res.status !== 0 && !res.error) {
        const stderr = res.stderr ? res.stderr.toString('utf8').trim() : 'Python syntax error';
        return `Python syntax error in ${path.basename(filePath)}:\n${stderr.split('\n').slice(0, 3).join('\n')}`;
      }
      return null;
    } catch (err) {
      return `Python syntax check error in ${path.basename(filePath)}: ${err.message}`;
    }
  }

  return null;
}

function runProjectLinter(cwd) {
  try {
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.scripts && pkg.scripts.lint) {
        execSync('npm run lint', {
          cwd,
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 20000
        });
      }
    }
    return null;
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString('utf8').trim() : err.message;
    return `Project linter failed:\n${stderr.split('\n').slice(0, 4).join('\n')}`;
  }
}

function handlePostTool(payload) {
  const toolCall = payload.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.TargetFile || args.AbsolutePath || args.path;

  if (targetFile && typeof targetFile === 'string') {
    const resolved = path.resolve(targetFile);
    const cache = loadCache();

    if (!cache.files.includes(resolved)) {
      cache.files.push(resolved);
    }

    const error = validateFileSyntax(resolved);
    if (error) {
      cache.errors[resolved] = error;
    } else {
      delete cache.errors[resolved];
    }

    saveCache(cache);
  }

  // PostToolUse requires empty JSON object on stdout
  process.stdout.write(JSON.stringify({}));
}

function handlePreTool(payload) {
  const toolCall = payload.toolCall || {};
  const commandLine = (toolCall.args && toolCall.args.CommandLine) || '';
  const cwd = (toolCall.args && toolCall.args.Cwd) || process.cwd();

  // Check if command is git commit
  if (/\bgit(?:\.exe)?\s+commit\b/i.test(commandLine)) {
    const cache = loadCache();
    const activeErrors = [];

    for (const file of cache.files) {
      const err = validateFileSyntax(file);
      if (err) {
        activeErrors.push(err);
        cache.errors[file] = err;
      } else {
        delete cache.errors[file];
      }
    }
    saveCache(cache);

    // Optional project-wide linter
    const projectLinterErr = runProjectLinter(cwd);
    if (projectLinterErr) {
      activeErrors.push(projectLinterErr);
    }

    if (activeErrors.length > 0) {
      process.stdout.write(JSON.stringify({
        decision: 'deny',
        reason: `Pre-commit lint enforcement blocked commit:\n${activeErrors.join('\n')}`
      }));
      return;
    }
  }

  process.stdout.write(JSON.stringify({ decision: 'allow' }));
}

function handleStop(payload) {
  const cache = loadCache();
  const activeErrors = [];

  for (const file of cache.files) {
    const err = validateFileSyntax(file);
    if (err) {
      activeErrors.push(err);
      cache.errors[file] = err;
    } else {
      delete cache.errors[file];
    }
  }
  saveCache(cache);

  if (activeErrors.length > 0) {
    process.stdout.write(JSON.stringify({
      decision: 'continue',
      reason: `Unresolved syntax or lint errors exist in modified files:\n${activeErrors.join('\n')}\nPlease fix these issues before finishing.`
    }));
  } else {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  }
}

function main() {
  const mode = process.argv[2] || 'post-tool';
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const payload = inputBuffer.trim() ? JSON.parse(inputBuffer) : {};

      if (mode === 'post-tool') {
        handlePostTool(payload);
      } else if (mode === 'pre-tool') {
        handlePreTool(payload);
      } else if (mode === 'stop') {
        handleStop(payload);
      } else {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
      }
    } catch (err) {
      // Fail-Safe Policy Rationale:
      // While security hooks (branch-guard, shell-sandbox) fail closed ('deny') to prevent
      // irreversible destruction, lint-enforcer fails open ('allow') on unexpected payload parse
      // errors so an IDE metadata glitch never permanently deadlocks the user or agent loop.
      if (mode === 'post-tool') {
        process.stdout.write(JSON.stringify({}));
      } else {
        process.stdout.write(JSON.stringify({
          decision: 'allow',
          reason: `lint-enforcer fallback (fail-safe open for non-critical parser error): ${err.message}`
        }));
      }
    }
  });
}

main();

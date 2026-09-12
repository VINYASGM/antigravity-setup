#!/usr/bin/env node
/**
 * branch-guard.js
 * Antigravity PreToolUse Hook Handler
 * 
 * Enforces branch locking policies on sensitive git branches:
 * - Prevents direct pushes, branch deletions, and force pushes to protected branches.
 * - Prevents direct commits on protected branches.
 */

const { execSync } = require('child_process');
const path = require('path');

const PROTECTED_BRANCHES = ['main', 'master', 'production', 'prod', 'release', 'releases', 'stable'];
const PROTECTED_REGEX = new RegExp(`^(refs/heads/)?(${PROTECTED_BRANCHES.join('|')})(/.*)?$`, 'i');

function isProtectedBranch(branchName) {
  if (!branchName) return false;
  const clean = branchName.trim().replace(/^origin\//i, '').replace(/^refs\/heads\//i, '');
  return PROTECTED_BRANCHES.some(b => clean.toLowerCase() === b || clean.toLowerCase().startsWith(b + '/'));
}

function getCurrentGitBranch(cwd) {
  try {
    const output = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    }).trim();
    return output;
  } catch {
    return null;
  }
}

function inspectCommand(commandLine, cwd) {
  if (!commandLine || typeof commandLine !== 'string') {
    return { allow: true };
  }

  // Split chained commands (&&, ||, ;, |)
  const subCommands = commandLine.split(/&&|\|\||;|\|/);

  for (const rawSub of subCommands) {
    const sub = rawSub.trim();
    if (!sub) continue;

    // Check if sub-command invokes git
    const gitMatch = sub.match(/\bgit(?:\.exe)?\s+([a-zA-Z0-9_-]+)(.*)/i);
    if (!gitMatch) continue;

    const action = gitMatch[1].toLowerCase();
    const argsString = gitMatch[2] || '';
    const args = argsString.trim().split(/\s+/).filter(Boolean);

    // 1. Gating 'git push'
    if (action === 'push') {
      const isForce = args.some(arg => arg === '-f' || arg === '--force' || arg.startsWith('--force-with-lease'));
      
      // Check target branch in arguments
      for (const arg of args) {
        if (arg.startsWith('-')) continue;
        // Arguments might be "origin", "main", "origin:main", "HEAD:main", etc.
        const refParts = arg.split(':');
        const targetRef = refParts[refParts.length - 1]; // destination branch

        if (isProtectedBranch(targetRef) || isProtectedBranch(arg)) {
          return {
            allow: false,
            reason: `Direct push to protected branch '${arg}' is locked by branch-guard policy. Please push to a feature branch and open a PR.`
          };
        }

        // Deleting remote protected branch: git push origin --delete main OR git push origin :main
        if (arg.startsWith(':') && isProtectedBranch(arg.slice(1))) {
          return {
            allow: false,
            reason: `Deleting protected remote branch '${arg.slice(1)}' is forbidden.`
          };
        }
      }

      if (args.includes('--delete') || args.includes('-d')) {
        const branchArg = args.find(a => !a.startsWith('-') && a !== 'origin');
        if (branchArg && isProtectedBranch(branchArg)) {
          return {
            allow: false,
            reason: `Deleting protected branch '${branchArg}' via push --delete is forbidden.`
          };
        }
      }

      // If push has no branch specified, it pushes current branch
      const currentBranch = getCurrentGitBranch(cwd);
      if (currentBranch && isProtectedBranch(currentBranch)) {
        return {
          allow: false,
          reason: `Active branch is protected ('${currentBranch}'). Direct push is locked.`
        };
      }

      if (isForce) {
        return {
          allow: false,
          reason: 'Force-pushing is strictly prohibited by branch-guard safety policy.'
        };
      }
    }

    // 2. Gating 'git branch -D' or 'git branch -d'
    if (action === 'branch') {
      const isDelete = args.some(arg => arg === '-d' || arg === '-D' || arg === '--delete');
      if (isDelete) {
        const targets = args.filter(a => !a.startsWith('-'));
        for (const target of targets) {
          if (isProtectedBranch(target)) {
            return {
              allow: false,
              reason: `Deleting protected branch '${target}' is locked.`
            };
          }
        }
      }
    }

    // 3. Gating 'git commit' directly on protected branch
    if (action === 'commit') {
      const hasCommits = (() => {
        try {
          execSync('git rev-parse --verify HEAD', {
            cwd: cwd || process.cwd(),
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 3000
          });
          return true;
        } catch {
          return false;
        }
      })();

      if (hasCommits) {
        const currentBranch = getCurrentGitBranch(cwd);
        if (currentBranch && isProtectedBranch(currentBranch)) {
          return {
            allow: false,
            reason: `Direct commits on protected branch '${currentBranch}' are locked. Please switch to a feature branch first (e.g. 'git checkout -b feature/...').`
          };
        }
      }
    }

    // 4. Gating 'git reset --hard' targeting protected branches
    if (action === 'reset' && args.includes('--hard')) {
      const currentBranch = getCurrentGitBranch(cwd);
      if (currentBranch && isProtectedBranch(currentBranch)) {
        return {
          allow: false,
          reason: `Hard reset on protected branch '${currentBranch}' is locked to prevent unrecoverable history loss.`
        };
      }
    }
  }

  return { allow: true };
}

function main() {
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    try {
      if (!inputBuffer.trim()) {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
        return;
      }

      const payload = JSON.parse(inputBuffer);
      const toolCall = payload.toolCall || {};

      if (toolCall.name !== 'run_command') {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
        return;
      }

      const commandLine = toolCall.args ? toolCall.args.CommandLine : '';
      const cwd = toolCall.args ? toolCall.args.Cwd : process.cwd();

      const result = inspectCommand(commandLine, cwd);

      if (!result.allow) {
        process.stdout.write(JSON.stringify({
          decision: 'deny',
          reason: result.reason
        }));
      } else {
        process.stdout.write(JSON.stringify({
          decision: 'allow'
        }));
      }
    } catch (err) {
      // In case of unexpected error, fail-safe with diagnostic
      process.stdout.write(JSON.stringify({
        decision: 'deny',
        reason: `branch-guard error: ${err.message}`
      }));
    }
  });
}

main();

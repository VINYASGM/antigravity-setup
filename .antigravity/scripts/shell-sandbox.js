#!/usr/bin/env node
/**
 * shell-sandbox.js
 * Antigravity PreToolUse Hook Handler
 * 
 * Enforces sandboxing and execution safety policies for shell actions:
 * - Blocks destructive filesystem actions (format, recursive root deletes, disk partitioning).
 * - Blocks destructive registry modifications, privilege escalation, and piped script executions.
 * - Restricts execution working directory to declared workspace paths.
 * - Prompts for confirmation on system-wide package changes.
 */

const path = require('path');

// Patterns strictly prohibited from running autonomously
const BLOCKED_COMMAND_PATTERNS = [
  // Drive formatting and partitioning
  { pattern: /\bformat\s+[a-z]:/i, description: 'Drive formatting utility' },
  { pattern: /\bdiskpart\b/i, description: 'Low-level disk partitioner' },
  { pattern: /\bbcdedit\b/i, description: 'Boot configuration data editor' },
  { pattern: /\b(?:Clear-Disk|Format-Volume|Initialize-Disk|Stop-Computer|Restart-Computer)\b/i, description: 'PowerShell disk or system termination cmdlet' },

  // Dangerous recursive deletions targeting system/root drives
  { pattern: /\b(?:rmdir|rd)\s+(?:\/[sqSQ]\s+)+[a-zA-Z]:\\?$/i, description: 'Recursive wipe of drive root' },
  { pattern: /\b(?:rmdir|rd)\s+(?:\/[sqSQ]\s+)+.*(?:windows|system32|program\s+files)/i, description: 'System directory deletion' },
  { pattern: /\bdel\s+(?:\/[sfqSFQ]\s+)+[a-zA-Z]:\\(?:\*|\*\.\*)?$/i, description: 'Recursive wipe of drive root files' },
  { pattern: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+([\/~]|[a-zA-Z]:[\\\/]|\$HOME)/i, description: 'Recursive deletion of root or home directory' },

  // PowerShell destructive filesystem and environment deletions
  { pattern: /\b(?:Remove-Item|ri)\b(?=.*-(?:Recurse|r)\b)(?=.*-(?:Force|f)\b).*(?:[a-zA-Z]:\\|\/|\$HOME|\~)/i, description: 'PowerShell recursive force wipe of drive root or home' },
  { pattern: /\b(?:Remove-Item|ri)\b\s+.*(?:Env:|Variable:|HKLM:|HKCU:|\$env:)/i, description: 'PowerShell environment or registry provider deletion' },

  // Git unrecoverable history and working tree destruction
  { pattern: /\bgit(?:\.exe)?\s+clean\s+.*-[a-zA-Z]*f/i, description: 'Unrecoverable git clean force wipe' },
  { pattern: /\bgit(?:\.exe)?\s+reflog\s+expire\b/i, description: 'Unrecoverable git reflog expiration' },

  // Windows Registry modification/destruction
  { pattern: /\breg\s+(?:delete|add)\s+hk(?:lm|cu|cr|u|cc)/i, description: 'Windows Registry alteration' },

  // Privilege escalation
  { pattern: /\brunas\s+\/user:(?:administrator|admin|system)/i, description: 'Administrative privilege escalation' },

  // Obfuscated or piped execution
  { pattern: /\bpowershell(?:\.exe)?\s+.*-(?:enc|encodedcommand)\b/i, description: 'Encoded PowerShell command' },
  { pattern: /\b(?:curl|wget|iwr|Invoke-WebRequest)\b.*\|\s*(?:iex|Invoke-Expression|bash|sh|cmd(?:\.exe)?)\b/i, description: 'Unchecked network-to-shell pipe execution' }
];

// Patterns that require explicit interactive user confirmation
const ASK_CONFIRMATION_PATTERNS = [
  { pattern: /\bnpm\s+(?:install|i|add)\s+(?:-g|--global)\b/i, description: 'Global npm package installation' },
  { pattern: /\b(?:choco|winget)\s+install\b/i, description: 'Machine-wide package installation' },
  { pattern: /\bpip\s+install\s+(?:--user|--break-system-packages)\b/i, description: 'System Python package installation' },
  { pattern: /\bgit(?:\.exe)?\s+add\s+(?:\.|\-A|\-\-all)(?:\s|$)/i, description: 'Broad staging of all files (git add . / -A) - prefer surgical file staging' }
];

function isPathWithinWorkspace(targetPath, workspacePaths) {
  if (!targetPath || !workspacePaths || !workspacePaths.length) return true;

  const normalizedTarget = path.resolve(targetPath).toLowerCase();
  return workspacePaths.some(ws => {
    const normalizedWs = path.resolve(ws).toLowerCase();
    return normalizedTarget === normalizedWs || normalizedTarget.startsWith(normalizedWs + path.sep);
  });
}

function evaluateCommand(commandLine, cwd, workspacePaths) {
  if (!commandLine || typeof commandLine !== 'string') {
    return { decision: 'allow' };
  }

  // 1. Check workspace containment
  if (cwd && workspacePaths && workspacePaths.length > 0) {
    if (!isPathWithinWorkspace(cwd, workspacePaths)) {
      // Allow temp/scratch dirs inside user profile if designated
      const normalizedCwd = path.resolve(cwd).toLowerCase();
      const isTempOrScratch = normalizedCwd.includes('antigravity-ide\\brain') || normalizedCwd.includes('\\temp\\');
      if (!isTempOrScratch) {
        return {
          decision: 'deny',
          reason: `Working directory '${cwd}' is outside the authorized project workspace boundary.`
        };
      }
    }
  }

  // 2. Check strict blacklist
  for (const entry of BLOCKED_COMMAND_PATTERNS) {
    if (entry.pattern.test(commandLine)) {
      return {
        decision: 'deny',
        reason: `Blocked by shell sandbox: ${entry.description} [matched: ${entry.pattern}]`
      };
    }
  }

  // 3. Check interactive confirmation requirements
  for (const entry of ASK_CONFIRMATION_PATTERNS) {
    if (entry.pattern.test(commandLine)) {
      return {
        decision: 'ask',
        reason: `Shell sandbox requires confirmation for: ${entry.description}`
      };
    }
  }

  return { decision: 'allow' };
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
      const workspacePaths = payload.workspacePaths || [];

      const result = evaluateCommand(commandLine, cwd, workspacePaths);

      process.stdout.write(JSON.stringify(result));
    } catch (err) {
      process.stdout.write(JSON.stringify({
        decision: 'deny',
        reason: `shell-sandbox error: ${err.message}`
      }));
    }
  });
}

main();

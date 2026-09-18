#!/usr/bin/env node
/**
 * update_docs.js
 * Cross-platform script to fetch, sanitize, and save documentation.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const client = targetUrl.startsWith('https') ? https : http;
    client.get(targetUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${targetUrl}: HTTP ${res.statusCode}`));
      }
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => resolve(rawData));
    }).on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  let targetUrl = '';
  let outputDir = path.resolve(process.cwd(), 'docs', 'external');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && i + 1 < args.length) targetUrl = args[++i];
    else if (args[i] === '--output' && i + 1 < args.length) outputDir = path.resolve(process.cwd(), args[++i]);
  }

  if (!targetUrl) {
    console.error('Usage: node update_docs.js --url <https://docs.example.com> [--output <dir>]');
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log(`[doc-updater] Fetching documentation from ${targetUrl}...`);
    const content = await fetchUrl(targetUrl);
    
    // Minimal HTML to text/markdown strip if raw HTML returned
    let cleanText = content;
    if (content.includes('<html') || content.includes('<body')) {
      cleanText = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const domain = new URL(targetUrl).hostname.replace(/[^a-zA-Z0-9]/g, '_');
    const outPath = path.join(outputDir, `${domain}.md`);
    fs.writeFileSync(outPath, `# External Documentation: ${targetUrl}\n\n${cleanText}\n`, 'utf8');
    console.log(`[doc-updater] Saved normalized docs to ${outPath}`);
  } catch (err) {
    console.error(`[doc-updater] Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

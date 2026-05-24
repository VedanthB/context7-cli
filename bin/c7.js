#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { resolve, getDocs, formatSearchResults } from '../lib/api.js';

const HELP = `
  context7 — Up-to-date library docs from your terminal

  Usage:
    c7 resolve <library>              Find Context7 library ID
    c7 docs <library> [topic]         Get docs (resolves library automatically)
    c7 docs <context7-id> [topic]     Get docs by exact Context7 ID

  Options:
    --api-key <key>    Context7 API key (or set CONTEXT7_API_KEY)
    --json             Output raw JSON (resolve only)
    --tokens <n>       (Deprecated, ignored) Previously set max tokens
    --version, -v      Show version
    --help, -h         Show this help

  Examples:
    c7 resolve nextjs
    c7 docs react "server components"
    c7 docs /vercel/next.js "image optimization"

  Pipe-friendly:
    c7 docs react hooks | pbcopy
    c7 docs express middleware >> prompt.txt
`.trim();

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tokens' && argv[i + 1]) { args.tokens = parseInt(argv[++i]); }
    else if (a === '--api-key' && argv[i + 1]) { args.apiKey = argv[++i]; }
    else if (a === '--json') { args.json = true; }
    else if (a === '--help' || a === '-h') { args.help = true; }
    else if (a === '--version' || a === '-v') { args.version = true; }
    else { args._.push(a); }
  }
  return args;
}

export function isContext7Id(s) {
  return s.startsWith('/') && s.split('/').length >= 3;
}

async function cmdResolve(libraryName, opts) {
  const results = await resolve(libraryName, opts.apiKey);

  if (opts.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    console.error(`No libraries found for "${libraryName}"`);
    process.exit(1);
  }

  const output = formatSearchResults(results);
  console.log(output);
}

async function cmdDocs(libraryOrId, topic, opts) {
  if (opts.tokens !== undefined) {
    process.stderr.write('Warning: --tokens is deprecated and ignored in v2. The API now determines optimal token count.\n');
  }

  let libraryId = libraryOrId;

  // If not a Context7 ID, resolve it first
  if (!isContext7Id(libraryOrId)) {
    const results = await resolve(libraryOrId, opts.apiKey, topic);
    if (!Array.isArray(results) || results.length === 0) {
      console.error(`No libraries found for "${libraryOrId}"`);
      process.exit(1);
    }
    libraryId = results[0].id;
    if (process.stderr.isTTY) {
      process.stderr.write(`→ ${libraryId}\n`);
    }
  }

  const docs = await getDocs(libraryId, topic, opts.apiKey);
  console.log(docs);
}

async function main() {
  const { readFileSync } = await import('fs');
  const opts = parseArgs(process.argv.slice(2));
  opts.apiKey = opts.apiKey || process.env.CONTEXT7_API_KEY;

  if (opts.version) {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(pkg.version);
    process.exit(0);
  }

  if (opts.help || opts._.length === 0) {
    console.log(HELP);
    process.exit(0);
  }

  const [cmd, ...rest] = opts._;

  try {
    switch (cmd) {
      case 'resolve':
      case 'r':
        if (!rest[0]) { console.error('Usage: c7 resolve <library>'); process.exit(1); }
        await cmdResolve(rest[0], opts);
        break;

      case 'docs':
      case 'd':
        if (!rest[0]) { console.error('Usage: c7 docs <library> [topic]'); process.exit(1); }
        await cmdDocs(rest[0], rest.slice(1).join(' ') || undefined, opts);
        break;

      default:
        // Treat as shorthand: c7 <library> [topic]
        await cmdDocs(cmd, rest.join(' ') || undefined, opts);
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

// Only run main when executed directly (not imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

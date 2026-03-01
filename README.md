# c7 — Context7 CLI

[![npm version](https://img.shields.io/npm/v/@vedanth/context7)](https://www.npmjs.com/package/@vedanth/context7) [![npm downloads](https://img.shields.io/npm/dm/@vedanth/context7)](https://www.npmjs.com/package/@vedanth/context7) [![license](https://img.shields.io/npm/l/@vedanth/context7)](./LICENSE) [![node](https://img.shields.io/node/v/@vedanth/context7)](https://nodejs.org)

Get up-to-date, version-specific library docs from your terminal. No MCP client needed.

Built on top of [Context7](https://context7.com) — the same docs that power Cursor, Claude, and other AI coding assistants, now available as a simple CLI.

> **Note:** This package is published as [`@vedanth/context7`](https://www.npmjs.com/package/@vedanth/context7) on npm. The unscoped `context7` on npm is a different, unrelated project.

## Why?

Your AI coding assistant hallucinates APIs that don't exist. Context7's MCP fixes that — but only if you're inside an MCP-compatible editor.

`c7` gives you the same docs anywhere:
- Pipe into agent prompts before they start coding
- Quick lookups without leaving the terminal
- Feed accurate docs into any LLM, any workflow

## Install

```bash
npx @vedanth/context7               # Run directly (no install)
npm install -g @vedanth/context7     # Or install globally
```

## Usage

```bash
# Find a library
c7 resolve nextjs

# Get docs (auto-resolves library name)
c7 docs nextjs "app router"
c7 docs react "server components" --tokens 10000

# Shorthand — skip the "docs" command
c7 react hooks
c7 express middleware
c7 tailwindcss "dark mode"

# Use exact Context7 ID (from resolve)
c7 docs /vercel/next.js "image optimization"

# Pipe into anything
c7 react hooks | pbcopy
c7 express middleware >> prompt.txt
c7 docs nextjs "api routes" | llm "summarize these docs"
```

## Commands

| Command | Description |
|---------|-------------|
| `c7 resolve <library>` | Find Context7 library IDs for a search term |
| `c7 docs <library> [topic]` | Get docs (auto-resolves name to best match) |
| `c7 <library> [topic]` | Shorthand for `c7 docs` |

## Options

| Flag | Description |
|------|-------------|
| `--tokens <n>` | Max tokens to return (default: 5000) |
| `--api-key <key>` | Context7 API key (or set `CONTEXT7_API_KEY` env) |
| `--json` | Raw JSON output (resolve only) |

## API Key (optional)

Works without an API key for basic usage. For higher rate limits:

1. Get a key at [context7.com/dashboard](https://context7.com/dashboard)
2. Set it: `export CONTEXT7_API_KEY=your-key`

## Use Cases

**Feed docs into coding agents:**
```bash
DOCS=$(c7 nextjs "app router middleware" --tokens 8000)
claude "Build a Next.js middleware that redirects. Use these docs:\n$DOCS"
```

**Quick API lookup:**
```bash
c7 prisma "findMany" --tokens 3000
```

**Compare versions:**
```bash
c7 docs /vercel/next.js "image" --tokens 5000   # Latest
c7 docs /websites/nextjs_15 "image"              # v15 specific
```

## How It Works

Context7 indexes documentation from source repos and official docs. The CLI queries their API to get relevant, version-specific code snippets and API references — the same data that powers the MCP server used by Cursor, Claude Code, and other AI editors.

## Credits

Powered by [Context7](https://context7.com) by [Upstash](https://upstash.com).

## c7 vs other Context7 packages

| Package | What it is |
|---------|------------|
| **`@vedanth/context7`** (this) | CLI tool — library docs in your terminal |
| `@upstash/context7` | Official MCP server for AI editors |
| `context7` (unscoped) | Different project, not related |

## License

MIT

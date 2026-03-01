# c7 — Context7 CLI

[![npm version](https://img.shields.io/npm/v/@vedanth/context7)](https://www.npmjs.com/package/@vedanth/context7) [![npm downloads](https://img.shields.io/npm/dm/@vedanth/context7)](https://www.npmjs.com/package/@vedanth/context7) [![license](https://img.shields.io/npm/l/@vedanth/context7)](./LICENSE) [![node](https://img.shields.io/node/v/@vedanth/context7)](https://nodejs.org)

Get up-to-date, version-specific library docs from your terminal. No MCP client needed.

Built on top of [Context7](https://context7.com) — the same docs that power Cursor, Claude, and other AI coding assistants, now available as a simple CLI.

> **Note:** This package is published as [`@vedanth/context7`](https://www.npmjs.com/package/@vedanth/context7) on npm. The unscoped `context7` on npm is a different, unrelated project.

## Why?

There's been a growing consensus that CLIs are better than MCP servers for developer tools. MCP locks you into specific editors. A CLI just gives you text — pipe it wherever you want.

Context7 has great docs data, but their MCP server only works inside Cursor and other MCP clients. `c7` makes the same data available as plain stdout:

- Pipe into any LLM (Claude Code, Ollama, llama.cpp, whatever)
- Compose with grep, jq, less, pbcopy, or shell scripts
- Use in CI, automation, agent prompts — anywhere you can run a command

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

## Why CLI instead of MCP?

Developers have been saying it for months: MCP adds complexity where a simple CLI would do. An MCP server needs a compatible client, configuration files, and an editor that speaks the protocol. A CLI needs `npx` and a pipe.

`c7` outputs plain text to stdout. That means it works with every tool that already exists:

```bash
# In a script
DOCS=$(c7 nextjs "app router" --tokens 8000)
echo "$DOCS" | your-llm-of-choice

# In CI
c7 your-library "migration guide" > context.txt

# Piped into local models
c7 react hooks | ollama run codellama "explain these patterns"
```

Use the MCP server in your editor. Use `c7` everywhere else. They complement each other.

## How it works

Two API calls:

1. **Resolve** — searches Context7's index for a library name, returns a library ID
2. **Fetch** — pulls documentation for that ID, filtered by topic and token limit

The CLI is 170 lines across two files (`bin/c7.js` + `lib/api.js`), uses only Node's built-in `fetch`, and has zero npm dependencies.

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

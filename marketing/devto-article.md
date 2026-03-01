---
title: "I Built a CLI That Gives Your LLM Accurate Library Docs — No MCP Server Needed"
published: false
description: "c7 pulls up-to-date, version-specific library documentation from Context7 and pipes it into any LLM, script, or Unix tool from your terminal."
tags: ai, cli, webdev, productivity
---

## The Problem

You're building with Next.js 15 and ask your AI assistant to write an API route. It gives you the Pages Router pattern from Next.js 12. You paste React docs into the prompt, but they're already outdated by the time you copy them.

[Context7](https://context7.com) solved this by indexing documentation directly from source repos and serving it through an MCP server. Cursor, Claude Code, and other AI editors use it to get real, version-specific docs instead of hallucinated APIs.

But MCP has a constraint: you need an MCP-compatible client. If you're working in the terminal, running a script, or using a local LLM — you're out of luck.

## The Solution

I built [`c7`](https://github.com/VedanthB/context7-cli) — a CLI that pulls from the same Context7 database and outputs docs as plain text to stdout.

```bash
c7 tailwindcss "dark mode"
c7 drizzle "migrations"
c7 hono "routing" --tokens 8000
```

No server, no configuration, no IDE integration. Just text you can pipe anywhere.

## How It Works

The CLI does two things:

1. **Resolves** a library name to a Context7 ID (e.g., `react` → `/facebook/react`)
2. **Fetches** documentation for that library, filtered by topic

Under the hood it's two API calls using Node.js built-in `fetch`. The entire project is ~170 lines across two files with zero dependencies.

```
bin/c7.js   — 130 lines (CLI parsing + output formatting)
lib/api.js  —  40 lines (Context7 API client)
```

No axios. No commander. No chalk. Just `process.argv` and `fetch`.

## Composing with pipes

Because `c7` outputs plain text to stdout, it composes with everything:

### Pipe into LLMs

```bash
# Claude Code CLI
c7 drizzle "queries" | claude "summarize the query patterns and show examples"

# Ollama (local models)
c7 hono "middleware" | ollama run deepseek-coder "explain this middleware pattern"

# Any LLM CLI
c7 tailwindcss "responsive" | llm "write a responsive layout based on these docs"
```

### Pipe into Unix tools

```bash
# Search docs
c7 hono "routing" | grep "app.get"

# Page through docs
c7 drizzle "schema" | less

# Copy to clipboard
c7 tailwindcss "animations" | pbcopy

# Build context files
c7 nextjs "app router" --tokens 8000 >> context.txt
c7 react "server components" --tokens 5000 >> context.txt
```

### Use in scripts

```bash
# Pre-load context for a coding agent
DOCS=$(c7 hono "middleware" --tokens 8000)
claude "Build a Hono middleware that handles auth. Use these docs:\n$DOCS"
```

## c7 vs MCP Server

| | MCP Server | c7 CLI |
|---|---|---|
| **Setup** | Install server, configure MCP client, restart editor | `npx @vedanth/context7` |
| **Works in** | MCP-compatible editors | Terminal, scripts, CI, anywhere |
| **Composable** | Limited to MCP protocol | Pipes, redirects, subshells |
| **Dependencies** | Several npm packages | Zero |

They're complementary. Use the MCP server in your editor, use `c7` everywhere else.

## Getting Started

```bash
# Run without installing
npx @vedanth/context7 tailwindcss "grid"

# Or install globally
npm install -g @vedanth/context7
c7 drizzle "relations"
c7 hono "context" --tokens 3000
c7 tailwindcss "dark mode" | less
```

No API key required for basic usage. For higher rate limits, get a free key at [context7.com/dashboard](https://context7.com/dashboard).

## Links

- **GitHub:** [github.com/VedanthB/context7-cli](https://github.com/VedanthB/context7-cli)
- **npm:** [@vedanth/context7](https://www.npmjs.com/package/@vedanth/context7)
- **Landing page:** [vedanthb.github.io/context7-cli](https://vedanthb.github.io/context7-cli/)
- **Context7:** [context7.com](https://context7.com)

---

*Built by [Vedanth Bora](https://twitter.com/thevedanthbora) ([akarispeed.xyz](https://akarispeed.xyz)). If this saves you from one hallucinated API, it was worth the afternoon I spent building it.*

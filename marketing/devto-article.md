---
title: "The MCP Token Tax Is Real — I Built a CLI That Skips It"
published: false
description: "GitHub's MCP server eats 55,000 tokens before you ask a question. Here's what happens when you use stdout instead."
tags: ai, cli, webdev, productivity
---

## February 2026 broke something open

In a single month, 8+ blog posts landed arguing the same thing: CLIs beat MCP servers for developer tools. Not think pieces from random Medium accounts. Technical posts with benchmarks, from people who had actually built MCP integrations and then abandoned them.

- [OneUptime](https://oneuptime.com): "The best interface for AI agents isn't a new protocol — it's the one that's been on every Unix system since 1971."
- [Eric Holmes](https://ericholmes.dev): "Ship a good API, then ship a good CLI. The agents will figure it out."
- Peter Steinberger, who created PSPDFKit (190k GitHub stars) and was recently hired by OpenAI, tweeted: "mcp were a mistake. bash is better."

I'd been building an MCP integration at the time. These posts made me stop and measure what MCP was actually costing me.

## The token tax

Mario Zechner [benchmarked it in November 2025](https://marioslab.io/posts/what-if-you-dont-need-mcp/): Playwright's MCP server sends 13,700 tokens of tool descriptions to the model. A minimal CLI README that teaches the same capabilities? 225 tokens.

Jannik Reinhard's [February 2026 benchmarks](https://yourlink.com) went further. He looked at the GitHub MCP server: 93 tools, consuming ~55,000 tokens just for tool definitions. That's roughly half of GPT-4o's context window, gone before you ask a single question.

His most damning comparison: listing 50 Intune devices via MCP required ~145,000 tokens. The CLI approach used ~4,150. A 35x reduction.

And 43% of tested MCP implementations contained command injection flaws, according to a March 2025 security audit. The protocol that was supposed to standardize tool access was simultaneously bloating context windows and introducing attack surface.

Even Anthropic, who created MCP, published an engineering blog acknowledging the context bloat problem.

## What I built instead

Context7 indexes documentation from library source repos. They have an MCP server that feeds this into Cursor and Claude Code, but it requires an MCP-compatible client. If you're in a terminal, writing a script, or running a local model, you're locked out.

I built [`c7`](https://github.com/VedanthB/context7-cli), a CLI that pulls from the same Context7 database and outputs docs as plain text to stdout.

```bash
c7 tailwindcss "dark mode"
c7 drizzle "migrations"
c7 hono "routing" --tokens 8000
```

No server, no configuration, no IDE integration. Just text you can pipe anywhere.

## How it works

The CLI does two things:

1. Resolves a library name to a Context7 ID (e.g., `react` -> `/facebook/react`)
2. Fetches documentation for that library, filtered by topic

Under the hood it's two API calls using Node.js built-in `fetch`. The entire project is ~170 lines across two files with zero dependencies.

```
bin/c7.js   — 130 lines (CLI parsing + output formatting)
lib/api.js  —  40 lines (Context7 API client)
```

No axios. No commander. No chalk. Just `process.argv` and `fetch`.

## Composing with pipes

Because `c7` outputs plain text to stdout, it composes with everything. This is the part that MCP can't do.

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

The `--tokens` flag is worth highlighting. If you're running a local model with a 4k or 8k context window, you can cap the output to fit. MCP doesn't give you that control since it sends whatever it sends.

## c7 vs MCP Server

| | MCP Server | c7 CLI |
|---|---|---|
| **Setup** | Install server, configure MCP client, restart editor | `npx @vedanth/context7` |
| **Works in** | MCP-compatible editors | Terminal, scripts, CI, anywhere |
| **Composable** | Limited to MCP protocol | Pipes, redirects, subshells |
| **Token overhead** | Thousands for tool definitions | Zero |
| **Dependencies** | Several npm packages | Zero |

They're complementary. Use the MCP server in your editor, use `c7` everywhere else.

## The timeline that got us here

- **Nov 2024:** Anthropic launches MCP
- **Aug 2025:** First serious CLI vs MCP benchmarks appear
- **Nov 2025:** Mario Zechner publishes ["What if you don't need MCP at all?"](https://marioslab.io/posts/what-if-you-dont-need-mcp/) — the 13.7k vs 225 token comparison
- **Feb 2026:** The dam breaks. 8+ blog posts in a single month. OneUptime's ["CLI is the New MCP"](https://oneuptime.com), Eric Holmes' ["MCP is dead. Long live the CLI"](https://ericholmes.dev), Reinhard's benchmarks showing 35x token reduction. Peter Steinberger's viral tweet.
- **Feb 2026 (late):** Even Anthropic acknowledges the context bloat problem in their engineering blog

We're watching a correction happen in real time. MCP was over-applied. For tools that output text, a CLI is almost always the right interface.

## Getting started

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
- **Landing page:** [c7.akarispeed.xyz](https://c7.akarispeed.xyz/)
- **Context7:** [context7.com](https://context7.com)

## Further reading

- ["CLI is the New MCP"](https://oneuptime.com) — OneUptime, Feb 3, 2026
- ["MCP is dead. Long live the CLI"](https://ericholmes.dev) — Eric Holmes, Feb 28, 2026
- ["What if you don't need MCP at all?"](https://marioslab.io/posts/what-if-you-dont-need-mcp/) — Mario Zechner, Nov 2, 2025
- ["Why CLI Tools Are Beating MCP"](https://jannikreinhard.com) — Jannik Reinhard, Feb 22, 2026

---

*Built by [Vedanth Bora](https://twitter.com/thevedanthbora) ([akarispeed.xyz](https://akarispeed.xyz)).*

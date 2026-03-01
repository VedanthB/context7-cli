# Product Hunt Draft

---

## Tagline (60 chars max)

Pipe up-to-date library docs into any LLM from terminal

## Short Description

c7 pulls version-specific library documentation from Context7 and outputs it as plain text. Pipe it into Claude, Ollama, grep, or any tool. Zero dependencies, zero config, one command.

## Full Description

### Why CLI over MCP?

In February 2026, 8+ major blog posts were published arguing that CLIs beat MCP servers for developer tools. The numbers tell the story: Jannik Reinhard benchmarked the MCP approach for listing 50 Intune devices at ~145,000 tokens. The CLI approach: ~4,150 tokens. A 35x reduction in context consumed.

AI coding assistants hallucinate APIs. Context7 fixes this with an MCP server, but the CLI approach gives you the same data without the protocol overhead or editor lock-in.

### How it works

**c7** pulls from Context7's documentation database and outputs plain text to stdout. Works everywhere, not just inside MCP-compatible editors.

```bash
# Search for docs
c7 prisma "relations"
c7 tailwindcss "dark mode"
c7 vue "composition api" --tokens 8000

# Pipe into any LLM
c7 prisma "findMany" | claude "summarize the query patterns"
c7 vue "reactivity" | ollama run deepseek-coder "explain"

# Pipe into Unix tools
c7 tailwindcss "grid" | grep "columns"
c7 prisma schema | less
```

### Under the hood

The entire install is `npx @vedanth/context7`. No server, no config, no IDE plugin. It's 170 lines of pure Node.js with zero npm dependencies, using just built-in `fetch` to query Context7's live documentation database. Because it outputs plain text to stdout, it composes naturally with pipes, redirects, and subshells. Same data that powers the Context7 MCP server in Cursor, without requiring an MCP client.

### Links

- **Install:** `npm install -g @vedanth/context7`
- **Try now:** `npx @vedanth/context7 prisma "relations"`
- **GitHub:** https://github.com/VedanthB/context7-cli
- **npm:** https://www.npmjs.com/package/@vedanth/context7
- **Website:** https://c7.akarispeed.xyz/
- **Author:** https://akarispeed.xyz

## Maker Comment

I kept seeing the same argument across dev blogs this February: why are we wrapping everything in MCP servers when a CLI would do? Someone made `mcp-grep`. An MCP wrapper around grep. That's when it clicked for me how far the pendulum had swung.

Context7 has solid doc data, but their MCP server only works inside editors that support the protocol. If you're SSHing into a server, writing a bash script, or using Ollama on a local model with a tight context window, you need something else.

So I built the CLI version. It's just a pipe. It outputs text. What you do with that text is up to you.

The 35x token reduction over MCP isn't theoretical. Reinhard's benchmarks showed real-world MCP calls eating 145k tokens where a CLI command used 4.1k. When you're paying per token or running a model with limited context, that gap is the whole ballgame.

Try it: `npx @vedanth/context7 prisma "relations"`

# Product Hunt Draft

---

## Tagline (60 chars max)

Pipe up-to-date library docs into any LLM from terminal

## Short Description

c7 pulls version-specific library documentation from Context7 and outputs it as plain text. Pipe it into Claude, Ollama, grep, or any tool. Zero dependencies, zero config, one command.

## Full Description

### The Problem

AI coding assistants hallucinate APIs. They suggest functions that don't exist and use outdated syntax. Context7 fixes this with an MCP server — but MCP only works inside supported editors like Cursor.

### The Solution

**c7** is a CLI that pulls from the same Context7 documentation database and outputs it to stdout. It works everywhere — your terminal, shell scripts, CI pipelines, or piped into any LLM.

### How it works

```bash
# Search for docs
c7 react hooks
c7 express middleware
c7 nextjs "app router" --tokens 8000

# Pipe into any LLM
c7 react hooks | claude "summarize the key patterns"
c7 express middleware | ollama run codellama "explain"

# Pipe into Unix tools
c7 nextjs "api routes" | grep "export"
c7 prisma schema | less
```

### Why it's different

- **Zero setup:** `npx @vedanth/context7` — that's the entire install
- **Zero dependencies:** 170 lines of pure Node.js
- **Pipe-friendly:** stdout output works with any tool
- **No vendor lock-in:** works with Claude, Ollama, llama.cpp, or just `cat`
- **Real docs:** same data that powers Context7 MCP in Cursor

### Links

- **Install:** `npm install -g @vedanth/context7`
- **Try now:** `npx @vedanth/context7 react hooks`
- **GitHub:** https://github.com/VedanthB/context7-cli
- **npm:** https://www.npmjs.com/package/@vedanth/context7
- **Website:** https://vedanthb.github.io/context7-cli/

## Maker Comment

I built c7 because I wanted Context7's docs in my terminal workflows, not just inside my editor.

The MCP server is great when you're in Cursor, but if you're SSHing into a server, writing a bash script, or using a local LLM — you're back to pasting docs manually.

c7 is just a pipe. It outputs text. What you do with that text is up to you — feed it to Claude, Ollama, grep, or append it to a file. That composability is the whole point.

It's 170 lines with zero npm dependencies. The entire thing is just `process.argv` parsing and two `fetch` calls to Context7's API.

Try it: `npx @vedanth/context7 react hooks`

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

### Why it's different

The entire install is `npx @vedanth/context7` — no server, no config, no IDE plugin. Under the hood it's 170 lines of pure Node.js with zero npm dependencies, using just built-in `fetch` to query Context7's live documentation database. Because it outputs plain text to stdout, it composes naturally with pipes, redirects, and subshells — feed docs into Claude, Ollama, llama.cpp, grep, or just `cat`. It's the same data that powers the Context7 MCP server in Cursor, without the MCP client requirement.

### Links

- **Install:** `npm install -g @vedanth/context7`
- **Try now:** `npx @vedanth/context7 prisma "relations"`
- **GitHub:** https://github.com/VedanthB/context7-cli
- **npm:** https://www.npmjs.com/package/@vedanth/context7
- **Website:** https://vedanthb.github.io/context7-cli/
- **Author:** https://akarispeed.xyz

## Maker Comment

I built c7 because I wanted Context7's docs in my terminal workflows, not just inside my editor.

The MCP server is great when you're in Cursor, but if you're SSHing into a server, writing a bash script, or using a local LLM — you're back to pasting docs manually.

c7 is just a pipe. It outputs text. What you do with that text is up to you — feed it to Claude, Ollama, grep, or append it to a file.

It's 170 lines with zero npm dependencies. The entire thing is just `process.argv` parsing and two `fetch` calls to Context7's API.

Try it: `npx @vedanth/context7 prisma "relations"`

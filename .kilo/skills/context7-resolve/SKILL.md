---
name: context7-resolve
description: Find Context7 library IDs for a given library name. Use when you need to resolve library names to their Context7 identifiers for documentation retrieval.
license: MIT
compatibility: Requires Node.js >=18 and the @vedanth/context7 package installed
metadata:
  author: Kilo
  version: "1.0.1"
allowed-tools: Bash
---

# Context7 Library Resolution Skill

This skill provides instructions for resolving library names to Context7 identifiers using the c7 CLI tool.

## Overview

Context7 provides version-specific, up-to-date library documentation. Resolving a library name converts common names (e.g. "nextjs", "react") into Context7 canonical IDs (e.g. `/vercel/next.js`, `/facebook/react`), which can then be used with `c7 docs` for targeted documentation retrieval.

## When to Use This Skill

Use this skill when:

- You know the common name of a library but `c7 docs <name>` fails with "No libraries found"
- You need to find the exact Context7 ID for version-specific or vendor-scoped documentation
- You want to see what libraries are available before choosing one
- You need to explore alternative naming conventions for a library

## How to Use

### Basic Resolution

```bash
c7 resolve <library-name>

# Using shorthand alias
c7 r <library-name>

# Using with npx (no installation required)
npx @vedanth/context7 resolve <library-name>

# Using shorthand alias with npx
npx @vedanth/context7 r <library-name>
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--json` | Output raw JSON instead of formatted text | off |
| `--api-key <key>` | Context7 API key (or set CONTEXT7_API_KEY env var) | none |

### Examples

```bash
# Simple lookup
c7 resolve nextjs
# → /vercel/next.js

# Resolve with JSON output for programmatic use
c7 resolve react --json

# Disambiguate between similar libraries
c7 resolve express
c7 resolve koa

# Explore available libraries
c7 resolve state management
c7 resolve css framework

# Non-obvious naming
c7 resolve rn  # React Native
c7 resolve nv  # Neovim
c7 resolve shadcn
```

### JSON Output Format

When using `--json`, returns an array of results:

```json
[
  {
    "id": "/facebook/react",
    "title": "React",
    "description": "A JavaScript library for building user interfaces"
  }
]
```

### Working with Resolve Results

#### Chain with docs in a script

```bash
# Resolve, extract ID, then fetch docs
ID=$(c7 resolve react --json | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)[0].id))")
c7 docs "$ID" "hooks"
```

#### Use shorthands for known libraries

Once you know the ID, you can use it directly:

```bash
c7 docs /facebook/react hooks
c7 docs /vercel/next.js "app router"
```

### Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| "No libraries found for X" | Library not in Context7 index | Try synonyms, check spelling, or use a more general query |
| "Search failed: 429" | Rate limited | Set `CONTEXT7_API_KEY` for higher limits |
| "Error: fetch failed" | Network issue | Check internet connection |
| "command not found: c7" | CLI not installed | Use `npx @vedanth/context7` or run `npm install -g @vedanth/context7` |

### When Resolution Fails

If `c7 resolve` returns no results, try these strategies in order:

1. **Use a more general name**: `react` → `reactjs`, `vue` → `vuejs`
2. **Try the ecosystem name**: `chakra` → `chakra-ui`, `tailwind` → `tailwindcss`
3. **Search by category**: `c7 resolve css framework` or `c7 resolve react component library`
4. **Use the library's GitHub org/repo name**: Look at the library's GitHub URL and try `/org/repo` format
5. **Check if it needs version qualification**: Some libraries have multiple version IDs

### Installation Options

```bash
# Global install (recommended for frequent use)
npm install -g @vedanth/context7

# Use with npx (zero install)
npx @vedanth/context7 resolve <library>

# Project install
npm install @vedanth/context7 --save-dev
```

### Integration Patterns

#### In Makefile

```makefile
resolve-lib:
	@c7 resolve $(LIB) --json | node -e "\
		const data = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));\
		data.forEach(r => console.log(r.id, '-', r.description));"

docs:
	c7 docs $(shell c7 resolve $(LIB) --json | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)[0].id))") "$(TOPIC)"
```

#### In Automation Scripts

```bash
#!/usr/bin/env bash
# fetch-docs.sh — resolve and fetch docs in one step
LIB=$1
TOPIC=$2
ID=$(npx @vedanth/context7 r "$LIB" --json | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)[0].id))")
npx @vedanth/context7 docs "$ID" "$TOPIC"
```

### Frequently Resolved Libraries

| Common Name | Context7 ID |
|-------------|-------------|
| react | `/facebook/react` |
| nextjs | `/vercel/next.js` |
| express | `/expressjs/express` |
| tailwindcss | `/tailwindlabs/tailwindcss` |
| vue | `/vuejs/core` |
| prisma | `/prisma/prisma` |
| lodash | `/lodash/lodash` |
| axios | `/axios/axios` |
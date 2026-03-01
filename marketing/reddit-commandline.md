# r/commandline Post Draft

**Subreddit:** r/commandline

---

**Title:** c7 — Fetch library docs to stdout, pipe into anything (170 lines, zero deps)

**Body:**

Small CLI that queries Context7's documentation database and prints results to stdout. Designed to compose with standard Unix tools.

```bash
# Basic usage
c7 react hooks                          # Print React hooks docs
c7 express middleware --tokens 3000     # Limit output size

# Compose with pipes
c7 nextjs "api routes" | grep "export"  # Filter for exports
c7 prisma "schema" | less               # Page through docs
c7 react "useEffect" | pbcopy           # Copy to clipboard
c7 tailwindcss "grid" | wc -l           # Count lines
c7 express middleware >> prompt.txt      # Append to file

# Feed into LLMs
c7 react hooks | claude "summarize"
c7 express middleware | ollama run codellama "explain"
```

**What it does:** Resolves a library name against Context7's database, fetches version-specific documentation with code examples, and prints it. That's it.

**Why it exists:** Context7 has an MCP server for AI editors, but MCP is a protocol that requires client support. This just gives you the data as text.

**Stats:**
- 170 lines total (130 CLI + 40 API client)
- Zero dependencies — just Node.js built-in `fetch`
- Two files: `bin/c7.js` and `lib/api.js`
- Works on Node 18+

**Install:**

```bash
npx @vedanth/context7           # Run without installing
npm install -g @vedanth/context7 # Or install globally for `c7`
```

Source: https://github.com/VedanthB/context7-cli
npm: https://www.npmjs.com/package/@vedanth/context7
Website: https://vedanthb.github.io/context7-cli/

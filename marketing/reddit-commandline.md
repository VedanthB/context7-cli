# r/commandline Post Draft

**Subreddit:** r/commandline

---

**Title:** c7 — Fetch library docs to stdout, pipe into anything (170 lines, zero deps)

**Body:**

Small CLI that queries Context7's documentation database and prints results to stdout. Designed to compose with standard Unix tools.

```bash
# Basic usage
c7 drizzle "queries"                       # Print Drizzle ORM query docs
c7 hono "middleware" --tokens 3000         # Limit output size

# Compose with pipes
c7 zod "schemas" | grep "z.object"         # Filter for object schemas
c7 drizzle "schema" | less                 # Page through docs
c7 hono "context" | pbcopy                 # Copy to clipboard
c7 zod "validation" | wc -l               # Count lines
c7 drizzle "migrations" >> prompt.txt      # Append to file

# Feed into LLMs
c7 zod "transforms" | claude "summarize"
c7 hono "routing" | ollama run deepseek-coder "explain"
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
Author: https://akarispeed.xyz

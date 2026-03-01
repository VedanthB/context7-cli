# Hacker News — Show HN Draft

---

**Title:** Show HN: c7 – Pipe up-to-date library docs into any LLM from the terminal

**URL:** https://github.com/VedanthB/context7-cli

**First comment:**

Mario Zechner benchmarked Playwright's MCP server at 13.7k tokens just for tool descriptions. A minimal CLI README covering the same capabilities: 225 tokens. Jannik Reinhard found similar numbers with the GitHub MCP server — 93 tools consuming ~55k tokens in definitions alone.

Eric Holmes put the alternative well: "Ship a good API, then ship a good CLI. The agents will figure it out."

c7 is that approach applied to library documentation. Context7 indexes docs from library source repos. Their MCP server feeds this into Cursor, but it requires a compatible client. c7 gives you the same data as plain text on stdout.

```
c7 astro "routing" | claude "summarize the key patterns"
c7 zod "schemas" | ollama run deepseek-coder "explain"
c7 svelte "reactivity" | grep "rune"
```

170 lines of Node.js, zero dependencies. Works without an API key.

Install: `npx @vedanth/context7`

GitHub: https://github.com/VedanthB/context7-cli
npm: https://www.npmjs.com/package/@vedanth/context7
Website: https://c7.akarispeed.xyz/
Author: https://akarispeed.xyz

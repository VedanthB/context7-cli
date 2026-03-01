# Hacker News — Show HN Draft

---

**Title:** Show HN: c7 – Pipe up-to-date library docs into any LLM from the terminal

**URL:** https://github.com/VedanthB/context7-cli

**First comment:**

There's been growing sentiment that CLIs beat MCP servers for developer tools — MCP adds protocol complexity where stdout would do.

Context7 indexes docs from library source repos. Their MCP server feeds this into Cursor, but it requires a compatible client. c7 is a CLI that gives you the same data as plain text on stdout. Pipe it into any LLM, grep, less, or your own scripts.

```
c7 astro "routing" | claude "summarize the key patterns"
c7 zod "schemas" | ollama run deepseek-coder "explain"
c7 svelte "reactivity" | grep "rune"
```

170 lines of Node.js, zero dependencies. Works without an API key.

Install: `npx @vedanth/context7`

GitHub: https://github.com/VedanthB/context7-cli
npm: https://www.npmjs.com/package/@vedanth/context7
Website: https://vedanthb.github.io/context7-cli/
Author: https://akarispeed.xyz

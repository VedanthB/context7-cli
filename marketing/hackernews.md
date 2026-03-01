# Hacker News — Show HN Draft

---

**Title:** Show HN: c7 – Pipe up-to-date library docs into any LLM from the terminal

**URL:** https://github.com/VedanthB/context7-cli

**Body (text post, if no URL):**

Context7 indexes documentation from library source repos and official docs. Their MCP server feeds this into AI editors like Cursor, but MCP requires specific client support.

c7 is a CLI that gives you the same data as plain text on stdout. Pipe it into any LLM, grep, less, or your own scripts.

```
c7 react hooks | claude "summarize the key patterns"
c7 express middleware | ollama run codellama "explain"
c7 nextjs "app router" | grep "layout"
```

170 lines of Node.js, zero dependencies. Works without an API key.

Install: `npx @vedanth/context7`

GitHub: https://github.com/VedanthB/context7-cli
npm: https://www.npmjs.com/package/@vedanth/context7
Website: https://vedanthb.github.io/context7-cli/

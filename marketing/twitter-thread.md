# Twitter/X Thread Draft

**Account:** @thevedanthbora

> **Note:** Code blocks should be posted as screenshots (or use an image generator like carbon.now.sh). Twitter does not render code blocks — they'll appear as plain text.

---

**Tweet 1 (Hook):**

Everyone's been saying CLIs > MCP servers for dev tools lately. I agree.

Context7 has great library docs, but locks them behind an MCP server that only works inside editors.

So I built c7 — same docs, plain stdout. Pipe into any LLM, grep, scripts. Anywhere.

170 lines. Zero dependencies. One command.

akarispeed.xyz

---

**Tweet 2 (Problem):**

The problem:
- Ask Claude to write a Next.js API route -> get Pages Router syntax from v12
- Paste docs into the prompt -> they're already outdated
- Use MCP server -> only works in Cursor/Claude Code

Devs working in the terminal or with local models have limited options.

---

**Tweet 3 (Solution):**

c7 pulls real, version-specific docs from Context7's database and prints them to stdout.

```
c7 hono "routing"
c7 zod "schemas"
c7 astro "content collections"
```

No server setup. No config. Just text you can pipe into anything.

---

**Tweet 4 (Demo):**

Pipe into any LLM:

```
c7 zod "validation" | claude "summarize"
c7 hono "middleware" | ollama run deepseek-coder "explain"
```

Pipe into Unix tools:

```
c7 astro "routing" | grep "getStaticPaths"
c7 zod "schemas" | less
```

Pipe into scripts, CI, whatever.

---

**Tweet 5 (CTA):**

Try it now — no install needed:

```
npx @vedanth/context7 hono "routing"
```

GitHub: github.com/VedanthB/context7-cli
npm: npmjs.com/package/@vedanth/context7
Website: vedanthb.github.io/context7-cli/

#webdev #ai #cli #opensource #devtools

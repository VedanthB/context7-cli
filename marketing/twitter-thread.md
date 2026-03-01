# Twitter/X Thread Draft

**Account:** @thevedanthbora

> **Note:** Code blocks should be posted as screenshots (or use an image generator like carbon.now.sh). Twitter does not render code blocks — they'll appear as plain text.

---

**Tweet 1 (Hook):**

Peter Steinberger (190k GitHub stars, hired by OpenAI): "mcp were a mistake. bash is better."

8+ blog posts in Feb 2026 alone arguing CLIs beat MCP servers.

So I built c7 — library docs piped to stdout for any LLM. 170 lines, zero deps.

github.com/VedanthB/context7-cli

---

**Tweet 2 (The number):**

GitHub's MCP server ships 93 tools that eat ~55,000 tokens in tool definitions.

That's half of GPT-4o's context window. Gone. Before you ask a single question.

The CLI equivalent? Zero token overhead. Just the output you asked for.

---

**Tweet 3 (The comparison):**

Playwright MCP: 13,700 tokens for tool descriptions.
A CLI README teaching the same thing: 225 tokens.

That's a 60x difference.

For local models with 8k context, this is the difference between "it works" and "it doesn't fit."

---

**Tweet 4 (Demo):**

c7 pulls real, version-specific docs from Context7 and prints to stdout. Pipe into anything:

c7 hono "routing" | claude "summarize"
c7 zod "schemas" | ollama run deepseek-coder "explain"
c7 astro "routing" | grep "getStaticPaths"

No server. No config. No IDE plugin.

---

**Tweet 5 (CTA):**

Try it, no install needed:

npx @vedanth/context7 hono "routing"

GitHub: github.com/VedanthB/context7-cli
npm: npmjs.com/package/@vedanth/context7
Website: c7.akarispeed.xyz

#webdev #ai #cli #opensource

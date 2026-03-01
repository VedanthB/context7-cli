# Twitter/X Thread Draft

**Account:** @thevedanthbora

---

**Tweet 1 (Hook):**

Your AI assistant hallucinates APIs that don't exist.

Context7 fixes this with an MCP server — but only inside supported editors.

I built a CLI that gives you the same docs anywhere. Terminal, scripts, local LLMs.

170 lines. Zero dependencies. One command.

🧵

---

**Tweet 2 (Problem):**

The problem:
- Ask Claude to write a Next.js API route → get Pages Router syntax from v12
- Paste docs into the prompt → they're already outdated
- Use MCP server → only works in Cursor/Claude Code

Devs working in the terminal or with local models have no good option.

---

**Tweet 3 (Solution):**

c7 pulls real, version-specific docs from Context7's database and prints them to stdout.

```
c7 react hooks
c7 express middleware
c7 nextjs "app router"
```

That's it. No server setup. No config. Just text you can pipe into anything.

---

**Tweet 4 (Demo):**

Pipe into any LLM:

```
c7 react hooks | claude "summarize"
c7 express middleware | ollama run codellama "explain"
```

Pipe into Unix tools:

```
c7 nextjs "api routes" | grep "export"
c7 prisma schema | less
```

Pipe into scripts, CI, whatever.

---

**Tweet 5 (CTA):**

Try it now — no install needed:

```
npx @vedanth/context7 react hooks
```

GitHub: github.com/VedanthB/context7-cli
npm: npmjs.com/package/@vedanth/context7
Website: vedanthb.github.io/context7-cli/

#webdev #ai #cli #opensource #devtools

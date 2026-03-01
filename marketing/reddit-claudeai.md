# r/ClaudeAI Post Draft

**Subreddit:** r/ClaudeAI

---

**Title:** I built a CLI that pipes up-to-date library docs into Claude — no MCP server needed

**Body:**

There's been a lot of talk lately about CLIs being better than MCP servers for dev tools. MCP ties you to specific editors. A CLI just gives you text you can pipe anywhere.

Context7 has great docs data (it's what powers Cursor's doc lookup), but their MCP server only works inside MCP-compatible editors. So I built `c7` — a CLI that pulls the same docs and lets you pipe them directly into Claude from your terminal.

**Quick example:**

```bash
# Get Prisma docs and pipe into Claude Code CLI (the `claude` command)
c7 prisma "relations" | claude "summarize the relation patterns and show usage examples"

# Feed Next.js docs into a coding prompt
DOCS=$(c7 nextjs "app router" --tokens 8000)
claude "Build a middleware using these docs:\n$DOCS"
```

> Note: The `claude` command in these pipe examples refers to [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's CLI for Claude. It accepts piped stdin as context.

**How it compares to the MCP approach:**

| | MCP Server | c7 CLI |
|---|---|---|
| Setup | Install server, configure client, restart editor | `npx @vedanth/context7` |
| Works in | MCP-compatible editors only | Terminal, scripts, CI, anywhere |
| Pipe to tools | No | Yes — grep, jq, less, any LLM |
| Dependencies | Several | Zero |

It's ~170 lines of pure Node.js with zero dependencies. The whole thing just uses `fetch` to hit Context7's public API.

**Install:**

```bash
npx @vedanth/context7 prisma "findMany"   # No install needed
npm install -g @vedanth/context7           # Or install globally for `c7` command
```

Works without an API key for basic usage.

- GitHub: https://github.com/VedanthB/context7-cli
- npm: https://www.npmjs.com/package/@vedanth/context7
- Landing page: https://vedanthb.github.io/context7-cli/
- Author: https://akarispeed.xyz

What libraries would you use this with? I've been using it mostly for framework docs (Next.js, Prisma, Hono) where the API surface changes often.

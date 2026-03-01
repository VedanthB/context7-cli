# r/ClaudeAI Post Draft

**Subreddit:** r/ClaudeAI

---

**Title:** The GitHub MCP server eats 55,000 tokens just for tool definitions. I built a CLI that uses 225 instead.

**Body:**

I've been following the CLI vs MCP debate closely, and the token bloat numbers are worse than I expected.

Jannik Reinhard benchmarked the MCP approach for listing 50 Intune devices: ~145,000 tokens. The equivalent CLI command? ~4,150 tokens. That's a 35x reduction. The GitHub MCP server alone ships 93 tools consuming roughly 55,000 tokens in tool definitions, which is about half of GPT-4o's context window gone before you even ask a question.

Even Anthropic published an engineering blog acknowledging MCP's context bloat problem. When the company that created the protocol is saying "yeah, this is an issue," maybe it's worth rethinking the approach.

So I built `c7`, a CLI that pulls real, version-specific library docs from Context7's database and prints them to stdout. Same data that powers their MCP server in Cursor. No protocol overhead. Just text you can pipe into Claude.

**Quick example:**

```bash
# Get Prisma docs and pipe into Claude Code CLI
c7 prisma "relations" | claude "summarize the relation patterns and show usage examples"

# Feed Next.js docs into a coding prompt
DOCS=$(c7 nextjs "app router" --tokens 8000)
claude "Build a middleware using these docs:\n$DOCS"
```

> Note: The `claude` command in these pipe examples refers to [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's CLI for Claude. It accepts piped stdin as context.

**What it looks like compared to MCP:**

| | MCP Server | c7 CLI |
|---|---|---|
| Setup | Install server, configure client, restart editor | `npx @vedanth/context7` |
| Works in | MCP-compatible editors only | Terminal, scripts, CI, anywhere |
| Pipe to tools | No | Yes — grep, jq, less, any LLM |
| Token overhead | Thousands for tool definitions | Zero — just the docs you asked for |
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
- Landing page: https://c7.akarispeed.xyz/
- Author: https://akarispeed.xyz

For anyone dealing with context window limits on Claude, the token savings alone make the CLI approach worth trying. I've been using it mostly for framework docs where the API surface changes between versions (Next.js, Prisma, Hono).

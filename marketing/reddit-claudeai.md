# r/ClaudeAI Post Draft

**Subreddit:** r/ClaudeAI

---

**Title:** I built a CLI that pipes up-to-date library docs into Claude — no MCP server needed

**Body:**

I kept running into the same problem: Claude hallucinates APIs that don't exist or uses outdated syntax. The MCP server from Context7 fixes this, but you need Cursor or another MCP-compatible editor.

So I built `c7` — a CLI that pulls the same docs from Context7's database and lets you pipe them directly into Claude from your terminal.

**Quick example:**

```bash
# Get React hooks docs and pipe into Claude
c7 react hooks | claude "summarize the key patterns and show usage examples"

# Feed Next.js docs into a coding prompt
DOCS=$(c7 nextjs "app router" --tokens 8000)
claude "Build a middleware using these docs:\n$DOCS"
```

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
npx @vedanth/context7 react hooks          # No install needed
npm install -g @vedanth/context7            # Or install globally for `c7` command
```

Works without an API key for basic usage.

- GitHub: https://github.com/VedanthB/context7-cli
- npm: https://www.npmjs.com/package/@vedanth/context7
- Landing page: https://vedanthb.github.io/context7-cli/

Happy to answer any questions. Would love to hear how others are handling the "outdated docs in AI prompts" problem.

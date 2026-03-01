# awesome-mcp-servers PR Draft

---

## PR Title

Add c7 — Context7 CLI for piping library docs to terminal/LLMs

## PR Body

### Description

Adding [c7](https://github.com/VedanthB/context7-cli) — a CLI that pulls documentation from Context7's database and outputs it as plain text to stdout.

While Context7's MCP server works inside AI editors, c7 makes the same docs available in the terminal for piping into any LLM, script, or Unix tool.

```bash
c7 react hooks | claude "summarize"
c7 express middleware | ollama run codellama "explain"
c7 nextjs "app router" | grep "layout"
```

- Zero dependencies, ~170 lines
- Works without API key
- npm: [@vedanth/context7](https://www.npmjs.com/package/@vedanth/context7)
- Website: [vedanthb.github.io/context7-cli](https://vedanthb.github.io/context7-cli/)

### Category

This is a CLI companion to the Context7 MCP server, providing terminal access to the same documentation database. Suggested section: **Developer Tools** or **Documentation** (depending on repo structure).

## Line to Add

```markdown
- [c7](https://github.com/VedanthB/context7-cli) - CLI for Context7 docs — pipe up-to-date library documentation into any LLM or terminal tool. Zero dependencies.
```

## Submission Notes

- The awesome-mcp-servers repo is at `punkpeye/awesome-mcp-servers` on GitHub
- The official `upstash/context7` MCP server is already listed under Knowledge & Memory
- **Auto-PR was skipped** — this repo specifically lists MCP servers, and c7 is a CLI companion, not an MCP server. The PR might be rejected as off-topic. Consider submitting manually with a note explaining it's a CLI frontend for the same Context7 data, or find an "awesome-cli-tools" or "awesome-ai-tools" list instead.
- Alternative repos to submit to:
  - `agarrharr/awesome-cli-apps`
  - `rothgar/awesome-tuis` (if relevant)
  - `f/awesome-chatgpt-prompts` (as a tool mention)
  - `korben4ik/awesome-ai-tools`

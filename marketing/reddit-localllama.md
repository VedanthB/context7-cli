# r/LocalLLaMA Post Draft

**Subreddit:** r/LocalLLaMA

---

**Title:** Pipe up-to-date library docs into Ollama/llama.cpp from the terminal — zero vendor lock-in

**Body:**

There's been a lot of discussion about CLIs vs MCP servers lately, and I think CLIs win for anything that should be composable. Built a CLI that pulls version-specific library documentation and outputs it as plain text to stdout. Works with whatever LLM setup you have — Ollama, llama.cpp, text-generation-webui, anything that reads stdin.

**Examples with Ollama:**

```bash
# Pipe Vue docs into deepseek-coder via Ollama
c7 vue "composition api" | ollama run deepseek-coder "explain the setup function"

# Svelte reactivity docs into codellama
c7 svelte "runes" | ollama run codellama "summarize these patterns"

# Just grab docs for your own pipeline
c7 drizzle "schema" --tokens 3000 >> context.txt
```

**Why I built it:**

Context7 has an MCP server that feeds real docs into AI coding editors (Cursor, etc.), but MCP is tied to specific clients. I wanted the same data available for local LLM workflows.

`c7` is just a pipe-friendly CLI. It outputs plain text, so it works with anything:

```bash
c7 vue "reactivity" | ollama run deepseek-coder "write an example"
c7 svelte "stores" | cat -n | less
c7 drizzle "relations" | pbcopy  # copy to clipboard
```

**Details:**

- Zero dependencies — pure Node.js, ~170 lines
- No API key required for basic usage
- No vendor lock-in — it's just stdout
- Pulls from Context7's live doc database (same data Cursor MCP uses)

**Install:**

```bash
npx @vedanth/context7 vue "composition api"   # Zero install, runs immediately
npm install -g @vedanth/context7               # Or install globally
```

- GitHub: https://github.com/VedanthB/context7-cli
- npm: https://www.npmjs.com/package/@vedanth/context7
- Landing page: https://vedanthb.github.io/context7-cli/
- Author: https://akarispeed.xyz

Curious what local LLM workflows you'd use this for. I mostly use it to pre-load context before coding sessions, but there's probably use cases I haven't thought of.

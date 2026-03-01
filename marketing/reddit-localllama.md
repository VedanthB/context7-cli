# r/LocalLLaMA Post Draft

**Subreddit:** r/LocalLLaMA

---

**Title:** Pipe up-to-date library docs into Ollama/llama.cpp from the terminal — zero vendor lock-in

**Body:**

Built a CLI tool that pulls version-specific library documentation and outputs it as plain text to stdout. It's designed to work with whatever LLM setup you have — Ollama, llama.cpp, text-generation-webui, anything that reads stdin.

**Examples:**

```bash
# Pipe Express docs into codellama via Ollama
c7 express middleware | ollama run codellama "explain this middleware pattern"

# Feed React docs into any local model
c7 react hooks | llama-cli -m model.gguf -p "summarize these docs:"

# Just grab docs for your own pipeline
c7 prisma "findMany" --tokens 3000 >> context.txt
```

**Why I built it:**

Context7 has an MCP server that feeds real docs into AI coding editors (Cursor, etc.), but MCP is tied to specific clients. I wanted the same data available for local LLM workflows.

`c7` is just a pipe-friendly CLI. It outputs plain text, so it works with anything:

```bash
c7 nextjs "api routes" | ollama run deepseek-coder "write an example"
c7 tailwindcss "dark mode" | cat -n | less
c7 react hooks | pbcopy  # copy to clipboard
```

**Details:**

- Zero dependencies — pure Node.js, ~170 lines
- No API key required for basic usage
- No vendor lock-in — it's just stdout
- Pulls from Context7's live doc database (same data Cursor MCP uses)

**Install:**

```bash
npx @vedanth/context7 react hooks          # Zero install, runs immediately
npm install -g @vedanth/context7            # Or install globally
```

No API keys needed for the tool itself. Context7 provides a free tier.

- GitHub: https://github.com/VedanthB/context7-cli
- npm: https://www.npmjs.com/package/@vedanth/context7
- Landing page: https://vedanthb.github.io/context7-cli/

Curious what local LLM workflows you'd use this for. I mostly use it to pre-load context before coding sessions, but there's probably use cases I haven't thought of.

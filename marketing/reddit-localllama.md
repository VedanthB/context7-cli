# r/LocalLLaMA Post Draft

**Subreddit:** r/LocalLLaMA

---

**Title:** Playwright MCP: 13,700 tokens for tool descriptions. A CLI README: 225 tokens. This matters more when your context window is 8k.

**Body:**

Peter Steinberger (the guy behind PSPDFKit, 190k GitHub stars, recently hired by OpenAI) put it bluntly: "mcp were a mistake. bash is better."

He's not wrong, and the numbers back it up. Mario Zechner benchmarked Playwright's MCP server at 13,700 tokens just for tool descriptions. A minimal CLI README that teaches an LLM the same capabilities? 225 tokens. That ratio matters a lot less when you're on GPT-4o with 128k context. It matters enormously when you're running a 7B or 13B model with an 8k window.

I built a CLI that pulls version-specific library docs from Context7's database and outputs plain text to stdout. Context7 already has an MCP server for Cursor, but MCP is completely useless for local LLM workflows. `c7` just gives you the docs as text you can pipe wherever you want.

**Examples with Ollama:**

```bash
# Pipe Vue docs into deepseek-coder via Ollama
c7 vue "composition api" | ollama run deepseek-coder "explain the setup function"

# Svelte reactivity docs into codellama
c7 svelte "runes" | ollama run codellama "summarize these patterns"

# Just grab docs for your own pipeline
c7 drizzle "schema" --tokens 3000 >> context.txt
```

The `--tokens` flag is especially useful for local models. You can cap the output to fit your context window instead of dumping 50k tokens of docs into a model that can only handle 4k.

```bash
c7 vue "reactivity" | ollama run deepseek-coder "write an example"
c7 svelte "stores" | cat -n | less
c7 drizzle "relations" | pbcopy  # copy to clipboard
```

**Why this approach wins for local:**

- Zero token overhead from protocol definitions. Your entire context budget goes to actual documentation.
- Cap output with `--tokens` to match your model's window.
- Works with Ollama, llama.cpp, text-generation-webui, koboldcpp, anything that reads stdin.
- No server process eating your GPU's VRAM.

Zero dependencies, pure Node.js, ~170 lines. No API key required for basic usage.

**Install:**

```bash
npx @vedanth/context7 vue "composition api"   # Zero install, runs immediately
npm install -g @vedanth/context7               # Or install globally
```

- GitHub: https://github.com/VedanthB/context7-cli
- npm: https://www.npmjs.com/package/@vedanth/context7
- Landing page: https://c7.akarispeed.xyz/
- Author: https://akarispeed.xyz

If you're running local models with tight context windows, the difference between 13.7k tokens of MCP overhead and 0 tokens of CLI overhead is the difference between fitting the docs in context or not.

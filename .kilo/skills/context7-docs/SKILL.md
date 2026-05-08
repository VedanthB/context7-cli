---
name: context7-docs
description: Get documentation for a library from Context7. Use when you need up-to-date library documentation, API references, code examples, or specific topic information from Context7.
license: MIT
compatibility: Requires Node.js >=18 and the @vedanth/context7 package installed
metadata:
  author: Kilo
  version: "1.0.1"
allowed-tools: Bash
---

# Context7 Documentation Fetch Skill

This skill provides instructions for fetching library documentation using the c7 CLI tool from Context7.

## Overview

Context7 provides version-specific, up-to-date documentation for programming libraries and frameworks. This skill helps you retrieve documentation directly from the terminal.

## How to Use

### Basic Documentation Fetch

```bash
# Using docs subcommand explicitly
c7 docs <library> [topic]

# Using shorthand syntax (more convenient)
c7 <library> [topic]

# Using with npx (no installation required)
npx @vedanth/context7 <library> [topic]
```

### Options

- `--tokens <n>`: Maximum tokens to return (default: 5000)
- `--api-key <key>`: Provide Context7 API key (or set CONTEXT7_API_KEY environment variable)

### Examples

```bash
# Get React hooks documentation (using shorthand)
c7 react hooks

# Get React hooks documentation (using explicit docs subcommand)
c7 docs react hooks

# Get Next.js app router docs with more tokens
c7 docs nextjs "app router" --tokens 10000

# Get Express middleware documentation
c7 express middleware

# Get Tailwind CSS dark mode docs
c7 tailwindcss "dark mode"

# Use exact Context7 ID
c7 docs /vercel/next.js "image optimization"

# Use with npx (no installation required)
npx @vedanth/context7 vue "composition api"
```

### Advanced Usage

#### Piping Output

```bash
# Copy to clipboard (macOS)
c7 react hooks | pbcopy

# Copy to clipboard (Linux)
c7 react hooks | xclip -selection clipboard

# Save to file
c7 express middleware >> docs.txt

# Feed into LLM (if claude command is available)
c7 nextjs "api routes" | claude "summarize these docs"

# Process with other CLI tools
c7 react "component lifecycle" | grep -A 5 -B 5 "useEffect"
```

#### Environment Variable

Set your API key for higher rate limits:

```bash
export CONTEXT7_API_KEY=your-api-key-here
```

### Output Format

Returns plain text documentation that can be piped to other tools, saved to files, or used in scripts.

### Practical Use Cases

1. **Quick API Reference Lookup**
   ```bash
   # Quickly find method signatures
   c7 lodash "debounce" | head -10
   ```

2. **Integration With Coding Assistants**
   ```bash
   # Create a contextual prompt for an AI
   c7 express "middleware" > express-middleware-docs.txt
   echo "Using the following documentation, help me create middleware:" | cat - express-middleware-docs.txt | claude
   ```

3. **Automated Documentation Workflows**
   ```bash
   # Generate documentation snippets for a project
   mkdir project-docs
   c7 react "hooks" > project-docs/react-hooks.md
   c7 redux "selectors" > project-docs/redux-selectors.md
   ```

### Error Handling

- If the library name can't be resolved automatically, use `c7 resolve` first to find the exact ID
- For version-specific docs, use the full Context7 ID path like `/vercel/next.js`
- Check your API key if you hit rate limits
- If getting "command not found" errors, ensure the CLI is properly installed or use npx

### Installation Options

Choose the best installation method for your needs:

```bash
# Option 1: Global installation (recommended for frequent use)
npm install -g @vedanth/context7

# Option 2: Use with npx (no installation required)
npx @vedanth/context7 <library> [topic]

# Option 3: Install as a project dependency
npm install @vedanth/context7 --save-dev
```

### Troubleshooting

Common issues and solutions:

1. **"command not found"**: Install globally or use npx:
   ```bash
   # Install globally
   npm install -g @vedanth/context7
   
   # Or use npx for one-time use
   npx @vedanth/context7 react hooks
   ```

2. **"No libraries found"**: The library name might differ from common assumptions:
   ```bash
   # Search for alternative names
   c7 resolve vue
   c7 resolve angular
   ```

3. **Rate limiting**: Set an API key to increase rate limits:
   ```bash
   export CONTEXT7_API_KEY=your-key-here
   # Add to ~/.zshrc or ~/.bashrc for persistence
   echo 'export CONTEXT7_API_KEY=your-key-here' >> ~/.zshrc
   ```

### Integration with Development Workflows

1. **In Package.json Scripts**
   ```json
   {
     "scripts": {
       "docs-react": "c7 react 'hooks guide' > docs/react-hooks.md",
       "docs-express": "c7 express middleware > docs/express-middleware.md"
     }
   }
   ```

2. **In CI/CD Pipelines**
   ```bash
   # Generate documentation artifacts during build
   c7 "$FRAMEWORK" "best practices" > docs/$FRAMEWORK-best-practices.md
   ```

3. **With Editor Integration**
   ```bash
   # Create helper scripts for your editor
   echo '#!/bin/bash\nc7 "$@"' > ~/bin/context7-search
   chmod +x ~/bin/context7-search
   ```

### Use Cases

- Quick API reference lookup
- Getting code examples for specific features
- Comparing documentation across versions
- Feeding documentation into AI coding assistants
- Building documentation into automation scripts
- Creating project-specific documentation bundles
- Onboarding new team members with relevant docs
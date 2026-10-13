---
name: pr-review-loop
description: After creating a PR, check for automated review comments (copilot, coderabbit, etc.), fix issues, commit, push, and reply. Use after any PR is opened to ensure all review feedback is addressed before merge.
license: MIT
compatibility: Requires GitHub CLI (gh) authenticated and git push access to a fork remote
metadata:
  author: Kilo
  version: "1.0.0"
allowed-tools: Bash
---

# PR Review Loop Skill

This skill codifies the workflow of responding to automated PR review comments (GitHub Copilot, CodeRabbit, etc.) after opening a pull request.

## When to Use

Use this skill immediately after creating a PR, before requesting human reviews. It ensures all automated review feedback is addressed so human reviewers see a clean, iterated diff.

## Flow

### 1. Fetch Review Comments

```bash
# Fetch all inline review comments on the PR
gh api repos/{owner}/{repo}/pulls/{pr-number}/comments --paginate | jq '.[] | {path, line, body, author: .user.login}'

# Fetch overall review summaries
gh pr view {pr-number} --repo {owner}/{repo} --comments --json comments,reviews | jq '.reviews[] | {author: .author.login, body, state, submittedAt}'
```

### 2. Categorize Comments

Group comments into categories:

| Category | Examples | Action |
|----------|----------|--------|
| **Code correctness** | Chunked stdin parsing, portable scripts | Fix immediately |
| **Documentation/accuracy** | Compatibility claims, version numbers | Update to reflect reality |
| **Style/formatting** | Markdown table syntax, indentation | Fix to match conventions |
| **Scope concerns** | PR says X but only does Y | Update PR body or add missing changes |
| **Out of scope** | Suggestions for unrelated improvements | Acknowledge, defer to separate PR |

### 3. Fix Each Issue

For each fix:

```bash
# Read the file at the reported line
# Apply the fix using the Edit tool

# Stage the fix
git add <file>

# After all fixes are applied, commit
git commit -m "fix: address review comments — brief description of what was fixed"
```

### 4. Push and Reply

```bash
git push fork <branch-name>
```

Then reply on the PR summarizing what was addressed:

```bash
gh pr comment {pr-number} --repo {owner}/{repo} --body "All review comments addressed in {commit-sha}:

- **Issue 1**: Description of fix
- **Issue 2**: Description of fix
..."
```

### 5. Common Patterns

#### Chunked stdin JSON parsing (unsafe → safe)

```
# Unsafe — can fail on chunked stdin:
node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)[0].id))"

# Safe — reads full stdin before parsing:
node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');console.log(JSON.parse(d)[0].id)"
```

#### Portable script writing (echo → heredoc)

```
# Unsafe — \\n escaping not portable across shells:
echo '#!/bin/bash\\nc7 "$@"' > script.sh

# Safe — heredoc:
cat > script.sh << 'SCRIPT'
#!/bin/bash
c7 "$@"
SCRIPT
```

#### Version bump for re-publish

If a PR fixes a bug in a published npm package, bump the version:

```bash
# bump patch in package.json
node -e "const p=require('./package.json');const v=p.version.split('.');v[2]=Number(v[2])+1;p.version=v.join('.');require('fs').writeFileSync('package.json',JSON.stringify(p,null,2)+'\\n')"
```

## Checklist

- [ ] PR is open and has automated reviews
- [ ] Fetched all inline comments and review summaries
- [ ] Categorized each issue
- [ ] Applied fixes for all actionable items
- [ ] Committed and pushed
- [ ] Replied on PR with summary of addressed issues

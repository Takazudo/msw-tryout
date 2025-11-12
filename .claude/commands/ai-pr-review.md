---
description: Request AI reviews from Codex and Claude for current PR
---

Request AI-powered code reviews from both Codex and Claude for the current pull request.

**Instructions:**

1. **Get the current PR number:**
   ```bash
   gh pr view --json number -q .number
   ```

2. **Post AI review trigger comment:**
  - Post a single comment with both "@codex review" and "@claude review"
  - **MUST start with**: `🤖 Post by Claude Code\n\n---\n\n`
   ```bash
   gh pr comment {PR_NUMBER} --body "$(cat <<'EOF'
🤖 Post by Claude Code

---

@codex @claude review
EOF
)"
   ```

3. **Report results:**
  - Report success with comment link
  - Both Codex and Claude will respond with their reviews on the PR

**Error Handling:**
- If no PR found: Inform user
- If API fails: Show error and suggest manual steps

**Example Output:**

```
✅ AI reviews requested for PR #42

🤖 Review comment posted: https://github.com/user/repo/pull/42#comment-xxx

Both Codex and Claude will respond with their reviews shortly.
```

**Remember:** ALL GitHub comments MUST start with the Claude Code header!

# Issue-Driven Development Workflow

You are starting an issue-driven development session. Follow these steps:

## 1. Initial Setup

The user will provide a proposal/plan text for the next implementation. Your tasks:

1. **Read and understand** the proposal thoroughly
2. **Identify the current branch** using `git branch --show-current`
3. **Ask clarifying questions** if anything is unclear or ambiguous before proceeding
4. **Create a new branch** from the current branch with a descriptive name (e.g., `feature/description` or `fix/description`)
5. **Create a GitHub issue** using `gh issue create` with:
  - A clear title summarizing the work
  - A detailed description including the plan
  - Relevant labels if applicable
  - **MUST start with**: `🤖 Post by Claude Code\n\n---\n\n`
6. **Present the plan** to the user and ask for confirmation before starting implementation

## 2. During Development

Throughout the session, maintain the GitHub issue:

- **Update the issue description** if the plan needs to be revised or clarified
- **Add comments** to the issue when:
  - New facts are discovered
  - Plans are confirmed or adjusted
  - Significant progress milestones are reached
  - Blockers or decisions need to be documented
  - **ALL comments MUST start with**: `🤖 Post by Claude Code\n\n---\n\n`

Use `gh issue comment <issue-number> --body "$(cat <<'EOF'
🤖 Post by Claude Code

---

comment text
EOF
)"` to add comments.

## 3. Completion

When you've completed updates:

1. **Commit your changes** with clear, descriptive commit messages
2. **Push to remote** using `git push -u origin <branch-name>`
3. **Create a PR** using `gh pr create` against the original branch
  - **PR body MUST start with**: `🤖 Post by Claude Code\n\n---\n\n`
4. **Link the PR to the issue** (GitHub will auto-link if you reference the issue in the PR description)

## Important Notes

- Always verify which branch you're on before making changes
- Keep the issue updated as the source of truth for the development session
- Use the TodoWrite tool to track and manage tasks throughout the implementation
- Reference the issue number in commits and PR (e.g., "Fix #123: implement feature")
- **CRITICAL**: ALL GitHub interactions (issues, PRs, comments) MUST start with the Claude Code header

Now, please provide the proposal/plan text for the implementation you'd like to work on.

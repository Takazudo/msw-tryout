---
description: Run pre-push validation (typecheck, lint, format, build, tests)
---

Run `npm run b4push` (from app directory) to execute pre-push validation checks.

This command runs:

- Code quality checks (typecheck, lint, format)
- Build verification
- Smoke tests (optional, use b4push:full)

**Instructions:**

1. Execute `cd app && npm run b4push` using the Bash tool
2. If the command succeeds, report success to the user
3. If errors or warnings occur:
  - Analyze the errors/warnings
  - If they are fixable code issues (linting errors, type errors, test failures), fix them automatically
  - If they appear to be maintenance updates (dependency updates, configuration changes), ask the user how to proceed
4. After fixing issues, run `npm run b4push` again to verify the fixes

**Available commands:**

- `npm run b4push` or `npm run b4push:quick` - Quick checks (typecheck, lint, format, build)
- `npm run b4push:full` - Full checks including smoke tests

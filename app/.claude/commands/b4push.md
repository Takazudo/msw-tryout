---
description: Run pre-push validation (typecheck, lint, format, build, tests)
---

Run the b4push script to validate code before pushing:

```bash
cd app && ../scripts/b4push.sh
```

This will run:
- Type checking (tsc --noEmit)
- Linting (eslint)
- Format checking (prettier)
- Build (next build)
- E2E smoke tests (playwright)

If any step fails, fix the issues before pushing.

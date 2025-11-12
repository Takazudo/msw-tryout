# Claude Code Guidelines for MSW Tryout Project

This document contains project-specific guidelines and conventions for Claude Code when working on this MSW (Mock Service Worker) tryout project.

## Project Overview

This is a simple MSW tryout project featuring:
- **Backend**: Netlify Functions (serverless)
- **Frontend**: Next.js 15 gallery application
- **Images**: Hosted externally at takazudomodular.com
- **Features**: Gallery with pagination, modal dialog, blurhash placeholders

## Development Environment

### Running the Application

Two terminal sessions are required:

1. **Terminal 1 - Next.js Dev Server (Port 3000)**:
   ```bash
   cd app && npm run dev
   ```

2. **Terminal 2 - Netlify Dev Server (Port 8888)**:
   ```bash
   npm run dev
   ```

### Port Configuration

- **Port 3000**: Next.js dev server (targetPort)
- **Port 8888**: Netlify Dev proxy (port)
- **Port 9999**: Netlify Functions (functionsPort)

### URL Redirects

- `/api/*` → `/.netlify/functions/*` (configured in netlify.toml)

### Accessing the Application

Always access via Netlify Dev proxy:
- **Correct**: http://localhost:8888
- **Incorrect**: http://localhost:3000 (missing Netlify Functions proxy)

## Project Structure

```
msw-tryout/
├── app/                          # Next.js application
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Gallery page with pagination
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── gallery-thumbnail-grid.tsx
│   │   ├── gallery-dialog.tsx
│   │   ├── pagination.tsx
│   │   └── blurhash.tsx
│   ├── lib/                     # Utilities
│   │   ├── api.ts              # API client
│   │   └── types.ts            # TypeScript types
│   └── .env.local              # Environment variables
├── netlify/
│   └── functions/              # Netlify Functions
│       ├── gallery.js          # GET /api/gallery (with pagination)
│       ├── gallery-item.js     # GET /api/gallery-item?slug={slug}
│       └── gallery-data.js     # Gallery data (260 items)
├── netlify.toml                # Netlify configuration
└── package.json                # Root package
```

## Code Style Guidelines

### File Naming Convention

All TypeScript and JavaScript files should use **kebab-case** naming:

- ✅ Good: `gallery-thumbnail-grid.tsx`, `gallery-dialog.tsx`, `pagination.tsx`
- ❌ Bad: `GalleryThumbnailGrid.tsx`, `GalleryDialog.tsx`, `Pagination.tsx`

Component exports should still use PascalCase:

```tsx
// File: gallery-dialog.tsx
export default function GalleryDialog() { ... }
```

## Security & Safety Guidelines

### Command Restrictions

#### ⚠️ CRITICAL: rm -rf Usage

**NEVER use `rm -rf` with absolute paths**. Always use relative paths.

**❌ WRONG:**
```bash
rm -rf /Users/takazudo/repos/personal/msw-tryout/file.md
```

**✅ CORRECT:**
```bash
rm -rf ./file.md
```

#### Git Operations

- **Never use force push** - Can destroy commit history and cause data loss
- **Don't use `git commit --amend`** - Only with explicit user permission
- **Don't create duplicate branch names** - Always use unique branch names for PRs

### GitHub Comment Format

**🚨 MANDATORY FOR ALL GITHUB INTERACTIONS 🚨**

When creating or posting **ANY** GitHub content (issues, PRs, comments), **MUST ALWAYS** start with this header:

```markdown
🤖 Post by Claude Code

---

[Your actual content here]
```

**This applies to:**
- ✅ GitHub issue creation (`gh issue create`)
- ✅ GitHub PR creation (`gh pr create`)
- ✅ PR description/body text
- ✅ Issue comments (`gh issue comment`)
- ✅ PR comments (`gh pr comment`)

**Examples:**

```bash
# PR creation
gh pr create --title "Add feature" --body "$(cat <<'EOF'
🤖 Post by Claude Code

---

Added new feature...
EOF
)"

# Issue comment
gh issue comment 123 --body "$(cat <<'EOF'
🤖 Post by Claude Code

---

Fixed the bug...
EOF
)"
```

**Why this is CRITICAL:**
- Team members can instantly recognize AI-generated posts
- Distinguishes between human and AI contributions
- Maintains project transparency
- Required by project conventions

## GitHub Integration

Use the `gh` command to interact with GitHub:

- **View issue**: `gh issue view <URL>`
- **View PR**: `gh pr view <URL>`
- **PR comments**: `gh api repos/{owner}/{repo}/pulls/{number}/comments`
- **General API**: `gh api <endpoint>`

## Git Worktree

The `worktrees/` directory contains git worktree directories. Each worktree may have a different branch checked out.

⚠️ **Critical Notes**:

- Each worktree is an independent working directory with its own branch
- Git commands in a worktree affect only that specific worktree
- **Always verify which worktree and branch you're in** before git operations
- Confusion between worktrees can lead to changes on the wrong branch

**Best Practices**:

1. Always check current branch: `git branch --show-current`
2. Verify correct worktree before making changes
3. Avoid destructive git operations without confirmation
4. Be aware of worktree context when referencing files

## Developer Notes

### Documentation Inbox

The `__inbox/` directory is used for developer notes, code reviews, and implementation logs. Files here are intentionally preserved and should not be treated as temporary files.

Includes:
- Code review notes
- Implementation documentation
- TDD development logs
- Migration plans
- Research notes

## Deployment

### Production URLs

This section is for reference from the original panels project:

- **Main Application**: https://panels.takazudomodular.com/
  - Deploys from `main` branch
  - Interactive configurator for case customization
- **Documentation**: https://panels.takazudomodular.com/doc/
  - Deploys from `/doc/` directory (Docusaurus)
  - Technical documentation and guides

### URL Mapping

When given a production URL, check corresponding local files:

- `https://panels.takazudomodular.com/` → Root of the project
- `https://panels.takazudomodular.com/doc/` → `/doc/` directory

## Package Management

This project uses npm. Key commands:

```bash
# Root level
npm run dev          # Start Netlify Dev
npm run build        # Build Next.js app
npm run kill         # Kill processes on ports 3000, 8888, 9999

# App level (cd app)
npm run dev          # Start Next.js dev server
npm run build        # Build Next.js app
npm run start        # Start production server
```

## API Documentation

### GET /api/gallery

Returns paginated gallery items.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 30) - Items per page

**Response:**
```json
{
  "items": [
    {
      "slug": "panels-gallery-zudo-blocks-141",
      "imageAlt": "",
      "blurhash": "UFFNxM^d=D~9:kJ...",
      "thumbnailUrl": "https://...",
      "enlargedUrl": "https://..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 9,
    "totalItems": 254,
    "itemsPerPage": 30,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### GET /api/gallery-item

Returns a single gallery item by slug.

**Query Parameters:**
- `slug` (string, required) - Item slug

**Response:**
```json
{
  "slug": "panels-gallery-zudo-blocks-141",
  "imageAlt": "",
  "blurhash": "UFFNxM^d=D~9:kJ...",
  "thumbnailUrl": "https://...",
  "enlargedUrl": "https://..."
}
```

---
title: Environment Variables
sidebar_position: 2
---

# Environment Variables

This document describes the environment variables used in the MSW Tryout project for local development and CI/CD processes.

## Overview

Environment variables are used to configure external service integrations and deployment settings. These variables are stored in `.env` files locally and as secrets in GitHub Actions for CI/CD workflows.

## File Structure

```
.env              # Local environment variables (gitignored)
.env.example      # Template showing required variables
```

## Required Variables

### Netlify Configuration

These variables are required for Netlify deployment and log fetching operations.

#### `NETLIFY_AUTH_TOKEN`

- **Purpose**: Authenticates with Netlify API for deploy operations and log retrieval
- **Where to get it**:
  1. Go to [Netlify User Settings → Applications → Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
  2. Click "New access token"
  3. Give it a descriptive name (e.g., "MSW Tryout Local Dev")
  4. Copy the generated token
- **Permissions needed**: Read access to deploys
- **Example**: `nfp_ABC123...` (actual tokens are much longer)

#### `NETLIFY_SITE_ID`

- **Purpose**: Identifies which Netlify site to interact with
- **Where to get it**:
  1. Go to your site in Netlify
  2. Navigate to Site Settings → General
  3. Find "Site information" section
  4. Copy the "Site ID" value
- **Example**: `22892467-c353-4c07-ba09-bb06c65c0dc3`

## Setup Instructions

### Local Development Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values**:
   ```bash
   # Open in your editor
   vim .env  # or nano, code, etc.
   ```

3. **Add your credentials**:
   ```env
   NETLIFY_AUTH_TOKEN=your_actual_token_here
   NETLIFY_SITE_ID=your_actual_site_id_here
   ```

4. **Verify it's gitignored**:
   ```bash
   git status  # .env should not appear
   ```

### Git Worktree Setup

If you're using git worktrees, use the `init-worktree` script to symlink environment files:

```bash
# From the project root
pnpm run init-worktree <worktree-name>
```

This creates symbolic links from the worktree to the root `.env` file, ensuring all worktrees share the same environment configuration.

### GitHub Actions Setup

For automated workflows (like Netlify error logging to PRs), add these as repository secrets:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each variable:
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: Your Netlify personal access token
   - Name: `NETLIFY_SITE_ID`
   - Value: Your Netlify site ID

## Usage Examples

### Using in Shell Scripts

The `fetch-netlify-logs.sh` script automatically loads variables from `.env`:

```bash
#!/bin/bash

# Load .env file if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Use the variables
curl -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys"
```

### Using in GitHub Actions

Reference secrets in workflow files:

```yaml
- name: Fetch Netlify Logs
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
  run: ./scripts/fetch-netlify-logs.sh
```

## Security Best Practices

### ✅ DO

- **Keep `.env` gitignored**: Never commit actual credentials
- **Use `.env.example`**: Maintain a template without real values
- **Rotate tokens periodically**: Update tokens every few months
- **Use minimal permissions**: Request only required access levels
- **Use repository secrets**: Store secrets securely in GitHub Settings

### ❌ DON'T

- **Never commit `.env`**: Check `.gitignore` includes `.env`
- **Don't share tokens**: Each developer should use their own
- **Don't hardcode values**: Always use environment variables
- **Don't expose in logs**: Be careful with script output
- **Don't use production tokens locally**: Use separate dev tokens when possible

## Troubleshooting

### Error: Environment variable not set

**Symptom**: Script fails with "Error: NETLIFY_AUTH_TOKEN is not set"

**Solutions**:
1. Verify `.env` file exists in project root
2. Check variable names match exactly (case-sensitive)
3. Ensure no spaces around `=` in `.env` file
4. Verify `.env` is properly formatted:
   ```env
   NETLIFY_AUTH_TOKEN=value    ✅ Correct
   NETLIFY_AUTH_TOKEN = value  ❌ Wrong (spaces)
   ```

### Error: Could not fetch deploy information

**Symptom**: Netlify API returns "Unauthorized" or "Not Found"

**Solutions**:
1. Verify `NETLIFY_AUTH_TOKEN` is valid and not expired
2. Check token has correct permissions
3. Confirm `NETLIFY_SITE_ID` matches your actual site
4. Test token with curl:
   ```bash
   curl -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
     https://api.netlify.com/api/v1/sites
   ```

### Worktree doesn't have .env

**Symptom**: Environment variables not available in git worktree

**Solution**: Run the init-worktree script:
```bash
pnpm run init-worktree <worktree-name>
```

## Related Documentation

- [Netlify API Documentation](https://docs.netlify.com/api/get-started/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Git Worktrees Setup](../../scripts/README.md)

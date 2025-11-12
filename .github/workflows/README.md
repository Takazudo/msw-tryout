# GitHub Actions Workflows

This directory contains automated workflows for the MSW Tryout project.

## Workflows

### netlify-deploy-status.yml

Automatically posts Netlify deployment status and logs to Pull Requests.

**Triggers:**
- `deployment_status` - When Netlify deployment completes

**Features:**
- ✅ Posts success message with preview URL when deploy succeeds
- ❌ Posts failure message with error logs when deploy fails
- 📜 Fetches and includes full deploy logs for failed deployments
- 🔍 Automatically finds the associated PR by commit SHA

**Required Secrets:**
- `NETLIFY_AUTH_TOKEN` - Netlify Personal Access Token (for API access)
- `NETLIFY_SITE_ID` - Netlify Site ID

**Setup Instructions:**

1. **Get Netlify Personal Access Token:**
   - Go to [Netlify User Settings → Applications → Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
   - Click "New access token"
   - Give it a descriptive name (e.g., "GitHub Actions - Deploy Status")
   - Copy the generated token

2. **Get Netlify Site ID:**
   - Go to your Netlify site dashboard
   - Navigate to Site Settings → General
   - Find "Site information" section
   - Copy the "Site ID"

3. **Add Secrets to GitHub:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add:
     - Name: `NETLIFY_AUTH_TOKEN`, Value: Your token from step 1
     - Name: `NETLIFY_SITE_ID`, Value: Your site ID from step 2

4. **Configure Netlify GitHub Integration:**
   - In Netlify, go to Site Settings → Build & deploy → Deploy notifications
   - Ensure "GitHub commit statuses" is enabled
   - This allows Netlify to send `deployment_status` events to GitHub

**How It Works:**

1. Netlify completes a deployment (success or failure)
2. Netlify sends a `deployment_status` event to GitHub
3. This workflow is triggered
4. Workflow fetches deploy details and logs from Netlify API
5. Workflow finds the associated PR by commit SHA
6. Workflow posts a formatted comment to the PR with:
   - Deploy status (success/failure)
   - Preview URL
   - Deploy logs (if failed)

**Example Comments:**

**Success:**
```
🤖 Post by Claude Code

---

## ✅ Netlify Deploy Succeeded

**Deploy URL**: https://deploy-preview-15--your-site.netlify.app
**Commit**: `abc1234`
**Status**: Ready

Your preview is now available!
```

**Failure:**
```
🤖 Post by Claude Code

---

## ❌ Netlify Deploy Failed

**Deploy URL**: https://deploy-preview-15--your-site.netlify.app
**Commit**: `abc1234`
**Status**: Failed

<details>
<summary>📜 Deploy Logs</summary>

```
[Full deploy logs here...]
```
</details>

Please check the logs above for error details.
```

### Other Workflows

#### pr-checks.yml
Runs quality checks and E2E tests on pull requests:
- Type checking
- Linting
- Format checking
- Build verification
- E2E tests with MSW

#### main-checks.yml
Runs checks when code is merged to main branch.

#### claude-code-review.yml
Automated code review using Claude AI.

#### claude.yml
Claude PR Assistant for automated PR analysis.

#### deploy-docs.yml
Deploys Docusaurus documentation to GitHub Pages.

## Related Documentation

- [Environment Variables](../../doc/docs/misc/environment-variables.md)
- [Netlify API Documentation](https://docs.netlify.com/api/get-started/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

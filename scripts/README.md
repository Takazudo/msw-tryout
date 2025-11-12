# Scripts

## fetch-netlify-logs.sh

Fetches the latest Netlify deploy log for the configured site.

### Requirements

- `curl` - HTTP client
- `jq` - JSON processor (install: `brew install jq` on macOS)

### Setup for Local Testing

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   - **NETLIFY_AUTH_TOKEN**: Get from [Netlify User Settings → Applications → Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
   - **NETLIFY_SITE_ID**: Get from Netlify Site Settings → General → Site information → Site ID

### Usage

```bash
# From the project root
./scripts/fetch-netlify-logs.sh
```

### Output

The script will display:
- Deploy ID
- Deploy state (e.g., `ready`, `building`, `error`)
- Deploy URL
- Commit reference
- Full deploy log

### Example Output

```
📁 Loading environment variables from .env...
🔍 Fetching latest deploy for site: abc123def456
📦 Deploy ID: 507f1f77bcf86cd799439011
📊 State: ready
🌐 URL: https://deploy-preview-15--your-site.netlify.app
🔖 Commit: netlify-error-logging

==========================================
DEPLOY LOG
==========================================
[deploy log content here]
==========================================
✅ Log fetched successfully
```

### Troubleshooting

**Error: jq command not found**
```bash
brew install jq
```

**Error: NETLIFY_AUTH_TOKEN is not set**
- Make sure you created `.env` from `.env.example`
- Verify the token is correctly set in `.env`

**Error: Could not fetch deploy information**
- Check that NETLIFY_SITE_ID is correct
- Verify your auth token has read permissions

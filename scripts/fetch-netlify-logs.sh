#!/bin/bash

# Netlify Deploy Log Fetcher
# Fetches the latest deploy log from Netlify API
# Requires: NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID

set -e

# Load .env file if it exists (for local testing)
if [ -f .env ]; then
  echo "📁 Loading environment variables from .env..."
  set -a
  source .env
  set +a
elif [ -f .env.local ]; then
  echo "📁 Loading environment variables from .env.local..."
  set -a
  source .env.local
  set +a
else
  echo "ℹ️  No .env file found, using environment variables..."
fi

# Validate required environment variables
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  echo "❌ Error: NETLIFY_AUTH_TOKEN is not set"
  exit 1
fi

if [ -z "$NETLIFY_SITE_ID" ]; then
  echo "❌ Error: NETLIFY_SITE_ID is not set"
  exit 1
fi

echo "🔍 Fetching latest deploy for site: $NETLIFY_SITE_ID"

# Fetch latest deploy
LATEST_DEPLOY=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys?per_page=1")

# Extract deploy ID and state
DEPLOY_ID=$(echo "$LATEST_DEPLOY" | jq -r '.[0].id')
DEPLOY_STATE=$(echo "$LATEST_DEPLOY" | jq -r '.[0].state')
DEPLOY_URL=$(echo "$LATEST_DEPLOY" | jq -r '.[0].deploy_ssl_url')
COMMIT_REF=$(echo "$LATEST_DEPLOY" | jq -r '.[0].commit_ref // "N/A"')

if [ -z "$DEPLOY_ID" ] || [ "$DEPLOY_ID" == "null" ]; then
  echo "❌ Error: Could not fetch deploy information"
  exit 1
fi

echo "📦 Deploy ID: $DEPLOY_ID"
echo "📊 State: $DEPLOY_STATE"
echo "🌐 URL: $DEPLOY_URL"
echo "🔖 Commit: $COMMIT_REF"
echo ""

# Fetch deploy log
echo "📜 Fetching deploy log..."
echo ""

LOG_RESPONSE=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/deploys/$DEPLOY_ID/log")

# Check if log is available
if [ "$LOG_RESPONSE" == "null" ] || [ -z "$LOG_RESPONSE" ]; then
  echo "⚠️  Warning: No log available for this deploy"
  exit 0
fi

# Pretty print the log
echo "=========================================="
echo "DEPLOY LOG"
echo "=========================================="
echo "$LOG_RESPONSE"
echo ""
echo "=========================================="
echo "✅ Log fetched successfully"

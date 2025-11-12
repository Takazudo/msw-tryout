#!/bin/bash
# CI-specific script to start Netlify Dev without multi-project detection

set -e

# Trap to ensure cleanup happens
cleanup() {
  echo "Restoring doc/package.json..."
  if [ -f doc/package.json.bak ]; then
    mv doc/package.json.bak doc/package.json
  fi
}
trap cleanup EXIT INT TERM

# Temporarily hide doc/package.json to avoid multi-project detection
if [ -f doc/package.json ]; then
  echo "Hiding doc/package.json to avoid multi-project detection..."
  mv doc/package.json doc/package.json.bak
fi

# Start Netlify Dev
echo "Starting Netlify Dev..."
pnpm exec netlify dev

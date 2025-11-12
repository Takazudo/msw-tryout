#!/bin/bash
# CI-specific script to start Netlify Dev without multi-project detection

# Temporarily hide doc/package.json to avoid multi-project detection
if [ -f doc/package.json ]; then
  mv doc/package.json doc/package.json.bak
fi

# Start Netlify Dev
pnpm exec netlify dev --offline

# Restore doc/package.json on exit
if [ -f doc/package.json.bak ]; then
  mv doc/package.json.bak doc/package.json
fi

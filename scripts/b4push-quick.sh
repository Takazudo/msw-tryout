#!/bin/bash
set -e

echo "======================================"
echo "⚡ Running quick pre-push checks"
echo "======================================"
echo

# Change to app directory for all subsequent commands
cd app

# Step 1: Run code quality checks
echo "✨ Running code quality checks..."
pnpm run check
echo "✅ Code quality checks passed"
echo

# Step 2: Build check
echo "🔨 Testing build..."
pnpm run build
echo "✅ Build succeeded"
echo

echo "======================================"
echo "✅ Quick checks passed!"
echo "======================================"
echo "Run 'pnpm run b4push:full' for complete tests including smoke tests"


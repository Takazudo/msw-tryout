#!/bin/bash
set -e

echo "======================================"
echo "🔧 Running complete pre-push checks"
echo "======================================"
echo

# Change to app directory for all subsequent commands
cd app

# Step 1: Run code quality checks
echo "✨ Running code quality checks..."
npm run check
echo "✅ Code quality checks passed"
echo

# Step 2: Build the project
echo "🔨 Building project..."
npm run build
echo "✅ Project built successfully"
echo

# Step 3: Run smoke tests with Netlify Dev
echo "🎭 Running smoke tests..."
echo
npm run test:smoke

TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
  echo
  echo "======================================"
  echo "✅ All pre-push checks passed!"
  echo "======================================"
  echo
  echo "You can now push your changes with confidence!"
  exit 0
else
  echo
  echo "======================================"
  echo "❌ Tests failed"
  echo "======================================"
  echo "Please fix the issues before pushing."
  exit 1
fi

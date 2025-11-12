#!/bin/bash

echo "======================================"
echo "🚀 Starting all development servers"
echo "======================================"
echo

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to cleanup on exit
cleanup() {
  echo
  echo "======================================"
  echo "🛑 Stopping all development servers"
  echo "======================================"
  pkill -P $$
  exit
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Start servers
echo "📦 Starting Next.js app server (port 3200)..."
(cd "$ROOT_DIR/app" && pnpm run dev) &
APP_PID=$!

echo "📚 Starting Docusaurus docs server (port 3000)..."
(cd "$ROOT_DIR/doc" && pnpm start) &
DOC_PID=$!

echo "🔌 Starting Netlify Dev API server (port 8888)..."
(cd "$ROOT_DIR" && pnpm run dev:api) &
API_PID=$!

echo
echo "======================================"
echo "✅ All servers started!"
echo "======================================"
echo "  • Next.js app:  http://localhost:3200"
echo "  • Docusaurus:   http://localhost:3000"
echo "  • Netlify Dev:  http://localhost:8888"
echo
echo "Press Ctrl+C to stop all servers"
echo "======================================"

# Wait for all background processes
wait

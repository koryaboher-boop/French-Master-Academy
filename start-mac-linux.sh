#!/bin/bash
# French Master Academy — static app starter (macOS / Linux)
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "  French Master Academy — Static App"
echo "=========================================="

if command -v node >/dev/null 2>&1; then
  echo "-- starting local server (Node found)..."
  node server.js
else
  echo "-- Node.js not found: opening index.html directly in your browser."
  echo "   (The app works fully this way! Node is only needed for Wi-Fi/hotspot sharing.)"
  URL="file://$(pwd)/index.html"
  if command -v open >/dev/null 2>&1; then open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
  else echo "   Open this file manually: $(pwd)/index.html"
  fi
fi

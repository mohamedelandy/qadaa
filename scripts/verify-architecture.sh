#!/bin/bash
# Import-boundary rules live in eslint.config.mts (`import/no-restricted-paths`)
# and run via `npm run lint` — that is the single source of truth.
# This script covers what ESLint cannot: suppression comments in shipped code,
# including native Kotlin/Swift sources.
set -euo pipefail
SUPPRESSIONS=$(grep -rnE "eslint-disable|@ts-(ignore|expect-error|nocheck)|istanbul ignore|biome-ignore" \
  src app modules plugins targets --include="*.ts" --include="*.tsx" --include="*.kt" --include="*.swift" 2>/dev/null || true)
if [ -n "$SUPPRESSIONS" ]; then
  echo "❌ Suppression comments found (fix the underlying issue instead):"
  echo "$SUPPRESSIONS"
  exit 1
fi
echo "✅ Architecture checks passed"

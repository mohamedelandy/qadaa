#!/bin/bash
set -euo pipefail

AR_FILE="src/data/i18n/langs/ar.json"
EN_FILE="src/data/i18n/langs/en.json"

if [ ! -f "$AR_FILE" ] || [ ! -f "$EN_FILE" ]; then
  echo "❌ Locale files not found"
  echo "  Expected: $AR_FILE and $EN_FILE"
  exit 1
fi

echo "🔍 Checking translation files..."

# Extract keys from both files (sorted for comm)
AR_KEYS=$(grep -o '"[^"]*"[[:space:]]*:' "$AR_FILE" | sed 's/[[:space:]]*:$//' | sort)
EN_KEYS=$(grep -o '"[^"]*"[[:space:]]*:' "$EN_FILE" | sed 's/[[:space:]]*:$//' | sort)

# Check for missing keys
MISSING_IN_EN=$(comm -23 <(echo "$AR_KEYS") <(echo "$EN_KEYS"))
MISSING_IN_AR=$(comm -23 <(echo "$EN_KEYS") <(echo "$AR_KEYS"))

ERRORS=0

if [ -n "$MISSING_IN_EN" ]; then
  echo "❌ Keys missing in en.json:"
  echo "$MISSING_IN_EN"
  ERRORS=$((ERRORS + 1))
fi

if [ -n "$MISSING_IN_AR" ]; then
  echo "❌ Keys missing in ar.json:"
  echo "$MISSING_IN_AR"
  ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -eq 0 ]; then
  echo "✅ Translation files are in sync"
  exit 0
else
  echo "❌ $ERRORS translation issues found"
  exit 1
fi

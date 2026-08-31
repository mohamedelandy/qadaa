#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FLOW="${1:-.maestro/showcase.yaml}"
OUTPUT_DIR="${ROOT_DIR}/recordings"
OUTPUT_FILE="${OUTPUT_DIR}/qadaa-showcase.mp4"

cd "${ROOT_DIR}"

if ! command -v maestro >/dev/null 2>&1; then
  echo "Error: Maestro is not installed or not available on PATH." >&2
  exit 1
fi

if [[ ! -f "${FLOW}" ]]; then
  echo "Error: Maestro flow not found: ${FLOW}" >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"
rm -f "${OUTPUT_FILE}"

echo "Recording ${FLOW} with Maestro's local renderer..."
maestro record --local "${FLOW}"

if [[ -f "maestro-recorded.mp4" ]]; then
  mv "maestro-recorded.mp4" "${OUTPUT_FILE}"
elif [[ ! -f "${OUTPUT_FILE}" ]]; then
  echo "Error: Maestro finished without creating maestro-recorded.mp4." >&2
  echo "Search for generated recordings with: find . \"$HOME/.maestro\" -type f \\( -name '*.mp4' -o -name '*.mov' \\) -print" >&2
  exit 1
fi

echo "Recording saved to: ${OUTPUT_FILE}"
ls -lh "${OUTPUT_FILE}"

#!/bin/bash
# Regenerates the flow inventory table in .maestro/README.md from the flow
# files (Flow/Suite/Covers headers) and the actual suite wiring (suites/*.yaml).
#   generate-maestro-inventory.sh        → regenerate the table in place
#   generate-maestro-inventory.sh --check → exit 1 if the README table is stale
# Runs prettier on the README so `format:check` stays green.
set -euo pipefail

MODE="${1:-generate}"
README=".maestro/README.md"

python3 - "$MODE" "$README" << 'PYEOF'
import glob
import os
import re
import sys

mode, readme_path = sys.argv[1], sys.argv[2]

KEYS = ("Flow", "Suite", "Covers", "Prerequisites", "clearState", "Note")

# ------------------------------------------------------------- parse flows
def parse_flow(path):
    """Extract id/title/suite/covers from a flow file's header comments."""
    comments = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            s = line.strip()
            if s.startswith("#"):
                comments.append(s[1:].strip())
            elif s:
                break  # reached appId: / steps
    info = {"id": os.path.basename(path), "title": "", "suite": "—", "covers": ""}
    covers_lines = []
    in_covers = False
    for c in comments:
        m = re.match(r"Flow:\s*(\S+)\s*-\s*(.+?)\s*$", c)
        if m:
            info["id"] = m.group(1)
            info["title"] = m.group(2)
            in_covers = False
            continue
        m = re.match(r"Suite:\s*(.+?)\s*$", c)
        if m:
            info["suite"] = m.group(1)
            in_covers = False
            continue
        m = re.match(r"Covers:\s*(.*)$", c)
        if m:
            covers_lines = [m.group(1).strip()]
            in_covers = True
            continue
        if in_covers and not re.match(r"^(?:%s):" % "|".join(KEYS), c):
            covers_lines.append(c)
            continue
        in_covers = False
    info["covers"] = " ".join(x for x in covers_lines if x).strip()
    return info


flows = {}
for path in sorted(glob.glob(os.path.join(".maestro", "flows", "*.yaml"))):
    flows[os.path.basename(path)] = parse_flow(path)

# ----------------------------------------------- actual suite wiring (truth)
wired = {fname: [] for fname in flows}
for path in sorted(glob.glob(os.path.join(".maestro", "suites", "*.yaml"))):
    suite_name = os.path.basename(path)[: -len(".yaml")]
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = re.match(r"\s*-\s*runFlow:\s*\.\./flows/([\w-]+\.yaml)", line)
            if m and m.group(1) in wired:
                wired[m.group(1)].append(suite_name)

# ---------------------------------------------------------------- build rows
def sort_key(name):
    m = re.match(r"^(\d+)", name)
    return (0, int(m.group(1))) if m else (1, 0)


rows = []
for fname in sorted(flows, key=sort_key):
    h = flows[fname]
    suite = ", ".join(wired[fname]) if wired[fname] else h["suite"]
    covers = h["covers"]
    if len(covers) > 100:
        covers = covers[:99].rstrip() + "…"
    rows.append((h["id"], suite, h["title"], covers))

headers = ["Flow", "Suite", "Title", "Covers"]
col_w = [
    max(len(headers[i]), max(len(r[i]) for r in rows)) for i in range(len(headers))
]


def row(cells):
    return "| " + " | ".join(cells[i].ljust(col_w[i]) for i in range(len(cells))) + " |"


table_md = "\n".join(
    [row(headers), "|" + "|".join("-" * (w + 2) for w in col_w) + "|"]
    + [row(list(r)) for r in rows]
)

# ---------------------------------------------------------------- splice README
start_marker = "<!-- FLOW-INVENTORY:START -->"
end_marker = "<!-- FLOW-INVENTORY:END -->"
with open(readme_path, encoding="utf-8") as fh:
    readme = fh.read()
if start_marker not in readme or end_marker not in readme:
    print(
        f"❌ {readme_path} is missing the inventory markers "
        f"({start_marker} / {end_marker})"
    )
    sys.exit(1)
section = start_marker + "\n" + table_md + "\n" + end_marker
new_readme = re.sub(
    re.escape(start_marker) + r".*?" + re.escape(end_marker),
    section.replace("\\", "\\\\"),
    readme,
    flags=re.DOTALL,
)

# -------------------------------------------------------- write / check mode
import subprocess

if mode == "--check":
    import tempfile

    with tempfile.NamedTemporaryFile(
        "w", suffix=".md", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(new_readme)
        tmp_name = tmp.name
    subprocess.run(
        ["npx", "prettier", "--write", "--ignore-path", ".prettierignore", tmp_name],
        check=True,
        capture_output=True,
    )
    with open(tmp_name, encoding="utf-8") as fh:
        normalized = fh.read()
    os.unlink(tmp_name)
    with open(readme_path, encoding="utf-8") as fh:
        current = fh.read()
    if normalized != current:
        print("❌ .maestro/README.md flow inventory is stale")
        print("   Run: npm run maestro:inventory")
        sys.exit(1)
    print("✅ Maestro flow inventory is up to date")
else:
    with open(readme_path, "w", encoding="utf-8") as fh:
        fh.write(new_readme)
    subprocess.run(
        ["npx", "prettier", "--write", "--ignore-path", ".prettierignore", readme_path],
        check=True,
        capture_output=True,
    )
    print(f"✅ Regenerated flow inventory in {readme_path}")
PYEOF

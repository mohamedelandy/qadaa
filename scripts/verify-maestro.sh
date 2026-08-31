#!/bin/bash
# Verifies Maestro E2E suite integrity without a device or emulator:
#   1. Every .maestro YAML file parses (Maestro flows are multi-document YAML)
#   2. Every testID referenced by flows/utils exists in the app source,
#      either as a static testID or as a template-generated one (e.g. `dashboard-${prayerKey}-row`)
#   3. No Arabic `text:` selectors (README rule — language toggle breaks them)
#   4. Suite wiring: every runFlow in a suite resolves to an existing file,
#      and every runnable flow file is covered by at least one suite
#   5. No mojibake (U+FFFD replacement chars) anywhere in .maestro
#   6. README discipline rules: launchApp XOR runFlow-of-02 (no double launch),
#      waitForAnimationToEnd after launchApp, retryTapIfNoChange on tab taps,
#      and sequential flow numbering
set -euo pipefail

if ! python3 -c "import yaml" 2>/dev/null; then
  echo "❌ PyYAML is required (python3 -c 'import yaml')"
  exit 1
fi

python3 - << 'PYEOF'
import glob
import os
import re
import sys

ROOT = os.getcwd()
MAESTRO_DIR = os.path.join(ROOT, ".maestro")
SRC_DIRS = ["src", "app"]

errors = []


def fail(msg):
    errors.append(msg)


def load_steps(path):
    """Maestro files are two-document YAML: appId header, then the step list."""
    with open(path, encoding="utf-8") as fh:
        docs = list(__import__("yaml").safe_load_all(fh))
    if not docs:
        return []
    steps = docs[1] if len(docs) > 1 else docs[0]
    return steps if isinstance(steps, list) else []


def walk_ids(node, out):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "id" and isinstance(v, str):
                out.add(v)
            else:
                walk_ids(v, out)
    elif isinstance(node, list):
        for item in node:
            walk_ids(item, out)


# ---------------------------------------------------------------- 1. YAML validity
flow_files = sorted(glob.glob(os.path.join(MAESTRO_DIR, "**", "*.yaml"), recursive=True))
for path in flow_files:
    rel = os.path.relpath(path, ROOT)
    try:
        load_steps(path)
    except Exception as exc:  # noqa: BLE001 - report all files, not just the first
        fail(f"{rel}: invalid YAML: {exc}")

# ------------------------------------------------- 2. testID references exist in source
referenced = set()
for path in flow_files:
    walk_ids(load_steps(path), referenced)

# Static testIDs: testID="..." / testID='...' / testID={`...`}
# Template testIDs: testID={`...${...}...`} -> regex patterns
static_ids = set()
template_patterns = []
for src_dir in SRC_DIRS:
    for root, _, files in os.walk(src_dir):
        for fn in files:
            if not fn.endswith((".ts", ".tsx")):
                continue
            src = open(os.path.join(root, fn), encoding="utf-8").read()
            for m in re.finditer(r"testID=", src):
                i = m.end()
                if i < len(src) and src[i] == "{":
                    # Braced JSX expression: grab up to the matching close brace,
                    # then pull every literal out of it (handles ternaries too,
                    # e.g. testID={isToday ? "a" : "b"}).
                    depth = 1
                    j = i + 1
                    while j < len(src) and depth > 0:
                        if src[j] == "{":
                            depth += 1
                        elif src[j] == "}":
                            depth -= 1
                        j += 1
                    expr = src[i + 1 : j - 1]
                else:
                    expr = src[i:]
                for lit in re.finditer(r"([`\"])(.*?)\1", expr):
                    raw = lit.group(2)
                    if "${" in raw:
                        # Template literal: strip whitespace inside ${...}, then build
                        # an anchored pattern from the static parts joined by wildcards
                        # (e.g. `dashboard-${prayerKey}-row` -> ^dashboard-.+-row$).
                        cleaned = re.sub(r"\s+", "", raw)
                        parts = re.split(r"\$\{[^}]*\}", cleaned)
                        pattern = "^" + ".+".join(re.escape(p) for p in parts) + "$"
                        template_patterns.append(pattern)
                    else:
                        static_ids.add(raw)

missing = []
for ref in sorted(referenced):
    if ref in static_ids:
        continue
    if any(re.match(p, ref) for p in template_patterns):
        continue
    missing.append(ref)
if missing:
    for ref in missing:
        fail(f"testID '{ref}' referenced by a flow but not found in app source")

# --------------------------------------- 3. No Arabic text/visible selectors (README rule)
arabic_re = re.compile(r"[\u0600-\u06FF]")
selector_re = re.compile(r"\b(?:text|visible|notVisible):\s*[\"']?([^\s\"']+)")
for path in flow_files:
    rel = os.path.relpath(path, ROOT)
    for ln, line in enumerate(open(path, encoding="utf-8"), 1):
        if line.strip().startswith("#"):
            continue  # comments may document Arabic strings
        m = selector_re.search(line)
        if m and arabic_re.search(m.group(1)):
            fail(f"{rel}:{ln}: Arabic '{m.group(0).split(':')[0]}:' selector — use id: instead")

# ------------------------------------------------------------ 4. Suite wiring
# Coverage applies to runnable flows (flows/*.yaml); config.yaml, suites/,
# and utils/ sub-flows are excluded by design.
suite_files = sorted(glob.glob(os.path.join(MAESTRO_DIR, "suites", "*.yaml")))
runnable = sorted(glob.glob(os.path.join(MAESTRO_DIR, "flows", "*.yaml")))
covered = set()
for path in suite_files:
    rel = os.path.relpath(path, ROOT)
    for step in load_steps(path):
        if not isinstance(step, dict) or "runFlow" not in step:
            continue
        target = os.path.normpath(os.path.join(os.path.dirname(path), step["runFlow"]))
        if not os.path.isfile(target):
            fail(f"{rel}: runFlow target missing: {step['runFlow']}")
        else:
            covered.add(os.path.realpath(target))

for path in runnable:
    if os.path.realpath(path) in covered:
        continue
    name = os.path.basename(path)
    if name.startswith("DEMO_"):
        continue  # standalone demo flow, run directly
    fail(f"{os.path.relpath(path, ROOT)}: not referenced by any suite")

# -------------------------------------- 5. No mojibake (U+FFFD) anywhere in .maestro
for path in flow_files:
    rel = os.path.relpath(path, ROOT)
    for ln, line in enumerate(open(path, encoding="utf-8"), 1):
        if "\ufffd" in line:
            fail(f"{rel}:{ln}: mojibake (replacement char U+FFFD) — fix the encoding")

# ---------------------------------- 6. README discipline rules (per-flow structure)
flow_steps = {}
for path in flow_files:
    if not path.startswith(os.path.join(MAESTRO_DIR, "flows", "")):
        continue  # only runnable flows; config/suites/utils are not flows
    name = os.path.basename(path)
    flow_steps[name] = load_steps(path)

for name, steps in sorted(flow_steps.items()):
    launches = [s for s in steps if isinstance(s, dict) and "launchApp" in s]
    # stopApp:false is a resume (documented for flow 14), not a cold launch.
    resumes = [
        s for s in launches
        if isinstance(s["launchApp"], dict) and s["launchApp"].get("stopApp") is False
    ]
    cold_launches = [s for s in launches if s not in resumes]
    runs_02 = any(
        isinstance(s, dict)
        and isinstance(s.get("runFlow"), str)
        and s["runFlow"].endswith("02_onboarding_skip.yaml")
        for s in steps
    )
    # README: composed flows must NOT have their own cold launch (double-launch);
    # standalone flows must own their cold launch via launchApp. A resume
    # (stopApp: false) is only meaningful on top of a prior cold start.
    if cold_launches and runs_02:
        fail(f"{name}: has both a cold launchApp and runFlow 02_onboarding_skip — double launch")
    if not cold_launches and not runs_02:
        fail(f"{name}: neither cold-launches the app nor runs 02_onboarding_skip — unknown start state")
    if resumes and not (cold_launches or runs_02):
        fail(f"{name}: resume launchApp (stopApp: false) without a prior cold start")
    # waitForAnimationToEnd right after launchApp (README animation rule).
    # Note: `- waitForAnimationToEnd` parses as a bare string step.
    def is_wait(step):
        return step == "waitForAnimationToEnd" or (
            isinstance(step, dict) and "waitForAnimationToEnd" in step
        )

    for i, s in enumerate(steps):
        if isinstance(s, dict) and "launchApp" in s:
            nxt = steps[i + 1] if i + 1 < len(steps) else None
            if not is_wait(nxt):
                fail(f"{name}: step {i + 2}: add waitForAnimationToEnd after launchApp")
    # Tab taps need retryTapIfNoChange so they survive remounts (language toggle).
    for i, s in enumerate(steps):
        if isinstance(s, dict) and isinstance(s.get("tapOn"), dict):
            t = s["tapOn"]
            tid = t.get("id", "")
            if isinstance(tid, str) and tid.startswith("tab-") and not t.get("retryTapIfNoChange"):
                fail(f"{name}: step {i + 1}: tapOn {tid} missing retryTapIfNoChange")

# Sequential flow numbering (00, 01, ...): flag gaps or duplicates.
numbers = []
for name in flow_steps:
    m = re.match(r"^(\d{2})_", name)
    if m:
        numbers.append(int(m.group(1)))
if numbers:
    dupes = sorted({n for n in numbers if numbers.count(n) > 1})
    if dupes:
        fail(f"duplicate flow numbers: {dupes}")
    expected = list(range(min(numbers), max(numbers) + 1))
    gaps = [n for n in expected if n not in numbers]
    if gaps:
        fail(f"flow numbering gaps: {gaps} (expected a contiguous {min(numbers):02d}-{max(numbers):02d})")

if errors:
    print("❌ Maestro suite integrity checks failed:")
    for e in errors:
        print(f"  • {e}")
    sys.exit(1)

print(
    f"✅ Maestro checks passed ({len(flow_files)} yaml files, "
    f"{len(referenced)} testIDs, {len(suite_files)} suites)"
)
PYEOF

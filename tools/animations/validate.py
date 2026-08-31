#!/usr/bin/env python3
"""Structural validation for generated Lottie animation assets."""
import json
import math
import os
import sys

HERE = os.path.dirname(__file__)
OUT_DIR = os.path.join(HERE, "..", "..", "assets", "animations")

EXPECTED_OP = {
    "cell-pop": 24, "sparkle-pop": 30, "checkmark-draw": 54, "confetti": 96,
    "progress-fill": 60, "shimmer": 54, "sparkles": 72, "star-burst": 42,
    "broken-robot": 66, "warning-pulse": 72,
    "lantern": 72, "glint-sweep": 60,
}
SIZE_CAP = 64 * 1024


class Fail(Exception):
    pass


def walk_props(obj):
    """Yield every dict that looks like an animated/static ks property."""
    if isinstance(obj, dict):
        if set(("a", "k")).issubset(obj.keys()):
            yield obj
        for v in obj.values():
            yield from walk_props(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from walk_props(v)


def check_no_bad_floats(obj, path="root"):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            raise Fail(f"non-finite float at {path}")
    elif isinstance(obj, dict):
        for k, v in obj.items():
            check_no_bad_floats(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check_no_bad_floats(v, f"{path}[{i}]")


def kf_times(prop):
    return [kf["t"] for kf in prop["k"]]


def validate(name):
    path = os.path.join(OUT_DIR, f"{name}.json")
    size = os.path.getsize(path)
    if size > SIZE_CAP:
        raise Fail(f"file {size / 1024:.1f}KB exceeds {SIZE_CAP // 1024}KB cap")
    d = json.load(open(path))
    check_no_bad_floats(d, name)

    for key in ("v", "fr", "ip", "op", "w", "h", "nm", "assets", "layers"):
        if key not in d:
            raise Fail(f"missing root key '{key}'")
    if d["fr"] != 30:
        raise Fail(f"fr={d['fr']}, expected 30")
    if d["w"] != 200 or d["h"] != 200:
        raise Fail("canvas must be 200x200")
    exp_op = EXPECTED_OP[name]
    if abs(d["op"] - exp_op) > max(6, exp_op * 0.2):
        raise Fail(f"op={d['op']} drifted too far from original {exp_op}")

    inds = [l["ind"] for l in d["layers"]]
    if len(inds) != len(set(inds)):
        raise Fail("duplicate layer indices")
    ind_set = set(inds)
    n_shapes = sum(len(l.get("shapes", [])) for l in d["layers"])

    for l in d["layers"]:
        if l["ty"] != 4:
            raise Fail(f"layer {l['nm']}: unexpected ty={l['ty']}")
        if not (l["ip"] <= l["op"] <= d["op"] + 1):
            raise Fail(f"layer {l['nm']}: bad ip/op span")
        if "parent" in l and l["parent"] not in ind_set:
            raise Fail(f"layer {l['nm']}: dangling parent {l['parent']}")
        # keyframe monotonicity + range
        for prop in walk_props(l.get("shapes", [])) :
            pass
        for key in ("o", "r", "p", "a", "s"):
            prop = l["ks"].get(key)
            if not isinstance(prop, dict) or prop.get("a") != 1:
                continue
            ts = kf_times(prop)
            if any(t2 <= t1 for t1, t2 in zip(ts, ts[1:])):
                raise Fail(f"layer {l['nm']}.{key}: non-monotonic keyframes {ts}")
            if ts[-1] > d["op"]:
                raise Fail(f"layer {l['nm']}.{key}: last keyframe past comp end")

    return {
        "layers": len(d["layers"]),
        "groups": n_shapes,
        "kb": size / 1024,
        "seconds": d["op"] / d["fr"],
    }


# --------------------------------------------------------- loop-seam rules --
def prop_ends(layer, key):
    prop = layer["ks"].get(key)
    if isinstance(prop, dict) and prop.get("a") == 1:
        return prop["k"][0]["s"], prop["k"][-1]["s"]
    return None


def _seam_equal(key, a, b):
    if a != b:
        if key == "r":  # full-turn rotation wraps seamlessly
            try:
                if (b[0] - a[0]) % 360 == 0:
                    return True
            except (TypeError, IndexError):
                pass
        return False
    return True


def check_loop_seams():
    problems = []
    d = json.load(open(os.path.join(OUT_DIR, "sparkles.json")))
    for l in d["layers"]:
        if l["nm"].startswith("rise"):
            continue  # risers covered by the dedicated move-while-invisible rule
        for key in ("o", "p", "s", "r"):
            ends = prop_ends(l, key)
            if ends and not _seam_equal(key, *ends):
                problems.append(f"sparkles:{l['nm']}.{key} seam {ends[0]} != {ends[1]}")

    d = json.load(open(os.path.join(OUT_DIR, "warning-pulse.json")))
    for nm in ("tri", "excl", "glowDisc"):
        l = next(x for x in d["layers"] if x["nm"] == nm)
        for key in ("o", "p", "s", "r"):
            ends = prop_ends(l, key)
            if ends and not _seam_equal(key, *ends):
                problems.append(f"warning-pulse:{nm}.{key} seam {ends[0]} != {ends[1]}")

    d = json.load(open(os.path.join(OUT_DIR, "shimmer.json")))
    for l in d["layers"]:
        p = l["ks"]["p"]
        xs = [kf["s"][0] for kf in p["k"]]
        if min(abs(xs[0]), abs(xs[-1])) < 175:
            problems.append(f"shimmer:{l['nm']} teleports on-screen ({xs[0]} -> {xs[-1]})")

    def check_drifters(fname, layer_prefixes):
        """Layers may drift across the loop boundary only while fully faded."""
        d = json.load(open(os.path.join(OUT_DIR, f"{fname}.json")))
        for l in d["layers"]:
            if not any(l["nm"].startswith(pre) for pre in layer_prefixes):
                continue
            o_ends = prop_ends(l, "o")
            p_ends = prop_ends(l, "p")
            if p_ends and p_ends[0] != p_ends[1]:
                if not (o_ends and o_ends[0][0] == 0 and o_ends[1][0] == 0):
                    problems.append(f"{fname}:{l['nm']} moves while visible at seam")

    d = json.load(open(os.path.join(OUT_DIR, "sparkles.json")))
    for l in d["layers"]:
        if l["nm"].startswith("rise"):
            continue  # risers covered by the dedicated move-while-invisible rule
        for key in ("o", "p", "s", "r"):
            ends = prop_ends(l, key)
            if ends and not _seam_equal(key, *ends):
                problems.append(f"sparkles:{l['nm']}.{key} seam {ends[0]} != {ends[1]}")
    check_drifters("sparkles", ("rise",))
    check_drifters("lantern", ("mote",))

    d = json.load(open(os.path.join(OUT_DIR, "progress-fill.json")))
    names = {l["nm"] for l in d["layers"]}
    # overlay-only contract: no opaque slabs that would cover the gradient bar
    for banned in ("track", "fill", "dot", "glint"):
        if banned in names:
            problems.append(f"progress-fill: overlay-only violation — layer '{banned}' present")
    streak = next((x for x in d["layers"] if x["nm"] == "streak"), None)
    if streak is None:
        problems.append("progress-fill: missing streak layer")
    else:
        xs = [kf["s"][0] for kf in streak["ks"]["p"]["k"]]
        if min(abs(xs[0]), abs(xs[-1])) < 175:
            problems.append(f"progress-fill: streak teleports on-screen ({xs[0]} -> {xs[-1]})")
    for nm in ("sp0", "sp1", "sp2"):
        l = next((x for x in d["layers"] if x["nm"] == nm), None)
        if l is not None:
            o = l["ks"]["o"]
            if o["k"][-1]["s"][0] != 0:
                problems.append(f"progress-fill:{nm} does not fade out for loop reset")

    # lantern + glint-sweep loop seams
    d = json.load(open(os.path.join(OUT_DIR, "lantern.json")))
    for l in d["layers"]:
        if l["nm"].startswith("mote"):
            continue  # drifters covered by check_drifters below
        for key in ("o", "p", "s", "r"):
            ends = prop_ends(l, key)
            if ends and not _seam_equal(key, *ends):
                problems.append(f"lantern:{l['nm']}.{key} seam {ends[0]} != {ends[1]}")

    d = json.load(open(os.path.join(OUT_DIR, "glint-sweep.json")))
    for l in d["layers"]:
        xs = [kf["s"][0] for kf in l["ks"]["p"]["k"]]
        if min(abs(xs[0]), abs(xs[-1])) < 175:
            problems.append(f"glint-sweep:{l['nm']} teleports on-screen ({xs[0]} -> {xs[-1]})")

    # draw-on trim paths exist where designed
    def has_trim(fname, layer_nm):
        d = json.load(open(os.path.join(OUT_DIR, f"{fname}.json")))
        l = next(x for x in d["layers"] if x["nm"] == layer_nm)
        found = []

        def find(o):
            if isinstance(o, dict):
                if o.get("ty") == "tm":
                    found.append(o)
                for v in o.values():
                    find(v)
            elif isinstance(o, list):
                for v in o:
                    find(v)

        find(l.get("shapes", []))
        return bool(found)

    for fname, ln in (("cell-pop", "chk"), ("checkmark-draw", "chk"),
                      ("checkmark-draw", "circ")):
        if not has_trim(fname, ln):
            problems.append(f"{fname}:{ln} missing trim-path draw-on")

    return problems


def validate_vendored(name):
    """Lighter checks for hand-placed assets from LottieFiles."""
    path = os.path.join(OUT_DIR, f"{name}.json")
    size = os.path.getsize(path)
    d = json.load(open(path))
    check_no_bad_floats(d, name)
    if d.get("fr") != 30:
        raise Fail(f"fr={d.get('fr')}, expected 30")
    for key in ("v", "ip", "op", "w", "h", "layers"):
        if key not in d:
            raise Fail(f"missing root key '{key}'")
    return {"layers": len(d["layers"]), "groups": sum(len(l.get("shapes", []) or []) for l in d["layers"]),
            "kb": size / 1024, "seconds": d["op"] / d["fr"]}


def main():
    failures = []
    print(f"{'animation':<18} {'layers':>6} {'grps':>5} {'KB':>6} {'sec':>5}")
    print("-" * 46)
    for name in EXPECTED_OP:
        try:
            r = validate(name)
            print(f"{name:<18} {r['layers']:>6} {r['groups']:>5} {r['kb']:>6.1f} "
                  f"{r['seconds']:>5.2f}")
        except Fail as e:
            failures.append(f"{name}: {e}")
            print(f"{name:<18} FAILED: {e}")

    # vendored asset: structural smoke check only (no regeneration contract)
    try:
        r = validate_vendored("journey-begins")
        print(f"{name + '*':<18} {r['layers']:>6} {r['groups']:>5} {r['kb']:>6.1f} "
              f"{r['seconds']:>5.2f}")
    except Fail as e:
        failures.append(f"journey-begins (vendored): {e}")

    seam_problems = check_loop_seams()
    failures += seam_problems

    print()
    if failures:
        print("VALIDATION FAILURES:")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("all checks passed")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate the 10 elegant Lottie animations for mobile/assets/animations.

Motion language: expo/back-out springs, damped settles, staggered particles,
trim-path draw-ons, layered glows, seamless loops. See
docs/superpowers/specs/2026-08-26-lottie-elegance-upgrade-design.md.
"""
import json
import math
import os

FR = 30
W = H = 200
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "animations")

# ---------------------------------------------------------------- palette ---
EM600 = (0.02, 0.588, 0.412)      # #059669
EM400 = (0.204, 0.827, 0.6)       # #34D399
MINT300 = (0.431, 0.902, 0.718)   # #6EE7B7
MINT200 = (0.655, 0.953, 0.816)   # #A7F3D0
GOLD400 = (0.984, 0.749, 0.141)   # #FBBF24
GOLD300 = (0.988, 0.827, 0.302)   # #FCD34D
AMBER500 = (0.961, 0.62, 0.043)   # #F59E0B
YELL100 = (0.996, 0.953, 0.78)    # #FEF3C7
SLATE600 = (0.176, 0.227, 0.302)  # #2D3A4D
SLATE500 = (0.392, 0.455, 0.545)
SLATE400 = (0.58, 0.639, 0.722)   # #94A3B8
SLATE300 = (0.796, 0.835, 0.882)  # #CBD5E1
NAVY = (0.059, 0.09, 0.165)
HEAD = (0.118, 0.161, 0.231)
EYEWHITE = (0.886, 0.91, 0.941)
RED500 = (0.937, 0.267, 0.267)    # #EF4444
WHITE = (1.0, 1.0, 1.0)

# ---------------------------------------------------------------- easing ----
# Lottie keyframe bezier == css cubic-bezier(o.x, o.y, i.x, i.y)
EASINGS = {
    "expoOut": ((0.16, 1.0), (0.3, 1.0)),
    "expoInOut": ((0.87, 0.0), (0.13, 1.0)),
    "backOut": ((0.34, 1.56), (0.64, 1.0)),
    "circOut": ((0.0, 0.55), (0.45, 1.0)),
    "inOutSine": ((0.37, 0.0), (0.63, 1.0)),
    "gravIn": ((0.55, 0.055), (0.675, 0.19)),  # accelerating fall
    "linear": ((0.0, 0.0), (1.0, 1.0)),
}


def _num(v):
    if isinstance(v, (list, tuple)):
        return [_num(x) for x in v]
    if isinstance(v, float):
        return round(v, 4)
    return v


def st(v):
    return {"a": 0, "k": _num(v)}


def A(dims, keys):
    """Animated property. keys = [(t, value, ease?), ...]; 'hold' for step keys."""
    kfs = []
    n = len(keys)
    for idx, k in enumerate(keys):
        t, val = k[0], k[1]
        ease = k[2] if len(k) > 2 else None
        s = _num(list(val) if isinstance(val, (tuple, list)) else [val])
        if idx == n - 1:
            kfs.append({"t": t, "s": s})
        elif ease == "hold":
            kfs.append({"t": t, "s": s, "h": 1})
        elif ease is None:
            raise ValueError(f"segment after t={t} needs an easing")
        else:
            (ox, oy), (ix, iy) = EASINGS[ease]
            kfs.append({
                "t": t, "s": s,
                "i": {"x": [ix] * dims, "y": [iy] * dims},
                "o": {"x": [ox] * dims, "y": [oy] * dims},
            })
    return {"a": 1, "k": kfs}


# ------------------------------------------------------------ shape parts ---
def TR_IDENT(p=(0, 0), r=0, o=100, s=(100, 100, 100)):
    return {"ty": "tr", "p": st(list(p)), "a": st([0, 0]), "s": st(list(s)),
            "r": st(r), "o": st(o), "sk": st(0), "sa": st(0)}


def G(nm, items, ident=None):
    out = {"ty": "gr", "nm": nm, "it": list(items)}
    out["it"].append(ident or TR_IDENT())
    return out


def off(shape_items, p):
    """Copy a primitive item list and reposition its first (geometry) item."""
    new_items = []
    for i, it in enumerate(shape_items):
        cp = json.loads(json.dumps(it))
        if i == 0:
            cp["p"] = st(list(p))
        new_items.append(cp)
    return new_items


def EL(size, color, op=100):
    return [{"ty": "el", "p": st([0, 0]), "s": st([size, size])},
            {"ty": "fl", "c": st(list(color) + [1.0]), "o": st(op)}]


def RING(size, color, width, op=100):
    return [{"ty": "el", "p": st([0, 0]), "s": st([size, size])},
            {"ty": "st", "c": st(list(color) + [1.0]), "o": st(op),
             "w": st(width), "lc": 2, "lj": 2}]


def RECT(w, h, rad, color, op=100):
    return [{"ty": "rc", "d": 1, "s": st([w, h]), "p": st([0, 0]), "r": st(rad)},
            {"ty": "fl", "c": st(list(color) + [1.0]), "o": st(op)}]


def STAR(pt, outer, inner, color, op=100):
    return [{"ty": "sr", "sy": 1, "d": 1, "pt": st(pt), "p": st([0, 0]), "r": st(0),
             "ir": st(inner), "is": st(0), "or": st(outer), "os": st(0)},
            {"ty": "fl", "c": st(list(color) + [1.0]), "o": st(op)}]


def STROKE_PATH(pts, color, width, closed=False):
    n = len(pts)
    return [{"ty": "sh",
             "ks": {"a": 0, "k": {"i": [[0, 0]] * n, "o": [[0, 0]] * n,
                                  "v": [list(p) for p in pts], "c": closed}}},
            {"ty": "st", "c": st(list(color) + [1.0]), "o": st(100),
             "w": st(width), "lc": 2, "lj": 2}]


def TRIM(s, e):
    return {"ty": "tm", "s": s, "e": e, "o": st(0), "m": 1}


# ------------------------------------------------------------- layer ctor ---
def L(ind, nm, shapes, op_total, p=(100, 100), a=(0, 0), o=100, r=0,
      s=(100, 100, 100), ip=0, parent=None):
    ks = {
        "o": o if isinstance(o, dict) else st(o),
        "r": r if isinstance(r, dict) else st(r),
        "p": p if isinstance(p, dict) else st(list(p)),
        "a": st(list(a)),
        "s": s if isinstance(s, dict) else st(_num(list(s))),
    }
    layer = {"ddd": 0, "ind": ind, "ty": 4, "nm": nm, "sr": 1, "ks": ks, "ao": 0,
             "shapes": shapes, "ip": ip, "op": op_total, "st": 0, "bm": 0}
    if parent is not None:
        layer["parent"] = parent
    return layer


def comp(nm, layers, op):
    return {"v": "5.7.4", "fr": FR, "ip": 0, "op": op, "w": W, "h": H, "nm": nm,
            "ddd": 0, "assets": [], "layers": layers}


# --------------------------------------------------------------- helpers ----
def burst_particles(start_ind, prefix, count, center, dist0, dist1, colors, sizes,
                    t0, t0_step, life, op_total, gravity=8.0, lift=6.0,
                    star_every=0, spin=180.0):
    """Radial particle burst: decel launch -> apex arc -> gravity tail."""
    layers = []
    for i in range(count):
        ang = (360.0 / count) * i + (i * 137.5 % 17 - 8)
        rad = math.radians(ang)
        dx, dy = math.cos(rad), math.sin(rad)
        ts = t0 + int(i * t0_step)
        ta = ts + max(4, int(life * 0.55))
        te = min(ts + life, op_total - 1)
        sx, sy = center[0] + dx * dist0, center[1] + dy * dist0
        ax_, ay = center[0] + dx * (dist0 + dist1) * 0.62, center[1] + dy * (dist0 + dist1) * 0.62 - lift
        ex, ey = center[0] + dx * (dist0 + dist1), center[1] + dy * (dist0 + dist1) + gravity
        col = colors[i % len(colors)]
        sz = sizes[i % len(sizes)]
        if star_every and (i % star_every) == (star_every - 1):
            items = STAR(4, sz, sz * 0.38, col)
        else:
            items = EL(sz, col)
        p = A(2, [(ts, (sx, sy), "expoOut"), (ta, (ax_, ay), "gravIn"), (te, (ex, ey))])
        o = A(1, [(ts, 0, "expoOut"), (min(ts + 2, ta), 100, "inOutSine"), (te, 0)])
        sc = A(3, [(ts, (100, 100, 100), "expoOut"), (te, (36, 36, 36))])
        rot = A(1, [(ts, -spin, "expoOut"), (te, spin)]) if star_every else 0
        layers.append(L(start_ind - i, f"{prefix}{i}", [G("pt", items)], op_total,
                        p=p, o=o, s=sc, r=rot))
    return layers


def glow_disc(ind, nm, size, color, op_total, center, peak, t0, bloom_t, fade_t,
              s0=62, s1=118, s2=132):
    o = A(1, [(t0, 0, "expoOut"), (bloom_t, peak, "inOutSine"), (fade_t, 0)])
    sc = A(3, [(t0, (s0, s0, s0), "expoOut"), (bloom_t, (s1, s1, s1), "inOutSine"),
               (fade_t + 4, (s2, s2, s2))])
    return L(ind, nm, [G("glow", EL(size, color))], op_total, p=center, o=o, s=sc)


# ============================================================ cell-pop ======
def build_cell_pop():
    OP = 24
    layers = []
    ind = 13

    chk_items = STROKE_PATH([(-9, 0), (-2, 8), (11, -8)], NAVY, 5)
    chk_items.append(TRIM(st(0), A(1, [(4, 0, "expoOut"), (11, 100)])))
    chk_sc = A(3, [(4, (55, 55, 55), "backOut"), (10, (110, 110, 110), "inOutSine"),
                   (13, (96, 96, 96), "inOutSine"), (16, (100, 100, 100))])
    chk_o = A(1, [(4, 0, "expoOut"), (6, 100)])
    layers.append(L(ind, "chk", [G("c", chk_items)], OP, o=chk_o, s=chk_sc)); ind -= 1

    layers += burst_particles(
        ind, "d", 6, (100, 100), dist0=22, dist1=34,
        colors=[EM400, MINT300, GOLD400, EM400, MINT300, GOLD300],
        sizes=[5, 4, 5, 4, 5, 4], t0=5, t0_step=0.8, life=15, op_total=OP,
        gravity=6, lift=7, star_every=3, spin=140)
    ind -= 6

    layers.append(glow_disc(ind, "glow", 64, MINT200, OP, (100, 100), 24, 4, 10, 19))
    ind -= 1

    for nm, sz, w0, delay in (("ring0", 48, 4.5, 0), ("ring1", 66, 3, 5)):
        sc = A(3, [(delay, (30, 30, 30), "circOut"), (delay + 13, (135, 135, 135))])
        o = A(1, [(delay, 72, "circOut"), (delay + 13, 0)])
        ring = RING(sz, MINT300, w0)
        ring[1]["w"] = A(1, [(delay, w0, "circOut"), (delay + 13, round(w0 * 0.35, 2))])
        layers.append(L(ind, nm, [G("r", ring)], OP, o=o, s=sc)); ind -= 1

    sq_sc = A(3, [(0, (0, 0, 0), "backOut"), (8, (112, 112, 112), "inOutSine"),
                  (11, (94, 94, 94), "inOutSine"), (14, (103, 103, 103), "inOutSine"),
                  (18, (100, 100, 100))])
    sq_o = A(1, [(0, 0, "expoOut"), (3, 100)])
    sq_r = A(1, [(0, -6, "backOut"), (14, 0)])
    layers.append(L(ind, "sq", [G("s", RECT(34, 34, 9, EM400))], OP, o=sq_o, s=sq_sc, r=sq_r))

    return comp("cell-pop", layers, OP)


# ============================================================ sparkle-pop ===
def build_sparkle_pop():
    OP = 30
    layers = []
    ind = 12

    star_sc = A(3, [
        (0, (0, 0, 0), "backOut"), (6, (126, 126, 126), "inOutSine"),
        (10, (92, 92, 92), "inOutSine"), (14, (107, 107, 107), "inOutSine"),
        (19, (100, 100, 100))])
    star_r = A(1, [(0, -24, "backOut"), (12, 0)])
    star_o = A(1, [(0, 0, "expoOut"), (3, 100)])
    layers.append(L(ind, "star", [G("st", STAR(4, 26, 9.9, GOLD300))], OP,
                    s=star_sc, r=star_r, o=star_o)); ind -= 1

    glow_o = A(1, [(1, 0, "expoOut"), (8, 30, "inOutSine"), (24, 0)])
    glow_sc = A(3, [(1, (40, 40, 40), "backOut"), (10, (150, 150, 150), "inOutSine"),
                    (26, (164, 164, 164))])
    layers.append(L(ind, "starGlow", [G("g", STAR(4, 26, 9.9, GOLD300))], OP,
                    s=glow_sc, o=glow_o)); ind -= 1

    for j, (sz, w0, col, delay) in enumerate(((96, 5, EM400, 2), (120, 3, MINT300, 6))):
        sc = A(3, [(delay, (24, 24, 24), "circOut"), (delay + 14, (128, 128, 128))])
        o = A(1, [(delay, 78, "circOut"), (delay + 14, 0)])
        ring = RING(sz, col, w0)
        ring[1]["w"] = A(1, [(delay, w0, "circOut"), (delay + 14, round(w0 * 0.3, 2))])
        layers.append(L(ind, f"ring{j}", [G("r", ring)], OP, o=o, s=sc)); ind -= 1

    layers += burst_particles(
        ind, "d", 5, (100, 100), dist0=18, dist1=46,
        colors=[EM400, AMBER500, GOLD400, MINT300, EM600],
        sizes=[6, 5, 6, 5, 5], t0=3, t0_step=1.4, life=17, op_total=OP,
        gravity=9, lift=8)
    return comp("sparkle-pop", layers, OP)


# ============================================================ checkmark ====
def build_checkmark_draw():
    OP = 54
    layers = []
    ind = 15

    cols = [GOLD400, EM400, GOLD300, MINT300, AMBER500, EM600, YELL100, GOLD400]
    kinds = ["dot", "star", "dot", "dot", "star", "dot", "star", "dot"]
    for i in range(8):
        ang = (360.0 / 8) * i + 12
        rad = math.radians(ang)
        dx, dy = math.cos(rad), math.sin(rad)
        t0 = 31 + ((i * 7) % 6)
        sx, sy = 100 + dx * 40, 100 + dy * 40
        mx, my = 100 + dx * 62, 100 + dy * 62 - 7
        ex, ey = 100 + dx * 76, 100 + dy * 76 + 10
        te = min(t0 + 15, OP - 1)
        p = A(2, [(t0, (sx, sy), "expoOut"), (t0 + 7, (mx, my), "gravIn"), (te, (ex, ey))])
        o = A(1, [(t0, 0, "expoOut"), (t0 + 2, 100, "inOutSine"), (te, 0)])
        sc = A(3, [(t0, (100, 100, 100), "expoOut"), (te, (40, 40, 40))])
        items = STAR(4, 6, 2.3, cols[i]) if kinds[i] == "star" else EL(6, cols[i])
        rot = A(1, [(t0, -200, "expoOut"), (te, 120)]) if kinds[i] == "star" else 0
        layers.append(L(ind, f"p{i}", [G("pp", items)], OP, p=p, o=o, s=sc, r=rot))
        ind -= 1

    gp_o = A(1, [(29, 0, "expoOut"), (36, 26, "inOutSine"), (48, 0)])
    gp_sc = A(3, [(29, (70, 70, 70), "expoOut"), (36, (120, 120, 120), "inOutSine"),
                  (52, (134, 134, 134))])
    layers.append(L(ind, "glowPulse", [G("gp", EL(150, MINT200))], OP, o=gp_o, s=gp_sc))
    ind -= 1

    arm1 = STROKE_PATH([(-16, 2), (-4, 15)], WHITE, 6)
    arm1.append(TRIM(st(0), A(1, [(18, 0, "expoOut"), (24, 100)])))
    arm2 = STROKE_PATH([(-4, 15), (20, -14)], WHITE, 6)
    arm2.append(TRIM(st(0), A(1, [(24, 0, "expoOut"), (33, 100)])))
    chk_sc = A(3, [(18, (70, 70, 70), "backOut"), (33, (100, 100, 100))])
    layers.append(L(ind, "chk", [G("a1", arm1), G("a2", arm2)], OP, s=chk_sc)); ind -= 1

    circ = RING(76, WHITE, 5, op=85)
    circ.append(TRIM(st(0), A(1, [(6, 0, "expoOut"), (16, 100)])))
    circ_rot = A(1, [(6, -90, "expoOut"), (16, 0)])
    layers.append(L(ind, "circ", [G("cr", circ)], OP, r=circ_rot)); ind -= 1

    disc_sc = A(3, [(0, (0, 0, 0), "backOut"), (3, (116, 84, 100), "inOutSine"),
                    (7, (94, 105, 100), "inOutSine"), (10, (104, 98, 100), "inOutSine"),
                    (14, (100, 100, 100))])
    disc_o = A(1, [(0, 0, "expoOut"), (2, 100)])
    layers.append(L(ind, "disc", [G("d", EL(104, EM600))], OP, s=disc_sc, o=disc_o))

    return comp("checkmark-draw", layers, OP)


# ============================================================ confetti ======
def build_confetti():
    OP = 96
    CX, CY = 100, 108
    layers = []
    ind = 19
    types = ["rect", "circle", "star"] * 6
    cols = [EM600, EM400, MINT300, GOLD400, AMBER500, SLATE300]
    n = 18
    for i in range(n):
        t_launch = (i * 12) % 13
        rise = 62 + (i % 5) * 9
        spread = 74 + (i % 4) * 8
        ang = (360.0 / n) * i + ((i * 53) % 13 - 6)
        rad = math.radians(ang)
        dx, dy = math.cos(rad), math.sin(rad)
        t_apex = 16 + (i % 5) * 3
        sway = (10 if i % 2 else -10) * (1 + (i % 3) * 0.3)
        fall = 78 + (i % 6) * 7
        t_fall_end = min(70 + (i % 6) * 3, OP - 2)
        t_fade = 74 + (i % 5) * 4
        ox, oy = CX + dx * 6, CY + dy * 6 - 10
        px, py = CX + dx * spread, CY + dy * spread * 0.72 - rise
        mx, my = px + sway, py + fall * 0.45
        ex, ey = px + sway * 1.6 + dx * 4, py + fall
        t_mid = t_apex + max(3, (t_fall_end - t_apex) // 2)

        p = A(2, [
            (t_launch, (ox, oy), "expoOut"),
            (t_apex, (px, py), "inOutSine"),
            (t_mid, (mx, my), "gravIn"),
            (t_fall_end, (ex, ey)),
        ])
        o = A(1, [
            (t_launch, 0, "expoOut"), (t_launch + 2, 100, "inOutSine"),
            (t_fade, 100, "inOutSine"), (min(t_fade + 8, OP - 1), 0),
        ])
        col, typ = cols[i % 6], types[i]
        if typ == "rect":
            body = RECT(15, 8.5, 2, col)
            rot_total = (420 if i % 2 else -380) + (i % 4) * 60
            sc = A(3, [
                (t_launch, (100, 100, 100), "inOutSine"),
                (t_apex, (-100, 100, 100), "inOutSine"),
                (t_fall_end, (100, 100, 100))])
        elif typ == "circle":
            body = EL(7, col)
            rot_total = 0
            sc = A(3, [(t_launch, (100, 100, 100), "inOutSine"),
                       (OP - 1, (82, 82, 82))])
        else:
            body = STAR(5, 9, 3.8, col)
            rot_total = 330 if i % 2 else -300
            sc = A(3, [(t_launch, (100, 100, 100), "inOutSine"),
                       (OP - 1, (70, 70, 70))])
        rot = A(1, [(t_launch, 0, "inOutSine"), (OP - 1, rot_total)]) if rot_total else 0
        layers.append(L(ind, f"pc{i}", [G("pc", body)], OP, p=p, o=o, r=rot, s=sc))
        ind -= 1

    ring_sc = A(3, [(0, (18, 18, 18), "circOut"), (14, (152, 152, 152))])
    ring_o = A(1, [(0, 88, "circOut"), (14, 0)])
    ring = RING(90, GOLD400, 3.5)
    ring[1]["w"] = A(1, [(0, 3.5, "circOut"), (14, 1)])
    layers.append(L(ind, "burstRing", [G("br", ring)], OP, o=ring_o, s=ring_sc))
    return comp("confetti", layers, OP)


# ============================================================ progress-fill =
def build_progress_fill():
    OP = 60
    BAR_Y = 100
    X0, X1 = 41.0, 159.0
    layers = []
    ind = 8

    spark_pos = [(66, 84), (136, 78), (158, 112)]
    for i, (sx, sy) in enumerate(spark_pos):
        t0 = 36 + i * 6
        te = min(t0 + 13, OP - 2)
        sc = A(3, [(t0, (0, 0, 0), "backOut"), (t0 + 5, (100, 100, 100), "inOutSine"),
                   (te, (0, 0, 0))])
        o = A(1, [(t0, 0, "expoOut"), (t0 + 4, 95, "inOutSine"), (te, 0)])
        rot = A(1, [(t0, -60, "inOutSine"), (te, 60)])
        layers.append(L(ind, f"sp{i}", [G("sp", STAR(4, 6.5, 2.5, YELL100))], OP,
                        p=(sx, sy), s=sc, o=o, r=rot)); ind -= 1

    glint_p = A(2, [(40, (X0 - 6, BAR_Y), "expoInOut"), (50, (X1 + 6, BAR_Y))])
    glint_o = A(1, [(40, 0, "expoOut"), (43, 55, "inOutSine"), (50, 0)])
    layers.append(L(ind, "glint", [G("gl", RECT(10, 22, 5, YELL100))], OP,
                    p=glint_p, o=glint_o, r=-20)); ind -= 1

    dot_p = A(2, [(10, (X0, BAR_Y), "expoInOut"), (34, (X1, BAR_Y - 4), "backOut"),
                  (40, (X1, BAR_Y))])
    dot_o = A(1, [(8, 0, "expoOut"), (10, 100, "inOutSine"), (52, 100, "inOutSine"),
                  (57, 0)])
    dot_sc = A(3, [(36, (100, 100, 100), "inOutSine"), (38, (118, 84, 100), "inOutSine"),
                   (42, (100, 100, 100))])
    layers.append(L(ind, "dot", [G("dt", EL(15, MINT300))], OP, p=dot_p, o=dot_o,
                    s=dot_sc)); ind -= 1

    fill_sc = A(3, [(10, (0, 100, 100), "expoInOut"), (34, (100, 100, 100))])
    fill_o = A(1, [(8, 0, "expoOut"), (10, 100, "inOutSine"), (52, 100, "inOutSine"),
                   (57, 0)])
    layers.append(L(ind, "fill", [G("f", RECT(118, 8, 4, EM400))], OP,
                    p=(X0 + 59, BAR_Y), a=(-59, 0), o=fill_o, s=fill_sc)); ind -= 1

    track_o = A(1, [(0, 0, "expoOut"), (5, 100)])
    layers.append(L(ind, "track", [G("t", RECT(124, 14, 7, SLATE600))], OP, o=track_o))

    return comp("progress-fill", layers, OP)


# ============================================================ shimmer ======
def build_shimmer():
    OP = 54
    ROT = -20
    specs = [(260, 80, 40, 14), (172, 66, 33, 26), (86, 48, 24, 42)]  # w,h,r,opacity

    def band_items(alpha):
        gs = []
        for bw, bh, br, opa in specs:
            gs.append(G(f"l{bw}", RECT(bw, bh, br, SLATE300, op=int(opa * alpha))))
        return gs

    layers = []
    ind = 2
    b_p = A(2, [(0, (-190, 100), "inOutSine"), (OP, (350, 100))])
    layers.append(L(ind, "bandB", band_items(0.6), OP, p=b_p, r=ROT)); ind -= 1
    a_p = A(2, [(0, (-262, 100), "inOutSine"), (27, (0, 100), "inOutSine"),
                (OP, (262, 100))])
    layers.append(L(ind, "bandA", band_items(1.0), OP, p=a_p, r=ROT))
    return comp("shimmer", layers, OP)


# ============================================================ sparkles ======
def build_sparkles():
    OP = 72
    layers = []
    ind = 11

    for i, (rx0, ry0, rx1, ry1) in enumerate(((88, 152, 80, 116), (142, 156, 148, 122))):
        o = A(1, [(0, 0, "inOutSine"), (18, 46, "inOutSine"), (54, 0, "inOutSine"),
                  (OP, 0)])
        p = A(2, [(0, (rx0, ry0), "inOutSine"), (OP, (rx1, ry1))])
        layers.append(L(ind, f"rise{i}", [G("rs", EL(3, MINT200))], OP, p=p, o=o))
        ind -= 1

    minor_pos = [(48, 120), (112, 48), (150, 60), (76, 160), (144, 148)]
    for i, (cx, cy) in enumerate(minor_pos):
        t0 = i * 12
        hi, lo = 100, 42
        sc_keys = [(0, (lo, lo, lo), "inOutSine")]
        o_keys = [(0, 28, "inOutSine")]
        if t0 > 0:
            sc_keys.append((t0, (lo, lo, lo), "inOutSine"))
            o_keys.append((t0, 28, "inOutSine"))
        sc_keys += [(t0 + 10, (hi, hi, hi), "inOutSine"),
                    (t0 + 20, (lo, lo, lo), "inOutSine"),
                    (OP, (lo, lo, lo))]
        o_keys += [(t0 + 8, 90, "inOutSine"), (t0 + 18, 28, "inOutSine"), (OP, 28)]
        sc = A(3, sc_keys)
        o = A(1, o_keys)
        layers.append(L(ind, f"c{i}", [G("c", EL(5 - (i % 2), MINT200))], OP,
                        p=(cx, cy), s=sc, o=o)); ind -= 1

    majors = [("m0", 70, 78, 22, MINT300, 1.0), ("m1", 128, 96, 17, GOLD300, -1.0),
              ("m2", 96, 132, 12, MINT300, 1.0)]
    for nm, cx, cy, sz, col, ph in majors:
        rot = A(1, [(0, 0, "linear"), (OP, 360)])
        lo_k, hi_k = (88, 112) if ph > 0 else (112, 88)
        sc = A(3, [(0, (lo_k, lo_k, lo_k), "inOutSine"),
                   (OP // 2, (hi_k, hi_k, hi_k), "inOutSine"),
                   (OP, (lo_k, lo_k, lo_k))])
        o = A(1, [(0, 72, "inOutSine"), (OP, 72)])
        layers.append(L(ind, nm, [G("m", STAR(4, sz, round(sz * 0.38, 2), col))], OP,
                        p=(cx, cy), r=rot, s=sc, o=o)); ind -= 1
    return comp("sparkles", layers, OP)


# ============================================================ star-burst ===
def build_star_burst():
    OP = 42
    layers = []
    ind = 15

    layers += burst_particles(
        ind, "p", 8, (100, 100), dist0=26, dist1=58,
        colors=[GOLD400, EM400, YELL100, AMBER500, GOLD300, MINT300, EM400, GOLD400],
        sizes=[6, 7, 5, 6, 7, 5, 6, 6], t0=4, t0_step=1.2, life=20, op_total=OP,
        gravity=12, lift=9, star_every=2, spin=240)
    ind -= 8

    for j, (sz, w0, col, delay) in enumerate(((96, 3.5, MINT300, 4), (120, 2.5, GOLD400, 10))):
        sc = A(3, [(delay, (28, 28, 28), "circOut"), (delay + 16, (128, 128, 128))])
        o = A(1, [(delay, 76, "circOut"), (delay + 16, 0)])
        ring = RING(sz, col, w0)
        ring[1]["w"] = A(1, [(delay, w0, "circOut"), (delay + 16, round(w0 * 0.3, 2))])
        layers.append(L(ind, f"ring{j}", [G("rg", ring)], OP, o=o, s=sc)); ind -= 1

    ray_groups = []
    for k in range(12):
        ang = k * 30
        ln = 15 if k % 2 == 0 else 10
        items = RECT(4, ln, 2, MINT300, op=90 if k % 2 == 0 else 65)
        items.append(TR_IDENT(p=(math.cos(math.radians(ang)) * 30,
                                 math.sin(math.radians(ang)) * 30), r=ang + 90))
        ray_groups.append(G(f"ray{k}", items))
    rays_sc = A(3, [(3, (48, 48, 48), "expoOut"), (18, (114, 114, 114), "inOutSine"),
                    (32, (102, 102, 102))])
    rays_r = A(1, [(3, -14, "expoOut"), (32, 10)])
    rays_o = A(1, [(3, 0, "expoOut"), (8, 100, "inOutSine"), (28, 100, "inOutSine"),
                   (36, 0)])
    layers.append(L(ind, "rays", ray_groups, OP, s=rays_sc, r=rays_r, o=rays_o))
    ind -= 1

    glow_o = A(1, [(1, 0, "expoOut"), (9, 32, "inOutSine"), (28, 0)])
    glow_sc = A(3, [(1, (50, 50, 50), "backOut"), (12, (145, 145, 145), "inOutSine"),
                    (30, (158, 158, 158))])
    layers.append(L(ind, "starGlow", [G("sg", STAR(5, 24, 10.5, GOLD300))], OP,
                    s=glow_sc, o=glow_o)); ind -= 1

    star_sc = A(3, [
        (0, (16, 16, 16), "backOut"),
        (3, (118, 80, 100), "backOut"),
        (8, (128, 118, 100), "inOutSine"),
        (12, (94, 102, 100), "inOutSine"),
        (16, (106, 99, 100), "inOutSine"),
        (22, (100, 100, 100))])
    star_r = A(1, [(0, 88, "backOut"), (14, 0)])
    star_o = A(1, [(0, 0, "expoOut"), (2, 100)])
    layers.append(L(ind, "star", [G("st", STAR(5, 22, 9.5, GOLD300))], OP,
                    s=star_sc, r=star_r, o=star_o))

    return comp("star-burst", layers, OP)


# ============================================================ broken-robot ==
def build_broken_robot():
    OP = 66
    HEAD_IND = 5
    HEAD_P = (100, 106)
    layers = []

    sparks_colors = [GOLD300, RED500, GOLD300, AMBER500, RED500, GOLD300]
    for i in range(6):
        ang = -90 + (i - 2.5) * 34
        rad = math.radians(ang)
        dx, dy = math.cos(rad), math.sin(rad)
        t0 = 8 + int(i * 2.2)
        te = min(t0 + 13, OP - 1)
        sx, sy = 100 + dx * 6, 56 + dy * 6
        mx, my = 100 + dx * 20, 56 + dy * 16 - 6
        ex, ey = 100 + dx * 30, 56 + dy * 22 + 12
        p = A(2, [(t0, (sx, sy), "expoOut"), (t0 + 5, (mx, my), "gravIn"), (te, (ex, ey))])
        o = A(1, [(t0, 0, "expoOut"), (t0 + 2, 100, "inOutSine"), (te, 0)])
        sc = A(3, [(t0, (100, 100, 100), "expoOut"), (te, (30, 30, 30))])
        layers.append(L(14 - i, f"spark{i}", [G("sp", EL(5 - (i % 2), sparks_colors[i]))],
                        OP, p=p, o=o, s=sc))

    shallow = {"i": [[0, 0]] * 4, "o": [[0, 0]] * 4,
               "v": [[-12, 17], [-4, 20], [4, 17], [12, 21]], "c": False}
    deep = {"i": [[0, 0]] * 4, "o": [[0, 0]] * 4,
            "v": [[-12, 14], [-4, 24], [4, 14], [12, 24]], "c": False}
    mouth_path = {"ty": "sh", "ks": {"a": 1, "k": [
        {"t": 0, "s": [deep], "h": 1},
        {"t": 11, "s": [shallow], "h": 1},
        {"t": 17, "s": [deep], "h": 1},
        {"t": 24, "s": [shallow]},
    ]}}
    mouth_stroke = {"ty": "st", "c": st(list(SLATE400) + [1.0]), "o": st(100),
                    "w": st(4), "lc": 2, "lj": 2}
    mouth_r = A(1, [(0, 0, "inOutSine"), (10, 4, "inOutSine"), (18, -4, "inOutSine"),
                    (26, 0)])
    # parented to head -> position is relative to head anchor
    layers.append(L(6, "mouth", [G("mo", [mouth_path, mouth_stroke])], OP,
                    p=(0, 2), parent=HEAD_IND, r=mouth_r))

    pupr_ts = [0, 10, 13, 17, 21, 25, 30]
    pupr_xs = [16, 20, 12, 19, 13, 18, 16]
    pupr_p = A(2, [(t, (x, -8), "hold" if i % 2 else "inOutSine")
                   for i, (t, x) in enumerate(zip(pupr_ts, pupr_xs))])
    layers.append(L(8, "pupR", [G("pr", EL(7, NAVY))], OP, p=pupr_p, parent=HEAD_IND))

    pupl_p = A(2, [(0, (-16, -8), "hold"), (14, (-16, -5), "hold"),
                   (26, (-16, -5), "inOutSine"), (30, (-16, -8))])
    pupl_o = A(1, [(0, 100, "hold"), (15, 100, "hold"), (16, 25, "hold"),
                   (18, 100, "hold"), (21, 0, "hold"), (23, 100, "inOutSine"),
                   (OP, 100)])
    layers.append(L(7, "pupL", [G("pl", EL(7, NAVY))], OP, p=pupl_p, o=pupl_o,
                    parent=HEAD_IND))

    head_shapes = [
        G("face", RECT(76, 60, 6, HEAD)),
        G("brow", off(RECT(76, 14, 6, SLATE600), (0, -23))),
        G("earL", off(RECT(8, 20, 3, SLATE500), (-42, 0))),
        G("earR", off(RECT(8, 20, 3, SLATE500), (42, 0))),
        G("eyeWL", off(EL(16, EYEWHITE), (-16, -8))),
        G("eyeWR", off(EL(16, EYEWHITE), (16, -8))),
    ]
    head_p = A(2, [
        (0, HEAD_P, "inOutSine"),
        (6, (100, 103), "inOutSine"),
        (8, (103, 107), "hold"), (11, (97, 105), "hold"), (14, (102, 106), "hold"),
        (17, (98, 104), "hold"), (20, (101, 107), "hold"), (23, (99, 105), "hold"),
        (26, HEAD_P, "inOutSine"),
        (46, (100, 104.5), "inOutSine"),
        (OP, HEAD_P),
    ])
    head_r = A(1, [
        (0, 0, "inOutSine"), (5, -3, "inOutSine"), (8, 0, "hold"),
        (11, 2, "hold"), (14, -1.5, "hold"), (17, 1, "hold"), (20, -0.8, "hold"),
        (26, 0, "inOutSine"), (OP, 0),
    ])
    layers.append(L(HEAD_IND, "robotHead", head_shapes, OP, p=head_p, r=head_r))

    ant_shapes = [
        G("stub", off(RECT(4, 16, 2, SLATE500), (0, -38))),
        G("tip", off(EL(7, GOLD300), (0, -50))),
    ]
    ant_r = A(1, [(0, 0, "inOutSine"), (6, 4, "inOutSine"), (12, -5, "inOutSine"),
                  (18, 3, "inOutSine"), (24, -1.5, "inOutSine"), (30, 0)])
    layers.append(L(4, "antenna", ant_shapes, OP, p=(0, 0), parent=HEAD_IND, r=ant_r))

    glow_o = A(1, [(0, 0, "expoOut"), (10, 16, "inOutSine"), (22, 6, "inOutSine"),
                   (34, 0)])
    glow_sc = A(3, [(0, (66, 66, 66), "expoOut"), (10, (108, 108, 108), "inOutSine"),
                    (34, (122, 122, 122))])
    layers.append(L(3, "glowErr", [G("ge", EL(96, RED500))], OP, p=HEAD_P,
                    o=glow_o, s=glow_sc))

    dot_o = A(1, [(0, 100, "hold"), (32, 100, "hold"), (35, 15, "hold"),
                  (38, 100, "hold"), (40, 20, "hold"), (44, 100, "hold"),
                  (47, 40, "hold"), (51, 100, "inOutSine"), (OP, 100)])
    layers.append(L(2, "statusDot", [G("sd", EL(8, RED500))], OP, p=(100, 168), o=dot_o))

    halo_o = A(1, [(0, 0, "hold"), (32, 0, "hold"), (36, 22, "inOutSine"),
                   (40, 4, "inOutSine"), (44, 18, "inOutSine"), (52, 0, "inOutSine"),
                   (OP, 0)])
    halo_sc = A(3, [(32, (100, 100, 100), "inOutSine"), (44, (150, 150, 150), "inOutSine"),
                    (OP, (160, 160, 160))])
    layers.append(L(1, "statusHalo", [G("sh", EL(20, RED500))], OP, p=(100, 168),
                    o=halo_o, s=halo_sc))

    return comp("broken-robot", layers, OP)


# ============================================================ warning-pulse =
def build_warning_pulse():
    OP = 72
    layers = []
    ind = 8

    glow_o = A(1, [(0, 9, "inOutSine"), (36, 19, "inOutSine"), (OP, 9)])
    glow_sc = A(3, [(0, (92, 92, 92), "inOutSine"), (36, (107, 107, 107), "inOutSine"),
                    (OP, (92, 92, 92))])
    layers.append(L(ind, "glowDisc", [G("gd", EL(112, RED500))], OP, p=(100, 104),
                    o=glow_o, s=glow_sc)); ind -= 1

    for j, delay in enumerate((0, 24, 48)):
        sc = A(3, [(delay, (70, 70, 70), "circOut"), (delay + 24, (127, 127, 127))])
        o = A(1, [(delay, 52, "circOut"), (delay + 24, 0)])
        ring = RING(120, RED500, 3.5, op=60)
        ring[1]["w"] = A(1, [(delay, 3.5, "circOut"), (delay + 24, 1.2)])
        layers.append(L(ind, f"ring{j}", [G("r", ring)], OP, p=(100, 104), o=o, s=sc))
        ind -= 1

    excl_items = [
        G("bar", off(RECT(10, 32, 5, RED500), (0, -8))),
        G("kd", off(EL(9, RED500), (0, 20))),
    ]
    excl_p = A(2, [(0, (100, 102), "inOutSine"), (6, (100, 99), "inOutSine"),
                   (12, (100, 102), "inOutSine"), (OP, (100, 102))])
    excl_s = A(3, [(0, (100, 100, 100), "inOutSine"), (6, (104, 93, 100), "inOutSine"),
                   (13, (100, 100, 100), "inOutSine"), (OP, (100, 100, 100))])
    layers.append(L(ind, "excl", excl_items, OP, p=excl_p, s=excl_s)); ind -= 1

    tri_body = STROKE_PATH([(0, -30), (-32, 28), (32, 28)], RED500, 5, closed=True)
    tri_body.append({"ty": "fl", "c": st(list(RED500) + [1.0]), "o": st(14)})
    tri_r = A(1, [(0, 0, "inOutSine"), (6, 2.5, "inOutSine"), (18, -1.8, "inOutSine"),
                  (30, 1.1, "inOutSine"), (42, -0.5, "inOutSine"), (54, 0.2, "inOutSine"),
                  (64, 0, "inOutSine"), (OP, 0)])
    layers.append(L(ind, "tri", [G("tb", tri_body)], OP, p=(100, 104), a=(0, 22),
                    r=tri_r))

    return comp("warning-pulse", layers, OP)


# ============================================================ lantern ======
def crescent_group(outer_d, cut_d, outer_p, cut_p, color, op=100):
    """Crescent via even-odd fill: main disc + offset cutout disc."""
    return [
        {"ty": "el", "p": st(list(outer_p)), "s": st([outer_d, outer_d])},
        {"ty": "el", "p": st(list(cut_p)), "s": st([cut_d, cut_d])},
        {"ty": "fl", "c": st(list(color) + [1.0]), "o": st(op), "r": 2},
    ]


def build_lantern():
    """Noor: a serene golden crescent over layered warm radiance, with
    twinkling stars and slowly rising light motes. Perfectly periodic 72f loop."""
    OP = 72
    layers = []
    ind = 8

    # rising light motes — fade in/out at both ends so the wrap is invisible
    for i, (mx, my) in enumerate(((86, 128), (118, 136), (102, 148))):
        t0 = i * 20
        o_keys = [(0, 0, "inOutSine")]
        if t0 > 0:
            o_keys.append((t0, 0, "inOutSine"))
        o_keys += [(t0 + 14, 55, "inOutSine"), (min(t0 + 34, OP - 2), 0, "inOutSine"),
                   (OP, 0)]
        o = A(1, o_keys)
        dx = 4 + i * 2
        # slow diagonal drift across the whole loop; the wrap teleport happens
        # while opacity is 0 at both ends, so it reads as seamless
        p = A(2, [(0, (mx + dx, my), "inOutSine"), (OP, (mx - dx, my - 30))])
        layers.append(L(ind, f"mote{i}", [G("mt", EL(3.5, YELL100))], OP, p=p, o=o))
        ind -= 1

    # twinkles near the crescent horns
    for i, (sx, sy, sz, col, ph) in enumerate((
            (78, 66, 6, GOLD300, 0), (134, 118, 5, MINT200, 24), (120, 62, 4, GOLD300, 48))):
        rise_t, peak_t, fall_t = ph + 16, ph + 32, ph + 26
        sc_keys = [(0, (42, 42, 42), "inOutSine")]
        o_keys = [(0, 30, "inOutSine")]
        if ph > 0:
            sc_keys.append((ph, (42, 42, 42), "inOutSine"))
            o_keys.append((ph, 30, "inOutSine"))
        hi_s, lo_s = min(rise_t, OP - 12), min(fall_t, OP - 6)
        sc_keys += [(hi_s, (100, 100, 100), "inOutSine"),
                    (lo_s, (42, 42, 42), "inOutSine"), (OP, (42, 42, 42))]
        hi_o, lo_o = min(peak_t, lo_s - 2), lo_s
        o_keys += [(hi_o, 90, "inOutSine"), (lo_o, 30, "inOutSine"), (OP, 30)]
        rot = A(1, [(0, 0, "inOutSine"), (OP // 2, 45, "inOutSine"), (OP, 0)])
        layers.append(L(ind, f"tw{i}", [G("tw", STAR(4, sz, sz * 0.38, col))], OP,
                        p=(sx, sy), s=A(3, sc_keys), o=A(1, o_keys), r=rot))
        ind -= 1

    # crescent: even-odd discs, gentle breathing tilt
    cres_r = A(1, [(0, -2.5, "inOutSine"), (OP // 2, 2.5, "inOutSine"), (OP, -2.5)])
    cres_s = A(3, [(0, (97, 97, 97), "inOutSine"), (OP // 2, (103, 103, 103), "inOutSine"),
                   (OP, (97, 97, 97))])
    layers.append(L(ind, "crescent",
                    [G("cr", crescent_group(56, 56, (104, 96), (94, 86), GOLD300))],
                    OP, s=cres_s, r=cres_r)); ind -= 1
    # inner warm core hugging the crescent
    core_o = A(1, [(0, 22, "inOutSine"), (OP // 2, 34, "inOutSine"), (OP, 22)])
    core_s = A(3, [(0, (92, 92, 92), "inOutSine"), (OP // 2, (104, 104, 104), "inOutSine"),
                   (OP, (92, 92, 92))])
    layers.append(L(ind, "core", [G("co", EL(64, AMBER500))], OP, p=(108, 102),
                    o=core_o, s=core_s)); ind -= 1

    # layered radiance: three stacked discs faking a soft radial glow
    for j, (d, col, o_lo, o_hi) in enumerate((
            (150, AMBER500, 9, 15), (112, GOLD400, 12, 20), (74, YELL100, 16, 26))):
        o = A(1, [(0, o_lo, "inOutSine"), (OP // 2, o_hi, "inOutSine"), (OP, o_lo)])
        sc = A(3, [(0, (95, 95, 95), "inOutSine"), (OP // 2, (105, 105, 105), "inOutSine"),
                   (OP, (95, 95, 95))])
        layers.append(L(ind, f"glow{j}", [G("gl", EL(d, col))], OP, p=(102, 98),
                        o=o, s=sc)); ind -= 1

    return comp("lantern", layers, OP)


# ============================================================ glint-sweep ==
def build_glint_sweep():
    """One-shot celebratory sheen for the LogFullDay pill: feathered diagonal
    streaks cross once with eased travel; both start and end fully offscreen."""
    OP = 60
    ROT = -18
    layers = []
    ind = 2

    def feather(widths, heights, rads, opacities, color):
        return [G(f"f{w}", RECT(w, h, r, color, op=o))
                for w, h, r, o in zip(widths, heights, rads, opacities)]

    # broad soft haze trails behind
    haze_p = A(2, [(0, (-230, 100), "inOutSine"), (OP, (330, 100))])
    layers.append(L(ind, "haze",
                    feather([180, 136, 88], [116, 100, 82], [50, 44, 36], [6, 10, 15],
                            WHITE),
                    OP, p=haze_p, r=ROT))
    ind -= 1
    # bright gleam core leads
    gleam_p = A(2, [(0, (-320, 100), "inOutSine"), (OP, (240, 100))])
    layers.append(L(ind, "gleam",
                    feather([96, 62, 30], [84, 68, 46], [38, 30, 20], [22, 40, 62],
                            WHITE),
                    OP, p=gleam_p, r=ROT))
    return comp("glint-sweep", layers, OP)


# ====================================================== progress-fill v2 ====
def build_progress_fill():
    """Pure shine overlay for NextBadgeHint: no track/fill/dot slabs — only a
    feathered gold-white sweep plus micro-sparkles, confined to the horizontal
    band that survives resizeMode='cover' cropping (y ~ 88..112)."""
    OP = 60
    layers = []
    ind = 4

    # sparkles twinkle along the centre line, phase-offset
    spark_pos = [(58, 99), (116, 96), (158, 103)]
    for i, (sx, sy) in enumerate(spark_pos):
        t0 = i * 15
        sc_keys = [(0, (0, 0, 0), "inOutSine")]
        o_keys = [(0, 0, "inOutSine")]
        if t0 > 0:
            sc_keys.append((t0, (0, 0, 0), "backOut"))
            o_keys.append((t0, 0, "inOutSine"))
        sc_keys += [(t0 + 5, (100, 100, 100), "inOutSine"),
                    (min(t0 + 14, OP - 2), (0, 0, 0))]
        o_keys += [(t0 + 4, 90, "inOutSine"), (min(t0 + 14, OP - 2), 0)]
        sc = A(3, sc_keys)
        o = A(1, o_keys)
        rot = A(1, [(max(t0, 1), -50, "inOutSine"), (min(t0 + 14, OP - 2), 50)])
        layers.append(L(ind, f"sp{i}", [G("sp", STAR(4, 6, 2.3, YELL100))], OP,
                        p=(sx, sy), s=sc, o=o, r=rot)); ind -= 1

    # feathered streak sweeping once per loop, teleporting fully offscreen
    def feather(items_specs, color):
        return [G(f"fs{w}", RECT(w, h, r, color, op=o))
                for w, h, r, o in items_specs]

    streak_p = A(2, [(-6, (-190, 100), "inOutSine"), (OP, (350, 100))])
    layers.append(L(ind, "streak",
                    feather([(150, 26, 13, 12), (100, 20, 10, 20), (52, 13, 6, 36)],
                            WHITE),
                    OP, p=streak_p, r=-14))

    return comp("progress-fill", layers, OP)


# ======================================================== journey-begins ==
# NOTE: journey-begins.json is now a vendored LottieFiles asset
# ("Man goes to the mosque on Ramadan" by Abdul Latif / animoox,
#  https://lottiefiles.com/free-animation/man-goes-to-the-mosque-on-ramadan-mokQFETrCp
#  LottieFiles Free License). It is NOT regenerated by this script.




# ==================================================================== main ==
BUILDERS = {
    "cell-pop": build_cell_pop,
    "sparkle-pop": build_sparkle_pop,
    "checkmark-draw": build_checkmark_draw,
    "confetti": build_confetti,
    "progress-fill": build_progress_fill,
    "shimmer": build_shimmer,
    "sparkles": build_sparkles,
    "star-burst": build_star_burst,
    "broken-robot": build_broken_robot,
    "warning-pulse": build_warning_pulse,
    "lantern": build_lantern,
    "glint-sweep": build_glint_sweep,
}

EXPECTED_OP = {
    "cell-pop": 24, "sparkle-pop": 30, "checkmark-draw": 54, "confetti": 96,
    "progress-fill": 60, "shimmer": 54, "sparkles": 72, "star-burst": 42,
    "broken-robot": 66, "warning-pulse": 72,
    "lantern": 72, "glint-sweep": 60, "journey-begins": 120,
}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, fn in BUILDERS.items():
        data = fn()
        assert data["op"] == EXPECTED_OP[name], \
            f"{name}: op {data['op']} != {EXPECTED_OP[name]}"
        inds = [l["ind"] for l in data["layers"]]
        assert len(inds) == len(set(inds)), f"{name}: duplicate layer indices"
        parents = {l["ind"] for l in data["layers"]}
        for l in data["layers"]:
            if "parent" in l:
                assert l["parent"] in parents, f"{name}: dangling parent"
        path = os.path.join(OUT_DIR, f"{name}.json")
        with open(path, "w") as f:
            json.dump(data, f, separators=(",", ":"))
        size = os.path.getsize(path)
        print(f"wrote {name}.json  layers={len(data['layers'])}  op={data['op']}  {size / 1024:.1f}KB")


if __name__ == "__main__":
    main()

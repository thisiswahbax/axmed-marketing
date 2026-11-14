#!/usr/bin/env python3
"""Generate Axmed brand patterns from the mark's own geometry (brand/logo/mark-paths.json).
Usage: python3 scripts/make-patterns.py [WxH ...]   -> brand/patterns/<name>_<WxH>.svg
Deterministic (seeded) so the same pattern regenerates identically."""
import json, math, random, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
M = json.load(open(ROOT / "brand/logo/mark-paths.json"))
OUT = ROOT / "brand/patterns"; OUT.mkdir(exist_ok=True)
IND, DEEP, SOFT, CY, CAN, LINE = "#261C7A", "#1C1560", "#EDEBFA", "#0CC4FF", "#F7F9FD", "#DFE5F0"
# mark viewBox 95 45 350 560 ; centre ≈ (270, 325); ribbon angle ≈ -70° (from the long stroke)
ANG = math.degrees(math.atan2(596 - 57, 184 - 378))  # ≈ 110°

def mark(x, y, h, main, acc, rot=0, op=1.0):
    s = h / 560
    t = f'translate({x},{y}) rotate({rot}) scale({s}) translate(-270,-325)'
    g = "".join(f'<path d="{d}" fill="{main}"/>' for d in M["main"])
    g += "".join(f'<path d="{d}" fill="{acc}"/>' for d in M["accent"])
    return f'<g transform="{t}" opacity="{op}">{g}</g>'

def wrap(W, H, bg, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>'
            f'<rect width="{W}" height="{H}" fill="{bg}"/>{body}</svg>')

def grad_defs():
    return (f'<linearGradient id="ind" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{IND}"/>'
            f'<stop offset="1" stop-color="{DEEP}"/></linearGradient>'
            f'<radialGradient id="glow"><stop offset="0" stop-color="{CY}" stop-opacity=".55"/>'
            f'<stop offset="1" stop-color="{CY}" stop-opacity="0"/></radialGradient>'
            f'<pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">'
            f'<circle cx="2" cy="2" r="2" fill="#fff" opacity=".07"/></pattern>')

# 1. SIGNATURE TILE — staggered mark grid, tonal, every 7th mark lit
def signature(W, H, dark=True):
    r = random.Random(1); step = 150; body = ""
    for j, y in enumerate(range(-step, H + step, int(step * .9))):
        for i, x in enumerate(range(-step, W + step, step)):
            xx = x + (step / 2 if j % 2 else 0)
            lit = r.random() < .08
            if dark:
                body += mark(xx, y, 92, "#FFFFFF", CY if lit else "#FFFFFF", op=.9 if lit else .06)
            else:
                body += mark(xx, y, 92, IND, CY if lit else IND, op=.9 if lit else .06)
    bg = "url(#ind)" if dark else CAN
    return wrap(W, H, bg, body, grad_defs())

# 2. SUPERGRAPHIC — giant cropped mark with glowing cyan joins
def supergraphic(W, H):
    h = max(W, H) * 1.55
    body = f'<rect width="{W}" height="{H}" fill="url(#ind)"/>'
    body += f'<circle cx="{W*.72}" cy="{H*.38}" r="{max(W,H)*.45}" fill="url(#glow)" opacity=".5"/>'
    body += mark(W * .78, H * .52, h, "#FFFFFF", CY, op=.10)
    body += mark(W * .78, H * .52, h, "none", CY, op=.85)
    body += f'<rect width="{W}" height="{H}" fill="url(#dots)"/>'
    return wrap(W, H, DEEP, body, grad_defs())

# 3. STRANDS — the mark's ribbons extended into parallel helix strands (supply lines)
def strands(W, H, dark=True):
    r = random.Random(3); body = ""; a = math.radians(ANG)
    dx, dy = math.cos(a), math.sin(a); nx, ny = -dy, dx
    L = (W + H) * 1.2; cx, cy = W / 2, H / 2
    k = -int((W + H) / 2)
    while k < (W + H) / 2:
        w = r.choice([10, 14, 22, 34]); gap = r.choice([46, 60, 80])
        ox, oy = cx + nx * k, cy + ny * k
        col = "#FFFFFF" if dark else IND
        op = r.choice([.05, .08, .12]) if dark else r.choice([.05, .08, .1])
        x1, y1, x2, y2 = ox - dx * L / 2, oy - dy * L / 2, ox + dx * L / 2, oy + dy * L / 2
        body += f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{col}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round"/>'
        # cyan "joins": short bright segments, like the mark's cyan links
        for _ in range(r.randint(0, 2)):
            t = r.uniform(-.35, .35) * L; seg = r.uniform(40, 110)
            sx, sy = ox + dx * t, oy + dy * t
            body += f'<line x1="{sx:.0f}" y1="{sy:.0f}" x2="{sx+dx*seg:.0f}" y2="{sy+dy*seg:.0f}" stroke="{CY}" stroke-width="{w}" stroke-linecap="round" opacity=".9"/>'
        k += w + gap
    bg = "url(#ind)" if dark else CAN
    return wrap(W, H, bg, body, grad_defs())

# 4. ROUTES — many sites, one route: nodes linked by ribbon curves at the mark's angle
def routes(W, H, dark=False):
    r = random.Random(7); pts = [(r.uniform(.05, .95) * W, r.uniform(.05, .95) * H) for _ in range(26)]
    hub = (W * .5, H * .5); body = ""
    line = "#FFFFFF" if dark else IND
    for (x, y) in pts:
        mx, my = (x + hub[0]) / 2 + r.uniform(-120, 120), (y + hub[1]) / 2 + r.uniform(-120, 120)
        body += f'<path d="M{hub[0]:.0f},{hub[1]:.0f} Q{mx:.0f},{my:.0f} {x:.0f},{y:.0f}" fill="none" stroke="{line}" stroke-opacity=".14" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>'
    for (x, y) in pts:
        body += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="18" fill="{CY}" opacity=".18"/><circle cx="{x:.0f}" cy="{y:.0f}" r="7" fill="{CY}"/>'
    body += f'<circle cx="{hub[0]}" cy="{hub[1]}" r="120" fill="{"#fff" if dark else SOFT}" opacity="{.08 if dark else .9}"/>'
    body += mark(hub[0], hub[1], 150, "#FFFFFF" if dark else IND, CY)
    bg = "url(#ind)" if dark else CAN
    dots = f'<pattern id="d2" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="{LINE}"/></pattern>'
    return wrap(W, H, bg, (f'<rect width="{W}" height="{H}" fill="url(#d2)"/>' if not dark else "") + body, grad_defs() + dots)

# 5. PEOPLE IN THE MARK — a real photo seen through the mark's ribbons (photo slot)
def people_frame(W, H, photo=None):
    h = min(H * .92, W * 1.35); s = h / 560
    t = f'translate({W*.6:.1f},{H*.5:.1f}) scale({s:.4f}) translate(-270,-325)'
    clip = "".join(f'<path transform="{t}" d="{d}"/>' for d in M["main"])
    defs = grad_defs() + f'<clipPath id="mk">{clip}</clipPath>'
    defs += (f'<linearGradient id="ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A92A6"/>'
             f'<stop offset="1" stop-color="#3B4260"/></linearGradient>')
    body = f'<rect width="{W}" height="{H}" fill="url(#ind)"/><rect width="{W}" height="{H}" fill="url(#dots)"/>'
    inner = (f'<image href="{photo}" x="0" y="0" width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice"/>'
             if photo else f'<rect width="{W}" height="{H}" fill="url(#ph)"/>'
             f'<text x="{W*.6:.0f}" y="{H*.5:.0f}" fill="#fff" opacity=".6" font-family="Inter,sans-serif" font-size="{W/40:.0f}" '
             f'font-weight="600" text-anchor="middle" transform="rotate(-70 {W*.6:.0f} {H*.5:.0f})">REAL PHOTO HERE</text>')
    body += f'<g clip-path="url(#mk)">{inner}</g>'
    body += "".join(f'<path transform="{t}" d="{d}" fill="{CY}"/>' for d in M["accent"])
    return wrap(W, H, DEEP, body, defs)

SETS = {"signature-dark": lambda W, H: signature(W, H, True), "signature-light": lambda W, H: signature(W, H, False),
        "supergraphic": supergraphic, "strands-dark": lambda W, H: strands(W, H, True),
        "strands-light": lambda W, H: strands(W, H, False), "routes-light": routes,
        "routes-dark": lambda W, H: routes(W, H, True), "people-in-the-mark": people_frame}
sizes = sys.argv[1:] or ["1080x1350", "1920x1080", "1080x1920", "1080x1080"]
for sz in sizes:
    W, H = map(int, sz.split("x"))
    for name, fn in SETS.items():
        (OUT / f"{name}_{sz}.svg").write_text(fn(W, H))
print("wrote", len(SETS) * len(sizes), "SVGs to", OUT)

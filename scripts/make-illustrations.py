#!/usr/bin/env python3
"""Axmed line illustrations: isometric wireframes, one indigo key line, one cyan accent.
Style reference: fine grey construction lines on near-white. Usage: python3 scripts/make-illustrations.py"""
import math, pathlib
OUT = pathlib.Path(__file__).resolve().parent.parent / "brand/illustrations"; OUT.mkdir(exist_ok=True)
BG, FAINT, KEY, DOT, CY = "#FBFBFD", "#D7DAE5", "#261C7A", "#C3C8D6", "#0CC4FF"
S = 1080; C = S / 2
c30, s30 = math.cos(math.pi/6), math.sin(math.pi/6)
def iso(x, y, z=0, cx=C, cy=C): return (cx + (x - y) * c30, cy + (x + y) * s30 - z)
def P(pts): return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
def line(a, b, col=FAINT, w=1.6, dash=None):
    d = f' stroke-dasharray="{dash}" stroke-linecap="round"' if dash else ""
    return f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{col}" stroke-width="{w}"{d}/>'
def poly(pts, col=FAINT, w=1.6, fill="none", dash=None, close=True):
    d = f' stroke-dasharray="{dash}" stroke-linecap="round"' if dash else ""
    tag = "polygon" if close else "polyline"
    return f'<{tag} points="{P(pts)}" fill="{fill}" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"{d}/>'
def ell(cx, cy, rx, ry, col=FAINT, w=1.6, dash=None, fill="none"):
    d = f' stroke-dasharray="{dash}" stroke-linecap="round"' if dash else ""
    return f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" stroke="{col}" stroke-width="{w}"{d}/>'
def dot(p, r=9, col=CY, halo=True):
    h = f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r*2.6:.1f}" fill="{col}" opacity=".16"/>' if halo else ""
    return h + f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r}" fill="{col}"/>'
def svg(body, bg=BG): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}"><rect width="{S}" height="{S}" fill="{bg}"/>{body}</svg>'
def square(cx, cy, z, r): return [iso(cx-r, cy-r, z), iso(cx+r, cy-r, z), iso(cx+r, cy+r, z), iso(cx-r, cy+r, z)]
def cube(x, y, z, a):
    v = {k: iso(x+dx*a, y+dy*a, z+dz*a) for k, (dx, dy, dz) in {"000":(0,0,0),"100":(1,0,0),"010":(0,1,0),"110":(1,1,0),"001":(0,0,1),"101":(1,0,1),"011":(0,1,1),"111":(1,1,1)}.items()}
    return v

out = {}

# 1 Pooled demand: many buyers' needs narrow into one route (funnel of rims)
b = line((C, 230), (C, 1010), DOT, 2.4, "1 9")
rims = [(C, 470, 330, 120), (C, 560, 290, 104), (C, 640, 245, 88), (C, 710, 200, 72)]
for i, (x, y, rx, ry) in enumerate(rims[1:]): b += ell(x, y, rx, ry)
b += ell(C, 775, 160, 58, DOT, 2.4, "1 9")
b += ell(*rims[0], KEY, 2.4)
for k in range(9):
    a = math.pi * (0.1 + 0.8 * k / 8) + math.pi
    b += f'<circle cx="{C + 330*math.cos(a):.1f}" cy="{470 + 120*math.sin(a):.1f}" r="6" fill="{KEY}"/>'
b += dot((C, 870), 10)
out["01_pooled-demand"] = svg(b)

# 2 One bundle, one route: inner cube held in its projection (ref: cube in hexagon)
b = ""; R = 470; r = 200
hexo = [(C + R*math.cos(math.radians(a)), C + R*math.sin(math.radians(a))) for a in range(-90, 270, 60)]
hexi = [(C + r*math.cos(math.radians(a)), C + r*math.sin(math.radians(a))) for a in range(-90, 270, 60)]
for i in range(6):
    b += line(hexo[i], hexo[(i+1) % 6])
    b += line(hexi[i], hexo[i])
b += poly(hexi, KEY, 2.4, fill="#FFFFFF")
for i in (1, 3, 5): b += line((C, C), hexi[i], "#B9BED0", 1.8)
b += dot((C, C), 9)
out["02_one-bundle-one-route"] = svg(b)

# 3 Line by line: a messy plane above resolves to ordered rows below
b = ""; import random; rnd = random.Random(4)
top = square(0, 0, 230, 230); bot = square(0, 0, -90, 230)
b += poly(top); b += poly(bot)
for k in range(5):
    t = -150 + k * 75
    x0 = rnd.uniform(-190, -40); x1 = x0 + rnd.uniform(90, 230); dy = rnd.uniform(-40, 40)
    b += line(iso(x0, t + dy, 230), iso(x1, t + dy * .2, 230), FAINT, 3)
    col, w = (KEY, 3.4) if k == 4 else (FAINT, 3)
    b += line(iso(-170, t, -90), iso(170, t, -90), col, w)
    b += line(iso((x0+x1)/2, t + dy*.6, 230), iso(0, t, -90), DOT, 2, "1 8")
b += dot(iso(170, 150, -90), 8)
out["03_line-by-line"] = svg(b)

# 4 Quality checks: stacked layers, one verified
b = line(iso(0, 0, 330), iso(0, 0, -260), DOT, 2.4, "1 9")
for i, z in enumerate([210, 90, -30, -150]):
    col, w, f = (KEY, 2.4, "#FFFFFF") if i == 1 else (FAINT, 1.6, "none")
    b += poly(square(0, 0, z, 210 - i*18), col, w, f)
b += dot(iso(0, 0, 90), 9)
out["04_quality-checks"] = svg(b)

# 5 Multi-site delivery: one origin, routes to every facility on an iso grid
b = ""
for k in range(-4, 5):
    b += line(iso(k*70, -300, -60), iso(k*70, 300, -60), "#EAECF2", 1.4)
    b += line(iso(-300, k*70, -60), iso(300, k*70, -60), "#EAECF2", 1.4)
v = cube(-35, -35, -60, 70)
for e in [("000","100"),("100","110"),("110","010"),("010","000"),("001","101"),("101","111"),("111","011"),("011","001"),("000","001"),("100","101"),("110","111"),("010","011")]:
    b += line(v[e[0]], v[e[1]], KEY, 2.4)
o = iso(0, 0, 10)
sites = [(-230, 150), (210, -200), (240, 180), (-170, -230), (40, 270)]
for i, (x, y) in enumerate(sites):
    p = iso(x, y, -60); mx, my = (o[0]+p[0])/2, min(o[1], p[1]) - 150
    b += f'<path d="M{o[0]:.1f},{o[1]:.1f} Q{mx:.1f},{my:.1f} {p[0]:.1f},{p[1]:.1f}" fill="none" stroke="{DOT if i else KEY}" stroke-width="{2.2 if i else 2.4}" stroke-dasharray="{"1 9" if i else "none"}" stroke-linecap="round"/>'
    b += dot(p, 7, CY if i == 0 else KEY, halo=(i == 0))
out["05_multi-site-delivery"] = svg(b)

# 6 Sina: a wireframe sphere, the orb's construction lines
b = ""; R = 330
for k in range(-2, 3):
    y = C + k * 110; rr = math.sqrt(max(R*R - (k*110)**2, 0))
    b += ell(C, y, rr, rr * .26, FAINT)
for a in (25, 55, 90, 125, 155):
    b += ell(C, C, R * abs(math.cos(math.radians(a))), R, FAINT)
b += f'<circle cx="{C}" cy="{C}" r="{R}" fill="none" stroke="{KEY}" stroke-width="2.4"/>'
b += line((C, C - R - 120), (C, C + R + 120), DOT, 2.4, "1 9")
b += dot((C + R * math.cos(-0.7), C + R * math.sin(-0.7)), 10)
out["06_sina"] = svg(b)

# 7 Planning 2027: plates rising, the forecast as layers
b = ""
for i in range(5):
    z = -200 + i * 95; r = 120 + i * 30
    col, w = (KEY, 2.4) if i == 4 else (FAINT, 1.6)
    b += poly(square(0, 0, z, r), col, w)
    if i: b += line(iso(r - 30, r - 30, z - 95), iso(r, r, z), DOT, 2, "1 8")
b += dot(iso(0, 0, 180), 9)
out["07_planning-2027"] = svg(b)

# 8 Supply helix: two strands and their links (echoes the Axmed mark)
b = ""; pts1 = []; pts2 = []
for k in range(121):
    t = k / 120; y = 180 + t * 720; ph = t * math.pi * 3.2
    pts1.append((C + 230 * math.sin(ph), y)); pts2.append((C - 230 * math.sin(ph), y))
for k in range(0, 121, 8): b += line(pts1[k], pts2[k], FAINT, 1.6)
b += poly(pts2, FAINT, 1.8, close=False); b += poly(pts1, KEY, 2.4, close=False)
b += line(pts1[64], pts2[64], CY, 4); b += dot(pts1[64], 7)
out["08_supply-helix"] = svg(b)

for k, v in out.items(): (OUT / f"{k}.svg").write_text(v)
print("wrote", len(out))

#!/usr/bin/env python3
"""Axmed product cards (bento system): tinted panels, dot-matrix icons, serif titles, real-feeling
marketplace UI bleeding off the edge. Writes brand/product-cards/cards.html (1080x1350 slides) and bento.html."""
import math, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent; OUT = ROOT / "brand/product-cards"

def dots(kind, col, n=9, gap=7, r=2.3):
    pts = []
    for y in range(n):
        for x in range(n):
            cx, cy = x - (n-1)/2, y - (n-1)/2; d = math.hypot(cx, cy)
            on = {"orb": d <= 4.2 and (d > 2.4 or (x+y) % 2 == 0),
                  "bars": (x % 2 == 0) and (n-1-y) <= [2,4,3,6,5,8,7,6,8][x],
                  "check": abs((y - (n-1)) + (x if x < 3 else 6 - x) ) < 1.2 if False else (abs(y - (x + 4)) < .6 and x <= 3) or (abs(y - (10 - x)) < .6 and x >= 3) or (abs(y-(x+3))<.6 and x<=3) or (abs(y-(9-x))<.6 and x>=3),
                  "route": abs(y - (n-1-x)) < 1.1 or (x in (0, n-1) and y in (0, n-1)),
                  "cube": max(abs(cx), abs(cy)) == 4 or abs(cx) == abs(cy) and abs(cx) <= 2 or (cx == 0 and cy >= 0) ,
                  "stairs": y >= n-1-x//1 and (x+y) % 1 == 0 and y >= (n-1) - x}[kind]
            if on: pts.append((x*gap + gap, y*gap + gap, (abs(cx)+abs(cy)) / n))
    S = n*gap + gap
    return f'<svg width="{S*1.15:.0f}" height="{S*1.15:.0f}" viewBox="0 0 {S} {S}">' + "".join(
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" opacity="{1 - .45*o:.2f}"/>' for x, y, o in pts) + "</svg>"

ARROW = '<svg width="34" height="34" viewBox="0 0 34 34"><path d="M6 17h21M20 9l8 8-8 8" fill="none" stroke="#392AB0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
TINT = {"lav": "linear-gradient(180deg,#EEEBF8 0%,#F6F5F2 70%)", "ice": "linear-gradient(180deg,#E6F4FA 0%,#F6F6F3 70%)",
        "sage": "linear-gradient(180deg,#EAF1EA 0%,#F6F6F2 70%)", "blush": "linear-gradient(180deg,#F8ECEA 0%,#F7F5F2 70%)",
        "paper": "#F8F7F4"}

CSS = """
@import url("https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap");
*{box-sizing:border-box;margin:0} body{background:#F8F7F4}
.slide{width:1080px;height:1350px;position:relative;overflow:hidden;background:#F8F7F4;font-family:Figtree,"Avenir Next",sans-serif;color:#101828}
.panel{position:absolute;inset:48px;border-radius:44px;overflow:hidden}
.panel.line{background:#FCFBFA;box-shadow:0 0 0 1.5px #E7E4DE inset}
.head{position:absolute;left:64px;top:68px;right:64px;display:flex;align-items:center;gap:22px}
.head h2{font:400 76px/1 "Instrument Serif",serif;letter-spacing:-.01em;color:#101828}
.go{position:absolute;right:56px;top:56px;width:92px;height:92px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 18px 40px -16px rgba(16,24,40,.28)}
.body{position:absolute;left:64px;top:190px;width:780px;font:400 32px/1.45 Figtree,sans-serif;color:#1D2433}
.ui{position:absolute;background:#fff;border-radius:14px;font-family:Inter,sans-serif;box-shadow:0 0 0 1px #E6E3DD,0 30px 70px -30px rgba(16,24,40,.35),0 8px 16px -8px rgba(16,24,40,.12)}
.ui.ghost{background:#F3F1EC;box-shadow:0 0 0 1px #E6E3DD}
.ui h4{font:600 26px Inter;color:#101828;padding:28px 32px 18px}
.trow{display:grid;align-items:center;padding:0 32px;height:76px;border-top:1px solid #EEECE7;font:500 21px Inter;color:#101828}
.thead{display:grid;padding:0 32px;height:50px;align-items:center;background:#FAF9F7;border-top:1px solid #EEECE7;font:600 14px Inter;letter-spacing:.06em;text-transform:uppercase;color:#667085}
.mut{color:#667085;font-weight:400}
.tag{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:7px;font:600 14px Inter;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
.g{background:#ECFDF3;color:#067647}.a{background:#FFFAEB;color:#B54708}.i{background:#F3F0FF;color:#392AB0}.c{background:#E6F8FF;color:#0570A0}.n{background:#F2F4F7;color:#475467}
.fade{position:absolute;-webkit-mask-image:linear-gradient(#000 0%,transparent 95%);mask-image:linear-gradient(#000 0%,transparent 95%);opacity:.55}
.mono{font:400 18px "JetBrains Mono",ui-monospace,monospace;color:#7A8195}
.orbm{width:44px;height:44px;border-radius:50%;background:url("../sina/sina-orb-4.png") center/cover;box-shadow:0 6px 16px -6px rgba(12,196,255,.8)}
.ill{position:absolute;left:64px;bottom:64px;font:600 14px Figtree;letter-spacing:.14em;text-transform:uppercase;color:#98A2B3}
.logo{position:absolute;right:64px;bottom:58px;height:40px}
.solid{position:absolute;inset:48px;border-radius:44px;background:#392AB0;color:#fff;overflow:hidden}
.eyebrow{display:inline-block;padding:14px 24px;border-radius:999px;border:1.5px solid rgba(255,255,255,.45);font:600 20px Figtree;letter-spacing:.06em;text-transform:uppercase}
.big{font:400 128px/1.02 "Instrument Serif",serif;letter-spacing:-.015em}
"""
LOGO_I = (ROOT / "brand/logo/axmed-logo.svg").read_text().replace("<svg ", '<svg class="logo" ')
LOGO_W = (ROOT / "brand/logo/axmed-logo-white.svg").read_text().replace("<svg ", '<svg class="logo" ')

def card(tint, icon, title, body, ui, illus=True, line=False):
    bg = "" if line else f'style="background:{TINT[tint]}"'
    return f'''<section class="slide"><div class="panel{' line' if line else ''}" {bg}>
<div class="head">{icon}<h2>{title}</h2></div><div class="go">{ARROW}</div>
<div class="body">{body}</div>{ui}
{'<div class="ill">Illustrative interface</div>' if illus else ''}{LOGO_I}</div></section>'''

# 1 SINA (lavender)
sina_rows = [("Carbetocin HS 100mcg amp", "Carbetocin 100 mcg/mL · ampoule", "g", "Matched"),
             ("PPH drape calibrated", "Calibrated drape · postpartum", "g", "Matched"),
             ("TXA 1g/10ml inj", "Tranexamic acid 100 mg/mL · 10 mL", "g", "Matched"),
             ("Miso 200 - 3 tabs/pack ??", "Misoprostol 200 mcg · which pack?", "a", "1 question")]
fade_rows = [("Oxytocin 10IU", "Oxytocin 10 IU/mL · ampoule", "g", "Matched"), ("Magnesium sulf 50%", "Magnesium sulfate 500 mg/mL", "g", "Matched"), ("+ 14 more lines", "", "n", "Reading")]
def srow(r): return f'<div class="trow" style="grid-template-columns:330px 1fr 170px"><span class="mono">{r[0]}</span><span>{r[1]}</span><span><span class="tag {r[2]}">{r[3]}</span></span></div>'
ui1 = f'''<div class="ui" style="left:120px;top:470px;width:1100px">
<div style="display:flex;align-items:center;gap:16px;padding:26px 32px 20px"><div class="orbm"></div><div><div style="font:600 24px Inter">Sina</div><div style="font:400 18px Inter;color:#667085">2027_MNCH_order_v3.xlsx · 18 lines</div></div><span class="tag i" style="margin-left:40px">Reading your list</span></div>
<div class="thead" style="grid-template-columns:330px 1fr 170px"><span>Your line</span><span>Catalogue product</span><span>Status</span></div>
{''.join(srow(r) for r in sina_rows)}</div>
<div class="fade" style="left:140px;top:968px;width:1080px">{''.join(srow(r) for r in fade_rows)}</div>'''

# 2 QUOTES (ice)
q_rows = [("Supplier A", "WHO-PQ", "100 × 1 mL", "i", "Best landed cost"), ("Supplier B", "SRA", "10 × 1 mL", "n", "+8%"), ("Supplier C", "WHO-PQ", "50 × 1 mL", "n", "+14%")]
def qrow(r): return f'<div class="trow" style="grid-template-columns:240px 170px 200px 1fr"><span>{r[0]}</span><span class="mut">{r[1]}</span><span class="mut">{r[2]}</span><span><span class="tag {r[3]}">{r[4]}</span></span></div>'
ui2 = f'''<div class="ui ghost" style="left:150px;top:500px;width:1000px;height:420px"></div>
<div class="ui" style="left:110px;top:470px;width:1100px"><h4>Carbetocin 100 mcg/mL · 40,000 ampoules <span class="tag c" style="margin-left:14px">6 quotes</span></h4>
<div class="thead" style="grid-template-columns:240px 170px 200px 1fr"><span>Supplier</span><span>Quality</span><span>Pack</span><span>Per ampoule, delivered</span></div>
{''.join(qrow(r) for r in q_rows)}</div>
<div class="fade" style="left:130px;top:880px;width:1080px">{''.join(qrow(r) for r in [("Supplier D","SRA","100 × 1 mL","n","+19%"),("Supplier E","Under review","10 × 1 mL","a","QA pending"),("Supplier F","WHO-PQ","25 × 1 mL","n","+23%")])}</div>'''

# 3 QUALITY (sage)
qa = [("Supplier verified", "AI checks, then a regulatory specialist signs off", "g", "Passed"),
      ("Product qualified", "Every quote checked against the specification", "g", "Passed"),
      ("Registered in destination", "Rwanda FDA · checked against regulatory catalogues", "g", "Passed"),
      ("QC release before shipping", "Certificate of analysis reviewed", "a", "In review")]
def arow(r): return f'<div class="trow" style="grid-template-columns:1fr 170px;height:96px"><span><b style="font-weight:600">{r[0]}</b><br><span class="mut" style="font-size:18px">{r[1]}</span></span><span><span class="tag {r[2]}">{r[3]}</span></span></div>'
ui3 = f'''<div class="ui" style="left:110px;top:470px;width:860px"><h4>Order PO-2026-0418 · quality <span class="tag g" style="margin-left:12px">3 of 4</span></h4>
{''.join(arow(r) for r in qa)}</div>
<div class="ui" style="left:620px;top:900px;width:420px;padding:26px 30px;font-family:Inter"><div style="font:600 14px Inter;letter-spacing:.06em;text-transform:uppercase;color:#667085">Shelf life on arrival</div><div style="font:600 46px Inter;margin-top:8px;color:#101828">86%</div><div style="height:8px;border-radius:8px;background:#EEECE7;margin-top:12px"><i style="display:block;height:8px;width:86%;border-radius:8px;background:#17B26A"></i></div></div>'''

# 4 TRACKING (blush)
tr = [("Kigali · central store", "g", "Delivered", "12 Dec"), ("Musanze district hospital", "c", "In transit", "ETA 15 Dec"), ("Huye district hospital", "c", "In transit", "ETA 16 Dec"), ("Rubavu health centre", "n", "Scheduled", "ETA 18 Dec")]
def trow(r): return f'<div class="trow" style="grid-template-columns:1fr 180px 150px"><span>{r[0]}</span><span><span class="tag {r[1]}">{r[2]}</span></span><span class="mut" style="font-size:19px">{r[3]}</span></div>'
ui4 = f'''<div class="ui" style="left:110px;top:470px;width:1100px">
<div style="height:220px;border-radius:14px 14px 0 0;background:radial-gradient(60% 90% at 30% 40%,#EEEBF8,#F7F6F3);position:relative;overflow:hidden">
<svg width="1100" height="220" viewBox="0 0 1100 220"><path d="M120 150 C 300 40, 480 60, 620 110 S 900 170, 1000 70" fill="none" stroke="#392AB0" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="120" cy="150" r="10" fill="#392AB0"/><circle cx="620" cy="110" r="12" fill="#0CC4FF"/><circle cx="620" cy="110" r="26" fill="#0CC4FF" opacity=".2"/><circle cx="1000" cy="70" r="8" fill="#98A2B3"/></svg>
<span class="tag i" style="position:absolute;left:28px;top:24px">3D live tracking</span></div>
<h4 style="padding-top:22px">PPH bundle · 4 sites</h4>{''.join(trow(r) for r in tr)}</div>'''

cards = [card("lav", dots("orb", "#392AB0"), "Sina", "Bring the list you already have. Sina matches every line to real products, and asks when something isn't clear.", ui1),
         card("ice", dots("bars", "#0A9FD0"), "Quotes", "Qualified suppliers compete on your exact lines. Compare like for like, per unit, delivered.", ui2),
         card("sage", dots("check", "#2F8F5B"), "Quality", "QA and regulatory checks on every supplier, every product and every batch before it ships.", ui3),
         card("blush", dots("route", "#C2557A"), "Delivery", "One route for the whole bundle, tracked live to every facility on your list.", ui4)]

statement = f'''<section class="slide"><div class="solid">
<div style="position:absolute;right:-220px;bottom:-220px;width:760px;height:760px;border-radius:50%;background:url('../sina/sina-orb-4.png') center/cover;opacity:.9"></div>
<div style="position:absolute;left:64px;top:72px"><span class="eyebrow">Plan your 2027 procurement</span></div>
<div class="big" style="position:absolute;left:64px;top:230px;width:900px">Your whole bundle, one route.</div>
<div style="position:absolute;left:64px;top:620px;width:620px;font:400 32px/1.45 Figtree">Send us your list as it is. Offer within 48 hours.</div>
{LOGO_W.replace('class="logo"','class="logo" style="left:64px;right:auto"')}</div></section>'''

stats = f'''<section class="slide"><div class="solid" style="background:#1E1662">
<div style="position:absolute;left:64px;right:64px;top:70px;display:grid;grid-template-columns:1fr 1fr;gap:0">
<div style="padding-right:30px"><div style="font:400 140px/1 'Instrument Serif',serif">24</div><div style="font:400 40px/1.2 'Instrument Serif',serif;opacity:.9;margin-top:8px">buyers supplied in MNCH</div></div>
<div style="border-left:1.5px solid rgba(255,255,255,.35);padding-left:40px"><div style="font:400 140px/1 'Instrument Serif',serif;color:#0CC4FF">13</div><div style="font:400 40px/1.2 'Instrument Serif',serif;opacity:.9;margin-top:8px">countries, one route</div></div></div>
<div style="position:absolute;left:64px;right:64px;top:450px;bottom:150px;background:#fff;border-radius:30px;color:#101828;padding:56px">
<div style="font:400 64px/1.12 'Instrument Serif',serif">“[Partner quote: approved, verbatim words only. Never written for them.]”</div>
<div style="position:absolute;left:56px;bottom:50px;display:flex;gap:18px;align-items:center"><div style="width:72px;height:72px;border-radius:50%;background:#EEEBF8"></div><div><b style="font:600 24px Figtree">[Name]</b><div style="font:400 22px Figtree;color:#667085">[Role, organisation]</div></div></div></div>
<div style="position:absolute;right:64px;bottom:56px;display:flex;align-items:center;gap:18px;font:500 26px Figtree">Read the case study <span style="width:72px;height:72px;border-radius:50%;border:1.5px solid #fff;display:grid;place-items:center"><svg width="28" height="28" viewBox="0 0 34 34"><path d="M6 17h21M20 9l8 8-8 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></span></div>
<div style="position:absolute;left:64px;bottom:66px;font:600 16px Figtree;letter-spacing:.12em;opacity:.6">PENDING FACT-SHEET SIGN-OFF</div>
</div></section>'''

html = f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(cards)}{statement}{stats}</body></html>'
(OUT / "cards.html").write_text(html)

# bento (website section, 2400 wide): four module cards in a grid, scaled
bento = f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}
.wrap{{width:2400px;padding:90px 120px;background:#F8F7F4;display:grid;grid-template-columns:1fr 1fr;gap:40px}}
.wrap .logo,.wrap .ill{{display:none}} .note{{grid-column:1/-1;text-align:center;font:600 18px Figtree;letter-spacing:.14em;text-transform:uppercase;color:#98A2B3;padding-top:10px}}
.wrap .slide{{transform:scale(1);width:1060px;height:1180px;background:transparent}} .wrap .panel{{inset:0}}
h1{{font:400 110px/1 "Instrument Serif",serif;text-align:center;padding:110px 0 10px;background:#F8F7F4}} .sub{{font:400 36px Figtree;text-align:center;color:#475467;background:#F8F7F4;padding-bottom:20px}}
</style></head><body><h1>Procurement, made simple.</h1><div class="sub">From your list to every facility, in one route.</div><div class="wrap">{"".join(cards)}<div class="note">Illustrative interfaces</div></div></body></html>'''
(OUT / "bento.html").write_text(bento.replace('class="slide"', 'class="slide"'))
print("ok")

#!/usr/bin/env python3
"""Rebuilds the Campaign 01 and product-card assets on brand/system.css (Hallmark floor).
Usage: python3 scripts/build-assets.py   then render with scripts/render-all.sh"""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent

def page(css_rel, slides, title):
    return f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><meta name="description" content="{title}: Axmed campaign and product visuals, rendered to images.">
<link rel="stylesheet" href="{css_rel}brand/system.css"></head><body>
{"".join(slides)}
</body></html>'''

def write(rel, html):
    import re
    html = re.sub(r">([^<]*)<", lambda m: ">" + m.group(1).replace("'", "\u2019") + "<", html)
    p = ROOT / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(html); print("wrote", rel)

ILL = lambda up, name: f'{up}brand/illustrations/{name}.svg'

# ---------- A2.8 Sina carousel ----------
up = "../../../../"
lines = [("Carbetocin HS 100mcg amp", "Carbetocin 100 mcg/mL", "Heat-stable injection, ampoule", "ok", "Matched"),
         ("PPH drape calibrated", "Calibrated blood-collection drape", "Postpartum, single use", "ok", "Matched"),
         ("TXA 1g/10ml inj", "Tranexamic acid 100 mg/mL", "Injection, 10 mL ampoule", "ok", "Matched"),
         ("Oxytocin 10IU", "Oxytocin 10 IU/mL", "Injection, ampoule", "ok", "Matched"),
         ("Miso 200 - 3 tabs/pack ??", "Misoprostol 200 mcg tablet", "Which pack size?", "ask", "1 question")]
rows = "".join(f'<div class="row" style="grid-template-columns:minmax(0,250px) minmax(0,1fr) auto"><span class="raw">{a}</span><span>{b}<span class="sub">{c}</span></span><span class="st {d}">{e}</span></div>' for a, b, c, d, e in lines)

a28 = [
f'''<section class="slide field">
  <div class="halo" style="width:900px;height:900px;right:-330px;top:-160px"></div>
  <div class="orb" style="width:420px;height:420px;right:-60px;top:110px"></div>
  <h1 class="head l" style="left:72px;top:560px;width:900px">Your 2027 list, as it is.</h1>
  <p class="lead" style="left:72px;top:920px;width:760px">Excel, PDF, Word or a message. Your own codes are fine.</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide">
  <h1 class="head" style="left:72px;top:110px;width:900px;color:var(--indigo)">Real lists are messy. That's fine.</h1>
  <div class="sheet" style="left:72px;top:440px;width:936px">
    <div class="grid">
      <div class="h"></div><div class="h">A</div><div class="h">B</div><div class="h">C</div>
      <div class="h">1</div><div class="th">Item</div><div class="th">Qty</div><div class="th">Notes</div>
      <div class="h">2</div><div>Carbetocin HS 100mcg amp</div><div>40,000</div><div>all sites</div>
      <div class="h">3</div><div>PPH drape calibrated</div><div>20 000 pcs</div><div></div>
      <div class="h">4</div><div>TXA 1g/10ml inj</div><div>x 8000</div><div></div>
      <div class="h">5</div><div>Oxytocin 10IU</div><div>15k</div><div class="hl">cold chain?</div>
      <div class="h">6</div><div class="hl">Miso 200 - 3 tabs/pack ??</div><div>?</div><div class="hl">check w/ pharm</div>
    </div>
  </div>
  <p class="label" style="left:72px;top:820px">2027_MNCH_order_v3_FINAL.xlsx</p>
  <div class="bubble" style="left:560px;top:880px;width:448px;font-size:23px">Also add misoprostol for the 4 new sites, thanks</div>
  <p class="label" style="left:560px;top:1040px">From WhatsApp, the same morning</p>
  <p class="label" style="left:72px;bottom:150px">Illustrative example</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide mist">
  <h1 class="head" style="left:72px;top:110px;width:900px;color:var(--indigo)">Sina reads every line.</h1>
  <p class="lead" style="left:72px;top:230px;width:860px">Name, form, strength and pack, matched to real catalogue products.</p>
  <div class="ui" style="left:72px;top:400px;width:936px">
    <div class="top"><div class="orb o1" style="position:static;width:48px;height:48px"></div><div><div class="name">Sina</div><div class="meta">5 lines read from your file</div></div></div>
    {rows}
  </div>
  <p class="label" style="left:72px;bottom:150px">Illustrative interface</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide">
  <div class="halo" style="width:640px;height:640px;left:-90px;top:290px"></div>
  <h1 class="head" style="left:72px;top:110px;width:900px;color:var(--indigo)">When a line isn't clear, Sina asks.</h1>
  <div class="orb" style="left:110px;top:440px;width:240px;height:240px"></div>
  <div style="left:400px;top:450px;width:608px">
    <div class="bubble">Misoprostol 200 mcg comes in more than one pack size. Which one do your facilities order?</div>
    <div style="display:flex;gap:12px;margin-top:22px;flex-wrap:wrap"><span class="opt">Pack of 3</span><span class="opt on">Pack of 28</span><span class="opt">Not sure</span></div>
  </div>
  <div class="ui" style="left:110px;right:72px;top:870px"><div class="row" style="grid-template-columns:minmax(0,1fr) auto;border-top:0"><span>Misoprostol 200 mcg tablet, pack of 28<span class="sub">Line 6, confirmed by you</span></span><span class="st ok">Matched</span></div></div>
  <p class="lead" style="left:72px;top:1020px;width:900px;color:var(--ink)">One plain question, clear options. Nothing is sent until you say so.</p>
  <p class="label" style="left:72px;bottom:150px">Illustrative interface</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide field">
  <h1 class="head" style="left:72px;top:110px;width:900px">From your list to every facility, in view.</h1>
  <ol style="left:72px;top:440px;width:900px;margin:0;padding:0;list-style:none;display:grid;gap:44px;font:400 30px/1.35 var(--body)">
    <li><b style="font:600 36px var(--display);color:var(--on-indigo)">Sina reads your list.</b><br><span style="color:var(--on-indigo-soft)">Every line matched, or a question asked.</span></li>
    <li><b style="font:600 36px var(--display);color:var(--on-indigo)">Qualified suppliers quote.</b><br><span style="color:var(--on-indigo-soft)">QA and regulatory checks on every quote.</span></li>
    <li><b style="font:600 36px var(--display);color:var(--cyan)">An offer within 48 hours.</b><br><span style="color:var(--on-indigo-soft)">The whole bundle through one route.</span></li>
    <li><b style="font:600 36px var(--display);color:var(--on-indigo)">Tracked to every site.</b><br><span style="color:var(--on-indigo-soft)">3D live tracking from dispatch to delivery.</span></li>
  </ol>
  <div class="brand"></div>
</section>''',
f'''<section class="slide field">
  <div class="halo" style="width:760px;height:760px;right:-260px;bottom:-200px"></div>
  <div class="orb" style="width:360px;height:360px;right:72px;bottom:190px"></div>
  <h1 class="head l" style="left:72px;top:110px;width:920px">We'll show you how simple upstream can be.</h1>
  <p class="lead" style="left:72px;top:540px;width:520px">Send your 2027 list. Offer within 48 hours. People in control at every step.</p>
  <span class="cta" style="left:72px;top:760px">axmed.com/buy</span>
  <div class="brand"></div>
</section>''']
write("content/01-every-birth/carousel/A2.8-sina-your-list/slides.html", page(up, a28, "A2.8 Sina: send us your 2027 list"))

# ---------- A1.5 PPH bundle carousel ----------
a15 = [
f'''<section class="slide">
  <h1 class="big" style="left:72px;top:110px;color:var(--indigo);font-size:190px">Every birth.</h1>
  <p class="lead" style="left:72px;top:470px;width:430px">Bleeding after birth kills too many mothers. One bundle changes that.</p>
  <div class="slot" style="left:540px;top:440px;width:468px;height:700px"><p class="label">Photo slot: a midwife at work with the calibrated drape. From Axmed's delivery photos, with written consent.</p></div>
  <div class="brand"></div>
</section>''',
f'''<section class="slide">
  <h1 class="head" style="left:72px;top:110px;width:900px;color:var(--indigo)">Detect early. Treat together.</h1>
  <p class="lead" style="left:72px;top:250px;width:860px">A drape measures blood loss at birth, so bleeding is caught early. Treatment then comes as one bundle.</p>
  <ol style="left:72px;top:470px;width:520px;margin:0;padding:0;list-style:none;display:grid;gap:22px;font:500 32px var(--body)">
    <li>Calibrated drape</li><li>Heat-stable carbetocin</li><li>Oxytocin</li><li>Tranexamic acid</li><li>Misoprostol</li>
  </ol>
  <img src="{ILL(up,'02_one-bundle-one-route')}" alt="" style="right:40px;top:400px;width:500px;height:500px">
  <div class="brand"></div>
</section>''',
f'''<section class="slide field">
  <p class="big" style="left:72px;top:150px;color:var(--on-indigo-soft);margin:0">50%</p>
  <p class="big" style="left:72px;top:360px;color:var(--cyan);margin:0">93%</p>
  <h1 class="head m" style="left:72px;top:640px;width:900px">Severe bleeding detected early rose from 50% to 93% with the drape.</h1>
  <p class="src" style="left:72px;bottom:150px;width:900px">E-MOTIVE trial, WHO-backed, NEJM 2023: over 200,000 women in 80 hospitals in Kenya, Nigeria, South Africa and Tanzania.</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide field">
  <p class="big" style="left:72px;top:150px;font-size:320px;margin:0">60%</p>
  <h1 class="head m" style="left:72px;top:560px;width:900px">less severe bleeding with the drape and the treatment bundle used together.</h1>
  <p class="src" style="left:72px;bottom:150px">E-MOTIVE trial, WHO-backed, NEJM 2023.</p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide">
  <h1 class="head" style="left:72px;top:110px;width:520px;color:var(--indigo)">No fridge needed.</h1>
  <p class="lead" style="left:72px;top:360px;width:440px">Heat-stable carbetocin prevents postpartum bleeding without a cold chain, so it reaches facilities where refrigeration can't be relied on.</p>
  <div class="slot" style="left:560px;top:110px;width:448px;height:1000px"><p class="label">Photo slot: carbetocin ampoules from an Axmed shipment.</p></div>
  <p class="src" style="left:72px;bottom:150px">WHO CHAMPION trial, NEJM 2018. <span class="flag">Verify and cite before use</span></p>
  <div class="brand"></div>
</section>''',
f'''<section class="slide mist">
  <h1 class="head" style="left:72px;top:110px;width:920px;color:var(--indigo)">Products this powerful should be the easiest thing to buy.</h1>
  <p class="lead" style="left:72px;top:470px;width:600px">Today they're among the hardest: one product, one supplier, one tender at a time. Axmed brings the whole bundle through one route.</p>
  <img src="{ILL(up,'01_pooled-demand')}" alt="" style="right:20px;bottom:120px;width:520px;height:520px;mix-blend-mode:multiply">
  <div class="brand"></div>
</section>''',
f'''<section class="slide field">
  <h1 class="head l" style="left:72px;top:110px;width:900px">Plan your 2027 PPH bundle.</h1>
  <p class="lead" style="left:72px;top:400px;width:720px">Send us your list as it is. Offer within 48 hours: drapes, carbetocin, TXA and oxytocin through one route.</p>
  <span class="cta" style="left:72px;top:640px">axmed.com</span>
  <div class="brand"></div>
</section>''']
write("content/01-every-birth/carousel/A1.5-pph-bundle/slides.html", page(up, a15, "A1.5 The PPH bundle"))

# ---------- A1.6 impact card (its own asset folder: brief, copy, slides, renders, review, approval) ----------
a16 = [
f'''<section class="slide field">
  <p class="big" style="left:60px;top:110px;font-size:440px;margin:0">0</p>
  <h1 class="head" style="left:72px;top:560px;width:920px">maternal deaths where the bundle was used.</h1>
  <p class="lead" style="left:72px;top:900px;width:860px">Northern Ghana. Midwives did the work; the bundle was there.</p>
  <p class="src" style="left:72px;bottom:150px">Source: field report to attach. <span class="flag">Reference required</span></p>
  <div class="brand"></div>
</section>''']
write("content/01-every-birth/cards/A1.6-impact-card/slides.html", page("../../../../", a16, "A1.6 Impact story card"))

# ---------- cards ----------
up3 = "../../../"
cards = [
f'''<section class="slide">
  <h1 class="head" style="left:72px;top:110px;width:900px;color:var(--indigo)">MNCH through Axmed, so far.</h1>
  <div style="left:72px;right:72px;top:420px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px 48px">
    <div><p class="big" style="font-size:150px;margin:0;color:var(--indigo)">24</p><p class="lead" style="margin-top:12px">buyers supplied with MNCH products</p></div>
    <div><p class="big" style="font-size:150px;margin:0;color:var(--indigo)">13</p><p class="lead" style="margin-top:12px">countries</p></div>
    <div><p class="big" style="font-size:150px;margin:0;color:var(--indigo)">3.4M</p><p class="lead" style="margin-top:12px">calibrated drapes ordered by 11 buyers in 6 countries</p></div>
    <div><p class="big" style="font-size:150px;margin:0;color:var(--indigo)">3.8M</p><p class="lead" style="margin-top:12px">doses of heat-stable carbetocin ordered across 8 countries</p></div>
  </div>
  <p class="src" style="left:72px;bottom:150px;width:900px">Axmed marketplace data, 5 Nov 2026. Ordered means a buyer purchase order was submitted. <span class="flag">Pending fact-sheet sign-off</span></p>
  <div class="brand"></div>
</section>''']
write("content/01-every-birth/cards/cards.html", page(up3, cards, "A2.2 data"))
wa = [f'''<section class="slide sq field">
  <div class="halo" style="width:700px;height:700px;right:-240px;top:-200px"></div>
  <div class="orb" style="width:300px;height:300px;right:72px;top:72px"></div>
  <h1 class="head" style="left:72px;top:420px;width:820px">Send us your 2027 list.</h1>
  <p class="lead" style="left:72px;top:640px;width:760px">Sina matches every line. Our offer comes within 48 hours.</p>
  <span class="cta" style="left:72px;top:840px;font-size:24px;padding:18px 30px">axmed.com/buy</span>
  <div class="brand" style="right:72px;left:auto;bottom:72px"></div>
</section>''']
write("content/01-every-birth/cards/whatsapp.html", page(up3, wa, "A2.6 WhatsApp card"))

# ---------- product cards ----------
up2 = "../../"
ARROW = '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 34 34"><path d="M6 17h21M20 9l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def module(tint, title, body, ui):
    return f'''<section class="slide {tint}">
  <h1 class="head" style="left:72px;top:96px;width:760px;color:var(--ink)">{title}</h1>
  <span class="go" style="right:72px;top:96px;color:var(--indigo-app)">{ARROW}</span>
  <p class="lead" style="left:72px;top:230px;width:820px;color:var(--ink-soft)">{body}</p>
  {ui}
  <p class="label" style="left:72px;bottom:150px">Illustrative interface</p>
  <div class="brand"></div>
</section>'''
q = [("Supplier A", "WHO-prequalified", "100 x 1 mL", "ok", "Lowest delivered cost"), ("Supplier B", "Stringent regulator", "10 x 1 mL", "n", "Quoted"), ("Supplier C", "WHO-prequalified", "50 x 1 mL", "n", "Quoted")]
qrows = "".join(f'<div class="row" style="grid-template-columns:minmax(0,150px) minmax(0,1fr) minmax(0,120px) auto"><span>{a}</span><span style="color:var(--ink-soft)">{b}</span><span style="color:var(--ink-soft)">{c}</span><span class="st {d}">{e}</span></div>' for a, b, c, d, e in q)
qa = [("Supplier verified", "AI checks, then a regulatory specialist signs off", "ok", "Passed"), ("Product qualified", "Every quote checked against the specification", "ok", "Passed"), ("Registered in the destination country", "Checked against regulatory catalogues", "ok", "Passed"), ("Quality-control release", "Certificate of analysis reviewed before shipping", "n", "In review")]
qarows = "".join(f'<div class="row" style="grid-template-columns:minmax(0,1fr) auto"><span>{a}<span class="sub">{b}</span></span><span class="st {c}">{d}</span></div>' for a, b, c, d in qa)
tr = [("Central medical store", "ok", "Delivered"), ("District hospital, north", "n", "In transit"), ("District hospital, south", "n", "In transit"), ("Health centre, west", "n", "Scheduled")]
trrows = "".join(f'<div class="row" style="grid-template-columns:minmax(0,1fr) auto"><span>{a}</span><span class="st {b}">{c}</span></div>' for a, b, c in tr)
sina_ui = f'<div class="ui" style="left:72px;top:440px;width:936px"><div class="top"><div class="orb o1" style="position:static;width:48px;height:48px"></div><div><div class="name">Sina</div><div class="meta">Reading 2027_MNCH_order_v3.xlsx</div></div></div><div class="th" style="display:grid;grid-template-columns:minmax(0,250px) minmax(0,1fr) auto;gap:16px"><span>Your line</span><span>Catalogue product</span><span>Status</span></div>{rows}</div>'
quotes_ui = f'<div class="ui" style="left:72px;top:440px;width:936px"><div class="top"><div><div class="name">Carbetocin 100 mcg/mL, 40,000 ampoules</div><div class="meta">Quotes from qualified suppliers, compared per ampoule delivered</div></div></div><div class="th" style="display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr) minmax(0,120px) auto;gap:16px"><span>Supplier</span><span>Quality</span><span>Pack</span><span>Result</span></div>{qrows}</div>'
qa_ui = f'<div class="ui" style="left:72px;top:440px;width:936px"><div class="top"><div><div class="name">Order PO-2026-0418, quality</div><div class="meta">3 of 4 checks passed</div></div></div>{qarows}</div>'
route = '<svg aria-hidden="true" width="936" height="200" viewBox="0 0 1060 200" preserveAspectRatio="none" style="display:block;background:var(--paper)"><path d="M110 140 C 290 40, 470 60, 610 100 S 890 160, 990 70" fill="none" stroke="var(--indigo-app)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="110" cy="140" r="10" fill="var(--indigo-app)"/><circle cx="610" cy="100" r="12" fill="var(--cyan)"/><circle cx="990" cy="70" r="8" fill="var(--ink-quiet)"/></svg>'
tr_ui = f'<div class="ui" style="left:72px;top:440px;width:936px">{route}<div class="top"><div><div class="name">PPH bundle to 4 sites</div><div class="meta">3D live tracking from dispatch to delivery</div></div></div>{trrows}</div>'
pcards = [
 module("tint-sina", "Sina", "Bring your list. Sina matches it, and asks when unsure.", sina_ui),
 module("tint-quotes", "Quotes", "Qualified suppliers compete on your exact lines.", quotes_ui),
 module("tint-quality", "Quality", "Every supplier, product and batch checked before shipping.", qa_ui),
 module("tint-delivery", "Delivery", "One route for the bundle, tracked to every facility.", tr_ui),
 f'''<section class="slide field">
  <div class="halo" style="width:900px;height:900px;right:-300px;bottom:-300px"></div>
  <div class="orb" style="width:520px;height:520px;right:-80px;bottom:-60px"></div>
  <h1 class="head l" style="left:72px;top:110px;width:820px">Your whole bundle, one route.</h1>
  <p class="lead" style="left:72px;top:440px;width:600px">Send us your list as it is. Offer within 48 hours.</p>
  <div class="brand"></div>
</section>''',
 f'''<section class="slide field">
  <div style="left:72px;right:72px;top:110px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px">
    <div><p class="big" style="font-size:220px;margin:0">24</p><p class="head m" style="font-size:52px;margin-top:20px">buyers supplied in MNCH</p></div>
    <div><p class="big" style="font-size:220px;margin:0;color:var(--cyan)">13</p><p class="head m" style="font-size:52px;margin-top:20px">countries, one route</p></div>
  </div>
  <p class="lead" style="left:72px;top:760px;width:860px">Every number is published in our yearly impact report, with how it was counted.</p>
  <p class="src" style="left:72px;bottom:150px">Axmed marketplace data, 5 Nov 2026. <span class="flag">Pending fact-sheet sign-off</span></p>
  <div class="brand"></div>
</section>''']
write("brand/product-cards/cards.html", page(up2, pcards, "Axmed product cards"))

"""Build the brand kit page, brand/kit/index.html.

One page the team uses to build web pages and social posts from the same rules: logo, colour,
type, motion, web components, social slide formats, imagery and the content rules. Colours are
read live from brand/system.css on the page, and the image galleries are listed from the brand
folders, so re-running this script picks up new assets.
Run:  python3 scripts/build-tokens.py && python3 scripts/build-kit.py
"""

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "brand"
SITE = ROOT / "site"
OUT = BRAND / "kit" / "index.html"


def rel(p: Path) -> str:
    return "../" + p.relative_to(BRAND).as_posix()


def nice(stem: str) -> str:
    stem = re.sub(r"^\d+[_-]", "", stem)
    stem = re.sub(r"_\d+x\d+$", "", stem)
    return stem.replace("-", " ").replace("_", " ").capitalize()


def gallery(files: list[Path], cls: str = "", note: str = "") -> str:
    figs = "".join(
        f'<figure><a href="{rel(f)}"><img src="{rel(f)}" alt="" loading="lazy"></a>'
        f"<figcaption>{html.escape(nice(f.stem))}<br><span class=\"kit-path\">{rel(f)[3:]}</span></figcaption></figure>"
        for f in files
    )
    n = f'<p class="kit-note">{note}</p>' if note else ""
    return f'<div class="kit-gal {cls}">{figs}</div>{n}'


# colour: token, name, what it is for
SWATCHES = {
    "Brand": [
        ("indigo", "Indigo", "Headlines, the logo, indigo fields."),
        ("indigo-ink", "Indigo ink", "Dark sections, Sina, primary chips."),
        ("indigo-app", "App indigo", "Buttons, links, product UI accents."),
        ("indigo-quiet", "Indigo quiet", "The second half of a two-tone headline."),
        ("cyan", "Cyan", "The one accent. One lit idea per frame."),
    ],
    "Surfaces": [
        ("paper", "Paper", "Default page and slide background."),
        ("paper-warm", "Warm paper", "Alternate band, warm slides."),
        ("card", "Card", "Product UI surfaces."),
        ("indigo-mist", "Indigo mist", "Tints and chips. Not a section background."),
        ("cyan-mist", "Cyan mist", "Quotes module tint."),
        ("sage-mist", "Sage mist", "Quality module tint."),
        ("blush-mist", "Blush mist", "Delivery module tint."),
    ],
    "Text and lines": [
        ("ink", "Ink", "Body text on light."),
        ("ink-soft", "Ink soft", "Paragraphs, secondary text."),
        ("ink-quiet", "Ink quiet", "Captions, sources, metadata."),
        ("line", "Line", "Dividers and card edges."),
        ("on-indigo", "On indigo", "Text on indigo fields."),
        ("on-indigo-soft", "On indigo soft", "Secondary text on indigo."),
    ],
    "Status": [
        ("ok", "OK", "Matched, Passed, Delivered."),
        ("ok-mist", "OK mist", "Background for OK pills."),
        ("ask", "Needs a look", "Questions and warnings only."),
        ("ask-mist", "Needs a look mist", "Background for those pills."),
    ],
}

MOTION = [
    ("--dur-press", "Press feedback, scale(.97)", "--ease-out"),
    ("--dur-ui", "Hover colour, small UI changes", "--ease-out"),
    ("--dur-swap", "Crossfades, tab and content swaps", "--ease-out"),
    ("--dur-scene", "Marketing scenes only: entrances, reveals", "--ease-out"),
    ("--dur-swap", "Things moving on screen", "--ease-in-out"),
]


def swatches() -> str:
    out = []
    for group, items in SWATCHES.items():
        cells = "".join(
            f'<figure class="kit-sw" style="--c: var(--{t})"><i></i><figcaption><b>{n}</b>'
            f'<button type="button" data-copy="var(--{t})" aria-label="Copy var(--{t})">--{t}</button>'
            f' <span class="kit-path" data-hex="{t}"></span><small>{u}</small></figcaption></figure>'
            for t, n, u in items
        )
        out.append(f'<h3>{group}</h3><div class="kit-swatches">{cells}</div>')
    return "".join(out)


def motion_rows() -> str:
    return "".join(
        f'<tr><td><code>{d}</code> <span class="kit-path" data-var="{d}"></span></td><td>{use}</td>'
        f'<td><code>{e}</code></td><td><button class="kit-run" type="button" data-dur="{d}" data-ease="{e}">'
        f'<span class="kit-track"><i></i></span><span>Play</span></button></td></tr>'
        for d, use, e in MOTION
    )


def feature_card() -> str:
    """The first live product shot from the buyers page, so the kit shows the real pattern."""
    s = (SITE / "buyers.html").read_text()
    i = s.find('<div class="feat"><div class="ps')
    if i < 0:
        return '<p class="kit-note">Product shot not found in site/buyers.html.</p>'
    j = s.find("</article>", i)
    return s[i:j].strip()


CK = '<svg class="ck" viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5"/></svg>'

SLIDES = f"""
<figure class="kit-slide"><div class="kit-fit"><div class="slide">
  <h2 class="head" style="left:72px; top:120px; width:900px">Bring the list you already have.</h2>
  <p class="lead" style="left:72px; top:520px; width:820px">One list in. Matched products and supplier quotes out.</p>
  <img class="brand" src="../logo/axmed-logo.svg" alt="Axmed" style="height:48px">
</div></div><figcaption><b>Statement, paper</b>1080 × 1350. Serif headline, one sentence, logo bottom left.</figcaption></figure>

<figure class="kit-slide"><div class="kit-fit"><div class="slide field">
  <div class="big" style="left:72px; top:420px">4.2M</div>
  <p class="lead" style="left:72px; top:640px; width:800px">patients reached in 2025.</p>
  <p class="src" style="left:72px; bottom:150px">Source: Axmed impact report 2025</p>
  <img class="brand" src="../logo/axmed-logo-white.svg" alt="Axmed" style="height:48px">
</div></div><figcaption><b>Figure, indigo field</b>One sourced number. The source line is always on the slide.</figcaption></figure>

<figure class="kit-slide"><div class="kit-fit"><div class="slide warm">
  <h2 class="head m" style="left:72px; top:96px; width:900px">Every line, matched.</h2>
  <div class="ui" style="left:72px; right:72px; top:380px">
    <div class="top"><div><div class="name">2027_MNCH_order.xlsx</div><div class="meta">18 lines read</div></div></div>
    <div class="row" style="grid-template-columns:1fr auto"><span>Carbetocin 100 mcg/mL<span class="sub">Carbetocin HS 100mcg amp</span></span><span class="st ok">Matched</span></div>
    <div class="row" style="grid-template-columns:1fr auto"><span>Tranexamic acid 100 mg/mL<span class="sub">TXA 1g/10ml inj</span></span><span class="st ok">Matched</span></div>
    <div class="row" style="grid-template-columns:1fr auto"><span>Misoprostol 200 mcg<span class="sub">Miso 200 - 3 tabs ??</span></span><span class="st ask">1 question</span></div>
  </div>
  <img class="brand" src="../logo/axmed-logo.svg" alt="Axmed" style="height:48px">
</div></div><figcaption><b>Product, warm paper</b>One product surface with real vocabulary. No card inside a card.</figcaption></figure>

<figure class="kit-slide"><div class="kit-fit"><div class="slide" style="background: var(--paper) url('../backgrounds/lilac-mist_1080x1350.jpg') center / cover">
  <div class="orb blend" style="left:72px; top:150px; width:200px; height:200px"></div>
  <div class="bubble" style="left:72px; right:120px; top:420px">Hi, I'm Sina. Send me your list and I'll match every line.</div>
  <div style="left:72px; top:640px; display:flex; gap:12px"><span class="opt on">Upload a list</span><span class="opt">Ask a question</span></div>
  <img class="brand" src="../logo/axmed-logo.svg" alt="Axmed" style="height:48px">
</div></div><figcaption><b>Sina, atmosphere</b>The orb on a light field. Sina appears in one place per piece.</figcaption></figure>
"""


def page() -> str:
    g = lambda d, pat: sorted((BRAND / d).glob(pat))  # noqa: E731
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Axmed brand kit</title>
<meta name="description" content="Logo, colour, type, motion, components, social formats and imagery for Axmed web pages and social posts.">
<link rel="stylesheet" href="../system.css">
<link rel="stylesheet" href="../../site/site.css">
<link rel="stylesheet" href="kit.css">
</head>
<body class="kit">
<!-- GENERATED by scripts/build-kit.py. Edit the script, not this file. -->
<header class="kit-top"><div class="kit-wrap">
  <img src="../logo/axmed-logo.svg" alt="Axmed">
  <nav aria-label="Kit sections"><ul>
    <li><a href="#start">Start</a></li><li><a href="#logo">Logo</a></li><li><a href="#colour">Colour</a></li>
    <li><a href="#type">Type</a></li><li><a href="#motion">Motion</a></li><li><a href="#web">Web</a></li>
    <li><a href="#social">Social</a></li><li><a href="#imagery">Imagery</a></li><li><a href="#rules">Rules</a></li>
  </ul></nav>
</div></header>

<main>
<section class="kit-hero"><div class="kit-wrap">
  <h1>Axmed brand kit. <span>One system for web pages and social posts.</span></h1>
  <p>Everything here is live: the colours are read from <code>brand/system.css</code>, and the components are the same classes the website and the slides use. Change a token there and this page follows.</p>
</div></section>

<section class="kit-sec" id="start"><div class="kit-wrap">
  <h2>Start here</h2>
  <p class="kit-intro">Both surfaces load the same token file. The website adds its layout layer on top; social slides use the slide classes inside it.</p>
  <div class="kit-start">
    <div class="kit-box"><h3>A web page</h3><ol>
      <li>Link <code>system.css</code>, then <code>site.css</code>.</li>
      <li>Wrap content in <code>.wrap</code>; headlines use <code>.h2</code> with a quieter <code>&lt;span&gt;</code>.</li>
      <li>Build from the components below, never new colours or fonts.</li>
      <li>Run the lint and check 1440 and 390 wide.</li></ol>
<pre class="kit-code">&lt;link rel="stylesheet" href="system.css"&gt;
&lt;link rel="stylesheet" href="site.css"&gt;</pre></div>
    <div class="kit-box"><h3>A social post</h3><ol>
      <li>Link <code>brand/system.css</code>.</li>
      <li>Start from a <code>.slide</code> (1080 × 1350) or <code>.slide.sq</code> (1080 × 1080); add <code>.field</code>, <code>.warm</code> for the background.</li>
      <li>Place children absolutely: <code>.head</code>, <code>.lead</code>, <code>.big</code>, <code>.ui</code>, <code>.brand</code>.</li>
      <li>Render with <code>node scripts/render-carousel.mjs</code>.</li></ol>
<pre class="kit-code">&lt;div class="slide field"&gt;
  &lt;div class="big"&gt;4.2M&lt;/div&gt;
&lt;/div&gt;</pre></div>
  </div>
</div></section>

<section class="kit-sec" id="logo"><div class="kit-wrap">
  <h2>Logo</h2>
  <p class="kit-intro">Use the lockup by default. Clear space is at least half the mark's width on every side; the minimum height is 24 px. Never recolour, stretch or add effects.</p>
  <div class="kit-logos">
    <figure class="kit-logo"><div><img src="../logo/axmed-logo.svg" alt="Axmed lockup"></div><figcaption>Lockup, on light<br><span class="kit-path">logo/axmed-logo.svg</span></figcaption></figure>
    <figure class="kit-logo dark"><div><img src="../logo/axmed-logo-white.svg" alt="Axmed lockup, white"></div><figcaption>Lockup, on indigo or photos<br><span class="kit-path">logo/axmed-logo-white.svg</span></figcaption></figure>
    <figure class="kit-logo"><div><img src="../logo/axmed-mark.svg" alt="Axmed mark"></div><figcaption>Mark only, small spaces<br><span class="kit-path">logo/axmed-mark.svg</span></figcaption></figure>
    <figure class="kit-logo dark"><div><img src="../logo/axmed-mark-white.svg" alt="Axmed mark, white"></div><figcaption>Mark, on indigo<br><span class="kit-path">logo/axmed-mark-white.svg</span></figcaption></figure>
    <figure class="kit-logo"><div><img src="../logo/axmed-mark-mono-indigo.svg" alt="Axmed mark, one colour"></div><figcaption>One colour, patterns and watermarks<br><span class="kit-path">logo/axmed-mark-mono-indigo.svg</span></figcaption></figure>
    <figure class="kit-logo"><div><img src="../logo/sina-ray.svg" alt="Sina ray"></div><figcaption>Sina's ray, only next to Sina<br><span class="kit-path">logo/sina-ray.svg</span></figcaption></figure>
  </div>
</div></section>

<section class="kit-sec" id="colour"><div class="kit-wrap">
  <h2>Colour. <span>One anchor, one accent.</span></h2>
  <p class="kit-intro">Indigo leads, cyan is the single accent, and paper carries most of the space. Roughly 60% paper, 30% indigo, 10% cyan at most. No gradients across hues; glows stay in one hue. Click a token name to copy it.</p>
  <div class="kit-ratio" aria-hidden="true"><i style="flex:6; background: var(--paper); box-shadow: inset 0 0 0 1px var(--line)"></i><i style="flex:3; background: var(--indigo)"></i><i style="flex:1; background: var(--cyan)"></i></div>
  {swatches()}
</div></section>

<section class="kit-sec" id="type"><div class="kit-wrap">
  <h2>Type</h2>
  <p class="kit-intro">Three families, each with one job. Headlines are two-tone: a statement and a quieter continuation, never italic, never all caps, no labels above them.</p>
  <div class="kit-type">
    <div class="kit-spec"><div><b>Instrument Sans 600</b>Web headlines, big figures. <code>--display</code></div><p class="h2">Bring the list <span>you already have.</span></p></div>
    <div class="kit-spec"><div><b>Instrument Serif 400</b>Social statements. <code>--serif</code></div><p style="font: 400 clamp(36px, 4vw, 56px)/1.05 var(--serif)">Every birth.</p></div>
    <div class="kit-spec"><div><b>Instrument Sans 600, figures</b><code>.fig b</code> / <code>.big</code></div><p style="font: 600 clamp(56px, 7vw, 96px)/.9 var(--display); letter-spacing: -.04em">4.2M</p></div>
    <div class="kit-spec"><div><b>Inter 400</b>Body and UI. <code>--body</code></div><p class="p" style="margin:0; color: var(--ink-soft)">Short sentences, active voice, British spelling. Name the person and the place. One idea per post.</p></div>
    <div class="kit-spec"><div><b>Inter 500, captions</b>Sources, metadata</div><p style="font: 500 14px var(--body); color: var(--ink-quiet)">Source: Axmed impact report 2025</p></div>
  </div>
</div></section>

<section class="kit-sec" id="motion"><div class="kit-wrap">
  <h2>Motion</h2>
  <p class="kit-intro">Enter and exit on <code>--ease-out</code>, move on screen with <code>--ease-in-out</code>, hover colour on plain <code>ease</code>. Never <code>ease-in</code>. Reduced motion keeps fades and drops movement. Press a row to see the timing.</p>
  <div class="kit-scroll"><table class="kit-tbl"><thead><tr><th>Token</th><th>Use for</th><th>Easing</th><th>Try it</th></tr></thead><tbody>{motion_rows()}</tbody></table></div>
</div></section>

<section class="kit-sec" id="web"><div class="kit-wrap">
  <h2>Web components</h2>
  <p class="kit-intro">The classes from <code>site/site.css</code>. Product UI is one surface with real Axmed vocabulary: Matched, 1 question, Passed, In transit.</p>
  <h3>Buttons</h3>
  <div class="kit-row"><a class="btn primary" href="#web">Get started</a><a class="btn ghost" href="#web">Access platform</a><a class="btn primary big" href="#web">Bring your list</a></div>
  <h3>Status pills</h3>
  <div class="kit-row"><span class="st ok">Matched</span><span class="st ask">1 question</span><span class="st n">Reading</span></div>
  <h3>Product details</h3>
  <div class="kit-two">
    <div class="kit-win">
      <div class="q best"><b>Supplier A</b><div class="cost"><i style="--w:46%"></i></div><span class="st ok">Best value</span></div>
      <div class="q"><span>Supplier B</span><div class="cost"><i style="--w:68%"></i></div><span></span></div>
      <div class="q"><span>Supplier C</span><div class="cost"><i style="--w:84%"></i></div><span></span></div>
      <div class="ck2">{CK}<div><b>Ready for quotes</b><small>Every line matched</small></div></div>
    </div>
    <div class="kit-win"><ol class="tl"><li class="done"><b>Factory</b></li><li class="done"><b>Port</b></li><li class="now"><b>Warehouse</b></li><li><b>Clinic</b></li></ol></div>
  </div>
  <h3>Product shot</h3>
  <p class="kit-intro" style="margin-top:0">A product window on a tinted field, with one floating detail. Lavender is Sina, ice is quotes, sage is quality, blush is delivery; keep a module's tint the same everywhere.</p>
  <div class="kit-feat">{feature_card()}</div>
</div></section>

<section class="kit-sec" id="social"><div class="kit-wrap">
  <h2>Social formats</h2>
  <p class="kit-intro">Live <code>.slide</code> examples at a quarter of their size. Carousels are 1080 × 1350 (5–8 slides, cover and a closing slide); WhatsApp cards 1080 × 1080; video cut-downs 1920 × 1080 and 1080 × 1920 with captions burned in. Headlines stay under eight words. Start a carousel from <code>.claude/skills/axmed-carousel/template.html</code> and a photo post from <code>brand/photo-system/templates.html</code>; both follow these rules.</p>
  <div class="kit-slides">{SLIDES}</div>
</div></section>

<section class="kit-sec" id="imagery"><div class="kit-wrap">
  <h2>Imagery</h2>
  <p class="kit-intro">Click any image to open the full file.</p>
  <h3>Icons</h3>
  {gallery(g("icons", "*.svg"), "kit-icons contain", "24 px grid, 1.6 stroke in app indigo with one cyan detail, inside a mist square.")}
  <h3>Atmosphere backgrounds</h3>
  {gallery(g("backgrounds", "*_1080x1350.jpg"), "portrait", "Always with real content on top. Also in 1080 × 1080 and 1920 × 1080.")}
  <h3>Strata</h3>
  {gallery(g("strata", "*_1080x1350.jpg"), "portrait", "For “everything coming together” stories. Text in the sky or on a panel, never across the layers.")}
  <h3>Patterns</h3>
  {gallery(g("patterns", "*_1080x1080.svg"), "", "Built from the mark's geometry. Every size is in brand/patterns/.")}
  <h3>Line illustrations</h3>
  {gallery(g("illustrations", "*.png"), "contain", "Grey construction lines, one indigo key line, one cyan point.")}
  <h3>Dot-matrix</h3>
  {gallery(g("dot-matrix", "*.jpg"), "wide", "Open brand/dot-matrix/index.html for the live, animated set.")}
  <h3>Product images</h3>
  {gallery(g("product-images", "*.png"), "contain", "Illustrative interfaces. Label them as such until real captures replace them.")}
  <h3>Mood photos</h3>
  {gallery(g("photos/generated", "*.[pj][np]g"), "portrait", "AI-generated mood imagery. Never pair it with a name, a quote or a named place, and never use it in place of a partner.")}
</div></section>

<section class="kit-sec" id="rules"><div class="kit-wrap">
  <h2>Rules</h2>
  <div class="kit-rules">
    <div class="kit-box kit-do"><h3>We do</h3><ul>
      <li>Put the buyer first: midwives, procurement officers, programme leads, in their own words.</li>
      <li>Show the product working: AI quoting, QA checks, live tracking.</li>
      <li>Use numbers with a source, from <code>strategy/fact-sheet.md</code> or the 2025 impact report.</li>
      <li>Show Africa modern, urban and rural, confident.</li>
      <li>Keep one idea per post and five elements or fewer in view.</li></ul></div>
    <div class="kit-box kit-dont"><h3>We never</h3><ul>
      <li>Invent numbers, quotes, partners or prices. Write [NUMBER NEEDED] instead.</li>
      <li>Use AI faces for named people or partners, or synthetic testimonials.</li>
      <li>Show poverty imagery or Axmed as the hero.</li>
      <li>Add eyebrows, tracked capitals, italic accent words or arrows glued to labels.</li>
      <li>Blend hues in a gradient or put a card inside a card.</li></ul></div>
  </div>
  <h3>Before anything goes out</h3>
  <ol class="kit-check">
    <li>Every colour, font and timing comes from <code>system.css</code>.</li>
    <li>Web: <code>node .claude/skills/hallmark/scripts/sloplint.mjs site/system.css site/site.css site/index.html --genre modern-minimal</code> shows 0 FAIL, and the page works at 1440 and 390 wide.</li>
    <li>Copy passes the stop-slop rules and the voice table in <code>brand/brand-guidelines.md</code>.</li>
    <li>Felix approves every public number and claim; QA checks product and impact statements; partners approve their own story.</li>
  </ol>
</div></section>
</main>

<footer class="kit-foot"><div class="kit-wrap">Generated by <code>scripts/build-kit.py</code> from <code>brand/system.css</code> and the brand folders. Full guidance: <code>brand/brand-guidelines.md</code>, <code>brand/WEB-DESIGN.md</code>.</div></footer>

<script>
(function () {{
  var root = getComputedStyle(document.documentElement);
  document.querySelectorAll('[data-hex]').forEach(function (el) {{ el.textContent = root.getPropertyValue('--' + el.dataset.hex).trim(); }});
  document.querySelectorAll('[data-var]').forEach(function (el) {{ el.textContent = root.getPropertyValue(el.dataset.var).trim(); }});
  document.querySelectorAll('[data-copy]').forEach(function (b) {{
    b.addEventListener('click', function () {{
      var t = b.dataset.copy, old = b.textContent;
      try {{ navigator.clipboard.writeText(t).then(function () {{ b.textContent = 'Copied'; setTimeout(function () {{ b.textContent = old; }}, 1200); }}); }} catch (e) {{}}
    }});
  }});
  document.querySelectorAll('.kit-run').forEach(function (b) {{
    var i = b.querySelector('i');
    b.addEventListener('click', function () {{
      i.style.transition = 'transform var(' + b.dataset.dur + ') var(' + b.dataset.ease + ')';
      b.classList.toggle('go');
    }});
  }});
  function fit() {{
    document.querySelectorAll('.kit-slide').forEach(function (f) {{
      var box = f.querySelector('.kit-fit'), s = f.querySelector('.slide');
      var k = box.clientWidth / 1080; s.style.transform = 'scale(' + k + ')';
      box.style.height = (s.offsetHeight * k) + 'px';
    }});
  }}
  fit(); addEventListener('resize', fit);
}})();
</script>
</body>
</html>
"""


def main() -> None:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(page())
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

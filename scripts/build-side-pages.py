"""Build site/buyers.html and site/suppliers.html from the homepage.

The side pages reuse the homepage's own blocks (nav, logo, "What you get" bento, "How it works",
close, footer) so a change on the homepage reaches them on the next run:

    python3 scripts/build-side-pages.py

Only the hero, proof strip, "who it is for" grid and FAQ are written here. Every number comes from
strategy/fact-sheet.md, worded as its "Safe to say publicly" column.
"""

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
home = (SITE / "index.html").read_text()


def between(start: str, end: str, s: str = home, include_end: bool = True) -> str:
    a = s.index(start)
    b = s.index(end, a) + (len(end) if include_end else 0)
    return s[a:b]


def utm(path: str, page: str, content: str) -> str:
    sep = "&amp;" if "?" in path else "?"
    return f"{path}{sep}utm_source=website&amp;utm_medium={page}&amp;utm_campaign=every-birth&amp;utm_content={content}"


head_tpl = between("<!DOCTYPE html>", "</head>")
nav = between('<header class="nav">', "</header>")
footer = between('<footer class="foot">', "</footer>")
# same ?v= cache tag as the homepage's site.js, so a browser never mixes old scripts with new styles
import re as _re
V = _re.search(r'site\.js\?v=(\d+)', (SITE / "index.html").read_text())
V = "?v=" + V.group(1) if V else ""
scripts = (
    f'<script src="dm/shapes.js{V}"></script>\n<script src="dm/dotmatrix.js{V}"></script>\n'
    f'<script src="dm/dotmap.js{V}"></script>\n<script src="site.js{V}"></script>'
)

# the homepage blocks, one side only: the tabs go, the other side's panel goes
get_buy = between('<div class="panel" id="buyers"', '\n  <div class="panel" id="suppliers"', include_end=False)
get_sell = between('<div class="panel" id="suppliers"', "\n</div></section>", include_end=False)
# How it works left the homepage for Solutions; the side pages still read it from its partial
hw = (SITE / "partials" / "how-it-works.html").read_text()
hw_buy = between('<div class="panel" id="hw-buyers"', '\n  <div class="panel" id="hw-suppliers"', hw, include_end=False)
hw_sell = between('<div class="panel" id="hw-suppliers"', "\n</div></section>", hw, include_end=False)
close_map = '<canvas class="cl-map" aria-hidden="true"></canvas>'


def one_side(panel: str) -> str:
    # a lone panel: no tab semantics, never hidden
    panel = re.sub(r' role="tabpanel" aria-labelledby="[^"]+"', "", panel, count=1)
    return panel.replace(" hidden>", ">", 1)


def page_nav(current: str) -> str:
    n = nav.replace('href="#top" aria-label="Axmed home"', 'href="index.html" aria-label="Axmed home"')
    for label, href in [("Buyers", "buyers.html"), ("Suppliers", "suppliers.html"), ("Sina", "index.html#sina"),
                        ("Solutions", "index.html#solutions"), ("Impact", "index.html#impact")]:
        cur = ' aria-current="page"' if label == current else ""
        n = re.sub(rf'<a href="[^"]*">{label}</a>', f'<a href="{href}"{cur}>{label}</a>', n, count=1)
    return n


def page_footer() -> str:
    f = footer.replace('href="#sina"', 'href="index.html#sina"').replace('href="#solutions"', 'href="index.html#solutions"')
    return f


def faq(items: list[tuple[str, str]]) -> str:
    rows = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items)
    return f'<div class="faq">{rows}</div>'


def page(*, slug, title, desc, current, hero, proof, who_h, who, get_h, get_panel, hw_h, hw_panel,
         faq_items, close_h, close_p, close_act, close_alt):
    h = head_tpl.replace(re.search(r"<title>.*?</title>", head_tpl).group(0), f"<title>{title}</title>")
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', h)
    who_html = "".join(f'<li><b>{a}</b><span>{b}</span></li>' for a, b in who)
    hw_sec = (f'<section class="hw" id="how" aria-labelledby="hw-h"><div class="hw-pin">\n'
              f'  <div class="wrap hw-top"><h2 class="h2" id="hw-h">{hw_h}</h2></div>\n'
              f'  {one_side(hw_panel)}\n</div></section>')
    return f"""{h}
<body class="site side-page">
<a class="skip" href="#main">Skip to content</a>
{page_nav(current)}

<main id="main">
{hero}

<section class="pf" aria-label="In numbers"><div class="wrap">{proof}</div></section>

<section class="who" aria-labelledby="who-h"><div class="wrap">
  <h2 class="h2" id="who-h">{who_h}</h2>
  <ul class="who-g">{who_html}</ul>
</div></section>

<section class="get arm" id="get" aria-labelledby="get-h"><div class="wrap">
  <div class="get-top"><h2 class="h2" id="get-h">{get_h}</h2></div>
  {one_side(get_panel)}
  <p class="note">Interfaces shown are illustrative. Buyer and country counts: MNCH supply, Axmed marketplace data, November 2026.</p>
</div></section>

{hw_sec}

<section class="qa" aria-labelledby="qa-h"><div class="wrap">
  <h2 class="h2" id="qa-h">Questions <span>we hear most.</span></h2>
  {faq(faq_items)}
</div></section>

<section class="close" aria-labelledby="cl-h"><div class="wrap">
  <div class="cl-copy">
    <h2 class="h2" id="cl-h">{close_h}</h2>
    <p class="p">{close_p}</p>
    <div class="cl-act">{close_act}</div>
    {close_alt}
  </div>
  {close_map}
</div></section>
</main>

{page_footer()}
{scripts}
</body></html>
"""


def hero(*, eyebrow, h1, lead, act, art, tone):
    return f"""<section class="ph {tone}" id="top"><div class="wrap">
  <div class="ph-copy">
    <p class="ph-eye">{eyebrow}</p>
    <h1>{h1}</h1>
    <p class="ph-lead">{lead}</p>
    <div class="ph-act">{act}</div>
  </div>
  <div class="ph-art" aria-hidden="true">{art}</div>
</div></section>"""


CHECK = '<svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5"/></svg>'

# --- buyers ---------------------------------------------------------------------------------------
buy_art = (
    '<div class="ui ph-a"><div class="ui-h"><span class="xls">XLS</span><div><b>2027_MNCH_order.xlsx</b><small>18 lines matched</small></div><em class="pill ok">Read</em></div>'
    '<div class="ui-r"><span class="site"><i class="d a"></i>Carbetocin 100 mcg/mL</span><span class="num">40,000</span></div>'
    '<div class="ui-r"><span class="site"><i class="d b"></i>Calibrated drape</span><span class="num">25,000</span></div>'
    '<div class="ui-r"><span class="site"><i class="d c"></i>Tranexamic acid 100 mg/mL</span><span class="num">12,000</span></div></div>'
    '<div class="ui ph-b"><div class="ui-h"><div><b>Your offer</b><small>6 quotes per line, delivered</small></div><em class="pill tr">Within 48 hours</em></div>'
    '<div class="ui-c">' + CHECK + '<span>Prices line by line</span></div>'
    '<div class="ui-c">' + CHECK + '<span>Quality checked</span></div>'
    '<div class="ui-c">' + CHECK + '<span>Delivered to every site</span></div></div>'
)
buyers = page(
    slug="buyers",
    title="Axmed · For buyers",
    desc="Bring your order list. Qualified suppliers compete on every line, and you get an offer within 48 hours.",
    current="Buyers",
    hero=hero(
        tone="buy",
        eyebrow="For buyers",
        h1="Your whole list, <span>priced in 48 hours.</span>",
        lead="National medical stores, ministries, hospitals and programmes bring the list they already have. "
             "Qualified suppliers compete on every line. We check it, ship it and track it to every site.",
        act=f'<a class="btn primary big" href="{utm("/buy", "buyers", "hero")}">Bring your list</a>'
            f'<a class="btn ghost big" href="{utm("https://app.axmed.com/login", "buyers", "hero")}">Activate an account</a>',
        art=buy_art,
    ),
    proof='<div><b>24</b><span>buyers in 13 countries get MNCH supply through Axmed</span></div>'
          '<div><b>3.8M</b><span>doses of heat-stable carbetocin ordered across 8 countries</span></div>'
          '<div><b>3.4M+</b><span>calibrated drapes ordered</span></div>',
    who_h="Built for the people <span>who keep shelves full.</span>",
    who=[("National medical stores", "Central and regional stores buying for a whole system."),
         ("Ministries and state agencies", "Public programmes with fixed budgets and many sites."),
         ("Faith-based networks", "Hospitals and clinics buying together."),
         ("NGOs and programmes", "Maternal health, family planning and more, delivered where you work.")],
    get_h="What you get <span>with Axmed.</span>",
    get_panel=get_buy,
    hw_h="How buying works, <span>start to finish.</span>",
    hw_panel=hw_buy,
    faq_items=[
        ("What can I send?", "The list you already have: Excel, PDF or a message. Sina matches each line to a real product."),
        ("How fast do I get an offer?", "Within 48 hours of sending your list."),
        ("Do I need an account first?", "No. Send your list and see the cost before you sign up."),
        ("Who checks quality?", "Our QA and regulatory team checks the supplier, the product, its registration and the batch before anything ships."),
        ("Can you deliver to many sites?", "Yes. One contract, delivered to the stores, hospitals and clinics on your list, and tracked to each one."),
        ("Is there help with funding?", "Working capital can cover the gap while your funding lands, and the MNCH Matching Fund supports maternal and newborn health."),
    ],
    close_h="Bring your list. <span>We price it with real products.</span>",
    close_p="Send us your 2027 list. Get an offer within 48 hours.",
    close_act=f'<a class="btn primary big" href="{utm("/buy", "buyers", "close")}">Bring your list</a>'
              f'<a class="btn ghost-d big" href="{utm("https://app.axmed.com/login", "buyers", "close")}">Activate an account</a>',
    close_alt='<p class="cl-fund">Funding a programme? <a href="mailto:info@axmed.com?subject=Expression%20of%20interest">Register an expression of interest</a></p>',
)

# --- suppliers ------------------------------------------------------------------------------------
sell_art = (
    '<div class="ui ph-a"><div class="ui-h"><div><b>Open tenders</b><small>Closing soonest first</small></div></div>'
    '<div class="ui-r tn"><span><b>Carbetocin 100 mcg/mL</b><small>40,000 ampoules, 6 buyers</small></span><em class="pill v">9 days left</em></div>'
    '<div class="ui-r tn"><span><b>Tranexamic acid 100 mg/mL</b><small>25,000 ampoules, 4 buyers</small></span><em class="pill n">14 days left</em></div>'
    '<div class="ui-r tn"><span><b>Oxytocin 10 IU/mL</b><small>60,000 ampoules, 8 buyers</small></span><em class="pill n">21 days left</em></div></div>'
    '<div class="ui ph-b"><div class="ui-h"><div><b>Your quote</b><small>Carbetocin 100 mcg/mL</small></div><em class="pill n">Draft</em></div>'
    '<div class="ui-r"><small>Lead time</small><span>8 weeks</span></div>'
    '<div class="ui-r"><small>Quality</small><span>WHO prequalified</span></div>'
    '<div class="ui-btn">Send to all 6 buyers</div></div>'
)
suppliers = page(
    slug="suppliers",
    title="Axmed · For suppliers",
    desc="See pooled demand from buyers across Africa, quote once, get qualified once and know when you get paid.",
    current="Suppliers",
    hero=hero(
        tone="sell",
        eyebrow="For suppliers",
        h1="New markets, <span>one quote at a time.</span>",
        lead="We pool orders from many buyers into tenders worth serving. Quote once, get qualified once, "
             "and follow every order from purchase order to payment.",
        act=f'<a class="btn primary big" href="{utm("/sell", "suppliers", "hero")}">Bring your portfolio</a>'
            f'<a class="btn ghost big" href="https://www.axmed.com/contact">Talk to the supply team</a>',
        art=sell_art,
    ),
    proof='<div><b>24</b><span>buyers in 13 countries get MNCH supply through Axmed</span></div>'
          '<div><b>3.8M</b><span>doses of heat-stable carbetocin ordered across 8 countries</span></div>'
          '<div><b>1M+</b><span>calibrated drapes delivered</span></div>',
    who_h="For manufacturers <span>ready to grow.</span>",
    who=[("Manufacturers", "Quality-assured medicines and medical devices."),
         ("Prequalified and SRA-approved", "Your approvals, reused on every tender."),
         ("Growing into new markets", "Buyers across Africa, without new offices."),
         ("Maternal and newborn health", "Where pooled demand is already flowing.")],
    get_h="What you get <span>with Axmed.</span>",
    get_panel=get_sell,
    hw_h="How supplying works, <span>start to finish.</span>",
    hw_panel=hw_sell,
    faq_items=[
        ("Which documents do I need?", "Your GMP certificate, product registration, WHO prequalification where you have it, and a certificate of analysis. You share them once."),
        ("How are tenders priced?", "Per unit, delivered. One quote reaches every buyer in the tender, under one contract."),
        ("Who reviews my documents?", "Our QA team reviews them with you, and we reuse them on each tender."),
        ("When do I get paid?", "Each order has clear milestones from purchase order to payment, and you can follow each one."),
        ("Do I need an office in each country?", "No. Axmed pools buyers from many countries into one tender."),
    ],
    close_h="Bring your portfolio. <span>Meet pooled demand.</span>",
    close_p="Show us what you make. We will show you the open tenders it fits.",
    close_act=f'<a class="btn primary big" href="{utm("/sell", "suppliers", "close")}">Bring your portfolio</a>'
              f'<a class="btn ghost-d big" href="https://www.axmed.com/contact">Talk to the supply team</a>',
    close_alt="",
)

(SITE / "buyers.html").write_text(buyers)
(SITE / "suppliers.html").write_text(suppliers)
print("wrote site/buyers.html, site/suppliers.html")

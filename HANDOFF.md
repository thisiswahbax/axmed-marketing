# Handoff: where the work stands (15 Nov 2026)

Read `CLAUDE.md` first, then this note. Preview of the latest build: https://claude.ai/artifact/GMNNtPYCVmCJcyNukF1oiX

## First, check the repo is in sync
The last update may not have been committed (the Mac went offline mid-save):
```
git status
# if site-update8.zip is listed:
unzip -o site-update8.zip && rm site-update8.zip && git add -A site && git commit -m "Site: impact section redesign"
git push
```

## Homepage prototype (`site/`)
Open `site/index.html` in a browser (three.js loads from cdnjs, so you need a network connection). Sections in order:

| Section | Files | What it does |
|---|---|---|
| Scroll hero | `hero-order.js`, `.h3d` in `site.css` | "Your order list becomes a delivery", on the brand ice-mist field (`img/ice-mist.jpg`, from `brand/backgrounds/`) in the isometric line style of the marketplace's landing art (`axmed-marketplace/frontend/art/iso.mjs`): flat faces in cool near-neutral tones, fat indigo outlines (three r128 `LineSegments2` from jsDelivr, 1px lines if they fail to load), indigo and cyan as the only colour. Few, large objects; the camera follows the story. Pinned for 3 scenes: an order sheet with six lines; the lines lift off as cartons onto one pallet while three suppliers' stacks rise and one is picked; a truck, a ship and a plane rise round the pallet, take two cartons each and leave by land, sea and air (cyan road, waterway, dashed flight path), all toward the right, away from the copy. From 0.8 the vehicles sink away and the camera pulls back to a dot map of Africa (`dm/dotmap.js`), laid flat but turned north-up and stretched by 1/sin(35.26°) so the iso view does not squash it; seven illustrative pins drop in with dashed routes. Any fat-line material must get `resolution` in `resize()`, or it draws screen-sized. Test hook: `window.h3dAt(0..1)` holds a frame, `h3dAt(null)` hands back to scroll. Earlier heroes kept, unused: `hero3d.js` (dot globe), `hero-flow.js` (dark blocks), `hero-iso.js` (six sites) |
| The mark, explained (**hidden**, parked 15 Nov: remove `hidden` on `section.mk` to bring it back) | `mark3d.js`, `.mk` in `site.css` | Dark band after "Where you are born", pinned for 3 scenes: two white ribbons apart (labelled Buyers / Suppliers), a double helix with cyan links growing in, then the real Axmed mark extruded in 3D from `brand/logo/mark-paths.json` (parsed in the script, no extra loader). Reduced motion or no WebGL: the three captions stand as text. Test hook: `window.mkAt(0..1)` |
| Where you are born | `.split`, dot figures in `site.js` | The problem, placed before the mark section. Photo (`photos/hospital-pharmacy.jpg`, generated 15 Nov: a pharmacist checks a delivery in a modern city hospital pharmacy, cropped 3:4; replaces the rural health-centre shot) with a slow zoom; 80% (people) and <6% (medicine revenue) as two 25×4 dot grids that fill column by column, so they read as bars on one scale; numbers count up. Closes on "Medicine supply follows revenue, not people. Axmed brings the two sides together.", which hands over to the mark |
| What you get | `.get`, `.bento`, `.gt`, `.ui` in `site.css` | Buyers / Suppliers switch, six tiles each after the August tinted bento: dot-matrix icon (`canvas.dm.icon`, `data-cells`, `data-theme`) beside a serif title, one line, and an illustrative product card with a ghost card behind it, bleeding off the tile's bottom (and right, on wide tiles). Suppliers' hero tile carries a dot-matrix globe (`canvas.gx`, indigo theme, starts when first on screen). The switch also sets the How it works tabs (`setSide()` in `site.js`) |
| How it works | `.hw`, `.hw-rail`, `.hw-track`, `.hw-step` in `site.css`; script in `site.js` | "Start to finish": four step panels on one track. Wide screens pin the section and scroll slides the track sideways (next step peeks in); the numbered rail fills and jumps to a step. Narrow screens and reduced motion swipe natively. Product scenes are `.ps` (tinted, card rising from the bottom edge, one callout); see `brand/WEB-DESIGN.md` |
| Sina | `sina-scroll.js`, `.sx` in `site.css`, live orb `sina/sina-orb.js` | Centred, scrubbed by scroll: Sina grows, says "Hi, I'm Sina.", the orbit draws, formats connect, then 4 steps with cards growing out of the orb. Test hook: `window.sxAt(0..1)` |
| Impact | `.impact` | Strata band, oversized count-up figures (2025 impact report). The financing cards moved into "What you get" |
| Partner stories | `.voices`, script in `site.js` | One partner at a time as two tiles: the quote large in the serif with an initials byline (no photos: faces are never paired with quotes), and an indigo proof tile with their delivered figures from the fact sheet's partner data over a dot-matrix drawing (`canvas.vo-dm`, re-assembles on each switch). Partner names below are the controls and a 9s timer |
| Close | `.close`, `.cl-map` in `site.js`, data `dm/dotmap.js` | Dark band, one ask per audience (buyers, suppliers, funders). Dot-matrix Africa that ripples out from Nairobi and glints cyan. Regenerate the map with `python3 scripts/make-dotmap.py <ne_110m_admin_0_countries.geojson>` |
| Split "Where you are born" | `.split`, `.sp-dots` in `site.css`, split block in `site.js` | One compact band. The photo (`photos/hospital-pharmacy.jpg`) is drawn on a canvas as the brand dot grid: plain grey dots like the 100-square figures beside it resolve on scroll into an indigo halftone (dot size from darkness), sweeping from top-left. Reduced motion shows the halftone at once. Earlier tries (photo masked by the Axmed mark, plain rounded photo) were rejected |
| Footer | `.foot`, `.ft-*` | Light paper after the dark close: brand line plus "Talk to us" (email, offices), four link groups (Buy, Supply, Platform, Company), base row with logo, © and the illustrative note, back to top |
| Order tracker card | `.trk` | Delivery tracker in "Track every order to every site": stops on a vertical rail, solid where delivered, dashed ahead, cyan ping on the stop in transit |
| Side pages | `buyers.html`, `suppliers.html`, built by `scripts/build-side-pages.py` | Re-run the script after changing the homepage: it copies nav, footer, the matching "What you get" bento and "How it works" panel, and the close. Own parts: `.ph` hero (two product cards on ice-mist), `.pf` proof strip (fact-sheet figures only), `.who-g` audience grid, `.faq`. Shared draft: https://claude.ai/artifact/1iBTVDxR1Z3qu8fKwsPasH (private until shared; republish from a copy of `site/`) |

## Rules that stay
- Lint before every publish: `node .claude/skills/hallmark/scripts/sloplint.mjs site/system.css site/site.css site/index.html --genre modern-minimal` (currently 0 FAIL).
- Motion: use the tokens in `brand/system.css` (`--ease-out`, `--ease-in-out`, `--dur-*`). The audit is in `site/MOTION.md`. Review new motion with `.claude/skills/review-animations` and plan bigger changes with `improve-animations` and `choreograph`.
- Photos in `brand/photos/generated/` are AI-generated (Higgsfield). Use them as mood imagery only: don't name the people or pair a face with a quote. The footer says imagery is illustrative. Swap in real photos with consent when we have them.
- Never invent numbers or quotes. Figures come from `strategy/fact-sheet.md` and the 2025 impact report. Label illustrative UI.
- Sina appears in one section only (the user asked to cut Sina everywhere else). The "Hi, I'm Sina" greeting goes against the Sina voice rules; the user chose it for this page only.
- References: `brand/moodboard/references.md`, with screenshots in `brand/moodboard/refs/`.

## Homepage v2 (15 Nov 2026)
Plan and open questions: `site/PLAN-homepage-v2.md`. Built: What you get, How it works (rebuilt as a sideways track), partner stories, close. Copy trimmed from about 650 to 521 visible words (lint warns above 450; most of the rest is illustrative product UI in How it works and Sina).
Product images: the PNGs in `brand/product-images/` still show the old scenes until `node scripts/render-product-images.mjs` is run. The step icons in `brand/icons/` (bring-your-list, compare-quotes and the other six) are no longer used on the page.
Still open: the savings figure conflict (Impact shows 35%, the fact sheet says do not publish savings yet), supplier positioning is not in `strategy/`, supplier payment terms ("Know when you get paid"), the `/sell` sign-up URL, and whether live order tracking is in the product today.

## Next up (what the user has been pushing for)
1. Keep raising the bar to "Apple level". The user reviews each section by eye and flags anything that "looks small", "poor" or "boring".
2. Review the v2 sections by eye (What you get, partner stories, close) and resolve the open items above.
3. Trim copy (the page is about 650 words; Hallmark warns above 450).
4. Optional: the Intercom-style moving line ribbon somewhere on the page (the dot map now carries the close).
5. Open items: fact-sheet sign-off (80% / <6%, 35%, 4.2M); whether Sina's /buy flow is live; the CHAMPION citation and the Ghana reference.

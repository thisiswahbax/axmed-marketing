---
name: axmed-web-design
description: The Axmed website and product-imagery design system, with its patterns, assets and motion rules. Use for any work on site/ (the homepage prototype), new web sections, product images or UI mockups, scroll animations, or whenever someone asks for something to look "premium", "Apple level" or "like the references".
---

# Axmed web design system

The approved look is the live homepage prototype in `site/`. **Before designing anything new, open `site/index.html` in a browser and study the section closest to what you're building, then reuse its classes and assets.** Don't invent a parallel style.

## The bar
The user compares every section with Apple, Intercom, Zaro, August Health, Skydive and ElevenLabs. The screenshots are in `brand/moodboard/refs/` (open them) and the notes in `brand/moodboard/references.md`. The feedback so far: "looks small", "poor", "boring", "colours not blending". Default to **big, layered, tinted and quiet**: large type, generous space, product shown on art, one accent.

## Foundations (always)
- **Tokens only.** Colours, fonts and motion come from `brand/system.css` (copied into `site/system.css`; keep the two in sync). No hex values or bare cubic-beziers in components.
- **Type:** Instrument Serif for headlines; Instrument Sans for big figures and UI headings; Inter for body and UI.
- **Two-tone headline** (Intercom/Zaro): `<h2 class="h2">Statement <span>quieter continuation.</span></h2>`. The span takes `--indigo-quiet` on light and `--on-indigo-soft` on dark. Never italic.
- **Colour:** indigo `#261C7A` / app indigo `#392AB0` lead; cyan `#0CC4FF` is the single accent (one lit idea per visual). Light sections sit on `--paper` or the mists (`--indigo-mist`, `--cyan-mist`, `--sage-mist`, `--blush-mist`). Dark sections use `--indigo-ink` with an indigo glow. **No purple-to-blue gradients**: single-hue glows only.

## Patterns and where they live
| Pattern | Use it for | Built from |
|---|---|---|
| **Wallpaper art card** (Apple) | Any product image: a white app window floats on Axmed art with one floating detail card | `.feat .art` + `.comp .win` + `.float`; wallpapers in `site/img/wp/` (indigo-haze, indigo-dusk, cyan-deep, cyan-mist, lilac-mist, strata-brand, strata-light, strata-warm); sources in `brand/backgrounds/`, `brand/strata/` |
| **Product window details** | Make UIs rich, not wireframes | `.ln` (raw line to matched product), `.q` + `.cost` bars, `.ck2` checklist, `.ring` progress, `.map` dotted route, `.doc` files, `.fld` form fields, `.tl` timeline, `em.ok / .ask / .tr / .n / .tag` pills |
| **Custom icons** | Feature captions, step lists, cards | Inline 24px SVG, stroke 1.6 in `--indigo-app` with ONE cyan detail (`class="a"`), inside a 44–48px rounded `--indigo-mist` square. Examples: the eight icons in How it works and the two in Impact. No icon fonts or emoji |
| **Dot-matrix** (Zaro) | Illustrations with motion, small animated icons, maps | `brand/dot-matrix/` (`AxDotMatrix(canvas,{shape,theme,icon})`, shapes in `shapes.js`); gallery `brand/dot-matrix/index.html` |
| **Dot globe** | Hero and "network" moments | `site/hero3d.js` (three.js) |
| **Strata art** | Dark bands, closing CTAs, wallpapers | `brand/strata/`, generator `scripts/make-terrain.py` |
| **Atmosphere mists** (ElevenLabs) | Light section backgrounds, behind the orb | `brand/backgrounds/`, `site/img/mist.jpg` |
| **Sina orb** | Sina only (one section on the page) | Live WebGL `site/sina/sina-orb.js` (`createSinaOrb(canvas).setState('idle'|'listening'|'working'|'speaking')`); GIF fallback `sina-flow.gif` |
| **Notched photo card / white title strip** (Zaro) | Photo storytelling | `.card figcaption`, `.split .shot figcaption` |
| **Living figures** | Statistics | Count-up plus 100-square grid (`.dotfig`) or oversized numerals on strata (`.impact`) |
| **Pinned scroll scenes** | Hero, Sina, How it works | Sticky `*-pin` inside a tall section; progress 0..1 from `getBoundingClientRect`; everything scrubbed by scroll. Test hooks `h3dAt()`, `sxAt()` |

## Motion (non-negotiable)
Run `.claude/skills/review-animations` on every motion change; plan bigger changes with `improve-animations` and `choreograph`. The audit is in `site/MOTION.md`.
- Easing: `--ease-out` for enter and exit, `--ease-in-out` for on-screen moves, `ease` for hover colour. Never `ease-in`.
- Durations: `--dur-press 160ms`, `--dur-ui 220ms`, `--dur-swap 320ms`, `--dur-scene 640ms` (marketing scenes only).
- Choreograph: the lead moves furthest, support follows at +70–120ms, decoration only fades. Exits are simultaneous and shorter. Mask crossfades with a 2px blur.
- Press feedback is `scale(.97)`. Hover lifts only inside `(hover: hover) and (pointer: fine)`.
- Set `transform` and `opacity` directly on elements. Don't drive child transforms through CSS variables on a parent.
- Reduced motion keeps fades and drops movement. Hidden-at-rest states sit under `.js` so the page works without JS.

## Content rules
- Never invent numbers, quotes, partners or prices. Figures come from `strategy/fact-sheet.md` and the 2025 impact report; otherwise write `[NUMBER NEEDED]`. Label illustrative UI and maps.
- Photos in `brand/photos/generated/` are AI-generated mood imagery: no names, never paired with a quote or a named place. The footer says imagery is illustrative.
- Sina appears in one section only. Her voice: a calm procurement colleague, no AI hype. The page greeting "Hi, I'm Sina" was the user's explicit choice for that section.
- Hallmark floor: no eyebrows or tracked capitals, no arrow glued to a label, no card inside a card, `:focus-visible` on everything interactive.

## Before you hand back
1. Lint: `node .claude/skills/hallmark/scripts/sloplint.mjs site/system.css site/site.css site/index.html --genre modern-minimal` must show 0 FAIL.
2. Screenshot desktop (1440×900) and mobile (390×844) with Playwright at the key scroll positions, and look at them. Check that nothing is small, cramped or overlapping, and that nothing is left over from earlier designs.
3. Compare against the matching reference in `brand/moodboard/refs/`. If yours looks plainer, keep going.

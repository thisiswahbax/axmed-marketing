# Dot-matrix illustrations (with motion)

Axmed shapes drawn as pixel dots on a construction grid, after Zaro's security illustrations.
Dots scatter in, assemble into the shape, then a soft scan passes and the cyan points glint. Reduced motion = a still frame.

**See them:** open `index.html` (all shapes, live). `?shape=shield&theme=paper&size=720` shows one.
**Export a loop:** `node scripts/export-dotmatrix.mjs <shape> [night|paper|indigo] [size] [seconds]` → `exports/<shape>-<theme>.mp4` + `.png` (MP4s are git-ignored; share them from the drive).
**Use on a page:** include `shapes.js` + `dotmatrix.js`, then `AxDotMatrix(canvas, { shape: "globe", theme: "night" })`.

| Shape | Use case |
|---|---|
| `list` | Sina reads your list, Benchmark Challenge |
| `shield` | QA, regulatory checks, verification |
| `vial`, `ampoule` | Products, the PPH bundle, heat-stable carbetocin |
| `box` | Shipments, logistics |
| `globe` | Multi-site delivery, countries served |
| `orb` | Sina (when the real orb is too heavy for the layout) |
| `mark` | The Axmed mark, brand moments |
| `sheet`, `page`, `chat`, `mail` | The formats Sina reads (Excel, PDF, WhatsApp, email), used on the Sina orbit |

**Options:** `icon: true` draws on a transparent canvas with no grid. `cy: 0.36` moves the shape's centre up (share of the height) to leave room for a caption. `manual: true` returns `drawAt(t)` so scroll or your own clock can drive the assembly (the homepage Sina orbit does this).

**Add a shape:** add an entry to `shapes.js` with SVG paths in a 0–100 box: `fill` (dithered body), optional `edge` (outline), `accent` (the cyan points, keep it small: one idea lit per shape).

**Rules:** one lit idea per illustration (the check, the matched line, the delivered pin). Cyan only on that idea. Labels next to an illustration are sentence case in Inter, not tracked capitals.

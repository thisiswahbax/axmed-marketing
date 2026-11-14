# Handoff: where the work stands (Nov 2026)

Read CLAUDE.md first. This note covers what was in progress.

## Homepage prototype (`site/`)
- Open: `open site/index.html` (three.js loads from cdnjs, so you need a network connection).
- Published preview: https://claude.ai/artifact/GMNNtPYCVmCJcyNukF1oiX
- `site/hero3d.js`: the scroll hero. It's a dot globe on a light mist with three pinned scenes (facilities, then supplier routes into the Sina hub, then cyan routes out). For testing, `window.h3dAt(0..1)` renders any scroll position.
- `site/site.css`: the layout layer. Every colour and font comes from tokens in `site/system.css` (a copy of `brand/system.css`; keep the two in sync).
- Lint: `node .claude/skills/hallmark/scripts/sloplint.mjs site/system.css site/site.css site/index.html --genre modern-minimal`. It shows 0 FAIL now. The open warning is that the page has more words than Hallmark's limit (aim for 450).

## Next up
1. A moving line ribbon (Intercom reference) in indigo and cyan, for the closing band or behind the Sina card. It could reuse three.js or `scripts/make-terrain.py`.
2. A dot-matrix world map at the edges of the closing CTA (Zaro reference). Use `brand/dot-matrix/`.
3. Small dot-matrix icons beside the How-it-works titles (August reference).
4. Real photos for the three `.cut` people cards in `site/index.html`. They must be Axmed or partner photos, with consent.
5. Cut copy towards 450 words.

## Rules that stay
- No AI-generated people presented as real. No Pexels, Unsplash or Pixabay images picked by AI.
- Never invent numbers or quotes. Figures come from `strategy/fact-sheet.md` (still needs sign-off).
- Label illustrative UI and maps.
- References are in `brand/moodboard/references.md`.

## Open items
- Fact-sheet sign-off (80% / <6%, 35%, 4.2M).
- Whether Sina's /buy flow is live.
- The CHAMPION citation and the Ghana reference.

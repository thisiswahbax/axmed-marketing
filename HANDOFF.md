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
| Scroll hero | `hero3d.js`, `.h3d` in `site.css` | Dot globe on a light mist, pinned for 3 scenes: facilities, supplier routes into a hub, cyan routes out. Two-tone headlines. Test hook: `window.h3dAt(0..1)` |
| Where you are born | `.split`, dot figures in `site.js` | Photo with a slow zoom; 100-square grids for 80% / <6% that fill in as one wave as the section scrolls into view; numbers count up |
| How it works | `.hw` in `site.css`, script in `site.js` | Buyers / Suppliers tabs. Pinned: product art on the left (wallpapers in `img/wp/`), large step list on the right (Intercom pattern). Custom icons are inline SVGs |
| Sina | `sina-scroll.js`, `.sx` in `site.css`, live orb `sina/sina-orb.js` | Centred, scrubbed by scroll: Sina grows, says "Hi, I'm Sina.", the orbit draws, formats connect, then 4 steps with cards growing out of the orb. Test hook: `window.sxAt(0..1)` |
| Impact | `.impact` | Strata band, oversized count-up figures (2025 impact report), RIFF and Matching Fund cards |
| Partner stories | `.rail` | Zaro-style photo cards with real LifeNet and JMS quotes, plus the 4.2M figure |
| Close and footer | | |

## Rules that stay
- Lint before every publish: `node .claude/skills/hallmark/scripts/sloplint.mjs site/system.css site/site.css site/index.html --genre modern-minimal` (currently 0 FAIL).
- Motion: use the tokens in `brand/system.css` (`--ease-out`, `--ease-in-out`, `--dur-*`). The audit is in `site/MOTION.md`. Review new motion with `.claude/skills/review-animations` and plan bigger changes with `improve-animations` and `choreograph`.
- Photos in `brand/photos/generated/` are AI-generated (Higgsfield). Use them as mood imagery only: don't name the people or pair a face with a quote. The footer says imagery is illustrative. Swap in real photos with consent when we have them.
- Never invent numbers or quotes. Figures come from `strategy/fact-sheet.md` and the 2025 impact report. Label illustrative UI.
- Sina appears in one section only (the user asked to cut Sina everywhere else). The "Hi, I'm Sina" greeting goes against the Sina voice rules; the user chose it for this page only.
- References: `brand/moodboard/references.md`, with screenshots in `brand/moodboard/refs/`.

## Next up (what the user has been pushing for)
1. Keep raising the bar to "Apple level". The user reviews each section by eye and flags anything that "looks small", "poor" or "boring".
2. Partner stories and closing band: not yet redesigned in the new style.
3. Trim copy (the page is about 650 words; Hallmark warns above 450).
4. Optional: the Intercom-style moving line ribbon for the closing section; a dot-matrix world map at the edges of the closing CTA (Zaro).
5. Open items: fact-sheet sign-off (80% / <6%, 35%, 4.2M); whether Sina's /buy flow is live; the CHAMPION citation and the Ghana reference.

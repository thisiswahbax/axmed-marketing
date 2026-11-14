# Product imagery system

Three layers that work together. All UI is labelled **"Illustrative interface"** until replaced with real captures.

| Layer | Look | Where | Source |
|---|---|---|---|
| **Product cards** (`brand/product-cards/`) | August-style: warm paper base, pale tints (lavender = Sina, ice = Quotes, sage = Quality, blush = Delivery), dot-matrix icon, serif title, real-feeling marketplace UI bleeding off the edge with faded rows | Website sections, LinkedIn product posts, decks | `python3 scripts/make-product-cards.py` → `cards.html` (social 1080×1350), `bento.html` (web) |
| **Premium product shots** (`brand/product-shots/shots.css`) | Sina orb light, tilted glass-edged cards, spreadsheet window, chat with the orb | Campaign carousels (see A2.8), hero images | Used in `content/01-every-birth/carousel/A2.8-sina-your-list/` |
| **Line illustrations** (`brand/illustrations/`) | Isometric wireframes: grey construction lines, one indigo key line, one cyan point | Feature grids, explainer slides, website "how it works", backgrounds | `python3 scripts/make-illustrations.py` (8 SVGs) + `feature-grid.html` |

## Sina's orb (`brand/sina/`)
The selected orb from the 11 Nov buyer mockup (handover package included as-is). `sina-orb-1…5.png` are transparent stills rendered from the real WebGL shader at several moments (`orb.drawAt(t, state)`). Use `sina-flow.gif` / `sina-working.gif` or the live shader for motion; never a static image where it should move. Keep it perfectly circular. The orb replaces the older Ink Ray in marketing.

## Type
Titles: Instrument Serif · body: Figtree (free, close to Avenir Next / "Canon Sans" in the product mockups) · product UI: Inter (marketplace design system). On a Mac with Avenir Next, the Sina mockups use Canon Sans; we don't ship that font.

## Rules
- One tint per card, and use the same tint for a module everywhere.
- The UI must use real Axmed vocabulary and statuses (Matched, 1 question, Passed, In transit…). No invented prices: use relative figures (+8%) or none.
- No customer names, logos or quotes unless they're real and approved. The quote card ships with a placeholder.

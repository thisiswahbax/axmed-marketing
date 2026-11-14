# Axmed Brand Guidelines (working v1)

> Sources: axmed.com / marketplace styles (as captured in the `axmed-product-video` plugin's
> `theme.ts`), Launch Playbook v7 (6 Nov 2026). Items marked **TODO** are for SEAL Team 6.

## 1. Who we are

Axmed is a technology and AI company. We build the infrastructure and AI that transform how
medicines are procured, and as a public benefit corporation we exist to **empower the buyer**.
Not a distributor. Not a humanitarian agency. **AI native.**

**Commercial hypothesis:** Procurers do some of the hardest, most complex work in healthcare. That
downstream work is complex by nature and heroic. What shouldn't be complex, but today is, is how
procurement agencies *buy* the products: fragmented suppliers, slow tenders, opaque prices. That
upstream is what Axmed champions. We make it simple, so procurers can focus on the work only they
can do.

**Brand line:** **TODO** (SEAL Team 6). Working idea: "Lead. Never compromise."
**Campaign lines:** "Every birth." (MNCH) · "Every choice." (FP) — working titles.

## 2. Voice

| We are | So we write | Not |
|---|---|---|
| On the buyer's side | "Your 2027 list. Our offer in 48 hours." | "Our revolutionary platform…" |
| Confident and rigorous | Verified numbers with a source | Adjectives, hype, "disruption" |
| Bold and safe to buy from | QA and compliance as part of never compromising | Shortcuts, "move fast" |
| Human first | Real people, their own words | Synthetic quotes, generic "beneficiaries" |
| Technologists | Show it: AI quote, QA check, 3D live tracking | Buzzwords with nothing on screen |

Style: short sentences. Active voice. Name the person and the place. One idea per post. British
spelling (programme, organisation). Numbers as numerals ("3.4 million", "48 hours"). No emoji in
brand posts, max one in personal posts. No hashtags walls (≤3).

## 3. Creative rules (good vs never)

| Area | We do | We never | Buyer reaction we want |
|---|---|---|---|
| Hero | Midwife, procurement officer, programme lead in their own voices; Axmed the enabler | Axmed as hero/saviour; self-congratulation | "They understand my work." |
| Africa | Modern, urban and rural, confident, full of agency | Poverty imagery, suffering children, humanitarian look, rural-only | "That's us, at our best." |
| Status quo | Celebrate downstream, challenge upstream constraint | Blame ministries/agencies/partners; name competitors | "They're on my side." |
| Proof | Verified volumes, timelines, savings with source; cite E-MOTIVE, CHAMPION | Numbers without source; exaggeration | "I believe that." |
| Bold | QA, regulatory, compliance shown | Risky-sounding bold | "Bold, and safe to buy from." |
| Technology | AI quoting, AI QA checks, 3D live tracking on screen | Boxes and trucks only (reads as distributor) | "Nobody else does this." |
| Family planning | Informed choice, the people who make it possible | Volume/uptake as the story | "This respects the women we serve." |
| Partners | Real people, written consent, partner approves final cut | Synthetic testimonials, AI avatars, cloned partner voices | "This is real." |

## 4. Look

### Colour (see `tokens.json` / `tokens.css`)

| Token | Hex | Use |
|---|---|---|
| Indigo | `#261C7A` | Headlines, brand fields, opening/closing cards |
| Indigo deep | `#1C1560` | Gradients, dark backgrounds |
| Indigo soft | `#EDEBFA` | Tints, chips |
| Cyan | `#0CC4FF` | **Accent only** — one highlight per frame |
| Cyan soft | `#E6F8FF` | Highlight backgrounds |
| Ink | `#24283E` | Body text |
| Muted | `#5C657D` | Secondary text |
| Canvas | `#F7F9FD` | Page/slide background |
| Line | `#DFE5F0` | Dividers, card borders |
| Amber | `#9A5B00` / soft `#FFF4DF` | Only for "needs a look" / warnings |

Ratio guide: ~60% canvas/white, ~30% indigo, ≤10% cyan.

### Type

- **Headings:** Instrument Sans 600–700, tight tracking (-0.02em).
- **Editorial statements:** Instrument Serif, regular plus *italic* on one key word.
- **Body/UI:** Inter 400–600. Tabular numerals for figures.
- Both free on Google Fonts.

### Logo

The Axmed mark (two interlocking ribbons with cyan links) is in `brand/logo/`, with indigo, white
and mono versions. The lockup is the mark plus "Axmed" in Instrument Sans 700. Clear space is at
least half the mark's width. The carousel renderer places the logo on every slide automatically.
See `brand/logo/README.md`.

### Patterns: our DNA

All brand patterns are built from the mark's own geometry: signature tile, supergraphic, helix
strands, routes, and people seen through the mark. See `brand/patterns/README.md`.

### Imagery: photo-led (primary look)

Our posts lead with photography: one photo, one hue, fine-line overlays and editorial serif type. The templates are in `brand/photo-system/` (see its README for the 8 templates and their rules). The DNA patterns are the secondary layer.


- People appear through **real, consented photos**, framed with `scripts/treat-photo.py` (duotone or seen through the mark).
- Real photos from our deliveries first (facilities, products, staff at work). Consent per
  `strategy/templates/consent-checklist.md`.
- Product drawings: the marketplace art set (tablet, vial, bottle, pack) — no emoji or stock icons.
- Platform on screen: real screen captures or the designed mockups from the video plugin.
- AI imagery only for backgrounds, maps, abstract supply routes, textures — never people
  presented as real.
- Glass cards, soft indigo shadows, gradient accents, dotted backdrop. Fancy but minimal: ≤5
  elements in view.

### Atmosphere backgrounds

Blurred tonal fields with film grain (`brand/backgrounds/`), one Axmed hue each: indigo dusk, indigo haze, cyan deep, cyan mist and warm paper. Use them for conversations with Sina, news, statements and calls to action, always with real content on top, never as an empty wash. See `brand/backgrounds/README.md`.

Light fields (`lilac-mist`, `ice-mist`) are the default behind the Sina orb: the orb is then the one deep object on the page and blends in. On dark fields use `.orb.blend` (halo, rim light, shared grain).

### Dot-matrix illustrations

Shapes built from pixel dots on a construction grid, with motion: assemble, scan, glint (`brand/dot-matrix/`). Vial, ampoule, shield, box, globe, list, orb and the mark. One lit idea per illustration, in cyan.

### Strata art

Layered terrain for "everything coming together" stories: data, pooled demand, the platform (`brand/strata/`). Brand, warm and light palettes; text in the sky or on a panel, never across the strata.

### Motion (from the product-video house style)

Nothing is ever still; springs not curves; carry, don't cut; time everything to words; open and
close on indigo; Axmed mark in the corner.

## 5. Formats

| Format | Size | Notes |
|---|---|---|
| LinkedIn post image | 1200×1500 (4:5) | Headline ≤8 words on image |
| LinkedIn carousel | 1080×1350, PDF | 5–8 slides, cover + CTA slide |
| Video hero | 1920×1080 + 1080×1350 + 1080×1920 cut-downs | Burned-in captions always |
| WhatsApp card | 1080×1080 | One message, one CTA, link in text |
| Email header | 1200×400 | HubSpot |
| One-pager | A4 PDF | Case-study structure in templates |

## 6. Approvals

Felix (CCO): every public number and claim. QA: every product/impact statement vs WHO guidance.
Partner: final cut and case study. Emmanuel (CEO): brand line.

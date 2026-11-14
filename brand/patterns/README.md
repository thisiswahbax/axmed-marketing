# Axmed brand patterns — built from our DNA

Every pattern is generated from the **Axmed mark itself** (`brand/logo/mark-paths.json`): two
interlocking ribbons joined by cyan links, a double helix. Patterns are deterministic, so they
regenerate identically: `python3 scripts/make-patterns.py [WxH ...]`, then
`python3 scripts/svg-to-png.py brand/patterns/*.svg`.

| Pattern | Idea (the DNA) | Best for | Carousel class |
|---|---|---|---|
| `signature-dark` / `-light` | The mark as a woven textile tile; a few marks "lit" in cyan | Quote slides, email headers, backdrops behind photos | `bg-signature-dark/-light` |
| `supergraphic` | The mark at architectural scale, cropped, cyan joins glowing | Covers, CTA/end cards, video opening & closing | `bg-supergraphic` |
| `strands-dark` / `-light` | The mark's ribbons extended into parallel helix strands = supply lines; cyan segments = Axmed's links | Covers, chapter cards, LinkedIn banners | `bg-strands-dark/-light` |
| `routes-light` / `-dark` | Many sites, one route: delivery points flowing into the mark | Data/proof slides, multi-site delivery, maps | `bg-routes-light/-dark` |
| `people-in-the-mark` | **People seen through our ribbons** — a real photo shown only inside the mark | Hero portraits, partner stories, milestone posts | via `scripts/treat-photo.py` |

Sizes shipped: 1080×1350 (LinkedIn 4:5), 1920×1080 (video/web), 1080×1920 (stories/reels), 1080×1080 (WhatsApp).

## People: real photos only
`python3 scripts/treat-photo.py <photo.jpg> [outdir]` → a duotone version (indigo→cyan) and
"people-in-the-mark" frames in colour + duotone, all four sizes.
Only real photos of real people with written consent (`strategy/templates/consent-checklist.md`):
midwives, procurement officers, programme leads, Axmed staff. Never AI-generated people presented
as real (Launch Playbook v7 guardrail).

## Rules
- One pattern per asset. Never two patterns on the same slide.
- Text sits on the calm side: the carousel renderer fades the pattern behind the copy automatically.
- Cyan stays ≤10% of the frame.
- Don't recolour, distort or rotate the mark inside patterns.

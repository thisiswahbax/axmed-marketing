# Axmed Marketing — instructions for Claude

You are working in Axmed's marketing repo. Axmed is a **technology and AI company** and a public
benefit corporation that builds the infrastructure and AI that transform how medicines are
procured. We exist to **empower the buyer**. We are *not* a distributor and *not* a humanitarian
agency.

## Before you write or make anything

1. Read `brand/brand-guidelines.md` (voice, look, creative rules, AI guardrails).
2. For anything about Sina or Axmed's AI, read `strategy/sina-and-ai.md` (sourced from the axmed-sina and axmed-fabric repos): Sina's voice rules and what we may and may not claim.
3. Read the active campaign brief in `strategy/campaigns/<campaign>/brief.md`.
4. Any number you use must come from `strategy/fact-sheet.md`, phrased exactly as its
   "Safe to say publicly" column says. If a number is not there, write `[NUMBER NEEDED: …]` —
   never invent or round up.
5. Use the Axmed skills in `.claude/skills/` (they start with `axmed-`). They wrap the
   community skills with our rules.

## The central test (apply to every asset)

> Does this make the buyer feel seen, respected and more ambitious about what they can achieve,
> without compromise? And does it show Axmed empowers them with unmatched technology?

If the answer is no, rewrite before showing it to anyone.

## Non-negotiables

- **The hero is the midwife, the procurement officer, the programme lead.** Axmed is the enabler
  (Nike makes the shoe; the athlete wins the race). Never "revolutionising procurement", never
  "our innovative platform".
- **Celebrate the downstream, challenge the upstream.** Never blame ministries, agencies or
  partners. Never name competitors (IDA Foundation, Mission Pharma).
- **Africa is modern, urban and rural, confident, full of agency.** No poverty imagery, suffering
  children, passive beneficiaries or humanitarian look.
- **Family planning = informed choice.** Never contraceptive volume or uptake targets as the story.
- **"Miracle drug"** only as a named health worker's quote. "Delivered" only for fulfilled lines.
  "Zero maternal deaths *where the bundle was in use*", never "because of".
- **AI guardrails:** no AI-generated patients, mothers in labour, health workers or partners
  presented as real; no synthetic testimonials; no cloned voices or avatars of partners. ElevenLabs
  voices are for **narration by an Axmed narrator voice** or **consented Axmed staff** only. Never
  upload identifiable partner footage to tools whose terms train on uploads.
- **Every asset carries the CTA** (send an RFQ → offer within 48 hours; funders: register an EOI;
  everyone: activate an account) and a UTM-tagged link.

## Where things go

| What | Where |
|---|---|
| Brand rules, tokens, logo, moodboard | `brand/` |
| Brand kit for web and social (generated page) | `brand/kit/`, `scripts/build-kit.py`, `scripts/build-tokens.py` |
| Photo-led post templates (primary look) | `brand/photo-system/`, photos in `assets/photos/` |
| Atmosphere backgrounds (ElevenLabs-style, one hue each; light mists behind the orb) | `brand/backgrounds/`, `scripts/make-backgrounds.py` |
| Dot-matrix illustrations with motion | `brand/dot-matrix/`, `scripts/export-dotmatrix.mjs` |
| Strata art (layered terrain, stills + loops) | `brand/strata/`, `scripts/make-terrain.py` |
| Product imagery: product cards, premium shots, line illustrations, Sina orb | `brand/product-shots/README.md`, `brand/product-cards/`, `brand/illustrations/`, `brand/sina/` |
| DNA patterns + photo frames (secondary) | `brand/patterns/`, `scripts/make-patterns.py`, `scripts/treat-photo.py` |
| Positioning, campaign briefs, channel plan, measures, fact sheet | `strategy/` |
| Interview guide, case-study structure, consent checklist; brief, review and approval templates | `strategy/templates/` |
| The asset queue: one entry per asset, with status, maker, approvers, folder | `strategy/campaigns/<campaign>/assets.json` (change it with `scripts/assets.mjs`) |
| One folder per asset: brief, copy, slides, renders, review, approval | `content/<campaign>/<channel>/<asset-id>-<slug>/` (e.g. `cards/A1.6-impact-card/`) |
| Drafts not yet moved into an asset folder | `content/<campaign>/<channel>/` |
| Remotion video projects | `video/<asset-id>/` (e.g. `video/A1.1-hero-film/`) |
| Helper scripts (carousel render, UTM builder) | `scripts/` |

Asset IDs come from `strategy/campaigns/01-every-birth/assets.json`. `asset-plan.md` next to it is
generated from the JSON: never edit the table by hand. Inside an asset folder, files keep fixed
names (`brief.md`, `copy.md`, `slides.html`, `renders/`, `review.md`, `approval.md`) so agents and
scripts find them.

## Tools available

- **ElevenLabs MCP** (`.mcp.json`): text-to-speech, voice design, sound effects, music,
  transcription. Use it for voice-overs, cut-down captions (speech-to-text) and music beds.
- **axmed-product-video plugin** (org plugin): the house style for product/proof films in
  Remotion + ElevenLabs. Use it for A2.1 proof film and any platform walkthrough.
- **Remotion skills** (`remotion-dev/skills`): Remotion best practices for any other motion piece.
- **Marketing skills** (`coreyhaines31/marketingskills`): copywriting, social-content,
  email-sequence, launch-strategy, marketing-psychology, product-marketing-context.
- **Anthropic document-skills**: pptx, docx, pdf, xlsx for one-pagers and decks.

## Anti-slop (Hallmark)

Every visual and web page follows the Hallmark floor (`.claude/skills/hallmark`, by Together AI): no eyebrows, no tracked-capital labels, no single italic word in a heading, no middle-dot strings or decorative dots, no gradients across hues, no drawn browser windows, no card inside a card, no invented numbers or quotes, every colour and font from `brand/system.css` tokens.
Build assets with `python3 scripts/build-assets.py`, render with `./scripts/render-all.sh`, then lint:
`node .claude/skills/hallmark/scripts/sloplint.mjs brand/system.css <file.html> --genre modern-minimal` and fix every FAIL before handing over.
Photos: never pick from Pexels, Unsplash or Pixabay (their terms bar AI tools from choosing images). Use Axmed's own consented photos (`assets/photos/real/`) or Hallmark's Wikimedia library, credited. Where a person belongs and no real photo exists, leave a slot.

## Review before handing over

Check every number and risky phrase against the fact sheet with the script, and paste its output
into the asset's `review.md` (format: `strategy/templates/review.md`):

```bash
node scripts/check-numbers.mjs <asset-folder>            # while drafting: placeholders warn
node scripts/check-numbers.mjs <asset-folder> --final    # before approval: placeholders fail
```

It reads approved figures from `strategy/fact-sheet.md` and the rest from `strategy/claim-rules.json`.
Clear a number that isn't a claim with a comment in the file (`<!-- numbers-ok: 50% (MgSO4
strength) -->`), and fence mock UI with `<!-- illustrative:start -->` … `<!-- illustrative:end -->`.
Move an asset's status with `node scripts/assets.mjs status <id> <status> "<note>"`; only a person
sets `approved`, `scheduled` or `live` (with `--by <name>`).

Then run the `brand-reviewer` subagent (`.claude/agents/brand-reviewer.md`) on every finished asset and
include its verdict at the bottom of the file.

## Website and product imagery: read this first
Before any work on `site/`, web sections, product images, UI mockups or scroll motion, read **`brand/WEB-DESIGN.md`** in full.
It is the approved design system: two-tone headlines, wallpaper art cards with floating product windows, custom icons,
dot-matrix and strata art, the Sina orb, pinned scroll scenes, motion tokens and the review checklist. Reuse those
patterns and assets (`site/img/wp/`, `brand/backgrounds/`, `brand/strata/`, `brand/dot-matrix/`, `brand/moodboard/refs/`); don't invent a parallel style.
Run `.claude/skills/review-animations` on motion changes, and the Hallmark lint before handing back.

For where every asset lives (icons, product images, wallpapers, illustrations, photos, references), see **`ASSETS.md`**.

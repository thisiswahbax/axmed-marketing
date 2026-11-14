---
name: axmed-whatsapp-card
description: Create Axmed WhatsApp cards and short image cards (milestone moments, impact story card, Benchmark Challenge card) — the 1080×1080 image plus the message text. Use for WhatsApp, story cards, milestone cards or any single-image social card.
---

# Axmed WhatsApp / image card

1. Write the message: ≤60 words, warm, personal (these go to existing relationships), one CTA, UTM link (`utm_source=whatsapp`).
2. Write the card: one headline ≤8 words + one supporting line + source line if a number/claim is used.
3. Build the image with the carousel renderer as a single 1080×1080 slide: copy `.claude/skills/axmed-carousel/template.html`, keep one slide, set `--w:1080px; --h:1080px`, then `node scripts/render-carousel.mjs <html> <outdir> --size 1080x1080`.
4. Milestone cards: use a real delivery photo if available (consent per `strategy/templates/consent-checklist.md`); otherwise indigo field + big number.

Save copy + PNG to `content/<campaign>/whatsapp/`. Run `axmed-brand-check`.

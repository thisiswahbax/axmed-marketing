---
name: axmed-carousel
description: Design and render Axmed LinkedIn carousels, infographics and data cards as on-brand HTML slides exported to PNG + PDF (e.g. A1.5 "The PPH bundle in 5 slides", A2.2 data infographic). Use for carousels, infographics, stat cards, slide images for social or email.
---

# Axmed carousel / infographic

0. **Default look = photo-led.** Start from `brand/photo-system/templates.html` (T1–T8) for single posts and carousels. Use `template.html` here only for simple data-heavy carousels.
1. **Plan** 5–8 slides in a table (slide #, headline ≤8 words, support line, visual, source). Slide 1 = cover hook; last slide = CTA ("Send us your 2027 list — offer within 48 hours" + axmed.com). Every number from `strategy/fact-sheet.md`, with a source line on that slide.
2. **Build:** copy `template.html` (this folder) to `content/<campaign>/carousel/<asset-id>/slides.html`. It links `brand/system.css`, the same classes the brand kit shows (`brand/kit/index.html`, Social formats). Each `<section class="slide">` is one slide, children placed absolutely. Backgrounds: plain (paper), `.field` (indigo), `.warm`. Text: `.head` (`.m`, `.l`) as a two-tone headline with a quieter `<span>`, `.lead`, `.big` with `<span class="accent">` on the unit, `.items` for lists, `.quote` + `.cite`, `.src` for the source line, `.cta`, `.pnum` for the page number. No labels above headlines, no capitals, no italic words, one cyan accent per slide. The real logo fills every `.brand` slot at render time. To add a DNA pattern background, add a class to the slide: `bg-strands-dark`, `bg-supergraphic`, `bg-signature-light`, `bg-routes-light` and so on (see `brand/patterns/README.md`). Use at most two patterned slides per carousel, and usually put them on the cover and the CTA slide. For a person, run their real photo through `scripts/treat-photo.py` and use the output as the slide's image.
3. **Render:** `node scripts/render-carousel.mjs content/<campaign>/carousel/<asset-id>/slides.html content/<campaign>/carousel/<asset-id>/ --size 1080x1350` → `slide-01.png …` + `carousel.pdf` (upload the PDF to LinkedIn as a document post).
4. **Look at every PNG** before handing over (text overflow, contrast, one accent).
5. Write the post caption with `axmed-linkedin-post`; run `axmed-brand-check`.

Product visuals: simple geometric drawings (vial, pack, drape) in indigo/cyan — no emoji, no stock pill photos.

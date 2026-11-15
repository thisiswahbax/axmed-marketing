# Photo-led post system (v2) — the primary look

Built to match the team's Pinterest references: **photo first, one hue, fine lines, editorial type.**
Preview: `overview.png` · Renders: `renders/` · Source: `templates.html`

| # | Template | Reference it follows | Use for |
|---|---|---|---|
| T1 | Mono hue: hand + product, short sans statement | "Zoom in." teal glove | Product/bundle posts |
| T2 | Hand + thin circle, serif headline | "Not all probiotics are created equal" | QA / quality messages |
| T3 | Portrait + dotted connectors to capability pills | "Find it before you feel it" | Technology as enabler (AI quote, QA, tracking) |
| T4 | Big numbers on blurred, washed photo | "Of the average 121-minute doctor visit" | Proof-in-numbers (fact sheet only) |
| T5 | Portrait + frosted platform card | Calendar-card / clinic posts | Proof film stills, Act 2 |
| T6 | Huge grotesk + arched photo crop | "Did you know?" / "Never wait to treat pain" | Campaign line, carousel covers |
| T7 | Washed scene + serif statement | Editorial clinic shots | Downstream heroes, manifesto lines |
| T8 | Indigo field + serif CTA + photo chip | End cards | CTA / Benchmark Challenge |

## The rules of the look
1. **One photo, one hue.** Indigo wash (`.wash`) or the lighter indigo (`.wash-app`) over a grayscale photo, or a natural photo with a soft shade. Never more than one wash, and never a gradient across hues.
2. **Type:** Instrument Serif for statements, two-tone: the quieter half in a `<span>`, never an italic word. Instrument Sans for big numbers and huge words (`.num`, `.line`). Inter for everything small, in sentence case: no capitals, no letter-spacing.
3. **Fine lines:** thin white circles, dotted connectors, dots with halos. Use one cyan element per post: a pill, a stroke or a number.
4. **Grain** on every photo post (`.grain`) for the editorial, non-stock feel.
5. **Logo** bottom-left, always; the campaign line or the CTA bottom-right (`.tag`, sentence case, no arrow).
6. **People:** real photos only. Stock is a placeholder (see `assets/photos/stock/README.md`), and real consented Axmed/partner photos replace it. Never AI people presented as real.
7. Platform UI on photos is labelled "Illustrative interface" until it's a real screen capture.

## Make a post
Copy one `<section>` into `content/<campaign>/<channel>/<asset-id>/slides.html`, swap the photo and copy, then:
`node scripts/render-carousel.mjs <slides.html> <outdir> --size 1080x1350`
(link `brand/tokens.css` and `brand/photo-system/post.css`, and fix the `../` paths for the new folder depth.)
All styles live in `post.css` and use the generated tokens, so the posts match the website and the brand kit (`brand/kit/`).
The DNA patterns in `brand/patterns/` are now **secondary**: use them for chapter cards, banners and video openers, not as the main post look.

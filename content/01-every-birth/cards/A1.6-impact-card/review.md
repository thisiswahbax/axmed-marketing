# Review: A1.6 Impact story card

<!-- Newest round at the top. Format: strategy/templates/review.md. -->

Status after this round: needs-fix

## Round 1 (2026-11-15)

Phase 0 migration check. Only the fact check ran: the brand and design reviewer agents arrive in
Phase 1, so those rows wait for round 2.

| Reviewer | Verdict | Checked |
|---|---|---|
| Facts | FIX | `node scripts/check-numbers.mjs content/01-every-birth/cards/A1.6-impact-card --final` |
| Brand | Not run | Phase 1 |
| Design | Not run | Phase 1 |

### Facts

```
  content/01-every-birth/cards/A1.6-impact-card/copy.md
    fail  [REF              placeholder still open
          "[REF]. > The midwives did the work. The bundle was on the sh"
    fail  [REF              placeholder still open
          "[REF]. That's why we're making the bundle simpler to buy. [l"

  content/01-every-birth/cards/A1.6-impact-card/slides.html
    ok    0                 fact sheet: evidence, cite the source
          "0 maternal deaths where the bund"
    fail  where the bundle was used  Fact-sheet wording, exactly: "where the bundle was in use".
          "0 maternal deaths where the bundle was used. Northern Ghana. Midwives did the work; the bundle was there. Source: f"

  FIX: 3 to fix, 0 to look at.
```

- "maternal deaths where the bundle was used." (`slides.html`, headline) → "maternal deaths where
  the bundle was in use." The fact sheet allows that wording only.
- "[REF]" twice (`copy.md`) and "Source: field report to attach." (card) → attach the northern Ghana
  field report and cite it on the card and in both captions. Felix confirms the reference.
- The zero itself is fine: it is in the fact sheet's Evidence table, so it needs the source above,
  not a new number.

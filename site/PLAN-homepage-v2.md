# Homepage v2 plan (15 Nov 2026)

## The problem
The page explains *how* Axmed works (tabs, steps, Sina) but never says plainly *what each side gets*.
A supplier who lands here cannot see the upside in new markets, bigger orders or less admin. A buyer sees
the process but not the outcomes: lower cost, an offer in 48 hours, every order tracked to every site.

## Page order, before and after

| # | Now | v2 |
|---|---|---|
| 1 | Scroll hero | Keep. Sub-line names both sides |
| 2 | Where you are born | Keep, trim copy |
| 3 | — | **NEW: What you get** (buyers / suppliers) |
| 4 | How it works (tabs) | Keep, shorter: steps only, benefits moved to section 3 |
| 5 | Sina | Keep |
| 6 | Impact | Keep |
| 7 | Partner stories (photo rail) | **Redesign**: one large quote at a time, partner list as a timer, no photos |
| 8 | Close (strata band) | **Redesign**: CTA for each audience, dot-matrix Africa map |

## 3. What you get (new)
Apple-style bento: one switch (Buyers / Suppliers), six tiles each. A large tile has an outcome
headline, one line on how, and a small product vignette reused from the How it works art. Each figure
comes from the fact sheet or shows `[NUMBER NEEDED]`.

**Buyers**
| Outcome (headline) | How (one line) | Proof |
|---|---|---|
| Pay less per unit, delivered | Pooled demand; qualified suppliers compete on your exact lines | Savings %: **needs sign-off** (see open items) |
| An offer in 48 hours | Send your list as Excel, PDF or a message | 48 h (approved CTA) |
| Quality checked before it ships | Supplier, product, registration and QC release, all checked | — |
| Track every order to every site | One view from purchase order to delivery at each facility | Illustrative UI |
| One contract, many sites | Delivery to central stores, hospitals and health centres | — |
| Funding when you need it | RIFF working capital; $5M MNCH Matching Fund | On page today |

**Suppliers**
| Outcome (headline) | How (one line) | Proof |
|---|---|---|
| New markets, without new offices | Buyers in 17 countries on one marketplace | "33 buyers, 17 countries" (fact sheet) |
| Bigger orders | Demand from many buyers pooled into tenders worth serving | — |
| Quote once, reach every buyer | One quote, one contract per tender | — |
| Get qualified once | Documents reviewed by our QA team, reused on every tender | — |
| Get paid on delivery | Payment released at confirmed delivery | **Confirm payment terms** |
| See demand early | Open tenders and closing dates before you plan production | — |

"More money" for suppliers is stated as an outcome (bigger, pooled orders in new markets). Any revenue
or margin number needs a source first.

## 7. Partner stories (redesign)
- Real LifeNet and JMS quotes set large in the serif, revealed word by word. The partner names below
  double as tabs, with a thin bar that fills as a timer. Auto-advance stops on hover, focus, click or reduced motion.
- AI-generated photos are removed from this section: the handoff rule says not to pair a face with a quote.
- The 4.2M "quote" card goes (the figure already sits in Impact).

## 8. Close (redesign)
- Dark indigo. Left: "Bring your list. See it with your own products." Buttons: Bring your list (buyers),
  Join as a supplier, plus one line for funders (register an expression of interest).
- Right: a dot-matrix Africa map (Natural Earth, `scripts/make-dotmap.py`, already generated to
  `site/dm/dotmap.js`). Dots ripple in from Nairobi, then a few glint cyan. Static under reduced motion.

## Build order
1. What you get (biggest gap) → 2. Partner stories → 3. Close → 4. Trim How it works and copy overall
(target under 500 words) → 5. Lint (sloplint 0 FAIL), brand-reviewer verdict, desktop and mobile check
→ 6. Update HANDOFF.md and MOTION.md.

## Open items for the team
- **Savings figure conflict**: Impact shows "35% average cost savings in 2025" (impact report), but
  `strategy/fact-sheet.md` says not to publish savings until the range is fixed. Pick one source.
- **Supplier positioning** is missing from `strategy/positioning.md`; the supplier tiles above are a draft.
- Supplier payment terms (paid at confirmed delivery?) and whether "Join as a supplier" has a sign-up URL.
- Whether live order tracking is in the product today or should be labelled illustrative.

## Brand review (15 Nov 2026): applied and still open
Applied: no savings claim in the price tile ("Compare prices, line by line."; the "last price" marker removed); "QA and regulatory checks on every quote"
(sina-and-ai.md wording); supplier reach uses the approved "24 buyers in 13 countries" (MNCH supply) instead of 33 / 17; the close
carries the 2027 angle, "Activate an account" as the second button, suppliers as a text link, and UTM-tagged links.
Still open, for the team:
- $5M Matching Fund, Gates Foundation and RIFF are not on the fact sheet (they were already on the page before v2).
- The supplier panel is unapproved copy: "Bigger orders", "Get qualified once", "Know when you get paid", "See demand early".
- The LifeNet and JMS quotes have no source or consent record in the repo (they were on the page before v2). The reviewer also
  notes that both praise Axmed rather than the partner's own work.
- Partner figures in the partner stories (LifeNet: 240k carbetocin doses, 25k drapes, 6 countries, since Dec 2024; JMS: 106M units
  delivered, 82 orders, since Mar 2025) come from the fact sheet's "Partner data", which is marked "confirm before public use".
  Confirm with both partners before this page goes live.
- The funding tile now shows RIFF as bridging the wait between order and the buyer's funding. Confirm that this is how RIFF works.
- "Where you are born": the 80% and <6% figures have no source in `strategy/` (they were on the page before v2). Add the source,
  and approve the new closing line "Medicine supply follows revenue, not people."

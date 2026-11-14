---
name: axmed-linkedin-post
description: Write Axmed LinkedIn posts — company page releases, CEO/CCO personal posts (Emmanuel, Felix), staff shares and milestone posts — for the Every birth / Every choice campaigns. Use for any LinkedIn copy, launch post, milestone post or post variants.
---

# Axmed LinkedIn post

Inputs to confirm (ask only if missing): asset ID from `strategy/campaigns/*/asset-plan.md`, voice (company page / Emmanuel / Felix / staff), act (1 brand or 2 proof), the one idea.

If the community `social-content` or `copywriting` skill is installed, use its hook techniques — but Axmed rules win.

## Structure (≤1,300 characters; first 2 lines must work alone before "…see more")
1. **Hook (1–2 lines):** a person, a moment, or a hard number from the fact sheet. Never start with "We" or "Axmed".
2. **The downstream (2–3 lines):** honour the work — the midwife, the procurement officer.
3. **The upstream turn (1–2 lines):** "What shouldn't be complex, but today is…"
4. **What Axmed makes simple (1–2 lines):** one concrete capability shown, not claimed.
5. **CTA (1 line):** per act. Act 1 soft ("Watch the film" / "Plan your 2027 procurement with us"); Act 2 direct ("Send us your 2027 list. Offer within 48 hours.") + UTM link (`node scripts/utm.mjs`).
6. ≤3 hashtags: pick from #MaternalHealth #PPH #GlobalHealth #HealthProcurement #FamilyPlanning.

## Voice per author
- **Company page:** third person, calm, factual, no emoji.
- **Emmanuel (CEO):** mission and why-now, first person, one personal observation.
- **Felix (CCO):** buyers and the offer, first person, practical, names the 48-hour promise.
- **Staff shares:** 1–2 lines of their own + reshare; give 3 options.

## Deliver
Save to `content/<campaign>/linkedin/<asset-id>_<slug>_v1.md` with: 2 variants, suggested visual (from brand guidelines formats), alt text, UTM link, and the `axmed-brand-check` verdict at the bottom.

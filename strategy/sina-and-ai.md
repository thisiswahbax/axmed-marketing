# Sina and Axmed's AI for procurement: messaging source

> Sources (read 14 Nov 2026): `axmed-sina` repo (web/PRODUCT.md, web/DESIGN.md, docs/systems/*),
> `axmed-fabric` repo (docs/axmed-company.md, docs/axmed-tech.md, apps/haystack, apps/sonar,
> apps/ontology, sites/axmed-sina website copy). Re-check with Product before anything is published:
> several capabilities are **in development** and must be shown as such.

## What it is, in one line
**Sina is the Axmed agent.** It reads the order list a buyer already has (Excel, CSV, PDF, Word or a
message), matches every line to real catalogue products, and **asks instead of guessing** when a
line isn't clear. People stay in control of every decision.

## The AI stack behind it (what we can say, plainly)

| Layer | What it does | Buyer-facing words |
|---|---|---|
| **Sina** (axmed-sina) | One agent for all of Axmed. Onboarding is its first job: read the list, match each line, ask about unclear lines, show a cost answer before registration | "Bring the list you already have." |
| **Product ontology** (axmed-fabric/apps/ontology) | Master data from substance to lot. Messy brand names, abbreviations and pack wording resolve to real products | "Amoxyl DT 250, 12000 tabs" becomes amoxicillin 250 mg dispersible tablet, 120 packs of 100 |
| **Haystack** (product matching) | Matches free-text medicine descriptions to catalogue SKUs: name → form → strength | "Every line matched, or a question asked" |
| **Sonar** (regulatory) | Checks suppliers and products against 20 regulatory catalogues (FDA, EMA, national regulators…) with AI validation | "QA and regulatory checks on every quote" |
| **Fabric** (data platform) | Our data warehouse: orders, prices and supplier performance, which power pricing intelligence | "Prices you can compare, with the evidence behind them" |
| **Axmed Intelligence** (in development) | Pricing intelligence and decision pages in the agentic workspace | Not public yet: don't use |

## Sina's voice (product rules, apply to marketing too)
- A **calm procurement colleague**. Plain, competent, precise.
- **Never** "Hi, I'm Sina". No AI hype words ("magic", "revolutionary", "powered by AI ✨"), no AI decoration (sparkles, robots, glowing brains).
- **Ask, don't guess.** Show the line-by-line result. "People remain responsible for what happens next."
- Sina's visual is the **Ink Ray** (`brand/logo/sina-ray.svg`): indigo body, cyan wings and tail. Use it only next to Sina features. Don't redraw it or give it a speech-bubble "hi".

## Proof points we may use (safe wording)
- "Send your order list. Sina, the Axmed agent, matches each line to the Axmed catalogue and asks only about what is not clear." (live /buy page copy)
- "Value before registration: see a cost answer before you give any details."
- "Nothing is sent until you say so."
- "Evidence in view. People in control."
- The real test line (Amoxyl DT 250 → amoxicillin 250 mg dispersible, 120 × 100) as an **illustrative example**.

## Do not claim
- No testimonials, customer logos, benchmarks or price figures for Sina: **none exist yet** (PRODUCT.md).
- No line-level prices before registration (product rule).
- Don't call the /buy chat "live" until Product confirms the matching runs on the agents service (as of 4 Nov 2026 the chat runs on a mock agent).
- Pricing intelligence / Axmed Intelligence: internal prototype. Don't show it.
- Label every UI shown in creative "Illustrative interface" unless it's a real screen capture.

## How Sina plugs into Campaign 01
The playbook's Act 2 invitation is the **Benchmark Challenge: "Send us your 2027 list."** Sina is how
the list arrives: the buyer drops the file they already have; Sina reads and matches it; the team
returns an offer within 48 hours. So Act 2 shows the technology on screen exactly as the playbook
asks (AI-driven quote → QA check → 3D live tracking), with Sina as the first step.

## Brand notes from the product repos
- The marketplace primary is **Axmed Indigo #392AB0** (buttons, selected states); Indigo Deep #261C7A for dark brand surfaces; cyan **#0CC4FF** is the logo stroke, and in the product it's reserved for Sina.
- Type: Inter (body), Instrument Sans (large headings). (PRODUCT.md mentions Figtree, but DESIGN.md and the code use Inter. Confirm with design.)
- Official logo: `brand/logo/axmed-logo*.svg` (from `axmed-sina/web/public/images/logo.svg`).

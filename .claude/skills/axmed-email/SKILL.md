---
name: axmed-email
description: Write Axmed HubSpot campaign emails (story emails, Benchmark Challenge invitation) and 1:1 GTM outreach emails, per segment track (existing buyers, pipeline accounts, lookalikes, funders). Use for any email, nurture, invitation or personal outreach copy.
---

# Axmed email

Confirm: asset ID, track (existing buyers / pipeline / lookalikes / funders), broadcast vs 1:1.
If `email-sequence` or `copywriting` community skills are installed, borrow their subject-line testing approach.

## Broadcast (HubSpot)
- **Subject:** ≤45 characters, 3 options (one human, one number, one 2027 angle). Preview text ≤90 chars.
- **Body ≤180 words:** person/moment → why it matters (one cited fact) → the upstream made simple → one CTA button.
- **Funders track:** swap the CTA to "Register your interest" and add one line on cost-effectiveness and the social mission.
- HubSpot tokens: `{{ contact.firstname }}`, `{{ company.name }}`. Tag: campaign, act, asset, segment, track, source.

## Benchmark Challenge (A2.5)
Subject options around "Send us your 2027 list". Body: we celebrate your work → we'll show how simple upstream can be → what to send (product list or forecast, quantities, sites) → offer within 48 hours → button to landing page (RFQ / EOI / register).

## 1:1 GTM (A2.7)
≤120 words, plain text, from the GTM owner. Reference their trigger (award, tender, 2027 budget) specifically. Attach case study + proof film link. One ask: a 20-minute call or their 2027 list.

Save to `content/<campaign>/email/<asset-id>_<track>_v1.md`. Run `axmed-brand-check`.

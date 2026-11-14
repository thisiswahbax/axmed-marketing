---
name: axmed-video-brief
description: Plan and storyboard Axmed campaign films (hero film, cut-downs, partner portraits, bundle explainer, Axmed-voices clips) and route production to the right tool — Remotion, the axmed-product-video plugin, ElevenLabs or a real shoot. Use when someone asks for a video, film, reel, animation or storyboard for a campaign.
---

# Axmed video brief

## Pick the format (from the playbook)
| Format | Length | How | AI role |
|---|---|---|---|
| Hero film (A1.1) | 60–90 s + cut-downs | Partner's **real** voice + bold visuals: maps, supply routes, modern facilities, tech at work | AI visuals/motion around the real voice; captions, translation |
| Partner portrait | 15–30 s | Real photo, lightly animated (slow pan) over real voice | Light animation only |
| Proof film (A2.1) | 45–60 s | AI quote → QA → 3D tracking → multi-site delivery | **Use the `axmed-product-video` plugin** (Remotion + ElevenLabs house style) |
| Bundle explainer | 30–60 s | Motion graphics + VO, QA-reviewed statements | Remotion + `axmed-voiceover` |
| Axmed voices | 30–60 s | Felix or Emmanuel, one idea per clip | Consented staff avatar only, for FR/PT versions |

## Brief template (write to `video/<asset-id>/brief.md`)
Objective & act · audience · the one line viewers remember · CTA/end card · runtime & aspect ratios (16:9, 4:5, 9:16) · scene table (time, picture, sound/VO, on-screen text, source of each visual: real / screen capture / motion / AI-background) · approvals needed.

## Build
- Motion/explainers: `npx create-video@latest video/<asset-id>` (or copy the plugin template), then follow the **Remotion skills**. Import `brand/tokens.json` for colours/fonts.
- Proof/product films: invoke the `axmed-product-video` skill.
- Audio: `axmed-voiceover`.
- Always export 16:9 master + 4:5 + 9:16 cut-downs with burned-in captions; end card = indigo field, CTA, axmed.com.

## Guardrails
No AI-generated patients, mothers in labour, health workers or partners presented as real. Never upload identifiable people or partner footage to tools whose terms train on uploads (e.g. Higgsfield on a standard plan). Label AI-generated backgrounds internally in the scene table.

---
name: axmed-asset-multiplier
description: Turn one Axmed partner interview (audio, video or transcript) into the full asset set — hero film selects, 3–5 subtitled clips, case study, 3 LinkedIn posts, an email story, a WhatsApp card and a GTM slide. Use when given an interview, transcript or recording, or when planning an interview before recording.
---

# Axmed asset multiplier — one interview, many assets

## Before recording (planning mode)
Map the 7 questions in `strategy/templates/interview-guide.md` to the asset list below, note which answer feeds which asset, confirm consent per `consent-checklist.md`.

## After recording
1. **Transcript:** if given audio/video, transcribe with the ElevenLabs MCP `speech_to_text` (diarisation on). Save to `content/<campaign>/case-study/<partner>_transcript.md` with timecodes.
2. **Pull selects:** a table of the 10 best verbatim lines (timecode, speaker, quote, which asset). Never edit words inside a quote; trim only at sentence boundaries.
3. **Produce the set** (each file in its channel folder, partner name in the slug):
   - Hero film select list (60–90 s paper edit, in story order: moment → stakes → procurer → turn → end-card line)
   - 3–5 clip paper edits (15–30 s each, one idea each) with caption text
   - Case study draft (`strategy/templates/case-study.md`)
   - 3 LinkedIn posts (company page, Felix, staff) via `axmed-linkedin-post`
   - 1 email story via `axmed-email`
   - 1 WhatsApp card via `axmed-whatsapp-card`
   - 1 GTM slide: headline, 3 proof bullets, quote, CTA
4. Flag every number the partner says that isn't in the fact sheet as `[VERIFY: …]`.
5. List everything requiring partner approval in an `APPROVALS.md` next to the assets.

**Never** generate or clone the partner's voice or face. Their real recording carries the story.

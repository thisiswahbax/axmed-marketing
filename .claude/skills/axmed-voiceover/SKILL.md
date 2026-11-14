---
name: axmed-voiceover
description: Produce Axmed voice-overs, music beds, sound effects and captions with the ElevenLabs MCP — for the bundle explainer, cut-downs, proof film and French/Portuguese versions. Use for any voice-over, narration, VO script, music, SFX, transcription or subtitle request.
---

# Axmed voice-over (ElevenLabs MCP)

Requires the `elevenlabs` MCP server (`.mcp.json`) and `ELEVENLABS_API_KEY` in `.env`.

## Guardrails (hard stops)
- Narrator voices only: an ElevenLabs library/designed voice, or a **consented Axmed staff** clone (written consent on file). **Never** clone or imitate a partner, health worker, patient or any real person outside Axmed.
- Product statements in the script must be QA-reviewed against WHO guidance before voicing.
- Partner voices in films are their **real recordings**, never regenerated.

## Workflow
1. **Script:** write for the ear — ≤2.5 words/second (60 s ≈ 150 words), short sentences, numbers spelled the way they're said ("three point four million"). Mark beats with `[pause]`. Save as `video/<asset-id>/narration.md`.
2. **Voice:** default to the house voice chosen for the product videos (see the `axmed-product-video` plugin's `voice-and-music.md`; shortlist favours Nigerian, South African, Kenyan and East African voices). Record the chosen `voice_id` in `brand/voice.md` so every asset sounds the same. To audition, generate the same 2 lines with 3 voices and compare.
3. **Generate:** MCP `text_to_speech`, model per the plugin (expressive model, stability ~0.35), one file per scene → `video/<asset-id>/audio/scene-XX.mp3`.
4. **Music:** MCP music generation — "warm, hopeful, modern African percussion, minimal piano, builds gently, no vocals", length = film length. Mix at ~12% under voice.
5. **Captions:** MCP `speech_to_text` on the final mix → SRT; captions are always burned into social cut-downs.
6. **Languages:** French and Portuguese versions only for Axmed-staff or narrator voices; have a native speaker check the script first.

Note in the asset file which voice, model and settings were used.

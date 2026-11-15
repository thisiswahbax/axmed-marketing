# "The List": Higgsfield generation prompt

Use this with a browser agent on higgsfield.ai, or with the Higgsfield MCP (`https://mcp.higgsfield.ai/mcp`) once it's connected. The storyboard is in `creative-reference-library.md` (section "Storyboard: The List, 60 seconds").

## Ground rules
- Never buy credits, upgrade or enter payment details. State the credit balance and estimated cost first, then wait for approval.
- Download every approved output as `AXMED_TheList_S##_vN.(png|mp4)`.
- No on-screen text, logos or UI in generations: the spreadsheet, Sina's panel, labels and end card are made in post from the Axmed design system.
- Never show: holograms, robots, glowing blue AI graphics, doctors smiling at camera, pills in slow motion, stock hospital corridors, a face for Sina, or a newborn's face.
- AI-generated people must not be presented as real Axmed partners. Add a "dramatisation" note in digital versions.

## Workflow
1. Image model: Nano Banana Pro (or the best photoreal model), 16:9, 2K.
2. Character references first (2 variants each), then pick one per character.
3. One still per shot (2 variants), using the character reference as an image reference.
4. Image-to-video with the best cinematic model (Kling, Veo or Seedance): approved still as the first frame, 5s, 16:9.
5. Work in batches of 3 shots; report the shot, files, model and credits used after each batch.

## Global style (append to every image prompt)
Documentary cinematic still, anamorphic 2.39 look, shallow depth of field, natural film grain, practical light only (desk lamps, dawn windows, fridge light, headlights), warm skin and red-earth tones against deep indigo night shadows, one small cyan accent, realistic, unposed, dignified, no text, no logos, no watermark.

## Characters
- **GRACE:** Kenyan woman, mid-40s, procurement officer, short natural hair, reading glasses pushed up, simple blouse and cardigan, tired but sharp, in a modest regional health office at night.
- **MIDWIFE:** Ugandan midwife, 30s, light blue uniform, hair wrapped, calm, capable hands, in a labour ward at night.
- **SUPPLIER QA LEAD:** Indian man, 40s, white lab coat and hairnet, quality lead in a clean pharmaceutical plant.
- **PHARMACIST:** Tanzanian man, 30s, white coat, in a district hospital storeroom.

## Shots (still prompt / motion prompt)
| Shot | Still | Motion |
|---|---|---|
| S01 | Close-up of a laptop screen glow on a dark wooden desk at night, a cold cup of tea, papers (blank plate; the spreadsheet line is added in post) | Very slow push-in, the screen glow flickers softly |
| S02 | GRACE at her desk in a regional health office at night, stacks of paper, rubbing her eyes, lamp light | She rubs her eyes, then leans toward the screen; handheld, subtle |
| S03 | Over-the-shoulder of GRACE looking at her laptop, screen out of focus, her face lit by it | Slow drift past her shoulder; she nods slightly |
| S04 | Close-up of GRACE's hand on a mouse, finger about to click | She hesitates, then clicks once |
| S05 | SUPPLIER QA LEAD in a QA lab reviews a batch certificate on a screen, vials behind, morning light | He clicks once, then looks up |
| S06 | Warehouse at dawn, a pallet of medicine cartons being stretch-wrapped, a label in focus (no readable text) | Wrap film circles the pallet; a forklift passes behind |
| S07 | A paper desk calendar with many days crossed out | Pages flick quickly, then the calendar snaps shut |
| S08 | A white truck on a red-earth road in rural East Africa at golden hour; a motorbike with a cool box peels off | Tracking shot alongside, dust rising |
| S09 | PHARMACIST in a storeroom ticks a printed delivery list beside opened cartons | He ticks one line, pauses, smiles slightly |
| S10 | MIDWIFE at night opens a small medicine fridge, cool light on her face | Door opens, she reaches in, her shoulders drop with relief |
| S11 | Close-up of the MIDWIFE's hand writing a time on a paper chart, warm lamp light | She writes, then rests the pen (newborn's cry in sound only) |
| S12 | GRACE at dawn closing her laptop, looking out at a city waking up | Laptop closes; slow pull-back to a wide shot |
| S13 | Two plates: the empty office desk at dawn, and a quiet labour ward at dawn | Static, the light rising |
| S14 | End card made in post: Axmed logo on indigo, "Every line is someone." | — |

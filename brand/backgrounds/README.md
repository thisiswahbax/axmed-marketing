# Atmosphere backgrounds

Out-of-focus tonal fields with film grain, after the ElevenLabs cards, in Axmed's colours.
Regenerate: `python3 scripts/make-backgrounds.py` (deterministic). Sizes: 1080×1350, 1920×1080, 1080×1080.

| Field | Hue | Text colour | Use for |
|---|---|---|---|
| `indigo-dusk` | Indigo, deep | Light (`--on-indigo`) | Sina conversations, product moments, the default dark card |
| `indigo-haze` | Indigo, light lilac | Light | Calls to action with the orb, softer brand moments |
| `cyan-deep` | Cyan, deep teal | Light | News and partnerships, logistics |
| `cyan-mist` | Cyan, pale | Dark (`--indigo`) | Light announcements, events |
| `lilac-mist` | Indigo, near white | Dark (`--indigo`) | **Default behind the Sina orb** |
| `ice-mist` | Cyan, near white | Dark (`--indigo`) | Sina conversations on light |
| `paper-warm` | Warm paper | Dark (`--indigo`) | Editorial statements, quotes, the vision |

Examples: `examples/` (a Sina conversation, a news card, the vision, a call to action).

## Rules
- **One hue per field.** Never blend indigo into cyan in one background (Hallmark floor: no purple-to-blue gradients).
- **Always carry content.** A field is a stage for something real (a conversation, a headline, a number, the orb), never an empty wash.
- **Text sits in the darker lower area** the generator builds in; keep 72 px margins.
- **Conversation bubbles:** the other person is an outline bubble (`.msg.them`), Sina is a white bubble (`.msg.sina`). Label every conversation "Illustrative conversation" until it's a real transcript.
- **Grain stays in.** It's what makes the field feel photographed rather than generated.
- **Don't use these behind dense UI**: product screenshots go on flat tints (`brand/product-cards/`).

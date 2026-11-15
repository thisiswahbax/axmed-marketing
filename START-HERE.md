# Starting a new Claude session (any account)

Everything from the first workspace session now lives in this repo. Nothing depends on the old account.

## What's where
| Work | In the repo |
|---|---|
| Brand system, assets, icons, product images | `ASSETS.md` (index), `brand/` |
| Web design system and rules | `brand/WEB-DESIGN.md` |
| Homepage prototype | `site/index.html` (open it in a browser); status in `HANDOFF.md` |
| Brand film research, 5 territories, the recommended "The List", storyboard, taglines, mood | `strategy/brand-film/creative-reference-library.md` |
| Higgsfield prompts for "The List" | `strategy/brand-film/higgsfield-shot-prompts.md` |
| Strategy, fact sheet, campaigns | `strategy/` |

## Connectors to add on the new account
- **Higgsfield** (image and video): Settings → Connectors → Add custom connector, URL `https://mcp.higgsfield.ai/mcp`, then sign in.
- **ElevenLabs** (voice and music): already set up for Claude Code in `.mcp.json`; add your API key to `.env`.
- Optional: Microsoft 365, GitHub, or whatever the team uses.

## First message to paste in the new session
> I'm continuing Axmed's marketing workspace. Read START-HERE.md, CLAUDE.md, HANDOFF.md, ASSETS.md and brand/WEB-DESIGN.md, then strategy/brand-film/creative-reference-library.md. Summarise where we are in five lines, then ask me what to work on: the homepage, the brand film ("The List"), or campaign assets.

## The rules that carry over
- Never invent numbers, quotes or partners. Figures come from `strategy/fact-sheet.md` (still pending sign-off).
- AI-generated people are mood imagery only, never presented as real partners or patients.
- Sina appears in one homepage section only.
- Run the Hallmark lint and Emil Kowalski's animation review before shipping web work.

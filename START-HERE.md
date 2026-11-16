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

## See the landing page first

From the repo folder, with Node 20 or newer (nothing to install):

```bash
npm start
```

Your browser opens the landing page at http://localhost:3094. Buyers and suppliers are at `/buy` and `/sell`,
the brand kit at `/kit`. Ctrl+C stops it.

## First message to paste in the new session

```text
I'm working in Axmed's marketing repo. Before doing anything:

1. Run `npm start` in the background so the landing page opens in my browser at http://localhost:3094,
   and tell me it's up.
2. Read README.md, CLAUDE.md, START-HERE.md and HANDOFF.md, then skim ASSETS.md and PLAN-agents.md.
3. Run `node scripts/assets.mjs due 14` and `node scripts/assets.mjs check`, and tell me what's due and
   anything the check flags.
4. Summarise in five lines where the work stands: the homepage, Campaign 01 "Every birth.", the brand
   film "The List", and the agent setup.
5. Ask me what to work on. Don't start until I answer.

Rules for this session:
- Numbers only from strategy/fact-sheet.md, worded exactly as it says; otherwise write [NUMBER NEEDED].
  Run `node scripts/check-numbers.mjs <asset folder> --final` before calling any asset done.
- No AI-generated patients, health workers or partners presented as real. No synthetic quotes or cloned voices.
- Work inside the asset's folder (brief, copy, slides, renders, review, approval) and move its status
  only with `node scripts/assets.mjs status`. Never set approved, scheduled or live: a person does that.
- Tokens from brand/system.css only. Run the Hallmark lint before any web work is done.
- Don't post, send, publish, buy credits or commit without asking me first.
```

## The rules that carry over
- Never invent numbers, quotes or partners. Figures come from `strategy/fact-sheet.md` (still pending sign-off).
- AI-generated people are mood imagery only, never presented as real partners or patients.
- Sina appears in one homepage section only.
- Run the Hallmark lint and Emil Kowalski's animation review before shipping web work.

# Motion audit: homepage prototype (Nov 2026)

Run with `improve-animations` and `choreograph` (Emil Kowalski's skills, in `.claude/skills/`). Re-audit with `improve-animations reconcile`; review new motion with `review-animations`.

## Tokens (brand/system.css)
`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for anything entering or leaving. `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for things moving on screen. Plain `ease` for hover colour.
`--dur-press 160ms`, `--dur-ui 220ms`, `--dur-swap 320ms`, `--dur-scene 640ms` (marketing scenes only).

## What changed
| # | Severity | Where | Finding | Fix |
|---|---|---|---|---|
| 1 | High | system.css | Reduced motion removed every transition, including fades that help people follow along | Keep opacity and colour; drop movement and keyframes |
| 2 | High | sina-scroll.js | CSS variables on the parent (`--grow`, `--pulse`, `--spin`) drove child transforms, recalculating styles for the whole scene every scroll frame | Set `transform` and `opacity` directly on the orb and glow |
| 3 | Medium | hero scenes, Sina caption | The whole block faded as one at 0.5s on the default `ease` (uniform, with a visible double exposure) | Choreographed: the heading rises 18px, the line 10px at +70ms, the buttons 6px at +120ms. Exits are simultaneous at 220ms, with a 2px blur masking the crossfade |
| 4 | Medium | how it works list | The description animated `max-height` (layout) on the default easing | Grid-row accordion (0fr to 1fr) on `--ease-in-out`, 320ms |
| 5 | Medium | how it works art | The art crossfade showed two screens at once | 2px blur mask; outgoing 220ms, incoming 400ms on `--ease-out`; the floating detail lands 120ms after the screen |
| 6 | Medium | buttons, tabs, list | Press feedback was `translateY(1px)` or missing | `scale(.97)` at 160ms on `--ease-out`; hover colour on `ease` (asymmetric) |
| 7 | Medium | tiles, cards | Hover lifts fired on touch | Gated behind `(hover: hover) and (pointer: fine)` |
| 8 | Low | 80% / <6% dots | Uniform 14ms stagger across 100 dots (a metronome) | Delays follow √i, so the gaps shrink as the wave goes on |

## Added (missed opportunities)
- Hero opening: the first scene plays once after the first paint, and the globe fades in over 900ms.
- Buyers and Suppliers tabs: the new panel arrives 24px from the side of the tab you pressed (320ms, `--ease-out`).

## Left as is, on purpose
- Scroll-scrubbed scenes (globe, Sina orbit, pinned list) follow the scroll directly and need no easing.
- Nav links and the footer: colour only, no movement (seen on every visit).

## Feel check (can't be judged from code)
Scrub the hero scene 1 to 2 change frame by frame: the heading should lead and the buttons trail, and it should read as one wave. Click For suppliers twice quickly: the panel must retarget, not restart.

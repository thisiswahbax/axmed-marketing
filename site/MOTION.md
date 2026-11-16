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
- Hero opening: the first scene plays once after the first paint (with a 600ms timer as a fallback for background tabs), and the 3D scene fades in over 900ms. Scroll lifts the order lines off the sheet as cartons onto the pallet (staggered hops), raises and lowers the supplier stacks, raises a truck, a ship and a plane, hops two cartons onto each and sends them off by road, water and air while the camera follows and pulls back. Nothing loops.
- Buyers and Suppliers tabs: the new panel arrives 24px from the side of the tab you pressed (320ms, `--ease-out`).

## Homepage v2 (15 Nov 2026)
| Where | Motion | Values |
|---|---|---|
| Scroll hero (`hero-order.js`) | Scrubbed over 380svh: order lines lift off the sheet onto the pallet (0.14 to 0.44), truck, ship and plane rise and load (0.54 to 0.74) and leave (0.7 to 0.86). From 0.8 they sink away while the camera pulls back to a dot map of Africa that lies flat but faces north-up; tiles rise from the centre out, seven illustrative pins drop in (0.88+) and dashed routes light (0.9+) | smoothstep, iso orthographic camera |
| Order tracker card | The rail between stops draws down one stop at a time (700ms each, 260ms apart); the in-transit stop pings its cyan halo every 2.4s | `--ease-out` |
| What you get, tiles | Rise 18px and fade in as one wave when the section is 20% in view | `--dur-scene`, `--ease-out`, 70ms stagger |
| What you get, cards and drawings | Each product card slides up 56px out of its tile 160ms after the tile; then quote bars grow, the 48 h ring fills, the route draws, pooled bars rise. Keyframes, so they replay when the other side's panel is switched in. Icons and the suppliers' globe assemble in the dot-matrix engine when first on screen | 900ms card, 800 to 1400ms drawings, `--ease-out` (route on `--ease-in-out`) |
| The mark (`mark3d.js`) | Scrubbed: ribbons pull together and twist (0.2 to 0.5), links grow one by one (0.3 to 0.56), the helix fades as the mark's three ribbons fly in (0.56 to 0.78), cyan links click in last (0.76 to 0.84), then the mark turns to face you. A slow wave on the ribbons is the only free motion, rendered only while the band is on screen | Scroll position; smoothstep per phase |
| Side switch | One state for the page: "What you get" and "How it works" switch together, the panel arrives from the side pressed | `--dur-swap`, 24px |
| Partner quotes | Words rise 0.3em out of a 6px blur, 16ms apart; the name follows at +360ms. Old quote fades out in `--dur-ui` | `--dur-scene`, `--ease-out` |
| Partner proof | The partner's dot-matrix drawing re-assembles on each switch (only the visible one runs); the figures rise 16px one after another from +240ms, 110ms apart | `--dur-scene`, `--ease-out` |
| Partner timer | The active partner's 2px bar fills linearly over 9s, then the next quote arrives. Runs only in view, pauses on hover and focus, stops for good after a click | linear, by design: it is a clock |
| Closing map | Dots ripple out from Nairobi over 1.8s; then 12 African dots at a time glint cyan, each breathing in and out over 2.4s. Base dots are cached to an offscreen canvas; the loop stops when the band leaves view | canvas, `requestAnimationFrame` |

| Product scenes | When a step comes into focus its card rises 16px and the callout lands 120ms later (12px plus fade). Out of focus: the callout leaves at once | `--dur-scene`, `--ease-out` |
| How it works track | Vertical scroll maps to a sideways `translate3d` of the track while pinned (no easing: it follows the finger). The current step scales from .96 and fades up; its floating detail lands 120ms later. Rail fill tracks progress continuously | `--dur-scene`, `--ease-out` |

Reduced motion: the How it works track swipes instead of pinning; tiles, words and drawings appear in their final state, the timer does not run, and the map is drawn once without glints.

## Left as is, on purpose
- Scroll-scrubbed scenes (hero cartons, Sina orbit, pinned list) follow the scroll directly and need no easing.
- Sina orbit (15 Nov): the six formats are dot-matrix icons (`canvas.fmt`, indigo palette, 28 cells). `sina-scroll.js` drives each one's assembly from the same `appear` value that fades the node in, so the dots gather as the format arrives on the orbit. They are not `canvas.dm`, which site.js would auto-start as paper drawings. Reduced motion draws them still.
- Nav links and the footer: colour only, no movement (seen on every visit).

## Feel check (can't be judged from code)
Scrub the hero scene 1 to 2 change frame by frame: the heading should lead and the buttons trail, and it should read as one wave. Click For suppliers twice quickly: the panel must retarget, not restart.

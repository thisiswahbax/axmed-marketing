# Sina orb — agent handover

This is the exact circular orb selected in the mobile buyer mockup on 11 November 2026. Open `index.html` to see it, or start a local server with `python3 -m http.server 8782` and visit `http://localhost:8782`.

## Send this to the other agent

> Read README.md and HANDOVER.md. Use this Sina orb: Axmed indigo and cyan, perfectly circular, with slowly rolling texture and folded light. Start with the supplied native player and animation files. The editable WebGL source is included if the material or movement needs changing. Keep the visual design and the actual animation; do not substitute a static image. Surrounding buyer UI uses Canon Sans/Avenir Next, with bold main messages and minimal controls.

## Files

- `index.html`: independent working demo. No app dependencies, API keys or build tools.
- `sina-player.js`: native animated-image adapter used by the current buyer mockup.
- `sina-flow.gif`: greeting, speaking, listening and ready animation.
- `sina-working.gif`: stronger internal movement while Sina checks information.
- `sina-orb.js`: editable original WebGL shader and live controller.
- `live.html`: independent editable live-rendering demo.
- `orb.css`: layout, sizing, fallback and Canon font aliases.
- `poster.png`: static reference only; do not use as the moving orb.
- `HANDOVER.md`: design decisions, integration notes and known limitations.

## Minimal integration

Copy the package's files into your app's public assets, e.g. `/assets/sina/`.

```html
<link rel="stylesheet" href="/assets/sina/orb.css">
<div class="orb-stage">
  <canvas id="sina" width="320" height="320"></canvas>
</div>
<script src="/assets/sina/sina-player.js"></script>
<script>
  const sina = createSinaOrb(document.getElementById('sina'));
  sina.setState('speaking');
  // sina.setState('working');
  // sina.pause(true);
  // sina.pause(false);
  // sina.destroy();
</script>
```

The native player resolves GIF URLs relative to its own script, so keep those three files together. Only the `.orb-stage`, `.orb-animation`, `.orb-still` and fallback rules from `orb.css` are needed in an existing app. The rest styles this demo; do not import its body/main styles into a real app.

Use either `sina-player.js` or `sina-orb.js`, never both: each exposes `createSinaOrb`. The demo font aliases use installed Avenir Next; proprietary fonts are not bundled.

# Design and integration decisions

## Selected appearance

- Preserve the circle. No oval shapes or wobbling silhouette.
- The main material is Axmed indigo `#261C7A`, with cyan `#0CC4FF` flowing through its folds.
- The intent combines ElevenLabs' tactile orb with Siri-like flowing light, translated into Axmed colours.
- Texture rolls internally while Sina writes. The working state has stronger internal movement.
- White is the intended background for the supplied GIFs. They are opaque, not transparent exports.
- Main buyer messages use Canon Sans Demi Bold (600), an alias for installed Avenir Next Demi Bold. Do not replace it with Inter unless explicitly requested.

## Why there are two implementations

The live WebGL shader can edit geometry, colours, grain, lights and movement. Embedded previews repeatedly appeared static to the user, so the mobile mockup now uses native animated images exported from that exact shader. Native playback was tested with JavaScript animation-frame callbacks disabled; successive screenshots showed visible pixel changes.

Both GIFs are 320 × 320, 62 frames, 100 ms/frame, approximately 6.2 seconds, looping indefinitely. The motion rolls forward and back with eased ends. They are silent. These are visual-state loops, not audio-driven or lip-synced animation. Speaking/listening/ready intentionally share `sina-flow.gif`; only working uses a different asset.

## Native player API

`const sina = createSinaOrb(canvas)`

- `setState('idle' | 'listening' | 'speaking' | 'working')`
- `pause(true | false)`: switches to a still canvas when paused, then restores the animated image.
- `setMotion(true | false)`: enables/disables movement.
- `snapshot()`: reports state, pause status, native-animation mode, selected filename and image-load status.
- `destroy()`: removes the animated image. The host owns the canvas and surrounding DOM.

The state selector is visual only: it does not start a conversation or make an API call. GIF playback timing belongs to the browser. For app-level reduced-motion support, call `pause(true)` initially when `matchMedia('(prefers-reduced-motion: reduce)').matches`, and provide an explicit motion toggle.

## Editing the live renderer

Open `live.html`. Shader source starts at `const fragment` in `sina-orb.js`. The first palette is the selected brand palette. `brandAccent` controls how cyan light is mixed into the indigo pigment. `turn()` rotates the internal material; `R=.76` holds the circular boundary. Grain softens the surface. Do not change the circular mask when altering movement.

The live controller additionally provides `drawAt(seconds, state)` for deterministic frame exports. That pauses automatic drawing; `pause(false)` resumes it. Native GIFs must be re-exported if the shader changes.

## Validation checklist

1. Open `index.html`; check that texture and folds visibly change over one second.
2. Select Working and verify the stronger movement.
3. Pause, then Resume.
4. Load the package from a different parent path; GIFs should still resolve beside `sina-player.js`.
5. Confirm the circle remains circular at the intended size; preserve a square aspect ratio.
6. Check the live shader in `live.html` before changing or re-exporting the material.

The package includes no commercial font files, credentials, narration, music or external services. These are Axmed brand assets and editable collaboration source, not a new open-source licence.

<!-- Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT -->
# Skin Studio contract and validation

The site targets `augmentor_linux/skins.py` and `backgrounds.py` at product commit
`30d21cee2a4a9e217b6ea116bc4eeacdff50aaf0` (Augmentor 0.2.9). Product runtime and
installed user settings are unchanged by this website feature.

`assets/skin-format.mjs` holds the appearance-only v1/v2 contract. Both downloadable
built-ins are exported from the native source. PNG/JPEG/WebP uploads are prepared
locally by `skin-images.mjs`, with the native limits: input <=20 MiB / 32 MP,
normalized JPEG <=1600 pixels per side and <=4 MiB, complete skin <=6 MiB.
Version 2 embeds base64 image bytes. No remote URLs, script or unrelated agent
settings are exported. No storage, telemetry, image upload endpoint or cookies
are used by the editor. The page explicitly tells users to download before leaving
and that sharing a skin also shares its embedded image.

The browser preview now ports the native appearance and motion implementation:
`nature.py`, `activity.py`, `fluid.py`, `smoke_glow.py`, `scenery.py`,
`VoiceButton.paintEvent`, `Window.apply_appearance`, and the Settings colour bars.
The window has the native 456 × 606 reading surface inside an 840 × 990 halo,
DejaVu fonts, all seven toolbar glyphs, copy controls, model picker, connection
indicator, prompt improvement glyph and animated resonant voice orb. It contains
only synthetic sample text; these controls illustrate appearance, not a connected
agent. Scroll the transcript to inspect the extra text/code colour samples.

`skin-motion.mjs` ports the 420-butterfly swarm, cubic wing paths, pointer wake,
multiscale noise, plasma emission, solar-arch flares and fluid transport. The
browser window is stationary, so native desktop-window translation/rebasing is
not needed. `skin-preview.mjs` renders these fields plus the native interior smoke,
image wash and foliage. Blossom uses the native image-derived wing palette;
uploads use the same quantization strategy with browser image resampling.
`skin-format.mjs` owns panel/accent/bubble/text colours and gradient tracks. Opacity
applies to glass and scenery; text, icons and controls remain opaque.

This is a browser port, not an embedded Qt binary or a claim of pixel-identical
rasterization. Font smoothing, HTML text layout, image resampling and random
initial particle positions can differ. Gallery videos remain actual native
captures from `scripts/capture-website-demo.py`, with synthetic conversation text.

Motion starts on unless reduced motion is requested; gallery videos start paused.
OS reduced-motion changes pause preview animation. Hidden/offscreen previews stop
ticking and resume when visible. Hidden pages stop gallery videos. **Pause motion**
only affects the browser demonstration; **Animate in the agent** is exported.
**Enable activity effects** is the native global `flares` flag and gates plasma
and butterflies alike. **Show a flare** triggers a single native-shaped eruption
for inspection, with no change to the exported skin. The native random rate of
3% per active second remains in place.

The included fonts retain their redistribution notice in
`assets/fonts/LICENSE-DejaVu.txt`. Image processing and exports remain local.

## Reproduce

```sh
node --test tests/*.test.mjs
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `/tests/image-processing.html`, click **Run image checks**, and verify PASS.
This exercises the production normalizer on synthetic canvas imagery: resizing,
JPEG conversion, embedded re-import, invalid format, byte limits and imported
image dimensions. The fixture textarea contains the resulting actual browser
export; save it to a temporary JSON file for native validation.

With the product's Qt-capable Python and source checkout:

```sh
/path/to/product/.venv/bin/python tests/native-skin-proof.py /path/to/product /tmp/exported-skin.json
```

That proof uses the actual native read/validate functions and Import dialog with
only the file/name pickers supplied by a fixture. It verifies all appearance
values and renders a preview window without touching user preferences.

September 20 evidence: five Node checks passed; browser image-processing checks
passed; both built-ins, a custom light skin and a browser-normalized embedded-image
skin passed native import/dialog/render. Browser checks covered preset selection,
theme/name/effect controls, blank-name download refusal, download initiation and
exported settings. The OS file chooser itself was not automated. Native microphone,
model, login and deployment behavior were outside this website-only change.

## Native motion parity and rendering checks

Regenerate the checked-in synthetic numeric references from the tested native ref:

```sh
/path/to/product/.venv/bin/python tests/generate-native-motion-fixtures.py /path/to/product
node --test tests/*.test.mjs
```

Five motion tests compare against actual native outputs: noise wrapping;
butterfly flight/cursor wake/boundary reflection; static/breathing/flare plasma
emission (8-bit colour tolerance 1); fluid dye/velocity over successive cursor
strokes (float32 tolerance 0.000002); and native colour-bar stops. No user settings
or conversations are read. CI runs these alongside the existing five skin tests.

Open `/tests/preview-rendering.html` and click **Run preview checks**. It imports
the production renderer and real preview markup, checking font loading, paused
frames, independent glass transparency, disabled effects, explicit flare trigger,
420 image-coloured butterflies and changing animation frames. It reports measured
plasma frame time, not a cross-device performance guarantee. The narrow-screen
fixture `/tests/responsive-preview.html` embeds the production page at 390px wide.

September 20 realism revision: all ten Node checks passed; production rendering
checks passed (approximately 12–16 ms per plasma frame on the test machine).
Futuristic and Blossom were inspected in the browser with the full toolbar and
colour gradients. The 390px frame (375px content plus scrollbar) had no horizontal
overflow. Both built-ins, custom light and browser-normalized embedded
image exports still passed the actual native import dialog and preview render.
The running desktop, login setup, model and microphone were not changed.

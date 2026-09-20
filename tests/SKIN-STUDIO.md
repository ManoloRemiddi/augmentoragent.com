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

The browser preview is approximate. It uses the native panel/accent HSL formulas,
but native typography, image tint, transparency and activity animation remain
owned by Qt. The gallery videos are actual native captures with synthetic content,
created with `scripts/capture-website-demo.py --skin Futuristic` / `--skin 'Blossom lake'`.
Browser preview motion and native captured videos start paused. OS reduced-motion
changes pause preview animation; hidden pages also stop motion/video playback.

## Reproduce

```sh
node --test tests/skin-format.test.mjs
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

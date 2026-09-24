<!-- Augmentor Agent — website (augmentoragent.com)
     Copyright © 2026 Manolo Remiddi
     SPDX-License-Identifier: MIT
     License: MIT — see LICENSE at the repository root. -->

# augmentoragent.com

Official website for **Augmentor Agent** — real browser hands for DeepSeek Harness.
Published with **GitHub Pages** from the `main` branch (repo root), served at
<https://augmentoragent.com>.

The current complete preview combines native Desktop, a matching Chromium extension,
DSH, required plugins and optional local voice/dual-memory engines. The installer
and exact qualification scope are linked from the landing page.

## Repo layout

- `index.html` — landing page (hero, models, in-action, features, veil, install, FAQ).
- `docs.html` — architecture & install details.
- `plugins.html`, `assets/plugins.css` — plugin explanations and individual/collection downloads.
- `favicon.svg`, `assets/` — styles, images, and the veil WebGL demo.
- All asset references are **relative**, so the site serves unchanged from the repo root.

## Deployment

Changes to `main` auto-deploy via GitHub Pages (a `main` / root source is
configured in **Settings → Pages**). Workflow:

```bash
# edit index.html / docs.html / assets/style.css
git add -A
git commit -m "describe the change"
git push origin main
```

Then confirm on the live site (Pages builds in ~a minute or two).

## DNS / custom domain

Custom domain `augmentoragent.com` is set in **Settings → Pages → Custom domain**
(committed as the `CNAME`/Pages setting). DNS is managed at the registrar and
points at GitHub Pages:

| Type | Name/Host | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153`, `.109`, `.110`, `.111` |
| `CNAME` | `www` | `ManoloRemiddi.github.io` |

**HTTPS is enforced**; `www` 301-redirects to the apex automatically. The HTTP→HTTPS
redirect is handled by GitHub Pages edge once the domain is verified.

## Notes

- This repository is the deployed website source. Keep installation instructions
  in sync with the released product README and GitHub release assets.
- `config`-level defaults: none. Everything the site claims matches the plugin
  and extension behavior; keep claims in step with the product code.

## Plugin downloads

The plugins page links to pinned GitHub Release assets. The collection ZIP is
built from verified, unmodified individual packages in the
[collection repository](https://github.com/ManoloRemiddi/deepseek-harness-plugins).
When publishing a new collection, update its manifest and guide, verify the
archive, publish the release, then update the website’s version labels and links.
Preview status and setup limitations must remain visible before download.

## September 20 complete preview

The landing page links to `v0.2.9-complete-preview.1` in the public distribution
repository. Native screenshots and the six-second WebM use synthetic content and
the built-in Blossom lake skin. The gallery now also includes Futuristic. Skin
films start paused and have playback controls; Motion off also pauses the landing
page film. Legacy Browser/Fedora/collection instructions
remain explicitly marked as separate older distributions.

## Skin Studio

`skins.html` showcases both Futuristic and Blossom lake with actual native captures
and provides a browser-only skin editor. Users can choose a built-in starting point,
upload a local background, edit all portable appearance settings, import an existing
skin, and download a file for **Colors & skins → Import…** in Augmentor Desktop.
Images stay in the browser and are embedded in the downloaded file. The editor
has no persistence or backend; its preview is explicitly approximate.

See [the format, limits and native round-trip checks](tests/SKIN-STUDIO.md).
The landing page's native animation picker also switches between both skins.

## September 21 execution recovery release

Current complete download: `v0.2.10-complete-preview.1`. Desktop and Browser include the same bounded execution adapter, with action outcomes, exact-duplicate protection during recovery and explicit tool handoffs. Required plugins install together; Voice is 0.1.16. This remains a Debian 13 amd64 preview, not a claim of universal model correctness. Older standalone collections remain clearly separate.

## September 23 source publication and license

The current Desktop + Browser source is published at
[augmentor-agent](https://github.com/ManoloRemiddi/augmentor-agent).
`licensing.html` explains MIT with Augmentor Resale Restriction and links to resale
permission requests. `augmentor-license.txt` reproduces the product's combined
license verbatim. Earlier binary downloads retain their shipped licenses. The
website implementation itself continues to use its own root `LICENSE`.

## September 23 repository consolidation

The single active Desktop + Browser repository is
[augmentor-agent](https://github.com/ManoloRemiddi/augmentor-agent), branch `main`.
The website repository remains active solely for this site. The install button
and copied prompt use the canonical installation guide. Existing 0.2.10 assets,
legacy Fedora packages and Browser 0.1.32 downloads retain their exact archived
URLs and original licenses. They are not newly built or relicensed releases.

## September 24 security release

Current downloads and copied prompts use canonical `augmentor-agent` release
`v0.2.11-complete-preview.1`. The legacy Browser install recipe has been retired
because 0.1.32 contains a vulnerable ws dependency. Historical collection assets
remain identified as historical; their Augmentor package must not be installed.

Live Pages deployment and anonymous complete-archive/checksum download were verified.
The live copy button reported success for the visible 0.2.11 canonical prompt in
the in-app browser. Its clipboard API did not expose matching clipboard contents,
so clipboard readback is not claimed. This website check is separate from the
user's Chromium extension state.

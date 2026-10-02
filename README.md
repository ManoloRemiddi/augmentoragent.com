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
- `windows.html` — Windows 11 25H2+ x64/ARM64 unsigned preview guide and download links. Physical acceptance, signing and automatic updates remain pending.
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


## September 24 desktop flare release

Current Desktop/Browser download is `v0.2.12-complete-preview.1` in the canonical
application repository. It fixes exterior activity effects following an unlocked
agent onto other workspaces or covering a second agent. Visible versions, download
links and copied installation prompts all select the matched 0.2.12 complete bundle.
The existing WebSocket security correction and required plugin versions remain.

Publication verification: Pages deployed `fc427ce`; the live download button and
installation textarea both select 0.2.12. Clicking the copy button reported
success, and the browser clipboard matched the complete visible prompt exactly.
Anonymous download matched published SHA-256
`2ce620233e9312db86a0dccac9d07257bd9f700a0d19326b96460463379d1fa4`.
All 15 website tests passed locally and in CI.

## September 26 macOS preview

The Mac download is a separate Apple-silicon preview from canonical release
`v0.2.12-macos-preview.1`; `macos.html` is its short guide. It explicitly discloses
Apple Open Anyway approval, manual Chrome extension loading, API-key storage,
manual update/removal limits and unqualified speech/desktop-control paths. Linux
0.2.12 links and its copied installation prompt remain unchanged. The Mac app
bundles its runtimes and required plugins; no personal model configuration is
used.

Publication verification: Pages deployed `bd205bb` successfully and the website
checks passed. Live homepage and guide links select the released 508,240,784-byte
DMG. Its complete anonymous public download matched published SHA-256
`058a0920e4da753593372a7d499d980b7672590e8499cf929371460b459db8e4`.
The guide layout, navigation, version, platform and first-launch disclosure were
checked in the browser. The unchanged Linux download destinations returned HTTP
200 and the live copy button reported success; clipboard-content readback is not
claimed for this check. The application release record lists exact Mac UI/DSH
tests and unqualified consent, speech and updater flows.

## September 27 Mac preview 2

The homepage and Mac guide target `v0.2.12-macos-preview.2` in the canonical
application repository: the accepted live App size, flare transparency and guided
DSH setup corrections. The 519 MB DMG contains the sealed `b8dac9d` app. Its SHA-256
is `946a546c98f37ca43ac3fd4596ef3c87100520bc7639ae0737fedbde72b52ae4`.
The installation guide now describes Install and start DSH, authenticated browser
model setup, and immediate 75–150% sizing. Apple approval, unpacked extension and
manual-update limitations remain visible. Existing Linux links and the copied
Debian installation prompt are unchanged. All 15 website tests and five JavaScript
syntax checks pass before deployment. Publication and live verification are
recorded below when complete.

Preview 2 was published at 12:30:07 UTC. Website commit `e627dcc` passed
[website CI](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/36319266879)
and [Pages deployment](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/36319266526).
The live homepage, Mac guide and Desktop page match the committed HTML byte for
byte. All Mac download/checksum links select preview 2. Linux prompt text is
unchanged; Linux and retained dependency-source download destinations return 200.
A local IPv4 outage required IPv6 for transfer and HTTP verification; no network
settings were changed. The in-app browser could not reload the site, so a fresh
rendered-layout, live copy-button and clipboard check is not claimed for this run.
The anonymous full DMG download completed at 12:34:28 UTC: all 519,286,460 bytes
matched the published SHA-256 above, and the public checksum file matched the
prepared release. This README-only follow-up does not change the tested interface.

## September 27 Mac preview 3

The homepage and Mac guide now target `v0.2.12-macos-preview.3`, built from
application source `3627daebbfe88a3f9adc92f2566575b343655b7e` and merged through
application PR #17. Browser setup discovers installed Chromium apps, provides an
app chooser and handles Comet's native connection location. The guide uses the
actual control labels and retains manual browser approval and preview limits.

The 528,906,168-byte DMG passed a complete anonymous download and matched
SHA-256 `d31488baf9e07329d5f07f62f3f51052bc990d6e3f638dfa33856aa62d0ec694`.
The matching app passed 130 Mac tests, actual Comet/Chrome fixture chat, DMG
copy/launch/integrity checks, Mac 14/26 CI and the complete Linux/Home/Browser
workflow. All 15 website tests pass; Linux install-prompt text is unchanged.
See the [application release record](https://github.com/ManoloRemiddi/augmentor-agent/blob/main/docs/MACOS-PREVIEW-3-RELEASE.md)
for publication, qualification boundaries and deployment verification.

## October 1 — general browser reliability preview

Download links and the copied install prompt select matched 0.2.13 Linux and Mac
previews from the canonical application repository. The release strengthens
general browser observations, omitted-text recovery, long-page reads and tab
targeting. Existing preview labels and manual setup limits remain.

Both full anonymous public downloads match the tested candidates from source
`0eb2ec112afa52b886b63606f80967198a7feb0c`:

- Linux complete archive: 72,665,721 bytes; SHA-256
  `6c327d99b04796f2901850364670aa61015b17f739582c64126421858b56b65d`.
- Apple-silicon Mac DMG: 522,788,721 bytes; SHA-256
  `ad7545be4759281ebffc40c27dd109fc691f64dd924e2a799e911e7fd598aac4`.

All 15 website tests pass. Live Pages, copy-button and destination verification
is recorded after deployment in the application
[release record](https://github.com/ManoloRemiddi/augmentor-agent/blob/main/docs/RELEASE-0.2.13.md).

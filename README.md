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

## October 3 matched Handy preview 2

The homepage, Linux installation textarea and Mac/Windows guides select matching
preview-2 releases from application source
`6f001fd395a4575ea58d1899f7b68aa1d5283004`, merged through
[PR #35](https://github.com/ManoloRemiddi/augmentor-agent/pull/35)
as `5d4ab848e2d8e1e49a030fa2c139e6b7d65ce009`. All packages include native
Handy, managed in Augmentor Settings without a separate tray. The recording
pill follows Augmentor appearance and includes the four-pixel circle correction.
First-use model download and platform permissions remain explicit. Physical
microphone/typing acceptance on Mac and Windows is pending; these remain
unsigned/ad-hoc previews with no coordinated automatic update claim.

| Customer download | Bytes | SHA-256 |
|---|---:|---|
| [augmentor-0.2.13-complete-preview.2.tar.gz](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-complete-preview.2/augmentor-0.2.13-complete-preview.2.tar.gz) | 323835139 | `38f300c25d6c98c95e1764302eec7883bc55786cd74fd4113e6cf2ba3962fc0b` |
| [augmentor-desktop-0.2.13-macos-arm64-preview.dmg](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-macos-preview.2/augmentor-desktop-0.2.13-macos-arm64-preview.dmg) | 755102238 | `1387b3ccd6511e75c48444b1e01ff010eeb08a1a5ede5ae8de929daab3cb84cc` |
| [Augmentor-0.2.13-windows-arm64-preview.exe](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-windows-preview.2/Augmentor-0.2.13-windows-arm64-preview.exe) | 868399288 | `964b9a3be2eda345f81996d84e07419bb438dbe3b71a91353b471b7235daf40b` |
| [Augmentor-0.2.13-windows-x64-preview.exe](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-windows-preview.2/Augmentor-0.2.13-windows-x64-preview.exe) | 925485099 | `4f90ab23455bd65ea37259eeb6edc55bf6532e2716adff74ff7e5744e2d3df63` |

All 15 website tests pass, including the copy button's binding to the updated
installation textarea and exact release URLs. Existing copy-handler behavior
is unchanged. All 35 public assets were downloaded anonymously and hashed in
full at `2026-10-03T16:35:55Z`; their bytes and digests match the qualified candidates.
Live Pages verification is recorded below after deployment; no physical
clipboard click or readback is claimed here.

Live verification completed at `2026-10-03T16:38:08Z`: homepage (including the
default `/` path), Mac guide and Windows guide match website commit
`4658894671aad934da7273435fa903fc1e4f6007` byte for byte. All download/checksum links select
the anonymously verified preview-2 assets. The Linux textarea contains the exact
archive/checksum pair and remains bound to its copy button.
[Pages deployment](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/37137481918) and
[website CI](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/37137482688)
passed. This source/live HTML check did not click the owner's browser or read
their clipboard.

## October 5 preview-3 website candidate — historical preparation

This candidate updates current Linux, Apple-silicon Mac and Windows x64/ARM64
download/checksum links and the Linux copied-install prompt to matching preview 3.
The cohort includes saved-enabled dictation startup recovery and the Linux
animated-overlay rendering repair. The owner resumed publication after restarting;
their existing compatible dictation component was already running before its
status probe and reported enabled/ready on Ctrl+Space, with no tray or error.
All eight exact-source application/package/platform workflows pass. All 15
website checks pass. Deployment remains withheld until every new asset is
published and anonymously hashed in full, then live website checks confirm it.

Application customer source is frozen at
`3d1e6153f1e3aed86f56d915d60cd1d55ea49190`, merged through
[release preparation PR #40](https://github.com/ManoloRemiddi/augmentor-agent/pull/40)
as `a45a4dc821e0e8ca744f81452025c3ddc807898b`.
The source/merge trees match. Older assets remain immutable and the existing
website design and preview limits are preserved. Final file sizes, checksums
and deployment verification will be recorded after publication.

## October 5 matched dictation repair preview 3

The homepage, Linux copied install prompt and Mac/Windows guides now select the matching preview-3 cohort from application source `3d1e6153f1e3aed86f56d915d60cd1d55ea49190`. The [dictation fixes](https://github.com/ManoloRemiddi/augmentor-agent/pull/39) and [release preparation](https://github.com/ManoloRemiddi/augmentor-agent/pull/40) are merged. Saved enabled dictation restores when Augmentor starts after login; the Linux recording overlay retains its static pill and controls during animation on WebKitGTK 2.54. All platforms were prepared before publication. Older dated assets remain immutable.

| Download | Bytes | SHA-256 |
|---|---:|---|
| [augmentor-0.2.13-complete-preview.3.tar.gz](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-complete-preview.3/augmentor-0.2.13-complete-preview.3.tar.gz) | 323879679 | `2fc1db9bb66698f83cdef5bc18f121b0b9bb4fb376b6b3c1fbccbb8253580bf7` |
| [augmentor-desktop-0.2.13-macos-arm64-preview.dmg](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-macos-preview.3/augmentor-desktop-0.2.13-macos-arm64-preview.dmg) | 762480533 | `8c06e2c7a70533d5959cdd54f75fbab9f73c55a03e482378a53e5271ae9e03c7` |
| [Augmentor-0.2.13-windows-arm64-preview.exe](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-windows-preview.3/Augmentor-0.2.13-windows-arm64-preview.exe) | 868448213 | `066cde09f3bc8ef5c372286d4a3adcfa6b6f005046455dcc5841174c06b5d07e` |
| [Augmentor-0.2.13-windows-x64-preview.exe](https://github.com/ManoloRemiddi/augmentor-agent/releases/download/v0.2.13-windows-preview.3/Augmentor-0.2.13-windows-x64-preview.exe) | 925498232 | `3074f7529fc47e3e624074a234b0361908344c3e27986810009ddfdfcc72769c` |

Eight exact-source application/package/platform workflows pass. All 35 public assets were downloaded anonymously and hashed in full at `2026-10-05T13:51:50Z`. All 15 website cases and five JavaScript syntax checks pass. [Website CI](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/37320154908) and [Pages deployment](https://github.com/ManoloRemiddi/augmentoragent.com/actions/runs/37320155115) pass. Live `/`, homepage, Mac/Windows guides and copy-handler source match website commit `8cd60a93dc1ae2eba64667a9edd28f41fc82cb4c` byte for byte at `2026-10-05T13:54:37Z`. Current links select verified preview 3; the Linux textarea contains the exact archive/checksum pair and is bound to its existing copy handler. No physical clipboard click/readback is claimed.

Mac/Windows physical microphone/permission/typing acceptance remains separate from hosted qualification. Existing unsigned/ad-hoc preview and manual-maintenance limits remain; models/personal settings are not bundled. Windows preview 3 must not replace preview 1 or 2 in place. The [application ledger](https://github.com/ManoloRemiddi/augmentor-agent/blob/main/docs/HANDY-DOWNLOADS-2026-10-05.md) records detailed source, qualification and deployment scope. This documentation follow-up does not change the verified HTML.

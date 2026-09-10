<!-- Augmentor Agent — website (augmentoragent.com)
     Copyright © 2026 Manolo Remiddi
     SPDX-License-Identifier: MIT
     License: MIT — see LICENSE at the repository root. -->

# augmentoragent.com

Official website for **Augmentor Agent** — real browser hands for DeepSeek Harness.
Published with **GitHub Pages** from the `main` branch (repo root), served at
<https://augmentoragent.com>.

Two pieces: a DeepSeek Harness plugin (`dsh-augmentor`, installed from the
Augmentor repo's `plugin/` package) plus a Chromium extension that drives your
real browser behind a visible frost veil.

## Repo layout

- `index.html` — landing page (hero, models, in-action, features, veil, install, FAQ).
- `docs.html` — architecture & install details.
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vaklab AI marketing website — a single-page static site for a healthcare AI company. No build step, no frameworks, no package.json. The entire site is one HTML file with inline CSS and JS.

## Architecture

- **`public/index.html`** — the entire website (HTML + inline CSS + inline JS). All changes happen here.
- **Firebase Hosting** — serves the site. Project ID: `vaklabai-site`. Custom domain: `vaklabai.com`.
- **SPA rewrite** — `firebase.json` rewrites all routes to `/index.html`.
- **Cache** — 1-hour public cache (`max-age=3600`) on all assets.

## Deploy

Pushing to `main` auto-deploys via GitHub Actions (`firebase-deploy.yml`). PRs get preview URLs (`firebase-preview.yml`).

Manual deploy:
```bash
firebase deploy --only hosting --project vaklabai-site
```

Local preview:
```bash
firebase serve
```

## Key Details

- GitHub org: `vaklabdev`
- Firebase project: `vaklabai-site`
- The `FIREBASE_SERVICE_ACCOUNT` GitHub secret holds the service account JSON for CI deploys.
- Domain DNS points to Firebase IP `199.36.158.100`.
- No Cloudflare — emails must use plain `mailto:` links, not Cloudflare email obfuscation.
- Support email: `support@vaklabai.com` (no sales email).

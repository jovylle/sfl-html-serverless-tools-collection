# sfl-html-serverless-tools-collection

A collection of **small, independent HTML tools** for the [Sunflower Land](https://sunflower-land.com) (SFL) community. The game encourages players and builders to make helpers—calculators, dashboards, planners—using public data and documented APIs.

This repo favors **plain static pages** plus **serverless** only where something must stay off the client (secrets, rate limits, heavy transforms). Shared UI and helpers live under `shared/` so each tool stays thin.

## Philosophy: generous, free-to-use building blocks

- Prefer **browser-native APIs** (`fetch`, DOM, CSS) and **vanilla JS** so tools stay easy to host and audit.
- When you add a library, pick **permissive licenses** (MIT, BSD, Apache-2.0, ISC) and **CDN-friendly** packages when it helps (charts, date math, etc.). Avoid copyleft or unclear “community” licenses unless the tool explicitly needs them and the choice is documented.
- Keep dependencies **few and obvious**—each `tools/<name>/` folder should make it clear what it loads and why.

## Layout

- **`tools/<name>/`** — one tool per folder; typically a single `index.html` plus inline or local scripts, referencing `shared/`.
- **`shared/`** — common CSS/JS used across tools.
- **`functions/`** — serverless handlers for privileged or sensitive flows (not required for read-only community tools).
- **`tests/`** — fixtures and sample API payloads for local development (e.g. cached community farm JSON).

CDN or edge builds may inject common headers/footers; plan for minification, gzip, and caching at deploy time.

## Sunflower Land APIs and docs

SFL exposes data and integration points for community projects:

- **Official docs (portals / UGC)** — [Portals & UGC](https://docs.sunflower-land.com/contributing/portals-ugc) and [Portal APIs](https://docs.sunflower-land.com/contributing/portals-ugc/portal-apis) describe how embedded experiences talk to the game (auth, player state, events).
- **Community-oriented HTTP APIs** — endpoints for prices, auctions, farm summaries, and related data are summarized on community sites such as [sfl.world — API](https://sfl.world/util/api) (verify URLs and terms of use before shipping; prefer official docs when integrating with the game client).

Tools in this repo often **read public JSON** (farm snapshots, listings, etc.). Respect **rate limits**, **caching**, and **player privacy**—do not ship farm IDs or tokens in client-side logs.

## Getting started

Open any `tools/<name>/index.html` in a browser, or serve the repo root with a static file server so `fetch` paths resolve.

Example:

- `tools/example/index.html` loads sample inventory from `tests/api.sunflower-land.com-community-farms-1-sample.json`.

## Development

Add new tools under `tools/` or extend `shared/`. Document in the tool’s HTML (or a short comment) which APIs it calls and any third-party scripts with license notes.

## Deployment

Target static hosting plus optional serverless; optimize with build-time minification, compression, and edge caching.

## License

MIT

---

This project is open source and welcomes contributions from the community.

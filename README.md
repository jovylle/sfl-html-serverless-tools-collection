# sfl-html-serverless-tools-collection

A collection of **small, independent HTML tools** for the [Sunflower Land](https://sunflower-land.com) (SFL) community. The game encourages players and builders to make helpers—calculators, dashboards, planners—using public data and documented APIs.

This repo favors **plain static pages** plus **serverless** only where something must stay off the client (secrets, rate limits, heavy transforms). Shared UI and helpers live under `shared/` so each tool stays thin.

## Philosophy: generous, free-to-use building blocks

- Prefer **browser-native APIs** (`fetch`, DOM, CSS) and **vanilla JS** so tools stay easy to host and audit.
- When you add a library, pick **permissive licenses** (MIT, BSD, Apache-2.0, ISC) and **CDN-friendly** packages when it helps (charts, date math, etc.). Avoid copyleft or unclear “community” licenses unless the tool explicitly needs them and the choice is documented.
- Keep dependencies **few and obvious**—each `tools/<name>/` folder should make it clear what it loads and why.

## Layout

- **`index.html`** (repo root) — home page listing tools and short intro. Deployed at `/` (no `.html` in the URL).
- **`tools/<name>/`** — one tool per folder; use **`index.html`** inside that folder so the live URL is **`/tools/<name>/`**, not `something.html`.
- **`shared/`** — common CSS/JS used across tools.
- **`functions/`** — serverless handlers for privileged or sensitive flows (not required for read-only community tools).
- **`tests/`** — fixtures and sample API payloads for local development (e.g. cached community farm JSON).

### Clean URLs (no `.html`)

Link to **`/tools/<name>/`** (trailing slash is fine). Do not link to `index.html` or `page.html` in docs or the home page—Netlify and most static hosts serve `index.html` automatically for that path, so the address bar stays clean.

When you add a tool, create **`tools/<new-tool>/index.html`** and add a row to the root **`index.html`** tool list.

CDN or edge builds may inject common headers/footers; plan for minification, gzip, and caching at deploy time.

## Sunflower Land APIs and docs

SFL exposes data and integration points for community projects:

- **Official docs (portals / UGC)** — [Portals & UGC](https://docs.sunflower-land.com/contributing/portals-ugc) and [Portal APIs](https://docs.sunflower-land.com/contributing/portals-ugc/portal-apis) describe how embedded experiences talk to the game (auth, player state, events).
- **Community-oriented HTTP APIs** — endpoints for prices, auctions, farm summaries, and related data are summarized on community sites such as [sfl.world — API](https://sfl.world/util/api) (verify URLs and terms of use before shipping; prefer official docs when integrating with the game client).

Tools in this repo often **read public JSON** (farm snapshots, listings, etc.). Respect **rate limits**, **caching**, and **player privacy**—do not ship farm IDs or tokens in client-side logs.

## Getting started

Open **`index.html`** at the repo root, or open **`tools/<name>/index.html`** directly. For local `fetch` paths to work, serve the **repo root** (not only the tool folder), for example:

```bash
npx serve .
```

Example tool:

- **`tools/example/`** loads sample inventory from `tests/api.sunflower-land.com-community-farms-1-sample.json`.

## Development

Add new tools under `tools/` or extend `shared/`. Document in the tool’s HTML (or a short comment) which APIs it calls and any third-party scripts with license notes.

If you fork this repo, update the **GitHub** link in the root `index.html` footer to match your remote.

## Deployment (Netlify)

This repo is a **static site**: no build command, publish from the repository root.

1. In [Netlify](https://www.netlify.com/), choose **Add new site → Import an existing project** and connect this Git repo.
2. Leave **Build command** empty (or use a no-op such as `true` if the UI requires a value).
3. Set **Publish directory** to **`.`** (a single dot = repo root).  
   If you use **`netlify.toml`**, it already sets `publish = "."`—matching these fields in the UI avoids surprises.
4. Deploy. The home page is **`/`**; tools are **`/tools/<name>/`**.

Optional: in Netlify **Site configuration → Build & deploy → Post processing**, enable **Pretty URLs** if you want extra redirects from `*.html` to extensionless paths (folder + `index.html` already gives you clean tool URLs).

For other hosts, mirror the same idea: serve the repo root as the document root; keep optional serverless under `functions/` separate per that platform.

## License

MIT

---

This project is open source and welcomes contributions from the community.
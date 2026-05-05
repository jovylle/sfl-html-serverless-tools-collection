# sfl-html-serverless-tools-collection

This project implements a collection of independent HTML tools for the Sunflower Land community.

- Each tool lives in `tools/<name>/` with a single HTML file referencing shared assets.
- Shared common code and styles are in the `shared/` directory.
- The system may inject common headers/footers at the CDN or edge.
- Serverless functions for secure or privileged operations live in `functions/`.

## Getting Started

Open any `tools/<name>/index.html` directly in browser or deploy to static hosting.

Example:
- `tools/example/index.html` uses sample farm inventory JSON from `tests/api.sunflower-land.com-community-farms-1-sample.json`.

## Development

Contributions should add new tools under `tools/` or shared utilities in `shared/`.

## Deployment

Plan for build-time minification, gzip, and edge deployment to maximize speed and cache efficiency.

## License

MIT

---

This project is open source and welcomes contributions from the community.

Contact: you

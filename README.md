# Yay mazes

Interactive maze generation and solving app built with React, TypeScript, Redux, and Vite.

## Development

```bash
npm install
npm start
```

## Testing

```bash
npm test
```

## Deploying to Cloudflare Workers

The app is deployed as a static-assets-only Worker. `wrangler.jsonc` points Wrangler at the
Vite build output (`dist/`), and unknown paths fall back to `index.html` (SPA behavior).

One-time setup:

```bash
npx wrangler login
```

Manual deploy:

```bash
npm run deploy
```

That builds the app and uploads `dist/` to the `mazes` Worker. It is served at
<https://mazes.thudfactor.com>.

The custom domain is declared in `wrangler.jsonc` with `"custom_domain": true`. Because
`thudfactor.com` is an active zone in the same Cloudflare account, `wrangler deploy` creates
the DNS record and issues the TLS certificate automatically — no manual DNS or certificate
setup is needed. The Worker is also still reachable at `https://mazes.<your-subdomain>.workers.dev`
unless you set `"workers_dev": false`.

Other commands:

- `npm run deploy:dry-run` – build and validate the upload without publishing.
- `npm run preview:worker` – build and serve the Worker locally at http://localhost:8787.
- `npx wrangler tail` – stream live logs from the deployed Worker.

To move it to a different hostname, edit the `routes` entry in `wrangler.jsonc` and redeploy.

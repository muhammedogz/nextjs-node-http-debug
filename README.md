# Next.js Server-Side HTTP Debug Demo

> Learn how to intercept and debug server-side HTTP requests in Next.js using a proxy.

## The Problem

When debugging Next.js applications, server-side HTTP requests are **invisible** in browser DevTools. Server Components, Route Handlers, and Server Actions all run on the server — their network traffic never touches the browser.

## The Solution

Route all server-side HTTP traffic through a debugging proxy using a preload script that patches Node.js **before** your app starts.

https://github.com/user-attachments/assets/e49d4d23-0a63-437d-8b65-e8f917556400

## Quick Start

### 1. Install the Proxy (mitmproxy)

**macOS:**
```bash
brew install mitmproxy
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install mitmproxy
```

**Windows:**
```bash
winget install mitmproxy
```

### 2. Install the Demo App

```bash
git clone https://github.com/yourusername/nextjs-server-http-debug-demo.git
cd nextjs-server-http-debug-demo
pnpm install
```

### 3. Run

**Terminal 1 - Start the proxy:**
```bash
mitmweb --listen-port 8080
```

This opens a web UI at http://localhost:8081 where you can inspect requests.

**Terminal 2 - Start Next.js with proxy:**
```bash
pnpm dev:proxy
```

Open http://localhost:3000 and visit any demo page. Watch the requests appear in mitmproxy.

## How It Works

### Why Two Patches Are Needed

Node.js has **two separate HTTP stacks**:

| Stack | Used By | Respects HTTP_PROXY? | Patch Method |
|-------|---------|---------------------|--------------|
| **undici** | Native `fetch()`, Ky | No | `setGlobalDispatcher()` |
| **http/https** | Axios, got, superagent | Sometimes | `global-agent` |

Without patching both, some requests will bypass the proxy.

### The Preload Script

`scripts/proxy-preload.cjs`:

```javascript
// DEV ONLY - never run in prod
if (process.env.NODE_ENV === 'development') {
  const proxyUrl = process.env.HTTP_PROXY || 'http://127.0.0.1:8080';

  // 1) Patch fetch (undici)
  const { setGlobalDispatcher, ProxyAgent } = require('undici');
  setGlobalDispatcher(new ProxyAgent(proxyUrl));

  // 2) Patch http/https (axios, got, etc.)
  require('global-agent/bootstrap');
}
```

### The npm Script

```json
"dev:proxy": "NODE_ENV=development NODE_OPTIONS=\"--require ./scripts/proxy-preload.cjs\" HTTP_PROXY=http://127.0.0.1:8080 HTTPS_PROXY=http://127.0.0.1:8080 NODE_TLS_REJECT_UNAUTHORIZED=0 next dev"
```

Key parts:
- `NODE_OPTIONS="--require ..."` - Load the patch before Next.js starts
- `NODE_ENV=development` - Only patch in development
- `HTTP_PROXY` / `HTTPS_PROXY` - Tell the preload script where the proxy is (both are needed for global-agent)
- `NODE_TLS_REJECT_UNAUTHORIZED=0` - Accept proxy's self-signed certificate

## Project Structure

```
src/app/
├── layout.tsx        # Root layout with navigation
├── page.tsx          # Home page with instructions
├── fetch-demo/       # Native fetch example
├── ky-demo/          # Ky example
└── axios-demo/       # Axios example

scripts/
└── proxy-preload.cjs # The proxy injection script
```

## mitmproxy Commands

- `mitmweb` - Web UI at http://localhost:8081 (recommended)
- `mitmproxy` - Terminal UI with vim-like keybindings
- `mitmdump` - Command-line output only

All commands use port 8080 by default for the proxy.

## Troubleshooting

### Requests not appearing in proxy

1. Make sure the proxy is running **before** starting Next.js
2. Verify the port matches: `mitmproxy --listen-port 8080`
3. Check the console for `[dev-proxy] undici enabled` and `[dev-proxy] global-agent enabled`

### SSL/TLS errors

The `NODE_TLS_REJECT_UNAUTHORIZED=0` flag is already set in `dev:proxy`. If you still see errors:
1. Restart both the proxy and Next.js
2. For production-like testing, install your proxy's root certificate

### Installing mitmproxy Certificate

For a more production-like setup (without `NODE_TLS_REJECT_UNAUTHORIZED=0`), install mitmproxy's CA certificate:

1. Start mitmproxy and visit http://mitm.it in a browser proxied through mitmproxy
2. Download the certificate for your OS
3. The certificate is also available at `~/.mitmproxy/mitmproxy-ca-cert.pem`

For Node.js, set the `NODE_EXTRA_CA_CERTS` environment variable:
```bash
NODE_EXTRA_CA_CERTS=~/.mitmproxy/mitmproxy-ca-cert.pem pnpm dev:proxy
```

### Some requests bypass the proxy

Make sure both patches succeeded in the console output:
```
[dev-proxy] undici enabled → http://127.0.0.1:8080
[dev-proxy] global-agent enabled
```

## What This Covers

- Native `fetch()` (Server Components, Route Handlers)
- Ky (fetch-based HTTP client)
- Axios (http/https-based HTTP client)
- Any library using fetch or http/https under the hood

## What This Doesn't Cover

- **Edge Runtime** - Runs in a different environment, not Node.js
- **Browser requests** - Use browser DevTools for those
- **Native binaries** - curl, wget, etc. from child processes

## License

MIT

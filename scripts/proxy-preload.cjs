/**
 * Proxy Preload Script
 *
 * This script intercepts HTTP/HTTPS requests from:
 * - Native fetch (via undici's setGlobalDispatcher)
 * - Ky (uses native fetch)
 * - Axios, got, superagent (via global-agent)
 *
 * Usage: node --require ./scripts/proxy-preload.cjs your-app.js
 *
 * Why TWO patches?
 * Node.js has two separate HTTP stacks:
 * 1. undici - Powers native fetch() - does NOT respect HTTP_PROXY env vars
 * 2. http/https modules - Used by axios, got, etc. - global-agent patches these
 */

// DEV ONLY - never run in prod
if (process.env.NODE_ENV === 'development') {
  const proxyUrl = process.env.HTTP_PROXY || 'http://127.0.0.1:8080';

  // 1) Patch fetch / Next.js server-side networking (undici)
  try {
    const { setGlobalDispatcher, ProxyAgent } = require('undici');
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
    console.log('[dev-proxy] undici enabled →', proxyUrl);
  } catch (err) {
    console.warn('[dev-proxy] undici patch failed:', err.message);
  }

  // 2) Patch http/https clients (axios, got, superagent, etc.)
  try {
    require('global-agent/bootstrap');
    console.log('[dev-proxy] global-agent enabled');
  } catch (err) {
    console.warn('[dev-proxy] global-agent patch failed:', err.message);
  }
}

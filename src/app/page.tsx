export default function HomePage() {
  return (
    <section>
      <h2>Welcome</h2>
      <p>
        This demo shows how to debug server-side HTTP requests in Next.js using
        a proxy like mitmproxy, Charles, or Fiddler.
      </p>

      <h3>The Problem</h3>
      <p>
        Server-side HTTP requests in Next.js are <strong>invisible</strong> in
        browser DevTools. They run on the server, not the browser.
      </p>

      <h3>The Solution</h3>
      <p>
        Route all server traffic through a debugging proxy using a preload
        script that patches Node.js at startup.
      </p>

      <h3>How to Use</h3>
      <ol>
        <li>
          Start your proxy (e.g., <code>mitmproxy --listen-port 8080</code>)
        </li>
        <li>
          Run <code>pnpm dev:proxy</code>
        </li>
        <li>Visit any demo page - requests will appear in your proxy</li>
      </ol>

      <h3>Demo Pages</h3>
      <ul>
        <li>
          <a href="/fetch-demo">Native Fetch</a> - Using Node&apos;s built-in
          fetch
        </li>
        <li>
          <a href="/ky-demo">Ky</a> - Elegant HTTP client based on fetch
        </li>
        <li>
          <a href="/axios-demo">Axios</a> - Popular promise-based HTTP client
        </li>
      </ul>
    </section>
  );
}

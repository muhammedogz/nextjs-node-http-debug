export const dynamic = 'force-dynamic';

interface HttpBinResponse {
  origin: string;
  url: string;
  headers: Record<string, string>;
  args: Record<string, string>;
}

async function getServerData(): Promise<HttpBinResponse> {
  const response = await fetch('https://httpbin.org/get?client=native-fetch', {
    headers: {
      'X-Demo-Client': 'native-fetch',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

export default async function FetchDemoPage() {
  const data = await getServerData();

  return (
    <section>
      <h2>Native Fetch Demo</h2>
      <p>
        This request was made using Node&apos;s native <code>fetch()</code> API.
      </p>

      <h3>Response from httpbin.org</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h3>How It&apos;s Intercepted</h3>
      <p>
        Node&apos;s native fetch is powered by <code>undici</code> internally.
        Our preload script uses <code>setGlobalDispatcher()</code> to route all
        fetch requests through the proxy.
      </p>

      <h3>Code</h3>
      <pre>{`const { setGlobalDispatcher, ProxyAgent } = require('undici');
setGlobalDispatcher(new ProxyAgent(proxyUrl));`}</pre>
    </section>
  );
}

import axios from 'axios';

export const dynamic = 'force-dynamic';

interface HttpBinResponse {
  origin: string;
  url: string;
  headers: Record<string, string>;
  args: Record<string, string>;
}

async function getServerData(): Promise<HttpBinResponse> {
  const response = await axios.get<HttpBinResponse>('https://httpbin.org/get', {
    params: { client: 'axios' },
    headers: {
      'X-Demo-Client': 'axios',
    },
  });

  return response.data;
}

export default async function AxiosDemoPage() {
  const data = await getServerData();

  return (
    <section>
      <h2>Axios Demo</h2>
      <p>
        This request was made using <code>axios</code>.
      </p>

      <h3>Response from httpbin.org</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h3>How It&apos;s Intercepted</h3>
      <p>
        Axios uses Node&apos;s <code>http</code>/<code>https</code> modules, not
        fetch. Our preload script uses <code>global-agent</code> to patch these
        modules globally.
      </p>

      <h3>Code</h3>
      <pre>{`require('global-agent/bootstrap');`}</pre>

      <h3>Why This Is Different</h3>
      <p>
        This is why you need <strong>two</strong> proxy patches: one for undici
        (fetch) and one for http/https (axios). Without both, some requests will
        bypass the proxy.
      </p>
    </section>
  );
}

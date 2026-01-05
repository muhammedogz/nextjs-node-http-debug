import ky from 'ky';

export const dynamic = 'force-dynamic';

interface HttpBinResponse {
  origin: string;
  url: string;
  headers: Record<string, string>;
  args: Record<string, string>;
}

async function getServerData(): Promise<HttpBinResponse> {
  return ky
    .get('https://httpbin.org/get', {
      searchParams: { client: 'ky' },
      headers: {
        'X-Demo-Client': 'ky',
      },
    })
    .json();
}

export default async function KyDemoPage() {
  const data = await getServerData();

  return (
    <section>
      <h2>Ky Demo</h2>
      <p>
        This request was made using <code>ky</code>, a modern fetch wrapper.
      </p>

      <h3>Response from httpbin.org</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h3>How It&apos;s Intercepted</h3>
      <p>
        Ky uses the native <code>fetch()</code> API under the hood. Since
        we&apos;ve configured undici&apos;s global dispatcher, all Ky requests
        automatically go through the proxy.
      </p>

      <h3>Why Ky Works</h3>
      <p>
        Any library that uses <code>fetch()</code> internally will be
        intercepted by our undici patch. This includes Ky, and any other
        fetch-based library.
      </p>
    </section>
  );
}

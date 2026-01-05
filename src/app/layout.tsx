import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Server HTTP Debug Demo',
  description: 'Demonstrating server-side HTTP debugging with proxy interception',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Server-Side HTTP Debug Demo</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/fetch-demo">Fetch</a>
            <a href="/ky-demo">Ky</a>
            <a href="/axios-demo">Axios</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

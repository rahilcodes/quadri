import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/JsonLd';
import { site, siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets the sticky bar read env(safe-area-inset-bottom)
  themeColor: '#0e0f12', // --color-ink; meta tags cannot read custom properties
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: the inline script below adds class="js" before React hydrates
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* The two hero faces. Everything else loads on demand with font-display: swap. */}
        <link
          rel="preload"
          href="/fonts/instrument-serif-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/schibsted-grotesk-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Motion styles only hide content once we know scripts run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}

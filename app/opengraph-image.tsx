import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const dynamic = 'force-static';
export const alt = `${site.name}. ${site.lockup}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori cannot read CSS custom properties, so the four brand colours are repeated here.
const INK = '#0E0F12';
const IVORY = '#F4EFE6';
const SILVER = '#C9C4B8';

/** Open Graph and Twitter card, rendered once at build time from the same tokens and arch. */
export default async function OpengraphImage() {
  const serif = await readFile(path.join(process.cwd(), 'public/fonts/instrument-serif-latin-400-normal.woff'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 96,
          background: INK,
          color: IVORY,
          fontFamily: 'Instrument Serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 40 }}>
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" stroke={IVORY} strokeWidth="1.5">
            <path d="M4 46V20C4 8 14 4 20 2C26 4 36 8 36 20V46" />
            <path d="M12 46V24C12 16 17 13 20 11C23 13 28 16 28 24V46" />
          </svg>
          {site.name}
        </div>
        <div style={{ display: 'flex', fontSize: 148, lineHeight: 0.92, letterSpacing: '-0.02em' }}>
          {site.hero.headline}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: SILVER }}>{site.lockup}</div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 }] },
  );
}

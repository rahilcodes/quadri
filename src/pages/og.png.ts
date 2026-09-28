import { readFile } from 'node:fs/promises';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '@/lib/site';

// Satori cannot read CSS custom properties, so the brand colours are repeated here.
const INK = '#0E0F12';
const IVORY = '#F4EFE6';
const SILVER = '#C9C4B8';

const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) => ({
  type,
  props: { style, children, ...extra },
});

/** Open Graph and Twitter card (1200 x 630), drawn once at build time from the same type and arch. */
export const GET: APIRoute = async () => {
  const serif = await readFile('public/fonts/instrument-serif-latin-400-normal.woff');

  const mark = el('svg', {}, [
    el('path', {}, undefined, { d: 'M4 46V20C4 8 14 4 20 2C26 4 36 8 36 20V46' }),
    el('path', {}, undefined, { d: 'M12 46V24C12 16 17 13 20 11C23 13 28 16 28 24V46' }),
  ], { width: 40, height: 48, viewBox: '0 0 40 48', fill: 'none', stroke: IVORY, strokeWidth: 1.5 });

  const card = el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 96,
      background: INK,
      color: IVORY,
      fontFamily: 'Instrument Serif',
    },
    [
      el('div', { display: 'flex', alignItems: 'center', gap: 24, fontSize: 40 }, [mark, site.name]),
      el('div', { display: 'flex', fontSize: 148, lineHeight: 0.92, letterSpacing: '-0.02em' }, site.hero.headline),
      el('div', { display: 'flex', fontSize: 30, color: SILVER }, site.lockup),
    ],
  );

  const svg = await satori(card as never, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 }],
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};

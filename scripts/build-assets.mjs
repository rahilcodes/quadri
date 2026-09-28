// One-off asset pipeline. Run with `npm run assets`.
// 1. Copies the self-hosted font files into /public/fonts.
// 2. Subsets Noto Nastaliq Urdu to the single footer word (160 KB -> a few KB).
// 3. Writes the PLACEHOLDER portrait used until the client's photo shoot.
//    Replace public/images/portrait.jpg with the real photograph (same name,
//    portrait orientation, at least 960 x 1240) and nothing else needs to change.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import subsetFont from 'subset-font';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const fontsOut = path.join(root, 'public/fonts');
const imagesOut = path.join(root, 'public/images');
await mkdir(fontsOut, { recursive: true });
await mkdir(imagesOut, { recursive: true });

const fontsource = (pkg, file) => path.join(root, 'node_modules/@fontsource', pkg, 'files', file);

const copies = [
  ['instrument-serif', 'instrument-serif-latin-400-normal.woff2'],
  ['instrument-serif', 'instrument-serif-latin-400-italic.woff2'],
  // .woff copy is only read at build time by app/opengraph-image.tsx (satori cannot read woff2)
  ['instrument-serif', 'instrument-serif-latin-400-normal.woff'],
  ['schibsted-grotesk', 'schibsted-grotesk-latin-400-normal.woff2'],
  ['schibsted-grotesk', 'schibsted-grotesk-latin-500-normal.woff2'],
  ['schibsted-grotesk', 'schibsted-grotesk-latin-600-normal.woff2'],
];
for (const [pkg, file] of copies) {
  await copyFile(fontsource(pkg, file), path.join(fontsOut, file));
  console.log('font   ', file);
}

const nastaliq = await readFile(fontsource('noto-nastaliq-urdu', 'noto-nastaliq-urdu-arabic-400-normal.woff'));
const subset = await subsetFont(nastaliq, site.footer.glyph, { targetFormat: 'woff2' });
await writeFile(path.join(fontsOut, 'noto-nastaliq-urdu-subset.woff2'), subset);
console.log('font    noto-nastaliq-urdu-subset.woff2', subset.length, 'bytes');

// Placeholder portrait: the hatch from the design export (#1A1B1F ground, #2A2B30 lines, 14 px pitch), at 2x.
const portraitPath = path.join(imagesOut, 'portrait.jpg');
if (!existsSync(portraitPath) || process.argv.includes('--force')) {
  const w = 960;
  const h = 1240;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><pattern id="h" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="28" height="28" fill="#1A1B1F"/><rect width="2" height="28" fill="#2A2B30"/>
    </pattern></defs>
    <rect width="${w}" height="${h}" fill="url(#h)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(portraitPath);
  console.log('image   portrait.jpg (placeholder)');
} else {
  console.log('image   portrait.jpg already exists, left untouched (use --force to overwrite)');
}

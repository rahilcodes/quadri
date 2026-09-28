// Visual QA. Screenshots every section at each width and reports horizontal overflow.
//   node scripts/shots.mjs [baseUrl] [width,width,...]
// Needs a local Chrome; set CHROME_PATH if it is not in the default location.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:3000';
const widths = (process.argv[3] ?? '320,390,640,768,1024,1280,1440,1920').split(',').map(Number);
const sectionShots = new Set([390, 768, 1024, 1440]);
const out = path.resolve('.screens');
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
let failed = false;

for (const width of widths) {
  const height = width < 768 ? 844 : 900;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('quadri.disclaimer.accepted.v1', 'qa'));
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Settle every scroll-triggered animation so the shots show the final state.
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-duration:1ms!important;animation-delay:0s!important;transition:none!important}',
  });
  await page.evaluate(async () => {
    document.querySelectorAll('[data-reveal],[data-draw]').forEach((el) => el.classList.add('is-visible'));
    await new Promise((resolve) => setTimeout(resolve, 1700)); // count-up
  });

  const report = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('dialog, .sr-only, [aria-hidden="true"], iframe')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) continue;
      const clipped = el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === 'visible';
      if (rect.right > doc.clientWidth + 0.5 || rect.left < -0.5 || clipped) {
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${el.textContent.trim().slice(0, 30)}" right=${Math.round(rect.right)} sw=${el.scrollWidth} cw=${el.clientWidth}`);
      }
    }
    // A single word alone on the last line of a heading or lead paragraph
    const orphans = [];
    for (const el of document.querySelectorAll('h1, h2, h3, blockquote, main p')) {
      if (!el.offsetParent || el.closest('.sr-only')) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines = [...new Set([...range.getClientRects()].map((r) => Math.round(r.top)))];
      const words = el.textContent.trim().split(/\s+/);
      if (lines.length < 2 || words.length < 4) continue;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let last = null;
      while (walker.nextNode()) if (walker.currentNode.textContent.trim()) last = walker.currentNode;
      if (!last) continue;
      const text = last.textContent;
      const end = text.trimEnd().length;
      const lastSpace = text.lastIndexOf(' ', end - 1);
      if (lastSpace <= 0) continue;
      const a = document.createRange();
      a.setStart(last, lastSpace + 1);
      a.setEnd(last, end);
      const b = document.createRange();
      const prevSpace = text.lastIndexOf(' ', lastSpace - 1);
      b.setStart(last, prevSpace + 1);
      b.setEnd(last, lastSpace);
      const topA = a.getBoundingClientRect().top;
      const topB = b.getBoundingClientRect().top;
      if (Math.abs(topA - topB) > 4) orphans.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" -> "${text.slice(lastSpace + 1, end)}"`);
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, height: doc.scrollHeight, offenders, orphans };
  });

  const overflow = report.scrollWidth > report.clientWidth;
  if (overflow || report.offenders.length) failed = true;
  console.log(`${width}: page ${report.clientWidth} x ${report.height}, horizontal scroll: ${overflow ? 'YES' : 'no'}`);
  report.offenders.slice(0, 12).forEach((line) => console.log('   overflow  ' + line));
  report.orphans.forEach((line) => console.log('   orphan    ' + line));

  if (sectionShots.has(width)) {
    const sections = await page.$$('main > section, footer');
    for (const [i, section] of sections.entries()) {
      await section.screenshot({ path: path.join(out, `${width}-${String(i + 1).padStart(2, '0')}.png`) });
    }
  }
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);

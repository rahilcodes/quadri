// Accessibility QA with axe-core, in the states a visitor actually meets:
// first visit (disclaimer open), after accepting, and with the mobile menu open.
//   node scripts/axe.mjs [baseUrl]
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://localhost:3100';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const axeSource = await readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

const browser = await puppeteer.launch({ executablePath, headless: true });
let total = 0;

async function audit(name, { width, height, accepted, prepare }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (accepted) await page.evaluateOnNewDocument(() => localStorage.setItem('quadri.disclaimer.accepted.v1', 'qa'));
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-duration:1ms!important;animation-delay:0s!important;transition:none!important}',
  });
  await page.evaluate(() =>
    document.querySelectorAll('[data-reveal],[data-draw]').forEach((el) => el.classList.add('is-visible')),
  );
  if (prepare) await prepare(page);
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.evaluate(axeSource);
  const results = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      // the map is a cross-origin Google frame; its contents are not ours to fix
      iframes: false,
    }),
  );
  console.log(`\n${name}: ${results.violations.length} violations, ${results.passes.length} rules passed, ${results.incomplete.length} need review`);
  for (const v of results.violations) {
    total += 1;
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 5)) console.log(`     ${node.target.join(' ')}  ${node.failureSummary?.split('\n')[1]?.trim() ?? ''}`);
  }
  for (const v of results.incomplete) {
    console.log(`  (review) ${v.id}: ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(' ')}`);
  }
  await page.close();
}

await audit('Desktop 1440, first visit (disclaimer open)', { width: 1440, height: 900, accepted: false });
await audit('Desktop 1440, disclaimer accepted', { width: 1440, height: 900, accepted: true });
await audit('Mobile 390, disclaimer accepted', { width: 390, height: 844, accepted: true });
await audit('Mobile 390, menu open', {
  width: 390,
  height: 844,
  accepted: true,
  prepare: (page) => page.click('button[aria-label="Open menu"]'),
});
await audit('Mobile 390, form errors shown', {
  width: 390,
  height: 844,
  accepted: true,
  prepare: (page) => page.evaluate(() => document.querySelector('form button[type=submit]').click()),
});

await browser.close();
console.log(`\nTotal violations: ${total}`);
process.exit(total ? 1 : 0);

import { readFileSync } from 'node:fs';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

const content = JSON.parse(readFileSync(new URL('./content/site.json', import.meta.url), 'utf8'));
const site = (process.env.PUBLIC_SITE_URL || (process.env.GITHUB_ACTIONS ? 'https://rahilcodes.github.io' : content.url)).replace(/\/+$/, '');
const base = process.env.GITHUB_ACTIONS ? '/quadri/' : '/';

/**
 * The contact endpoint is a serverless function in production (api/contact.ts on
 * Vercel, netlify/functions/contact.ts on Netlify). This serves the same handler
 * from the dev server so the form can be tested locally.
 */
const contactApiInDev = {
  name: 'contact-api-in-dev',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use('/api/contact', async (req, res) => {
        const { handleContact } = await server.ssrLoadModule('/lib/contact-handler.ts');
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const response = await handleContact(
          new Request(`http://${req.headers.host}/api/contact`, {
            method: req.method,
            headers: req.headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
          }),
        );
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
    },
  },
};

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  // React renders the components to HTML at build time; no React runtime is sent to the browser.
  integrations: [react(), contactApiInDev],
  build: {
    // 10 KB of CSS: inlined, so the first paint needs one request
    inlineStylesheets: 'always',
  },
  image: {
    // Matches the breakpoints in styles/tokens.css
    breakpoints: [390, 640, 768, 1024, 1280, 1440, 1920],
  },
  devToolbar: { enabled: false },
  server: { port: 3000 },
});

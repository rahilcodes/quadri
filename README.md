# Quadri Advocates & Associates

The website of Quadri Advocates & Associates, Narayanguda, Hyderabad. One static page, built with Astro.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./dist
npm run preview    # serves ./dist on http://localhost:3100
```

## Change the copy

Everything a visitor reads is in **`content/site.json`**: headline, practice areas, biography, phones, address, hours, form messages and the disclaimer. Edit, save, rebuild. Keys that start with `_` are notes for editors and never appear on the site.

| To change | Edit |
|---|---|
| Phone numbers, WhatsApp, address, hours | `contact` |
| Headline and hero text | `hero` |
| Practice areas (also fills the form's "Matter type" list) | `practice.areas` |
| Biography, pull-quote, enrolment and languages | `about` |
| Disclaimer wording | `disclaimer.text`, then bump `DISCLAIMER_KEY` in `src/scripts/site.ts` so visitors are asked again |
| Domain | `url`, or `PUBLIC_SITE_URL` in the host's environment |

**Bar Council of India, Rule 36.** Do not add testimonials, ratings, review quotes, case results, names of clients, superlatives ("best", "top", "leading") or "free consultation" wording.

## Replace the portrait

`images/portrait.jpg` is a placeholder. Replace it with the real photograph under the same name (portrait orientation, at least 960 × 1240). The build produces every size in AVIF, WebP and JPEG. Update the alt text in `content/site.json` (`hero.portrait.alt`, `about.portraitAlt`).

## Change the design

Every colour, type size and spacing value is a custom property in **`styles/tokens.css`**. Components never hold raw values.

## Contact form

The form posts to `/api/contact`, which emails the enquiry through [Resend](https://resend.com). Set these in the host's environment (names in `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`: the chambers' inbox
- `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend

The handler is `lib/contact-handler.ts`. `api/contact.ts` exposes it on Vercel and `netlify/functions/contact.ts` on Netlify; the dev server serves it too. It has a honeypot field and a rate limit of 5 messages per 10 minutes per IP address.

## Deploy

Vercel and Netlify both work with no settings: `vercel.json` and `netlify.toml` carry the build command, cache headers and security headers.

## Structure

```
components/     one component per section, each with its CSS module; Arch.tsx is the arch mark
content/        site.json: all copy
images/         source photographs (optimised at build time)
lib/            site data, form validation, contact handler
public/fonts/   self-hosted fonts
src/pages/      index.astro, robots.txt, sitemap.xml, og.png
src/scripts/    site.ts: the only JavaScript sent to the browser (about 2 KB gzipped)
styles/         tokens.css, fonts.css, global.css
design/         the Claude Design export this site reproduces
scripts/        build-assets (fonts, placeholder), shots (visual QA), axe (accessibility QA)
```

## Quality checks

```bash
npm run build && npm run preview     # in one terminal
npm run test:visual                  # screenshots into .screens/, reports overflow and orphans
npm run test:a11y                    # axe-core in five page states
npx lighthouse http://localhost:3100 --view
```

Both test scripts need Chrome; set `CHROME_PATH` if it is not in the default location.

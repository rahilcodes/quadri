import content from '@/content/site.json';

export const site = content;
export type Site = typeof content;

/** Canonical origin, without a trailing slash. The environment wins over site.json. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || content.url).replace(/\/+$/, '');

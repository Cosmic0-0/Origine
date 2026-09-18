// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://www.originehealing.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  i18n: {
    // English ships now. French is added by creating src/pages/fr/ and filling the fr fields in Sanity.
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  image: {
    domains: ['cdn.sanity.io'],
    responsiveStyles: true,
    layout: 'constrained',
  },
  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: [300, 400, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
      optimizedFallbacks: true,
    },
    {
      name: 'Pontano Sans',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [300, 400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/404'),
    }),
  ],
});

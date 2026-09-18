# Origine Healing website

Marketing site for Origine Healing, Stephanie Maurel's embodied healing practice in Mapou, Mauritius.
Replaces the Squarespace site at originehealing.com.

- `site/` Astro 7 static site (TypeScript strict, hand-written CSS, no component library)
- `studio/` Sanity Studio v6, the editing interface Stephanie logs into
- `scripts/` content migration: builds the seed dataset from the old site's content
- `design-directions/` the three homepage directions shown before the build
- `docs/` guide for Stephanie, running costs, deployment checklist

## How it fits together

Content lives in Sanity. The site is built statically at deploy time: Astro fetches every document once,
renders HTML, optimises images into WebP at several sizes, self-hosts the fonts, and Netlify serves the
result. No JavaScript talks to Sanity in the browser, and the site reads fully without JavaScript.

When Stephanie presses **Publish** in the Studio, a Sanity webhook calls a Netlify build hook and the site
rebuilds in about a minute.

Before a Sanity project exists, the site builds from `site/src/seed/seed.ndjson`, the same file that
gets imported into Sanity on first deploy. So `npm run build` works on a fresh clone with no keys.

## Local development

Requirements: Node 22.12 or newer.

```bash
cd site
npm install
cp .env.example .env        # leave PUBLIC_SANITY_PROJECT_ID empty to use the seed content
npm run dev                 # http://localhost:4321
npm run build               # type check + production build into site/dist
npm run preview             # serve the production build
```

Studio:

```bash
cd studio
npm install
cp .env.example .env        # needs SANITY_STUDIO_PROJECT_ID
npm run dev                 # http://localhost:3333
```

## Deploying for the first time

All accounts are created under Stephanie's email so she owns them. Everything below is on a free tier.

### 1. Sanity

1. Sign in at sanity.io/manage and create a project called "Origine Healing" with a dataset called `production` (public).
2. Copy the project ID into `studio/.env` and `site/.env`.
3. Import the migrated content, with the images:
   ```bash
   cd site/src/seed
   npx --prefix ../../../studio sanity dataset import seed.ndjson production --replace
   ```
   Run it from the seed folder so the `image@file://./images/...` paths resolve.
4. Deploy the Studio: `cd studio && npm run deploy`. It goes live at `https://origine-healing.sanity.studio` (change the name in `sanity.cli.ts` if taken).
5. Invite Stephanie as an Administrator under Members.
6. Under API → CORS origins, add `http://localhost:3333` and the Studio URL.

### 2. Netlify

1. Sign up with GitHub, "Add new site" → "Import an existing project" → pick this repository. `netlify.toml` sets the base directory, build command and publish folder.
2. Site settings → Environment variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`, `PUBLIC_SITE_URL=https://www.originehealing.com`, and `PUBLIC_CF_ANALYTICS_TOKEN` once Cloudflare Web Analytics is set up.
3. Forms → **Enable form detection**, then trigger a deploy. The `enquiry` form appears under Forms after the first build that contains it.
4. Forms → Form notifications → Add notification → Email, to Stephanie's address. Submissions are also kept in the Netlify dashboard.
5. Site configuration → Build hooks → add one called "Sanity publish". Copy its URL.

### 3. Rebuild on publish

In Sanity manage → API → Webhooks: add a webhook with the Netlify build-hook URL, trigger on create, update and delete, dataset `production`, HTTP POST. Leave the filter empty. Now every Publish rebuilds the site.

### 4. Newsletter (Kit)

1. Create a free Kit account, make a form (any style; only its address is used).
2. In the form's Embed → HTML, copy the `action` URL (looks like `https://app.kit.com/forms/123456/subscriptions`) and the `data-uid`.
3. Paste them into Sanity → Contact details and links → Newsletter fields. Publish.

### 5. Analytics (Cloudflare Web Analytics)

Free, no cookies, no consent banner. Sign up at dash.cloudflare.com → Web Analytics → Add a site → copy the token into the `PUBLIC_CF_ANALYTICS_TOKEN` environment variable on Netlify and redeploy. If the domain's DNS is also moved to Cloudflare, analytics can be switched on there without any token.

### 6. Domain cutover

1. In Netlify → Domain management add `originehealing.com` and `www.originehealing.com`.
2. At the registrar, point the DNS records where Netlify says (an A/ALIAS record for the apex and a CNAME for `www`). Netlify provisions HTTPS automatically.
3. Keep Squarespace live until the new site answers on the domain, then cancel Squarespace. Do not let the domain lapse: it is the one thing that costs money.

Old URLs redirect via `site/public/_redirects` (301). Check the list against Google Search Console after launch.

## Adding French

Everything is ready for it. To ship French:

1. In Sanity, fill the "French version" fields on each document.
2. Add `site/src/i18n/fr.ts` exporting a `Dictionary` with the same keys as `en.ts`, and register it in `src/i18n/index.ts`.
3. Copy `site/src/pages/*.astro` into `site/src/pages/fr/`. Each page reads `Astro.currentLocale`, so no changes are needed inside them.
4. Add a language switcher to `Header.astro` using `localePath`.

Slugs stay the same in both languages. Nothing in the schema changes.

## Design and quality bars

- Palette and type tokens live in `site/src/styles/tokens.css`. Terracotta never carries small text (it is 2.5:1 on white); `--terracotta-deep` (#9a5535) is the accessible variant for links.
- Every image comes from Sanity with required alt text. Images are rendered through Astro's image pipeline as WebP at four widths.
- Motion is one fade on the hero, disabled under `prefers-reduced-motion`.
- Structured data: LocalBusiness on the home page, Service per offer, Event per date, BlogPosting per post, FAQPage on the FAQ, Person on About.

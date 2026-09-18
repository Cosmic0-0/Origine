# Handoff: finishing the Origine Healing site

Read this first if you are a model or a person picking this project up. It says what is done, what is
left, how to do each remaining task, and what not to touch. Work through the tasks in order; each one
has a "done when" check.

## Where things stand

Done, verified, committed and pushed to GitHub (`main`):

- The site (`site/`, Astro 7, static). Builds from the content in `site/src/seed/seed.ndjson` with no
  accounts. Design direction chosen by the client ("Evening": teal ground, sand type) is applied on every page.
- The Sanity Studio (`studio/`), schemas and editor layout, typechecked. Not yet deployed because no
  Sanity project exists.
- Content migrated from the old Squarespace site: 4 blog posts, 16 FAQ entries, 4 testimonials, 6
  offers, 6 modalities, all page copy. Source scrape kept in `scripts/source/`.
- A review was run and every bug and risk fixed (`docs/review-findings.md`). Lighthouse is 99 to 100
  in all four categories on every page type. Type check is clean.
- Docs: `README.md` (setup and deployment), `docs/editing-your-website.md` (for Stephanie),
  `docs/running-costs.md`, `docs/launch-checklist.md`, `docs/review-brief.md`, `docs/review-findings.md`.

Not done: everything that needs an account or a human decision. That is the list below.

## Rules for working in this repo

- Do not redesign. The client chose the direction. Do not change colours, type or layout unless a task
  below says so. The palette and context tokens are in `site/src/styles/tokens.css`.
- Do not reopen decisions listed in `docs/review-brief.md` under "Decisions already made".
- Every visible string lives in `site/src/i18n/en.ts` or in Sanity. Never type copy into a component.
- Every Sanity text field is an `{en, fr}` object. Keep it that way.
- Before finishing any task that touches `site/`: run `cd site && npm run build` (this runs the type
  check first) and confirm `0 errors` and `21 page(s) built`.
- To rebuild the seed after editing `scripts/build_seed.py`: `python3 scripts/build_seed.py` from the
  repo root. The output is deterministic; a diff shows only what you changed.
- `npx astro preview` in Astro 7 runs as a background daemon. Stop it with `npx astro preview stop`,
  otherwise a stale server keeps answering on the port with old settings.
- Commit with a clear message and push to `origin main`. Small commits, one task each.

## Task 1. Copy changes from Stephanie

She has wording changes. Apply them in one pass.

- Before the Sanity import: edit the strings in `scripts/build_seed.py` (offers, modalities, home and
  about copy, page intros) or `site/src/i18n/en.ts` (button labels, headings that are not content),
  then run `python3 scripts/build_seed.py` and rebuild the site.
- After the Sanity import: make the edits in the Studio instead, and never edit the seed again, because
  Sanity is then the source of truth.
- Do not change tone beyond what she asked. Do not add exclamation marks or mystical language.
- Done when: `npm run build` passes and the changed text appears on the built page.

## Task 2. Sanity project and Studio

Needs: Stephanie's Sanity account (she signs up at sanity.io with her own email) or her project ID.

1. In sanity.io/manage create a project "Origine Healing", dataset `production`, public.
2. Put the project ID in `studio/.env` (`SANITY_STUDIO_PROJECT_ID=...`, copy `.env.example`).
3. Import the content from the studio folder:
   `cd studio && npx sanity dataset import ../site/src/seed/seed.ndjson production --replace`
   The image paths inside the file are relative to the file and upload with it.
4. Deploy the Studio: `cd studio && npm run deploy`. Hostname is `origine-healing` (set in
   `sanity.cli.ts`); change it if taken.
5. In sanity.io/manage → Members, invite Stephanie as Administrator.
6. API → CORS origins: add `http://localhost:3333` and the Studio URL.
7. Done when: the Studio URL opens, the left list shows Pages, Offers and prices, Events and dates,
   Modalities, Blog posts, FAQ questions, Client quotes, Contact details and links, and opening
   "Home" shows the photos.

## Task 3. Netlify

Needs: Stephanie's Netlify account (sign up with GitHub) with access to the repo, or the site already
created from Caellum's temporary deployment.

1. Add new site → import from GitHub → this repo. `netlify.toml` already sets base `site`, command
   `npm run build`, publish `dist`.
2. Environment variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`,
   `PUBLIC_SITE_URL=https://www.originehealing.com`. Trigger a deploy.
3. Forms → Enable form detection → trigger another deploy. The form `enquiry` appears. Add a
   notification: Forms → Form notifications → Email → Stephanie's address.
4. Build hooks → add "Sanity publish", copy the URL.
5. In sanity.io/manage → API → Webhooks: new webhook, URL = the build hook, trigger on create, update
   and delete, dataset `production`, POST, no filter.
6. In GitHub → repository Settings → Secrets and variables → Actions: add `NETLIFY_BUILD_HOOK` with the
   same URL. Then Actions → "Nightly rebuild" → Run workflow, and confirm a Netlify build starts.
7. Done when: publishing a change in the Studio rebuilds the site within two minutes, a test message
   sent through the contact form arrives by email, and the manual workflow run triggered a build.

Check on the Netlify URL: open `/about/`, `/blog/`, one blog post, and `/stephanie` (must redirect
to `/about/`). Send one form submission. Check the build log has no `[content] photo asset` warning.

## Task 4. Newsletter (Kit) and analytics (Cloudflare)

1. Kit: create a free account, create one form (any style). In the form's Embed → HTML, copy the
   `action` URL (looks like `https://app.kit.com/forms/123456/subscriptions`) and the `data-uid`.
   Paste both into the Studio under Contact details and links → Newsletter fields. Publish.
   In the form settings, after subscribing, redirect to `https://www.originehealing.com/thank-you/`.
2. Cloudflare Web Analytics: dash.cloudflare.com → Web Analytics → Add a site → copy the token into the
   Netlify environment variable `PUBLIC_CF_ANALYTICS_TOKEN`. Redeploy.
3. Done when: a test address submitted on Groups and retreats appears in Kit, and Cloudflare shows a
   page view.

## Task 5. Content Stephanie must supply

Ask for these in one message. Enter them in the Studio (or in the seed if before the import).

- Her real contact email (the seed has a placeholder). Contact details and links → Email.
- The next Moonlight Meditation date. Events and dates → the placeholder "Moonlight Meditation,
  October" is invented; replace or delete it.
- Confirmation of the prices: Rs 3,000 single session, Rs 44,000 programme, Rs 1,500 Moonlight.
- Whether her Calendly plan is free (one event type). Nothing in the site depends on it.
- Where originehealing.com is registered and its renewal date. Turn on auto-renew. This is the only
  thing that costs money and the only thing that can take the site down.
- Later, not blocking: higher-resolution originals of the Sita Kelly photographs.

## Task 6. Cutover

Only after tasks 2 to 5 are done and the Netlify URL has been checked on a phone.

1. Netlify → Domain management → add `originehealing.com` and `www.originehealing.com`.
2. At the registrar, set the DNS records Netlify shows. Wait for HTTPS to show as active.
3. Check every old URL redirects: `/stephanie`, `/faq-1`, `/get-started`, `/cart`,
   `/blog/this-morning-routine-will-change-your-mood`, `/blog/the-beginners-guide-to-meditation-c477r`.
4. Google Search Console: add the property, submit `https://www.originehealing.com/sitemap-index.xml`.
5. Cancel the Squarespace subscription. Keep the domain if it is registered there.
6. Done when: the domain serves the new site over HTTPS on a phone and a laptop, and Squarespace is cancelled.

## Task 7. Optional improvements (from the review, still open)

Do these only if asked. Each is small.

- Tests: unit tests for `site/src/i18n/format.ts`; a Playwright check that no page overflows at 320px
  and every image has alt text; a check that each page has one `h1`.
- Load the Vision tool only in development (`studio/sanity.config.ts`).
- Close the mobile menu on Escape and outside click (`site/src/components/Header.astro`, a few lines).
- `og:image:width` and `og:image:height` in `site/src/layouts/Base.astro`.
- `site/public/robots.txt` hard-codes the sitemap host; fine for production.

## Later, out of scope for now

- French: fill the French fields in the Studio, add `site/src/i18n/fr.ts` with the same keys as
  `en.ts`, register it in `src/i18n/index.ts`, copy `site/src/pages/*.astro` into `site/src/pages/fr/`,
  add a language switcher in `Header.astro`. No schema change needed.
- Online payments: Stripe does not serve Mauritius. The `booking` object on offers already has a
  "link" mode for a payment page from a local gateway.

## If something looks wrong

- Site shows old content: check the document is Published, then check Netlify has a recent deploy.
- A photo is missing after the import: look for `[content] photo asset ... not found` in the Netlify
  build log; re-upload that photo in the Studio.
- Build fails on Netlify: run `cd site && npm run build` locally; the error will be the same.
- `/about/` gives 404 locally: a stale preview daemon. `npx astro preview stop`, then start again.

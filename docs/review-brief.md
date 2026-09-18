# Review brief: Origine Healing website

You are reviewing a finished-but-unlaunched website build. Find errors, bugs, and improvements. Report
what you find; do not rewrite the project. The owner will decide what to act on.

## What this is

A marketing site for Origine Healing, a one-person holistic healing practice in Mapou, Mauritius, run by
Stephanie Maurel. It replaces a Squarespace site at originehealing.com. Stephanie is not technical and
will edit the site herself through a CMS. The site must run on free tiers, with the domain renewal as the
only cost.

The client chose a dark design direction ("Evening"): slate teal ground, sand-coloured type, Fraunces
display face, one terracotta moon on the home page. Long reading sits on lighter "paper" sections.

## Repository layout

```
site/            Astro 7 static site, TypeScript strict, hand-written CSS, no component library
  astro.config.mjs        i18n (en at root, fr reserved), fonts via Astro Fonts API, sitemap
  public/_redirects       301s from the old Squarespace URLs
  src/i18n/               locale config, English dictionary (en.ts), formatters (format.ts)
  src/lib/content.ts      ONE content loader: Sanity if PUBLIC_SANITY_PROJECT_ID is set, else the seed file
  src/lib/portableText.ts Sanity rich text -> HTML
  src/lib/seo.ts          JSON-LD builders (LocalBusiness, Service, Event, BlogPosting, FAQPage, Person)
  src/lib/types.ts        document shapes shared by both content sources
  src/layouts/Base.astro  head, fonts, meta, JSON-LD, header, footer, optional analytics beacon
  src/components/         Photo, Prose, Offer, BookingButton, EventList, Testimonial, FaqList,
                          NewsletterForm (Kit), EnquiryForm (Netlify Forms), Header, Footer
  src/pages/              index, work-with-me, groups-and-retreats, about, modalities/(index,[slug]),
                          blog/(index,[slug]), faq, contact, privacy, thank-you, 404
  src/seed/seed.ndjson    all content in Sanity document format; src/seed/images/ the photos
  src/styles/tokens.css   palette and context tokens (.light flips text/line/button colours)
  src/styles/base.css     global styles
studio/          Sanity Studio v6
  sanity.config.ts, sanity.cli.ts, structure.ts (fixed singleton pages), schemas/
scripts/         build_seed.py + html_to_portable_text.py: migration from the old site into seed.ndjson
docs/            editing guide for Stephanie, running costs, launch checklist
netlify.toml     build settings and headers
design-directions/  the three static mock-ups shown before the build (reference only)
```

## How to run and verify

```bash
cd site && npm install
npm run check          # astro check, must be 0 errors
npm run build          # builds 21 pages into dist/ from the seed (no Sanity account needed)
npm run preview        # serves dist/ at http://localhost:4321 with clean URLs
cd ../studio && npm install && npx tsc --noEmit   # schema typecheck
```

There is no Sanity project yet, so the Sanity code path in `content.ts` has never run against a live
dataset. The seed path is what has been tested. Treat the Sanity path as the highest-risk untested code.

## Requirements the build must meet (from the original brief)

Check each of these and say where it falls short.

- Lighthouse 95 or above in all four categories, mobile throttling, on every page type. Last measured 99 to 100.
- WCAG 2.2 AA: keyboard navigation, visible focus states, contrast against the actual palette, alt text on
  every image. Note: terracotta #d3957c fails contrast for text on both grounds and must only appear as a
  shape or rule. The accessible link variant is #9a5535 on light.
- Content readable without JavaScript. The only script is the interest pre-select on the contact form.
- No user-facing strings hard-coded in components; all in `src/i18n/en.ts` or in Sanity.
- Every Sanity text field is an {en, fr} object; French must be addable without a schema change.
- Prices as number + currency in the CMS, never in copy. Every fact appears in exactly one document.
- Images from the CMS served as modern formats at responsive sizes.
- Fonts self-hosted.
- Redirects from every old URL: /about, /stephanie, /work-with-me, /blog, four blog slugs, /faq-1, /contact,
  /get-started, /cart.
- Free tier only: Netlify, Sanity, Kit, Cloudflare Web Analytics, Calendly free.
- Structured data for the local business and the services.
- The Studio must make sense to someone who has only used Squarespace: plain labels, help text on
  anything not obvious, fixed pages that cannot be deleted or duplicated.

## Where to look hardest

1. **`site/src/lib/content.ts`.** Both loaders must produce identical shapes. Check reference resolution,
   draft filtering, the event "upcoming" cutoff and its timezone reasoning, and `resolvePhoto` for both an
   asset reference (Sanity) and `_sanityAsset` (seed). Sanity crop data is ignored; hotspot becomes
   `object-position`. Is anything that works in seed mode going to break in Sanity mode?
2. **`site/src/lib/portableText.ts`.** Link marks, inline images, heading levels, plain-text extraction for
   meta descriptions. Escaping.
3. **Forms.** `EnquiryForm.astro` relies on Netlify form detection at build time: `data-netlify`, hidden
   `form-name`, honeypot, `action="/thank-you"` with `build.format: 'file'` and `trailingSlash: 'never'`.
   `NewsletterForm.astro` posts to a Kit form URL with `email_address` and `fields[first_name]`; verify
   those are Kit's current field names.
4. **`public/_redirects`.** Syntax, no-op rules, trailing-slash variants, anything missing from the list above.
5. **i18n.** `localePath`, `Astro.currentLocale` in static pages, what happens at `/fr/...` today (the
   fallback was deliberately removed so no `/fr` URLs ship or appear in the sitemap).
6. **`site/src/i18n/format.ts`.** Price formatting for MUR ("Rs 3,000"), duration in minutes vs hours, event
   dates in Indian/Mauritius time, the 12-hour time cleanup.
7. **Studio (`studio/`).** `sanity.config.ts` filters document actions and templates for singletons: confirm
   this works on Sanity v6. `structure.ts` builds the fixed pages. Field labels and help text: would a
   non-technical person understand every field? Anything that lets her break the site (deleting a fixed
   page, removing a required image, a slug change that kills a URL) without warning?
8. **`scripts/build_seed.py`.** Keys are regenerated on every run (random `_key`s), which is fine locally but
   means re-running after a Sanity import would not be idempotent. Is that documented? Heading promotion
   (h3 to h2 when a document has no h2). Any migrated content that lost formatting or links.
9. **SEO helpers (`seo.ts`).** JSON-LD validity, `@id` consistency between the LocalBusiness and the
   `provider` references, Service offers with price 0 or no price, Event without offers. Canonical URLs,
   Open Graph image URLs for both content sources.
10. **CSS.** Context tokens in `tokens.css` and the `.light` override: any component still using a
    hard-coded colour that breaks on one ground? Focus rings on both grounds. `text-wrap: balance`
    splitting "three-month" on the hyphen. Header photo bleed on the home hero. Mobile menu is a
    `<details>` with no JS: acceptable, but check keyboard and screen-reader behaviour.
11. **`netlify.toml`.** Build base, headers, Node version. `X-Frame-Options: DENY` is set; nothing on the
    site is embedded, but say if that blocks anything planned (Calendly is a link, not an embed).
12. **Docs.** `README.md` deployment steps, `docs/editing-your-website.md` (must be jargon-free and
    accurate to the Studio as built), `docs/running-costs.md` (free-tier limits current?), the
    `sanity dataset import` command and the `image@file://./images/...` path resolution.

## Decisions already made; do not relitigate

- Netlify over Vercel (free forms). Kit for newsletter. Cloudflare Web Analytics. Fraunces + Pontano Sans
  replacing Adonis. No dark-mode toggle (the site is dark by design). Modalities not in the main nav.
  Programme button goes to the enquiry form, single session goes to Calendly. About Origine merged into
  About. Privacy page added.
- Out of scope: payments, digital products, accounts, custom booking, French copy, language switcher.

If you think one of these is wrong, say so in one paragraph at the end, separately from the findings.

## Known gaps, so you do not report them as discoveries

- The contact email in the seed is a placeholder. The October Moonlight Meditation event is a placeholder date.
- Only web-resolution photos exist; originals come later.
- The Sanity path is untested against a live project (see above).
- No automated tests. The brief did not require them; suggest the two or three that would pay for
  themselves if you think any would.
- Stephanie has wording changes pending; ignore copy tone.

## How to report

Rank by severity. For each finding give: file and line, what is wrong, how to reproduce or how you
verified it, and the smallest fix. Separate three lists: bugs (it does the wrong thing), risks (it will do
the wrong thing under a plausible condition, such as the first Sanity import), and improvements. Keep
style-only remarks to a short final section. Do not pad; a short list of real findings is the goal.

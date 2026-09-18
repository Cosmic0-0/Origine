# Review findings

**Status, 2026-09-18:** every item under Bugs and Risks below has been fixed and verified (see the commit
"Fix review findings"). Risk 4 was resolved by switching the build to directory output with trailing
slashes, which serves on any static host without relying on Netlify's pretty-URL rewriting. Items under
Improvements are still open, except the nightly rebuild workflow, which was added as part of Risk 1.

Reviewed 2026-09-18 against docs/review-brief.md. Method: fresh build and type check, inspection of the
built HTML, a scan for hard-coded strings, a browser run at 320, 360 and 390 px, focus-ring captures on
both grounds, JSON-LD parsing on every page type, and the formatters run against edge cases. Findings are
ranked within each list. Nothing has been changed; every item names the file and the smallest fix.

## What passed

- `astro check` 0 errors; 21 pages build from the seed.
- Netlify form markup is correct in the output: `data-netlify`, hidden `form-name`, honeypot input with
  matching name, `action="/thank-you"` and `thank-you.html` exists.
- JSON-LD parses on every page type: LocalBusiness, Service, Event, BlogPosting, FAQPage, Person.
- Sanity slug fields use `source: 'title.en'`; Sanity resolves a dotted string path, so that works.
- Price and duration formatting in English: "Rs 3,000", "60 to 75 minutes", "2 to 3 hours", "4 hours",
  "Saturday 3 October, 7pm", multi-day ranges.
- Lighthouse on eight pages: performance 99 to 100, the other three categories 100.

## Bugs (it does the wrong thing)

1. **Horizontal scroll on phones 360 px and narrower, every page.** `scrollWidth` is 369 px at both 320
   and 360 px viewports. Cause: the header does not shrink; wordmark, "Healing", "Menu" and the
   "Book a session" pill are all `white-space: nowrap`. Fix in `site/src/styles/base.css`: below 26rem,
   hide `.wordmark small`, shorten the header button to a `nav.bookShort` string ("Book") from `en.ts`,
   and add `overflow-x: clip` on `body` as a safety net. Re-test at 320 px.
2. **Keyboard focus ring is invisible on buttons.** `:focus-visible { outline: 2px solid currentColor }`
   gives an ink ring on the teal ground (button text is ink) and a white ring on the paper ground
   (button text is white). Captured and confirmed. Fails WCAG 2.4.7 and 2.4.11. Fix in `base.css`:
   `.btn:focus-visible { outline-color: var(--text); }` so the ring takes the ground's text colour.
3. **Input focus outline is terracotta on white, 2.2:1.** WCAG 1.4.11 needs 3:1 for focus indicators.
   Fix in `base.css` `.field input:focus, …`: `outline-color: var(--ink)`.
4. **User-facing strings hard-coded in templates**, against the brief's no-hard-coded-strings rule:
   `src/pages/contact.astro` lines 29, 33, 42 ("Sessions are booked straight into my calendar.",
   "Quickest", "Open in Google Maps"); `src/pages/work-with-me.astro` line 59 ("Cancellations.");
   `src/components/Offer.astro` line 25 ("Free"); `src/i18n/format.ts` the word "to" in multi-day event
   ranges; `src/components/NewsletterForm.astro` line 26 (admin-facing note, lowest priority). Fix: move
   each to `src/i18n/en.ts`.
5. **`theme-color` meta is still the light `#f5f3ef`** while the site ground is teal, so the phone
   browser chrome mismatches. `src/layouts/Base.astro`. Fix: `#3f4a49`.
6. **README import command will not run.** `npx --prefix ../../../studio sanity …` is not how npm 7+
   resolves another folder's binary. Fix in `README.md` step 3: run from the studio folder,
   `npx sanity dataset import ../site/src/seed/seed.ndjson production --replace`. The CLI resolves the
   `image@file://./images/…` paths relative to the ndjson file. Verify on the first import; if assets
   fail, run `../studio/node_modules/.bin/sanity` from `site/src/seed` instead.
7. **Editing guide is wrong about the home page.** `docs/editing-your-website.md` line 58 says two client
   quotes show on the home page; the Evening layout shows one. Fix the sentence.
8. **French event times lose their minutes.** `formatEventDate` strips ":00" for every locale, so a
   19:00 event renders as "19" in French (verified). Harmless until French ships. Fix in
   `src/i18n/format.ts`: strip ":00" only when `hour12` is true.
9. **Migrated FAQ answers still name the old "Get Started" page** (two occurrences in
   `site/src/seed/seed.ndjson`). The links were rewritten to Work with me, the words were not. Fix in
   the seed now, or in the Studio after import. Belongs with Stephanie's wording pass.

## Risks (it will do the wrong thing under a plausible condition)

1. **Past dates stay on the site.** "Upcoming" is filtered at build time. If nothing is published for a
   few weeks, the last Moonlight Meditation stays on the home page after it has happened. Fix: a
   nightly GitHub Actions cron that POSTs the Netlify build hook (free, about ten lines in
   `.github/workflows/rebuild.yml`). This also refreshes the footer year.
2. **Sanity path has never run.** Specific points to watch on first deploy: `content.ts` uses
   `useCdn: true`; a build triggered by the publish webhook can read the CDN a moment before it updates.
   Set `useCdn: false` for builds; the fetch count is two queries. Asset resolution needs
   `metadata.dimensions` on every image asset; imported assets have it, but confirm the first build
   renders every photo.
3. **`priceRange` in `src/lib/seo.ts` line 34 is hard-coded** ("Rs 1,500 - Rs 44,000"). If prices change
   in the Studio the structured data lies. Derive min and max from the services.
4. **Clean URLs on Netlify for `/blog` and `/modalities`.** The output has both `blog.html` and a
   `blog/` directory. Netlify's pretty URLs should serve `blog.html`, but verify on the temporary
   deployment: open `/blog`, `/modalities`, `/blog/` and one post. If `/blog` 404s, switch
   `build.format` to `directory` and `trailingSlash` to `always`, and update `_redirects`.
5. **`site/public/_redirects` has two rules that redirect a path to itself** (`/blog/rebirthing-breathwork`,
   `/blog/access-bars`). Netlify skips non-forced rules when the file exists, so they are no-ops, but
   remove them. The four trailing-slash rules are redundant with pretty URLs; harmless.
6. **JSON-LD is injected with plain `JSON.stringify`.** A `</script>` or stray `<` in CMS text could break
   the page. In `Base.astro`, replace `<` with `<` in the serialised string.
7. **`PUBLIC_SITE_URL` with a trailing slash** produces `//#business` in `@id`s and canonicals.
   Normalise in `src/lib/seo.ts`.
8. **Home page fallback copy when no date is booked** says "Join the list below", but the list is on the
   Groups page, not the home page. `en.ts` `events.none`. Give the home page its own sentence or link.
9. **`scripts/build_seed.py` regenerates random `_key`s every run.** Re-import with `--replace` works,
   but every run rewrites the whole seed file, hiding real changes in diffs. Seed the RNG or derive keys
   from content.
10. **Kit sign-up leaves the site.** A plain POST sends the visitor to Kit's hosted confirmation page.
    Set the form's success redirect in Kit to the site's thank-you page.

## Improvements

1. Add the nightly rebuild workflow (covers risks 1 and the static footer year).
2. Three tests that would pay for themselves: unit tests for `format.ts` (the edge cases above); a
   Playwright smoke test that every page has no horizontal overflow at 320 px and every `img` has alt
   text; a build-time check that each page has exactly one `h1` and no skipped heading levels.
3. Only load the Vision tool in development (`sanity.config.ts`), so Stephanie never sees a query
   console.
4. "The three-month programme" breaks at the hyphen under `text-wrap: balance`. A non-breaking hyphen
   in the title, if Fraunces has the glyph, or accept it.
5. The mobile menu (`<details>`) does not close on Escape or outside click. Acceptable without
   JavaScript; five lines would add it.
6. `robots.txt` hard-codes the sitemap host; fine for production, wrong on preview deploys.
7. Add `og:image:width` and `og:image:height`.
8. The comment on the event cutoff in `content.ts` says "end of the day"; the code keeps an event for
   twelve hours after it ends. Fix the comment or the code to match.

## Decisions

No reason to reopen any of the listed decisions. The one worth a sentence: a fully dark site risks
tiring long reads, and the paper interludes for offers, posts, FAQ and the About story handle that.

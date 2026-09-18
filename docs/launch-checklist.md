# Launch checklist

Do these in order. Nothing here is destructive until the last section.

## Accounts (Stephanie's email, Caellum as collaborator)

- [ ] Sanity project created, project ID copied into `studio/.env` and Netlify env vars
- [ ] Content imported (`sanity dataset import`), Studio deployed, Stephanie invited as Administrator
- [ ] Netlify site connected to the GitHub repo, first deploy green
- [ ] Netlify form detection enabled, test message sent, email notification received by Stephanie
- [ ] Netlify build hook created and wired to a Sanity webhook; test by publishing a change
- [ ] Kit account, form created, form URL and UID pasted into Sanity site settings
- [ ] Cloudflare Web Analytics token in Netlify env vars

## Content checks in the Studio

- [ ] Real email address in Contact details (replace the placeholder)
- [ ] Confirm WhatsApp number and Calendly link
- [ ] Next Moonlight Meditation date entered
- [ ] Every photo has a description
- [ ] Prices confirmed

## Before pointing the domain

- [ ] Run Lighthouse on the Netlify preview URL, mobile, all four scores 95 or above
- [ ] Click every link in the header and footer
- [ ] Submit the form once on the preview URL
- [ ] Open the site on a phone

## Cutover

- [ ] Delete the `X-Robots-Tag = "noindex"` block from `netlify.toml` — it exists to keep the preview out of Google
- [ ] Move the Netlify site to Stephanie's team, or recreate it there, so she owns it
- [ ] Add the domain in Netlify, update DNS at the registrar
- [ ] Wait for HTTPS to show as active in Netlify
- [ ] Check the old URLs redirect: /stephanie, /faq-1, /get-started, /cart, each blog post
- [ ] Submit the sitemap in Google Search Console
- [ ] Cancel the Squarespace subscription (keep the domain if it is registered there)

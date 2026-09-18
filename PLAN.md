# Origine Healing rebuild: plan

Status: draft for sign-off before any code is written. 2026-09-18.

## What I found on the live site

- Only four photographs on the site are the Sita Kelly set (two beach portraits, one beach full-length, one indoor
  seated in a teal top against stone and pale wood). They are excellent and the indoor one is literally the brand
  palette. Everything else is older stock imagery from 2022 template blocks, which I would not carry over.
- Headings use Adonis via Adobe Fonts, loaded by the Squarespace plan's Typekit kit. Body is Pontano Sans, which is
  on Google Fonts under the SIL Open Font Licence and can be self-hosted freely.
- The footer's main call to action, "Book a consultation", links to /get-started, which returns a 404 today.
- The homepage blog block shows two posts ("How to Take An Effective Mental Health Day Off" and "Exercises To Calm
  Your Anxious Thoughts") that do not exist on the blog index. They look like template demo content.
- The Contact page has no email address, phone, or street address on it. Structured data for a local business will
  need those.
- Calendly is linked from Contact only. There is one event type, "60mins".

## Stack: confirmed with one recommendation

Astro, Sanity, TypeScript strict, minimal dependencies, as briefed. One decision inside the allowed range:

**Netlify rather than Vercel.** Netlify's free tier includes form handling that works from a plain HTML form with no
JavaScript, emails her on each submission, and needs no server. That covers the enquiry form requirement outright.
Vercel would need a third-party form service or an edge function. Netlify also handles the redirects list in a
one-line-per-rule file. Free tier limits (300 build minutes, 100 GB bandwidth, 100 form submissions a month) are
well above what this site will use.

Rebuild flow: Stephanie presses Publish in Sanity Studio, a webhook hits a Netlify build hook, the site rebuilds in
about a minute. No JavaScript talks to Sanity at runtime, so the site works without JS and Sanity's free API quota
is barely touched.

Dependencies I expect to add, each with a reason:

| Package | Why |
|---|---|
| astro | The framework |
| @sanity/client, groq | Fetch content at build time |
| sanity, @sanity/vision, react, react-dom, styled-components | Sanity Studio's own hard requirements (Studio is a separate workspace, not shipped to visitors) |
| @portabletext/to-html or astro-portabletext | Render rich text from Sanity |
| sharp | Astro's image optimisation backend |

No component library. No CSS framework. Hand-written CSS with custom properties.

Third-party services, all free tiers:

| Need | Pick | Why |
|---|---|---|
| Hosting | Netlify | Forms, redirects, build hooks on free tier |
| CMS | Sanity, Studio hosted at a *.sanity.studio URL | Free plan covers this comfortably; hosted Studio means no second deployment to manage |
| Booking | Calendly (existing) | Kept as briefed |
| Newsletter | Kit (formerly ConvertKit), Newsletter plan | Free to 10,000 subscribers with unlimited sends. MailerLite caps at 1,000 and Mailchimp at 500. Signup works as a plain form POST, no JavaScript required |
| Analytics | Cloudflare Web Analytics | Free, cookieless, no consent banner needed, no event cap. If DNS moves to Cloudflare it is one toggle; otherwise it is one script tag |
| Fonts | Self-hosted | See below |

## Fonts

Adobe Fonts is bundled with Squarespace. Leaving Squarespace almost certainly ends the Adonis licence unless
Stephanie has her own Creative Cloud subscription, and even then Adobe Fonts does not permit self-hosting. I need
confirmation from you, but I am planning on the assumption that Adonis goes.

Replacement candidates, both open-licensed and self-hostable. The design directions will show them so the choice is
made by eye, not by name:

- Fraunces: a soft, warm serif with a variable optical size axis, so display sizes get real character while small
  sizes stay calm.
- Cormorant Garamond: lighter, more classical, closer to Adonis's calligraphic feel.

Body stays Pontano Sans, self-hosted as WOFF2.

## Information architecture recommendation

Navigation (six links plus one button):

1. Work with me. Single session and three-month programme, prices on the buttons. Modalities appear here as
   "what a session can include", not as a menu.
2. Groups and retreats. Moonlight Meditation, circles, workshops, retreats. Upcoming dates from the CMS.
   Newsletter signup lives here.
3. About. One page, not two. Leads with the clinical credentials, then her path, then the Origine philosophy as a
   section. The current About Origine page is a philosophy statement plus a repeat of the modality list. It does not
   earn a separate page and splitting "her" from "the practice" weakens the point that the practice is her.
4. FAQ. First-class page, all sixteen questions, each expandable, with FAQ structured data.
5. Blog. Four posts migrated.
6. Contact. Form, email, socials, location, one-business-day promise.

Button: "Book a session", opening Calendly.

Modalities do not get a navigation slot. They get an index page at /modalities plus one short page per modality,
all from one Sanity document type, linked from Work with me and the footer. The short pages exist for search
traffic ("Access Bars Mauritius" and similar) and each carries Service structured data.

Home: hero with the beach portrait, one-line positioning, the clinical-plus-spiritual line, the two offers with
prices, one testimonial given real space, the credentials strip, the next Moonlight Meditation date, book button.

Redirects:

| Old | New |
|---|---|
| /about | /about |
| /stephanie | /about |
| /work-with-me | /work-with-me |
| /faq-1 | /faq |
| /get-started | /work-with-me |
| /contact | /contact |
| /blog, /blog/* | /blog, /blog/* (slugs cleaned, old slugs redirected) |
| /cart | / |

## Booking and calls to action

- Single session: button goes straight to Calendly with the price on the button.
- Three-month programme: button goes to the enquiry form, pre-selecting the programme. It needs a conversation and
  possibly a payment plan, so Calendly's single 60-minute slot is the wrong tool.
- The Calendly widget is a heavy script. Default is a plain link that opens Calendly. If you want the inline embed,
  it goes on one page only and loads on interaction so it does not drag Lighthouse down site-wide.

## Language

- Astro's built-in i18n routing, English at the root now, French at /fr/... later, no prefix on the default locale.
- Every user-facing string in Sanity is a localised object (en, fr) from day one. Hand-written object types, no
  plugin.
- Interface strings (button labels, "Read more", form labels) live in one dictionary file per locale.
- Adding French later: fill in the fr fields in Studio, add fr.json, turn on the switcher. No schema change.

## Content model

Document types: service, modality, event, post, faqEntry, testimonial, siteSettings, plus page documents for the
editable copy on Home, About, and Contact. Prices are a number plus a currency code on the service document, with
a display format decided in code. Service documents carry a booking mode (Calendly, enquiry, or external link) so a
payment link can be dropped in later without a schema change.

## Things to decide or push back on

- Dark mode: skip. The palette is warm sand and white with slate teal text. A dark mode would mean inventing a dark
  palette that is not hers and doubling the contrast checks. It fights the brief's "warm, grounded" direction.
- Add a short Privacy page. We will be collecting email addresses and enquiry details, and some remote clients are in
  the EU. It is one CMS-editable page and costs nothing. I recommend it moves into scope.
- Nothing else should move into scope. Payments, digital products, portal, and custom booking stay out.

## Running cost

Domain renewal is the only fixed cost, roughly USD 10 to 20 a year depending on the registrar. Everything else is
zero on the free tiers named above. A full cost and renewal note is a deliverable at the end.

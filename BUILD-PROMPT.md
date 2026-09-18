# Build brief: Origine Healing website rebuild

## The job

You are a senior web designer and front-end engineer. Design and build a new marketing website for a
one-person holistic healing practice in Mauritius, replacing an existing Squarespace site.

The current site works but looks like a template. The new one should look like it was made for this
person specifically, and it should run on infrastructure the owner can keep for close to nothing per
month. Design quality is the primary bar here. A competent but generic result is a failure.

Read the whole brief before writing any code. There is a list of questions at the end that you should
ask me before you start building.

## The client

Stephanie Maurel runs Origine Healing, an embodied healing practice based at Domaine de Labourdonnais,
Mapou, in the north of Mauritius. She works in person and remotely.

Her background is unusual and it is the strongest asset the site has. She trained in sports science
and psychology, then occupational therapy. She taught clinical and rehabilitative Pilates for over
twenty years. On top of that clinical base she added NLP and Ericksonian hypnotherapy, transpersonal
coaching psychology, embodiment coaching, Authentic Self-Empowerment, and shamanic training in both
North American and South African traditions. She is a mother, and Mauritius is her parents' homeland.

Her own words, from the current site:

> Healing is not about fixing what is broken. It's about returning to what is already whole within you.

"Origine" is French for origin. She uses it to mean a return to your natural state of being.

Her voice is warm, plain, unhurried. It carries spiritual language without embarrassment but never
tips into woo. She is explicit that clients do not need to be spiritual to work with her, and that
everything is approached in a way that is respectful, embodied, and non-dogmatic. Match that voice
in any copy you write. Do not make it breathier or more mystical than she is.

## Who the site is for

People already somewhere in a healing process. They have often tried talk therapy or bodywork and
want something that treats body, mind, and spirit together. Presenting concerns are chronic pain,
stress, anxiety, emotional overwhelm, life transitions, and a search for meaning.

Most are in Mauritius. Some are remote clients abroad. Mauritius is bilingual in English and French,
and the current site is English only. See the language requirement below.

## What she sells

Prices are in Mauritian rupees (MUR, written Rs on the current site).

**Individual session, Rs 3,000, 60 to 75 minutes.** One modality per session, chosen from Access Bars,
Reiki, rebirthing breathwork, embodiment coaching, or Ericksonian hypnotherapy. Alternatively a
spiritual coaching session where the modality emerges from the conversation. Available as a one-off
or as a package.

**Three-month transformational healing programme, Rs 44,000.** Weekly 60 to 90 minute sessions
combining Reiki, Access Bars, hypnotherapy, shamanic journeys, embodiment coaching, breathwork, and
meditation. Includes access to monthly group meditations, recorded meditations, and text and email
support between sessions. Requires a full three-month commitment. Payment plans are available.

**Monthly Moonlight Meditation, Rs 1,500, 2 to 3 hours.** In-person group meditation drawing on
shamanic wisdom and the medicine wheel, framed around nervous system co-regulation.

**Weekly online guided meditations, free.** Also published on YouTube at @OrigineMeditations.

**Nature-based retreats, 3 to 5 days, price not published.** Slowing down, clearing belief patterns,
embodied movement, soul retrieval. Currently sold through a mailing list, not the website.

**Day workshops, drum circles, shamanic circles.** Occasional, no fixed price.

She also has stated policies worth surfacing on the site: 24 hours notice to reschedule or cancel,
late cancellations charged in full, and a promise to reply to enquiries within one business day.

## The current site, and what is wrong with it

Live at https://www.originehealing.com. Squarespace. Eleven pages: home, about, stephanie,
work-with-me, blog with four posts, faq-1, contact, cart.

Go and look at it before you design anything.

What is worth keeping:

- The brand palette is good and she should not lose it. Deep slate teal `#3f4a49` for text, terracotta
  `#d3957c` as the accent, warm sand `#dcd9d0`, a darker teal `#485957`, and white.
- Typography is Adonis for headings, an Adobe Fonts serif, with Pontano Sans for body. Adonis has real
  character. If we move off Adobe Fonts for licensing or cost reasons, find a self-hostable serif with
  comparable warmth rather than falling back to something safe.
- The photography is professional, credited to Sita Kelly Photography, and it is the best thing on the
  page. Design around it. Give images room.
- The FAQ page is genuinely good content. Sixteen real questions, answered plainly. Most practitioner
  sites have nothing like it. Do not bury it.

What is wrong:

- It reads as a Squarespace template with her content poured into it. Nothing about the layout is hers.
- Nine or more modalities are listed with roughly equal weight. A newcomer cannot tell what to book.
  The two things she actually sells are the single session and the three-month programme. The
  modalities are ingredients, not products, and the site should say so.
- Her clinical credentials, twenty years of rehabilitative Pilates and an occupational therapy
  background, are buried on a secondary page. That background is exactly what makes her credible to a
  sceptical client, and it should be visible early.
- Every call to action funnels to a contact form, even though she already has a live Calendly at
  https://calendly.com/stephanie-origine/60mins. Booking is one click away and the site hides it.
- Prices exist but only on one page, and they are not attached to the calls to action.
- There is a Cart in the navigation with nothing meaningful behind it.
- Testimonials exist but are short, anonymous-ish, and stranded on the homepage. Current ones are
  attributed to Lauren H, Philippe LV, Delphine, and Lauren.

## Goals for the rebuild, in priority order

1. **It should look designed.** Distinctive, warm, grounded, and unmistakably hers. This is the main
   reason for the rebuild.
2. **She should own it and it should be nearly free to run.** Get off the Squarespace subscription.
   Target hosting cost of zero on free tiers, with a domain renewal as the only fixed cost.
3. **She should be able to edit it without me.** Copy changes, prices, new blog posts, new retreat
   dates. Anything she is likely to change more than once a year goes in the CMS, not in the code.
4. **It should make it obvious what to book and how.** Lower priority than the above, but do not
   design in a way that makes it worse.

## Stack

Decided, do not re-litigate unless you have a concrete reason:

- **Astro** for the site. Static output, islands only where genuinely needed.
- **Sanity** as the headless CMS, with the Studio deployed so Stephanie has a URL to log into.
- **Vercel or Netlify** for hosting, on the free tier, deploying from a git repo.
- **TypeScript**, strict.
- Minimal dependencies. Justify each one you add. No component library unless you can show why hand
  written CSS will not do.

Constraints:

- Free tier only. If a feature needs a paid plan, say so and propose the free alternative first.
- No account required for anything a visitor does.
- She is not technical. The Sanity Studio must be arranged so that the fields make sense to someone
  who has only ever used Squarespace. Label fields in her language, not in developer language, and
  write help text on every field that is not self-evident.

## Language

Build in English. Structure the content layer so French can be added later without a rewrite.

That means: no user-facing strings hard coded in components, a locale-aware routing structure decided
now even if only one locale ships, and localised fields in the Sanity schema from day one. Do not
write French copy and do not build a language switcher yet. Just make sure adding both is an
afternoon of work rather than a refactor.

## Scope

In scope for this build:

- All pages listed in the information architecture below.
- Sanity schemas and a deployed Studio.
- Migration of the existing blog posts, FAQ, testimonials, service descriptions, and images.
- An enquiry form that emails her, plus an embedded or linked Calendly for direct booking.
- Newsletter signup that captures an email address for retreat announcements and Moonlight Meditation
  dates. Use a free tier provider and tell me which one you picked and why.
- Analytics. Something privacy-respecting and free.
- SEO basics, sitemap, robots, structured data, Open Graph.

Explicitly out of scope for this version, but do not architect in a way that blocks them:

- Taking payments or deposits online. Note for context, Stripe does not support Mauritius, so this
  will need a local gateway later. Do not try to solve it now.
- Selling digital products such as paid meditations or courses.
- Any account, login, or client portal.
- A custom booking system. Calendly stays.

If you think one of these should move into scope, argue for it in your plan and let me decide. Do not
just build it.

## Information architecture

Propose your own, but this is the starting point and the reasoning behind it:

- **Home.** Who she is, what the two main offers are, the clinical and spiritual background in one
  line, social proof, one clear booking action. A visitor should be able to book from here without
  visiting another page.
- **Work with me.** The two products, single session and three-month programme, with prices attached
  to buttons. The modalities appear here as what a session might contain, not as a menu of nine
  separate things to choose between.
- **Modalities.** A reference page or a set of short pages explaining Access Bars, Reiki, rebirthing
  breathwork, embodiment coaching, Ericksonian hypnotherapy, and shamanic meditation. This is for the
  curious visitor and for search traffic. It should not be the primary path to booking.
- **Group and retreats.** Moonlight Meditation, workshops, circles, retreats. Dates driven by the CMS
  so she can post a new one herself. Newsletter capture lives here.
- **About Stephanie.** Her story and her training. Lead with the clinical credentials.
- **About Origine.** Possibly merge into the above. The current site splits them and I am not sure it
  earns two pages. Make a recommendation.
- **Blog.** Four existing posts to migrate. Rebirthing breathwork, a morning routine post, a
  beginner's guide to meditation, and Access Bars.
- **FAQ.** Sixteen existing questions. Good content, treat it as a first-class page.
- **Contact.** Form, email, socials, location, and a note that she replies within one business day.

Kill the cart.

## Design direction

This is the part that matters most, so spend real effort here.

The feeling to aim for is grounded, warm, spacious, and quiet. Somewhere between a good independent
skincare brand and a well-made book. Nothing clinical and cold, nothing purple and starry.

Some things I want you to take seriously:

- Generous whitespace and large type. Do not fill the page.
- Real editorial layout. Asymmetry, varied section rhythm, images that break the grid. Not a stack of
  identical full-width centred bands, which is what the current site is.
- Motion should be almost invisible. Slow fades, gentle parallax at most. Respect
  `prefers-reduced-motion`.
- Build the palette out from her existing five colours rather than replacing them. Terracotta is the
  accent and should stay rare enough to still mean something.
- Type scale with real contrast between display and body sizes.
- Mobile is likely the majority of her traffic. Design mobile first and make sure the phone layout is
  the good one, not the compromise.
- Dark mode is optional. If it fights the warm palette, skip it and say why.

Before you build, produce two or three distinct visual directions as static HTML pages of the homepage
so I can pick one. Different enough to be a real choice, not three versions of the same idea. I will
show them to Stephanie.

## Content model

Design the Sanity schemas yourself, but they should at minimum cover services with prices and
durations, modalities, events with dates and locations, blog posts, FAQ entries, testimonials, and a
site settings document for contact details and social links.

Prices belong in the CMS as a number plus a currency, not baked into copy, so she can change them in
one place. Every field that appears in more than one place on the site should live in exactly one
document.

## Technical requirements

- Lighthouse 95 or above on all four categories, tested on mobile throttling.
- WCAG 2.2 AA. Real keyboard navigation, real focus states, contrast checked against the actual
  palette, alt text on every image sourced from the CMS.
- Images served as modern formats at responsive sizes. The current site serves large unoptimised
  JPEGs.
- Works without JavaScript for reading content.
- The form must not need a server she pays for. Use a free form service or an edge function on the
  host's free tier.
- Self-host fonts if licensing allows, otherwise load them with proper preconnect and swap behaviour.
- Structured data for a local business and for the services.
- Redirects from every existing URL to its new equivalent so she does not lose search traffic. The
  existing URLs are /about, /stephanie, /work-with-me, /blog, /blog/rebirthing-breathwork,
  /blog/this-morning-routine-will-change-your-mood, /blog/the-beginners-guide-to-meditation-c477r,
  /blog/access-bars, /faq-1, /contact, /get-started, /cart.

## Deliverables

1. A short plan before you build. Stack confirmation, information architecture recommendation, and
   anything in this brief you disagree with.
2. Two or three homepage design directions as static HTML, for me to choose from.
3. The built site in a git repo, with a README covering local development and deployment.
4. Sanity schemas and a deployed Studio.
5. Content migrated from the existing site.
6. A one-page plain English guide for Stephanie on how to edit her own site. Written for someone who
   has never seen a CMS that was not Squarespace. No jargon.
7. A note on what it costs to run per year and what the renewal dates are.

## Ask me these before you start

- Do we have the original photography files from Sita Kelly Photography, or only what is on the live
  site?
- Is there a logo file, and in what formats?
- Who currently owns the domain and where is DNS managed?
- Is the Adobe Fonts licence for Adonis tied to the Squarespace plan, and does it survive leaving?
- Should the Squarespace site stay live during the build, and what is the cutover plan?
- Does Stephanie want to review the design directions herself, or does she want me to filter them
  first?
- Are there new testimonials, or are we working with the four on the current site?
- Is the retreat pricing deliberately private, or just not published yet?

Anything else that would change what you build, ask now rather than assuming.

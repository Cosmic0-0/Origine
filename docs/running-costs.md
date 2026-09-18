# What the website costs to run

Everything below is on a free plan except the domain name. Prices in USD unless stated.

| Service | What it does | Plan | Cost per year | Renewal |
|---|---|---|---|---|
| Domain name, originehealing.com | The address | Registrar (currently unknown, see below) | 10 to 20 | Annual, date unknown until we find the registrar |
| Netlify | Hosts the website, handles the contact form | Free (Starter) | 0 | None |
| Sanity | The editor and stores the content and photos | Free | 0 | None |
| Kit | Newsletter list and sending | Free (Newsletter plan, up to 10,000 subscribers) | 0 | None |
| Cloudflare Web Analytics | Visitor counts | Free | 0 | None |
| Calendly | Booking | Free (one event type) | 0 | None |
| Fonts | Fraunces and Pontano Sans | Open licences, bundled with the site | 0 | None |
| Squarespace | The old site | Cancel after cutover | 0 after cancellation | Stop the renewal |

Expected total: **the domain renewal only**, roughly USD 10 to 20 a year.

## Free-plan limits and what happens if they are hit

- Netlify: 100 GB bandwidth and 300 build minutes a month, 100 form submissions a month. A site this
  size uses a few GB and each build takes under two minutes, so a few hundred publishes a month are
  fine. If the form ever passed 100 messages a month, Netlify charges for the extra; that would be a
  good problem.
- Sanity: 2 datasets, 20 users, 10,000 documents, 500,000 API requests a month. The site fetches
  content only when it builds, so usage is tiny.
- Kit: free up to 10,000 subscribers with unlimited emails. Kit branding appears at the bottom of emails.
  Automated sequences (a welcome series, say) need the paid plan at about USD 33 a month. Not needed now.
- Calendly free: one event type, unlimited bookings. If Stephanie wants a second event type (a 90-minute
  breathwork slot, say), Calendly Standard is USD 10 to 12 a month. The site does not depend on it.

## Renewal dates to write down

- Domain: find where it is registered (try a WHOIS lookup on originehealing.com, or check
  Squarespace → Settings → Domains, since Squarespace may have sold it with the site). Note the
  expiry date and turn on auto-renew with a card that will still be valid next year. Losing the
  domain is the only real risk to the site.
- Nothing else renews.

## If the domain is with Squarespace

Squarespace domains cost about USD 20 a year. It can stay there after the site is cancelled, but
moving it to Cloudflare Registrar (about USD 10.50 a year, sold at cost) also gives free DNS and the
analytics toggle. Transfers take a few days and the site must not be cut over in the same week.

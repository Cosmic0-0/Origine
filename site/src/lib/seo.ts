import type { Locale } from '@/i18n';
import { l } from '@/i18n';
import type { SiteSettings, Service, Event, Post, FaqEntry } from './types';
import { resolvePhoto } from './content';
import { portableTextToPlain } from './portableText';

export const siteUrl = ((import.meta.env.PUBLIC_SITE_URL as string | undefined) || 'https://www.originehealing.com').replace(/\/+$/, '');
export const abs = (path: string) => new URL(path, siteUrl).toString();

export interface SocialImage { url: string; width: number; height: number }

/** The image for the og: tags. Social cards reserve the right space only if they are told its size. */
export async function socialImage(photo: Parameters<typeof resolvePhoto>[0]): Promise<SocialImage | undefined> {
  const r = await resolvePhoto(photo);
  if (!r) return undefined;
  if (typeof r.src !== 'string') return { url: abs(r.src.src), width: r.width, height: r.height };
  // Sanity never upscales, so an image narrower than 1200 comes back at its own width.
  const width = Math.min(1200, r.width);
  return { url: `${r.src}?w=${width}&auto=format`, width, height: Math.round((r.height / r.width) * width) };
}

export async function imageUrl(photo: Parameters<typeof resolvePhoto>[0]): Promise<string | undefined> {
  return (await socialImage(photo))?.url;
}

export async function localBusiness(settings: SiteSettings, locale: Locale, services: Service[] = []) {
  const image = await imageUrl(settings.defaultSeo?.image);
  const amounts = services.map((s) => s.price?.amount).filter((a): a is number => typeof a === 'number' && a > 0);
  const fmt = (n: number) => `Rs ${new Intl.NumberFormat('en-GB').format(n)}`;
  const priceRange = amounts.length ? `${fmt(Math.min(...amounts))} - ${fmt(Math.max(...amounts))}` : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
    '@id': `${siteUrl}/#business`,
    name: settings.siteName ?? 'Origine Healing',
    description: l(settings.tagline, locale),
    url: siteUrl,
    image,
    email: settings.email,
    telephone: settings.whatsapp,
    founder: { '@type': 'Person', name: settings.practitionerName ?? 'Stephanie Maurel', url: abs('/about/') },
    address: settings.address
      ? { '@type': 'PostalAddress', streetAddress: [settings.address.venue, settings.address.street].filter(Boolean).join(', '), addressLocality: settings.address.town, addressRegion: settings.address.region, addressCountry: 'MU' }
      : undefined,
    areaServed: ['Mauritius', 'Online'],
    sameAs: [settings.instagramUrl, settings.facebookUrl, settings.youtubeUrl].filter(Boolean),
    priceRange,
  };
}

export function serviceSchema(service: Service, locale: Locale) {
  const name = l(service.title, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: l(service.summary, locale),
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: ['Mauritius', 'Online'],
    url: abs(`/work-with-me/#${service.slug.current}`),
    offers: service.price?.amount != null && service.price.amount > 0
      ? { '@type': 'Offer', price: service.price.amount, priceCurrency: service.price.currency ?? 'MUR', availability: 'https://schema.org/InStock', url: abs(`/work-with-me/#${service.slug.current}`) }
      : undefined,
  };
}

export function eventSchema(event: Event, locale: Locale, offerName?: string, price?: { amount?: number | null; currency?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: l(event.title, locale) ?? offerName,
    startDate: event.start,
    endDate: event.end,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: l(event.location, locale) ?? 'Domaine de Labourdonnais, Mapou', address: { '@type': 'PostalAddress', addressLocality: 'Mapou', addressCountry: 'MU' } },
    organizer: { '@id': `${siteUrl}/#business` },
    offers: price?.amount != null ? { '@type': 'Offer', price: price.amount, priceCurrency: price.currency ?? 'MUR', availability: event.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock', url: abs('/groups-and-retreats/') } : undefined,
  };
}

export async function postSchema(post: Post, locale: Locale, author: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: l(post.title, locale),
    description: l(post.excerpt, locale) ?? portableTextToPlain(l(post.body, locale)),
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: author, url: abs('/about/') },
    publisher: { '@id': `${siteUrl}/#business` },
    image: await imageUrl(post.coverImage),
    mainEntityOfPage: abs(`/blog/${post.slug.current}/`),
  };
}

export function faqSchema(entries: FaqEntry[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: l(e.question, locale),
      acceptedAnswer: { '@type': 'Answer', text: portableTextToPlain(l(e.answer, locale), 1000) },
    })),
  };
}

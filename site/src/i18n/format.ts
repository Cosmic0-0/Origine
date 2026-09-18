import type { Locale } from './config';
import { getDictionary, fill } from './index';

const intlLocale: Record<Locale, string> = { en: 'en-GB', fr: 'fr-FR' };

export function formatPrice(amount: number | null | undefined, currency: string | null | undefined, locale: Locale): string | undefined {
  if (amount == null) return undefined;
  const cur = currency || 'MUR';
  const number = new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 0 }).format(amount);
  // Mauritian rupees are written "Rs" locally, which is what her clients recognise.
  if (cur === 'MUR') return `Rs ${number}`;
  return new Intl.NumberFormat(intlLocale[locale], { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
}

export function formatDuration(min: number | null | undefined, max: number | null | undefined, locale: Locale): string | undefined {
  const t = getDictionary(locale);
  if (min == null && max == null) return undefined;
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? lo;
  if (lo >= 120 && lo % 60 === 0 && hi % 60 === 0) {
    return lo === hi ? fill(t.offer.hours, { min: lo / 60, max: hi / 60 }).replace(/(\d+) to \1 /, '$1 ') : fill(t.offer.hours, { min: lo / 60, max: hi / 60 });
  }
  return lo === hi ? fill(t.offer.durationSingle, { min: lo }) : fill(t.offer.duration, { min: lo, max: hi });
}

export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { dateStyle: 'long' }): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'Indian/Mauritius', ...opts }).format(new Date(iso));
}

export function formatEventDate(startIso: string, endIso: string | null | undefined, locale: Locale): string {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;
  const day = new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'Indian/Mauritius', weekday: 'long', day: 'numeric', month: 'long' });
  const time = new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'Indian/Mauritius', hour: 'numeric', minute: '2-digit', hour12: locale === 'en' });
  const multiDay = end && end.toDateString() !== start.toDateString();
  if (multiDay) return day.formatRange(start, end);
  const hour12 = locale === 'en';
  let clock = time.format(start);
  if (hour12) clock = clock.replace(':00', '').replace(/\s?(am|pm)$/i, (m) => m.trim().toLowerCase());
  return `${day.format(start)}, ${clock}`;
}

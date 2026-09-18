export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** A field stored per language in Sanity. */
export type Localised<T> = Partial<Record<Locale, T | null>>;

/** Pick the value for a locale, falling back to English. */
export function l<T>(field: Localised<T> | null | undefined, locale: Locale): T | undefined {
  if (!field) return undefined;
  return (field[locale] ?? field[defaultLocale] ?? undefined) as T | undefined;
}

/** Path for a page in a locale. English lives at the root, other locales are prefixed. */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean === '/' ? '' : clean}`;
}

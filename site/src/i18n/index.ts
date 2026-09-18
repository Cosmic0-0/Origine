import { en, type Dictionary } from './en';
import { defaultLocale, type Locale } from './config';

const dictionaries: Partial<Record<Locale, Dictionary>> = { en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale] ?? en;
}

/** Replace {name} placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export { l, localePath, defaultLocale, locales } from './config';
export type { Locale, Localised } from './config';

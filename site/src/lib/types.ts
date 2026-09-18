import type { Localised } from '@/i18n';

export type LocaleString = Localised<string>;
export type LocaleText = Localised<string>;
export type PortableBlock = { _type: string; _key?: string; [k: string]: unknown };
export type LocaleBlock = Localised<PortableBlock[]>;

export interface ImageAsset {
  _id: string;
  url: string;
  metadata?: { dimensions?: { width: number; height: number }; lqip?: string };
}

export interface Photo {
  _type?: 'photo' | 'image';
  asset?: { _ref: string };
  _sanityAsset?: string; // seed and import files only: "image@file://./images/name.jpg"
  alt?: string;
  hotspot?: { x: number; y: number };
}

export interface Price { amount?: number | null; currency?: string | null; note?: LocaleString }
export interface Booking { mode?: 'calendly' | 'enquire' | 'link' | 'none'; url?: string; label?: LocaleString }
export interface Seo { title?: LocaleString; description?: LocaleText; image?: Photo }
export interface Ref { _ref: string; _key?: string }

export interface SiteSettings {
  _type: 'siteSettings';
  siteName?: string;
  practitionerName?: string;
  tagline?: LocaleString;
  email?: string;
  whatsapp?: string;
  phone?: string;
  address?: { venue?: string; street?: string; town?: string; region?: string; country?: string; mapUrl?: string; directions?: LocaleText };
  calendlyUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  newsletterFormUrl?: string;
  newsletterFormUid?: string;
  replyPromise?: LocaleString;
  cancellationPolicy?: LocaleText;
  photoCredit?: string;
  photoCreditUrl?: string;
  defaultSeo?: Seo;
}

export interface Service {
  _id: string; _type: 'service';
  title: LocaleString; slug: { current: string };
  kind: 'session' | 'programme' | 'group' | 'free' | 'retreat' | 'workshop';
  summary?: LocaleText; body?: LocaleBlock; includes?: LocaleString[]; image?: Photo;
  price?: Price; durationMinutes?: { min?: number; max?: number }; frequency?: LocaleString;
  where?: ('inPerson' | 'online')[]; modalities?: Ref[]; booking?: Booking;
  showOnHome?: boolean; order?: number; seo?: Seo;
}

export interface Modality {
  _id: string; _type: 'modality';
  title: LocaleString; slug: { current: string };
  summary?: LocaleText; body?: LocaleBlock; where?: ('inPerson' | 'online')[];
  durationMinutes?: { min?: number; max?: number }; image?: Photo; relatedPost?: Ref; order?: number; seo?: Seo;
}

export interface Event {
  _id: string; _type: 'event';
  title: LocaleString; slug: { current: string }; offer?: Ref;
  start: string; end?: string; location?: LocaleString; price?: Price; description?: LocaleBlock;
  booking?: Booking; spaces?: number; soldOut?: boolean; image?: Photo;
}

export interface Post {
  _id: string; _type: 'post';
  title: LocaleString; slug: { current: string }; publishedAt: string;
  excerpt?: LocaleText; coverImage?: Photo; body?: LocaleBlock; relatedModality?: Ref; seo?: Seo;
}

export interface FaqEntry { _id: string; _type: 'faqEntry'; question: LocaleString; answer?: LocaleBlock; topic?: 'about' | 'sessions' | 'booking'; order?: number }
export interface Testimonial { _id: string; _type: 'testimonial'; quote: LocaleText; name: string; context?: LocaleString; featured?: boolean; order?: number }

export interface HomePage {
  _type: 'homePage';
  heroHeading?: LocaleString; heroLede?: LocaleText; heroImage?: Photo; credentialsLine?: LocaleText;
  statement?: LocaleText; originMeaning?: LocaleText;
  whoHeading?: LocaleString; whoBody?: LocaleBlock; whoImage?: Photo; trainingHeading?: LocaleString;
  moonHeading?: LocaleString; moonBody?: LocaleText; closingHeading?: LocaleString; closingBody?: LocaleText; seo?: Seo;
}
export interface AboutPage {
  _type: 'aboutPage';
  heading?: LocaleString; intro?: LocaleText; portrait?: Photo;
  sections?: { _key: string; heading: LocaleString; body?: LocaleBlock; image?: Photo }[];
  training?: { _key: string; label: LocaleString; detail?: LocaleString; highlight?: boolean }[];
  seo?: Seo;
}
export interface Page { _id: string; _type: 'page'; title?: LocaleString; intro?: LocaleText; body?: LocaleBlock; image?: Photo; seo?: Seo }

export type AnyDoc = SiteSettings | Service | Modality | Event | Post | FaqEntry | Testimonial | HomePage | AboutPage | Page;

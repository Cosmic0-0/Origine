/**
 * One content source for the whole site.
 *
 * With PUBLIC_SANITY_PROJECT_ID set, every document is fetched from Sanity at build time.
 * Without it, the same documents are read from src/seed/seed.ndjson, which is also the file
 * that gets imported into Sanity on first deploy. Either way the pages see identical shapes.
 */
import { createClient } from '@sanity/client';
import seedRaw from '@/seed/seed.ndjson?raw';
import type { AnyDoc, ImageAsset, Photo, Ref, Service, Modality, Event, Post, FaqEntry, Testimonial, SiteSettings, HomePage, AboutPage, Page } from './types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';

const documentTypes = ['siteSettings', 'homePage', 'aboutPage', 'page', 'service', 'modality', 'event', 'post', 'faqEntry', 'testimonial'];

interface Store { docs: Map<string, AnyDoc & { _id: string }>; assets: Map<string, ImageAsset>; source: 'sanity' | 'seed' }
let storePromise: Promise<Store> | null = null;

async function loadFromSanity(): Promise<Store> {
  // useCdn is off on purpose: a build triggered by the publish webhook must read the fresh document, not a cached copy.
  const client = createClient({ projectId: projectId!, dataset, apiVersion: '2026-01-01', useCdn: false, perspective: 'published' });
  const [docs, assets] = await Promise.all([
    client.fetch<(AnyDoc & { _id: string })[]>(`*[_type in $types]`, { types: documentTypes }),
    client.fetch<ImageAsset[]>(`*[_type == "sanity.imageAsset"]{_id, url, metadata{dimensions, lqip}}`),
  ]);
  return { docs: new Map(docs.map((d) => [d._id, d])), assets: new Map(assets.map((a) => [a._id, a])), source: 'sanity' };
}

/** Local seed images, imported so Astro can optimise them like any other asset. */
const seedImages = import.meta.glob<{ default: ImageMetadata }>('/src/seed/images/*.{jpg,jpeg,png,webp}', { eager: true });

async function loadFromSeed(): Promise<Store> {
  const text = seedRaw as string;
  const docs = new Map<string, AnyDoc & { _id: string }>();
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const doc = JSON.parse(line) as AnyDoc & { _id: string };
    docs.set(doc._id, doc);
  }
  return { docs, assets: new Map(), source: 'seed' };
}

export async function getStore(): Promise<Store> {
  if (!storePromise) storePromise = projectId ? loadFromSanity() : loadFromSeed();
  return storePromise;
}

function ofType<T extends AnyDoc>(store: Store, type: T['_type']): (T & { _id: string })[] {
  return [...store.docs.values()].filter((d) => d._type === type && !d._id.startsWith('drafts.')) as (T & { _id: string })[];
}
const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 100) - (b.order ?? 100);

export async function getSettings(): Promise<SiteSettings> {
  const store = await getStore();
  return (store.docs.get('siteSettings') as SiteSettings | undefined) ?? { _type: 'siteSettings' };
}
export async function getHomePage(): Promise<HomePage> { return ((await getStore()).docs.get('homePage') as HomePage | undefined) ?? { _type: 'homePage' }; }
export async function getAboutPage(): Promise<AboutPage> { return ((await getStore()).docs.get('aboutPage') as AboutPage | undefined) ?? { _type: 'aboutPage' }; }
export async function getPage(id: 'work' | 'groups' | 'modalities' | 'blog' | 'faq' | 'contact' | 'privacy'): Promise<Page> {
  return ((await getStore()).docs.get(`page-${id}`) as Page | undefined) ?? { _id: `page-${id}`, _type: 'page' };
}
export async function getServices(): Promise<Service[]> { return ofType<Service>(await getStore(), 'service').sort(byOrder); }
export async function getModalities(): Promise<Modality[]> { return ofType<Modality>(await getStore(), 'modality').sort(byOrder); }
export async function getPosts(): Promise<Post[]> { return ofType<Post>(await getStore(), 'post').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)); }
export async function getFaq(): Promise<FaqEntry[]> { return ofType<FaqEntry>(await getStore(), 'faqEntry').sort(byOrder); }
export async function getTestimonials(): Promise<Testimonial[]> { return ofType<Testimonial>(await getStore(), 'testimonial').sort(byOrder); }
export async function getEvents(opts: { upcoming?: boolean } = {}): Promise<Event[]> {
  const all = ofType<Event>(await getStore(), 'event').sort((a, b) => a.start.localeCompare(b.start));
  if (!opts.upcoming) return all;
  // Keep an event visible for twelve hours after it ends, so an evening event is still listed the next morning.
  const cutoff = Date.now() - 12 * 3600 * 1000;
  return all.filter((e) => new Date(e.end ?? e.start).getTime() >= cutoff);
}

export async function deref<T extends AnyDoc>(ref: Ref | null | undefined): Promise<(T & { _id: string }) | undefined> {
  if (!ref?._ref) return undefined;
  return (await getStore()).docs.get(ref._ref) as (T & { _id: string }) | undefined;
}
export async function derefAll<T extends AnyDoc>(refs: Ref[] | null | undefined): Promise<(T & { _id: string })[]> {
  const out: (T & { _id: string })[] = [];
  for (const r of refs ?? []) { const d = await deref<T>(r); if (d) out.push(d); }
  return out;
}

/** Everything a template needs to render a photo. `src` is a remote URL or a local ImageMetadata. */
export interface ResolvedPhoto { src: string | ImageMetadata; width: number; height: number; alt: string; position: string; lqip?: string | undefined }

export async function resolvePhoto(photo: Photo | null | undefined): Promise<ResolvedPhoto | undefined> {
  if (!photo) return undefined;
  const store = await getStore();
  const alt = photo.alt ?? '';
  const position = photo.hotspot ? `${Math.round(photo.hotspot.x * 100)}% ${Math.round(photo.hotspot.y * 100)}%` : '50% 30%';
  if (photo.asset?._ref) {
    const asset = store.assets.get(photo.asset._ref);
    if (asset?.metadata?.dimensions) {
      return { src: asset.url, width: asset.metadata.dimensions.width, height: asset.metadata.dimensions.height, alt, position, lqip: asset.metadata.lqip };
    }
    console.warn(`[content] photo asset ${photo.asset._ref} not found or has no dimensions; it will not render`);
  }
  if (photo._sanityAsset) {
    const name = photo._sanityAsset.replace(/^image@file:\/\//, '').replace(/^\.?\/?images\//, '');
    const mod = seedImages[`/src/seed/images/${name}`];
    if (mod) return { src: mod.default, width: mod.default.width, height: mod.default.height, alt, position };
  }
  return undefined;
}

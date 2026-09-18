import { toHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import type { PortableBlock, Photo } from './types';
import { resolvePhoto } from './content';

function escapeAttr(s: string): string { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

/** Render Sanity rich text to HTML. Images inside the text are resolved ahead of time. */
export async function renderPortableText(blocks: PortableBlock[] | null | undefined): Promise<string> {
  if (!blocks || blocks.length === 0) return '';
  const imageHtml = new Map<string, string>();
  for (const b of blocks) {
    if (b._type === 'image' && b._key) {
      const photo = await resolvePhoto(b as unknown as Photo);
      if (!photo) continue;
      const src = typeof photo.src === 'string' ? photo.src : photo.src.src;
      const isRemote = typeof photo.src === 'string' && photo.src.startsWith('http');
      const srcset = isRemote ? [640, 960, 1280].map((w) => `${src}?w=${w}&auto=format&q=80 ${w}w`).join(', ') : undefined;
      const caption = typeof b.caption === 'string' && b.caption ? `<figcaption>${escapeAttr(b.caption)}</figcaption>` : '';
      imageHtml.set(b._key, `<figure><img src="${isRemote ? `${src}?w=1280&auto=format&q=80` : src}"${srcset ? ` srcset="${srcset}" sizes="(min-width: 52rem) 42rem, 100vw"` : ''} width="${photo.width}" height="${photo.height}" alt="${escapeAttr(photo.alt)}" loading="lazy" decoding="async">${caption}</figure>`);
    }
  }
  const components: Partial<PortableTextHtmlComponents> = {
    types: { image: ({ value }) => imageHtml.get((value as { _key?: string })._key ?? '') ?? '' },
    marks: {
      link: ({ children, value }) => {
        const href = (value as { href?: string } | undefined)?.href ?? '#';
        const external = /^https?:\/\//.test(href);
        return `<a href="${escapeAttr(href)}"${external ? ' rel="noopener"' : ''}>${children}</a>`;
      },
    },
  };
  return toHTML(blocks as never, { components });
}

/** Plain text of rich text, for meta descriptions. */
export function portableTextToPlain(blocks: PortableBlock[] | null | undefined, max = 160): string {
  if (!blocks) return '';
  const text = blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => (b.children as { text?: string }[]).map((c) => c.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

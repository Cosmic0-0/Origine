import { existsSync, readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

/** Every page the last build produced, as a URL path. */
const dist = new URL('../dist/', import.meta.url);
const pages = existsSync(dist)
  ? readdirSync(dist, { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.html'))
      .map((file) => `/${file.replace(/(^|\/)index\.html$/, '$1')}`)
      .sort()
  : [];

if (pages.length === 0) throw new Error('No pages in site/dist. Run `npm run build` first.');

for (const path of pages) {
  test(path, async ({ page }) => {
    const response = await page.goto(path);
    expect.soft(response?.status(), 'the page did not load').toBeLessThan(400);
    // Type that is still swapping fonts measures differently, and the width test below would flicker.
    await page.evaluate(() => document.fonts.ready);

    // One h1, so the page announces itself once and the outline below it makes sense.
    await expect.soft(page.locator('h1')).toHaveCount(1);

    // A photo with no alt text is a photo a screen reader cannot pass on.
    const undescribed = await page.locator('img').evaluateAll((images) =>
      (images as HTMLImageElement[]).filter((img) => !img.alt.trim()).map((img) => img.getAttribute('src') ?? '(no src)'),
    );
    expect.soft(undescribed, 'images without alt text').toEqual([]);

    // Nothing may push the page sideways at 320px.
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= doc.clientWidth) return null;
      const tooWide = [...document.body.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
        .slice(0, 5)
        .map((el) => el.tagName.toLowerCase() + (el.classList.length ? `.${[...el.classList].join('.')}` : ''));
      return { pageWidth: doc.scrollWidth, viewport: doc.clientWidth, tooWide };
    });
    expect.soft(overflow, 'the page scrolls sideways').toBeNull();
  });
}

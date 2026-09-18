import { test, expect } from '@playwright/test';

// The Menu button only exists at phone width, which is the viewport set in playwright.config.ts.
test.describe('the phone menu', () => {
  test('closes on Escape and hands focus back to the button', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('.site-header .menu');
    await menu.locator('summary').click();
    await expect(menu).toHaveJSProperty('open', true);

    await page.keyboard.press('Tab'); // into the first link of the open menu
    await page.keyboard.press('Escape');
    await expect(menu).toHaveJSProperty('open', false);
    await expect(menu.locator('summary')).toBeFocused();
  });

  test('closes when you touch the page outside it', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('.site-header .menu');
    await menu.locator('summary').click();
    await expect(menu).toHaveJSProperty('open', true);

    await page.locator('.site-footer').click({ position: { x: 5, y: 5 } });
    await expect(menu).toHaveJSProperty('open', false);
  });

  test('a link inside it still goes to the page', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('.site-header .menu');
    await menu.locator('summary').click();
    await menu.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  });
});

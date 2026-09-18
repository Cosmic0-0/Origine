import { defineConfig } from 'vitest/config';

// Unit tests are tests/*.test.ts. The browser checks in the same folder are *.spec.ts and belong to Playwright.
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'] },
});

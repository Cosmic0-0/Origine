import { defineConfig } from '@playwright/test';

// A port of its own, so a preview server you left running elsewhere is never the thing under test.
const port = 4325;

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.spec.ts', // tests/*.test.ts belongs to vitest.
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // The narrowest phone still in use. Whatever fits here fits everywhere.
    viewport: { width: 320, height: 640 },
  },
  webServer: {
    // Serves site/dist, so build before running: `npm run test:e2e` does both.
    command: `npm run preview -- --port ${port} --ignore-lock`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});

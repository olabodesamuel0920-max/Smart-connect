import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    // Use system-installed Chrome to avoid downloading large browser binaries
    channel: 'chrome',
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
});

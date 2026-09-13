import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 428, height: 926 }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 428, height: 926 } } },
    {
      name: 'webkit',
      use: { ...devices['iPhone 13 Pro Max'], viewport: { width: 428, height: 926 } }
    }
  ]
});

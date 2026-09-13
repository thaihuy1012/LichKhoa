import { test, expect } from '@playwright/test';

test('trang có manifest và service worker sẵn sàng', async ({ page }) => {
  await page.goto('/');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveCount(1);

  const swReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return true;
  });
  expect(swReady).toBe(true);
});

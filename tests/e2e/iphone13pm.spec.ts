import { test, expect } from '@playwright/test';

test.describe('iPhone 13 Pro Max (D-007)', () => {
  test('lần đầu mở: preset 1284x2778, không cuộn, vùng chạm/áp dụng >= 16px/44px', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
    });

    await page.goto('/');

    const device = page.getByTestId('device');
    const preview = page.getByTestId('preview');

    await expect(device).toHaveValue('iphone-1284x2778');

    await expect
      .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1284);
    await expect
      .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalHeight))
      .toBe(2778);

    const saveButton = page.getByTestId('save');
    await expect(saveButton).toBeVisible();

    const scroll = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth);

    const saveBox = await saveButton.boundingBox();
    expect(saveBox).not.toBeNull();
    const viewport = page.viewportSize()!;
    expect(saveBox!.y + saveBox!.height).toBeLessThanOrEqual(viewport.height);

    const tabButtons = page.locator('.tab');
    const count = await tabButtons.count();
    for (let i = 0; i < count; i++) {
      const box = await tabButtons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    }

    const fontSize = await device.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);

    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  });
});

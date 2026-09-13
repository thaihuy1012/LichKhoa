import { test, expect } from '@playwright/test';

const DEVICE_ID = 'iphone-1179x2556';

test('M1: chọn thiết bị, xem preview, lưu ảnh, reload giữ trạng thái', async ({ page }) => {
  // Tắt Web Share để buộc đi nhánh <a download> (ổn định hơn cho E2E cả chromium + webkit).
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });
  });

  await page.goto('/');

  const device = page.getByTestId('device');
  const preview = page.getByTestId('preview');
  // Chọn thiết bị ngay khi <select> xuất hiện, KHÔNG chờ ảnh xem trước đầu tiên dựng xong.
  // Đây là kịch bản tái hiện bug race (Preview.tsx: store.subscribe đăng ký sau paint) —
  // đã sửa Preview.tsx để state cục bộ đồng bộ lại ngay khi effect chạy.
  await device.selectOption(DEVICE_ID);

  await expect
    .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBe(1179);
  await expect
    .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalHeight))
    .toBe(2556);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('save').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c) => chunks.push(c as Buffer));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  const size = Buffer.concat(chunks).length;
  expect(size).toBeGreaterThan(10 * 1024);

  // Chờ debounce persist (300ms) trước khi reload.
  await page.waitForTimeout(500);
  await page.reload();

  await expect(page.getByTestId('device')).toHaveValue(DEVICE_ID);
  const previewAfterReload = page.getByTestId('preview');
  await expect(previewAfterReload).toBeVisible();
  await expect
    .poll(() => previewAfterReload.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBe(1179);
  await expect
    .poll(() => previewAfterReload.evaluate((img: HTMLImageElement) => img.naturalHeight))
    .toBe(2556);
});

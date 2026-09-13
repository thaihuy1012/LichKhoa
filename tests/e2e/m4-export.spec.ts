import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Luồng đầu-cuối M4: ảnh nền + tùy chỉnh -> Sao chép -> Đặt hình nền.
 * Chromium only: Playwright không cấp quyền `clipboard-write` trên webkit (như share.spec.ts). */
test.describe('M4: ảnh nền + tùy chỉnh -> Sao chép / Đặt hình nền', () => {
  test('sau khi chỉnh ảnh nền, Sao chép ghi image/png; Đặt hình nền điều hướng shortcuts://', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write chỉ cấp quyền được trên chromium trong Playwright.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/?test=1');
    await page.getByTestId('tab-design').click();
    await page.getByTestId('bg-file').setInputFiles(path.join(__dirname, '..', 'fixtures', 'photo-4000x3000.jpg'));
    await expect(page.getByTestId('bg-kind-photo')).toHaveAttribute('aria-selected', 'true');
    await page.getByTestId('blur-2').click();
    await page.getByTestId('dim').fill('0.4');
    await page.getByTestId('position-bottom').click();
    await page.getByTestId('font-serif').click();

    await page.getByTestId('tab-preview').click();
    await expect(page.getByTestId('save')).toBeEnabled();

    await page.getByTestId('copy').click();
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const list = await navigator.clipboard.read();
          return list.flatMap((i) => i.types);
        }),
      )
      .toContain('image/png');

    await page.getByTestId('set-wallpaper').click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav))
      .toMatch(/^shortcuts:\/\/run-shortcut\?name=/);
  });
});

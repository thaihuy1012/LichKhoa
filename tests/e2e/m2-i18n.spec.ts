import { test, expect } from '@playwright/test';

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

test('i18n: đổi ngôn ngữ đổi nhãn tab; 12h -> AM/PM trong agenda; tắt âm lịch -> mất dòng Âm lịch', async ({
  page,
}) => {
  await page.goto('/?test=1');

  // Sự kiện có giờ (không cả ngày) để agenda hiện thời gian, kiểm AM/PM.
  await page.getByTestId('tab-events').click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Sự kiện có giờ');
  await page.getByTestId('ev-save').click();

  // Nhãn tab tiếng Việt trước khi đổi.
  await expect(page.getByTestId('tab-events')).toHaveText('Sự kiện');
  await expect(page.getByTestId('tab-preview')).toHaveText('Xem trước');

  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();

  // Đổi sang en -> nhãn tab đổi.
  await page.getByTestId('lang').selectOption('en');
  await expect(page.getByTestId('tab-events')).toHaveText('Events');
  await expect(page.getByTestId('tab-preview')).toHaveText('Preview');

  // Bố cục Agenda + bật 12h -> __lastOps chứa AM/PM.
  await page.getByTestId('layout-agenda').click();
  await page.getByTestId('hour12').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringMatching(/AM|PM/)]));

  // Về tiếng Việt cho phần kiểm âm lịch (mặc định bật).
  await page.getByTestId('lang').selectOption('vi');
  await page.getByTestId('layout-month').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringContaining('Âm lịch')]));

  // Tắt âm lịch -> hết dòng "Âm lịch".
  await page.getByTestId('lunar').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .not.toEqual(expect.arrayContaining([expect.stringContaining('Âm lịch')]));
});

test('T-2.14: đổi en -> nhãn "Thiết bị"/"Tự phát hiện"/"Tùy chỉnh"/"Lưu ảnh" trên Preview đổi theo', async ({ page }) => {
  await page.goto('/?test=1');
  await page.getByTestId('tab-preview').click();

  await expect(page.getByTestId('save')).toHaveText('Lưu ảnh');
  const deviceLabel = page.locator('label.field', { hasText: 'Thiết bị' });
  await expect(deviceLabel).toHaveCount(1);
  await expect(page.getByTestId('device').getByRole('option', { name: 'Tự phát hiện' })).toHaveCount(1);
  await expect(page.getByTestId('device').getByRole('option', { name: 'Tùy chỉnh' })).toHaveCount(1);

  await page.getByTestId('lang').selectOption('en');

  await expect(page.getByTestId('save')).toHaveText('Save image');
  await expect(page.locator('label.field', { hasText: 'Device' })).toHaveCount(1);
  await expect(page.getByTestId('device').getByRole('option', { name: 'Auto-detect' })).toHaveCount(1);
  await expect(page.getByTestId('device').getByRole('option', { name: 'Custom' })).toHaveCount(1);
});

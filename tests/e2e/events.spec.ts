import { test, expect } from '@playwright/test';

async function openEventsTab(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByTestId('tab-events').click();
}

test('Sự kiện: thêm/sửa/xóa, xuất .ics, việc cần làm, ghi chú', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await openEventsTab(page);

  // Thêm sự kiện lặp tuần.
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Họp nhóm');
  await page.getByTestId('ev-repeat').selectOption('weekly');

  // select tối màu, đọc được (không còn nền trắng mặc định).
  const repeatBg = await page.getByTestId('ev-repeat').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(repeatBg).not.toBe('rgb(255, 255, 255)');

  await page.getByTestId('ev-save').click();

  const item = page.getByTestId('ev-item').filter({ hasText: 'Họp nhóm' });
  await expect(item).toBeVisible();

  const today = await page.evaluate(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  });
  await expect(page.getByTestId(`cal-cell-${today}`).locator('.cal-dot')).toHaveCount(1);

  // Sửa tiêu đề.
  await item.click();
  await page.getByTestId('ev-title').fill('Họp nhóm (đổi)');
  await page.getByTestId('ev-save').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: 'Họp nhóm (đổi)' })).toBeVisible();

  // Xuất .ics.
  await page.getByTestId('ev-item').filter({ hasText: 'Họp nhóm (đổi)' }).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('ev-ics').click()]);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c) => chunks.push(c as Buffer));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  expect(Buffer.concat(chunks).toString('utf-8')).toContain('BEGIN:VEVENT');
  await page.getByTestId('ev-cancel').click();

  // Xóa sự kiện (confirm tự chấp nhận qua page.on('dialog')).
  await page.getByTestId('ev-item').filter({ hasText: 'Họp nhóm (đổi)' }).click();
  await page.getByTestId('ev-delete').click();
  await expect(page.getByTestId('ev-item')).toHaveCount(0);

  // Việc cần làm.
  await page.getByTestId('seg-todos').click();
  await page.getByTestId('todo-input').fill('Việc A');
  await page.getByTestId('todo-add').click();
  await page.getByTestId('todo-input').fill('Việc B');
  await page.getByTestId('todo-add').click();

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Việc A');

  await rows.nth(0).getByTestId('todo-down').click();
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Việc B');

  // todo-toggle không ẩn vào nền: viền vẽ qua ::before phải khác màu nền trang.
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const toggleBorder = await rows
    .nth(0)
    .getByTestId('todo-toggle')
    .evaluate((el) => getComputedStyle(el, '::before').borderTopColor);
  expect(toggleBorder).not.toBe(bodyBg);
  expect(toggleBorder).not.toBe('rgba(0, 0, 0, 0)');

  await rows.nth(0).getByTestId('todo-toggle').click();
  await expect(page.getByTestId('todo-done-toggle')).toBeVisible();
  await page.getByTestId('todo-done-toggle').click();
  await expect(page.getByTestId('todo-item').filter({ hasText: 'Việc B' })).toBeVisible();

  // Ghi chú: chỉ khung tạm (nội dung thật ở phiếu sau, D-011).
  await page.getByTestId('seg-note').click();
  await expect(page.locator('.note-tab')).toBeVisible();
});

test.describe('iPhone 13 Pro Max (428x926): không cuộn ngang, ev-save trong viewport', () => {
  test('tab Sự kiện + sheet mở', async ({ page }) => {
    await openEventsTab(page);

    const scroll1 = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scroll1.scrollWidth).toBeLessThanOrEqual(scroll1.clientWidth);

    await page.getByTestId('add-event').click();
    const scroll2 = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scroll2.scrollWidth).toBeLessThanOrEqual(scroll2.clientWidth);

    const saveButton = page.getByTestId('ev-save');
    await expect(saveButton).toBeVisible();
    const box = await saveButton.boundingBox();
    expect(box).not.toBeNull();
    const viewport = page.viewportSize()!;
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  });
});

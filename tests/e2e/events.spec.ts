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

test('Sự kiện: lặp Thứ Hai đến Thứ Sáu (v1.3)', async ({ page }) => {
  await openEventsTab(page);

  // Ngày 15 của tháng hiện tại + tuần chứa nó (luôn nằm trọn trong tháng, mọi tháng có >= 21 ngày).
  const { day15, days } = await page.evaluate(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const d15 = new Date(y, m, 15);
    const diffToMonday = (d15.getDay() + 6) % 7;
    const monday = new Date(y, m, 15 - diffToMonday);
    const days: { date: string; dow: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({ date: iso(d), dow: d.getDay() });
    }
    return { day15: iso(d15), days };
  });

  // Sự kiện bắt đầu từ Thứ Hai của tuần (occurrence chỉ mở rộng từ ngày bắt đầu trở đi).
  void day15;
  const monday = days[0].date;
  await page.getByTestId(`cal-cell-${monday}`).click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Học tiếng Anh');
  await page.getByTestId('ev-repeat').selectOption('weekdays');
  await page.getByTestId('ev-save').click();

  for (const d of days) {
    const dotCount = d.dow === 0 || d.dow === 6 ? 0 : 1;
    await expect(page.getByTestId(`cal-cell-${d.date}`).locator('.cal-dot')).toHaveCount(dotCount);
  }
});

test('Sự kiện: Nhắc trước -> .ics có VALARM', async ({ page }) => {
  await openEventsTab(page);

  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Nhắc việc');
  await page.getByTestId('ev-alarm').selectOption('15');
  await page.getByTestId('ev-save').click();

  await page.getByTestId('ev-item').filter({ hasText: 'Nhắc việc' }).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('ev-ics').click()]);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c) => chunks.push(c as Buffer));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  expect(Buffer.concat(chunks).toString('utf-8')).toContain('TRIGGER:-PT15M');
});

test('Việc cần làm: hạn quá hạn hiện trước việc không hạn', async ({ page }) => {
  await openEventsTab(page);

  const yesterday = await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  await page.getByTestId('seg-todos').click();
  await page.getByTestId('todo-input').fill('Việc không hạn');
  await page.getByTestId('todo-add').click();
  await page.getByTestId('todo-input').fill('Việc trễ hạn');
  await page.getByTestId('todo-due').fill(yesterday);
  await page.getByTestId('todo-add').click();

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Việc trễ hạn');
  await expect(rows.nth(0).getByTestId('todo-due-label')).toHaveText('Quá hạn');
  await expect(rows.nth(0).getByTestId('todo-due-label')).toHaveClass(/todo-due-overdue/);
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('Việc không hạn');
});

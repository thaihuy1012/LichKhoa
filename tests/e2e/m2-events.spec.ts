import { test, expect } from '@playwright/test';

async function readDownload(download: import('@playwright/test').Download): Promise<string> {
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c) => chunks.push(c as Buffer));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  return Buffer.concat(chunks).toString('utf-8');
}

async function previewHash(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate(async () => {
    const img = document.querySelector('img[data-testid="preview"]') as HTMLImageElement;
    const buf = await (await fetch(img.src)).arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  });
}

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

test('M2 luồng chính: sự kiện lặp tuần + nhắc trước, agenda đổi hash, ghi chú ghim, hạn to-do, sao lưu/khôi phục', async ({
  page,
}) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');

  // Sự kiện lặp tuần, có nhắc trước 15 phút (v1.3).
  await page.getByTestId('tab-events').click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Họp tuần');
  await page.getByTestId('ev-repeat').selectOption('weekly');
  await page.getByTestId('ev-alarm').selectOption('15');
  await page.getByTestId('ev-save').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: 'Họp tuần' })).toBeVisible();

  // Việc cần làm có hạn (quá hạn) để kiểm tra sao lưu/khôi phục giữ nguyên hạn.
  const yesterday = await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  await page.getByTestId('seg-todos').click();
  await page.getByTestId('todo-input').fill('Việc trễ hạn');
  await page.getByTestId('todo-due').fill(yesterday);
  await page.getByTestId('todo-add').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  // 2 ghi chú, ghim ghi chú thứ 2.
  await page.getByTestId('seg-note').click();
  await page.getByTestId('add-note').click();
  await page.getByTestId('nt-title').fill('Ghi chú 1');
  await page.getByTestId('nt-body').fill('Nội dung 1');
  await page.getByTestId('nt-save').click();
  await page.getByTestId('add-note').click();
  await page.getByTestId('nt-title').fill('Ghi chú 2');
  await page.getByTestId('nt-body').fill('Nội dung 2');
  await page.getByTestId('nt-pin').click();
  await page.getByTestId('nt-save').click();
  await expect(page.getByTestId('note-item')).toHaveCount(2);
  await page.getByTestId('note-show').check();

  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();

  // Ghi chú ghim: __lastOps chứa ghi chú 2, không chứa ghi chú 1.
  const notesOps = await opsTexts(page);
  const hasNote2 = notesOps.some((tx) => tx.includes('Ghi chú 2') || tx.includes('Nội dung 2'));
  const hasNote1 = notesOps.some((tx) => tx.includes('Ghi chú 1') || tx.includes('Nội dung 1'));
  expect(hasNote2).toBe(true);
  expect(hasNote1).toBe(false);

  // To-do quá hạn: __lastOps có nhãn "Quá hạn" (bố cục To-do).
  await page.getByTestId('layout-todo').click();
  await expect.poll(async () => opsTexts(page), { timeout: 5000 }).toEqual(expect.arrayContaining(['Quá hạn']));

  // Chuyển sang Agenda -> hash PNG preview phải đổi so với bố cục To-do.
  const hashBefore = await previewHash(page);
  await page.getByTestId('layout-agenda').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringContaining('Họp tuần')]));
  await expect.poll(async () => previewHash(page), { timeout: 5000 }).not.toBe(hashBefore);

  // Reload -> dữ liệu còn nguyên (IndexedDB).
  await page.reload();
  await page.getByTestId('tab-events').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: 'Họp tuần' })).toBeVisible();
  await page.getByTestId('seg-todos').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(2);

  // Xuất JSON.
  await page.getByTestId('tab-preview').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-json').click()]);
  const backupJson = await readDownload(download);
  expect(backupJson).toContain('Họp tuần');

  // Xóa toàn bộ dữ liệu.
  await page.getByTestId('wipe').click();
  await page.getByTestId('tab-events').click();
  await expect(page.getByTestId('ev-item')).toHaveCount(0);
  await page.getByTestId('seg-todos').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(0);

  // Nhập lại JSON -> sự kiện, to-do (hạn giữ nguyên), ghi chú (ghim giữ nguyên) trở lại.
  await page.getByTestId('tab-preview').click();
  await page.getByTestId('import-json').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backupJson, 'utf-8'),
  });
  await expect(page.getByTestId('toast')).toContainText('Đã khôi phục dữ liệu');

  await page.getByTestId('tab-events').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: 'Họp tuần' })).toBeVisible();
  await page.getByTestId('ev-item').filter({ hasText: 'Họp tuần' }).click();
  await expect(page.getByTestId('ev-alarm')).toHaveValue('15');
  await page.getByTestId('ev-cancel').click();

  await page.getByTestId('seg-todos').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-due-label')).toHaveText('Quá hạn');

  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(2);
  await expect(page.getByTestId('note-item').nth(0)).toContainText('Ghi chú 2');
  await expect(page.getByTestId('note-item').nth(0).locator('.note-item-pin')).toBeVisible();
});

test('Sự kiện lặp Thứ Hai đến Thứ Sáu (v1.3): hiện đúng ngày trên Agenda', async ({ page }) => {
  await page.goto('/?test=1');
  await page.getByTestId('tab-events').click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Học tiếng Anh');
  await page.getByTestId('ev-repeat').selectOption('weekdays');
  await page.getByTestId('ev-save').click();

  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-agenda').click();

  // Tập ngày mong đợi (T2-T6, getDay() 1..5) trong 7 ngày kể từ hôm nay, theo giờ
  // trình duyệt — cùng nguồn thời gian với app (tránh lệch TZ).
  // Nhãn tiêu đề ngày theo `dayLabel` (src/render/layout/common.ts): "Hôm nay" /
  // "Ngày mai" / "T<n> d/m" (so khớp phần trước " · " vì có thể kèm âm lịch).
  const expectedHeaders = await page.evaluate(() => {
    const wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const headers: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      if (i === 0) headers.push('Hôm nay');
      else if (i === 1) headers.push('Ngày mai');
      else headers.push(`${wd[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`);
    }
    return headers;
  });
  expect(expectedHeaders).toHaveLength(5);

  // Tiêu đề ngày (weight 700) có sự kiện "Học tiếng Anh" ngay sau nó trong __lastOps.
  const headersWithEvent = () =>
    page.evaluate(() => {
      type Op = { op: string; text?: string; weight?: number };
      const ops = ((window as unknown as { __lastOps?: Op[] }).__lastOps ?? []) as Op[];
      const result: string[] = [];
      let currentHeader: string | null = null;
      for (const o of ops) {
        if (o.op !== 'text' || !o.text) continue;
        if (o.weight === 700) {
          currentHeader = o.text.split(' · ')[0];
        } else if (o.weight === 600 && o.text === 'Học tiếng Anh' && currentHeader) {
          result.push(currentHeader);
        }
      }
      return result;
    });

  await expect.poll(headersWithEvent, { timeout: 5000 }).toEqual(expectedHeaders);
});

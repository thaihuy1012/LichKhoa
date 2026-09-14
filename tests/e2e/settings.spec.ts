import { test, expect } from '@playwright/test';
import { writeFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function previewHash(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate(async () => {
    const img = document.querySelector('[data-testid="preview"]') as HTMLImageElement;
    const res = await fetch(img.src);
    const buf = await res.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  });
}

/** IndexedDB `keyval-store`/`keyval` (idb-keyval mặc định) — nơi `saveBg`/`loadBg` lưu ảnh nền. */
async function readBgKey(page: import('@playwright/test').Page): Promise<unknown> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const req = indexedDB.open('keyval-store');
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction('keyval', 'readonly');
          const getReq = tx.objectStore('keyval').get('lichkhoa:bg');
          getReq.onsuccess = () => resolve(getReq.result);
          getReq.onerror = () => reject(getReq.error);
        };
      }),
  );
}

async function readDownload(download: import('@playwright/test').Download): Promise<Buffer> {
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c) => chunks.push(c as Buffer));
    stream.on('end', () => resolve());
    stream.on('error', reject);
  });
  return Buffer.concat(chunks);
}

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

test('Preview: chọn bố cục, cài đặt chung, sao lưu', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');

  // Sự kiện hôm nay (09:00, không cả ngày) để Agenda có nhãn "Hôm nay" + giờ.
  await page.getByTestId('tab-events').click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill('Sự kiện hôm nay');
  await page.getByTestId('ev-save').click();

  // Việc cần làm có hạn, để kiểm tra vòng sao lưu/khôi phục.
  await page.getByTestId('seg-todos').click();
  await page.getByTestId('todo-input').fill('Việc có hạn');
  const todayStr = await page.evaluate(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  });
  await page.getByTestId('todo-due').fill(todayStr);
  await page.getByTestId('todo-add').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  // Ghi chú.
  await page.getByTestId('seg-note').click();
  await page.getByTestId('add-note').click();
  await page.getByTestId('nt-title').fill('Ghi chú v1.3');
  await page.getByTestId('nt-body').fill('Nội dung ghi chú');
  await page.getByTestId('nt-save').click();
  await expect(page.getByTestId('note-item')).toHaveCount(1);

  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();

  // Trước khi bấm: chỉ "Tháng" (mặc định) được chọn -> nền khác 2 nút còn lại.
  const monthBg0 = await page.getByTestId('layout-month').evaluate((el) => getComputedStyle(el).backgroundColor);
  const agendaBg0 = await page.getByTestId('layout-agenda').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(monthBg0).not.toBe(agendaBg0);
  await expect(page.getByTestId('layout-month')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('layout-agenda')).toHaveAttribute('aria-selected', 'false');

  // Layout Agenda -> nhãn "Hôm nay" + nền nút đổi chỗ được chọn.
  await page.getByTestId('layout-agenda').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringContaining('Hôm nay')]));
  const monthBg1 = await page.getByTestId('layout-month').evaluate((el) => getComputedStyle(el).backgroundColor);
  const agendaBg1 = await page.getByTestId('layout-agenda').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(agendaBg1).not.toBe(monthBg1);
  expect(agendaBg1).toBe(monthBg0); // nút đang chọn luôn cùng 1 màu nền accent.
  await expect(page.getByTestId('layout-agenda')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('layout-month')).toHaveAttribute('aria-selected', 'false');

  // Ngôn ngữ EN -> nhãn tab tiếng Anh.
  await page.getByTestId('lang').selectOption('en');
  await expect(page.getByTestId('tab-events')).toHaveText('Events');
  await expect(page.getByTestId('tab-preview')).toHaveText('Preview');

  // 12h bật -> agenda có AM/PM.
  await page.getByTestId('hour12').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringMatching(/AM|PM/)]));

  // Bố cục Tháng có dòng âm lịch mặc định; tắt âm lịch -> hết dòng "Lunar"/"Âm lịch".
  await page.getByTestId('layout-month').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining([expect.stringContaining('Lunar')]));
  await page.getByTestId('lunar').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .not.toEqual(expect.arrayContaining([expect.stringContaining('Lunar')]));

  // Trở về tiếng Việt cho phần còn lại.
  await page.getByTestId('lang').selectOption('vi');

  // Xuất JSON.
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-json').click()]);
  await expect(page.getByTestId('toast')).toContainText('Đã tải file sao lưu');
  const backupContent = await readDownload(download);
  const dir = mkdtempSync(join(tmpdir(), 'lichkhoa-'));
  const backupPath = join(dir, 'backup.json');
  writeFileSync(backupPath, backupContent);

  // Nhập file hỏng -> toast lỗi, dữ liệu còn nguyên.
  const badFile = join(dir, 'bad.json');
  writeFileSync(badFile, 'khong-phai-json');
  await page.getByTestId('import-json').setInputFiles(badFile);
  await expect(page.getByTestId('toast')).toContainText('Tệp sao lưu không phải JSON hợp lệ');

  // Xóa toàn bộ dữ liệu.
  await page.getByTestId('wipe').click();
  await page.getByTestId('tab-events').click();
  await expect(page.getByTestId('ev-item')).toHaveCount(0);
  await page.getByTestId('seg-todos').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(0);

  // Nhập lại file sao lưu hợp lệ -> mọi thứ trở lại.
  await page.getByTestId('tab-preview').click();
  await page.getByTestId('import-json').setInputFiles(backupPath);
  await expect(page.getByTestId('toast')).toContainText('Đã khôi phục dữ liệu');

  await page.getByTestId('tab-events').click();
  await expect(page.getByTestId('ev-item')).toHaveCount(1);
  await page.getByTestId('seg-todos').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(1);
});

test('T-4.7 #4: Xóa dữ liệu dọn ảnh nền — chọn lại Ảnh sau đó không hiện ảnh cũ', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');
  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  await expect.poll(() => readBgKey(page)).toBe(undefined);

  // Chọn ảnh nền -> IndexedDB có bg, preview đổi.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('bg-file').setInputFiles(path.join(__dirname, '..', 'fixtures', 'photo-4000x3000.jpg'));
  await expect(page.getByTestId('bg-kind-photo')).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => readBgKey(page)).not.toBe(undefined);

  // Xóa dữ liệu -> BG_KEY rỗng/null.
  await page.getByTestId('tab-preview').click();
  await page.getByTestId('wipe').click();
  await expect.poll(() => readBgKey(page)).toBeFalsy();

  // Chọn lại nền Ảnh (không tải file mới) -> không được hiện ảnh cũ (preview giống hệt lúc
  // vừa chọn "Ảnh" trên trạng thái mặc định, không có bg).
  await page.getByTestId('tab-design').click();
  await page.getByTestId('bg-kind-photo').click();
  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  const hashAfterWipe = await previewHash(page);

  await page.reload();
  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  await page.getByTestId('tab-design').click();
  await page.getByTestId('bg-kind-photo').click();
  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  const hashFreshNoPhoto = await previewHash(page);

  expect(hashAfterWipe).toBe(hashFreshNoPhoto);
});

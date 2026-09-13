import { test, expect } from '@playwright/test';

async function openNoteTab(page: import('@playwright/test').Page) {
  // ?test=1: wallpaper.ts chỉ phơi window.__lastOps khi có cờ này (tránh rò rỉ ở bản production).
  await page.goto('/?test=1');
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-note').click();
}

test('Ghi chú: nhiều ghi chú, ghim 1 cái + hiện trên hình nền, còn qua reload', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await openNoteTab(page);

  // Ghi chú 1.
  await page.getByTestId('add-note').click();
  await page.getByTestId('nt-title').fill('Ghi chú 1');
  await page.getByTestId('nt-body').fill('Nội dung 1');
  await page.getByTestId('nt-save').click();

  // Ghi chú 2, ghim.
  await page.getByTestId('add-note').click();
  await page.getByTestId('nt-title').fill('Ghi chú 2');
  await page.getByTestId('nt-body').fill('Nội dung 2');
  await page.getByTestId('nt-pin').click();
  await page.getByTestId('nt-save').click();

  await expect(page.getByTestId('note-item')).toHaveCount(2);
  // Ghim lên đầu danh sách + nhãn "Ghim".
  await expect(page.getByTestId('note-item').nth(0)).toContainText('Ghi chú 2');
  await expect(page.getByTestId('note-item').nth(0).locator('.note-item-pin')).toBeVisible();

  // Hiện trên hình nền.
  await page.getByTestId('note-show').click();

  // Dựng hình nền qua tab Xem trước để đọc window.__lastOps.
  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  const ops = await page.waitForFunction(() => (window as unknown as { __lastOps?: unknown[] }).__lastOps);
  const opsTexts = await page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
  void ops;
  // Ghi chú T-2.12: nếu T-2.11 chưa vẽ dòng tiêu đề riêng, kiểm nội dung ghi chú 2 thay vì tiêu đề.
  const hasNote2 = opsTexts.some((tx) => tx.includes('Ghi chú 2') || tx.includes('Nội dung 2'));
  const hasNote1 = opsTexts.some((tx) => tx.includes('Ghi chú 1') || tx.includes('Nội dung 1'));
  expect(hasNote2).toBe(true);
  expect(hasNote1).toBe(false);

  // Reload: ghi chú vẫn còn (IndexedDB).
  await page.reload();
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-note').click();
  await expect(page.getByTestId('note-item')).toHaveCount(2);
});

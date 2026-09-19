import { test, expect } from '@playwright/test';

/** Sao chép + Đặt hình nền một chạm (T-4.3). Chỉ chromium: Playwright không cấp quyền
 * `clipboard-write` trên webkit và `navigator.clipboard.read()` không dùng được để kiểm tra. */

async function waitReady(page: import('@playwright/test').Page) {
  await page.goto('/?test=1');
  await expect(page.getByTestId('save')).toBeEnabled();
}

/** Đọc trực tiếp bản ghi state đã lưu trong IndexedDB (không chờ debounce 300ms).
 * Chép từ tests/e2e/m7-reminder.spec.ts (T-7.6). */
async function readSavedState(
  page: import('@playwright/test').Page,
): Promise<{ shortcutName?: string } | undefined> {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open('keyval-store');
        req.onerror = () => resolve(undefined);
        req.onsuccess = () => {
          const tx = req.result.transaction('keyval', 'readonly');
          const getReq = tx.objectStore('keyval').get('lichkhoa:state');
          getReq.onerror = () => resolve(undefined);
          getReq.onsuccess = () => {
            const s = getReq.result as { shortcutName?: string } | undefined;
            req.result.close();
            resolve(s);
          };
        };
      }),
  );
}

test.describe('Sao chép + Đặt hình nền (T-4.3)', () => {
  test('Sao chép ghi mục image/png vào clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write chỉ cấp quyền được trên chromium trong Playwright.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await waitReady(page);

    await page.getByTestId('copy').click();

    await expect
      .poll(() =>
        page.evaluate(async () => {
          const list = await navigator.clipboard.read();
          return list.flatMap((i) => i.types);
        }),
      )
      .toContain('image/png');
  });

  test('Đặt hình nền: __lastNav bắt đầu bằng shortcuts://run-shortcut?name=DatHinhNen&input=clipboard', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write chỉ cấp quyền được trên chromium trong Playwright.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await waitReady(page);

    await page.getByTestId('set-wallpaper').click();

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav))
      .toBe('shortcuts://run-shortcut?name=DatHinhNen&input=clipboard');
  });

  test('tên Shortcut có dấu cách/tiếng Việt được encode trong __lastNav', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write chỉ cấp quyền được trên chromium trong Playwright.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await waitReady(page);

    const name = 'Đặt hình nền của tôi';
    await page.getByTestId('shortcut-name').fill(name);
    await page.getByTestId('set-wallpaper').click();

    const expected = `shortcuts://run-shortcut?name=${encodeURIComponent(name)}&input=clipboard`;
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav))
      .toBe(expected);
  });

  test('Đặt hình nền: trạng thái đã được ghi xuống IndexedDB ngay, không chờ debounce 300ms (T-7.6)', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write chỉ cấp quyền được trên chromium trong Playwright.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await waitReady(page);

    const name = 'TenMoiChuaFlush';
    await page.getByTestId('shortcut-name').fill(name);
    await page.getByTestId('set-wallpaper').click();

    // __lastNav chỉ được gán sau khi flush() đã await xong (onSetWallpaper).
    // Đợi nó xuất hiện rồi đọc IndexedDB ngay — không chờ thêm 300ms debounce nào nữa.
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav))
      .toContain(encodeURIComponent(name));
    const saved = await readSavedState(page);
    expect(saved?.shortcutName).toBe(name);
  });

  test('Sao chép thất bại: hiện toast hướng dẫn thay thế, không mở Shortcut', async ({ page }) => {
    // Không cấp quyền clipboard -> navigator.clipboard.write ném lỗi (hoặc không tồn tại) -> copyPng trả false.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    });
    await waitReady(page);

    await page.getByTestId('set-wallpaper').click();

    await expect(page.getByTestId('toast')).toContainText('Lưu ảnh');
    const nav = await page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav);
    expect(nav).toBeUndefined();
  });
});

import { test, expect } from '@playwright/test';

/** M4: sau lần tải đầu, mất mạng vẫn mở được app (service worker phục vụ app shell). D-013. */
test('offline: sau lần tải đầu, mở lại app vẫn dùng được', async ({ page, context, browserName }) => {
  await page.goto('/?test=1');
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) await navigator.serviceWorker.ready;
  });

  // Khẳng định app shell đã được cache (áp dụng cho cả chromium + webkit).
  // Workbox precache thêm `?__WB_REVISION__=…` vào key -> so khớp bỏ qua query string.
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const a = await caches.match('/', { ignoreSearch: true });
        const b = await caches.match('/index.html', { ignoreSearch: true });
        return Boolean(a || b);
      }),
    )
    .toBe(true);

  const url = page.url();

  if (browserName === 'webkit') {
    // D-013: `context.setOffline(true)` + `page.reload()` gây "WebKit encountered an internal
    // error" trên Playwright-WebKit (Windows), kể cả với SW active — tái hiện với app trống,
    // không liên quan LichKhoa (docs/DECISIONS.md D-013). Thử phương án khác trước khi bỏ qua:
    // `page.goto(url)` (điều hướng mới thay vì reload) — vẫn lỗi nội bộ tương tự trên máy này.
    await context.setOffline(true);
    let navError: unknown = null;
    try {
      await page.goto(url, { waitUntil: 'load' });
    } catch (e) {
      navError = e;
    }
    test.skip(
      navError !== null,
      'D-013: Playwright-WebKit lỗi nội bộ khi điều hướng offline (reload lẫn goto) — giới hạn engine, không phải lỗi app; xem docs/DECISIONS.md D-013 và bài thử tay iPhone (Chế độ máy bay).',
    );
    await expect(page.locator('body')).toBeVisible();
    return;
  }

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
  await expect(page.getByTestId('tab-preview')).toBeVisible();
});

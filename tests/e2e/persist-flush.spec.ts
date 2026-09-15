import { test } from '@playwright/test';

/** B-006: Ghi ngay dữ liệu chờ khi app bị ẩn/đóng (pagehide, visibilitychange=hidden). */

async function openTodos(page: import('@playwright/test').Page) {
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();
}

async function addTodo(page: import('@playwright/test').Page, text: string) {
  await page.getByTestId('todo-input').fill(text);
  await page.getByTestId('todo-add').click();
}

/** Đọc IndexedDB (keyval-store, key lichkhoa:state), chờ việc xuất hiện trong vòng timeout ms. */
async function waitForPersistedTodo(page: import('@playwright/test').Page, expectedText: string, timeout = 150) {
  await page.waitForFunction(
    (expected) =>
      new Promise<boolean>((resolve) => {
        const req = indexedDB.open('keyval-store');
        req.onerror = () => resolve(false);
        req.onsuccess = () => {
          const tx = req.result.transaction('keyval', 'readonly');
          const getReq = tx.objectStore('keyval').get('lichkhoa:state');
          getReq.onerror = () => resolve(false);
          getReq.onsuccess = () => {
            const state = getReq.result as { todos?: { text: string }[] } | undefined;
            req.result.close();
            if (!state?.todos) return resolve(false);
            resolve(state.todos.some((t) => t.text === expected));
          };
        };
      }),
    expectedText,
    { timeout, polling: 10 },
  );
}

test('pagehide: ghi ngay việc cần làm đang chờ vào IndexedDB trong vòng 150 ms', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  await addTodo(page, 'Việc khẩn cấp pagehide');

  // Ngay lập tức (< 300 ms debounce) bắn pagehide -> flush timer
  await page.evaluate(() => {
    window.dispatchEvent(new Event('pagehide'));
  });

  await waitForPersistedTodo(page, 'Việc khẩn cấp pagehide', 150);
});

test('visibilitychange (hidden): ghi ngay việc cần làm đang chờ vào IndexedDB trong vòng 150 ms', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  await addTodo(page, 'Việc khẩn cấp visibilitychange');

  // Giả document.visibilityState = 'hidden' rồi bắn visibilitychange ngay lập tức (< 300 ms debounce)
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  await waitForPersistedTodo(page, 'Việc khẩn cấp visibilitychange', 150);
});

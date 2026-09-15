import { test, expect } from '@playwright/test';

/** T-6.2: cử chỉ hàng to-do (vuốt trái, nhấn giữ kéo, phần Đã lưu trữ). */

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

async function openTodos(page: import('@playwright/test').Page) {
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();
}

async function addTodo(page: import('@playwright/test').Page, text: string) {
  await page.getByTestId('todo-input').fill(text);
  await page.getByTestId('todo-add').click();
}

/** `createStore` (src/ui/store.ts) ghi IndexedDB debounce 300ms sau mỗi dispatch (ngoài phạm vi
 * T-6.2, không sửa). Reload ngay sau thao tác có thể đọc lại state CŨ nếu bản ghi debounce chưa
 * chạy xong -> đây là race của TEST (gọi reload sớm), không phải mất dữ liệu thật (app không tự
 * reload). Chờ đúng thứ tự đã lưu (đọc thẳng IndexedDB, không sleep cố định) trước khi reload. */
async function waitForPersistedTodoOrder(page: import('@playwright/test').Page, expectedTexts: string[]) {
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
            const state = getReq.result as { todos?: { text: string; order: number }[] } | undefined;
            req.result.close();
            if (!state?.todos) return resolve(false);
            const order = [...state.todos].sort((a, b) => a.order - b.order).map((t) => t.text);
            resolve(JSON.stringify(order) === JSON.stringify(expected));
          };
        };
      }),
    expectedTexts,
    { timeout: 5000 },
  );
}

/** Vuốt trái một hàng (chuột/pointer): đủ xa để mở hẳn (>40% panel).
 * Trả về locator hàng bọc ngoài (`.todo-item-wrap`) để soi đúng 2 nút của hàng này
 * (mỗi hàng luôn có `todo-swipe-archive`/`todo-swipe-delete` trong DOM, dùng `.first()` sẽ trúng hàng khác). */
async function swipeLeft(
  page: import('@playwright/test').Page,
  row: import('@playwright/test').Locator,
): Promise<import('@playwright/test').Locator> {
  const box = (await row.boundingBox())!;
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width - 10, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 150, y, { steps: 10 });
  await page.mouse.up();
  return row.locator('xpath=../..');
}

test('Vuốt trái: Lưu trữ/Xóa + Hoàn tác, phần Đã lưu trữ', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  await addTodo(page, 'Việc A');
  await addTodo(page, 'Việc B');
  await expect(page.getByTestId('todo-item')).toHaveCount(2);

  // Vuốt trái hàng đầu (Việc A) -> hiện 2 nút.
  const wrapA = await swipeLeft(page, page.getByTestId('todo-item').nth(0));
  await expect(wrapA.getByTestId('todo-swipe-archive')).toBeVisible();
  await expect(wrapA.getByTestId('todo-swipe-delete')).toBeVisible();

  // Xóa -> việc biến mất; bấm Hoàn tác -> trở lại.
  await wrapA.getByTestId('todo-swipe-delete').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await page.getByTestId('toast-undo').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(2);
  await expect(page.getByTestId('todo-item').filter({ hasText: 'Việc A' })).toBeVisible();

  // Lưu trữ Việc B -> biến mất khỏi danh sách và khỏi __lastOps (bố cục Việc).
  const rowB = page.getByTestId('todo-item').filter({ hasText: 'Việc B' });
  const wrapB = await swipeLeft(page, rowB);
  await wrapB.getByTestId('todo-swipe-archive').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-archived-toggle')).toContainText('1');

  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-todo').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .not.toEqual(expect.arrayContaining([expect.stringContaining('Việc B')]));

  // Mở phần Đã lưu trữ -> vuốt -> Khôi phục -> trở lại danh sách.
  await page.getByTestId('tab-events').click();
  await openTodos(page);
  await page.getByTestId('todo-archived-toggle').click();
  const archivedRow = page.getByTestId('todo-archived-item');
  await expect(archivedRow).toHaveCount(1);
  const wrapArchived = await swipeLeft(page, archivedRow);
  await wrapArchived.getByTestId('todo-swipe-restore').click();
  await expect(page.getByTestId('todo-item').filter({ hasText: 'Việc B' })).toBeVisible();
  await expect(page.getByTestId('todo-item')).toHaveCount(2);
});

test('Nhấn giữ kéo sắp xếp: đổi thứ tự, __lastOps và reload giữ nguyên', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('B');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('C');

  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;

  // Nhấn giữ việc C ~600ms rồi kéo lên trên A.
  await page.mouse.move(boxC.x + boxC.width / 2, boxC.y + boxC.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(600);
  await page.mouse.move(boxA.x + boxA.width / 2, boxA.y + boxA.height / 2, { steps: 10 });
  await page.mouse.up();

  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');

  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-todo').click();
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining(['C', 'A', 'B']));
  const ops = await opsTexts(page);
  expect(ops.indexOf('C')).toBeLessThan(ops.indexOf('A'));
  expect(ops.indexOf('A')).toBeLessThan(ops.indexOf('B'));

  // Chờ debounce 300ms của store ghi xong thứ tự mới vào IndexedDB trước khi reload (tránh đọc
  // lại state cũ) — xem giải thích ở `waitForPersistedTodoOrder`.
  await waitForPersistedTodoOrder(page, ['C', 'A', 'B']);
  await page.reload();
  await openTodos(page);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');
});

test('T-6.3 (#1): Hoàn tác sau Lưu trữ trả về danh sách chính, "Đã lưu trữ" biến mất', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  await addTodo(page, 'Việc A');
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  const wrap = await swipeLeft(page, page.getByTestId('todo-item').nth(0));
  await wrap.getByTestId('todo-swipe-archive').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByTestId('todo-archived-toggle')).toContainText('1');

  // Trước T-6.3 (#1): callback Hoàn tác gọi `restoreTodo` -> không làm gì (id vẫn còn trong state,
  // chỉ mang cờ `archived: true`) -> việc KHÔNG trở lại. Phải gọi `archiveTodo … archived: false`.
  await page.getByTestId('toast-undo').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-item').filter({ hasText: 'Việc A' })).toBeVisible();
  await expect(page.getByTestId('todo-archived-toggle')).toHaveCount(0);
});

test('T-6.3 (#2): vuốt tiếp một hàng đang mở không giật về 0', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  await addTodo(page, 'Việc A');

  const row = page.getByTestId('todo-item').nth(0);
  const wrap = await swipeLeft(page, row);
  await expect(wrap.getByTestId('todo-swipe-archive')).toBeVisible();
  const openBox = (await row.boundingBox())!; // x sau khi mở hẳn (~ -160px so với đóng)

  const wrapBox = (await wrap.boundingBox())!;
  const y = wrapBox.y + wrapBox.height / 2;
  await page.mouse.move(wrapBox.x + wrapBox.width - 10, y);
  await page.mouse.down();
  // Vuốt tiếp một khoảng nhỏ (~8px): trước T-6.3 (#2), dx bắt đầu lại từ 0 -> hàng giật về gần vị
  // trí đóng (x tăng vọt) rồi mới chạy tiếp theo ngón tay. Đúng: tiếp tục mượt từ vị trí đang mở.
  await page.mouse.move(wrapBox.x + wrapBox.width - 18, y);
  const midBox = (await row.boundingBox())!;
  await page.mouse.up();

  expect(midBox.x).toBeLessThanOrEqual(openBox.x + 5);
});

test('T-6.3 (#3): sau một lần kéo sắp xếp, chạm chữ ngay sau đó vẫn mở sửa', async ({ page }) => {
  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);

  const rows = page.getByTestId('todo-item');
  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;

  await page.mouse.move(boxC.x + boxC.width / 2, boxC.y + boxC.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(600);
  await page.mouse.move(boxA.x + boxA.width / 2, boxA.y + boxA.height / 2, { steps: 10 });
  await page.mouse.up();
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');

  // Chạm vào chữ ngay sau khi thả tay kéo -> phải mở sửa (không bị `suppressClickRef` kẹt nuốt oan).
  await rows.nth(0).getByTestId('todo-edit').click();
  await expect(rows.nth(0).locator('.todo-edit-input')).toBeVisible();
});

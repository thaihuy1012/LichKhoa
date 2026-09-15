import { test, expect } from '@playwright/test';

/** T-6.END: luồng chính M6 (SPEC v1.7 §6 M6) — vuốt trái Xóa/Lưu trữ + Hoàn tác/Khôi phục,
 * "Đã lưu trữ", nhấn giữ kéo sắp xếp, xuất JSON có `archived`, reload giữ mọi thứ.
 * Học cách thao tác từ `tests/e2e/todo-gestures.spec.ts` (vuốt/kéo, chờ IndexedDB trước reload)
 * và `tests/e2e/m5-week.spec.ts` (đọc `__lastOps`), `tests/e2e/settings.spec.ts` (xuất JSON). */

type Op = { op: string; text?: string; weight?: number };

async function lastOps(page: import('@playwright/test').Page): Promise<Op[]> {
  return page.evaluate(() => (window as unknown as { __lastOps?: Op[] }).__lastOps ?? []);
}

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return (await lastOps(page)).map((o) => o.text).filter((t): t is string => !!t);
}

async function waitPreviewRendered(page: import('@playwright/test').Page) {
  const preview = page.getByTestId('preview');
  await expect
    .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
    .toBe(1284);
}

async function openTodos(page: import('@playwright/test').Page) {
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();
}

async function addTodo(page: import('@playwright/test').Page, text: string, due?: string) {
  await page.getByTestId('todo-input').fill(text);
  if (due) await page.getByTestId('todo-due').fill(due);
  await page.getByTestId('todo-add').click();
}

/** `createStore` (src/ui/store.ts) ghi IndexedDB debounce 300ms sau mỗi dispatch — chờ đúng thứ tự
 * đã lưu (đọc thẳng IndexedDB, không sleep cố định) trước khi reload, xem `todo-gestures.spec.ts`. */
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
            const state = getReq.result as { todos?: { text: string; order: number; archived?: boolean }[] } | undefined;
            req.result.close();
            if (!state?.todos) return resolve(false);
            const order = [...state.todos]
              .filter((t) => !t.archived)
              .sort((a, b) => a.order - b.order)
              .map((t) => t.text);
            resolve(JSON.stringify(order) === JSON.stringify(expected));
          };
        };
      }),
    expectedTexts,
    { timeout: 5000 },
  );
}

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

test('T-6.END luồng chính: vuốt trái Xóa/Hoàn tác, Lưu trữ/Khôi phục ẩn khỏi hình nền, xuất JSON archived, kéo sắp xếp, reload giữ mọi thứ', async ({
  page,
}) => {
  await page.goto('/?test=1');
  const todayIso = await page.evaluate(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // --- Phase 1: Lưu trữ ẩn khỏi hình nền (bố cục Việc + Tuần), Khôi phục, xuất JSON có `archived`.
  await openTodos(page);
  await addTodo(page, 'ViecLuuTru', todayIso);
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-todo').click();
  await waitPreviewRendered(page);
  await expect.poll(async () => opsTexts(page), { timeout: 5000 }).toEqual(
    expect.arrayContaining(['ViecLuuTru']),
  );

  await page.getByTestId('layout-week').click();
  await waitPreviewRendered(page);
  await expect.poll(async () => opsTexts(page), { timeout: 5000 }).toEqual(
    expect.arrayContaining(['ViecLuuTru']),
  );

  await openTodos(page);
  const wrapLuuTru = await swipeLeft(page, page.getByTestId('todo-item'));
  await wrapLuuTru.getByTestId('todo-swipe-archive').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByTestId('todo-archived-toggle')).toContainText('1');

  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-todo').click();
  await waitPreviewRendered(page);
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .not.toEqual(expect.arrayContaining(['ViecLuuTru']));

  await page.getByTestId('layout-week').click();
  await waitPreviewRendered(page);
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .not.toEqual(expect.arrayContaining(['ViecLuuTru']));

  // Xuất JSON trong khi đang lưu trữ -> có trường `archived: true`.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-json').click(),
  ]);
  const backup = JSON.parse((await readDownload(download)).toString('utf-8')) as {
    state: { todos: { text: string; archived?: boolean }[] };
  };
  const exportedTodo = backup.state.todos.find((t) => t.text === 'ViecLuuTru');
  expect(exportedTodo?.archived).toBe(true);

  // Khôi phục từ "Đã lưu trữ" -> trở lại danh sách.
  await openTodos(page);
  await page.getByTestId('todo-archived-toggle').click();
  const archivedRow = page.getByTestId('todo-archived-item');
  await expect(archivedRow).toHaveCount(1);
  const wrapArchived = await swipeLeft(page, archivedRow);
  await wrapArchived.getByTestId('todo-swipe-restore').click();
  await expect(page.getByTestId('todo-item').filter({ hasText: 'ViecLuuTru' })).toBeVisible();

  // Dọn để phần 2 chỉ còn đúng 3 việc như tiêu chí nghiệm thu.
  const wrapCleanup = await swipeLeft(page, page.getByTestId('todo-item').filter({ hasText: 'ViecLuuTru' }));
  await wrapCleanup.getByTestId('todo-swipe-delete').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(0);

  // --- Phase 2: thêm 3 việc -> vuốt trái Xóa + Hoàn tác -> nhấn giữ kéo sắp xếp -> reload.
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);
  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('B');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('C');

  const wrapA = await swipeLeft(page, rows.nth(0));
  await wrapA.getByTestId('todo-swipe-delete').click();
  await expect(rows).toHaveCount(2);
  await page.getByTestId('toast-undo').click();
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('B');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('C');

  // Nhấn giữ kéo việc thứ 3 (C) lên đầu.
  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;
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
  await waitPreviewRendered(page);
  await expect
    .poll(async () => opsTexts(page), { timeout: 5000 })
    .toEqual(expect.arrayContaining(['C', 'A', 'B']));
  const ops = await opsTexts(page);
  expect(ops.indexOf('C')).toBeLessThan(ops.indexOf('A'));
  expect(ops.indexOf('A')).toBeLessThan(ops.indexOf('B'));

  await waitForPersistedTodoOrder(page, ['C', 'A', 'B']);
  await page.reload();
  await openTodos(page);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');
  await expect(page.getByTestId('todo-item')).toHaveCount(3);
  await expect(page.getByTestId('todo-archived-toggle')).toHaveCount(0);
});

import { test, expect, type Page, type CDPSession } from '@playwright/test';

/** B-007 / SC-002: cử chỉ hàng to-do bằng CHẠM THẬT (chromium + CDP `Input.dispatchTouchEvent`),
 * mô phỏng iPhone gần đúng hơn chuột (pointerType: 'touch', tôn trọng `touch-action`, có thể bắn
 * `pointercancel` như trình duyệt thật) — `todo-gestures.spec.ts`/`m6-todo-gestures.spec.ts` chỉ
 * kéo bằng chuột nên không bắt được lỗi này (B-007). */

test.use({ hasTouch: true });

async function openTodos(page: Page) {
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();
}

async function addTodo(page: Page, text: string) {
  await page.getByTestId('todo-input').fill(text);
  await page.getByTestId('todo-add').click();
}

async function opsTexts(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

async function touchPoint(
  client: CDPSession,
  type: 'touchStart' | 'touchMove' | 'touchEnd',
  x: number,
  y: number,
) {
  await client.send('Input.dispatchTouchEvent', {
    type,
    touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 5, radiusY: 5, force: 1 }],
  });
}

test('Chạm thật (CDP): nhấn giữ ~600ms rồi kéo dọc đổi thứ tự, hàng nổi/dịch không chồng nhau', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP Input.dispatchTouchEvent chỉ dùng được trên chromium');

  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('B');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('C');

  const client = await page.context().newCDPSession(page);

  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;
  const xC = boxC.x + boxC.width / 2;
  const yC = boxC.y + boxC.height / 2;
  const xA = boxA.x + boxA.width / 2;
  const yA = boxA.y + boxA.height / 2;

  await touchPoint(client, 'touchStart', xC, yC);
  await page.waitForTimeout(600); // qua LONG_PRESS_MS=450, gần như đứng yên như ngón tay giữ thật

  // Kéo dọc lên trên A theo nhiều bước nhỏ (giống ngón tay thật, không nhảy cóc).
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const y = yC + ((yA - yC) * i) / steps;
    await touchPoint(client, 'touchMove', xC, y);
    await page.waitForTimeout(30);
  }

  // Giữa chừng kéo: đúng một hàng đang "nổi" (kéo) và hàng bên dưới nó không được chồng lên nhau
  // (khác iPhone: trước khi sửa, `pointercancel` hủy kéo giữa chừng nên không hàng nào nổi).
  const draggingRow = page.locator('.todo-item-dragging');
  await expect(draggingRow).toHaveCount(1);
  const midBoxDragged = (await draggingRow.boundingBox())!;
  const midBoxA = (await rows.nth(0).boundingBox())!;
  const overlapY =
    Math.min(midBoxDragged.y + midBoxDragged.height, midBoxA.y + midBoxA.height) -
    Math.max(midBoxDragged.y, midBoxA.y);
  expect(overlapY).toBeLessThan(Math.min(midBoxDragged.height, midBoxA.height) * 0.5);

  await touchPoint(client, 'touchEnd', xA, yA);

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
});

/** SC-002 (Chủ dự án): trên iPhone, các nút cũ trong hàng (▲▼×, tick, chữ) CŨNG không hoạt động —
 * hồi quy do bộ cử chỉ T-6.2/T-6.3 bọc cả hàng nuốt mất click của nút con khi chạm có xê dịch nhẹ. */
test('Chạm thật (CDP): chạm nút ▲▼×/tick/chữ trong hàng vẫn có tác dụng dù ngón tay xê dịch nhẹ', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP Input.dispatchTouchEvent chỉ dùng được trên chromium');

  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  const client = await page.context().newCDPSession(page);

  async function tapWithJitter(locator: import('@playwright/test').Locator, jitterPx = 4) {
    const box = (await locator.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await touchPoint(client, 'touchStart', x, y);
    await touchPoint(client, 'touchMove', x + jitterPx, y + jitterPx);
    await page.waitForTimeout(20);
    await touchPoint(client, 'touchEnd', x + jitterPx, y + jitterPx);
  }

  // Dùng vị trí (nth) thay vì `filter({hasText})` cho MỌI bước: một khi hàng vào chế độ sửa,
  // `.todo-edit-input` là <input> nên giá trị không còn nằm trong text content để `hasText` khớp lại
  // được (input value không tính vào textContent) — dò theo vị trí ổn định qua cả chuỗi thao tác.

  // ▼ trên B (index 1) -> A, C, B — nút không bị disable vì B/C cùng nhóm chưa xong.
  await tapWithJitter(rows.nth(1).getByTestId('todo-down'));
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');

  // ▲ trên B (giờ ở index 2) đưa lại về A, B, C.
  await tapWithJitter(rows.nth(2).getByTestId('todo-up'));
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('B');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('C');

  // tick hoàn thành A (index 0) -> A rời danh sách chính, sang nhóm "Đã xong" (thu gọn mặc định).
  await tapWithJitter(rows.nth(0).getByTestId('todo-toggle'));
  await expect(rows).toHaveCount(2); // B, C còn trong danh sách chính; A đang ẩn trong nhóm thu gọn
  await page.getByTestId('todo-done-toggle').click();
  await expect(rows).toHaveCount(3); // mở nhóm "Đã xong" -> B(0), C(1), A(2, done)
  await expect(rows.nth(2).getByTestId('todo-toggle')).toHaveClass(/todo-toggle-done/);

  // chạm chữ C (index 1) -> mở sửa (nút × của hàng vẫn còn trong DOM khi đang sửa, xem JSX SwipeRow).
  await tapWithJitter(rows.nth(1).getByTestId('todo-edit'));
  const editInput = page.locator('.todo-edit-input');
  await expect(editInput).toBeVisible();
  await expect(editInput).toHaveValue('C');

  // × xóa C (index 1, vẫn đúng hàng dù đang sửa) -> còn B, A.
  await tapWithJitter(rows.nth(1).getByTestId('todo-del'));
  await expect(page.getByTestId('todo-item')).toHaveCount(2);
});

/** SC-002 — nguyên nhân gốc xác nhận: giữ tay ≥ LONG_PRESS_MS (450ms) KHÔNG di chuyển trên nút ▼
 * (trước sửa) bị `canDrag` (không phân biệt target) coi là mở đầu kéo sắp xếp -> `setPointerCapture`
 * + `suppressClickRef=true` -> click thật của nút bị nuốt, thứ tự KHÔNG đổi. Test này KHÔNG cần vuốt
 * — chỉ giữ yên rồi thả — cô lập đúng cơ chế bị nuốt-click, khác test chạm nhanh (đã qua) ở trên. */
test('Chạm thật (CDP): giữ nút ▼ hơi lâu (qua ngưỡng nhấn giữ) không di chuyển vẫn đổi thứ tự', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP Input.dispatchTouchEvent chỉ dùng được trên chromium');

  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);

  const rows = page.getByTestId('todo-item');
  const client = await page.context().newCDPSession(page);

  const downBtn = rows.filter({ hasText: 'B' }).getByTestId('todo-down');
  const box = (await downBtn.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await touchPoint(client, 'touchStart', x, y);
  await page.waitForTimeout(600); // qua LONG_PRESS_MS=450, đứng yên tuyệt đối (không vuốt/kéo)
  await touchPoint(client, 'touchEnd', x, y);

  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');
});

/** SC-002 lượt 2 — triệu chứng (1) "2 việc chồng lên nhau và không nhìn thấy": boundingBox KHÔNG
 * tính phần bị cắt (`overflow: hidden`), nên kiểm bằng hit-test thật `elementFromPoint` tại tâm hình
 * hiển thị của hàng kéo (C) và hàng nhường chỗ (A): điểm đó phải thuộc đúng hàng ấy. */
async function rowTextAtCenterOf(page: Page, rowText: string): Promise<string | null> {
  return page.evaluate((text) => {
    const edits = Array.from(document.querySelectorAll('[data-testid="todo-edit"]'));
    const edit = edits.find((e) => e.textContent === text);
    const row = edit?.closest('[data-testid="todo-item"]');
    if (!row) return null;
    const r = row.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const wrap = hit?.closest('.todo-item-wrap');
    return wrap?.querySelector('[data-testid="todo-edit"]')?.textContent ?? null;
  }, rowText);
}

test('Chạm thật (CDP): giữa lúc kéo, hàng kéo và hàng nhường chỗ đều NHÌN THẤY (không bị cắt mất)', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP Input.dispatchTouchEvent chỉ dùng được trên chromium');

  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);
  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  const client = await page.context().newCDPSession(page);

  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;
  const x = boxC.x + boxC.width / 2;
  const yC = boxC.y + boxC.height / 2;
  const yA = boxA.y + boxA.height / 2;

  await touchPoint(client, 'touchStart', x, yC);
  await page.waitForTimeout(600);
  for (let i = 1; i <= 10; i++) {
    await touchPoint(client, 'touchMove', x, yC + ((yA - yC) * i) / 10);
    await page.waitForTimeout(30);
  }

  // Trước sửa: transform nằm trên `.todo-item-inner` bên trong `.todo-item-wrap {overflow:hidden}` ->
  // hàng C kéo ra khỏi khung của chính nó bị cắt, hàng A dịch xuống cũng bị cắt -> hit-test trúng
  // khung trống của hàng khác.
  expect(await rowTextAtCenterOf(page, 'C')).toBe('C');
  expect(await rowTextAtCenterOf(page, 'A')).toBe('A');
  expect(await rowTextAtCenterOf(page, 'B')).toBe('B');

  await touchPoint(client, 'touchEnd', x, yA);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');
});

/** SC-002 lượt 2 — mô phỏng ĐÚNG chuỗi sự kiện Safari iOS bằng `dispatchEvent` trong trang (CDP của
 * chromium không tái hiện được hành vi WebKit iOS): WebKit hủy luồng POINTER (`pointercancel`) khi
 * một cử chỉ gốc của UIKit (cuộn, nhấn giữ hệ thống) giành ngón tay, nhưng luồng TOUCH vẫn tiếp tục
 * (`touchmove`… rồi `touchend`, hoặc `touchcancel`). Code chỉ nghe pointer -> kéo bị hủy, thứ tự như cũ
 * = đúng triệu chứng Chủ dự án báo. */
async function installSyntheticTouch(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    if (typeof Touch !== 'function' || typeof TouchEvent !== 'function') return false;
    try {
      new Touch({ identifier: 0, target: document.body, clientX: 0, clientY: 0 });
    } catch {
      return false; // Playwright WebKit (Windows): `new Touch` -> "Illegal constructor"
    }
    let target: Element | null = null;
    const id = 7;
    const mk = (x: number, y: number) =>
      new Touch({ identifier: id, target: target!, clientX: x, clientY: y, pageX: x, pageY: y, radiusX: 5, radiusY: 5, force: 1 });
    const ptr = (type: string, x: number, y: number) =>
      target!.dispatchEvent(
        new PointerEvent(type, {
          pointerId: id,
          pointerType: 'touch',
          isPrimary: true,
          clientX: x,
          clientY: y,
          buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
          bubbles: true,
          cancelable: type !== 'pointercancel',
          composed: true,
        }),
      );
    // Trả về `false` nếu listener đã gọi preventDefault() (= trình duyệt KHÔNG được cuộn).
    const tch = (type: string, x: number, y: number, active: boolean) => {
      const t = mk(x, y);
      return target!.dispatchEvent(
        new TouchEvent(type, {
          touches: active ? [t] : [],
          targetTouches: active ? [t] : [],
          changedTouches: [t],
          bubbles: true,
          cancelable: type !== 'touchcancel',
          composed: true,
        }),
      );
    };
    (window as unknown as { __syn: unknown }).__syn = {
      down(sel: string, text: string | null, x: number, y: number) {
        const all = Array.from(document.querySelectorAll(sel));
        target =
          text === null
            ? all[0]
            : (all.find(
                (e) =>
                  e.closest('[data-testid="todo-item"]')?.querySelector('[data-testid="todo-edit"]')?.textContent === text,
              ) ?? null);
        ptr('pointerdown', x, y);
        return tch('touchstart', x, y, true);
      },
      move(x: number, y: number) {
        ptr('pointermove', x, y);
        return tch('touchmove', x, y, true);
      },
      touchMoveOnly: (x: number, y: number) => tch('touchmove', x, y, true),
      pointerCancel: (x: number, y: number) => ptr('pointercancel', x, y),
      touchEndOnly: (x: number, y: number) => tch('touchend', x, y, false),
      touchCancel: (x: number, y: number) => tch('touchcancel', x, y, false),
    };
    return true;
  });
}

type Syn = {
  down: (sel: string, text: string | null, x: number, y: number) => boolean;
  move: (x: number, y: number) => boolean;
  touchMoveOnly: (x: number, y: number) => boolean;
  pointerCancel: (x: number, y: number) => void;
  touchEndOnly: (x: number, y: number) => boolean;
  touchCancel: (x: number, y: number) => boolean;
};

async function syn<K extends keyof Syn>(page: Page, fn: K, ...args: Parameters<Syn[K]>): Promise<ReturnType<Syn[K]>> {
  return page.evaluate(
    ([f, a]) => {
      const s = (window as unknown as { __syn: Record<string, (...x: unknown[]) => unknown> }).__syn;
      return s[f as string](...(a as unknown[]));
    },
    [fn, args] as const,
  ) as Promise<ReturnType<Syn[K]>>;
}

async function dragCOverAWithIosCancel(page: Page, ending: 'touchend' | 'touchcancel') {
  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);
  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(3);
  test.skip(!(await installSyntheticTouch(page)), 'trình duyệt không có constructor Touch/TouchEvent');

  const boxC = (await rows.nth(2).boundingBox())!;
  const boxA = (await rows.nth(0).boundingBox())!;
  const x = boxC.x + boxC.width / 2;
  const yC = boxC.y + boxC.height / 2;
  const yA = boxA.y + boxA.height / 2;
  const at = (i: number) => yC + ((yA - yC) * i) / 10;

  await syn(page, 'down', '[data-testid="todo-edit"]', 'C', x, yC);
  await page.waitForTimeout(600); // nhấn giữ qua LONG_PRESS_MS
  const prevented: boolean[] = [];
  for (let i = 1; i <= 3; i++) {
    prevented.push(!(await syn(page, 'move', x, at(i))));
    await page.waitForTimeout(20);
  }
  await syn(page, 'pointerCancel', x, at(3)); // WebKit iOS: cử chỉ gốc giành luồng pointer
  for (let i = 4; i <= 10; i++) {
    prevented.push(!(await syn(page, 'touchMoveOnly', x, at(i))));
    await page.waitForTimeout(20);
  }
  // Mọi touchmove khi đang kéo phải bị chặn (preventDefault) — nếu không iOS sẽ cuộn trang.
  expect(prevented).toEqual(Array(10).fill(true));
  if (ending === 'touchend') await syn(page, 'touchEndOnly', x, yA);
  else await syn(page, 'touchCancel', x, yA);

  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('C');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('A');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('B');
  await expect(page.locator('.todo-item-dragging')).toHaveCount(0);
}

test('Chuỗi sự kiện iOS: pointercancel giữa lúc kéo, touch vẫn tiếp tục rồi touchend -> vẫn đổi thứ tự C,A,B', async ({
  page,
}) => {
  await dragCOverAWithIosCancel(page, 'touchend');
});

test('Chuỗi sự kiện iOS: kéo kết thúc bằng touchcancel (hệ thống giành ngón tay) -> áp thứ tự đang xem trước', async ({
  page,
}) => {
  await dragCOverAWithIosCancel(page, 'touchcancel');
});

test('Chuỗi sự kiện iOS: chạm nút ▼ xê dịch ngang 5px — touchmove KHÔNG bị preventDefault (không làm iOS bỏ click)', async ({
  page,
}) => {
  await page.goto('/?test=1');
  await openTodos(page);
  for (const text of ['A', 'B', 'C']) await addTodo(page, text);
  await expect(page.getByTestId('todo-item')).toHaveCount(3);
  test.skip(!(await installSyntheticTouch(page)), 'trình duyệt không có constructor Touch/TouchEvent');

  const box = (await page.getByTestId('todo-item').nth(1).getByTestId('todo-down').boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await syn(page, 'down', '[data-testid="todo-down"]', 'B', x, y);
  const notPrevented = await syn(page, 'move', x + 5, y);
  await syn(page, 'touchEndOnly', x + 5, y);
  expect(notPrevented).toBe(true);
});

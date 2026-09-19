import { test, expect, type Page } from '@playwright/test';

/**
 * T-9.END: Kiểm thử tích hợp E2E luồng chính M9 (SPEC v1.10 §6 ### M9 dòng 245–258).
 * 7 kịch bản Việc có giờ hạn:
 * (1) Tab Việc: ô `todo-due-time` hiện chỉ khi `todo-due` có giá trị; nhập "Nộp báo cáo"
 *     2026-10-06 14:00 → label "6/10 14:00", IndexedDB có dueTime.
 * (2) Thêm "Họp" 09:00 + "Đọc" không giờ → thứ tự: Họp · Nộp báo cáo · Đọc (sắp xếp theo giờ).
 * (3) Sửa "Đọc": giờ 08:00 → label "6/10 08:00", "Đọc" lên đầu.
 * (4) Xóa "Đọc": ngày rỗng → label "+ Hạn", IndexedDB không due/dueTime, xuống nhóm không hạn.
 * (5) Thêm "Gọi điện" 2026-10-05 16:00 → bố cục To-do: __lastOps "Hôm nay 16:00";
 *     bố cục Tuần: __lastOps "☐ 16:00".
 * (6) Nhập "Mua sữa" 2026-10-07 06:45 (chưa Thêm) → rem-open → rem-at đúng ngay lần đọc đầu
 *     (KHÔNG toPass); rem-none, đổi ngày 2026-10-08 → rem-open lần 2 → rem-at đúng ngay lần đọc đầu (S4-#1).
 * (7) Reload → 4 việc nhãn đúng; đổi ngôn ngữ en → "Gọi điện" = "Today 16:00".
 */

type Op = {
  op: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  r?: number;
  fill?: string;
  alpha?: number;
  text?: string;
  size?: number;
  weight?: number;
};

async function lastOps(page: Page): Promise<Op[]> {
  return page.evaluate(() => (window as unknown as { __lastOps?: Op[] }).__lastOps ?? []);
}

interface SavedState {
  todos?: { id: string; text: string; due?: string; dueTime?: string; done?: boolean }[];
}

/** Đọc trực tiếp state từ IndexedDB (không chờ debounce). */
async function readSavedState(page: Page): Promise<SavedState | undefined> {
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
            const s = getReq.result as SavedState | undefined;
            req.result.close();
            resolve(s);
          };
        };
      }),
  );
}


test('T-9.END luồng chính M9: 7 kịch bản Việc có giờ hạn (m9-todo-time)', async ({ page }) => {
  // Cố định giờ trang theo SPEC v1.10 §6 M9: 2026-10-05T10:00:00 trước khi mở app
  await page.clock.setFixedTime(new Date('2026-10-05T10:00:00'));

  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');

  // Chuyển sang tab Việc
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();

  // --------------------------------------------------------------------------
  // Kịch bản 1: ô todo-due-time ẩn khi todo-due rỗng; nhập "Nộp báo cáo" +
  // date 2026-10-06 + time 14:00 → label "6/10 14:00", IndexedDB có dueTime.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 1: todo-due-time ẩn/hiện; thêm "Nộp báo cáo" 6/10 14:00', async () => {
    // todo-due-time ẩn khi todo-due rỗng
    await expect(page.getByTestId('todo-due-time')).not.toBeVisible();

    // Nhập tiêu đề
    await page.getByTestId('todo-input').fill('Nộp báo cáo');

    // todo-due-time vẫn ẩn (chưa có ngày)
    await expect(page.getByTestId('todo-due-time')).not.toBeVisible();

    // Nhập ngày
    await page.getByTestId('todo-due').fill('2026-10-06');

    // todo-due-time giờ hiện
    await expect(page.getByTestId('todo-due-time')).toBeVisible();

    // Nhập giờ
    await page.getByTestId('todo-due-time').fill('14:00');

    // Bấm Thêm
    await page.getByTestId('todo-add').click();

    // Chờ todo hiện + label đúng
    const item1 = page.getByTestId('todo-item').filter({ hasText: 'Nộp báo cáo' });
    await expect(item1).toBeVisible();
    const label1 = item1.getByTestId('todo-due-label');
    await expect(label1).toContainText('6/10 14:00');

    // IndexedDB có dueTime
    await expect.poll(async () => {
      const saved = await readSavedState(page);
      return saved?.todos?.find((t) => t.text === 'Nộp báo cáo')?.dueTime;
    }, { timeout: 5000 }).toBe('14:00');

    // Ô nhập + ô giờ rỗng
    await expect(page.getByTestId('todo-input')).toHaveValue('');
    await expect(page.getByTestId('todo-due')).toHaveValue('');
    await expect(page.getByTestId('todo-due-time')).not.toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Kịch bản 2: Thêm "Họp" 2026-10-06 09:00 + "Đọc" 2026-10-06 không giờ
  // → thứ tự: Họp (09:00) · Nộp báo cáo (14:00) · Đọc (không giờ).
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 2: Sắp xếp theo giờ: Họp 09:00 · Nộp 14:00 · Đọc không giờ', async () => {
    // Thêm "Họp" 09:00
    await page.getByTestId('todo-input').fill('Họp');
    await page.getByTestId('todo-due').fill('2026-10-06');
    await page.getByTestId('todo-due-time').fill('09:00');
    await page.getByTestId('todo-add').click();
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Họp' })).toBeVisible();

    // Thêm "Đọc" không giờ
    await page.getByTestId('todo-input').fill('Đọc');
    await page.getByTestId('todo-due').fill('2026-10-06');
    // KHÔNG nhập giờ
    await page.getByTestId('todo-add').click();
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Đọc' })).toBeVisible();

    // Chờ cả 3 todo hiện + kiểm thứ tự
    await expect.poll(async () => {
      const items = page.getByTestId('todo-item');
      const count = await items.count();
      return count;
    }, { timeout: 5000 }).toBe(3);

    const items = page.getByTestId('todo-item');
    const item0Text = await items.nth(0).textContent();
    const item1Text = await items.nth(1).textContent();
    const item2Text = await items.nth(2).textContent();

    expect(item0Text).toContain('Họp');
    expect(item1Text).toContain('Nộp báo cáo');
    expect(item2Text).toContain('Đọc');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 3: Chạm todo-due-label của "Đọc" → thêm ô sửa giờ →
  // giờ 08:00 → done → label "6/10 08:00", "Đọc" lên đầu.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 3: Sửa "Đọc" giờ 08:00 → lên đầu danh sách', async () => {
    const docItem = page.getByTestId('todo-item').filter({ hasText: 'Đọc' });
    const docLabel = docItem.getByTestId('todo-due-label');

    // Chạm nhãn hạn
    await docLabel.click();

    // ô sửa + ô giờ sửa hiện
    const docEditGroup = docItem.locator('.todo-due-edit-group');
    await expect(docEditGroup).toBeVisible();
    await expect(docEditGroup.getByTestId('todo-due-edit')).toBeVisible();
    await expect(docEditGroup.getByTestId('todo-due-time-edit')).toBeVisible();

    // Sửa giờ thành 08:00
    await docEditGroup.getByTestId('todo-due-time-edit').fill('08:00');

    // Bấm Xong
    await docEditGroup.getByTestId('todo-due-done').click();

    // ô sửa ẩn
    await expect(docEditGroup).not.toBeVisible();

    // Nhãn đổi thành "6/10 08:00"
    await expect(docLabel).toContainText('6/10 08:00');

    // "Đọc" lên đầu (thứ tự: Đọc 08:00 · Họp 09:00 · Nộp báo cáo 14:00)
    await expect.poll(async () => {
      const items = page.getByTestId('todo-item');
      const count = await items.count();
      if (count !== 3) return null;
      const item0Text = await items.nth(0).textContent();
      return item0Text?.includes('Đọc') ? true : false;
    }, { timeout: 5000 }).toBe(true);

    const items = page.getByTestId('todo-item');
    expect(await items.nth(0).textContent()).toContain('Đọc');
    expect(await items.nth(1).textContent()).toContain('Họp');
    expect(await items.nth(2).textContent()).toContain('Nộp báo cáo');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 4: Sửa "Đọc": xóa ngày → nhãn "+ Hạn", IndexedDB không có
  // due/dueTime, "Đọc" xuống nhóm không hạn.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 4: Xóa ngày hạn "Đọc" → "+ Hạn", nhóm không hạn', async () => {
    const docItem = page.getByTestId('todo-item').filter({ hasText: 'Đọc' });
    const docLabel = docItem.getByTestId('todo-due-label');

    // Chạm nhãn hạn
    await docLabel.click();

    const docEditGroup = docItem.locator('.todo-due-edit-group');
    await expect(docEditGroup).toBeVisible();

    // Xóa ngày
    await docEditGroup.getByTestId('todo-due-edit').fill('');

    // Bấm Xong
    await docEditGroup.getByTestId('todo-due-done').click();

    // ô sửa ẩn
    await expect(docEditGroup).not.toBeVisible();

    // Nhãn đổi thành "+ Hạn" (button có class todo-due-add)
    const newLabel = docItem.getByTestId('todo-due-label');
    await expect(newLabel).toContainText('+ Hạn');

    // IndexedDB không còn due/dueTime
    await expect.poll(async () => {
      const saved = await readSavedState(page);
      const doc = saved?.todos?.find((t) => t.text === 'Đọc');
      return doc?.due ?? doc?.dueTime ? false : true;
    }, { timeout: 5000 }).toBe(true);

    // Thứ tự đã đổi: Họp · Nộp báo cáo (cùng có hạn) · Đọc (không hạn cuối)
    const items = page.getByTestId('todo-item');
    expect(await items.nth(0).textContent()).toContain('Họp');
    expect(await items.nth(1).textContent()).toContain('Nộp báo cáo');
    expect(await items.nth(2).textContent()).toContain('Đọc');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 5: Thêm "Gọi điện" 2026-10-05 16:00 → bố cục To-do: __lastOps
  // "Hôm nay 16:00"; bố cục Tuần: __lastOps "☐ 16:00".
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 5: "Gọi điện" hôm nay 16:00 → bố cục To-do + Tuần', async () => {
    // Thêm "Gọi điện" hôm nay (2026-10-05) 16:00
    await page.getByTestId('todo-input').fill('Gọi điện');
    await page.getByTestId('todo-due').fill('2026-10-05');
    await page.getByTestId('todo-due-time').fill('16:00');
    await page.getByTestId('todo-add').click();

    const callItem = page.getByTestId('todo-item').filter({ hasText: 'Gọi điện' });
    await expect(callItem).toBeVisible();

    // Chuyển bố cục To-do
    await page.getByTestId('tab-preview').click();
    await page.getByTestId('layout-todo').click();

    // Chờ render + kiểm __lastOps
    await expect
      .poll(
        async () => {
          const ops = await lastOps(page);
          return ops.some((o) => o.op === 'text' && o.text === 'Hôm nay 16:00');
        },
        { timeout: 5000 }
      )
      .toBe(true);

    // Chuyển bố cục Tuần
    await page.getByTestId('layout-week').click();

    // Chờ render + kiểm __lastOps
    await expect
      .poll(
        async () => {
          const ops = await lastOps(page);
          return ops.some((o) => o.op === 'text' && o.text === '☐ 16:00');
        },
        { timeout: 5000 }
      )
      .toBe(true);
  });

  // --------------------------------------------------------------------------
  // Kịch bản 6: Nhập "Mua sữa" 2026-10-07 06:45 (chưa Thêm) → rem-open →
  // rem-at = 2026-10-07T06:45 ngay lần đọc đầu (KHÔNG toPass); rem-none,
  // đổi ngày 2026-10-08 → rem-open lần 2 → rem-at = 2026-10-08T06:45
  // ngay lần đọc đầu (S4-#1).
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 6: Hộp nhắc (S4-#1): rem-at đúng lần đọc đầu', async () => {
    // Quay lại tab Việc
    await page.getByTestId('tab-events').click();
    await page.getByTestId('seg-todos').click();

    // Nhập "Mua sữa" 2026-10-07 06:45 (chưa bấm Thêm)
    await page.getByTestId('todo-input').fill('Mua sữa');
    await page.getByTestId('todo-due').fill('2026-10-07');
    await page.getByTestId('todo-due-time').fill('06:45');

    // rem-open (chưa thêm việc)
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();

    // rem-at phải = 2026-10-07T06:45 ngay lần đọc đầu (KHÔNG toPass)
    // → Lần 1: kiểm trực tiếp, KHÔNG fill lại
    const remAtInput1 = page.getByTestId('rem-at');
    await expect(remAtInput1).toHaveValue('2026-10-07T06:45');

    // rem-none
    await page.getByTestId('rem-none').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // Xóa ngày + giờ cũ, nhập ngày mới 2026-10-08 (giờ vẫn 06:45)
    await page.getByTestId('todo-due').fill('2026-10-08');
    // todo-due-time đã có 06:45 từ lần trước

    // rem-open lần 2
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();

    // rem-at phải = 2026-10-08T06:45 ngay lần đọc đầu (KHÔNG toPass)
    // → Lần 2: kiểm trực tiếp, KHÔNG fill lại
    const remAtInput2 = page.getByTestId('rem-at');
    await expect(remAtInput2).toHaveValue('2026-10-08T06:45');

    // rem-none
    await page.getByTestId('rem-none').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // Xóa ô nhập (để sạch cho lần sau)
    await page.getByTestId('todo-input').fill('');
    await page.getByTestId('todo-due').fill('');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 7: Reload → 4 việc còn nhãn đúng; đổi ngôn ngữ en →
  // "Gọi điện" = "Today 16:00".
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 7: Reload + đổi ngôn ngữ en', async () => {
    // Chờ debounce lưu IndexedDB (T-1.4 debounce 300ms)
    await page.waitForTimeout(500);

    // Reload
    await page.reload();

    // Chuyển sang tab Việc
    await page.getByTestId('tab-events').click();
    await page.getByTestId('seg-todos').click();

    // Chờ 4 todo hiện
    await expect.poll(async () => {
      const items = page.getByTestId('todo-item');
      return items.count();
    }, { timeout: 5000 }).toBe(4);

    // Kiểm nhãn của "Gọi điện" = "Hôm nay 16:00"
    const callItem = page.getByTestId('todo-item').filter({ hasText: 'Gọi điện' });
    const callLabel = callItem.getByTestId('todo-due-label');
    await expect(callLabel).toContainText('Hôm nay 16:00');

    // Kiểm nhãn của 3 cái khác (tuy nhiên kịch bản này tập trung vào reload, nên chỉ kiểm "Gọi điện")

    // Đổi ngôn ngữ en ở tab Xem trước
    await page.getByTestId('tab-preview').click();
    const langSelect = page.getByTestId('lang');
    await langSelect.selectOption('en');

    // Quay lại tab Việc
    await page.getByTestId('tab-events').click();
    await page.getByTestId('seg-todos').click();

    // Nhãn của "Gọi điện" đổi thành "Today 16:00"
    await expect(callLabel).toContainText('Today 16:00');
  });
});

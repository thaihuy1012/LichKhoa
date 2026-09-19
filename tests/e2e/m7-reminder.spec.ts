import { test, expect } from '@playwright/test';

/**
 * T-7.END: Kiểm thử tích hợp E2E luồng chính M7 (SPEC v1.8 §6 ### M7 dòng 208).
 * 6 kịch bản nhắc trên iPhone qua Phím tắt (Báo thức + Lời nhắc):
 * (1) Thêm sự kiện có giờ (ngày mai 07:30) → mở sửa → rem-open → rem-at = <ngày mai>T07:30 → rem-reminder
 *     → __lastNav có name=ThemLoiNhac&input=text&text= và payload = '<ngày mai> 07:30\n<tên>'; Sheet đóng; danh sách đúng 1 sự kiện.
 * (2) Mở lại → rem-none → hộp đóng, __lastNav không đổi.
 * (3) Nhập việc "Mua sữa" (chưa bấm Thêm) → rem-open → đặt rem-at = now + 2 h → rem-alarm
 *     → việc xuất hiện trong danh sách, ô nhập rỗng, __lastNav có name=ThemBaoThuc, payload dòng 2 = Mua sữa.
 * (4) rem-at = now + 3 ngày → rem-alarm disabled, rem-reminder enabled; rem-at = now - 1 h → cả hai disabled.
 * (5) Ghi chú mới tiêu đề + nội dung 2 dòng → rem-reminder → payload 3 dòng, ghi chú đã lưu.
 * (6) Tab Xem trước đổi shortcut-alarm-name = Bao Thuc → reload giữ → __lastNav chứa name=Bao%20Thuc.
 */

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatLocalDateTime(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function formatIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function extractDecodedPayload(navUrl: string): string {
  const match = navUrl.match(/[?&]text=([^&]*)/);
  if (!match) {
    throw new Error(`URL không chứa tham số text=: ${navUrl}`);
  }
  return decodeURIComponent(match[1]);
}

async function getLastNav(page: import('@playwright/test').Page): Promise<string | undefined> {
  return page.evaluate(() => (window as unknown as { __lastNav?: string }).__lastNav);
}

test('T-7.END luồng chính M7: 6 kịch bản nhắc Phím tắt (Báo thức + Lời nhắc)', async ({ page }) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');

  // --------------------------------------------------------------------------
  // Kịch bản 1: Thêm sự kiện có giờ (ngày mai 07:30) → mở sửa → rem-open
  // → rem-at = <ngày mai>T07:30 → rem-reminder
  // → __lastNav có name=ThemLoiNhac&input=text&text= và payload = '<ngày mai> 07:30\n<tên>';
  // Sheet đóng; danh sách vẫn đúng 1 sự kiện.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 1: Sự kiện có giờ ngày mai 07:30 → Lời nhắc', async () => {
    await page.getByTestId('tab-events').click();

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowDateStr = formatIsoDate(tomorrow);
    const eventTitle = 'Họp chiến lược';

    // Thêm sự kiện có giờ (ngày mai 07:30)
    await page.getByTestId('add-event').click();
    await expect(page.locator('.sheet')).toBeVisible();
    await page.getByTestId('ev-title').fill(eventTitle);
    await page.getByTestId('ev-date').fill(tomorrowDateStr);
    await page.getByTestId('ev-start').fill('07:30');
    await page.getByTestId('ev-end').fill('08:30');
    await page.getByTestId('ev-save').click();
    await expect(page.locator('.sheet')).not.toBeVisible();

    // Mở sửa
    const evItem = page.getByTestId('ev-item').filter({ hasText: eventTitle });
    await expect(evItem).toBeVisible();
    await evItem.click();
    await expect(page.locator('.sheet')).toBeVisible();

    // rem-open
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();

    // rem-at = <ngày mai>T07:30
    const expectedRemAt = `${tomorrowDateStr}T07:30`;
    await expect(page.getByTestId('rem-at')).toHaveValue(expectedRemAt);

    // rem-reminder
    await page.getByTestId('rem-reminder').click();

    // __lastNav có name=ThemLoiNhac&input=text&text= và payload = '<ngày mai> 07:30\n<tên>'
    await expect.poll(() => getLastNav(page)).toContain('name=ThemLoiNhac&input=text&text=');
    const nav1 = (await getLastNav(page))!;
    const payload1 = extractDecodedPayload(nav1);
    expect(payload1).toBe(`${tomorrowDateStr} 07:30\n${eventTitle}`);

    // Sheet đóng; danh sách vẫn đúng 1 sự kiện
    await expect(page.locator('.sheet')).not.toBeVisible();
    await expect(page.getByTestId('ev-item')).toHaveCount(1);
  });

  // --------------------------------------------------------------------------
  // Kịch bản 2: Mở lại → rem-none → hộp đóng, __lastNav KHÔNG đổi.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 2: Mở lại → Không báo thức (rem-none) → hộp đóng, __lastNav không đổi', async () => {
    const eventTitle = 'Họp chiến lược';
    const evItem = page.getByTestId('ev-item').filter({ hasText: eventTitle });
    await evItem.click();
    await expect(page.locator('.sheet')).toBeVisible();

    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();

    const navBefore = await getLastNav(page);

    // rem-none
    await page.getByTestId('rem-none').click();

    // hộp đóng
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // __lastNav KHÔNG đổi
    const navAfter = await getLastNav(page);
    expect(navAfter).toBe(navBefore);

    // Đóng sheet sự kiện
    await page.getByTestId('ev-cancel').click();
    await expect(page.locator('.sheet')).not.toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Kịch bản 3: Nhập việc "Mua sữa" (chưa bấm Thêm) → rem-open → đặt rem-at = now + 2 h
  // → rem-alarm → việc xuất hiện trong danh sách, ô nhập rỗng,
  // __lastNav có name=ThemBaoThuc, payload dòng 2 = Mua sữa.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 3: Việc Mua sữa (chưa bấm Thêm) → now + 2 h → Báo thức', async () => {
    await page.getByTestId('seg-todos').click();

    // Nhập việc "Mua sữa" (chưa bấm Thêm)
    await page.getByTestId('todo-input').fill('Mua sữa');

    // rem-open
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();
    await expect(page.getByTestId('rem-at')).not.toHaveValue('');

    // đặt rem-at = now + 2 h
    const inTwoHours = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const atTwoHours = formatLocalDateTime(inTwoHours);
    await page.getByTestId('rem-at').fill(atTwoHours);
    await expect(page.getByTestId('rem-at')).toHaveValue(atTwoHours);

    // rem-alarm
    await expect(page.getByTestId('rem-alarm')).toBeEnabled();
    await page.getByTestId('rem-alarm').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // việc xuất hiện trong danh sách
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Mua sữa' });
    await expect(todoItem).toBeVisible();

    // ô nhập rỗng
    await expect(page.getByTestId('todo-input')).toHaveValue('');

    // __lastNav có name=ThemBaoThuc, payload dòng 2 = Mua sữa
    await expect.poll(() => getLastNav(page)).toContain('name=ThemBaoThuc');
    const nav3 = (await getLastNav(page))!;
    expect(nav3).toContain('input=text&text=');
    const payload3 = extractDecodedPayload(nav3);
    const lines3 = payload3.split('\n');
    expect(lines3.length).toBeGreaterThanOrEqual(2);
    expect(lines3[1]).toBe('Mua sữa');

    const [dPart, tPart] = atTwoHours.split('T');
    expect(payload3).toBe(`${dPart} ${tPart}\nMua sữa`);
  });

  // --------------------------------------------------------------------------
  // Kịch bản 4: rem-at = now + 3 ngày → rem-alarm bị vô hiệu, rem-reminder vẫn dùng được;
  // rem-at = now - 1 h → cả hai bị vô hiệu.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 4: Cửa sổ thời gian (+3 ngày vs -1 h)', async () => {
    await page.getByTestId('todo-input').fill('Kiểm tra nút');
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();
    await expect(page.getByTestId('rem-at')).not.toHaveValue('');

    // rem-at = now + 3 ngày
    const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const atThreeDays = formatLocalDateTime(inThreeDays);
    await page.getByTestId('rem-at').fill(atThreeDays);
    await expect(page.getByTestId('rem-at')).toHaveValue(atThreeDays);

    // rem-alarm bị vô hiệu, rem-reminder vẫn dùng được
    await expect(page.getByTestId('rem-alarm')).toBeDisabled();
    await expect(page.getByTestId('rem-reminder')).toBeEnabled();

    // rem-at = now - 1 h
    const pastOneHour = new Date(Date.now() - 60 * 60 * 1000);
    const atPastOneHour = formatLocalDateTime(pastOneHour);
    await page.getByTestId('rem-at').fill(atPastOneHour);
    await expect(page.getByTestId('rem-at')).toHaveValue(atPastOneHour);

    // cả hai bị vô hiệu
    await expect(page.getByTestId('rem-alarm')).toBeDisabled();
    await expect(page.getByTestId('rem-reminder')).toBeDisabled();

    // Đóng hộp thoại và dọn ô nhập
    await page.getByTestId('rem-none').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();
    await page.getByTestId('todo-input').fill('');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 5: Ghi chú mới có tiêu đề + nội dung 2 dòng → rem-reminder
  // → payload 3 dòng, ghi chú đã được lưu.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 5: Ghi chú 2 dòng → Lời nhắc payload 3 dòng, ghi chú đã lưu', async () => {
    await page.getByTestId('seg-note').click();

    await page.getByTestId('add-note').click();
    await expect(page.locator('.sheet')).toBeVisible();

    const noteTitle = 'Ý tưởng dự án';
    const noteBody = 'Dòng một\nDòng hai';
    await page.getByTestId('nt-title').fill(noteTitle);
    await page.getByTestId('nt-body').fill(noteBody);

    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();

    await expect(page.getByTestId('rem-at')).not.toHaveValue('');
    const noteAt = await page.getByTestId('rem-at').inputValue();
    const [noteDPart, noteTPart] = noteAt.split('T');

    await page.getByTestId('rem-reminder').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // __lastNav chứa name=ThemLoiNhac&input=text&text= và payload 3 dòng
    await expect.poll(() => getLastNav(page)).toContain('name=ThemLoiNhac&input=text&text=');
    const nav5 = (await getLastNav(page))!;
    const payload5 = extractDecodedPayload(nav5);
    const lines5 = payload5.split('\n');
    expect(lines5).toHaveLength(3);
    expect(lines5[0]).toBe(`${noteDPart} ${noteTPart}`);
    expect(lines5[1]).toBe(noteTitle);
    expect(lines5[2]).toBe('Dòng một · Dòng hai');
    expect(payload5).toBe(`${noteDPart} ${noteTPart}\n${noteTitle}\nDòng một · Dòng hai`);

    // Ghi chú đã được lưu (sheet đóng, ghi chú xuất hiện trong danh sách)
    await expect(page.locator('.sheet')).not.toBeVisible();
    const noteItem = page.getByTestId('note-item').filter({ hasText: noteTitle });
    await expect(noteItem).toBeVisible();
    await expect(noteItem).toContainText('Dòng một');
  });

  // --------------------------------------------------------------------------
  // Kịch bản 6: Tab Xem trước đổi shortcut-alarm-name thành Bao Thuc
  // → reload vẫn giữ → __lastNav chứa name=Bao%20Thuc.
  // --------------------------------------------------------------------------
  await test.step('Kịch bản 6: Đổi shortcut-alarm-name thành Bao Thuc → reload giữ → __lastNav chứa name=Bao%20Thuc', async () => {
    await page.getByTestId('tab-preview').click();

    const alarmInput = page.getByTestId('shortcut-alarm-name');
    await expect(alarmInput).toBeVisible();
    await alarmInput.fill('Bao Thuc');

    // Chờ lưu vào IndexedDB (debounce 300ms trong createStore) trước khi reload
    await expect.poll(async () => {
      return page.evaluate(() =>
        new Promise<string | undefined>((resolve) => {
          const req = indexedDB.open('keyval-store');
          req.onerror = () => resolve(undefined);
          req.onsuccess = () => {
            const tx = req.result.transaction('keyval', 'readonly');
            const getReq = tx.objectStore('keyval').get('lichkhoa:state');
            getReq.onerror = () => resolve(undefined);
            getReq.onsuccess = () => {
              const s = getReq.result as { alarmShortcutName?: string } | undefined;
              req.result.close();
              resolve(s?.alarmShortcutName);
            };
          };
        }),
      );
    }).toBe('Bao Thuc');

    // reload vẫn giữ
    await page.reload();
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('Bao Thuc');

    // Kích hoạt báo thức để kiểm tra __lastNav chứa name=Bao%20Thuc
    await page.getByTestId('tab-events').click();
    await page.getByTestId('seg-todos').click();
    await page.getByTestId('todo-input').fill('Việc kiểm tra phím tắt');
    await page.getByTestId('rem-open').click();
    await expect(page.locator('.rem-dialog')).toBeVisible();
    await expect(page.getByTestId('rem-at')).not.toHaveValue('');

    const inTwoHoursReload = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const atTwoHoursReload = formatLocalDateTime(inTwoHoursReload);
    await page.getByTestId('rem-at').fill(atTwoHoursReload);
    await expect(page.getByTestId('rem-at')).toHaveValue(atTwoHoursReload);
    await expect(page.getByTestId('rem-alarm')).toBeEnabled();
    await page.getByTestId('rem-alarm').click();
    await expect(page.locator('.rem-dialog')).not.toBeVisible();

    // __lastNav chứa name=Bao%20Thuc
    await expect.poll(() => getLastNav(page)).toContain('name=Bao%20Thuc');
    const nav6 = (await getLastNav(page))!;
    expect(nav6).toContain('shortcuts://run-shortcut?name=Bao%20Thuc&input=text&text=');
  });
});

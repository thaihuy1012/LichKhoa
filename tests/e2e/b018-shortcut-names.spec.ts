import { test, expect } from '@playwright/test';

/**
 * B-018: Gom 4 ô tên Phím tắt vào nút "Đổi tên Phím tắt" (mặc định thu gọn).
 * Mục tiêu: ảnh xem trước không bị 4 ô đổi tên chen giữa; panel mặc định ẩn,
 * bấm toggle mới xổ ra; nút reset đưa cả 4 tên về mặc định (đọc từ defaultState).
 */

test.describe('B-018 Panel đổi tên Phím tắt thu gọn', () => {
  test('mặc định ẩn 4 ô tên; bấm toggle mở/đóng đúng aria-expanded', async ({ page }) => {
    await page.goto('/?test=1');

    const preview = page.getByTestId('preview');
    const rowActions = page.locator('.row-actions');
    await expect(preview).toBeVisible();
    await expect(rowActions).toBeVisible();
    await expect(page.getByTestId('save')).toBeEnabled();

    const panel = page.getByTestId('shortcut-names-panel');
    await expect(panel).toHaveCount(0);
    await expect(page.getByTestId('shortcut-name')).toHaveCount(0);
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveCount(0);
    await expect(page.getByTestId('shortcut-reminder-name')).toHaveCount(0);
    await expect(page.getByTestId('shortcut-dayalarm-name')).toHaveCount(0);

    const toggle = page.getByTestId('shortcut-names-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(panel).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('shortcut-name')).toBeVisible();
    await expect(page.getByTestId('shortcut-alarm-name')).toBeVisible();
    await expect(page.getByTestId('shortcut-reminder-name')).toBeVisible();
    await expect(page.getByTestId('shortcut-dayalarm-name')).toBeVisible();

    await toggle.click();
    await expect(panel).toHaveCount(0);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('đổi tên rồi bấm reset → cả 4 ô về mặc định, reload vẫn giữ mặc định', async ({ page }) => {
    await page.goto('/?test=1');
    // Chờ dựng ảnh xong (RENDER_DEBOUNCE_MS) để layout đứng yên trước khi bấm toggle —
    // tránh WebKit mis-click do ảnh preview vừa nạp làm dịch chuyển nút ngay lúc click.
    await expect(page.getByTestId('save')).toBeEnabled();
    await page.getByTestId('shortcut-names-toggle').click();

    await page.getByTestId('shortcut-alarm-name').fill('Ten Khac');
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('Ten Khac');

    await page.getByTestId('shortcut-names-reset').click();

    await expect(page.getByTestId('shortcut-name')).toHaveValue('DatHinhNen');
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('ThemBaoThuc');
    await expect(page.getByTestId('shortcut-reminder-name')).toHaveValue('ThemLoiNhac');
    await expect(page.getByTestId('shortcut-dayalarm-name')).toHaveValue('ThemBaoThucNgay');

    // Chờ lưu vào IndexedDB (debounce trong createStore) trước khi reload.
    await expect
      .poll(() =>
        page.evaluate(
          () =>
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
        ),
      )
      .toBe('ThemBaoThuc');

    await page.reload();
    await expect(page.getByTestId('save')).toBeEnabled();
    await page.getByTestId('shortcut-names-toggle').click();
    await expect(page.getByTestId('shortcut-name')).toHaveValue('DatHinhNen');
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('ThemBaoThuc');
    await expect(page.getByTestId('shortcut-reminder-name')).toHaveValue('ThemLoiNhac');
    await expect(page.getByTestId('shortcut-dayalarm-name')).toHaveValue('ThemBaoThucNgay');
  });

  test('chiều cao ảnh preview khi panel đóng >= khi panel mở (không còn ô tên chen giữa ảnh và nút)', async ({
    page,
  }) => {
    await page.goto('/?test=1');
    const preview = page.getByTestId('preview');
    await expect(preview).toBeVisible();
    await expect(page.getByTestId('save')).toBeEnabled();

    const closedBox = (await preview.boundingBox())!;
    // Ảnh nằm ngay trên .row-actions, không có ô tên nào chen giữa khi đóng.
    const rowActionsClosedBox = (await page.locator('.row-actions').boundingBox())!;
    expect(rowActionsClosedBox.y).toBeGreaterThanOrEqual(closedBox.y + closedBox.height);

    await page.getByTestId('shortcut-names-toggle').click();
    const openBox = (await preview.boundingBox())!;

    expect(closedBox.height).toBeGreaterThanOrEqual(openBox.height);
  });
});

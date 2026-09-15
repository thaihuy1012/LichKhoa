import { test, expect } from '@playwright/test';

async function opsTexts(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

test.describe('Bố cục Tuần (T-5.3)', () => {
  test('chọn bố cục Tuần: nút chọn, preview 1284x2778, đủ 7 nhãn thứ VI (T2 đầu), reload giữ trạng thái', async ({ page }) => {
    page.on('dialog', (d) => d.accept());
    await page.goto('/?test=1');

    const monthBtn = page.getByTestId('layout-month');
    const weekBtn = page.getByTestId('layout-week');

    await expect(monthBtn).toBeVisible();
    await expect(weekBtn).toBeVisible();

    // Ban đầu: nút Tháng được chọn, nút Tuần chưa được chọn
    const monthBg0 = await monthBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    const weekBg0 = await weekBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(monthBg0).not.toBe(weekBg0);
    await expect(monthBtn).toHaveAttribute('aria-selected', 'true');
    await expect(weekBtn).toHaveAttribute('aria-selected', 'false');

    // Bấm chọn bố cục Tuần
    await weekBtn.click();

    // Nút ở trạng thái chọn giống các nút bố cục khác (được tô màu active, aria-selected=true)
    const monthBg1 = await monthBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    const weekBg1 = await weekBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(weekBg1).not.toBe(monthBg1);
    expect(weekBg1).toBe(monthBg0);
    await expect(weekBtn).toHaveAttribute('aria-selected', 'true');
    await expect(weekBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(monthBtn).toHaveAttribute('aria-selected', 'false');

    // Preview naturalWidth 1284 / naturalHeight 2778
    const preview = page.getByTestId('preview');
    await expect(preview).toBeVisible();
    await expect
      .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
      .toBe(1284);
    await expect
      .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalHeight), { timeout: 10000 })
      .toBe(2778);

    // __lastOps có đủ 7 nhãn thứ của tuần (VI mặc định, T2 đầu)
    const expectedWeekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    await expect
      .poll(async () => {
        const texts = await opsTexts(page);
        return expectedWeekdays.every((wd) => texts.includes(wd));
      }, { timeout: 10000 })
      .toBe(true);

    await expect
      .poll(async () => {
        const texts = await opsTexts(page);
        return texts.filter((t) => expectedWeekdays.includes(t)).slice(0, 7);
      }, { timeout: 10000 })
      .toEqual(expectedWeekdays);

    // Reload -> vẫn chọn Tuần (IndexedDB persist debounce 300ms)
    await page.waitForTimeout(500);
    await page.reload();

    const weekBtnReloaded = page.getByTestId('layout-week');
    await expect(weekBtnReloaded).toBeVisible();
    await expect(weekBtnReloaded).toHaveAttribute('aria-selected', 'true');
    await expect(weekBtnReloaded).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('layout-month')).toHaveAttribute('aria-selected', 'false');

    const previewReloaded = page.getByTestId('preview');
    await expect(previewReloaded).toBeVisible();
    await expect
      .poll(() => previewReloaded.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
      .toBe(1284);
    await expect
      .poll(() => previewReloaded.evaluate((img: HTMLImageElement) => img.naturalHeight), { timeout: 10000 })
      .toBe(2778);
  });

  test('ở 428x926: 4 nút bố cục nằm trên một hàng, không cuộn ngang, mỗi nút cao >= 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 428, height: 926 });
    await page.goto('/?test=1');

    const layoutIds = ['layout-month', 'layout-agenda', 'layout-todo', 'layout-week'];
    const buttons = layoutIds.map((id) => page.getByTestId(id));

    for (const btn of buttons) {
      await expect(btn).toBeVisible();
    }

    const boxes = await Promise.all(
      buttons.map(async (btn) => {
        const b = await btn.boundingBox();
        expect(b).not.toBeNull();
        return b!;
      }),
    );

    // 4 nút nằm trên một hàng: tọa độ y (top) bằng nhau (dung sai subpixel < 1px)
    const firstY = boxes[0].y;
    for (let i = 1; i < boxes.length; i++) {
      expect(Math.abs(boxes[i].y - firstY)).toBeLessThan(1);
    }

    // Các nút xếp cạnh nhau từ trái qua phải
    for (let i = 0; i < boxes.length - 1; i++) {
      expect(boxes[i].x + boxes[i].width).toBeLessThanOrEqual(boxes[i + 1].x + 1);
    }

    // Mỗi nút cao >= 44 px
    for (const box of boxes) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    // Không cuộn ngang: container .segmented và documentElement
    const segScroll = await page.locator('.segmented[role="tablist"]').evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(segScroll.scrollWidth).toBeLessThanOrEqual(segScroll.clientWidth);

    const docScroll = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(docScroll.scrollWidth).toBeLessThanOrEqual(docScroll.clientWidth);
  });
});

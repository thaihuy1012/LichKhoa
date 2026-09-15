import { test, expect } from '@playwright/test';

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

async function lastOps(page: import('@playwright/test').Page): Promise<Op[]> {
  return page.evaluate(() => (window as unknown as { __lastOps?: Op[] }).__lastOps ?? []);
}

/** Tìm chip (rect + 2 dòng text, xem `drawChip` trong `src/render/layout/week.ts`) theo tiêu đề dòng 2. */
function findChip(ops: Op[], title: string): { rect: Op; line1: Op; line2: Op } | undefined {
  for (let i = 2; i < ops.length; i++) {
    const line2 = ops[i];
    if (line2.op === 'text' && line2.text === title && line2.weight === 400) {
      const line1 = ops[i - 1];
      const rect = ops[i - 2];
      if (rect.op === 'rect' && rect.r === 10 && line1.op === 'text') {
        return { rect, line1, line2 };
      }
    }
  }
  return undefined;
}

const WEEKDAY_LABELS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']; // weekStart=1 mặc định, T2 đầu (khớp week.spec.ts)

/** Tâm 7 cột ngày, suy từ chính op nhãn thứ (`x`, align center, đầu mỗi cột trong `layoutWeek`) — không
 * chép công thức hình học của app, chỉ đọc lại vị trí thật đã render. */
function columnCenters(ops: Op[]): number[] {
  return ops.filter((o) => o.op === 'text' && WEEKDAY_LABELS_VI.includes(o.text ?? '')).map((o) => o.x!);
}

/** `x` nằm trong `[rect.x, rect.x + rect.w]` (dung sai subpixel). */
function containsX(rect: Op, x: number): boolean {
  return x >= rect.x! - 0.5 && x <= rect.x! + rect.w! + 0.5;
}

test('M5 luồng chính: sự kiện + to-do trong tuần -> bố cục Tuần, chip đúng cột, danh sách hôm nay, reload giữ Tuần', async ({
  page,
}) => {
  page.on('dialog', (d) => d.accept());
  await page.goto('/?test=1');

  const { todayIso, otherIso, todayIdx, otherIdx } = await page.evaluate(() => {
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diff = (today.getDay() + 6) % 7; // 0=T2..6=CN (weekStart=1, mặc định)
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    const otherI = (diff + 3) % 7; // luôn khác todayIdx, vẫn trong cùng tuần
    const other = new Date(monday);
    other.setDate(monday.getDate() + otherI);
    return { todayIso: iso(today), otherIso: iso(other), todayIdx: diff, otherIdx: otherI };
  });

  const evTodayTitle = 'SK Hom Nay';
  const evOtherTitle = 'SK Khac';
  const todoTitle = 'Viec Homnay';

  await page.getByTestId('tab-events').click();

  // Sự kiện hôm nay 09:00, 40 phút.
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill(evTodayTitle);
  await page.getByTestId('ev-date').fill(todayIso);
  await page.getByTestId('ev-start').fill('09:00');
  await page.getByTestId('ev-end').fill('09:40');
  await page.getByTestId('ev-save').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: evTodayTitle })).toBeVisible();

  // Sự kiện ngày khác trong tuần.
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill(evOtherTitle);
  await page.getByTestId('ev-date').fill(otherIso);
  await page.getByTestId('ev-save').click();
  await expect(page.getByTestId('ev-item').filter({ hasText: evOtherTitle })).toBeVisible();

  // To-do có hạn hôm nay.
  await page.getByTestId('seg-todos').click();
  await page.getByTestId('todo-input').fill(todoTitle);
  await page.getByTestId('todo-due').fill(todayIso);
  await page.getByTestId('todo-add').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  // Chọn bố cục Tuần.
  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-week').click();

  const preview = page.getByTestId('preview');
  await expect(preview).toBeVisible();
  await expect
    .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
    .toBe(1284);
  await expect
    .poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalHeight), { timeout: 10000 })
    .toBe(2778);

  await expect
    .poll(async () => {
      const ops = await lastOps(page);
      return !!findChip(ops, evTodayTitle) && !!findChip(ops, evOtherTitle) && !!findChip(ops, todoTitle);
    }, { timeout: 10000 })
    .toBe(true);

  const ops = await lastOps(page);

  const centers = columnCenters(ops);
  expect(centers).toHaveLength(7);

  // Rect tô cột hôm nay: alpha 0.25, r 16 (xem `layoutWeek`); chứa tâm cột hôm nay, không chứa cột khác.
  const todayHighlight = ops.find((o) => o.op === 'rect' && o.alpha === 0.25 && o.r === 16);
  expect(todayHighlight).toBeTruthy();
  expect(containsX(todayHighlight!, centers[todayIdx])).toBe(true);
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) continue;
    expect(containsX(todayHighlight!, centers[i])).toBe(false);
  }

  // Chip sự kiện hôm nay: "09:00 - 09:40", tâm cột hôm nay nằm trong rect chip.
  const todayChip = findChip(ops, evTodayTitle)!;
  expect(todayChip.line1.text).toBe('09:00 - 09:40');
  expect(containsX(todayChip.rect, centers[todayIdx])).toBe(true);

  // Chip to-do hôm nay: dòng 1 có ô vuông, cùng cột hôm nay.
  const todoChip = findChip(ops, todoTitle)!;
  expect(todoChip.line1.text).toContain('☐');
  expect(containsX(todoChip.rect, centers[todayIdx])).toBe(true);

  // Chip sự kiện ngày khác: tâm cột ngày đó nằm trong rect chip (không phải cột hôm nay).
  const otherChip = findChip(ops, evOtherTitle)!;
  expect(containsX(otherChip.rect, centers[otherIdx])).toBe(true);
  expect(containsX(otherChip.rect, centers[todayIdx])).toBe(false);

  // Tên sự kiện + to-do hôm nay trong danh sách hôm nay: op text cỡ lớn hơn chip (weight 700, size > line2 chip).
  const listEvent = ops.find((o) => o.op === 'text' && o.text === evTodayTitle && o.weight === 700);
  const listTodo = ops.find((o) => o.op === 'text' && o.text === todoTitle && o.weight === 700);
  expect(listEvent).toBeTruthy();
  expect(listTodo).toBeTruthy();
  expect(listEvent!.size!).toBeGreaterThan(todayChip.line2.size!);
  expect(listTodo!.size!).toBeGreaterThan(todoChip.line2.size!);

  // Reload -> vẫn chọn Tuần (IndexedDB persist debounce 300ms).
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.getByTestId('layout-week')).toHaveAttribute('aria-selected', 'true');
  const previewReloaded = page.getByTestId('preview');
  await expect(previewReloaded).toBeVisible();
  await expect
    .poll(() => previewReloaded.evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
    .toBe(1284);
});

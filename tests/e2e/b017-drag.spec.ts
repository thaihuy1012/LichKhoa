import { test, expect } from '@playwright/test';

/** B-017: kéo đổi thứ tự Việc không được xem trước sang nhóm khác (`sameTodoGroup`) và phải tự
 * cuộn khi tới gần mép vùng cuộn (`.events-screen`) lúc danh sách dài hơn màn hình. Học cách thao
 * tác (nhấn giữ + kéo bằng chuột) từ `tests/e2e/m6-todo-gestures.spec.ts`. */

async function openTodos(page: import('@playwright/test').Page) {
  await page.getByTestId('tab-events').click();
  await page.getByTestId('seg-todos').click();
}

async function addTodo(page: import('@playwright/test').Page, text: string, due?: string) {
  await page.getByTestId('todo-input').fill(text);
  if (due) await page.getByTestId('todo-due').fill(due);
  await page.getByTestId('todo-add').click();
}

test('kéo hàng nhóm không hạn quá ranh giới lên nhóm có hạn -> thứ tự không đổi, nhóm kia không dịch', async ({
  page,
}) => {
  await page.goto('/?test=1');
  const tomorrow = await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  await openTodos(page);
  // Hiển thị: có hạn trước, không hạn sau (cmpTodo) -> Hen1, Hen2, Tudo1, Tudo2.
  await addTodo(page, 'Hen1', tomorrow);
  await addTodo(page, 'Hen2', tomorrow);
  await addTodo(page, 'Tudo1');
  await addTodo(page, 'Tudo2');

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Hen1');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('Hen2');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('Tudo1');
  await expect(rows.nth(3).getByTestId('todo-edit')).toHaveText('Tudo2');

  const boxHen1Before = (await rows.nth(0).boundingBox())!;
  const boxHen2Before = (await rows.nth(1).boundingBox())!;
  const boxTudo1 = (await rows.nth(2).boundingBox())!;

  // Nhấn giữ Tudo1 (đầu nhóm "không hạn") rồi kéo hẳn lên trên đầu danh sách (qua cả nhóm "có hạn").
  await page.mouse.move(boxTudo1.x + boxTudo1.width / 2, boxTudo1.y + boxTudo1.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(600);
  await page.mouse.move(boxHen1Before.x + boxHen1Before.width / 2, boxHen1Before.y - 5, { steps: 10 });

  // Trong lúc kéo: nhóm "có hạn" (Hen1, Hen2) không được xem trước dịch chỗ.
  const boxHen1During = (await rows.nth(0).boundingBox())!;
  const boxHen2During = (await rows.nth(1).boundingBox())!;
  expect(Math.round(boxHen1During.y)).toBe(Math.round(boxHen1Before.y));
  expect(Math.round(boxHen2During.y)).toBe(Math.round(boxHen2Before.y));

  await page.mouse.up();

  // Thứ tự không đổi vì Tudo1 bị kẹp trong nhóm của chính nó.
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Hen1');
  await expect(rows.nth(1).getByTestId('todo-edit')).toHaveText('Hen2');
  await expect(rows.nth(2).getByTestId('todo-edit')).toHaveText('Tudo1');
  await expect(rows.nth(3).getByTestId('todo-edit')).toHaveText('Tudo2');
});

test('kéo hàng đầu xuống mép dưới danh sách dài -> tự cuộn -> thả về vị trí dưới cùng đã xem trước', async ({
  page,
}) => {
  await page.goto('/?test=1');
  await openTodos(page);
  const N = 20;
  for (let i = 0; i < N; i++) await addTodo(page, `Item${i}`);

  const rows = page.getByTestId('todo-item');
  await expect(rows).toHaveCount(N);
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Item0');

  const scrollEl = page.locator('.events-screen');
  const scrollBoxBefore = (await scrollEl.boundingBox())!;
  const scrollTopBefore = await scrollEl.evaluate((el) => el.scrollTop);

  const box0 = (await rows.nth(0).boundingBox())!;
  await page.mouse.move(box0.x + box0.width / 2, box0.y + box0.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(600);
  // Kéo tới sát mép dưới vùng cuộn (< 60px) và giữ để tự cuộn diễn ra.
  await page.mouse.move(box0.x + box0.width / 2, scrollBoxBefore.y + scrollBoxBefore.height - 10, { steps: 10 });

  await page.waitForTimeout(300);
  const scrollTopDuring = await scrollEl.evaluate((el) => el.scrollTop);
  expect(scrollTopDuring).toBeGreaterThan(scrollTopBefore);

  // Giữ tới khi cuộn hết cỡ (môi trường CI/webkit có thể chạy chậm hơn máy dev -> không dùng thời
  // gian chờ cố định, chờ đúng điều kiện đã cuộn hết vùng cuộn).
  await expect
    .poll(async () => scrollEl.evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop), {
      timeout: 15000,
    })
    .toBeLessThan(2);

  await page.mouse.up();

  // Item0 phải nằm ở vị trí dưới cùng đã xem trước lúc kéo (cuộn hết cỡ trong lúc giữ).
  await expect(rows.nth(N - 1).getByTestId('todo-edit')).toHaveText('Item0');
  await expect(rows.nth(0).getByTestId('todo-edit')).toHaveText('Item1');
});

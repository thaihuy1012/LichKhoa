import { test, expect, type Page } from '@playwright/test';

const SEED_DEVICE = { id: 'iphone-13-pro-max', label: 'iPhone 13 Pro Max', width: 428, height: 926, safeTop: 0.3, safeBottom: 0.14 };
const TITLE = 'Họp nhóm';

function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Ghi thẳng `lichkhoa:state` vào IndexedDB (`keyval-store`/`keyval`), hợp nhất trên state đã có (T-4.9). */
async function seedState(page: Page, patch: Record<string, unknown>): Promise<void> {
  await page.evaluate(
    ({ patch, device }) =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.open('keyval-store');
        req.onupgradeneeded = () => req.result.createObjectStore('keyval');
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const tx = req.result.transaction('keyval', 'readonly');
          const getReq = tx.objectStore('keyval').get('lichkhoa:state');
          getReq.onerror = () => reject(getReq.error);
          getReq.onsuccess = () => {
            const cur = (getReq.result ?? { version: 1, device }) as Record<string, unknown>;
            const next = { ...cur, ...patch };
            const tx2 = req.result.transaction('keyval', 'readwrite');
            tx2.objectStore('keyval').put(next, 'lichkhoa:state');
            tx2.oncomplete = () => {
              req.result.close();
              resolve();
            };
            tx2.onerror = () => reject(tx2.error);
          };
        };
      }),
    { patch, device: SEED_DEVICE },
  );
}

async function opsTexts(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

test('B-003: sự kiện local trùng Google (cùng tên/giờ hôm nay) -> hình nền chỉ còn 1, tab Sự kiện vẫn 2', async ({ page }) => {
  const today = isoDate(new Date());

  await page.goto('/?test=1');
  await seedState(page, {
    google: {
      clientId: '',
      calendarIds: ['cal1'],
      cache: {
        fetchedAt: Date.now(),
        events: [
          { id: `google-cal1-g1@${today}`, sourceId: 'g1', source: 'google', title: TITLE, date: today, time: '09:00', allDay: false, color: '#4285F4' },
        ],
      },
    },
  });
  await page.reload();

  // Tạo sự kiện local cùng tên/giờ qua tab Sự kiện.
  await page.getByTestId('tab-events').click();
  await page.getByTestId('add-event').click();
  await page.getByTestId('ev-title').fill(TITLE);
  await page.getByTestId('ev-save').click();

  // Tab Sự kiện: vẫn 2 mục hôm nay, một mục là google.
  await expect(page.locator('.ev-item').filter({ hasText: TITLE })).toHaveCount(2);
  await expect(page.getByTestId('ev-item-google')).toHaveCount(1);

  // Hình nền (bố cục Agenda): chỉ còn 1 op text "Họp nhóm".
  await page.getByTestId('tab-preview').click();
  await page.getByTestId('layout-agenda').click();
  await expect
    .poll(async () => (await opsTexts(page)).filter((t) => t.includes(TITLE)).length, { timeout: 5000 })
    .toBe(1);
});

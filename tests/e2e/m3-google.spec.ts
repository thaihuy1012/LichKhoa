import { test, expect, type Page } from '@playwright/test';
import calendarListFixture from '../fixtures/google/calendarList.json' with { type: 'json' };
import eventsSyncTemplate from '../fixtures/google/events-sync.json' with { type: 'json' };

const CAL1 = 'cal1@group.calendar.google.com';
const CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
const BASE_URL = 'http://localhost:4173';
const FIXTURE_TITLE = 'Fixture Dong Bo';

const DEVICE = {
  id: 'iphone-1284x2778',
  label: 'iPhone 12/13 Pro Max',
  width: 1284,
  height: 2778,
  safeTop: 0.3,
  safeBottom: 0.14,
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Sự kiện cả ngày "hôm nay" (chắc chắn nằm trong khoảng đồng bộ [today-1, today+60]). */
function eventsBody(): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const body = JSON.parse(JSON.stringify(eventsSyncTemplate)) as {
    items: { start: { date: string }; end: { date: string } }[];
  };
  body.items[0].start.date = isoDate(today);
  body.items[0].end.date = isoDate(tomorrow);
  return JSON.stringify(body);
}

async function opsTexts(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    ((window as unknown as { __lastOps?: { text?: string }[] }).__lastOps ?? [])
      .map((o) => o.text)
      .filter((t): t is string => !!t),
  );
}

/** Chặn `accounts.google.com` (302 kèm access_token lấy state từ query) + REST calendar/v3. */
async function mockGoogle(
  context: import('@playwright/test').BrowserContext,
  opts: { calendarStatus: () => number; eventsStatus: () => number },
) {
  await context.route('https://accounts.google.com/**', async (route) => {
    const url = new URL(route.request().url());
    const state = url.searchParams.get('state') ?? '';
    // Giữ `?test=1` qua redirect để `window.__lastOps` tiếp tục được ghi sau khi Google trả về.
    const redirect = `${BASE_URL}/?test=1#access_token=test&token_type=Bearer&expires_in=3600&state=${state}`;
    // webkit: route.fulfill không hỗ trợ status redirect (302) cho điều hướng cấp cao nhất
    // ("Cannot fulfill with redirect status") → trả trang HTML tự điều hướng bằng script,
    // tương đương hành vi 302 của Google với client (SPEC chỉ quan tâm kết quả điều hướng).
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<script>location.replace(${JSON.stringify(redirect)});</script>`,
    });
  });
  await context.route('**/calendar/v3/users/me/calendarList', async (route) => {
    const status = opts.calendarStatus();
    if (status !== 200) return route.fulfill({ status, body: '{}' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(calendarListFixture) });
  });
  await context.route('**/calendar/v3/calendars/**/events**', async (route) => {
    const status = opts.eventsStatus();
    if (status !== 200) return route.fulfill({ status, body: '{}' });
    const url = route.request().url();
    if (url.includes(encodeURIComponent(CAL1))) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: eventsBody() });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [] }) });
  });
}

/** Ghi thẳng `lichkhoa:state` vào IndexedDB (`keyval-store`/`keyval`), hợp nhất trên state đã có. */
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
    { patch, device: DEVICE },
  );
}

test.describe('M3 Google Calendar (mock OAuth + REST)', () => {
  // Webkit: service worker "nuốt" fetch trước context.route (xem docs/TASKS.md T-3.END,
  // mục "Vướng đã biết"). Bù lại, các test này không cần offline nên không cần SW.
  test.use({ serviceWorkers: 'block' });

  test('Kết nối → tự về tab Đồng bộ → chọn lịch → Đồng bộ ngay → agenda hiện sự kiện → 401 → Kết nối lại', async ({
    page,
    context,
  }) => {
    let eventsStatus = 200;
    await mockGoogle(context, { calendarStatus: () => 200, eventsStatus: () => eventsStatus });

    await page.goto('/?test=1');
    await expect(page.getByTestId('tab-preview')).toHaveClass(/tab-active/);

    await page.getByTestId('tab-sync').click();
    const clientIdInput = page.getByTestId('sync-clientid');
    // webkit: click trước fill để đảm bảo input đã ổn định sau khi chuyển tab (tránh giá trị rỗng).
    await clientIdInput.click();
    await clientIdInput.fill(CLIENT_ID);
    await page.getByTestId('sync-connect').click();

    // Sau redirect, App tự mở tab Đồng bộ (không cần bấm lại tab-sync).
    await expect(page.getByTestId('tab-sync')).toHaveClass(/tab-active/, { timeout: 10_000 });
    await expect(page.getByTestId('sync-status')).toBeVisible();
    await expect(page.getByTestId(`sync-cal-${CAL1}`)).toBeVisible();

    await page.getByTestId(`sync-cal-${CAL1}`).check();
    await page.getByTestId('sync-now').click();
    await expect(page.getByTestId('sync-last')).not.toHaveText('', { timeout: 10_000 });

    await page.getByTestId('tab-preview').click();
    await page.getByTestId('layout-agenda').click();
    await expect
      .poll(async () => opsTexts(page), { timeout: 5000 })
      .toEqual(expect.arrayContaining([expect.stringContaining(FIXTURE_TITLE)]));

    // 401 khi đồng bộ → "Kết nối lại".
    eventsStatus = 401;
    await page.getByTestId('tab-sync').click();
    await page.getByTestId('sync-now').click();
    await expect(page.getByTestId('sync-reconnect')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('sync-reauth-msg')).toBeVisible();
  });

  test('Tự đồng bộ khi mở app với cache cũ (> 30 phút)', async ({ page, context }) => {
    await mockGoogle(context, { calendarStatus: () => 200, eventsStatus: () => 200 });

    await page.goto('/?test=1');
    await page.evaluate(() => {
      localStorage.setItem(
        'google_oauth_token',
        JSON.stringify({ accessToken: 'tok-stale-test', expiresAt: Date.now() + 3_600_000 }),
      );
    });
    await seedState(page, {
      google: { clientId: CLIENT_ID, calendarIds: [CAL1], cache: { events: [], fetchedAt: Date.now() - 40 * 60 * 1000 } },
    });

    await page.reload();
    await page.getByTestId('tab-preview').click();
    await page.getByTestId('layout-agenda').click();
    await expect
      .poll(async () => opsTexts(page), { timeout: 10_000 })
      .toEqual(expect.arrayContaining([expect.stringContaining(FIXTURE_TITLE)]));
  });
});

// Offline: không thể chặn REST bằng route (vướng SW trên webkit) và cũng không cần — cache đã có
// sẵn trong IndexedDB, chỉ cần app shell (service worker) phục vụ được lúc mất mạng.
test('offline + reload vẫn hiện sự kiện Google đã đồng bộ (từ cache IndexedDB)', async ({ page, context, browserName }) => {
  await page.goto('/?test=1');
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) await navigator.serviceWorker.ready;
  });

  await seedState(page, {
    design: { layout: 'agenda' },
    google: {
      clientId: CLIENT_ID,
      calendarIds: [CAL1],
      cache: {
        fetchedAt: Date.now(),
        events: [
          {
            id: `google-${CAL1}-sync-ev1`,
            sourceId: 'sync-ev1',
            source: 'google',
            title: FIXTURE_TITLE,
            date: isoDate(new Date()),
            allDay: true,
            color: '#4285F4',
          },
        ],
      },
    },
  });

  await page.reload();
  await expect
    .poll(async () => opsTexts(page), { timeout: 10_000 })
    .toEqual(expect.arrayContaining([expect.stringContaining(FIXTURE_TITLE)]));

  // webkit: `context.setOffline(true)` + `page.reload()` làm engine WebKit lỗi nội bộ
  // ("WebKit encountered an internal error") kể cả khi service worker đã active và không
  // liên quan gì đến app (tái hiện với app trống, mọi waitUntil) — giới hạn của
  // Playwright-WebKit khi giả lập offline cho điều hướng, không phải lỗi LichKhoa. Xem
  // docs/TASKS.md T-3.END "Vướng đã biết", phương án (3). Chromium vẫn kiểm đủ bước offline.
  test.skip(browserName === 'webkit', 'Playwright-WebKit: context.setOffline + page.reload gây lỗi nội bộ engine, không liên quan app (tái hiện với app trống)');

  await context.setOffline(true);
  await page.reload();
  await expect
    .poll(async () => opsTexts(page), { timeout: 10_000 })
    .toEqual(expect.arrayContaining([expect.stringContaining(FIXTURE_TITLE)]));
});

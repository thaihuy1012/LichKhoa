import { test, expect } from '@playwright/test';

/**
 * E2E M10 (T-10.END, SPEC §6 M10 gạch E2E (1)–(6)):
 * tab Hướng dẫn thẻ 2 "Cài nhanh bộ Phím tắt" qua link iCloud tĩnh
 * (public/shortcut-links.json). Chặn service worker (mẫu M3) để
 * `context.route('**\/shortcut-links.json')` luôn thắng SW trên WebKit;
 * `context.route('https://www.icloud.com/**')` trả trang rỗng 200 —
 * không gọi mạng thật.
 */

test.use({ serviceWorkers: 'block' });

// 5 id 32 hex BỊA, khác nhau, không phải Phím tắt thật.
const FIXTURE_LINKS = {
  wallpaper: 'https://www.icloud.com/shortcuts/147ad0369cf258be147ad0369cf258be',
  alarm: 'https://www.icloud.com/shortcuts/8be147ad0369cf258be147ad0369cf25',
  reminder: 'https://www.icloud.com/shortcuts/f258be147ad0369cf258be147ad0369c',
  dayAlarm: 'https://www.icloud.com/shortcuts/69cf258be147ad0369cf258be147ad03',
  morning: 'https://www.icloud.com/shortcuts/d0369cf258be147ad0369cf258be147a',
} as const;

const FIXTURE_UPDATED = '2026-09-22';

const KINDS = ['wallpaper', 'alarm', 'reminder', 'dayAlarm', 'morning'] as const;

function fullLinksBody(): string {
  return JSON.stringify({
    updated: FIXTURE_UPDATED,
    shortcuts: {
      wallpaper: { url: FIXTURE_LINKS.wallpaper },
      alarm: { url: FIXTURE_LINKS.alarm },
      reminder: { url: FIXTURE_LINKS.reminder },
      dayAlarm: { url: FIXTURE_LINKS.dayAlarm },
      morning: { url: FIXTURE_LINKS.morning },
    },
  });
}

async function routeLinks(context: import('@playwright/test').BrowserContext, body: string, status = 200) {
  await context.route('**/shortcut-links.json', (route) =>
    route.fulfill({ status, contentType: 'application/json', body }),
  );
}

/**
 * Mở panel "Đổi tên Phím tắt" ở tab mặc định 'preview'. Chờ ảnh preview dựng xong
 * (`save` enabled) trước khi bấm toggle; bọc `toPass` vì đôi khi (đặc biệt sau khi
 * Preview mount lại từ chuyển tab) cú bấm đầu rơi trước khi listener gắn xong
 * (mẫu race B-018/B-020) — bấm lại tới khi panel thật sự hiện.
 */
async function openShortcutNamesPanel(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('save')).toBeEnabled();
  await expect(async () => {
    await page.getByTestId('shortcut-names-toggle').click();
    await expect(page.getByTestId('shortcut-names-panel')).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 10000 });
}

test.beforeEach(async ({ context }) => {
  // Không gọi mạng thật: trang rỗng 200 (đủ để popup có URL, không cần nội dung thật).
  await context.route('https://www.icloud.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' }),
  );
});

test.describe('M10 E2E: Cài bộ Phím tắt qua link iCloud', () => {
  test('(1) JSON đủ 5 link + updated: 5 hàng install đúng thứ tự, popup mở link, vẫn ở tab Hướng dẫn', async ({
    page,
    context,
  }) => {
    await routeLinks(context, fullLinksBody());

    await page.goto('/?test=1');
    await page.getByTestId('tab-guide').click();

    // Thẻ 1 vẫn là guide-card-install, thẻ thứ 2 là guide-card-installShortcuts.
    const cards = page.locator('[data-testid^="guide-card-"]');
    await expect(cards.nth(0)).toHaveAttribute('data-testid', 'guide-card-install');
    await expect(cards.nth(1)).toHaveAttribute('data-testid', 'guide-card-installShortcuts');

    await expect(page.getByTestId('sc-updated')).toContainText('2026-09-22');
    await expect(page.getByTestId('sc-links-error')).toHaveCount(0);

    // 5 hàng ĐÚNG THỨ TỰ trong DOM: wallpaper, alarm, reminder, dayAlarm, morning.
    await expect(page.locator('[data-testid^="sc-row-"]')).toHaveCount(5);
    const rowIds = await page
      .locator('[data-testid^="sc-row-"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid')));
    expect(rowIds).toEqual(KINDS.map((kind) => `sc-row-${kind}`));

    for (const kind of KINDS) {
      await expect(page.getByTestId(`sc-row-${kind}`)).toBeVisible();
      const btn = page.getByTestId(`sc-install-${kind}`);
      await expect(btn).toHaveAttribute('href', FIXTURE_LINKS[kind]);
      await expect(btn).toHaveAttribute('target', '_blank');
      await expect(btn).toHaveAttribute('rel', /noopener/);
      const box = await btn.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await expect(page.getByTestId(`sc-nolink-${kind}`)).toHaveCount(0);
    }

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('sc-install-alarm').click(),
    ]);
    expect(popup.url()).toBe(FIXTURE_LINKS.alarm);
    await expect(page.getByTestId('guide-card-installShortcuts')).toBeVisible();
  });

  test('(2) JSON thiếu url / sai định dạng / thiếu khóa: đúng 3 nolink + 2 install, không lỗi tải', async ({
    page,
    context,
  }) => {
    const body = JSON.stringify({
      updated: FIXTURE_UPDATED,
      shortcuts: {
        wallpaper: { url: FIXTURE_LINKS.wallpaper },
        alarm: { url: '' },
        reminder: { url: FIXTURE_LINKS.reminder },
        dayAlarm: { url: 'https://www.icloud.com/shortcuts/XYZ' },
        // morning: thiếu khóa
      },
    });
    await routeLinks(context, body);

    await page.goto('/?test=1');
    await page.getByTestId('tab-guide').click();
    await expect(page.getByTestId('sc-row-wallpaper')).toBeVisible();

    await expect(page.getByTestId('sc-nolink-alarm')).toBeVisible();
    await expect(page.getByTestId('sc-nolink-dayAlarm')).toBeVisible();
    await expect(page.getByTestId('sc-nolink-morning')).toBeVisible();
    await expect(page.locator('[data-testid^="sc-nolink-"]')).toHaveCount(3);

    await expect(page.getByTestId('sc-install-wallpaper')).toBeVisible();
    await expect(page.getByTestId('sc-install-reminder')).toBeVisible();
    await expect(page.locator('[data-testid^="sc-install-"]')).toHaveCount(2);

    await expect(page.getByTestId('sc-links-error')).toHaveCount(0);
  });

  test('(3) JSON 404: sc-links-error hiện, 5 nolink, 0 install, thẻ khác vẫn hiện', async ({
    page,
    context,
  }) => {
    await routeLinks(context, 'not found', 404);

    await page.goto('/?test=1');
    await page.getByTestId('tab-guide').click();

    await expect(page.getByTestId('sc-links-error')).toBeVisible();
    await expect(page.locator('[data-testid^="sc-nolink-"]')).toHaveCount(5);
    await expect(page.locator('[data-testid^="sc-install-"]')).toHaveCount(0);

    await expect(page.getByTestId('guide-card-install')).toBeVisible();
    await expect(page.getByTestId('guide-card-dayAlarm')).toBeVisible();
  });

  test('(4) File thật trong repo: mỗi hàng đúng một trong install/nolink', async ({ page }) => {
    await page.goto('/?test=1');
    await page.getByTestId('tab-guide').click();
    await expect(page.getByTestId('sc-row-wallpaper')).toBeVisible();

    for (const kind of KINDS) {
      const hasInstall = (await page.getByTestId(`sc-install-${kind}`).count()) > 0;
      const hasNolink = (await page.getByTestId(`sc-nolink-${kind}`).count()) > 0;
      expect(hasInstall || hasNolink, `${kind} phải có install hoặc nolink`).toBeTruthy();
      expect(hasInstall && hasNolink, `${kind} không được có cả hai`).toBeFalsy();
    }
  });

  test('(5) Lệch tên: đổi tên alarm → mismatch hiện ở Hướng dẫn; reset → mismatch biến mất', async ({
    page,
    context,
  }) => {
    await routeLinks(context, fullLinksBody());

    await page.goto('/?test=1');
    // shortcut-names-toggle / shortcut-alarm-name nằm ở tab mặc định 'preview' (Xem trước).
    await openShortcutNamesPanel(page);
    await page.getByTestId('shortcut-alarm-name').fill('Bao Thuc');
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('Bao Thuc');

    await page.getByTestId('tab-guide').click();
    await expect(page.getByTestId('sc-name-mismatch-alarm')).toBeVisible();
    await expect(page.getByTestId('sc-name-mismatch-alarm')).toContainText('Bao Thuc');
    await expect(page.getByTestId('sc-name-mismatch-alarm')).toContainText('ThemBaoThuc');
    await expect(page.locator('[data-testid^="sc-name-mismatch-"]')).toHaveCount(1);

    // Preview unmount khi rời tab → panel đóng lại, phải mở lại trước khi bấm reset.
    await page.getByTestId('tab-preview').click();
    await openShortcutNamesPanel(page);
    await page.getByTestId('shortcut-names-reset').click();
    await expect(page.getByTestId('shortcut-alarm-name')).toHaveValue('ThemBaoThuc');

    await page.getByTestId('tab-guide').click();
    await expect(page.getByTestId('sc-name-mismatch-alarm')).toHaveCount(0);
  });

  test('(6) Việc tự làm: 4 li chứa BaoThuc/00:05; EN đổi tiêu đề + nút Get', async ({
    page,
    context,
  }) => {
    await routeLinks(context, fullLinksBody());

    await page.goto('/?test=1');
    await page.getByTestId('tab-guide').click();

    const steps = page.getByTestId('sc-manual-steps');
    const items = steps.getByRole('listitem');
    await expect(items).toHaveCount(4);
    await expect(steps).toContainText('BaoThuc');
    await expect(steps).toContainText('00:05');

    // 'lang' nằm ở tab mặc định 'preview'.
    await page.getByTestId('tab-preview').click();
    await page.getByTestId('lang').selectOption('en');

    await page.getByTestId('tab-guide').click();
    await expect(
      page.getByTestId('guide-card-installShortcuts').locator('strong').first(),
    ).toContainText('Install');
    await expect(page.getByTestId('sc-install-wallpaper')).toContainText('Get');
    await expect(page.getByTestId('sc-manual-steps').getByRole('listitem')).toHaveCount(4);
  });
});

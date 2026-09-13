import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Tỉ lệ vùng an toàn dùng cho mọi preset thiết bị (src/render/devices.ts). */
const SAFE_TOP = 0.3;
const SAFE_BOTTOM = 0.14;

type DrawOp =
  | { op: 'rect'; x: number; y: number; w: number; h: number }
  | { op: 'text'; x: number; y: number; text: string; size: number }
  | { op: 'dot'; x: number; y: number; r: number };

async function previewHash(page: Page): Promise<string> {
  return page.evaluate(async () => {
    const img = document.querySelector('[data-testid="preview"]') as HTMLImageElement;
    const res = await fetch(img.src);
    const buf = await res.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  });
}

async function waitPreviewSize(page: Page, w: number, h: number): Promise<void> {
  await expect
    .poll(() => page.getByTestId('preview').evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBe(w);
  await expect
    .poll(() => page.getByTestId('preview').evaluate((img: HTMLImageElement) => img.naturalHeight))
    .toBe(h);
}

/** Mọi op trong `__lastOps` phải nằm trong vùng an toàn dọc [safeTop*h, (1-safeBottom)*h].
 * Text dùng baseline alphabetic -> nới biên độ một cỡ chữ để không bắt lỗi phần thân/đuôi chữ. */
async function assertOpsInSafeArea(page: Page, deviceHeight: number): Promise<void> {
  const top = deviceHeight * SAFE_TOP;
  const bottom = deviceHeight * (1 - SAFE_BOTTOM);
  const ops = await page.evaluate(() => (window as unknown as { __lastOps?: DrawOp[] }).__lastOps ?? []);
  expect(ops.length).toBeGreaterThan(0);
  for (const o of ops) {
    if (o.op === 'rect') {
      expect(o.y).toBeGreaterThanOrEqual(top - 1);
      expect(o.y + o.h).toBeLessThanOrEqual(bottom + 1);
    } else if (o.op === 'text') {
      expect(o.y).toBeGreaterThanOrEqual(top - o.size);
      expect(o.y).toBeLessThanOrEqual(bottom + o.size);
    } else {
      expect(o.y - o.r).toBeGreaterThanOrEqual(top - 1);
      expect(o.y + o.r).toBeLessThanOrEqual(bottom + 1);
    }
  }
}

test('M4: ảnh nền -> blur -> mờ -> vị trí -> font, mỗi bước preview đổi và ops trong vùng an toàn', async ({ page }) => {
  await page.goto('/?test=1');

  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await assertOpsInSafeArea(page, 2778);
  const h0 = await previewHash(page);

  // Tải ảnh fixture -> preview đổi, kích thước vẫn bằng thiết bị.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('bg-file').setInputFiles(path.join(__dirname, '..', 'fixtures', 'photo-4000x3000.jpg'));
  await expect(page.getByTestId('bg-kind-photo')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await expect.poll(() => previewHash(page)).not.toBe(h0);
  const h1 = await previewHash(page);

  // blur=2
  await page.getByTestId('tab-design').click();
  await page.getByTestId('blur-2').click();
  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await expect.poll(() => previewHash(page)).not.toBe(h1);
  await assertOpsInSafeArea(page, 2778);
  const h2 = await previewHash(page);

  // dim=0.4
  await page.getByTestId('tab-design').click();
  await page.getByTestId('dim').fill('0.4');
  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await expect.poll(() => previewHash(page)).not.toBe(h2);
  const h3 = await previewHash(page);

  // position=bottom
  await page.getByTestId('tab-design').click();
  await page.getByTestId('position-bottom').click();
  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await expect.poll(() => previewHash(page)).not.toBe(h3);
  await assertOpsInSafeArea(page, 2778);
  const h4 = await previewHash(page);

  // font=serif
  await page.getByTestId('tab-design').click();
  await page.getByTestId('font-serif').click();
  await page.getByTestId('tab-preview').click();
  await waitPreviewSize(page, 1284, 2778);
  await expect.poll(() => previewHash(page)).not.toBe(h4);
  await assertOpsInSafeArea(page, 2778);
});

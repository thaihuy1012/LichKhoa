import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Băm SHA-256 nội dung PNG hiện tại của preview để so sánh "có đổi hay không" giữa các bước. */
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

async function waitPreview1284(page: Page): Promise<void> {
  await expect
    .poll(() => page.getByTestId('preview').evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBe(1284);
}

test('Thiết kế: đổi từng tùy chọn -> preview đổi; chọn ảnh -> boxAlpha 0.35', async ({ page }) => {
  await page.goto('/?test=1');

  await page.getByTestId('tab-preview').click();
  await expect(page.getByTestId('preview')).toBeVisible();
  await waitPreview1284(page);
  const h0 = await previewHash(page);

  // Vị trí: middle (mặc định) -> top.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('position-top').click();
  await page.getByTestId('tab-preview').click();
  await waitPreview1284(page);
  await expect.poll(() => previewHash(page)).not.toBe(h0);
  const h1 = await previewHash(page);

  // Font: sans -> serif.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('font-serif').click();
  await page.getByTestId('tab-preview').click();
  await waitPreview1284(page);
  await expect.poll(() => previewHash(page)).not.toBe(h1);
  const h2 = await previewHash(page);

  // Chọn ảnh nền -> kind chuyển 'photo', boxAlpha tự hạ còn 0.35 (D-012), preview vẫn 1284x2778.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('bg-file').setInputFiles(path.join(__dirname, '..', 'fixtures', 'photo-4000x3000.jpg'));
  await expect(page.getByTestId('box-alpha')).toHaveValue('0.35');
  await expect(page.getByTestId('bg-kind-photo')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('tab-preview').click();
  await waitPreview1284(page);
  await expect
    .poll(() => page.getByTestId('preview').evaluate((img: HTMLImageElement) => img.naturalHeight))
    .toBe(2778);
  await expect.poll(() => previewHash(page)).not.toBe(h2);
  const h3 = await previewHash(page);

  // Mờ (ảnh nền): 0 -> 2.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('blur-2').click();
  await page.getByTestId('tab-preview').click();
  await waitPreview1284(page);
  await expect.poll(() => previewHash(page)).not.toBe(h3);
  const h4 = await previewHash(page);

  // Tối (ảnh nền): 0 -> 0.5.
  await page.getByTestId('tab-design').click();
  await page.getByTestId('dim').fill('0.5');
  await page.getByTestId('tab-preview').click();
  await waitPreview1284(page);
  await expect.poll(() => previewHash(page)).not.toBe(h4);
});

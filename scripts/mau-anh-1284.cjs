// Dựng ảnh mẫu 1284×2778 (iPhone 13 Pro Max) từ bản build `dist` để Quản lý xem bằng mắt. Dùng: npm run build; node scripts/mau-anh-1284.cjs <đường-dẫn-ra.png>
const { createRequire } = require('module');
const req = createRequire('E:/DuAn/thu-nghiem/package.json');
const { chromium } = req('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');

const OUT = process.argv[2];
const PORT = 4190;

(async () => {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: 'E:/DuAn/thu-nghiem', shell: true, stdio: 'ignore',
  });
  try {
    // chờ server lên
    for (let i = 0; i < 60; i++) {
      try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
      viewport: { width: 428, height: 926 }, screen: { width: 428, height: 926 }, deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`);
    const img = page.getByTestId('preview');
    await img.waitFor();
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="preview"]');
      return el && el.naturalWidth === 1284 && el.naturalHeight === 2778;
    });
    const b64 = await img.evaluate(async (el) => {
      const blob = await (await fetch(el.src)).blob();
      const buf = new Uint8Array(await blob.arrayBuffer());
      let s = ''; for (const c of buf) s += String.fromCharCode(c);
      return btoa(s);
    });
    fs.writeFileSync(OUT, Buffer.from(b64, 'base64'));
    console.log('ok', OUT, fs.statSync(OUT).size, 'bytes');
    await browser.close();
  } finally {
    spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { shell: true, stdio: 'ignore' });
  }
})().catch((e) => { console.error(e); process.exit(1); });

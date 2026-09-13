// Chụp màn hình: tab Sự kiện (events) hoặc tab Preview (preview) trên webkit iPhone 13 Pro Max.
// Dùng: npm run build; node scripts/chup.cjs <events|preview> <thư-mục-ra> [--lang en] [--port N]
const { createRequire } = require('module');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const req = createRequire(path.join(repoRoot, 'package.json'));
const { webkit, devices } = req('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');

const mode = process.argv[2]; // 'events' hoặc 'preview'
const OUTDIR = process.argv[3];
let PORT = 4191;
let lang = 'vi';

const portIdx = process.argv.indexOf('--port');
if (portIdx !== -1 && portIdx + 1 < process.argv.length) {
  PORT = parseInt(process.argv[portIdx + 1], 10);
}

const langIdx = process.argv.indexOf('--lang');
if (langIdx !== -1 && langIdx + 1 < process.argv.length) {
  lang = process.argv[langIdx + 1];
}

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: repoRoot, shell: true, stdio: 'ignore' });
  try {
    for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
    const browser = await webkit.launch();
    const ctx = await browser.newContext({ ...devices['iPhone 13 Pro Max'], viewport: { width: 428, height: 926 } });
    const page = await ctx.newPage();
    const url = `http://localhost:${PORT}/`;
    await page.goto(url);

    const state = {
      version: 1,
      device: { id: 'iphone-1284x2778', label: 'iPhone 12/13 Pro Max', width: 1284, height: 2778, safeTop: 0.30, safeBottom: 0.14 },
      events: [
        { id: 'e1', title: 'Họp nhóm dự án', date: addDays(0), time: '07:00', durationMin: 60, repeat: 'weekdays', alarmMin: 15, color: '#ff6b6b' },
        { id: 'e2', title: 'Sinh nhật mẹ', date: addDays(0), repeat: 'yearly', color: '#51cf66' },
        { id: 'e3', title: 'Gọi khách hàng Nguyễn Văn A về hợp đồng bảo trì dài hạn năm 2027', date: addDays(0), time: '14:30', repeat: 'none', color: '#4dabf7' },
        { id: 'e4', title: 'Khám răng', date: addDays(2), time: '10:30', repeat: 'none' },
      ],
      todos: [
        { id: 't1', text: 'Mua sữa', done: false, order: 0 },
        { id: 't4', text: 'Nộp thuế', done: false, order: 3, due: addDays(-1) },
        { id: 't5', text: 'Đặt vé máy bay', done: false, order: 4, due: addDays(0) },
        { id: 't6', text: 'Gia hạn bảo hiểm', done: false, order: 5, due: addDays(5) },
        { id: 't2', text: 'Sửa vòi nước nhà tắm và gọi thợ kiểm tra lại đường ống tầng hai', done: false, order: 1 },
        { id: 't3', text: 'Gửi email cho sếp', done: true, order: 2 },
      ],
      notes: [{ id: 'n1', title: 'Ghi chú cũ', body: 'Mua quà sinh nhật', pinned: false, updated: 1 }, { id: 'n2', title: 'Việc tuần này', body: 'Nhớ mang ô, trời mưa chiều nay. Mật khẩu wifi 12345678.', pinned: true, updated: 2 }],
      design: { showNote: true, lang },
      google: { clientId: '', calendarIds: [], cache: null }, shortcutName: 'DatHinhNen',
    };

    await page.evaluate((s) => new Promise((res, rej) => {
      const o = indexedDB.open('keyval-store');
      o.onupgradeneeded = () => o.result.createObjectStore('keyval');
      o.onsuccess = () => { const tx = o.result.transaction('keyval', 'readwrite'); tx.objectStore('keyval').put(s, 'lichkhoa:state'); tx.oncomplete = () => { o.result.close(); res(); }; tx.onerror = rej; };
      o.onerror = rej;
    }), state);
    await page.goto(url);

    const shot = async (name) => { await page.screenshot({ path: path.join(OUTDIR, name + '.png') }); console.log('ok', name); };

    if (mode === 'events') {
      await page.getByTestId('tab-events').click();
      await page.waitForTimeout(600);
      await shot('1-su-kien');
      await page.getByTestId('ev-item').first().click();
      await page.waitForTimeout(600);
      await shot('2-sheet-sua');
      await page.getByTestId('ev-cancel').click();
      await page.waitForTimeout(400);
      await page.getByTestId('add-event').click();
      await page.waitForTimeout(600);
      await shot('3-sheet-moi');
      await page.getByTestId('ev-cancel').click();
      await page.waitForTimeout(400);
      await page.getByTestId('seg-todos').click();
      await page.waitForTimeout(400);
      await shot('4-viec');
      await page.getByTestId('seg-note').click();
      await page.waitForTimeout(400);
      await shot('5-ghi-chu');
      await page.getByTestId('note-item').first().click();
      await page.waitForTimeout(600);
      await shot('6-sheet-ghi-chu');
    } else if (mode === 'preview') {
      await page.waitForFunction(() => { const el = document.querySelector('[data-testid="preview"]'); return el && el.naturalWidth === 1284; });
      await page.waitForTimeout(500);
      await shot('1-preview-dau');
      await page.evaluate(() => { const s = document.querySelector('.preview-screen'); if (s) s.scrollTop = s.scrollHeight; window.scrollTo(0, document.body.scrollHeight); });
      await page.waitForTimeout(400);
      await shot('2-preview-cai-dat');
      await page.getByTestId('layout-agenda').click();
      await page.waitForTimeout(800);
      await page.evaluate(() => { const s = document.querySelector('.preview-screen'); if (s) s.scrollTop = 0; });
      await page.waitForTimeout(300);
      await shot('3-preview-agenda');
    }

    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    console.log('scrollWidth/clientWidth', sw);
    await browser.close();
  } finally {
    server.kill();
  }
})().catch((e) => { console.error(e); process.exit(1); });

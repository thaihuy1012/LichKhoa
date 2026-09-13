// Dựng ảnh mẫu: 18 ảnh (3 bố cục × 2 showNote × 3 số mục) + 3 tấm tổng hợp.
// Dùng: npm run build; node scripts/mau-anh.cjs <thư-mục-ra> [--port N]
const { createRequire } = require('module');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const req = createRequire(path.join(repoRoot, 'package.json'));
const { chromium } = req('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');

const OUTDIR = process.argv[2];
let PORT = 4190;
const portIdx = process.argv.indexOf('--port');
if (portIdx !== -1 && portIdx + 1 < process.argv.length) {
  PORT = parseInt(process.argv[portIdx + 1], 10);
}

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

function events(n) {
  const titles = ['Họp nhóm dự án', 'Khám răng', 'Sinh nhật mẹ', 'Đón con', 'Gọi khách hàng Nguyễn Văn A về hợp đồng bảo trì dài hạn năm 2027',
    'Tập gym', 'Nộp báo cáo', 'Cà phê với Minh', 'Đi chợ', 'Học tiếng Anh', 'Họp phụ huynh', 'Thanh toán điện nước', 'Chạy bộ', 'Xem phim', 'Đọc sách'];
  const colors = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', undefined];
  return Array.from({ length: n }, (_, i) => ({
    id: 'e' + i, title: titles[i % titles.length], date: addDays(i % 7),
    time: i % 4 === 2 ? undefined : `${pad(7 + (i * 3) % 14)}:${i % 2 ? '30' : '00'}`,
    repeat: 'none', color: colors[i % colors.length],
  }));
}

function todos(n) {
  const texts = ['Mua sữa', 'Gửi email cho sếp', 'Sửa vòi nước nhà tắm và gọi thợ kiểm tra lại đường ống tầng hai', 'Đặt vé máy bay', 'Gia hạn bảo hiểm',
    'Tưới cây', 'Dọn tủ lạnh', 'Trả sách thư viện', 'Rút tiền', 'Mua quà', 'Đổi dầu xe', 'In tài liệu', 'Gọi bà', 'Rửa xe', 'Đóng học phí'];
  return Array.from({ length: n }, (_, i) => ({ id: 't' + i, text: texts[i % texts.length], done: i % 3 === 1, order: i, due: i % 4 === 0 ? addDays(-1) : i % 4 === 2 ? addDays(0) : i % 5 === 3 ? addDays(3) : undefined }));
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: repoRoot, shell: true, stdio: 'ignore' });
  try {
    for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 428, height: 926 }, screen: { width: 428, height: 926 }, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    const url = `http://localhost:${PORT}/?test=1`;
    await page.goto(url);
    for (const layout of ['month', 'agenda', 'todo']) {
      const shots = [];
      for (const showNote of [false, true]) {
        for (const n of [0, 2, 15]) {
          const state = {
            version: 1,
            device: { id: 'iphone-1284x2778', label: 'iPhone 12/13 Pro Max', width: 1284, height: 2778, safeTop: 0.30, safeBottom: 0.14 },
            design: { layout, showNote },
            notes: [{ id: 'n1', title: 'Ghi chú cũ', body: 'Không được hiện', pinned: false, updated: 1 }, { id: 'n2', title: 'Việc tuần này', body: 'Nhớ mang ô, trời mưa chiều nay. Mật khẩu wifi nhà mới 12345678. Cuối tuần về quê thăm ông bà.', pinned: true, updated: 2 }],
            events: events(n), todos: todos(n),
            google: { clientId: '', calendarIds: [], cache: null }, shortcutName: 'LichKhoa',
          };
          await page.evaluate((s) => new Promise((res, rej) => {
            const o = indexedDB.open('keyval-store');
            o.onupgradeneeded = () => o.result.createObjectStore('keyval');
            o.onsuccess = () => { const tx = o.result.transaction('keyval', 'readwrite'); tx.objectStore('keyval').put(s, 'lichkhoa:state'); tx.oncomplete = () => { o.result.close(); res(); }; tx.onerror = rej; };
            o.onerror = rej;
          }), state);
          await page.goto(url);
          await page.waitForFunction(() => { const el = document.querySelector('[data-testid="preview"]'); return el && el.naturalWidth === 1284 && el.naturalHeight === 2778; });
          await page.waitForTimeout(400);
          const b64 = await page.getByTestId('preview').evaluate(async (el) => {
            const buf = new Uint8Array(await (await fetch(el.src)).arrayBuffer()); let s = ''; for (const c of buf) s += String.fromCharCode(c); return btoa(s);
          });
          const f = path.join(OUTDIR, `${layout}-note${showNote ? 1 : 0}-${n}.png`);
          fs.writeFileSync(f, Buffer.from(b64, 'base64'));
          shots.push({ b64, label: `${layout} note=${showNote} n=${n}` });
        }
      }
      const sheet = await page.evaluate(async (shots) => {
        const W = 428, H = 926, c = document.createElement('canvas'); c.width = W * 3 + 20; c.height = (H + 30) * 2; const g = c.getContext('2d');
        g.fillStyle = '#888'; g.fillRect(0, 0, c.width, c.height);
        for (let i = 0; i < shots.length; i++) {
          const img = new Image(); img.src = 'data:image/png;base64,' + shots[i].b64; await img.decode();
          const x = (i % 3) * (W + 10), y = Math.floor(i / 3) * (H + 30);
          g.drawImage(img, x, y + 30, W, H); g.fillStyle = '#ff0'; g.font = 'bold 18px sans-serif'; g.fillText(shots[i].label, x + 6, y + 22);
        }
        return c.toDataURL('image/png').split(',')[1];
      }, shots);
      fs.writeFileSync(path.join(OUTDIR, `tong-${layout}.png`), Buffer.from(sheet, 'base64'));
      console.log('ok', layout);
    }
    await browser.close();
  } finally {
    server.kill();
  }
})().catch((e) => { console.error(e); process.exit(1); });

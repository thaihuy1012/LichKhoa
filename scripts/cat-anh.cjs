// Cắt và phóng ảnh PNG.
// Dùng: node scripts/cat-anh.cjs <vào.png> <ra.png> x y w h [phóng]
const { createRequire } = require('module');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const req = createRequire(path.join(repoRoot, 'package.json'));
const { chromium } = req('@playwright/test');
const fs = require('fs');

const [src, out, x, y, w, h, s] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const b64 = fs.readFileSync(src).toString('base64');
  const r = await p.evaluate(async ([b64, x, y, w, h, s]) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = w * s; c.height = h * s; const g = c.getContext('2d');
    g.imageSmoothingEnabled = false; g.drawImage(img, x, y, w, h, 0, 0, w * s, h * s);
    return c.toDataURL('image/png').split(',')[1];
  }, [b64, +x, +y, +w, +h, +(s || 1)]);
  fs.writeFileSync(out, Buffer.from(r, 'base64')); await b.close(); console.log('ok');
})();

import { describe, it, expect } from 'vitest';
import { coverFit, fitDownscale, blurDownsampleRatio } from '../../src/render/background';

describe('coverFit', () => {
  it('ảnh ngang (rộng hơn) vào khung dọc: khớp chiều cao, tràn ngang, canh giữa', () => {
    // khung dọc 1000x2000, ảnh ngang 4000x3000 (tỉ lệ 4:3)
    const fit = coverFit(4000, 3000, 1000, 2000);
    expect(fit.dh).toBeCloseTo(2000, 5); // khớp chiều cao khung
    expect(fit.dw).toBeGreaterThan(1000); // tràn ngang
    expect(fit.dy).toBeCloseTo(0, 5);
    expect(fit.dx).toBeCloseTo((1000 - fit.dw) / 2, 5); // canh giữa theo chiều ngang
  });

  it('ảnh dọc (cao hơn) vào khung ngang: khớp chiều rộng, tràn dọc, canh giữa', () => {
    const fit = coverFit(1000, 2000, 2000, 1000);
    expect(fit.dw).toBeCloseTo(2000, 5);
    expect(fit.dh).toBeGreaterThan(1000);
    expect(fit.dx).toBeCloseTo(0, 5);
    expect(fit.dy).toBeCloseTo((1000 - fit.dh) / 2, 5);
  });

  it('ảnh cùng tỉ lệ khung: phủ khít, không tràn', () => {
    const fit = coverFit(2000, 4000, 1000, 2000);
    expect(fit.dw).toBeCloseTo(1000, 5);
    expect(fit.dh).toBeCloseTo(2000, 5);
    expect(fit.dx).toBeCloseTo(0, 5);
    expect(fit.dy).toBeCloseTo(0, 5);
  });

  it('kích thước ảnh 0 → trả về khung nguyên vẹn, không chia cho 0', () => {
    const fit = coverFit(0, 0, 1000, 2000);
    expect(fit).toEqual({ dw: 1000, dh: 2000, dx: 0, dy: 0 });
  });
});

describe('fitDownscale', () => {
  it('ảnh nhỏ hơn giới hạn (≤ 2× thiết bị) → giữ nguyên kích thước', () => {
    const r = fitDownscale(1000, 800, 1284, 2778, 2);
    expect(r).toEqual({ w: 1000, h: 800 });
  });

  it('ảnh lớn hơn giới hạn → thu nhỏ, không vượt quá 2× thiết bị, giữ tỉ lệ', () => {
    // thiết bị 1284x2778 → giới hạn 2568x5556; ảnh 4000x3000 vượt chiều rộng
    const dev = { w: 1284, h: 2778 };
    const r = fitDownscale(4000, 3000, dev.w, dev.h, 2);
    expect(r.w).toBeLessThanOrEqual(dev.w * 2);
    expect(r.h).toBeLessThanOrEqual(dev.h * 2);
    // giữ tỉ lệ gốc 4:3
    expect(r.w / r.h).toBeCloseTo(4000 / 3000, 2);
    // đúng bằng giới hạn theo chiều bị ràng buộc (chiều rộng ở đây)
    expect(r.w).toBe(dev.w * 2);
  });

  it('maxScale mặc định là 2', () => {
    const r = fitDownscale(10000, 10000, 1000, 1000);
    expect(r.w).toBe(2000);
    expect(r.h).toBe(2000);
  });
});

describe('blurDownsampleRatio', () => {
  it('blur=0 → không hạ mẫu (tỉ lệ 1)', () => {
    expect(blurDownsampleRatio(0)).toBe(1);
  });

  it('blur tăng dần → tỉ lệ hạ mẫu giảm dần (mờ hơn)', () => {
    const r1 = blurDownsampleRatio(1);
    const r2 = blurDownsampleRatio(2);
    const r3 = blurDownsampleRatio(3);
    expect(r1).toBeLessThan(1);
    expect(r2).toBeLessThan(r1);
    expect(r3).toBeLessThan(r2);
    expect(r3).toBeGreaterThan(0);
  });
});

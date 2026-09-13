import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('môi trường test chạy được', () => {
    expect(1 + 1).toBe(2);
  });

  it('giữ nguyên giờ địa phương bất kể TZ', () => {
    const d = new Date(2026, 0, 15, 10, 0, 0);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(15);
  });
});

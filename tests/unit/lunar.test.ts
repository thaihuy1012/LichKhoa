import { describe, it, expect } from 'vitest';
import { solarToLunar, lunarYearName } from '../../src/core/lunar';

describe('solarToLunar', () => {
  it('2026-02-17 -> 1/1 năm Bính Ngọ', () => {
    const l = solarToLunar('2026-02-17');
    expect(l).toEqual({ day: 1, month: 1, year: 2026, leap: false });
    expect(lunarYearName(l.year)).toBe('Bính Ngọ');
  });

  it('2025-01-29 -> 1/1 Ất Tỵ', () => {
    const l = solarToLunar('2025-01-29');
    expect(l).toEqual({ day: 1, month: 1, year: 2025, leap: false });
    expect(lunarYearName(l.year)).toBe('Ất Tỵ');
  });

  it('2024-02-10 -> 1/1 Giáp Thìn', () => {
    const l = solarToLunar('2024-02-10');
    expect(l).toEqual({ day: 1, month: 1, year: 2024, leap: false });
    expect(lunarYearName(l.year)).toBe('Giáp Thìn');
  });

  it('2023-03-22 -> 1/2 nhuận', () => {
    const l = solarToLunar('2023-03-22');
    expect(l).toEqual({ day: 1, month: 2, year: 2023, leap: true });
  });

  it('2025-07-25 -> 1/6 nhuận', () => {
    const l = solarToLunar('2025-07-25');
    expect(l).toEqual({ day: 1, month: 6, year: 2025, leap: true });
  });

  it('2026-02-16 -> 29/12 năm Ất Tỵ (tháng Chạp thiếu, không có 30 Tết)', () => {
    const l = solarToLunar('2026-02-16');
    expect(l).toEqual({ day: 29, month: 12, year: 2025, leap: false });
    expect(lunarYearName(l.year)).toBe('Ất Tỵ');
  });
});

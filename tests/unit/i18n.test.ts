import { describe, it, expect } from 'vitest';
import { t } from '../../src/core/i18n';
import vi from '../../src/core/i18n/vi.json';
import en from '../../src/core/i18n/en.json';

describe('i18n', () => {
  it('tập khóa vi = tập khóa en', () => {
    const viKeys = Object.keys(vi).sort();
    const enKeys = Object.keys(en).sort();
    expect(viKeys).toEqual(enKeys);
    expect(viKeys.length).toBeGreaterThan(0);
  });

  it('trả đúng chuỗi theo lang', () => {
    expect(t('tab.preview', 'vi')).toBe('Xem trước');
    expect(t('tab.preview', 'en')).toBe('Preview');
  });

  it('khóa thiếu trả về chính key', () => {
    expect(t('khong.ton.tai', 'vi')).toBe('khong.ton.tai');
    expect(t('khong.ton.tai', 'en')).toBe('khong.ton.tai');
  });

  it('thay biến {var} đúng trong chuỗi', () => {
    expect(t('sync.lastSync', 'vi', { time: '10:30' })).toBe('Đồng bộ lần cuối: 10:30');
    expect(t('sync.lastSync', 'en', { time: '10:30' })).toBe('Last synced: 10:30');
  });

  it('không có var truyền vào thì giữ nguyên placeholder', () => {
    expect(t('sync.lastSync', 'vi')).toBe('Đồng bộ lần cuối: {time}');
  });

  it('weekday và month có đủ 7/12 khóa', () => {
    for (let i = 0; i < 7; i++) {
      expect(t(`weekday.short.${i}`, 'vi')).not.toBe(`weekday.short.${i}`);
      expect(t(`weekday.long.${i}`, 'vi')).not.toBe(`weekday.long.${i}`);
    }
    for (let i = 0; i < 12; i++) {
      expect(t(`month.${i}`, 'vi')).not.toBe(`month.${i}`);
    }
  });
});

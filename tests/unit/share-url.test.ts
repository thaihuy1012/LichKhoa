import { describe, it, expect } from 'vitest';
import { shortcutUrl } from '../../src/export/share';

describe('shortcutUrl', () => {
  it("shortcutUrl('ThemBaoThuc','2026-09-20 07:30\\nHọp') -> URL input=text đúng mã hóa", () => {
    expect(shortcutUrl('ThemBaoThuc', '2026-09-20 07:30\nHọp')).toBe(
      'shortcuts://run-shortcut?name=ThemBaoThuc&input=text&text=2026-09-20%2007%3A30%0AH%E1%BB%8Dp'
    );
  });

  it('không có text -> input=clipboard (không đổi, IN-6)', () => {
    expect(shortcutUrl('DatHinhNen')).toBe('shortcuts://run-shortcut?name=DatHinhNen&input=clipboard');
  });
});

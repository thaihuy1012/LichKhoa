import { describe, it, expect } from 'vitest';
import { defaultReminderAt, reminderWindow, reminderText } from '../../src/export/reminder';
import type { ReminderSource } from '../../src/export/reminder';

describe('reminderText', () => {
  it("reminderText('2026-09-20T07:30','Họp nhóm') = '20 Sep 2026 07:30\\nHọp nhóm'", () => {
    expect(reminderText('2026-09-20T07:30', 'Họp nhóm')).toBe('20 Sep 2026 07:30\nHọp nhóm');
  });

  it('ghi chú 2 dòng -> đúng 3 dòng, dòng 2-3 không chứa \\n', () => {
    const result = reminderText('2026-09-20T07:30', 'Họp nhóm', 'Dòng 1\nDòng 2');
    const lines = result.split('\n');
    expect(lines.length).toBe(3);
    expect(lines[1]).not.toMatch(/\n/);
    expect(lines[2]).not.toMatch(/\n/);
    expect(lines[2]).toBe('Dòng 1 · Dòng 2');
  });

  it('tiêu đề rỗng -> LichKhoa', () => {
    expect(reminderText('2026-09-20T07:30', '')).toBe('20 Sep 2026 07:30\nLichKhoa');
  });

  it('ngày 1 chữ số không đệm 0', () => {
    expect(reminderText('2026-09-03T07:30', 'X')).toBe('3 Sep 2026 07:30\nX');
  });

  it('tháng đầu năm -> Jan', () => {
    expect(reminderText('2027-01-03T08:05', 'X')).toBe('3 Jan 2027 08:05\nX');
  });

  it('tháng cuối năm -> Dec', () => {
    expect(reminderText('2026-12-25T14:00', 'X')).toBe('25 Dec 2026 14:00\nX');
  });

  it('giờ có đệm 0', () => {
    expect(reminderText('2026-09-03T08:05', 'X')).toBe('3 Sep 2026 08:05\nX');
  });

  it('nửa đêm', () => {
    expect(reminderText('2026-09-03T00:00', 'X')).toBe('3 Sep 2026 00:00\nX');
  });

  it('cắt 100/200 ký tự', () => {
    const longTitle = 'a'.repeat(150);
    const longNote = 'b'.repeat(300);
    const result = reminderText('2026-09-20T07:30', longTitle, longNote);
    const lines = result.split('\n');
    expect(lines[1].length).toBe(100);
    expect(lines[2].length).toBe(200);
  });

  it('cắt tiêu đề không vỡ emoji khi biên 100 rơi giữa cặp thay thế', () => {
    // '🎉' chiếm 2 đơn vị UTF-16; với cách cắt cũ (slice theo UTF-16),
    // tiền tố 'x' (1 đơn vị) làm biên 100 rơi đúng giữa emoji thứ 50.
    const longTitle = 'x' + '🎉'.repeat(150);
    expect(() => encodeURIComponent(reminderText('2026-09-20T07:30', longTitle))).not.toThrow();
    const result = reminderText('2026-09-20T07:30', longTitle);
    const line2 = result.split('\n')[1];
    const loneSurrogates = line2
      .split('')
      .filter((ch, i) => {
        const code = ch.charCodeAt(0);
        const isHigh = code >= 0xd800 && code <= 0xdbff;
        const isLow = code >= 0xdc00 && code <= 0xdfff;
        if (!isHigh && !isLow) return false;
        if (isHigh) {
          const next = line2.charCodeAt(i + 1);
          return !(next >= 0xdc00 && next <= 0xdfff);
        }
        const prev = line2.charCodeAt(i - 1);
        return !(prev >= 0xd800 && prev <= 0xdbff);
      });
    expect(loneSurrogates.length).toBe(0);
    expect(Array.from(line2).length).toBe(100);
  });

  it('cắt ghi chú không vỡ emoji khi biên 200 rơi giữa cặp thay thế', () => {
    const longNote = 'x' + '🎉'.repeat(220);
    expect(() =>
      encodeURIComponent(reminderText('2026-09-20T07:30', 'tiêu đề', longNote)),
    ).not.toThrow();
    const result = reminderText('2026-09-20T07:30', 'tiêu đề', longNote);
    const line3 = result.split('\n')[2];
    const loneSurrogates = line3
      .split('')
      .filter((ch, i) => {
        const code = ch.charCodeAt(0);
        const isHigh = code >= 0xd800 && code <= 0xdbff;
        const isLow = code >= 0xdc00 && code <= 0xdfff;
        if (!isHigh && !isLow) return false;
        if (isHigh) {
          const next = line3.charCodeAt(i + 1);
          return !(next >= 0xdc00 && next <= 0xdfff);
        }
        const prev = line3.charCodeAt(i - 1);
        return !(prev >= 0xd800 && prev <= 0xdbff);
      });
    expect(loneSurrogates.length).toBe(0);
    expect(Array.from(line3).length).toBe(200);
  });
});

describe('defaultReminderAt', () => {
  it('sự kiện lặp tuần bắt đầu 60 ngày trước có giờ -> lần kế tiếp > now, đúng thứ', () => {
    const now = new Date(2026, 5, 15, 10, 0); // 15/06/2026 10:00
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60);
    const startIso = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
    const src: ReminderSource = { kind: 'event', date: startIso, time: '09:00', repeat: 'weekly' };
    const result = defaultReminderAt(src, now);
    expect(result.endsWith('T09:00')).toBe(true);
    const [datePart] = result.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const resultDate = new Date(y, m - 1, d, 9, 0);
    expect(resultDate.getTime()).toBeGreaterThan(now.getTime());
    expect(resultDate.getDay()).toBe(start.getDay());
  });

  it('sự kiện cả ngày -> T08:00', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    const src: ReminderSource = { kind: 'event', date: '2026-06-20', repeat: 'none' };
    expect(defaultReminderAt(src, now)).toBe('2026-06-20T08:00');
  });

  it('sự kiện until đã qua -> ngày + giờ đang nhập', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    const src: ReminderSource = { kind: 'event', date: '2026-01-01', time: '09:00', repeat: 'weekly', until: '2026-01-10' };
    expect(defaultReminderAt(src, now)).toBe('2026-01-01T09:00');
  });

  it('việc có hạn -> <due>T08:00', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    const src: ReminderSource = { kind: 'todo', due: '2026-06-25' };
    expect(defaultReminderAt(src, now)).toBe('2026-06-25T08:00');
  });

  it('việc không hạn / ghi chú: now 09:10 -> T10:00', () => {
    const now = new Date(2026, 5, 15, 9, 10);
    expect(defaultReminderAt({ kind: 'todo' }, now)).toBe('2026-06-15T10:00');
    expect(defaultReminderAt({ kind: 'note' }, now)).toBe('2026-06-15T10:00');
  });

  it('việc không hạn / ghi chú: now 09:00 -> T10:00', () => {
    const now = new Date(2026, 5, 15, 9, 0);
    expect(defaultReminderAt({ kind: 'todo' }, now)).toBe('2026-06-15T10:00');
    expect(defaultReminderAt({ kind: 'note' }, now)).toBe('2026-06-15T10:00');
  });

  it('việc không hạn / ghi chú: now 23:10 -> 00:00 hôm sau', () => {
    const now = new Date(2026, 5, 15, 23, 10);
    expect(defaultReminderAt({ kind: 'todo' }, now)).toBe('2026-06-16T00:00');
    expect(defaultReminderAt({ kind: 'note' }, now)).toBe('2026-06-16T00:00');
  });
});

describe('reminderWindow', () => {
  it('at = now -> past', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    expect(reminderWindow('2026-06-15T10:00', now)).toBe('past');
  });

  it('now + 1 phút -> alarm-ok', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    expect(reminderWindow('2026-06-15T10:01', now)).toBe('alarm-ok');
  });

  it('now + 24h -> alarm-ok', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    expect(reminderWindow('2026-06-16T10:00', now)).toBe('alarm-ok');
  });

  it('now + 24h1phút -> reminder-only', () => {
    const now = new Date(2026, 5, 15, 10, 0);
    expect(reminderWindow('2026-06-16T10:01', now)).toBe('reminder-only');
  });
});

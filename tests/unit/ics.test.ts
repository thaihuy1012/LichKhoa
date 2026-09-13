import { describe, it, expect } from 'vitest';
import { eventToIcs } from '../../src/export/ics';
import type { LocalEvent } from '../../src/core/model';

const now = new Date('2026-09-13T10:20:30.500Z');

describe('eventToIcs', () => {
  it('sự kiện có giờ: DTSTART/DTEND floating local, DTEND = DTSTART + durationMin', () => {
    const e: LocalEvent = {
      id: 'e1',
      title: 'Hop',
      date: '2026-09-13',
      time: '09:30',
      durationMin: 45,
      repeat: 'none',
    };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics).toContain('VERSION:2.0\r\n');
    expect(ics).toContain('BEGIN:VEVENT\r\n');
    expect(ics).toContain('DTSTART:20260913T093000\r\n');
    expect(ics).toContain('DTEND:20260913T101500\r\n');
    expect(ics).toContain('END:VEVENT\r\n');
    expect(ics).toContain('END:VCALENDAR\r\n');
    expect(ics.endsWith('\r\n')).toBe(true);
  });

  it('sự kiện có giờ, không durationMin: mặc định 60 phút', () => {
    const e: LocalEvent = { id: 'e2', title: 'A', date: '2026-01-01', time: '23:30', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTART:20260101T233000\r\n');
    expect(ics).toContain('DTEND:20260102T003000\r\n');
  });

  it('sự kiện cả ngày: DTSTART/DTEND VALUE=DATE, DTEND = ngày kế tiếp', () => {
    const e: LocalEvent = { id: 'e3', title: 'Nghi le', date: '2026-04-30', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260430\r\n');
    expect(ics).toContain('DTEND;VALUE=DATE:20260501\r\n');
  });

  it('RRULE theo repeat + UNTIL', () => {
    const e: LocalEvent = {
      id: 'e4',
      title: 'Lap lai',
      date: '2026-01-05',
      repeat: 'weekly',
      until: '2026-12-31',
    };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('RRULE:FREQ=WEEKLY;UNTIL=20261231\r\n');
  });

  it('repeat weekdays (v1.3): RRULE FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', () => {
    const e: LocalEvent = { id: 'e9', title: 'Lam', date: '2026-01-05', repeat: 'weekdays' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR\r\n');
  });

  it('alarmMin=15 (v1.3): VALARM trong VEVENT với TRIGGER:-PT15M', () => {
    const e: LocalEvent = { id: 'e10', title: 'Nhac', date: '2026-01-05', repeat: 'none', alarmMin: 15 };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('BEGIN:VALARM\r\n');
    expect(ics).toContain('TRIGGER:-PT15M\r\n');
    expect(ics).toContain('ACTION:DISPLAY\r\n');
    expect(ics).toContain('DESCRIPTION:Nhac\r\n');
    expect(ics).toContain('END:VALARM\r\n');
    expect(ics.indexOf('BEGIN:VALARM')).toBeGreaterThan(ics.indexOf('BEGIN:VEVENT'));
    expect(ics.indexOf('END:VALARM')).toBeLessThan(ics.lastIndexOf('END:VEVENT'));
  });

  it('alarmMin=1440 (v1.3): TRIGGER:-P1D', () => {
    const e: LocalEvent = { id: 'e11', title: 'X', date: '2026-01-05', repeat: 'none', alarmMin: 1440 };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('TRIGGER:-P1D\r\n');
  });

  it('không alarmMin (v1.3): không có VALARM', () => {
    const e: LocalEvent = { id: 'e12', title: 'X', date: '2026-01-05', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).not.toContain('VALARM');
  });

  it('repeat none: không có dòng RRULE', () => {
    const e: LocalEvent = { id: 'e5', title: 'X', date: '2026-01-01', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).not.toContain('RRULE');
  });

  it('escape ; , \\ và xuống dòng trong title', () => {
    const e: LocalEvent = { id: 'e6', title: 'A;B,C\\D\nE', date: '2026-01-01', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('SUMMARY:A\\;B\\,C\\\\D\\nE\r\n');
  });

  it('mọi dòng đều kết thúc bằng CRLF (không có LF trần)', () => {
    const e: LocalEvent = { id: 'e7', title: 'X', date: '2026-01-01', repeat: 'none' };
    const ics = eventToIcs(e, now);
    const withoutCrlf = ics.replace(/\r\n/g, '');
    expect(withoutCrlf.includes('\n')).toBe(false);
  });

  it('D-012: weekdays, ngày CN (2026-09-13) -> DTSTART dời tới T2 kế tiếp (2026-09-14), giữ giờ', () => {
    const e: LocalEvent = { id: 'e13', title: 'Hop tuan', date: '2026-09-13', time: '08:00', repeat: 'weekdays' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTART:20260914T080000\r\n');
  });

  it('D-012: weekdays, ngày T7 (2026-09-12) -> DTSTART dời tới T2 (2026-09-14)', () => {
    const e: LocalEvent = { id: 'e14', title: 'Hop tuan', date: '2026-09-12', time: '08:00', repeat: 'weekdays' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTART:20260914T080000\r\n');
  });

  it('D-012: weekdays, ngày đã là T2-T6 -> không đổi ngày', () => {
    const e: LocalEvent = { id: 'e15', title: 'Hop tuan', date: '2026-09-14', time: '08:00', repeat: 'weekdays' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTART:20260914T080000\r\n');
  });

  it('D-012: tiêu đề 200 ký tự tiếng Việt -> mọi dòng vật lý <= 75 octet UTF-8, bỏ gập ra lại đúng chuỗi', () => {
    const longTitle = 'Đầu tư dự án ăn uống '.repeat(10).slice(0, 200);
    const e: LocalEvent = { id: 'e16', title: longTitle, date: '2026-01-05', repeat: 'none' };
    const ics = eventToIcs(e, now);
    const physicalLines = ics.split('\r\n');
    const enc = new TextEncoder();
    for (const line of physicalLines) {
      if (line === '') continue;
      expect(enc.encode(line).length).toBeLessThanOrEqual(75);
    }
    // Bỏ gập: nối "\r\n " (CRLF + 1 dấu cách) lại thành dòng gốc, rồi lấy lại icsEscape(longTitle)
    const unfolded = ics.replace(/\r\n /g, '');
    const summaryLine = unfolded.split('\r\n').find((l) => l.startsWith('SUMMARY:'))!;
    expect(summaryLine.slice('SUMMARY:'.length)).toBe(longTitle);
  });

  it('DTSTAMP dùng giờ UTC của `now`', () => {
    const e: LocalEvent = { id: 'e8', title: 'X', date: '2026-01-01', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTAMP:20260913T102030Z\r\n');
  });
});

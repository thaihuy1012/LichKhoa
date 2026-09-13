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

  it('DTSTAMP dùng giờ UTC của `now`', () => {
    const e: LocalEvent = { id: 'e8', title: 'X', date: '2026-01-01', repeat: 'none' };
    const ics = eventToIcs(e, now);
    expect(ics).toContain('DTSTAMP:20260913T102030Z\r\n');
  });
});

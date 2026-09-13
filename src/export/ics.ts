import type { LocalEvent } from '../core/model';

function icsEscape(s: string): string {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function parseYMD(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const FREQ: Record<string, string> = {
  daily: 'FREQ=DAILY',
  weekdays: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
  weekly: 'FREQ=WEEKLY',
  monthly: 'FREQ=MONTHLY',
  yearly: 'FREQ=YEARLY',
};

/** Chuyển một `LocalEvent` thành nội dung file .ics (VCALENDAR/VEVENT), CRLF, floating time. */
export function eventToIcs(e: LocalEvent, now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LichKhoa//VI',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + e.id + '@lichkhoa',
    'DTSTAMP:' + stamp,
    'SUMMARY:' + icsEscape(e.title || 'Sự kiện'),
  ];

  const d0 = parseYMD(e.date);
  if (e.time) {
    const [h, mi] = e.time.split(':').map(Number);
    const st = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate(), h, mi || 0);
    const en = new Date(st.getTime() + (e.durationMin ?? 60) * 60000);
    const f = (x: Date) => ymd(x).replace(/-/g, '') + 'T' + pad2(x.getHours()) + pad2(x.getMinutes()) + '00';
    lines.push('DTSTART:' + f(st));
    lines.push('DTEND:' + f(en));
  } else {
    lines.push('DTSTART;VALUE=DATE:' + e.date.replace(/-/g, ''));
    lines.push('DTEND;VALUE=DATE:' + ymd(addDays(d0, 1)).replace(/-/g, ''));
  }

  if (e.repeat && e.repeat !== 'none') {
    const base = FREQ[e.repeat];
    if (base) {
      let r = base;
      if (e.until) {
        r += ';UNTIL=' + e.until.replace(/-/g, '') + (e.time ? 'T235959' : '');
      }
      lines.push('RRULE:' + r);
    }
  }

  if (e.alarmMin) {
    const trigger = e.alarmMin === 1440 ? '-P1D' : `-PT${e.alarmMin}M`;
    lines.push('BEGIN:VALARM', 'TRIGGER:' + trigger, 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEscape(e.title || 'Sự kiện'), 'END:VALARM');
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

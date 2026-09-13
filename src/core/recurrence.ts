import type { LocalEvent, Occurrence, ISODate } from './model';
import { parseISODate, toISODate } from './calendar';

/** true nếu event `ev` diễn ra vào ngày `s` (ISODate). Port từ lich-nen.html L545-559, bỏ 'weekdays'. */
function occursOn(ev: LocalEvent, s: ISODate): boolean {
  if (s < ev.date) return false;
  if (ev.until && s > ev.until) return false;
  const start = parseISODate(ev.date);
  const cur = parseISODate(s);
  switch (ev.repeat) {
    case 'none':
      return s === ev.date;
    case 'daily':
      return true;
    case 'weekly': {
      const startDow = new Date(start.y, start.m0, start.d, 12).getDay();
      const curDow = new Date(cur.y, cur.m0, cur.d, 12).getDay();
      return startDow === curDow;
    }
    case 'monthly':
      return cur.d === start.d;
    case 'yearly':
      return cur.d === start.d && cur.m0 === start.m0;
    default:
      return false;
  }
}

function cmpOccurrence(a: Occurrence, b: Occurrence): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  const ta = a.time ?? '';
  const tb = b.time ?? '';
  if (ta !== tb) return ta < tb ? -1 : 1;
  return 0;
}

/** Duyệt từng ngày trong [from, to] (đóng cả hai đầu), sinh Occurrence cho các event khớp. */
export function expandOccurrences(events: LocalEvent[], from: ISODate, to: ISODate): Occurrence[] {
  if (from > to) return [];

  const result: Occurrence[] = [];
  const fromP = parseISODate(from);
  const toP = parseISODate(to);
  let cursor = new Date(fromP.y, fromP.m0, fromP.d, 12);
  const end = new Date(toP.y, toP.m0, toP.d, 12);

  while (cursor.getTime() <= end.getTime()) {
    const s = toISODate(cursor);
    for (const ev of events) {
      if (occursOn(ev, s)) {
        result.push({
          id: `${ev.id}@${s}`,
          sourceId: ev.id,
          source: 'local',
          title: ev.title,
          date: s,
          time: ev.time,
          allDay: !ev.time,
          color: ev.color,
        });
      }
    }
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, 12);
  }

  result.sort(cmpOccurrence);
  return result;
}

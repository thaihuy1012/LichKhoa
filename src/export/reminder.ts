import type { ISODate, LocalEvent, Repeat } from '../core/model';
import { expandOccurrences } from '../core/recurrence';

/** 'YYYY-MM-DDTHH:mm' giờ địa phương — đúng giá trị của `<input type="datetime-local">`. */
export type LocalDateTime = string;

export type ReminderSource =
  | { kind: 'event'; date: ISODate; time?: string; repeat: Repeat; until?: ISODate }
  | { kind: 'todo'; due?: ISODate }
  | { kind: 'note' };

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDateOf(d: Date): ISODate {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toLocalDateTime(d: Date): LocalDateTime {
  return `${isoDateOf(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Parse `LocalDateTime` ('YYYY-MM-DDTHH:mm') thành `Date` giờ địa phương. */
function parseLocalDateTime(at: LocalDateTime): Date {
  const [datePart, timePart] = at.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, mi] = (timePart ?? '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, h, mi);
}

function addDaysToIso(iso: ISODate, days: number): ISODate {
  const [y, m, d] = iso.split('-').map(Number);
  return isoDateOf(new Date(y, m - 1, d + days));
}

/** Giờ tròn kế tiếp: now 09:10 hoặc 09:00 -> 10:00; 23:10 -> 00:00 hôm sau. */
function nextRoundHour(now: Date): LocalDateTime {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
  return toLocalDateTime(d);
}

/** v1.8 (IN-11): mặc định ô `rem-at` theo nguồn (sự kiện/việc/ghi chú). */
export function defaultReminderAt(src: ReminderSource, now: Date): LocalDateTime {
  if (src.kind === 'event') {
    const today = isoDateOf(now);
    const horizon = addDaysToIso(today, 400);
    const tempEvent: LocalEvent = {
      id: 'reminder-tmp',
      title: '',
      date: src.date,
      repeat: src.repeat,
      ...(src.time != null ? { time: src.time } : {}),
      ...(src.until != null ? { until: src.until } : {}),
    };
    const occurrences = expandOccurrences([tempEvent], today, horizon);
    for (const occ of occurrences) {
      const at: LocalDateTime = occ.time != null ? `${occ.date}T${occ.time}` : `${occ.date}T08:00`;
      if (parseLocalDateTime(at).getTime() > now.getTime()) return at;
    }
    // Không còn lần nào (vd `until` đã qua) -> ngày + giờ đang nhập.
    return src.time != null ? `${src.date}T${src.time}` : `${src.date}T08:00`;
  }
  if (src.kind === 'todo') {
    if (src.due != null) return `${src.due}T08:00`;
    return nextRoundHour(now);
  }
  // note
  return nextRoundHour(now);
}

export type ReminderWindow = 'past' | 'alarm-ok' | 'reminder-only';

const DAY_MS = 24 * 60 * 60 * 1000;

/** v1.8 (IN-11): trạng thái thời điểm nhắc so với `now`. */
export function reminderWindow(at: LocalDateTime, now: Date): ReminderWindow {
  const diff = parseLocalDateTime(at).getTime() - now.getTime();
  if (diff <= 0) return 'past';
  if (diff <= DAY_MS) return 'alarm-ok';
  return 'reminder-only';
}

function truncate(s: string, max: number): string {
  const chars = Array.from(s);
  return chars.length > max ? chars.slice(0, max).join('') : s;
}

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Định dạng `d MMM yyyy HH:mm` (vd `23 Sep 2026 14:00`), tháng viết tắt tiếng Anh
 * cố định trong mã — KHÔNG dùng `toLocaleDateString`/`Intl` vì phụ thuộc locale máy chạy.
 * Máy thật iOS 18 không nhận dạng được `YYYY-MM-DD HH:mm` (SC-003, 2026-09-19).
 */
function formatReminderDateTime(datePart: string, timePart: string): string {
  const [y, m, d] = datePart.split('-').map(Number);
  return `${d} ${MONTH_ABBR[m - 1]} ${y} ${timePart}`;
}

/** v1.8 (IN-11): payload gửi qua Phím tắt — hợp đồng SPEC §5/§8.11. */
export function reminderText(at: LocalDateTime, title: string, note?: string): string {
  const [datePart, timePart] = at.split('T');
  const titleLine = truncate(title.replace(/\n/g, ' ').trim(), 100);
  const line2 = titleLine === '' ? 'LichKhoa' : titleLine;
  let text = `${formatReminderDateTime(datePart, timePart)}\n${line2}`;
  if (note) {
    const noteLine = truncate(note.replace(/\n/g, ' · ').trim(), 200);
    text += `\n${noteLine}`;
  }
  return text;
}

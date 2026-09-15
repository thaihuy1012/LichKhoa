import type { Occurrence, ISODate } from '../core/model';
import { toISODate, parseISODate } from '../core/calendar';

const API_BASE = 'https://www.googleapis.com/calendar/v3';
const MAX_RESULTS = 250;
const MAX_PAGES = 2; // giới hạn theo phiếu: ≤ 2 trang/lịch

/** Ném khi Google API trả 401 (token hết hạn/không hợp lệ). */
export class AuthError extends Error {
  constructor(message = 'Google auth failed (401)') {
    super(message);
    this.name = 'AuthError';
  }
}

export interface GoogleCalendarInfo {
  id: string;
  summary: string;
  color: string;
}

interface RawGoogleEventTime {
  date?: string; // all-day 'YYYY-MM-DD'
  dateTime?: string; // RFC3339 với offset
}

export interface RawGoogleEvent {
  id: string;
  status?: string;
  summary?: string;
  start?: RawGoogleEventTime;
  end?: RawGoogleEventTime;
  created?: string; // RFC3339, v1.6 (B-003): dùng để so trùng local/Google
}

async function googleGet(url: string, token: string): Promise<any> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new AuthError();
  if (!res.ok) throw new Error(`Google API error: ${res.status}`);
  return res.json();
}

/** GET .../users/me/calendarList — danh sách lịch của người dùng. */
export async function fetchCalendars(token: string): Promise<GoogleCalendarInfo[]> {
  const data = await googleGet(`${API_BASE}/users/me/calendarList`, token);
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map((it: any) => ({
    id: String(it.id),
    summary: typeof it.summary === 'string' ? it.summary : String(it.id),
    color: typeof it.backgroundColor === 'string' ? it.backgroundColor : '',
  }));
}

async function fetchRawEvents(
  token: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<RawGoogleEvent[]> {
  const events: RawGoogleEvent[] = [];
  let pageToken: string | undefined;
  let page = 0;
  do {
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: String(MAX_RESULTS),
      timeMin,
      timeMax,
    });
    if (pageToken) params.set('pageToken', pageToken);
    const url = `${API_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`;
    const data = await googleGet(url, token);
    const items: RawGoogleEvent[] = Array.isArray(data.items) ? data.items : [];
    events.push(...items);
    pageToken = typeof data.nextPageToken === 'string' ? data.nextPageToken : undefined;
    page++;
  } while (pageToken && page < MAX_PAGES);
  return events;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Danh sách ISODate từ `start` (chứa) đến `endExclusive` (loại trừ, quy ước Google all-day). */
function expandAllDayDates(start: ISODate, endExclusive: ISODate): ISODate[] {
  const dates: ISODate[] = [];
  const s = parseISODate(start);
  let cur = new Date(s.y, s.m0, s.d);
  const endIso = endExclusive;
  let guard = 0;
  while (toISODate(cur) < endIso && guard < 3660) {
    dates.push(toISODate(cur));
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    guard++;
  }
  return dates.length > 0 ? dates : [start];
}

/**
 * Chuẩn hóa sự kiện Google thô về `Occurrence` theo giờ địa phương; bỏ `cancelled`. Hàm thuần.
 * `range` (tùy chọn) chặn occurrence đã sinh (hữu ích cho all-day nhiều ngày) trong [min, max].
 * `id = google-<calendarId>-<eventId>@<date>` — tiền tố lịch giữ duy nhất khi gộp nhiều lịch,
 * hậu tố `@<date>` thống nhất quy ước T-2.1 (một occurrence/ngày).
 */
export function normalize(
  calendarId: string,
  color: string,
  events: RawGoogleEvent[],
  range?: { min: ISODate; max: ISODate }
): Occurrence[] {
  const result: Occurrence[] = [];
  const inRange = (date: ISODate): boolean => !range || (date >= range.min && date <= range.max);
  for (const ev of events) {
    if (ev.status === 'cancelled' || !ev.start) continue;
    const createdAt = ev.created != null ? Date.parse(ev.created) : NaN;
    const createdAtValid = !Number.isNaN(createdAt);
    if (ev.start.date) {
      const dates = ev.end?.date ? expandAllDayDates(ev.start.date, ev.end.date) : [ev.start.date];
      for (const date of dates) {
        if (!inRange(date)) continue;
        result.push({
          id: `google-${calendarId}-${ev.id}@${date}`,
          sourceId: ev.id,
          source: 'google',
          title: ev.summary ?? '',
          date,
          allDay: true,
          color,
          ...(createdAtValid ? { createdAt } : {}),
        });
      }
    } else if (ev.start.dateTime) {
      const d = new Date(ev.start.dateTime);
      const date = toISODate(d);
      if (!inRange(date)) continue;
      const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
      let endTime: string | undefined;
      if (ev.end?.dateTime) {
        const endD = new Date(ev.end.dateTime);
        if (toISODate(endD) === date && endD.getTime() > d.getTime()) {
          endTime = `${pad2(endD.getHours())}:${pad2(endD.getMinutes())}`;
        }
      }
      result.push({
        id: `google-${calendarId}-${ev.id}@${date}`,
        sourceId: ev.id,
        source: 'google',
        title: ev.summary ?? '',
        date,
        time,
        allDay: false,
        color,
        ...(endTime != null ? { endTime } : {}),
        ...(createdAtValid ? { createdAt } : {}),
      });
    }
  }
  return result;
}

function sortOccurrences(occ: Occurrence[]): Occurrence[] {
  return [...occ].sort((a, b) =>
    a.date === b.date ? (a.time ?? '').localeCompare(b.time ?? '') : a.date.localeCompare(b.date)
  );
}

/** Chuyển ISODate địa phương thành mốc RFC3339 (đầu ngày, hoặc đầu ngày kế tiếp nếu `endExclusive`). */
function isoDateToInstant(date: ISODate, endExclusive: boolean): string {
  const { y, m0, d } = parseISODate(date);
  const dt = endExclusive ? new Date(y, m0, d + 1, 0, 0, 0, 0) : new Date(y, m0, d, 0, 0, 0, 0);
  return dt.toISOString();
}

/**
 * Lấy + chuẩn hóa sự kiện của nhiều lịch trong [timeMin,timeMax], gộp và sắp xếp theo ngày/giờ.
 * Tự gọi `fetchCalendars` để lấy màu từng lịch.
 */
export async function fetchEvents(
  token: string,
  calendarIds: string[],
  timeMin: ISODate,
  timeMax: ISODate
): Promise<Occurrence[]> {
  const calendars = await fetchCalendars(token);
  const colorById = new Map(calendars.map((c) => [c.id, c.color]));
  const timeMinStr = isoDateToInstant(timeMin, false);
  const timeMaxStr = isoDateToInstant(timeMax, true);

  const all: Occurrence[] = [];
  for (const calendarId of calendarIds) {
    const raw = await fetchRawEvents(token, calendarId, timeMinStr, timeMaxStr);
    all.push(...normalize(calendarId, colorById.get(calendarId) ?? '', raw, { min: timeMin, max: timeMax }));
  }
  return sortOccurrences(all);
}

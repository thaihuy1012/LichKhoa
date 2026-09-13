import type { AppState, Occurrence, RenderData, ISODate } from './model';
import { parseISODate, toISODate } from './calendar';
import { expandOccurrences } from './recurrence';

function cmpOccurrence(a: Occurrence, b: Occurrence): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  const ta = a.time ?? '';
  const tb = b.time ?? '';
  if (ta !== tb) return ta < tb ? -1 : 1;
  if (a.title !== b.title) return a.title < b.title ? -1 : 1;
  return 0;
}

/**
 * Gom dữ liệu để render: expand sự kiện local trong khoảng
 * [ngày 1 của tháng chứa `today`, today + max(agendaDays, 42) - 1].
 * Bắt đầu từ ngày 1 của tháng (không phải `today`) để lưới Tháng có đủ chấm
 * sự kiện cho các ngày trước hôm nay trong cùng tháng. Độ dài đủ cho cả
 * lưới Tháng (tối đa 6 hàng ~ 42 ngày kể từ đầu tháng) lẫn Agenda (agendaDays
 * kể từ hôm nay). Hàm thuần, không side-effect.
 */
export function collectRenderData(state: AppState, today: ISODate): RenderData {
  const t = parseISODate(today);
  const monthStart = toISODate(new Date(t.y, t.m0, 1, 12));

  const spanDays = Math.max(state.design.agendaDays, 42);
  const toDate = new Date(t.y, t.m0, t.d + spanDays - 1, 12);
  const to = toISODate(toDate);

  const localOcc = expandOccurrences(state.events, monthStart, to);
  const googleOcc = state.google.cache?.events ?? [];

  const occurrences = [...localOcc, ...googleOcc].sort(cmpOccurrence);

  const todos = [...state.todos].sort((a, b) => a.order - b.order);

  return {
    today,
    occurrences,
    todos,
    note: state.design.showNote ? state.design.noteText : '',
  };
}

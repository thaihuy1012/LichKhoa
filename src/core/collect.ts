import type { AppState, Occurrence, RenderData, ISODate, Todo } from './model';
import { parseISODate, toISODate } from './calendar';
import { expandOccurrences } from './recurrence';

export function cmpOccurrence(a: Occurrence, b: Occurrence): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  const ta = a.time ?? '';
  const tb = b.time ?? '';
  if (ta !== tb) return ta < tb ? -1 : 1;
  if (a.title !== b.title) return a.title < b.title ? -1 : 1;
  return 0;
}

/** v1.3: chưa xong có `due` (tăng dần) -> chưa xong không `due` (theo `order`) -> đã xong (theo `order`). */
export function cmpTodo(a: Todo, b: Todo): number {
  if (a.done !== b.done) return a.done ? 1 : -1;
  if (!a.done) {
    const aHas = a.due != null;
    const bHas = b.due != null;
    if (aHas !== bHas) return aHas ? -1 : 1;
    if (aHas && bHas && a.due !== b.due) return a.due! < b.due! ? -1 : 1;
  }
  return a.order - b.order;
}

/**
 * Gom dữ liệu để render: expand sự kiện local trong khoảng
 * [min(ngày 1 của tháng chứa `today`, today − 6 ngày), today + max(agendaDays, 42) - 1].
 * Lấy sớm hơn giữa đầu tháng và today−6 ngày (so chuỗi ISODate) để tuần chứa
 * `today` (bố cục Tuần, v1.5) luôn có đủ sự kiện kể cả khi tuần đó bắt đầu ở
 * tháng trước; đồng thời vẫn giữ đủ chấm sự kiện cho lưới Tháng. Độ dài đủ cho
 * cả lưới Tháng (tối đa 6 hàng ~ 42 ngày kể từ đầu tháng) lẫn Agenda (agendaDays
 * kể từ hôm nay). Hàm thuần, không side-effect.
 */
export function collectRenderData(state: AppState, today: ISODate): RenderData {
  const t = parseISODate(today);
  const monthStart = toISODate(new Date(t.y, t.m0, 1, 12));
  const weekLookback = toISODate(new Date(t.y, t.m0, t.d - 6, 12));
  const from = monthStart < weekLookback ? monthStart : weekLookback;

  const spanDays = Math.max(state.design.agendaDays, 42);
  const toDate = new Date(t.y, t.m0, t.d + spanDays - 1, 12);
  const to = toISODate(toDate);

  const localOcc = expandOccurrences(state.events, from, to);
  const googleOcc = state.google.cache?.events ?? [];

  const occurrences = [...localOcc, ...googleOcc].sort(cmpOccurrence);

  const todos = [...state.todos].sort(cmpTodo);

  const pinned = state.notes.find((n) => n.pinned);
  const note = state.design.showNote && pinned ? pinned.body : '';
  const noteTitle = state.design.showNote && pinned && pinned.title ? pinned.title : undefined;

  return {
    today,
    occurrences,
    todos,
    note,
    noteTitle,
  };
}

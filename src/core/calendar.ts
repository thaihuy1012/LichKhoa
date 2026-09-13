import type { ISODate, Occurrence } from './model';

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Chuyển Date (giờ địa phương) thành ISODate 'YYYY-MM-DD'. Không dùng toISOString(). */
export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Parse ISODate 'YYYY-MM-DD' thành các thành phần giờ địa phương. */
export function parseISODate(s: ISODate): { y: number; m0: number; d: number } {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m0: m - 1, d };
}

/** Lưới tháng luôn 6 hàng x 7 cột; ô ngoài tháng = null. */
export function monthGrid(year: number, month0: number, weekStart: 0 | 1): (ISODate | null)[][] {
  const first = new Date(year, month0, 1, 12);
  const dow = first.getDay(); // 0=CN..6=T7
  const leading = weekStart === 1 ? (dow + 6) % 7 : dow;
  const start = new Date(year, month0, 1 - leading, 12);

  const grid: (ISODate | null)[][] = [];
  let cursor = new Date(start);
  for (let row = 0; row < 6; row++) {
    const rowCells: (ISODate | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const inMonth = cursor.getMonth() === month0 && cursor.getFullYear() === year;
      rowCells.push(inMonth ? toISODate(cursor) : null);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, 12);
    }
    grid.push(rowCells);
  }
  return grid;
}

/**
 * Nhóm occurrence theo ngày trong khoảng [from, from+days-1] (đóng cả hai đầu).
 * Bỏ qua ngày không có occurrence. Giữ nguyên thứ tự occurrence trong từng ngày
 * (đầu vào `occ` phải đã sắp xếp sẵn theo cùng ngày → cả ngày trước → giờ → tiêu đề).
 */
export function groupAgenda(
  occ: Occurrence[],
  from: ISODate,
  days: number
): { date: ISODate; items: Occurrence[] }[] {
  const fromP = parseISODate(from);
  const start = new Date(fromP.y, fromP.m0, fromP.d, 12);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days - 1, 12);
  const to = toISODate(end);

  const byDate = new Map<ISODate, Occurrence[]>();
  for (const o of occ) {
    if (o.date < from || o.date > to) continue;
    const list = byDate.get(o.date);
    if (list) list.push(o);
    else byDate.set(o.date, [o]);
  }

  const result: { date: ISODate; items: Occurrence[] }[] = [];
  let cursor = new Date(start);
  for (let i = 0; i < days; i++) {
    const d = toISODate(cursor);
    const items = byDate.get(d);
    if (items && items.length > 0) result.push({ date: d, items });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, 12);
  }
  return result;
}

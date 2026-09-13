import type { ISODate } from './model';

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

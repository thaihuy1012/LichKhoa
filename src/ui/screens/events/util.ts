/** Tiện ích dùng riêng cho màn Sự kiện (T-2.7, T-2.12). */

import type { Todo } from '../../../core/model';
import { cmpTodo } from '../../../core/collect';

/** Nhãn hạn to-do: dùng chung với hình nền để app và hình nền không lệch nhau. */
export { todoDueLabel } from '../../../render/layout/common';

/** Bảng màu sự kiện: tông sáng, tương phản tốt trên nền tối (khác `EVENT_COLORS` gốc lich-nen.html L411 vốn dành cho nền sáng). */
export const EVENT_COLORS = ['#4dabf7', '#ff6b6b', '#51cf66', '#fcc419', '#cc5de8', '#22b8cf'];

/** Nhắc trước cho phép, theo SPEC v1.3 mục 5. */
export const ALARM_MINUTES = [0, 5, 15, 30, 60, 1440] as const;

/** Thứ tự hiển thị to-do trong app = đúng thứ tự trên hình nền (`cmpTodo` của `core/collect.ts`). */
export function sortTodosForDisplay(todos: Todo[]): Todo[] {
  return [...todos].sort(cmpTodo);
}

export function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;
}

/** Tải một Blob dưới dạng file (không dùng Web Share, khác `savePng` trong export/share.ts). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Cộng `minutes` phút vào giờ 'HH:mm', cuộn vòng trong ngày. */
export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Số phút giữa hai giờ 'HH:mm'; Kết thúc < Bắt đầu -> qua đêm (+1440), bằng nhau -> 0. */
export function minutesBetween(start: string, end: string): number {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  const diff = h2 * 60 + m2 - (h1 * 60 + m1);
  return diff < 0 ? diff + 1440 : diff;
}

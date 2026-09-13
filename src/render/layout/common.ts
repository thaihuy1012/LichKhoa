import type { DeviceSpec, DesignConfig } from '../../core/model';

/** Lệnh vẽ dùng chung cho mọi layout và `paint` (hợp đồng SPEC mục 5). */
export type DrawOp =
  | { op: 'rect'; x: number; y: number; w: number; h: number; r?: number; fill: string; alpha?: number }
  | { op: 'text'; x: number; y: number; text: string; size: number; weight: 400 | 600 | 700; color: string; align: 'left' | 'center' | 'right'; font: 'sans' | 'serif' | 'mono' }
  | { op: 'dot'; x: number; y: number; r: number; fill: string };

/** Nhãn VI tạm thời (i18n đầy đủ ở M2). */
export const LABELS_VI = {
  weekdaysShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const, // theo thứ tự weekStart=1
  weekdaysShortSunFirst: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const, // theo thứ tự weekStart=0
  months: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ] as const,
};

/** Nhãn thứ theo weekStart, thứ tự khớp cột lưới của monthGrid. */
export function weekdayLabels(weekStart: 0 | 1): readonly string[] {
  return weekStart === 1 ? LABELS_VI.weekdaysShort : LABELS_VI.weekdaysShortSunFirst;
}

/** Vùng an toàn tuyệt đối (pixel) theo chiều dọc, dạng [top, bottom]. */
export function safeArea(dev: DeviceSpec): { top: number; bottom: number } {
  return {
    top: dev.height * dev.safeTop,
    bottom: dev.height * (1 - dev.safeBottom),
  };
}

/** Tính y bắt đầu của một khối nội dung cao `contentHeight` bên trong vùng an toàn,
 * theo `position` (top/middle/bottom). */
export function blockStartY(dev: DeviceSpec, position: DesignConfig['position'], contentHeight: number): number {
  const { top, bottom } = safeArea(dev);
  const usable = bottom - top;
  const free = Math.max(0, usable - contentHeight);
  if (position === 'top') return top;
  if (position === 'bottom') return bottom - contentHeight;
  return top + free / 2;
}

/** Cỡ chữ theo scale của DesignConfig. */
export function fontSize(base: number, scale: number): number {
  return base * scale;
}

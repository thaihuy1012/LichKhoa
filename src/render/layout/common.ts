import type { DeviceSpec, DesignConfig, ISODate } from '../../core/model';
import { parseISODate } from '../../core/calendar';
import { t } from '../../core/i18n';
import { solarToLunar, lunarYearName } from '../../core/lunar';

/** Lệnh vẽ dùng chung cho mọi layout và `paint` (hợp đồng SPEC mục 5). */
export type DrawOp =
  | { op: 'rect'; x: number; y: number; w: number; h: number; r?: number; fill: string; alpha?: number }
  | { op: 'text'; x: number; y: number; text: string; size: number; weight: 400 | 600 | 700; color: string; align: 'left' | 'center' | 'right'; font: 'sans' | 'serif' | 'mono' }
  | { op: 'dot'; x: number; y: number; r: number; fill: string };

/** Nhãn thứ theo weekStart và ngôn ngữ, thứ tự khớp cột lưới của monthGrid (0=CN..6=T7 xoay theo weekStart). */
export function weekdayLabels(weekStart: 0 | 1, lang: 'vi' | 'en'): string[] {
  const order = weekStart === 1 ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  return order.map((dow) => t(`weekday.short.${dow}`, lang));
}

/** Vùng an toàn tuyệt đối (pixel) theo chiều dọc, dạng [top, bottom]. */
export function safeArea(dev: DeviceSpec): { top: number; bottom: number } {
  return {
    top: dev.height * dev.safeTop,
    bottom: dev.height * (1 - dev.safeBottom),
  };
}

/** Tính y bắt đầu của một khối nội dung cao `contentHeight` bên trong `area` [top, bottom],
 * theo `position` (top/middle/bottom). */
export function blockStartY(area: { top: number; bottom: number }, position: DesignConfig['position'], contentHeight: number): number {
  const usable = area.bottom - area.top;
  const free = Math.max(0, usable - contentHeight);
  if (position === 'top') return area.top;
  if (position === 'bottom') return area.bottom - contentHeight;
  return area.top + free / 2;
}

/** Cỡ chữ theo scale của DesignConfig. */
export function fontSize(base: number, scale: number): number {
  return base * scale;
}

/** Chiều cao dải ghi chú (tối đa ~4 dòng + 1 dòng tiêu đề) khi `showNote` bật; 0 khi tắt. */
export function noteHeight(dev: DeviceSpec, c: DesignConfig): number {
  if (!c.showNote) return 0;
  const size = fontSize(dev.width * 0.032, c.scale);
  const titleLineH = size * 1.4;
  return size * 1.35 * 4 + titleLineH + dev.height * 0.02;
}

/** Vùng an toàn dành cho khối chính (month/agenda/todo): vùng an toàn trừ dải ghi chú (nếu bật). */
export function mainArea(dev: DeviceSpec, c: DesignConfig): { top: number; bottom: number } {
  const { top, bottom } = safeArea(dev);
  return { top, bottom: bottom - noteHeight(dev, c) };
}

/** Vùng dải ghi chú: nằm ngay dưới khối chính, trong vùng an toàn. */
export function noteArea(dev: DeviceSpec, c: DesignConfig): { top: number; bottom: number } {
  const { bottom } = safeArea(dev);
  const h = noteHeight(dev, c);
  return { top: bottom - h, bottom };
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Định dạng giờ 'HH:mm' theo 12h (AM/PM) hoặc 24h. */
export function fmtTime(time: string | undefined, hour12: boolean): string {
  if (!time) return '';
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const m = Number(mStr) || 0;
  if (!hour12) return `${pad2(h)}:${pad2(m)}`;
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${pad2(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Nhãn ngày âm ngắn gọn cho Agenda, vd. "1/8 ÂL" hoặc "1/8 nhuận ÂL". */
export function lunarAgendaLabel(date: ISODate, lang: 'vi' | 'en'): string {
  const l = solarToLunar(date);
  const leap = l.leap ? t('lunar.leap', lang) : '';
  return t('lunar.agenda', lang, { day: l.day, month: l.month, leap });
}

/** Dòng âm lịch đầy đủ dưới tiêu đề tháng, vd. "Âm lịch 1/1 Bính Ngọ". */
export function lunarTodayLine(date: ISODate, lang: 'vi' | 'en'): string {
  const l = solarToLunar(date);
  const leap = l.leap ? t('lunar.leap', lang) : '';
  return t('lunar.line', lang, { day: l.day, month: l.month, leap, yearName: lunarYearName(l.year) });
}

/** Nhãn ngày trong ô lưới Tháng: "1/M" cho mùng 1 (kèm tháng âm), còn lại chỉ ngày âm. */
export function lunarCellLabel(date: ISODate): string {
  const l = solarToLunar(date);
  return l.day === 1 ? `${l.day}/${l.month}` : `${l.day}`;
}

/** Nhãn ngày cho Agenda: "Hôm nay" / "Ngày mai" / "T2 14/9" (i18n); kèm ngày âm khi `showLunar`. */
export function dayLabel(date: ISODate, today: ISODate, lang: 'vi' | 'en', showLunar = false): string {
  let base: string;
  if (date === today) base = t('date.today', lang);
  else {
    const p1 = parseISODate(today);
    const d1 = new Date(p1.y, p1.m0, p1.d, 12);
    const p2 = parseISODate(date);
    const d2 = new Date(p2.y, p2.m0, p2.d, 12);
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / 86400000);
    if (diffDays === 1) base = t('date.tomorrow', lang);
    else {
      const wd = t(`weekday.short.${d2.getDay()}`, lang);
      base = `${wd} ${p2.d}/${p2.m0 + 1}`;
    }
  }
  return showLunar ? `${base} · ${lunarAgendaLabel(date, lang)}` : base;
}

/** Ước lượng số dòng cần để hiển thị `text` trong bề rộng `width` với cỡ chữ `size`. */
export function estLines(text: string, width: number, size: number, maxLines: number): number {
  const cpl = Math.max(8, Math.floor(width / (size * 0.5)));
  let n = 0;
  for (const p of String(text || '').split(/\n/)) n += Math.max(1, Math.ceil(p.length / cpl));
  return Math.min(maxLines, n);
}

/** Bọc `text` thành tối đa `maxLines` dòng vừa bề rộng `width` với cỡ chữ `size`. */
export function wrapText(text: string, width: number, size: number, maxLines: number): string[] {
  const cpl = Math.max(8, Math.floor(width / (size * 0.5)));
  const lines: string[] = [];
  for (const p of String(text || '').split(/\n/)) {
    if (p.length === 0) {
      lines.push('');
      continue;
    }
    const words = p.split(' ');
    let cur = '';
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length > cpl && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
  }
  return lines.length > maxLines ? lines.slice(0, maxLines) : lines;
}

/** Cắt `text` thành một dòng vừa bề rộng `width` với cỡ chữ `size`, thêm "…" nếu bị cắt.
 * Dùng cùng hệ số ước lượng ký tự/dòng như `wrapText`. */
export function truncate(text: string, width: number, size: number): string {
  const cpl = Math.max(4, Math.floor(width / (size * 0.5)));
  const s = String(text ?? '');
  if (s.length <= cpl) return s;
  return `${s.slice(0, Math.max(1, cpl - 1))}…`;
}

/** Nhãn hạn to-do: "Quá hạn" nếu qua ngày `today`, "Hôm nay" nếu đúng hôm nay, còn lại "d/m". */
export function todoDueLabel(due: ISODate, today: ISODate, lang: 'vi' | 'en'): { text: string; overdue: boolean } {
  if (due < today) return { text: t('todo.overdue', lang), overdue: true };
  if (due === today) return { text: t('date.today', lang), overdue: false };
  const p = parseISODate(due);
  return { text: `${p.d}/${p.m0 + 1}`, overdue: false };
}

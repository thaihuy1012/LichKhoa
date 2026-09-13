import vi from './i18n/vi.json';
import en from './i18n/en.json';

/**
 * Nhóm khóa (đặt phiếu sau thêm khóa mới đúng nhóm):
 * - tab.*        5 tab điều hướng (preview, events, design, sync, guide)
 * - preview.*    màn Preview (thiết bị, tự phát hiện, tùy chỉnh, rộng, cao, lưu ảnh, lỗi, đang tải)
 * - weekday.short.<0-6> / weekday.long.<0-6>  tên thứ theo Date.getDay()
 * - month.<0-11> tên 12 tháng
 * - repeat.*     nhãn lặp lại (none/daily/weekly/monthly/yearly)
 * - events.*     màn Sự kiện (CRUD, trường form, to-do, ghi chú, thêm vào Lịch iPhone)
 * - settings.*   cài đặt chung (ngôn ngữ, giờ, tuần bắt đầu, xuất/nhập, xóa dữ liệu)
 * - date.*       nhãn ngày tương đối (hôm nay, ngày mai)
 * - common.*     dùng chung (placeholder "sắp có", v.v.)
 */

type Dict = Record<string, string>;
type Lang = 'vi' | 'en';

const DICTS: Record<Lang, Dict> = { vi: vi as Dict, en: en as Dict };

export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const dict = DICTS[lang];
  const raw = dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;
  if (raw === undefined) return key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

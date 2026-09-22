import type { AppState } from '../core/model';

/** v1.11 (D-037): 5 loại Phím tắt được hỗ trợ cài đặt qua link iCloud. */
export type ShortcutKind = 'wallpaper' | 'alarm' | 'reminder' | 'dayAlarm' | 'morning';

/** Đúng thứ tự cài đặt: wallpaper, alarm, reminder, dayAlarm, morning. */
export const SHORTCUT_KINDS: readonly ShortcutKind[] = [
  'wallpaper',
  'alarm',
  'reminder',
  'dayAlarm',
  'morning',
] as const;

/** Tên mặc định của 5 Phím tắt; 4 tên đầu đối chiếu với defaultState() trong model.ts. */
export const SHORTCUT_DEFAULT_NAMES: Record<ShortcutKind, string> = {
  wallpaper: 'DatHinhNen',
  alarm: 'ThemBaoThuc',
  reminder: 'ThemLoiNhac',
  dayAlarm: 'ThemBaoThucNgay',
  morning: 'TaoBaoThucSang',
};

/** Ánh xạ sang trường tên tương ứng trong AppState; morning không lưu trong state (null). */
export const SHORTCUT_STATE_KEY: Record<
  ShortcutKind,
  'shortcutName' | 'alarmShortcutName' | 'reminderShortcutName' | 'dayAlarmShortcutName' | null
> = {
  wallpaper: 'shortcutName',
  alarm: 'alarmShortcutName',
  reminder: 'reminderShortcutName',
  dayAlarm: 'dayAlarmShortcutName',
  morning: null,
};

/** Regex kiểm tra link iCloud Shortcut: id 32 hex viết thường, không query/hash. */
export const ICLOUD_SHORTCUT_URL: RegExp =
  /^https:\/\/www\.icloud\.com\/shortcuts\/[0-9a-f]{32}$/;

export type ShortcutLinks = Record<ShortcutKind, string | null>;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Phân tích dữ liệu JSON tĩnh của danh sách link Phím tắt (SPEC §5, IN-14).
 * Không ném ngoại lệ với mọi đầu vào; url không khớp regex / thiếu / không phải chuỗi → null;
 * `updated` không khớp /^\d{4}-\d{2}-\d{2}$/ → null; khóa lạ bỏ qua.
 */
export function parseShortcutLinks(json: unknown): { links: ShortcutLinks; updated: string | null } {
  const links: ShortcutLinks = {
    wallpaper: null,
    alarm: null,
    reminder: null,
    dayAlarm: null,
    morning: null,
  };
  let updated: string | null = null;

  try {
    let raw = json;
    if (typeof json === 'string') {
      try {
        raw = JSON.parse(json);
      } catch {
        return { links, updated: null };
      }
    }

    if (isPlainObject(raw)) {
      if (typeof raw['updated'] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw['updated'])) {
        updated = raw['updated'];
      }
      if (isPlainObject(raw['shortcuts'])) {
        const shortcutsObj = raw['shortcuts'] as Record<string, unknown>;
        for (const kind of SHORTCUT_KINDS) {
          const item = shortcutsObj[kind];
          if (isPlainObject(item) && typeof item['url'] === 'string' && ICLOUD_SHORTCUT_URL.test(item['url'])) {
            links[kind] = item['url'];
          }
        }
      }
    }
  } catch {
    // Không ném ngoại lệ với bất kỳ đầu vào bất thường nào
  }

  return { links, updated };
}

/**
 * Kiểm tra tên Phím tắt trong AppState có bị lệch so với tên mặc định không.
 * state[SHORTCUT_STATE_KEY[kind]] !== SHORTCUT_DEFAULT_NAMES[kind] → { app, expected }; morning → luôn null.
 */
export function shortcutNameMismatch(
  state: AppState,
  kind: ShortcutKind
): { app: string; expected: string } | null {
  const stateKey = SHORTCUT_STATE_KEY[kind];
  if (stateKey === null) {
    return null;
  }
  const app = state ? state[stateKey] : '';
  const expected = SHORTCUT_DEFAULT_NAMES[kind];
  if (app !== expected) {
    return { app, expected };
  }
  return null;
}

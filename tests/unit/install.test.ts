import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { defaultState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';
import {
  SHORTCUT_KINDS,
  SHORTCUT_DEFAULT_NAMES,
  SHORTCUT_STATE_KEY,
  ICLOUD_SHORTCUT_URL,
  parseShortcutLinks,
  shortcutNameMismatch,
} from '../../src/export/install';
import type { ShortcutKind } from '../../src/export/install';

const mockDevice: DeviceSpec = {
  id: 'test-device',
  label: 'iPhone 13 Pro Max',
  width: 1284,
  height: 2778,
  safeTop: 0.28,
  safeBottom: 0.12,
};

describe('Hằng số & Danh mục Phím tắt (SPEC §5, IN-14)', () => {
  it('SHORTCUT_KINDS đủ 5 kind theo đúng thứ tự cài đặt', () => {
    expect(SHORTCUT_KINDS).toEqual([
      'wallpaper',
      'alarm',
      'reminder',
      'dayAlarm',
      'morning',
    ]);
    expect(SHORTCUT_KINDS.length).toBe(5);
  });

  it('SHORTCUT_DEFAULT_NAMES khớp defaultState() cho 4 kind đầu và có morning', () => {
    const state = defaultState(mockDevice);
    expect(SHORTCUT_DEFAULT_NAMES.wallpaper).toBe(state.shortcutName);
    expect(SHORTCUT_DEFAULT_NAMES.alarm).toBe(state.alarmShortcutName);
    expect(SHORTCUT_DEFAULT_NAMES.reminder).toBe(state.reminderShortcutName);
    expect(SHORTCUT_DEFAULT_NAMES.dayAlarm).toBe(state.dayAlarmShortcutName);
    expect(SHORTCUT_DEFAULT_NAMES.morning).toBe('TaoBaoThucSang');
  });

  it('SHORTCUT_STATE_KEY ánh xạ đúng các trường của AppState, morning là null', () => {
    expect(SHORTCUT_STATE_KEY.wallpaper).toBe('shortcutName');
    expect(SHORTCUT_STATE_KEY.alarm).toBe('alarmShortcutName');
    expect(SHORTCUT_STATE_KEY.reminder).toBe('reminderShortcutName');
    expect(SHORTCUT_STATE_KEY.dayAlarm).toBe('dayAlarmShortcutName');
    expect(SHORTCUT_STATE_KEY.morning).toBeNull();
  });

  it('ICLOUD_SHORTCUT_URL khớp URL mẫu và từ chối các URL không hợp lệ', () => {
    const validUrl1 = 'https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdef';
    const validUrl2 = 'https://www.icloud.com/shortcuts/a1b2c3d4e5f60718293a4b5c6d7e8f90';
    expect(ICLOUD_SHORTCUT_URL.test(validUrl1)).toBe(true);
    expect(ICLOUD_SHORTCUT_URL.test(validUrl2)).toBe(true);

    // Chuỗi rỗng
    expect(ICLOUD_SHORTCUT_URL.test('')).toBe(false);
    // Chữ hoa hex (chỉ chấp nhận hex viết thường)
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789ABCDEF0123456789ABCDEF')).toBe(false);
    // Độ dài thiếu (31 ký tự)
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcde')).toBe(false);
    // Độ dài thừa (33 ký tự)
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdef0')).toBe(false);
    // Ký tự không phải hex
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdeg')).toBe(false);
    // Có query string
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdef?foo=bar')).toBe(false);
    // Có hash
    expect(ICLOUD_SHORTCUT_URL.test('https://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdef#frag')).toBe(false);
    // Thiếu www.
    expect(ICLOUD_SHORTCUT_URL.test('https://icloud.com/shortcuts/0123456789abcdef0123456789abcdef')).toBe(false);
    // Protocol http
    expect(ICLOUD_SHORTCUT_URL.test('http://www.icloud.com/shortcuts/0123456789abcdef0123456789abcdef')).toBe(false);
    // Deep link
    expect(ICLOUD_SHORTCUT_URL.test('shortcuts://import-shortcut?url=abc')).toBe(false);
  });
});

describe('parseShortcutLinks', () => {
  // T-10.4 (D-038): trước đây khóa cứng "5 url rỗng" — sai SPEC §6 M10 (file thật phải pass cả trước và sau khi nạp link).
  it('đọc file thật public/shortcut-links.json -> mỗi kind: url rỗng thì null, có url thì giữ nguyên; updated null hoặc YYYY-MM-DD', () => {
    const filePath = path.resolve(__dirname, '../../public/shortcut-links.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const raw = JSON.parse(content);
    const parsed = parseShortcutLinks(content);
    if (raw.updated === undefined) expect(parsed.updated).toBeNull();
    else expect(parsed.updated).toBe(raw.updated);
    for (const kind of SHORTCUT_KINDS) {
      const url = raw.shortcuts[kind].url;
      expect(parsed.links[kind]).toBe(url === '' ? null : url);
    }
  });

  // Ca test 1: URL có khoảng trắng đầu-cuối
  it('URL có khoảng trắng đầu-cuối: " https://www.icloud.com/shortcuts/<32hex> " -> null (giữ các kind khác là null hoặc hợp lệ)', () => {
    const validUrl = 'https://www.icloud.com/shortcuts/11111111111111111111111111111111';
    const hex = '0123456789abcdef0123456789abcdef';
    const spacedBoth = ` https://www.icloud.com/shortcuts/${hex} `;
    const spacedStart = ` https://www.icloud.com/shortcuts/${hex}`;
    const spacedEnd = `https://www.icloud.com/shortcuts/${hex} `;

    // Khoảng trắng cả đầu và cuối -> null, các kind khác giữ hợp lệ hoặc null
    const res1 = parseShortcutLinks({
      shortcuts: {
        wallpaper: { url: spacedBoth },
        alarm: { url: validUrl },
        reminder: { url: '' },
        dayAlarm: { url: validUrl },
        morning: { url: null },
      },
    });
    expect(res1.links.wallpaper).toBeNull();
    expect(res1.links.alarm).toBe(validUrl);
    expect(res1.links.reminder).toBeNull();
    expect(res1.links.dayAlarm).toBe(validUrl);
    expect(res1.links.morning).toBeNull();

    // Khoảng trắng đầu -> null
    const res2 = parseShortcutLinks({
      shortcuts: {
        wallpaper: { url: validUrl },
        alarm: { url: spacedStart },
        reminder: { url: validUrl },
        dayAlarm: { url: validUrl },
        morning: { url: validUrl },
      },
    });
    expect(res2.links.alarm).toBeNull();
    expect(res2.links.wallpaper).toBe(validUrl);

    // Khoảng trắng cuối -> null
    const res3 = parseShortcutLinks({
      shortcuts: {
        wallpaper: { url: validUrl },
        alarm: { url: validUrl },
        reminder: { url: spacedEnd },
        dayAlarm: { url: validUrl },
        morning: { url: validUrl },
      },
    });
    expect(res3.links.reminder).toBeNull();
    expect(res3.links.wallpaper).toBe(validUrl);
  });

  // Ca test 2: Đọc file public/shortcut-links.json thật bằng fs.readFileSync + JSON.parse
  it('đọc file public/shortcut-links.json thật bằng fs.readFileSync + JSON.parse kiểm tra schema thô', () => {
    const filePath = path.resolve(__dirname, '../../public/shortcut-links.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const raw = JSON.parse(content);

    // Khóa cấp gốc ⊆ {updated, shortcuts} (không khóa lạ)
    expect(typeof raw).toBe('object');
    expect(raw).not.toBeNull();
    const rootKeys = Object.keys(raw);
    for (const key of rootKeys) {
      expect(['updated', 'shortcuts']).toContain(key);
    }
    expect(rootKeys).toContain('shortcuts');

    // Object.keys(shortcuts) sắp xếp = đúng 5 khóa SHORTCUT_KINDS (không thừa, không thiếu)
    expect(typeof raw.shortcuts).toBe('object');
    expect(raw.shortcuts).not.toBeNull();
    const shortcutKeys = Object.keys(raw.shortcuts).sort();
    const expectedKeys = [...SHORTCUT_KINDS].sort();
    expect(shortcutKeys).toEqual(expectedKeys);

    // Mỗi mục trong shortcuts chỉ có khóa url (không khóa lạ)
    // Mỗi url là '' (rỗng) hoặc khớp ICLOUD_SHORTCUT_URL regex
    for (const kind of SHORTCUT_KINDS) {
      const item = raw.shortcuts[kind];
      expect(typeof item).toBe('object');
      expect(item).not.toBeNull();
      expect(Object.keys(item)).toEqual(['url']);
      expect(typeof item.url).toBe('string');
      expect(item.url === '' || ICLOUD_SHORTCUT_URL.test(item.url)).toBe(true);
    }

    // Nếu có updated, dạng YYYY-MM-DD
    if ('updated' in raw && raw.updated !== null && raw.updated !== undefined) {
      expect(typeof raw.updated).toBe('string');
      expect(raw.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('nhận đúng 5 URL hợp lệ và updated hợp lệ', () => {
    const input = {
      updated: '2026-09-22',
      shortcuts: {
        wallpaper: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000001' },
        alarm: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000002' },
        reminder: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000003' },
        dayAlarm: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000004' },
        morning: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000005' },
      },
    };
    const res = parseShortcutLinks(input);
    expect(res.updated).toBe('2026-09-22');
    expect(res.links.wallpaper).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000001');
    expect(res.links.alarm).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000002');
    expect(res.links.reminder).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000003');
    expect(res.links.dayAlarm).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000004');
    expect(res.links.morning).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000005');
  });

  // Ca test 3: URL sai kiểm qua parseShortcutLinks với JSON đầy đủ (5 kind, 4 hợp lệ + 1 sai)
  describe('URL sai kiểm qua parseShortcutLinks với JSON đầy đủ (5 kind, 4 hợp lệ + 1 sai)', () => {
    const validUrls: Record<ShortcutKind, string> = {
      wallpaper: 'https://www.icloud.com/shortcuts/11111111111111111111111111111111',
      alarm: 'https://www.icloud.com/shortcuts/22222222222222222222222222222222',
      reminder: 'https://www.icloud.com/shortcuts/33333333333333333333333333333333',
      dayAlarm: 'https://www.icloud.com/shortcuts/44444444444444444444444444444444',
      morning: 'https://www.icloud.com/shortcuts/55555555555555555555555555555555',
    };

    const invalidCases: Array<{ label: string; kind: ShortcutKind; badUrl: string }> = [
      {
        label: '(a) protocol http:// (không https)',
        kind: 'wallpaper',
        badUrl: 'http://www.icloud.com/shortcuts/11111111111111111111111111111111',
      },
      {
        label: '(b) thiếu www.',
        kind: 'alarm',
        badUrl: 'https://icloud.com/shortcuts/22222222222222222222222222222222',
      },
      {
        label: '(c) id 31 ký tự',
        kind: 'reminder',
        badUrl: 'https://www.icloud.com/shortcuts/3333333333333333333333333333333',
      },
      {
        label: '(d) id 33 ký tự',
        kind: 'dayAlarm',
        badUrl: 'https://www.icloud.com/shortcuts/444444444444444444444444444444444',
      },
      {
        label: '(e) ký tự hoa ABCDEF',
        kind: 'morning',
        badUrl: 'https://www.icloud.com/shortcuts/5555555555555555555555555555555A',
      },
      {
        label: '(f) có query ?x=1',
        kind: 'alarm',
        badUrl: 'https://www.icloud.com/shortcuts/22222222222222222222222222222222?x=1',
      },
      {
        label: '(g) có hash #frag',
        kind: 'reminder',
        badUrl: 'https://www.icloud.com/shortcuts/33333333333333333333333333333333#frag',
      },
    ];

    for (const c of invalidCases) {
      it(`${c.label} -> kind ${c.kind} null, 4 kind khác giữ url hợp lệ`, () => {
        const shortcutsObj: Record<string, { url: string }> = {};
        for (const k of SHORTCUT_KINDS) {
          shortcutsObj[k] = { url: k === c.kind ? c.badUrl : validUrls[k] };
        }
        const fullJson = {
          updated: '2026-09-22',
          shortcuts: shortcutsObj,
        };
        const res = parseShortcutLinks(fullJson);
        // Kind sai bị null
        expect(res.links[c.kind]).toBeNull();
        // 4 kind khác giữ url hợp lệ
        for (const k of SHORTCUT_KINDS) {
          if (k !== c.kind) {
            expect(res.links[k]).toBe(validUrls[k]);
          }
        }
        expect(res.updated).toBe('2026-09-22');
      });
    }
  });

  it('url không hợp lệ (sai regex, rỗng, không phải chuỗi) -> trả null cho kind đó', () => {
    const input = {
      shortcuts: {
        wallpaper: { url: '' },
        alarm: { url: 'https://www.icloud.com/shortcuts/INVALID' },
        reminder: { url: 12345 },
        dayAlarm: {},
        morning: null,
      },
    };
    const res = parseShortcutLinks(input);
    expect(res.links.wallpaper).toBeNull();
    expect(res.links.alarm).toBeNull();
    expect(res.links.reminder).toBeNull();
    expect(res.links.dayAlarm).toBeNull();
    expect(res.links.morning).toBeNull();
  });

  // Ca test 4: updated định dạng sai
  it('updated định dạng sai: updated: "22/09/2026" (dạng dd/mm/yyyy) -> null; updated: 20260922 (số, không phải chuỗi) -> null', () => {
    const fullShortcuts = {
      wallpaper: { url: 'https://www.icloud.com/shortcuts/11111111111111111111111111111111' },
      alarm: { url: 'https://www.icloud.com/shortcuts/22222222222222222222222222222222' },
      reminder: { url: 'https://www.icloud.com/shortcuts/33333333333333333333333333333333' },
      dayAlarm: { url: 'https://www.icloud.com/shortcuts/44444444444444444444444444444444' },
      morning: { url: 'https://www.icloud.com/shortcuts/55555555555555555555555555555555' },
    };

    // updated: '22/09/2026' (dạng dd/mm/yyyy) -> null
    const res1 = parseShortcutLinks({
      updated: '22/09/2026',
      shortcuts: fullShortcuts,
    });
    expect(res1.updated).toBeNull();
    expect(res1.links.wallpaper).toBe('https://www.icloud.com/shortcuts/11111111111111111111111111111111');

    // updated: 20260922 (số, không phải chuỗi) -> null
    const res2 = parseShortcutLinks({
      updated: 20260922,
      shortcuts: fullShortcuts,
    });
    expect(res2.updated).toBeNull();
    expect(res2.links.wallpaper).toBe('https://www.icloud.com/shortcuts/11111111111111111111111111111111');
  });

  it('updated không hợp lệ hoặc thiếu -> trả null', () => {
    expect(parseShortcutLinks({ updated: '2026/09/22' }).updated).toBeNull();
    expect(parseShortcutLinks({ updated: '2026-9-22' }).updated).toBeNull();
    expect(parseShortcutLinks({ updated: 'invalid-date' }).updated).toBeNull();
    expect(parseShortcutLinks({ updated: '' }).updated).toBeNull();
    expect(parseShortcutLinks({ updated: 12345 }).updated).toBeNull();
    expect(parseShortcutLinks({ updated: null }).updated).toBeNull();
    expect(parseShortcutLinks({}).updated).toBeNull();
  });

  it('khóa lạ ở root và trong shortcuts được bỏ qua an toàn', () => {
    const input = {
      unknownField: 'test',
      updated: '2026-09-22',
      shortcuts: {
        wallpaper: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000001' },
        extraShortcut: { url: 'https://www.icloud.com/shortcuts/00000000000000000000000000000009' },
      },
    };
    const res = parseShortcutLinks(input);
    expect(res.updated).toBe('2026-09-22');
    expect(res.links.wallpaper).toBe('https://www.icloud.com/shortcuts/00000000000000000000000000000001');
    expect(res.links.alarm).toBeNull();
    expect((res.links as Record<string, unknown>)['extraShortcut']).toBeUndefined();
    expect(Object.keys(res.links)).toEqual(SHORTCUT_KINDS);
  });

  it('không ném lỗi với mọi đầu vào bất thường', () => {
    const badInputs: unknown[] = [
      null,
      undefined,
      '',
      'invalid json',
      '{ incomplete json',
      123,
      true,
      false,
      [],
      [1, 2, 3],
      {},
      { shortcuts: null },
      { shortcuts: 123 },
      { shortcuts: 'invalid' },
      { shortcuts: [] },
      { shortcuts: { wallpaper: 'not-object' } },
      { shortcuts: { wallpaper: { url: null } } },
      { shortcuts: { wallpaper: { url: false } } },
    ];

    for (const bad of badInputs) {
      expect(() => {
        const res = parseShortcutLinks(bad);
        expect(res.updated).toBeNull();
        for (const kind of SHORTCUT_KINDS) {
          expect(res.links[kind]).toBeNull();
        }
      }).not.toThrow();
    }
  });
});

describe('shortcutNameMismatch', () => {
  it('state mặc định -> tất cả kind đều trả về null', () => {
    const state = defaultState(mockDevice);
    for (const kind of SHORTCUT_KINDS) {
      expect(shortcutNameMismatch(state, kind)).toBeNull();
    }
  });

  it('lần lượt từng kind bị đổi tên -> trả về { app, expected } tương ứng', () => {
    // 1. wallpaper
    const state1 = { ...defaultState(mockDevice), shortcutName: 'DoiHinhNen' };
    expect(shortcutNameMismatch(state1, 'wallpaper')).toEqual({
      app: 'DoiHinhNen',
      expected: 'DatHinhNen',
    });
    expect(shortcutNameMismatch(state1, 'alarm')).toBeNull();

    // 2. alarm
    const state2 = { ...defaultState(mockDevice), alarmShortcutName: 'BaoThucKhac' };
    expect(shortcutNameMismatch(state2, 'alarm')).toEqual({
      app: 'BaoThucKhac',
      expected: 'ThemBaoThuc',
    });
    expect(shortcutNameMismatch(state2, 'wallpaper')).toBeNull();

    // 3. reminder
    const state3 = { ...defaultState(mockDevice), reminderShortcutName: 'LoiNhacKhac' };
    expect(shortcutNameMismatch(state3, 'reminder')).toEqual({
      app: 'LoiNhacKhac',
      expected: 'ThemLoiNhac',
    });
    expect(shortcutNameMismatch(state3, 'dayAlarm')).toBeNull();

    // 4. dayAlarm
    const state4 = { ...defaultState(mockDevice), dayAlarmShortcutName: 'BaoThucNgayKhac' };
    expect(shortcutNameMismatch(state4, 'dayAlarm')).toEqual({
      app: 'BaoThucNgayKhac',
      expected: 'ThemBaoThucNgay',
    });
    expect(shortcutNameMismatch(state4, 'reminder')).toBeNull();
  });

  it('morning luôn luôn trả về null kể cả khi state thay đổi', () => {
    const state = {
      ...defaultState(mockDevice),
      shortcutName: 'Custom1',
      alarmShortcutName: 'Custom2',
      reminderShortcutName: 'Custom3',
      dayAlarmShortcutName: 'Custom4',
    };
    expect(shortcutNameMismatch(state, 'morning')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { normalizeState, defaultDesign, defaultState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'test',
  label: 'Test',
  width: 1179,
  height: 2556,
  safeTop: 0.3,
  safeBottom: 0.14,
};

describe('normalizeState', () => {
  it('bù mặc định khi thiếu design.boxAlpha/google/shortcutName, giữ giá trị có sẵn', () => {
    const raw = {
      version: 1,
      events: [],
      todos: [],
      design: { ...defaultDesign(), boxAlpha: undefined, accentColor: '#123456' },
      device,
    };
    // xóa boxAlpha để mô phỏng trường thiếu
    delete (raw.design as Record<string, unknown>)['boxAlpha'];
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.design.boxAlpha).toBe(defaultDesign().boxAlpha);
    expect(result!.design.accentColor).toBe('#123456');
    expect(result!.google).toEqual({ clientId: '', calendarIds: [], cache: null });
    expect(result!.shortcutName).toBe('DatHinhNen');
  });

  it('design thiếu monthList (T-4.8) → normalizeState bù true', () => {
    const raw = {
      version: 1,
      events: [],
      todos: [],
      design: { ...defaultDesign() },
      device,
    };
    delete (raw.design as Record<string, unknown>)['monthList'];
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.design.monthList).toBe(true);
  });

  it('version khác 1 → null', () => {
    const raw = { ...defaultState(device), version: 2 };
    expect(normalizeState(raw)).toBeNull();
  });

  it('không phải object → null', () => {
    expect(normalizeState(null)).toBeNull();
    expect(normalizeState(undefined)).toBeNull();
    expect(normalizeState('abc')).toBeNull();
    expect(normalizeState(42)).toBeNull();
    expect(normalizeState([])).toBeNull();
  });

  it('device thiếu width/height dạng số → null', () => {
    expect(normalizeState({ version: 1, device: { id: 'x' } })).toBeNull();
    expect(normalizeState({ version: 1, device: { width: '100', height: 200 } })).toBeNull();
    expect(normalizeState({ version: 1 })).toBeNull();
  });

  it('không mutate raw', () => {
    const raw = {
      version: 1 as const,
      events: [],
      todos: [],
      design: { accentColor: '#111111' },
      device,
      google: { clientId: 'abc' },
    };
    const snapshot = JSON.parse(JSON.stringify(raw));
    normalizeState(raw);
    expect(raw).toEqual(snapshot);
  });

  it('v1.3: design.noteText khác rỗng -> chuyển thành 1 Note pinned, xóa noteText khỏi design', () => {
    const raw = {
      version: 1 as const,
      events: [],
      todos: [],
      design: { ...defaultDesign(), noteText: 'Ghi chú cũ' },
      device,
    };
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.notes.length).toBe(1);
    expect(result!.notes[0].body).toBe('Ghi chú cũ');
    expect(result!.notes[0].pinned).toBe(true);
    expect((result!.design as unknown as Record<string, unknown>)['noteText']).toBeUndefined();
  });

  it('v1.3: notes thiếu -> bù mặc định []', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device };
    const result = normalizeState(raw);
    expect(result!.notes).toEqual([]);
  });

  it('T-2.14: device có width/height hợp lệ nhưng thiếu safeTop/safeBottom/id/label -> bù mặc định (khớp preset theo kích thước, không NaN)', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device: { width: 1284, height: 2778 } };
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.device.id).toBe('iphone-1284x2778');
    expect(Number.isFinite(result!.device.safeTop)).toBe(true);
    expect(Number.isFinite(result!.device.safeBottom)).toBe(true);
    expect(result!.device.safeTop).toBeGreaterThan(0);
    expect(result!.device.safeBottom).toBeGreaterThan(0);
  });

  it('T-2.14: device kích thước không khớp preset nào, thiếu safe*/id -> mặc định 0.30/0.14, id custom', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device: { width: 999, height: 1999 } };
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.device.id).toBe('custom');
    expect(result!.device.safeTop).toBeCloseTo(0.3);
    expect(result!.device.safeBottom).toBeCloseTo(0.14);
  });

  it('D-012: events/todos không phải mảng -> []', () => {
    const raw = { version: 1 as const, events: 'x', todos: 42, design: defaultDesign(), device };
    const result = normalizeState(raw);
    expect(result!.events).toEqual([]);
    expect(result!.todos).toEqual([]);
  });

  it('D-012: phần tử không phải object trong events/todos/notes bị bỏ', () => {
    const raw = {
      version: 1 as const,
      events: [{ id: 'e1' }, 'bad', 42, null],
      todos: [{ id: 't1' }, 'bad'],
      notes: [{ id: 'n1', pinned: false, updated: 1 }, 'bad'],
      design: defaultDesign(),
      device,
    };
    const result = normalizeState(raw);
    expect(result!.events.length).toBe(1);
    expect(result!.todos.length).toBe(1);
    expect(result!.notes.length).toBe(1);
  });

  it('D-012: notes có > 1 pinned -> chỉ giữ ghim cái updated lớn nhất', () => {
    const raw = {
      version: 1 as const,
      events: [],
      todos: [],
      notes: [
        { id: 'n1', title: '', body: 'cũ', pinned: true, updated: 100 },
        { id: 'n2', title: '', body: 'mới', pinned: true, updated: 200 },
      ],
      design: defaultDesign(),
      device,
    };
    const result = normalizeState(raw);
    const pinned = result!.notes.filter((n) => n.pinned);
    expect(pinned.length).toBe(1);
    expect(pinned[0].id).toBe('n2');
  });

  it('v1.8 (IN-11): state thiếu 2 tên Phím tắt -> mặc định ThemBaoThuc/ThemLoiNhac', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device };
    const result = normalizeState(raw);
    expect(result!.alarmShortcutName).toBe('ThemBaoThuc');
    expect(result!.reminderShortcutName).toBe('ThemLoiNhac');
  });

  it('v1.8 (IN-11): 2 tên Phím tắt rỗng hoặc không phải chuỗi -> bù mặc định', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device, alarmShortcutName: '', reminderShortcutName: 42 };
    const result = normalizeState(raw);
    expect(result!.alarmShortcutName).toBe('ThemBaoThuc');
    expect(result!.reminderShortcutName).toBe('ThemLoiNhac');
  });

  it('v1.8 (IN-11): giữ 2 tên Phím tắt hợp lệ đã đổi', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device, alarmShortcutName: 'Bao Thuc', reminderShortcutName: 'Loi Nhac' };
    const result = normalizeState(raw);
    expect(result!.alarmShortcutName).toBe('Bao Thuc');
    expect(result!.reminderShortcutName).toBe('Loi Nhac');
  });

  it('giữ nguyên giá trị có sẵn khi hợp lệ đầy đủ', () => {
    const full = defaultState(device);
    full.design.accentColor = '#abcdef';
    full.google.clientId = 'my-client';
    const result = normalizeState(full);
    expect(result).not.toBeNull();
    expect(result!.design.accentColor).toBe('#abcdef');
    expect(result!.google.clientId).toBe('my-client');
  });
});

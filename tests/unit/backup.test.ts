import { describe, it, expect } from 'vitest';
import { exportBackup, importBackup } from '../../src/storage/backup';
import { defaultState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'iphone13pm',
  label: 'iPhone 13 Pro Max',
  width: 1284,
  height: 2778,
  safeTop: 0.06,
  safeBottom: 0.03,
};

describe('exportBackup/importBackup', () => {
  it('vòng tròn: importBackup(exportBackup(s)) toEqual s', () => {
    const s = defaultState(device);
    s.events.push({ id: 'e1', title: 'Hop', date: '2026-01-01', repeat: 'none' });
    s.todos.push({ id: 't1', text: 'Viec', done: false, order: 0 });
    const json = exportBackup(s);
    const result = importBackup(json);
    expect(result).toEqual(s);
  });

  it('v1.3: vòng tròn giữ notes, due, alarmMin', () => {
    const s = defaultState(device);
    s.events.push({ id: 'e1', title: 'Hop', date: '2026-01-01', repeat: 'weekdays', alarmMin: 15 });
    s.todos.push({ id: 't1', text: 'Viec', done: false, order: 0, due: '2026-01-05' });
    s.notes.push({ id: 'n1', title: 'Tieu de', body: 'Noi dung', pinned: true, updated: 1 });
    const json = exportBackup(s);
    const result = importBackup(json);
    expect(result).toEqual(s);
  });

  it('version khác 1 → throw', () => {
    const json = JSON.stringify({ version: 2, state: defaultState(device) });
    expect(() => importBackup(json)).toThrow();
  });

  it('JSON hỏng → throw', () => {
    expect(() => importBackup('{ khong phai json')).toThrow();
  });

  it('state thiếu trường → được bù mặc định qua normalizeState', () => {
    const partial = {
      version: 1,
      state: {
        version: 1,
        events: [],
        todos: [],
        device,
      },
    };
    const result = importBackup(JSON.stringify(partial));
    expect(result.design).toEqual(defaultState(device).design);
    expect(result.google).toEqual(defaultState(device).google);
    expect(result.shortcutName).toBe('DatHinhNen');
  });

  it('state không hợp lệ (device thiếu số) → throw', () => {
    const bad = { version: 1, state: { version: 1, device: { id: 'x' } } };
    expect(() => importBackup(JSON.stringify(bad))).toThrow();
  });

  it('v1.8 (IN-11): xuất -> nhập giữ 2 tên Phím tắt đã đổi, version vẫn 1', () => {
    const s = defaultState(device);
    s.alarmShortcutName = 'Bao Thuc';
    s.reminderShortcutName = 'Loi Nhac';
    const json = exportBackup(s);
    expect(JSON.parse(json).version).toBe(1);
    const result = importBackup(json);
    expect(result.alarmShortcutName).toBe('Bao Thuc');
    expect(result.reminderShortcutName).toBe('Loi Nhac');
    expect(result).toEqual(s);
  });
});

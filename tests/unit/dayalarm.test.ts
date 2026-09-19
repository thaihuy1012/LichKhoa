import { describe, it, expect } from 'vitest';
import { DAY_ALARM_MIN_TIME, dayAlarmWindow } from '../../src/export/reminder';
import { defaultDesign, defaultState, normalizeState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';
import { exportBackup, importBackup } from '../../src/storage/backup';
import { reducer } from '../../src/ui/store';

const device: DeviceSpec = {
  id: 'test',
  label: 'Test',
  width: 1179,
  height: 2556,
  safeTop: 0.3,
  safeBottom: 0.14,
};

describe('DAY_ALARM_MIN_TIME', () => {
  it("hằng số là '00:30'", () => {
    expect(DAY_ALARM_MIN_TIME).toBe('00:30');
  });
});

describe('dayAlarmWindow', () => {
  it('now = 2026-10-05 10:00: at ≤ now → past; cùng ngày → today; < 00:30 → too-early; còn lại → ok', () => {
    const now = new Date(2026, 9, 5, 10, 0); // month 9 = October

    expect(dayAlarmWindow('2026-10-05T10:00', now)).toBe('past');
    expect(dayAlarmWindow('2026-10-05T23:59', now)).toBe('today');
    expect(dayAlarmWindow('2026-10-06T00:29', now)).toBe('too-early');
    expect(dayAlarmWindow('2026-10-06T00:30', now)).toBe('ok');
    expect(dayAlarmWindow('2026-10-06T09:00', now)).toBe('ok');
    expect(dayAlarmWindow('2026-10-08T07:00', now)).toBe('ok');
  });

  it('now = 2026-10-05 23:50 + at = 2026-10-06T00:40 → ok', () => {
    const now = new Date(2026, 9, 5, 23, 50);
    expect(dayAlarmWindow('2026-10-06T00:40', now)).toBe('ok');
  });

  it('at trước now → past', () => {
    const now = new Date(2026, 9, 5, 10, 0);
    expect(dayAlarmWindow('2026-10-05T09:00', now)).toBe('past');
    expect(dayAlarmWindow('2026-10-04T12:00', now)).toBe('past');
  });
});

describe('normalizeState', () => {
  it("thiếu / 42 / '' → ThemBaoThucNgay; 'Hen Bao Thuc' → giữ", () => {
    const base = {
      version: 1 as const,
      events: [],
      todos: [],
      design: defaultDesign(),
      device,
    };

    // thiếu
    const rMissing = normalizeState(base);
    expect(rMissing).not.toBeNull();
    expect(rMissing!.dayAlarmShortcutName).toBe('ThemBaoThucNgay');

    // 42 (không phải chuỗi)
    const rNumber = normalizeState({ ...base, dayAlarmShortcutName: 42 });
    expect(rNumber).not.toBeNull();
    expect(rNumber!.dayAlarmShortcutName).toBe('ThemBaoThucNgay');

    // '' (chuỗi rỗng)
    const rEmpty = normalizeState({ ...base, dayAlarmShortcutName: '' });
    expect(rEmpty).not.toBeNull();
    expect(rEmpty!.dayAlarmShortcutName).toBe('ThemBaoThucNgay');

    // 'Hen Bao Thuc' (chuỗi hợp lệ)
    const rValid = normalizeState({ ...base, dayAlarmShortcutName: 'Hen Bao Thuc' });
    expect(rValid).not.toBeNull();
    expect(rValid!.dayAlarmShortcutName).toBe('Hen Bao Thuc');
  });
});

describe('exportBackup / importBackup', () => {
  it('giữ tên đã đổi', () => {
    const s = defaultState(device);
    s.dayAlarmShortcutName = 'Hen Bao Thuc';

    const json = exportBackup(s);
    expect(JSON.parse(json).version).toBe(1);

    const result = importBackup(json);
    expect(result.dayAlarmShortcutName).toBe('Hen Bao Thuc');
    expect(result).toEqual(s);
  });
});

describe('reducer', () => {
  it('setDayAlarmShortcutName đặt tên mới, state cũ không đổi', () => {
    const state = defaultState(device);
    const next = reducer(state, { type: 'setDayAlarmShortcutName', name: 'Hen Bao Thuc' });

    expect(next.dayAlarmShortcutName).toBe('Hen Bao Thuc');
    expect(state.dayAlarmShortcutName).toBe('ThemBaoThucNgay'); // state cũ không đổi
    expect(next).not.toBe(state);
  });
});

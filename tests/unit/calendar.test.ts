import { describe, it, expect } from 'vitest';
import { toISODate, parseISODate, monthGrid } from '../../src/core/calendar';
import { defaultDesign, defaultState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

describe('toISODate / parseISODate', () => {
  it('không lệch ngày lúc 00:30', () => {
    const d = new Date(2026, 1, 1, 0, 30);
    expect(toISODate(d)).toBe('2026-02-01');
  });

  it('không lệch ngày lúc 23:30', () => {
    const d = new Date(2026, 1, 1, 23, 30);
    expect(toISODate(d)).toBe('2026-02-01');
  });

  it('parseISODate trả đúng thành phần giờ địa phương', () => {
    expect(parseISODate('2026-02-01')).toEqual({ y: 2026, m0: 1, d: 1 });
  });

  it('round-trip toISODate(parseISODate)', () => {
    const s = '2026-03-31';
    const { y, m0, d } = parseISODate(s);
    expect(toISODate(new Date(y, m0, d, 12))).toBe(s);
  });
});

describe('monthGrid', () => {
  it('2/2026, weekStart=1 (T2): luôn 6x7, [0][6]=2026-02-01 (CN), cuối tháng = 2026-02-28', () => {
    const grid = monthGrid(2026, 1, 1);
    expect(grid.length).toBe(6);
    grid.forEach((row) => expect(row.length).toBe(7));
    expect(grid[0][6]).toBe('2026-02-01');

    const flat = grid.flat();
    const lastInMonth = [...flat].reverse().find((c) => c !== null);
    expect(lastInMonth).toBe('2026-02-28');
  });

  it('3/2026, weekStart=0 (CN): [0][0]=2026-03-01, 2026-03-31 đúng vị trí', () => {
    const grid = monthGrid(2026, 2, 0);
    expect(grid.length).toBe(6);
    grid.forEach((row) => expect(row.length).toBe(7));
    expect(grid[0][0]).toBe('2026-03-01');
    expect(grid[4][2]).toBe('2026-03-31');
  });

  it('ô ngoài tháng luôn null', () => {
    const grid = monthGrid(2026, 1, 1);
    expect(grid[0][0]).toBeNull();
    expect(grid[5][6]).toBeNull();
  });
});

describe('defaultDesign / defaultState', () => {
  it('defaultDesign khớp mặc định SPEC mục 9', () => {
    const design = defaultDesign();
    expect(design.layout).toBe('month');
    expect(design.weekStart).toBe(1);
    expect(design.hour12).toBe(false);
    expect(design.lang).toBe('vi');
    expect(design.agendaDays).toBe(7);
    expect(design.showLunar).toBe(true);
  });

  it('defaultState dùng device truyền vào và shortcutName mặc định', () => {
    const device: DeviceSpec = {
      id: 'x',
      label: 'X',
      width: 1179,
      height: 2556,
      safeTop: 0.3,
      safeBottom: 0.14,
    };
    const state = defaultState(device);
    expect(state.version).toBe(1);
    expect(state.events).toEqual([]);
    expect(state.todos).toEqual([]);
    expect(state.device).toBe(device);
    expect(state.shortcutName).toBe('DatHinhNen');
    expect(state.google).toEqual({ clientId: '', calendarIds: [], cache: null });
  });
});

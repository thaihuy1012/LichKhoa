import { describe, it, expect } from 'vitest';
import { buildOps } from '../../src/render/wallpaper';
import { defaultState } from '../../src/core/model';
import { DEVICES } from '../../src/render/devices';

const DEV_1179 = DEVICES.find((d) => d.width === 1179 && d.height === 2556)!;

function textOf(op: { op: string; text?: string }): string {
  return op.op === 'text' ? (op as { text: string }).text : '';
}

describe('buildOps', () => {
  it('layout=month: dựng bố cục Tháng (có ô lưới ngày)', () => {
    const state = defaultState(DEV_1179);
    state.design.layout = 'month';
    const ops = buildOps(state, '2026-02-15');
    const dayTexts = ops.filter((op) => op.op === 'text' && /^\d{1,2}$/.test(textOf(op)));
    expect(dayTexts.length).toBeGreaterThan(0);
  });

  it('layout=agenda: có nhãn "Hôm nay"', () => {
    const state = defaultState(DEV_1179);
    state.design.layout = 'agenda';
    state.design.showLunar = false;
    state.events = [{ id: 'e1', title: 'Họp', date: '2026-02-15', repeat: 'none' }];
    const ops = buildOps(state, '2026-02-15');
    expect(ops.some((op) => textOf(op) === 'Hôm nay')).toBe(true);
  });

  it('layout=todo: dựng bố cục To-do (nhãn rỗng khi không có việc)', () => {
    const state = defaultState(DEV_1179);
    state.design.layout = 'todo';
    const ops = buildOps(state, '2026-02-15');
    expect(ops.some((op) => textOf(op) === 'Không có việc cần làm')).toBe(true);
  });

  it('showNote=true: thêm op ghi chú', () => {
    const state = defaultState(DEV_1179);
    state.design.showNote = true;
    state.design.noteText = 'Ghi chú thử';
    const opsWith = buildOps(state, '2026-02-15');
    expect(opsWith.some((op) => textOf(op) === 'Ghi chú thử')).toBe(true);

    const stateWithout = defaultState(DEV_1179);
    const opsWithout = buildOps(stateWithout, '2026-02-15');
    expect(opsWithout.some((op) => textOf(op) === 'Ghi chú thử')).toBe(false);
  });

  it('lang=en: tiêu đề tháng bằng tiếng Anh', () => {
    const state = defaultState(DEV_1179);
    state.design.lang = 'en';
    const ops = buildOps(state, '2026-02-15');
    expect(ops.some((op) => textOf(op) === 'February 2026')).toBe(true);
  });
});

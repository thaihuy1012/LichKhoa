import { describe, it, expect } from 'vitest';
import { layoutMonth } from '../../src/render/layout/month';
import { DEVICES } from '../../src/render/devices';
import { defaultDesign } from '../../src/core/model';
import type { RenderData, DesignConfig, DeviceSpec, Occurrence, Todo } from '../../src/core/model';

const DEV_1284 = DEVICES.find((d) => d.width === 1284 && d.height === 2778)!; // iPhone 12/13 Pro Max
const DEV_1179 = DEVICES.find((d) => d.width === 1179 && d.height === 2556)!;

function makeOccs(n: number, today: string): Occurrence[] {
  const dayOffsets = [0, 1, 2, 3, 4, 5, 6];
  return Array.from({ length: n }, (_, i) => {
    const offset = dayOffsets[i % dayOffsets.length];
    const [y, m, d] = today.split('-').map(Number);
    const date = new Date(y, m - 1, d + offset, 12);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { id: `o${i}`, sourceId: `e${i}`, source: 'local', title: `Sự kiện ${i}`, date: iso, allDay: true } as Occurrence;
  });
}

function makeTodos(n: number, due?: string): Todo[] {
  return Array.from({ length: n }, (_, i) => ({ id: `t${i}`, text: `Việc ${i}`, done: false, order: i, due }));
}

function renderData(today: string, occurrences: Occurrence[] = [], todos: Todo[] = []): RenderData {
  return { today, occurrences, todos, note: '' };
}

function textOps(ops: ReturnType<typeof layoutMonth>): string[] {
  return ops.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
}

function assertAllOpsInSafeArea(ops: ReturnType<typeof layoutMonth>, dev: DeviceSpec, design: DesignConfig) {
  const top = dev.height * dev.safeTop;
  // Vùng an toàn trừ dải ghi chú nếu bật (khớp mainArea trong common.ts).
  let bottom = dev.height * (1 - dev.safeBottom);
  if (design.showNote) {
    const size = dev.width * 0.032 * design.scale;
    const titleLineH = size * 1.4;
    bottom -= size * 1.35 * 4 + titleLineH + dev.height * 0.02;
  }
  for (const op of ops) {
    if (op.op === 'rect') {
      expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y + op.h).toBeLessThanOrEqual(bottom + 0.01);
    } else if (op.op === 'dot') {
      expect(op.y - op.r).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y + op.r).toBeLessThanOrEqual(bottom + 0.01);
    } else if (op.op === 'text') {
      expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y).toBeLessThanOrEqual(bottom + 0.01);
    }
  }
}

describe('layoutMonth: danh sách khi monthList=true (T-4.8)', () => {
  it('20 sự kiện + 10 to-do: có cả "+N sự kiện" và "+N việc", (đã hiện + N) = tổng', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const today = '2026-02-15';
    const d = renderData(today, makeOccs(20, today), makeTodos(10));
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);

    const moreEvents = texts.find((t) => /sự kiện nữa$/.test(t));
    const moreTodos = texts.find((t) => /việc nữa$/.test(t));
    expect(moreEvents).toBeDefined();
    expect(moreTodos).toBeDefined();

    const shownEvents = texts.filter((t) => t.startsWith('Sự kiện ')).length;
    const shownTodos = texts.filter((t) => t.startsWith('Việc ')).length;
    const nMoreEvents = Number(moreEvents!.match(/^\+(\d+)/)![1]);
    const nMoreTodos = Number(moreTodos!.match(/^\+(\d+)/)![1]);
    expect(shownEvents + nMoreEvents).toBe(20);
    expect(shownTodos + nMoreTodos).toBe(10);
  });

  it('0 to-do: sự kiện dùng hết trần L (không có "+N việc", danh sách toàn sự kiện)', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const today = '2026-02-15';
    const d = renderData(today, makeOccs(20, today), []);
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    expect(texts.some((t) => /việc nữa$/.test(t))).toBe(false);
    const shownEvents = texts.filter((t) => t.startsWith('Sự kiện ')).length;
    expect(shownEvents).toBeGreaterThan(2); // được cấp nhiều hơn ⌈L/2⌉ mặc định vì không có to-do
  });

  it('0 sự kiện + 3 to-do: hiện đủ 3 to-do', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const today = '2026-02-15';
    const d = renderData(today, [], makeTodos(3));
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    const shownTodos = texts.filter((t) => t.startsWith('Việc ')).length;
    expect(shownTodos).toBe(3);
    expect(texts.some((t) => /việc nữa$/.test(t))).toBe(false);
  });

  it('to-do đã xong không vào danh sách: 3 chưa xong + 5 đã xong -> chỉ 3 to-do, không "+N việc"', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const today = '2026-02-15';
    const undone = makeTodos(3);
    const done = makeTodos(5).map((t, i) => ({ ...t, id: `done${i}`, text: `Xong ${i}`, done: true }));
    const d = renderData(today, [], [...undone, ...done]);
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    const shownTodos = texts.filter((t) => t.startsWith('Việc ')).length;
    expect(shownTodos).toBe(3);
    expect(texts.some((t) => t.startsWith('Xong '))).toBe(false);
    expect(texts.some((t) => /việc nữa$/.test(t))).toBe(false);
  });

  it('0 chưa xong + 2 đã xong + 0 sự kiện -> agenda.empty', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const today = '2026-02-15';
    const done = makeTodos(2).map((t, i) => ({ ...t, id: `done${i}`, done: true }));
    const d = renderData(today, [], done);
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    expect(texts).toContain('Không có sự kiện sắp tới');
  });

  it('to-do quá hạn có nhãn màu accentColor', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true, accentColor: '#ff8800' };
    const today = '2026-02-15';
    const d = renderData(today, [], makeTodos(1, '2026-02-10'));
    const ops = layoutMonth(d, design, DEV_1179);
    const overdueLabel = ops.find((o) => o.op === 'text' && o.text === 'Quá hạn');
    expect(overdueLabel).toBeDefined();
    if (overdueLabel && overdueLabel.op === 'text') expect(overdueLabel.color).toBe('#ff8800');
  });

  it('không có sự kiện lẫn to-do: hiện text agenda.empty', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const d = renderData('2026-02-15', [], []);
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    expect(texts).toContain('Không có sự kiện sắp tới');
  });

  it('monthList=false: không có text sự kiện/to-do nào', () => {
    const design: DesignConfig = { ...defaultDesign(), monthList: false };
    const today = '2026-02-15';
    const d = renderData(today, makeOccs(5, today), makeTodos(5));
    const ops = layoutMonth(d, design, DEV_1179);
    const texts = textOps(ops);
    expect(texts.some((t) => t.startsWith('Sự kiện ') || t.startsWith('Việc '))).toBe(false);
  });

  it('mọi op nằm trong mainArea: 2 thiết bị x showNote x showLunar x position', () => {
    const devices = [DEV_1179, DEV_1284];
    const positions: DesignConfig['position'][] = ['top', 'middle', 'bottom'];
    for (const dev of devices) {
      for (const showNote of [true, false]) {
        for (const showLunar of [true, false]) {
          for (const position of positions) {
            const design: DesignConfig = { ...defaultDesign(), monthList: true, showNote, showLunar, position };
            const today = '2026-02-15';
            const d = renderData(today, makeOccs(10, today), makeTodos(5));
            const ops = layoutMonth(d, design, dev);
            assertAllOpsInSafeArea(ops, dev, design);
          }
        }
      }
    }
  });

  it('cỡ chữ số ngày khi có danh sách >= dev.width*0.028: 2 thiết bị x showNote x showLunar', () => {
    const devices = [DEV_1179, DEV_1284];
    for (const dev of devices) {
      for (const showNote of [true, false]) {
        for (const showLunar of [true, false]) {
          const design: DesignConfig = { ...defaultDesign(), monthList: true, showNote, showLunar };
          const today = '2026-02-15';
          const d = renderData(today, [], []);
          const ops = layoutMonth(d, design, dev);
          const dayText = ops.find((o) => o.op === 'text' && o.text === '15' && o.weight === 700);
          expect(dayText).toBeDefined();
          if (dayText && dayText.op === 'text') {
            expect(dayText.size).toBeGreaterThanOrEqual(dev.width * 0.028 - 0.01);
          }
        }
      }
    }
  });
});

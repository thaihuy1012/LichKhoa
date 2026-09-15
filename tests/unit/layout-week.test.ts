import { describe, it, expect } from 'vitest';
import { layoutWeek } from '../../src/render/layout/week';
import { layoutNote } from '../../src/render/layout/note';
import { weekDates, weekdayLabels, lunarCellLabel, mainArea, noteArea } from '../../src/render/layout/common';
import { DEVICES } from '../../src/render/devices';
import { defaultDesign } from '../../src/core/model';
import type { RenderData, DesignConfig, Occurrence, Todo } from '../../src/core/model';

const DEV_1284 = DEVICES.find((d) => d.width === 1284 && d.height === 2778)!;
const DEV_1179 = DEVICES.find((d) => d.width === 1179 && d.height === 2556)!;

function renderData(today: string, occurrences: Occurrence[] = [], todos: Todo[] = []): RenderData {
  return { today, occurrences, todos, note: '' };
}

function textOps(ops: ReturnType<typeof layoutWeek>) {
  return ops.filter((o) => o.op === 'text') as Extract<(typeof ops)[number], { op: 'text' }>[];
}

function bbox(ops: ReturnType<typeof layoutWeek>) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (const o of ops) {
    if (o.op === 'rect') {
      minY = Math.min(minY, o.y);
      maxY = Math.max(maxY, o.y + o.h);
    } else if (o.op === 'dot') {
      minY = Math.min(minY, o.y - o.r);
      maxY = Math.max(maxY, o.y + o.r);
    } else if (o.op === 'text') {
      minY = Math.min(minY, o.y);
      maxY = Math.max(maxY, o.y);
    }
  }
  return { minY, maxY };
}

describe('weekDates/weekdayLabels', () => {
  it('weekStart 1: today 2026-09-01 -> cột đầu là 31/8', () => {
    const dates = weekDates('2026-09-01', 1);
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2026-08-31');
    expect(dates).toContain('2026-09-01');
  });

  it('7 nhãn đầu cột đúng thứ tự cho weekStart 1 và 0', () => {
    const l1 = weekdayLabels(1, 'vi');
    const l0 = weekdayLabels(0, 'vi');
    expect(l1).toEqual(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']);
    expect(l0).toEqual(['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']);
  });
});

describe('layoutWeek', () => {
  const today = '2026-09-16'; // Thứ Tư
  const dates = weekDates(today, 1);
  const mon = dates[0];
  const tue = dates[1];

  it('ngày 6 mục -> 3 chip + "+3"; ngày 4 mục -> 4 chip, không "+N"', () => {
    const occ6: Occurrence[] = Array.from({ length: 6 }, (_, i) => ({
      id: `a${i}`,
      sourceId: `a${i}`,
      source: 'local',
      title: `Sáu-${i}`,
      date: mon,
      allDay: true,
    }));
    const occ4: Occurrence[] = Array.from({ length: 4 }, (_, i) => ({
      id: `b${i}`,
      sourceId: `b${i}`,
      source: 'local',
      title: `Bốn-${i}`,
      date: tue,
      allDay: true,
    }));
    const d = renderData(today, [...occ6, ...occ4]);
    const ops = layoutWeek(d, defaultDesign(), DEV_1284);
    const texts = textOps(ops).map((o) => o.text);

    const shownSix = occ6.filter((o) => texts.includes(o.title));
    expect(shownSix).toHaveLength(3);
    expect(texts).toContain('+3');

    const shownFour = occ4.filter((o) => texts.includes(o.title));
    expect(shownFour).toHaveLength(4);
    expect(texts).not.toContain('+1');
  });

  it('to-do quá hạn nằm ở cột hôm nay; to-do không hạn / đã xong không có op; chip có endTime chứa "09:00 - 09:40"', () => {
    const occ: Occurrence[] = [
      { id: 'e1', sourceId: 'e1', source: 'local', title: 'Có giờ kết thúc', date: today, time: '09:00', endTime: '09:40', allDay: false },
    ];
    const todos: Todo[] = [
      { id: 't1', text: 'Quá hạn của tôi', done: false, order: 0, due: '2026-09-10' },
      { id: 't2', text: 'Không hạn', done: false, order: 1 },
      { id: 't3', text: 'Đã xong quá hạn', done: true, order: 2, due: '2026-09-01' },
    ];
    const d = renderData(today, occ, todos);
    const ops = layoutWeek(d, defaultDesign(), DEV_1284);
    const texts = textOps(ops).map((o) => o.text);

    expect(texts.some((t) => t.includes('09:00 - 09:40'))).toBe(true);
    expect(texts).toContain('Quá hạn của tôi');
    expect(texts).not.toContain('Không hạn');
    expect(texts).not.toContain('Đã xong quá hạn');
  });

  it('máy đích 1284×2778, scale 1, 24h: chip hiện đủ khoảng giờ "09:00" và "09:40", không tràn bề rộng chip', () => {
    const occ: Occurrence[] = [
      { id: 'e1', sourceId: 'e1', source: 'local', title: 'Họp', date: today, time: '09:00', endTime: '09:40', allDay: false },
    ];
    const design: DesignConfig = { ...defaultDesign(), hour12: false, scale: 1 };
    const d = renderData(today, occ);
    const ops = layoutWeek(d, design, DEV_1284);

    const margin = DEV_1284.width * 0.05;
    const gridWidth = DEV_1284.width - 2 * margin;
    const gap = gridWidth * 0.008;
    const colW = (gridWidth - gap * 6) / 7;
    const chipTextSize = DEV_1284.width * 0.0187;
    const chipTimeSize = DEV_1284.width * 0.0159;
    const chipPad = chipTextSize * 0.22;
    const availWidth = colW - chipPad * 2;

    const chipLine = textOps(ops).find((o) => o.text.includes('09:00') && o.text.includes('09:40'));
    expect(chipLine).toBeDefined();
    if (chipLine) {
      expect(chipLine.size * 0.55 * chipLine.text.length).toBeLessThanOrEqual(availWidth + 0.5);
      expect(chipLine.size).toBeGreaterThanOrEqual(20);
      expect(chipLine.size).toBeCloseTo(chipTimeSize, 1);
    }
  });

  it('rect tô cột hôm nay có fill === accentColor, nằm đúng cột hôm nay', () => {
    const design: DesignConfig = { ...defaultDesign(), accentColor: '#123456' };
    const d = renderData(today);
    const ops = layoutWeek(d, design, DEV_1284);
    const accentRect = ops.find((o) => o.op === 'rect' && o.fill === '#123456');
    expect(accentRect).toBeDefined();

    const margin = DEV_1284.width * 0.05;
    const gridWidth = DEV_1284.width - 2 * margin;
    const gap = gridWidth * 0.008;
    const colW = (gridWidth - gap * 6) / 7;
    const todayIdx = dates.indexOf(today);
    const expectedX = margin + todayIdx * (colW + gap);
    if (accentRect && accentRect.op === 'rect') {
      expect(accentRect.x).toBeCloseTo(expectedX, 1);
    }
  });

  it('danh sách hôm nay: 2 mục -> đủ 2 tên; 30 mục -> có "+N" và (số hiện + N) = 30', () => {
    const two: Todo[] = [
      { id: 'x0', text: 'Việc A', done: false, order: 0, due: today },
      { id: 'x1', text: 'Việc B', done: false, order: 1, due: today },
    ];
    const d2 = renderData(today, [], two);
    const ops2 = layoutWeek(d2, defaultDesign(), DEV_1284);
    const names2 = textOps(ops2)
      .filter((o) => o.weight === 700 && (o.text === 'Việc A' || o.text === 'Việc B'))
      .map((o) => o.text);
    expect(new Set(names2).size).toBe(2);

    const thirty: Todo[] = Array.from({ length: 30 }, (_, i) => ({
      id: `y${i}`,
      text: `Việc ${i}`,
      done: false,
      order: i,
      due: today,
    }));
    const d30 = renderData(today, [], thirty);
    const ops30 = layoutWeek(d30, defaultDesign(), DEV_1284);
    const texts30 = textOps(ops30).map((o) => o.text);
    const more = texts30.find((t) => /^\+\d+ /.test(t));
    expect(more).toBeDefined();
    const n = Number(more!.match(/\d+/)![0]);
    const shownNames = thirty.filter((t) => texts30.includes(t.text)).length;
    expect(shownNames + n).toBe(30);
  });

  it('showLunar true có op âm lịch, false không có', () => {
    const d = renderData(today);
    const withLunar = layoutWeek(d, { ...defaultDesign(), showLunar: true }, DEV_1284);
    const withoutLunar = layoutWeek(d, { ...defaultDesign(), showLunar: false }, DEV_1284);
    const label = lunarCellLabel(today);
    expect(textOps(withLunar).some((o) => o.text === label)).toBe(true);
    expect(textOps(withoutLunar).some((o) => o.text === label)).toBe(false);
  });

  it('mọi op trong mainArea (1284x2778, 1179x2556) x 3 position x showNote x showLunar; showNote -> bbox không giao layoutNote', () => {
    const occ: Occurrence[] = [
      { id: 'e1', sourceId: 'e1', source: 'local', title: 'Sự kiện', date: today, time: '09:00', endTime: '10:00', allDay: false },
      { id: 'e2', sourceId: 'e2', source: 'local', title: 'Sự kiện dài', date: mon, allDay: true },
    ];
    const todos: Todo[] = [{ id: 't1', text: 'Việc', done: false, order: 0, due: today }];
    const d: RenderData = { ...renderData(today, occ, todos), note: 'Ghi chú ngắn', noteTitle: 'Tiêu đề' };

    for (const dev of [DEV_1284, DEV_1179]) {
      for (const position of ['top', 'middle', 'bottom'] as const) {
        for (const showNote of [false, true]) {
          for (const showLunar of [false, true]) {
            const design: DesignConfig = { ...defaultDesign(), position, showNote, showLunar };
            const ops = layoutWeek(d, design, dev);
            const area = mainArea(dev, design);
            for (const op of ops) {
              if (op.op === 'rect') {
                expect(op.y).toBeGreaterThanOrEqual(area.top - 0.5);
                expect(op.y + op.h).toBeLessThanOrEqual(area.bottom + 0.5);
              } else if (op.op === 'text') {
                expect(op.y).toBeGreaterThanOrEqual(area.top - 0.5);
                expect(op.y).toBeLessThanOrEqual(area.bottom + 0.5);
              } else if (op.op === 'dot') {
                expect(op.y - op.r).toBeGreaterThanOrEqual(area.top - 0.5);
                expect(op.y + op.r).toBeLessThanOrEqual(area.bottom + 0.5);
              }
            }
            if (showNote) {
              const noteOps = layoutNote(d, design, dev);
              const weekBox = bbox(ops);
              const noteBox = bbox(noteOps);
              const nArea = noteArea(dev, design);
              expect(nArea.top).toBeGreaterThanOrEqual(weekBox.maxY - 0.5);
              void noteBox;
            }
          }
        }
      }
    }
  });
});

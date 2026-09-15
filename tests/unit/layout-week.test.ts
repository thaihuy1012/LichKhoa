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

    const chipLine = textOps(ops).find((o) => o.text.includes('09:00') && o.text.includes('09:40'));
    expect(chipLine).toBeDefined();
    // Bề rộng chip suy từ rect chip (r=10) chứa dòng giờ, không chép hằng lề/cột của week.ts (D-025 d).
    const chipRect = ops.find((o) => o.op === 'rect' && o.r === 10) as Extract<(typeof ops)[number], { op: 'rect' }> | undefined;
    expect(chipRect).toBeDefined();
    if (chipLine && chipRect) {
      const pad = chipLine.x - chipRect.x;
      const availWidth = chipRect.w - pad * 2;
      expect(chipLine.size * 0.55 * chipLine.text.length).toBeLessThanOrEqual(availWidth + 0.5);
      expect(chipLine.size).toBeGreaterThanOrEqual(20);
    }
  });

  it('hour12: cùng buổi cắt hậu tố AM/PM ở giờ bắt đầu; vắt qua trưa giữ đủ 2 hậu tố; 24h không đổi (T-5.4 a)', () => {
    const sameOcc: Occurrence[] = [
      { id: 'e1', sourceId: 'e1', source: 'local', title: 'Cùng buổi', date: today, time: '09:00', endTime: '11:00', allDay: false },
    ];
    const opsSame = layoutWeek(renderData(today, sameOcc), { ...defaultDesign(), hour12: true }, DEV_1284);
    expect(textOps(opsSame).some((o) => o.text.includes('9:00 - 11:00 AM'))).toBe(true);

    const crossOcc: Occurrence[] = [
      { id: 'e2', sourceId: 'e2', source: 'local', title: 'Vắt trưa', date: today, time: '11:00', endTime: '13:00', allDay: false },
    ];
    // Scale nhỏ để chip đủ rộng chứa chuỗi đầy đủ ở máy đích.
    const opsCross = layoutWeek(renderData(today, crossOcc), { ...defaultDesign(), hour12: true, scale: 0.6 }, DEV_1284);
    expect(textOps(opsCross).some((o) => o.text.includes('11:00 AM') && o.text.includes('1:00 PM'))).toBe(true);

    const dayOcc: Occurrence[] = [
      { id: 'e3', sourceId: 'e3', source: 'local', title: '24h', date: today, time: '09:00', endTime: '09:40', allDay: false },
    ];
    const ops24 = layoutWeek(renderData(today, dayOcc), { ...defaultDesign(), hour12: false }, DEV_1284);
    expect(textOps(ops24).some((o) => o.text.includes('09:00 - 09:40'))).toBe(true);
  });

  it('font mono: mọi op text trong chip vừa ước lượng 0.62×size×len ≤ bề rộng chip, 1284×2778 (T-5.4 b)', () => {
    const occ: Occurrence[] = [
      { id: 'e1', sourceId: 'e1', source: 'local', title: 'Cuộc họp dài dài quan trọng', date: today, time: '09:00', endTime: '09:40', allDay: false },
    ];
    const todos: Todo[] = [
      { id: 't1', text: 'Việc rất dài cần làm hôm nay ngay bây giờ', done: false, order: 0, due: today },
    ];
    const d = renderData(today, occ, todos);
    const ops = layoutWeek(d, { ...defaultDesign(), font: 'mono' }, DEV_1284);

    let checked = 0;
    for (let i = 0; i < ops.length - 2; i++) {
      const rect = ops[i];
      const l1 = ops[i + 1];
      const l2 = ops[i + 2];
      if (rect.op !== 'rect' || rect.r !== 10 || rect.alpha === 0.16) continue; // bỏ chip "+N"
      if (l1.op !== 'text' || l2.op !== 'text') continue;
      const pad = l1.x - rect.x;
      const availWidth = rect.w - pad * 2;
      expect(l1.size * 0.62 * l1.text.length).toBeLessThanOrEqual(availWidth + 0.5);
      expect(l2.size * 0.62 * l2.text.length).toBeLessThanOrEqual(availWidth + 0.5);
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(2);
  });

  it('rect tô cột hôm nay có fill === accentColor, nằm đúng cột hôm nay', () => {
    const design: DesignConfig = { ...defaultDesign(), accentColor: '#123456' };
    const d = renderData(today);
    const ops = layoutWeek(d, design, DEV_1284);
    const accentRect = ops.find((o) => o.op === 'rect' && o.fill === '#123456');
    expect(accentRect).toBeDefined();

    // Tâm cột suy từ x của op nhãn thứ (D-025 d, như `tests/e2e/m5-week.spec.ts` columnCenters).
    const todayIdx = dates.indexOf(today);
    const labels = weekdayLabels(1, 'vi');
    const centers = labels.map((label) => textOps(ops).find((o) => o.text === label)!.x);
    expect(centers).toHaveLength(7);
    if (accentRect && accentRect.op === 'rect') {
      const contains = (x: number) => x >= accentRect.x - 0.5 && x <= accentRect.x + accentRect.w + 0.5;
      expect(contains(centers[todayIdx])).toBe(true);
      for (let i = 0; i < 7; i++) {
        if (i === todayIdx) continue;
        expect(contains(centers[i])).toBe(false);
      }
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

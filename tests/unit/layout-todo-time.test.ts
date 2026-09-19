import { describe, it, expect } from 'vitest';
import { todoDueLabel } from '../../src/render/layout/common';
import { layoutTodo } from '../../src/render/layout/todo';
import { layoutMonth } from '../../src/render/layout/month';
import { layoutWeek } from '../../src/render/layout/week';
import { DEVICES } from '../../src/render/devices';
import { defaultDesign } from '../../src/core/model';
import type { RenderData, DesignConfig, Todo } from '../../src/core/model';

const DEV_1284 = DEVICES.find((d) => d.width === 1284 && d.height === 2778)!;

describe('todoDueLabel (v1.10, D-035)', () => {
  const today = '2026-10-05';

  it("todoDueLabel('2026-10-05', today, 'vi', '14:00') → { text: 'Hôm nay 14:00', overdue: false }", () => {
    expect(todoDueLabel('2026-10-05', today, 'vi', '14:00')).toEqual({
      text: 'Hôm nay 14:00',
      overdue: false,
    });
  });

  it("todoDueLabel('2026-10-06', today, 'vi', '07:05') → '6/10 07:05'", () => {
    expect(todoDueLabel('2026-10-06', today, 'vi', '07:05')).toEqual({
      text: '6/10 07:05',
      overdue: false,
    });
  });

  it("todoDueLabel('2026-10-06', today, 'vi', '07:05', hour12=true) → '6/10 7:05 AM'", () => {
    expect(todoDueLabel('2026-10-06', today, 'vi', '07:05', true)).toEqual({
      text: '6/10 7:05 AM',
      overdue: false,
    });
  });

  it("todoDueLabel('2026-10-04', today, 'vi', '14:00') → 'Quá hạn', overdue: true", () => {
    expect(todoDueLabel('2026-10-04', today, 'vi', '14:00')).toEqual({
      text: 'Quá hạn',
      overdue: true,
    });
  });

  it("Không dueTime → 'Hôm nay' / '6/10' / 'Quá hạn' (y hệt v1.3)", () => {
    expect(todoDueLabel('2026-10-05', today, 'vi')).toEqual({
      text: 'Hôm nay',
      overdue: false,
    });
    expect(todoDueLabel('2026-10-06', today, 'vi')).toEqual({
      text: '6/10',
      overdue: false,
    });
    expect(todoDueLabel('2026-10-04', today, 'vi')).toEqual({
      text: 'Quá hạn',
      overdue: true,
    });
  });

  it("lang = 'en' hôm nay → 'Today 14:00'", () => {
    expect(todoDueLabel('2026-10-05', today, 'en', '14:00')).toEqual({
      text: 'Today 14:00',
      overdue: false,
    });
    expect(todoDueLabel('2026-10-04', today, 'en', '14:00')).toEqual({
      text: 'Overdue',
      overdue: true,
    });
  });
});

describe('3 bố cục với việc có giờ hạn (layoutTodo, layoutMonth, layoutWeek)', () => {
  const today = '2026-10-05';

  const todoTodayTimed: Todo = {
    id: 't-today-timed',
    text: 'Việc hôm nay 16:00',
    done: false,
    order: 0,
    due: '2026-10-05',
    dueTime: '16:00',
  };

  const todoOverdueTimed: Todo = {
    id: 't-overdue-timed',
    text: 'Việc quá hạn có giờ',
    done: false,
    order: 1,
    due: '2026-10-04',
    dueTime: '14:00',
  };

  it('layoutTodo: ops có text nhãn kèm giờ ("Hôm nay 16:00"); việc quá hạn không hiện giờ', () => {
    const d: RenderData = {
      today,
      occurrences: [],
      todos: [todoTodayTimed, todoOverdueTimed],
      note: '',
    };
    const ops = layoutTodo(d, defaultDesign(), DEV_1284);
    const texts = ops.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);

    expect(texts).toContain('Hôm nay 16:00');
    expect(texts).toContain('Quá hạn');
    expect(texts.some((t) => t.includes('14:00'))).toBe(false);
  });

  it('layoutMonth (monthList bật): ops có text nhãn kèm giờ ("Hôm nay 16:00"); việc quá hạn không hiện giờ', () => {
    const d: RenderData = {
      today,
      occurrences: [],
      todos: [todoTodayTimed, todoOverdueTimed],
      note: '',
    };
    const design: DesignConfig = { ...defaultDesign(), monthList: true };
    const ops = layoutMonth(d, design, DEV_1284);
    const texts = ops.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);

    expect(texts).toContain('Hôm nay 16:00');
    expect(texts).toContain('Quá hạn');
    expect(texts.some((t) => t.includes('14:00'))).toBe(false);
  });

  it('layoutWeek: ops có text "Hôm nay 16:00" và chip Tuần dòng 1 "☐ 16:00"; việc quá hạn không hiện giờ', () => {
    const d: RenderData = {
      today,
      occurrences: [],
      todos: [todoTodayTimed, todoOverdueTimed],
      note: '',
    };
    const ops = layoutWeek(d, defaultDesign(), DEV_1284);
    const texts = ops.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);

    expect(texts).toContain('☐ 16:00');
    expect(texts).toContain('Hôm nay 16:00');
    expect(texts.some((t) => t.includes('14:00'))).toBe(false);
  });

  it('hour12=true: layoutTodo và layoutWeek định dạng 12h (AM/PM)', () => {
    const todoAm: Todo = {
      id: 't-am',
      text: 'Việc buổi sáng',
      done: false,
      order: 0,
      due: '2026-10-05',
      dueTime: '07:05',
    };
    const d: RenderData = { today, occurrences: [], todos: [todoAm], note: '' };
    const design: DesignConfig = { ...defaultDesign(), hour12: true };

    const opsTodo = layoutTodo(d, design, DEV_1284);
    const textsTodo = opsTodo.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
    expect(textsTodo).toContain('Hôm nay 7:05 AM');

    const opsWeek = layoutWeek(d, design, DEV_1284);
    const textsWeek = opsWeek.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
    expect(textsWeek).toContain('☐ 7:05 AM');
    expect(textsWeek).toContain('Hôm nay 7:05 AM');
  });

  it('lang=en: layoutTodo và layoutWeek có "Today 16:00"', () => {
    const d: RenderData = { today, occurrences: [], todos: [todoTodayTimed], note: '' };
    const design: DesignConfig = { ...defaultDesign(), lang: 'en' };

    const opsTodo = layoutTodo(d, design, DEV_1284);
    const textsTodo = opsTodo.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
    expect(textsTodo).toContain('Today 16:00');

    const opsWeek = layoutWeek(d, design, DEV_1284);
    const textsWeek = opsWeek.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
    expect(textsWeek).toContain('Today 16:00');
    expect(textsWeek).toContain('☐ 16:00');
  });
});

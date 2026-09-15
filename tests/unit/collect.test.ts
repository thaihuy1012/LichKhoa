import { describe, it, expect } from 'vitest';
import { groupAgenda } from '../../src/core/calendar';
import { collectRenderData } from '../../src/core/collect';
import { defaultState } from '../../src/core/model';
import type { DeviceSpec, LocalEvent, Occurrence, Todo } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'x',
  label: 'X',
  width: 1179,
  height: 2556,
  safeTop: 0.3,
  safeBottom: 0.14,
};

function occ(date: string, time: string | undefined, title: string, id = `${date}-${title}`): Occurrence {
  return {
    id,
    sourceId: id,
    source: 'local',
    title,
    date,
    time,
    allDay: !time,
  };
}

describe('groupAgenda', () => {
  it('nhóm 7 ngày đúng thứ tự, bỏ ngày trống', () => {
    const items = [
      occ('2026-03-01', undefined, 'A'),
      occ('2026-03-01', '09:00', 'B'),
      occ('2026-03-03', '10:00', 'C'),
    ];
    const grouped = groupAgenda(items, '2026-03-01', 7);
    expect(grouped.map((g) => g.date)).toEqual(['2026-03-01', '2026-03-03']);
    expect(grouped[0].items.map((i) => i.title)).toEqual(['A', 'B']);
    expect(grouped[1].items.map((i) => i.title)).toEqual(['C']);
  });

  it('chỉ lấy trong khoảng [from, from+days-1]', () => {
    const items = [occ('2026-02-28', undefined, 'Out'), occ('2026-03-05', undefined, 'Out2')];
    const grouped = groupAgenda(items, '2026-03-01', 3);
    expect(grouped).toEqual([]);
  });
});

describe('collectRenderData', () => {
  it('cache Google null không lỗi', () => {
    const state = defaultState(device);
    const data = collectRenderData(state, '2026-03-15');
    expect(data.occurrences).toEqual([]);
    expect(data.today).toBe('2026-03-15');
  });

  it('sự kiện ngày trước today trong cùng tháng vẫn có trong occurrences', () => {
    const state = defaultState(device);
    const ev: LocalEvent = {
      id: 'e1',
      title: 'Early',
      date: '2026-03-02',
      repeat: 'none',
    };
    state.events = [ev];
    const data = collectRenderData(state, '2026-03-15');
    expect(data.occurrences.some((o) => o.date === '2026-03-02')).toBe(true);
  });

  it('trộn local + google đúng thứ tự (ngày -> allDay -> giờ -> tiêu đề)', () => {
    const state = defaultState(device);
    const ev: LocalEvent = {
      id: 'e1',
      title: 'Zeta',
      date: '2026-03-15',
      time: '08:00',
      repeat: 'none',
    };
    state.events = [ev];
    state.google.cache = {
      fetchedAt: 0,
      events: [
        occ('2026-03-15', undefined, 'AllDayG', 'g1'),
        occ('2026-03-15', '07:00', 'EarlyG', 'g2'),
      ],
    };
    const data = collectRenderData(state, '2026-03-15');
    const mar15 = data.occurrences.filter((o) => o.date === '2026-03-15');
    expect(mar15.map((o) => o.title)).toEqual(['AllDayG', 'EarlyG', 'Zeta']);
  });

  it('todos sắp theo order', () => {
    const state = defaultState(device);
    const todos: Todo[] = [
      { id: 't2', text: 'B', done: false, order: 2 },
      { id: 't1', text: 'A', done: false, order: 1 },
    ];
    state.todos = todos;
    const data = collectRenderData(state, '2026-03-15');
    expect(data.todos.map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('note theo showNote, lấy từ ghi chú ghim', () => {
    const state = defaultState(device);
    state.design.showNote = true;
    state.notes = [{ id: 'n1', title: '', body: 'hello', pinned: true, updated: 0 }];
    expect(collectRenderData(state, '2026-03-15').note).toBe('hello');
    state.design.showNote = false;
    expect(collectRenderData(state, '2026-03-15').note).toBe('');
  });

  it('note/noteTitle lấy từ ghi chú ghim; không có ghi chú ghim -> rỗng/undefined', () => {
    const state = defaultState(device);
    state.design.showNote = true;
    state.notes = [
      { id: 'n1', title: '', body: 'not pinned', pinned: false, updated: 0 },
      { id: 'n2', title: 'Tiêu đề', body: 'Nội dung', pinned: true, updated: 1 },
    ];
    const data = collectRenderData(state, '2026-03-15');
    expect(data.note).toBe('Nội dung');
    expect(data.noteTitle).toBe('Tiêu đề');

    state.notes = [];
    const data2 = collectRenderData(state, '2026-03-15');
    expect(data2.note).toBe('');
    expect(data2.noteTitle).toBeUndefined();
  });

  it('todos: chưa xong có due tăng dần -> chưa xong không due theo order -> đã xong theo order', () => {
    const state = defaultState(device);
    const todos: Todo[] = [
      { id: 'done1', text: 'Done', done: true, order: 0 },
      { id: 'nodue2', text: 'NoDue2', done: false, order: 2 },
      { id: 'due2', text: 'Due2', done: false, order: 5, due: '2026-03-20' },
      { id: 'nodue1', text: 'NoDue1', done: false, order: 1 },
      { id: 'due1', text: 'Due1', done: false, order: 9, due: '2026-03-10' },
    ];
    state.todos = todos;
    const data = collectRenderData(state, '2026-03-15');
    expect(data.todos.map((t) => t.id)).toEqual(['due1', 'due2', 'nodue1', 'nodue2', 'done1']);
  });

  it('T-5.1: today đầu tháng -> sự kiện tuần trước (tháng trước) vẫn có, ngoài tuần thì không', () => {
    const state = defaultState(device);
    state.events = [
      { id: 'inWeek', title: 'InWeek', date: '2026-08-31', repeat: 'none' },
      { id: 'outWeek', title: 'OutWeek', date: '2026-08-25', repeat: 'none' },
    ];
    const data = collectRenderData(state, '2026-09-01');
    const titles = data.occurrences.map((o) => o.title);
    expect(titles).toContain('InWeek');
    expect(titles).not.toContain('OutWeek');
  });

  it('2 TZ giả lập: sự kiện đầu tháng và cuối agenda vẫn nằm trong khoảng expand', () => {
    const state = defaultState(device);
    state.design.agendaDays = 10;
    state.events = [
      { id: 'e1', title: 'FirstOfMonth', date: '2026-03-01', repeat: 'none' },
      {
        id: 'e2',
        title: 'AgendaEnd',
        date: '2026-03-24',
        repeat: 'none',
      },
    ];
    const data = collectRenderData(state, '2026-03-15');
    const titles = data.occurrences.map((o) => o.title);
    expect(titles).toContain('FirstOfMonth');
    expect(titles).toContain('AgendaEnd');
  });
});

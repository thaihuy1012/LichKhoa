import { describe, it, expect } from 'vitest';
import { reducer } from '../../src/ui/store';
import { defaultState, defaultDesign } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'iphone-1179x2556',
  label: 'iPhone 1179x2556',
  width: 1179,
  height: 2556,
  safeTop: 0.06,
  safeBottom: 0.1,
};

const device2: DeviceSpec = {
  id: 'iphone-1290x2796',
  label: 'iPhone 1290x2796',
  width: 1290,
  height: 2796,
  safeTop: 0.06,
  safeBottom: 0.1,
};

describe('reducer', () => {
  it('setDevice đổi device, giữ nguyên phần còn lại, không mutate state cũ', () => {
    const state = defaultState(device);
    const next = reducer(state, { type: 'setDevice', device: device2 });

    expect(next.device).toEqual(device2);
    expect(next.design).toEqual(state.design);
    expect(state.device).toEqual(device); // state cũ không bị mutate
    expect(next).not.toBe(state);
  });

  it('setDesign gộp partial vào design hiện tại, không mutate state cũ', () => {
    const state = defaultState(device);
    const next = reducer(state, { type: 'setDesign', partial: { accentColor: '#ff0000', scale: 1.2 } });

    expect(next.design.accentColor).toBe('#ff0000');
    expect(next.design.scale).toBe(1.2);
    expect(next.design.textColor).toBe(state.design.textColor);
    expect(state.design).toEqual(defaultDesign()); // state cũ không bị mutate
    expect(next.design).not.toBe(state.design);
  });

  it('load thay toàn bộ state', () => {
    const state = defaultState(device);
    const loaded = defaultState(device2);
    const next = reducer(state, { type: 'load', state: loaded });

    expect(next).toEqual(loaded);
  });

  it('addEvent/updateEvent/deleteEvent CRUD sự kiện, không mutate state cũ', () => {
    const state = defaultState(device);
    const ev = { id: 'e1', title: 'Họp', date: '2026-02-15', repeat: 'none' as const };
    const s1 = reducer(state, { type: 'addEvent', event: ev });
    expect(s1.events).toEqual([ev]);
    expect(state.events).toEqual([]);

    const ev2 = { ...ev, title: 'Họp sửa' };
    const s2 = reducer(s1, { type: 'updateEvent', event: ev2 });
    expect(s2.events).toEqual([ev2]);
    expect(s1.events).toEqual([ev]);

    const s3 = reducer(s2, { type: 'deleteEvent', id: 'e1' });
    expect(s3.events).toEqual([]);
  });

  it('addTodo tạo id, done:false; toggleTodo/updateTodo/deleteTodo hoạt động, không mutate', () => {
    const state = defaultState(device);
    const s1 = reducer(state, { type: 'addTodo', text: 'Việc 1' });
    expect(s1.todos.length).toBe(1);
    expect(s1.todos[0].text).toBe('Việc 1');
    expect(s1.todos[0].done).toBe(false);
    expect(typeof s1.todos[0].id).toBe('string');
    expect(state.todos).toEqual([]);

    const id = s1.todos[0].id;
    const s2 = reducer(s1, { type: 'toggleTodo', id });
    expect(s2.todos[0].done).toBe(true);
    expect(s1.todos[0].done).toBe(false);

    const s3 = reducer(s2, { type: 'updateTodo', id, text: 'Việc 1 sửa' });
    expect(s3.todos[0].text).toBe('Việc 1 sửa');

    const s4 = reducer(s3, { type: 'deleteTodo', id });
    expect(s4.todos).toEqual([]);
  });

  it('moveTodo đổi thứ tự, giữ nguyên ở biên', () => {
    const state = defaultState(device);
    const s1 = reducer(state, { type: 'addTodo', text: 'A' });
    const s2 = reducer(s1, { type: 'addTodo', text: 'B' });
    const [a, b] = s2.todos;

    const s3 = reducer(s2, { type: 'moveTodo', id: b.id, dir: -1 });
    const sorted3 = [...s3.todos].sort((x, y) => x.order - y.order);
    expect(sorted3[0].id).toBe(b.id);
    expect(sorted3[1].id).toBe(a.id);

    const s4 = reducer(s3, { type: 'moveTodo', id: b.id, dir: -1 }); // đã ở đầu, giữ nguyên
    expect(s4).toEqual(s3);

    const s5 = reducer(s3, { type: 'moveTodo', id: a.id, dir: 1 }); // đã ở cuối, giữ nguyên
    expect(s5).toEqual(s3);
  });

  it('T-2.14: moveTodo chỉ hoán đổi trong cùng nhóm (done/due) theo thứ tự hiển thị cmpTodo, không mutate', () => {
    const state = defaultState(device);
    const loaded = {
      ...defaultState(device),
      todos: [
        { id: 't1', text: 't1', done: false, order: 0 }, // không hạn
        { id: 't2', text: 't2', done: false, order: 1 }, // không hạn
        { id: 't3', text: 't3', done: true, order: 2 }, // đã xong
        { id: 't4', text: 't4', done: false, order: 3, due: '2099-01-01' }, // có hạn
      ],
    };
    const s0 = reducer(state, { type: 'load', state: loaded });
    // Thứ tự hiển thị (cmpTodo): t4 (có hạn) -> t1, t2 (không hạn) -> t3 (đã xong).

    // Cùng nhóm "không hạn": t1 <-> t2 hoán đổi được.
    const s1 = reducer(s0, { type: 'moveTodo', id: 't1', dir: 1 });
    expect(s1.todos.find((t) => t.id === 't1')!.order).toBe(1);
    expect(s1.todos.find((t) => t.id === 't2')!.order).toBe(0);
    expect(loaded.todos.find((t) => t.id === 't1')!.order).toBe(0); // không mutate state cũ

    // Khác nhóm (t1 "không hạn" kề t4 "có hạn" trong thứ tự hiển thị) -> giữ nguyên.
    const s2 = reducer(s0, { type: 'moveTodo', id: 't1', dir: -1 });
    expect(s2).toEqual(s0);

    // Khác nhóm (t2 "không hạn" kề t3 "đã xong") -> giữ nguyên.
    const s3 = reducer(s0, { type: 'moveTodo', id: 't2', dir: 1 });
    expect(s3).toEqual(s0);
  });

  it('addNote/updateNote/deleteNote CRUD ghi chú, không mutate state cũ', () => {
    const state = defaultState(device);
    const note = { id: 'n1', title: 'T', body: 'B', pinned: false, updated: 1 };
    const s1 = reducer(state, { type: 'addNote', note });
    expect(s1.notes).toEqual([note]);
    expect(state.notes).toEqual([]);

    const note2 = { ...note, body: 'B2' };
    const s2 = reducer(s1, { type: 'updateNote', note: note2 });
    expect(s2.notes).toEqual([note2]);
    expect(s1.notes).toEqual([note]);

    const s3 = reducer(s2, { type: 'deleteNote', id: 'n1' });
    expect(s3.notes).toEqual([]);
  });

  it('pinNote ghim đúng 1 ghi chú, bỏ ghim các cái khác', () => {
    const state = defaultState(device);
    const a = { id: 'a', title: '', body: 'A', pinned: true, updated: 1 };
    const b = { id: 'b', title: '', body: 'B', pinned: false, updated: 1 };
    const s1 = { ...state, notes: [a, b] };

    const s2 = reducer(s1, { type: 'pinNote', id: 'b', pinned: true });
    expect(s2.notes.find((n) => n.id === 'a')!.pinned).toBe(false);
    expect(s2.notes.find((n) => n.id === 'b')!.pinned).toBe(true);
    expect(s1.notes).toEqual([a, b]); // không mutate
  });

  it('replaceState hợp lệ thay toàn bộ state qua normalizeState; null giữ state cũ', () => {
    const state = defaultState(device);
    const raw = { version: 1, device: device2 };
    const next = reducer(state, { type: 'replaceState', state: raw });
    expect(next.device).toEqual(device2);

    const same = reducer(state, { type: 'replaceState', state: null });
    expect(same).toBe(state);

    const invalid = reducer(state, { type: 'replaceState', state: { version: 2 } });
    expect(invalid).toBe(state);
  });

  it('resetAll về defaultState nhưng giữ device', () => {
    const state = defaultState(device);
    const withData = reducer(state, { type: 'addTodo', text: 'X' });
    const reset = reducer(withData, { type: 'resetAll' });
    expect(reset).toEqual(defaultState(device));
    expect(reset.device).toEqual(device);
  });
});

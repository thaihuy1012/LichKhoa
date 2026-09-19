import { describe, it, expect } from 'vitest';
import { cmpTodo } from '../../src/core/collect';
import { defaultState, defaultDesign, normalizeState } from '../../src/core/model';
import type { DeviceSpec, Todo } from '../../src/core/model';
import { sameTodoGroup, reducer } from '../../src/ui/store';
import { exportBackup, importBackup } from '../../src/storage/backup';
import { defaultReminderAt } from '../../src/export/reminder';

const device: DeviceSpec = {
  id: 'test-device',
  label: 'Test Device',
  width: 1179,
  height: 2556,
  safeTop: 0.3,
  safeBottom: 0.14,
};

describe('cmpTodo (v1.10, D-035)', () => {
  it('[A 2026-10-06 10:00 · B 2026-10-06 không giờ · C 2026-10-06 08:00 · D 2026-10-05 không giờ · E không hạn · F đã xong] → D, C, A, B, E, F', () => {
    const a: Todo = { id: 'A', text: 'A', done: false, order: 1, due: '2026-10-06', dueTime: '10:00' };
    const b: Todo = { id: 'B', text: 'B', done: false, order: 2, due: '2026-10-06' };
    const c: Todo = { id: 'C', text: 'C', done: false, order: 3, due: '2026-10-06', dueTime: '08:00' };
    const d: Todo = { id: 'D', text: 'D', done: false, order: 4, due: '2026-10-05' };
    const e: Todo = { id: 'E', text: 'E', done: false, order: 5 };
    const f: Todo = { id: 'F', text: 'F', done: true, order: 6, due: '2026-10-04' };

    const shuffled = [b, f, a, e, c, d];
    const sorted = shuffled.sort(cmpTodo);
    expect(sorted.map((t) => t.id)).toEqual(['D', 'C', 'A', 'B', 'E', 'F']);
  });

  it('cùng (due, dueTime) → theo order', () => {
    const t1: Todo = { id: 'T1', text: 'T1', done: false, order: 10, due: '2026-10-06', dueTime: '08:00' };
    const t2: Todo = { id: 'T2', text: 'T2', done: false, order: 20, due: '2026-10-06', dueTime: '08:00' };
    expect([t2, t1].sort(cmpTodo).map((t) => t.id)).toEqual(['T1', 'T2']);

    const t3: Todo = { id: 'T3', text: 'T3', done: false, order: 5, due: '2026-10-06' };
    const t4: Todo = { id: 'T4', text: 'T4', done: false, order: 15, due: '2026-10-06' };
    expect([t4, t3].sort(cmpTodo).map((t) => t.id)).toEqual(['T3', 'T4']);
  });
});

describe('sameTodoGroup (v1.10, D-035)', () => {
  it('cùng ngày khác giờ → false; một có giờ một không → false; cùng ngày cùng giờ → true', () => {
    const withTime1: Todo = { id: '1', text: '1', done: false, order: 0, due: '2026-10-06', dueTime: '08:00' };
    const withTime2: Todo = { id: '2', text: '2', done: false, order: 1, due: '2026-10-06', dueTime: '10:00' };
    const withoutTime1: Todo = { id: '3', text: '3', done: false, order: 2, due: '2026-10-06' };
    const withoutTime2: Todo = { id: '4', text: '4', done: false, order: 3, due: '2026-10-06' };
    const sameTime: Todo = { id: '5', text: '5', done: false, order: 4, due: '2026-10-06', dueTime: '08:00' };

    // cùng ngày khác giờ → false
    expect(sameTodoGroup(withTime1, withTime2)).toBe(false);
    // một có giờ một không → false
    expect(sameTodoGroup(withTime1, withoutTime1)).toBe(false);
    expect(sameTodoGroup(withoutTime1, withTime1)).toBe(false);
    // cùng ngày cùng giờ → true
    expect(sameTodoGroup(withTime1, sameTime)).toBe(true);
    // cả hai không giờ cùng ngày → true
    expect(sameTodoGroup(withoutTime1, withoutTime2)).toBe(true);
  });
});

describe('normalizeState (v1.10, D-035)', () => {
  it("dueTime: '07:30' giữ; '7:30' / 42 / có dueTime mà không có due → bỏ trường, việc vẫn còn", () => {
    const raw = {
      version: 1,
      device,
      events: [],
      design: defaultDesign(),
      todos: [
        { id: 'valid', text: 'Valid', done: false, order: 0, due: '2026-10-06', dueTime: '07:30' },
        { id: 'no-pad', text: 'NoPad', done: false, order: 1, due: '2026-10-06', dueTime: '7:30' },
        { id: 'not-string', text: 'NotString', done: false, order: 2, due: '2026-10-06', dueTime: 42 },
        { id: 'no-due', text: 'NoDue', done: false, order: 3, dueTime: '07:30' },
      ],
    };

    const snapshot = JSON.parse(JSON.stringify(raw));
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.todos.length).toBe(4);

    expect(result!.todos[0].id).toBe('valid');
    expect(result!.todos[0].dueTime).toBe('07:30');

    expect(result!.todos[1].id).toBe('no-pad');
    expect(result!.todos[1].text).toBe('NoPad');
    expect(result!.todos[1].dueTime).toBeUndefined();

    expect(result!.todos[2].id).toBe('not-string');
    expect(result!.todos[2].text).toBe('NotString');
    expect(result!.todos[2].dueTime).toBeUndefined();

    expect(result!.todos[3].id).toBe('no-due');
    expect(result!.todos[3].text).toBe('NoDue');
    expect(result!.todos[3].dueTime).toBeUndefined();

    // không mutate raw
    expect(raw).toEqual(snapshot);
  });
});

describe('exportBackup / importBackup (v1.10, D-035)', () => {
  it('giữ dueTime; JSON cũ không có dueTime nhập bình thường; version vẫn 1', () => {
    const state = defaultState(device);
    state.todos = [
      { id: 't1', text: 'Có giờ', done: false, order: 0, due: '2026-10-06', dueTime: '09:15' },
      { id: 't2', text: 'Không giờ', done: false, order: 1, due: '2026-10-06' },
    ];

    const json = exportBackup(state);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);

    const imported = importBackup(json);
    expect(imported).toEqual(state);
    expect(imported.todos[0].dueTime).toBe('09:15');
    expect(imported.todos[1].dueTime).toBeUndefined();

    // JSON cũ không có dueTime nhập bình thường
    const legacyState = {
      version: 1,
      device,
      events: [],
      todos: [{ id: 'legacy', text: 'Cũ', done: false, order: 0, due: '2026-10-06' }],
      notes: [],
      design: defaultDesign(),
      google: { clientId: '', calendarIds: [], cache: null },
      shortcutName: 'DatHinhNen',
      alarmShortcutName: 'ThemBaoThuc',
      reminderShortcutName: 'ThemLoiNhac',
      dayAlarmShortcutName: 'ThemBaoThucNgay',
    };
    const legacyJson = JSON.stringify({ version: 1, state: legacyState });
    const importedLegacy = importBackup(legacyJson);
    expect(importedLegacy.todos[0].due).toBe('2026-10-06');
    expect(importedLegacy.todos[0].dueTime).toBeUndefined();
  });
});

describe('reducer (v1.10, D-035)', () => {
  it('addTodo có dueTime không kèm due → không lưu giờ; setTodoDue đặt cả hai / xóa giờ / xóa cả hai; state cũ không đổi', () => {
    const state = defaultState(device);

    // addTodo có dueTime không kèm due → không lưu giờ
    const s1 = reducer(state, { type: 'addTodo', text: 'No due', dueTime: '10:00' });
    expect(s1.todos[0].due).toBeUndefined();
    expect(s1.todos[0].dueTime).toBeUndefined();

    // addTodo có cả due và dueTime
    const s2 = reducer(state, { type: 'addTodo', text: 'With due', due: '2026-10-05', dueTime: '08:00' });
    expect(s2.todos[0].due).toBe('2026-10-05');
    expect(s2.todos[0].dueTime).toBe('08:00');

    const id = s2.todos[0].id;

    // setTodoDue { due: '2026-10-06', dueTime: '09:00' } đặt cả hai
    const s3 = reducer(s2, { type: 'setTodoDue', id, due: '2026-10-06', dueTime: '09:00' });
    expect(s3.todos[0].due).toBe('2026-10-06');
    expect(s3.todos[0].dueTime).toBe('09:00');

    // { due: '2026-10-06' } → xóa giờ giữ ngày
    const s4 = reducer(s3, { type: 'setTodoDue', id, due: '2026-10-06' });
    expect(s4.todos[0].due).toBe('2026-10-06');
    expect(s4.todos[0].dueTime).toBeUndefined();

    // { due: null } → xóa cả hai
    const s5 = reducer(s3, { type: 'setTodoDue', id, due: null });
    expect(s5.todos[0].due).toBeUndefined();
    expect(s5.todos[0].dueTime).toBeUndefined();

    // state cũ không đổi
    expect(s2.todos[0].due).toBe('2026-10-05');
    expect(s2.todos[0].dueTime).toBe('08:00');
    expect(s3.todos[0].due).toBe('2026-10-06');
    expect(s3.todos[0].dueTime).toBe('09:00');
  });
});

describe('defaultReminderAt (v1.10, D-035)', () => {
  it('todo: có due và dueTime → dueTdueTime; không dueTime → dueT08:00', () => {
    const now = new Date(2026, 9, 1, 8, 0);

    const atWithTime = defaultReminderAt(
      { kind: 'todo', due: '2026-10-06', dueTime: '07:30' },
      now,
    );
    expect(atWithTime).toBe('2026-10-06T07:30');

    const atWithoutTime = defaultReminderAt(
      { kind: 'todo', due: '2026-10-06' },
      now,
    );
    expect(atWithoutTime).toBe('2026-10-06T08:00');
  });
});

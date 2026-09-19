import { describe, it, expect, vi, afterEach } from 'vitest';
import { reducer, createStore } from '../../src/ui/store';
import { shouldAutoSync, performSync, syncRange, handleAuthRedirect, autoSyncIfNeeded } from '../../src/ui/sync';
import { defaultState, defaultDesign } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';
import * as db from '../../src/storage/db';

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

  it('B-003: updateEvent với event mới không có createdAt -> giữ createdAt cũ', () => {
    const state = defaultState(device);
    const ev = { id: 'e1', title: 'Họp', date: '2026-02-15', repeat: 'none' as const, createdAt: 1000 };
    const s1 = reducer(state, { type: 'addEvent', event: ev });
    const evNoCreatedAt = { id: 'e1', title: 'Họp sửa', date: '2026-02-15', repeat: 'none' as const };
    const s2 = reducer(s1, { type: 'updateEvent', event: evNoCreatedAt });
    expect(s2.events[0].createdAt).toBe(1000);
    expect(s2.events[0].title).toBe('Họp sửa');
  });

  it('B-003: updateEvent, event cũ không có createdAt -> không thêm', () => {
    const state = defaultState(device);
    const ev = { id: 'e1', title: 'Họp', date: '2026-02-15', repeat: 'none' as const };
    const s1 = reducer(state, { type: 'addEvent', event: ev });
    const evNoCreatedAt = { id: 'e1', title: 'Họp sửa', date: '2026-02-15', repeat: 'none' as const };
    const s2 = reducer(s1, { type: 'updateEvent', event: evNoCreatedAt });
    expect(s2.events[0]).not.toHaveProperty('createdAt');
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

  it('T-6.1: archiveTodo đặt/bỏ archived; restoreTodo chèn lại sau xóa; restore id đã có -> không đổi', () => {
    const state = defaultState(device);
    const s1 = reducer(state, { type: 'addTodo', text: 'A' });
    const todo = s1.todos[0];

    const s2 = reducer(s1, { type: 'archiveTodo', id: todo.id, archived: true });
    expect(s2.todos[0].archived).toBe(true);
    expect(s1.todos[0]).not.toHaveProperty('archived'); // không mutate state cũ

    const s3 = reducer(s2, { type: 'archiveTodo', id: todo.id, archived: false });
    expect(s3.todos[0]).not.toHaveProperty('archived'); // bỏ archive -> xóa trường, không để false

    const s4 = reducer(s1, { type: 'deleteTodo', id: todo.id });
    expect(s4.todos).toEqual([]);
    const s5 = reducer(s4, { type: 'restoreTodo', todo });
    expect(s5).toEqual(s1); // khôi phục giống hệt trước khi xóa

    const s6 = reducer(s5, { type: 'restoreTodo', todo });
    expect(s6).toBe(s5); // id đã tồn tại -> không đổi state (cùng tham chiếu)
  });

  it('T-6.1: reorderTodo đưa việc vào vị trí target trong danh sách hiển thị, chỉ cùng nhóm, không mutate', () => {
    const state = defaultState(device);
    const loaded = {
      ...defaultState(device),
      todos: [
        { id: 'a', text: 'A', done: false, order: 0 },
        { id: 'b', text: 'B', done: false, order: 1 },
        { id: 'c', text: 'C', done: false, order: 2 },
        { id: 'd', text: 'D', done: false, order: 3, due: '2099-01-01' }, // nhóm khác (có hạn)
      ],
    };
    const s0 = reducer(state, { type: 'load', state: loaded });

    // kéo C lên trước A -> C,A,B
    const s1 = reducer(s0, { type: 'reorderTodo', id: 'c', targetId: 'a' });
    const order1 = [...s1.todos].filter((t) => !t.due).sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(order1).toEqual(['c', 'a', 'b']);
    expect(loaded.todos.map((t) => t.order)).toEqual([0, 1, 2, 3]); // không mutate state cũ

    // kéo A xuống sau C (từ A,B,C gốc) -> B,C,A
    const s2 = reducer(s0, { type: 'reorderTodo', id: 'a', targetId: 'c' });
    const order2 = [...s2.todos].filter((t) => !t.due).sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(order2).toEqual(['b', 'c', 'a']);

    // khác nhóm (d có hạn) -> không đổi
    const s3 = reducer(s0, { type: 'reorderTodo', id: 'a', targetId: 'd' });
    expect(s3).toEqual(s0);
  });

  it('T-6.1: moveTodo nhảy qua việc đã lưu trữ khi tìm hàng xóm', () => {
    const state = defaultState(device);
    const loaded = {
      ...defaultState(device),
      todos: [
        { id: 'a', text: 'A', done: false, order: 0 },
        { id: 'b', text: 'B', done: false, order: 1, archived: true },
        { id: 'c', text: 'C', done: false, order: 2 },
      ],
    };
    const s0 = reducer(state, { type: 'load', state: loaded });
    // Hiển thị (không archived): A, C. moveTodo(a, dir:1) -> hoán A<->C, bỏ qua B.
    const s1 = reducer(s0, { type: 'moveTodo', id: 'a', dir: 1 });
    expect(s1.todos.find((t) => t.id === 'a')!.order).toBe(2);
    expect(s1.todos.find((t) => t.id === 'c')!.order).toBe(0);
    expect(s1.todos.find((t) => t.id === 'b')!.order).toBe(1); // việc lưu trữ không đổi
  });

  it('T-6.3 (#5, soát chéo M6): reorderTodo/moveTodo vẫn đổi được thứ tự khi order cũ trùng nhau', () => {
    const state = defaultState(device);
    const loaded = {
      ...defaultState(device),
      todos: [
        { id: 'a', text: 'A', done: false, order: 0 },
        { id: 'b', text: 'B', done: false, order: 0 },
        { id: 'c', text: 'C', done: false, order: 0 },
      ],
    };
    const s0 = reducer(state, { type: 'load', state: loaded });

    // reorderTodo(c, a): kéo C lên trước A -> C,A,B (dù 3 việc cùng order: 0 ban đầu).
    const s1 = reducer(s0, { type: 'reorderTodo', id: 'c', targetId: 'a' });
    const order1 = [...s1.todos].sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(order1).toEqual(['c', 'a', 'b']);
    // order mới phải khác nhau từng đôi một (không còn trùng như dữ liệu cũ).
    const values1 = s1.todos.map((t) => t.order);
    expect(new Set(values1).size).toBe(3);

    // moveTodo(b, -1) trên state gốc (A,B,C cùng order: 0) -> B đổi chỗ lên trước A.
    const s2 = reducer(s0, { type: 'moveTodo', id: 'b', dir: -1 });
    const order2 = [...s2.todos].sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(order2[0]).toBe('b'); // B lên trước A (không còn "không đổi" như lỗi cũ)
    expect(s2.todos.find((t) => t.id === 'b')!.order).not.toBe(s2.todos.find((t) => t.id === 'a')!.order);
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

  it('pinNote(true) tự bật design.showNote; pinNote(false) giữ nguyên; đã bật thì không đổi gì khác', () => {
    const state = defaultState(device);
    expect(state.design.showNote).toBe(false);
    const a = { id: 'a', title: '', body: 'A', pinned: false, updated: 1 };
    const s0 = { ...state, notes: [a] };

    const s1 = reducer(s0, { type: 'pinNote', id: 'a', pinned: true });
    expect(s1.design.showNote).toBe(true);
    expect(s1.notes.find((n) => n.id === 'a')!.pinned).toBe(true);

    const s2 = reducer(s1, { type: 'pinNote', id: 'a', pinned: false });
    expect(s2.design.showNote).toBe(true); // không tự tắt

    const s3 = { ...s2, design: { ...s2.design, showNote: true } };
    const s4 = reducer(s3, { type: 'pinNote', id: 'a', pinned: true });
    expect(s4.design).toBe(s3.design); // đã bật sẵn thì không đổi
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

  it('T-3.3: setGoogleClientId/setGoogleCalendarIds/setGoogleCache cập nhật đúng trường, không mutate state cũ', () => {
    const state = defaultState(device);

    const s1 = reducer(state, { type: 'setGoogleClientId', clientId: 'abc.apps.googleusercontent.com' });
    expect(s1.google.clientId).toBe('abc.apps.googleusercontent.com');
    expect(state.google.clientId).toBe('');

    const s2 = reducer(s1, { type: 'setGoogleCalendarIds', calendarIds: ['cal1', 'cal2'] });
    expect(s2.google.calendarIds).toEqual(['cal1', 'cal2']);
    expect(s1.google.calendarIds).toEqual([]);

    const cache = { events: [], fetchedAt: 12345 };
    const s3 = reducer(s2, { type: 'setGoogleCache', cache });
    expect(s3.google.cache).toEqual(cache);
    expect(s2.google.cache).toBeNull();
    expect(s3.google.clientId).toBe('abc.apps.googleusercontent.com'); // giữ nguyên phần khác
  });

  it('v1.8 (IN-11): setAlarmShortcutName/setReminderShortcutName đặt tên, không mutate state cũ', () => {
    const state = defaultState(device);
    const s1 = reducer(state, { type: 'setAlarmShortcutName', name: 'Bao Thuc' });
    expect(s1.alarmShortcutName).toBe('Bao Thuc');
    expect(state.alarmShortcutName).toBe('ThemBaoThuc');

    const s2 = reducer(s1, { type: 'setReminderShortcutName', name: 'Loi Nhac' });
    expect(s2.reminderShortcutName).toBe('Loi Nhac');
    expect(s1.reminderShortcutName).toBe('ThemLoiNhac');
  });

  it('T-3.3: disconnectGoogle xóa calendarIds + cache, giữ clientId', () => {
    const state = defaultState(device);
    const connected = {
      ...state,
      google: { clientId: 'abc.apps.googleusercontent.com', calendarIds: ['cal1'], cache: { events: [], fetchedAt: 1 } },
    };
    const next = reducer(connected, { type: 'disconnectGoogle' });
    expect(next.google.calendarIds).toEqual([]);
    expect(next.google.cache).toBeNull();
    expect(next.google.clientId).toBe('abc.apps.googleusercontent.com');
    expect(connected.google.calendarIds).toEqual(['cal1']); // không mutate
  });
});

describe('createStore.flush (T-7.5: ghi ngay xuống đĩa trước khi rời app sang Phím tắt)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('dispatch rồi flush() làm saveState chạy ngay, TRƯỚC khi hết 300ms debounce', async () => {
    vi.useFakeTimers();
    const saveStateSpy = vi.spyOn(db, 'saveState').mockResolvedValue(undefined);
    const store = createStore(defaultState(device));

    store.dispatch({ type: 'addTodo', text: 'Mua sữa' });
    expect(saveStateSpy).not.toHaveBeenCalled(); // chưa hết 300ms, chưa tự ghi

    await store.flush();

    expect(saveStateSpy).toHaveBeenCalledTimes(1); // flush() ghi ngay, không chờ debounce
    expect(saveStateSpy.mock.calls[0][0].todos[0].text).toBe('Mua sữa');

    // Debounce cũ đã bị hủy: chờ hết 300ms không ghi thêm lần nữa.
    vi.advanceTimersByTime(300);
    expect(saveStateSpy).toHaveBeenCalledTimes(1);
  });

  it('flush() khi không có gì đang chờ (không dispatch trước đó) vẫn an toàn: ghi lại state hiện tại', async () => {
    const saveStateSpy = vi.spyOn(db, 'saveState').mockResolvedValue(undefined);
    const store = createStore(defaultState(device));

    await expect(store.flush()).resolves.toBeUndefined();
    expect(saveStateSpy).toHaveBeenCalledTimes(1);
  });
});

describe('sync.ts (T-3.3, điều phối thuần)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shouldAutoSync: không token -> false; không cache -> true; cache mới (<30p) -> false; cache cũ (>30p) -> true', () => {
    const now = 1_000_000;
    expect(shouldAutoSync(false, null, now)).toBe(false);
    expect(shouldAutoSync(true, null, now)).toBe(true);
    expect(shouldAutoSync(true, { fetchedAt: now - 10 * 60_000 }, now)).toBe(false);
    expect(shouldAutoSync(true, { fetchedAt: now - 31 * 60_000 }, now)).toBe(true);
  });

  it('syncRange: [today-7, today+60] (v1.5)', () => {
    expect(syncRange('2026-03-10')).toEqual({ timeMin: '2026-03-03', timeMax: '2026-05-09' });
  });

  it('performSync: fetch ok -> {ok:true, events, fetchedAt}', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('calendarList')) {
          return new Response(JSON.stringify({ items: [{ id: 'c1', summary: 'C1', backgroundColor: '#fff' }] }));
        }
        return new Response(
          JSON.stringify({ items: [{ id: 'e1', summary: 'Ev', start: { date: '2026-03-10' } }] }),
        );
      }),
    );
    const result = await performSync('tok', ['c1'], '2026-03-10', 5000);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.fetchedAt).toBe(5000);
      expect(result.events).toEqual([
        { id: 'google-c1-e1@2026-03-10', sourceId: 'e1', source: 'google', title: 'Ev', date: '2026-03-10', allDay: true, color: '#fff' },
      ]);
    }
  });

  it('performSync: fetch 401 -> {ok:false, reauth:true}', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
    const result = await performSync('tok', ['c1'], '2026-03-10');
    expect(result).toEqual({ ok: false, reauth: true });
  });

  it('performSync: lỗi mạng -> {ok:false, reauth:false, error}', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    const result = await performSync('tok', ['c1'], '2026-03-10');
    expect(result).toEqual({ ok: false, reauth: false, error: 'network down' });
  });
});

describe('handleAuthRedirect (T-3.3, chạy 1 lần ở App.tsx, không phụ thuộc tab)', () => {
  it('hash rỗng/không liên quan -> handled:false, không gọi consumeState/saveToken', () => {
    const consumeState = vi.fn(() => 'abc');
    const saveToken = vi.fn();
    expect(handleAuthRedirect('', { consumeState, saveToken })).toEqual({ handled: false });
    expect(handleAuthRedirect('#foo=bar', { consumeState, saveToken })).toEqual({ handled: false });
    expect(consumeState).not.toHaveBeenCalled();
    expect(saveToken).not.toHaveBeenCalled();
  });

  it('state đúng -> lưu token, trả ok:true', () => {
    const saveToken = vi.fn();
    const result = handleAuthRedirect('#access_token=tok123&expires_in=3600&state=abc', {
      consumeState: () => 'abc',
      saveToken,
    });
    expect(result).toEqual({ handled: true, ok: true });
    expect(saveToken).toHaveBeenCalledWith('tok123', 3600);
  });

  it('state sai -> không lưu token, trả ok:false (bỏ qua)', () => {
    const saveToken = vi.fn();
    const result = handleAuthRedirect('#access_token=tok123&expires_in=3600&state=abc', {
      consumeState: () => 'khac',
      saveToken,
    });
    expect(result).toEqual({ handled: true, ok: false, error: 'invalid_state' });
    expect(saveToken).not.toHaveBeenCalled();
  });

  it('#error= -> trả ok:false kèm error, không lưu token', () => {
    const saveToken = vi.fn();
    const result = handleAuthRedirect('#error=access_denied&state=abc', {
      consumeState: () => 'abc',
      saveToken,
    });
    expect(result).toEqual({ handled: true, ok: false, error: 'access_denied' });
    expect(saveToken).not.toHaveBeenCalled();
  });
});

describe('autoSyncIfNeeded (T-3.3)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('không có token -> không gọi fetch, ran:false', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const outcome = await autoSyncIfNeeded(null, ['c1'], '2026-03-10', 1000, {
      getToken: () => null,
      clearToken: vi.fn(),
    });
    expect(outcome).toEqual({ ran: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('cache mới (<30 phút) -> không gọi fetch, ran:false', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const now = 1_000_000;
    const outcome = await autoSyncIfNeeded({ fetchedAt: now - 60_000 }, ['c1'], '2026-03-10', now, {
      getToken: () => 'tok',
      clearToken: vi.fn(),
    });
    expect(outcome).toEqual({ ran: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('cache cũ (>30 phút) -> gọi fetch, ran:true, ok:true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.includes('calendarList')
          ? new Response(JSON.stringify({ items: [] }))
          : new Response(JSON.stringify({ items: [] })),
      ),
    );
    const now = 1_000_000;
    const outcome = await autoSyncIfNeeded({ fetchedAt: now - 31 * 60_000 }, ['c1'], '2026-03-10', now, {
      getToken: () => 'tok',
      clearToken: vi.fn(),
    });
    expect(outcome.ran).toBe(true);
    if (outcome.ran) expect(outcome.result).toEqual({ ok: true, events: [], fetchedAt: now });
  });

  it('401 -> clearToken() được gọi, ran:true, ok:false, reauth:true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
    const clearToken = vi.fn();
    const outcome = await autoSyncIfNeeded(null, ['c1'], '2026-03-10', 1000, { getToken: () => 'tok', clearToken });
    expect(outcome).toEqual({ ran: true, result: { ok: false, reauth: true } });
    expect(clearToken).toHaveBeenCalledOnce();
  });

  it('lỗi mạng -> giữ cache, không gọi clearToken', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    const clearToken = vi.fn();
    const outcome = await autoSyncIfNeeded(null, ['c1'], '2026-03-10', 1000, { getToken: () => 'tok', clearToken });
    expect(outcome).toEqual({ ran: true, result: { ok: false, reauth: false, error: 'offline' } });
    expect(clearToken).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { reducer } from '../../src/ui/store';
import { shouldAutoSync, performSync, syncRange, handleAuthRedirect, autoSyncIfNeeded } from '../../src/ui/sync';
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

  it('syncRange: [today-1, today+60]', () => {
    expect(syncRange('2026-03-10')).toEqual({ timeMin: '2026-03-09', timeMax: '2026-05-09' });
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

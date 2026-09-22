import { describe, it, expect, vi, afterEach } from 'vitest';
import { sameTodoGroup, reducer, createStore } from '../../src/ui/store';
import { defaultState } from '../../src/core/model';
import { cmpTodo } from '../../src/core/collect';
import type { DeviceSpec, Todo } from '../../src/core/model';
import * as db from '../../src/storage/db';

const device: DeviceSpec = {
  id: 'iphone-1179x2556',
  label: 'iPhone 1179x2556',
  width: 1179,
  height: 2556,
  safeTop: 0.06,
  safeBottom: 0.1,
};

describe('tests/unit/store-create.test.ts (B-015)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe('sameTodoGroup', () => {
    it('{due:""} và {due: undefined} cùng nhóm; {due:""} và {due:"2026-10-05"} khác nhóm', () => {
      const todoEmptyDue: Todo = { id: '1', text: 'Empty due', done: false, order: 0, due: '' };
      const todoUndefinedDue: Todo = { id: '2', text: 'Undefined due', done: false, order: 1, due: undefined };
      const todoWithDue: Todo = { id: '3', text: 'With due', done: false, order: 2, due: '2026-10-05' };

      // {due: ''} và {due: undefined} cùng nhóm
      expect(sameTodoGroup(todoEmptyDue, todoUndefinedDue)).toBe(true);
      expect(sameTodoGroup(todoUndefinedDue, todoEmptyDue)).toBe(true);

      // {due: ''} và {due: '2026-10-05'} khác nhóm
      expect(sameTodoGroup(todoEmptyDue, todoWithDue)).toBe(false);
      expect(sameTodoGroup(todoWithDue, todoEmptyDue)).toBe(false);
    });
  });

  describe('restoreTodo', () => {
    it('add A → delete A → add B → restoreTodo A: hai việc có order khác nhau; thứ tự hiển thị (cmpTodo) là A rồi B', () => {
      let state = defaultState(device);

      // add A
      state = reducer(state, { type: 'addTodo', text: 'A', id: 'todo-a' });
      const todoA = state.todos.find((t) => t.id === 'todo-a')!;
      expect(todoA.order).toBe(0);

      // delete A
      state = reducer(state, { type: 'deleteTodo', id: 'todo-a' });
      expect(state.todos).toHaveLength(0);

      // add B -> vì state rỗng nên B có order = 0 (trùng order cũ của A)
      state = reducer(state, { type: 'addTodo', text: 'B', id: 'todo-b' });
      const todoB = state.todos.find((t) => t.id === 'todo-b')!;
      expect(todoB.order).toBe(0);

      // restoreTodo A
      state = reducer(state, { type: 'restoreTodo', todo: todoA });
      const todoAAfter = state.todos.find((t) => t.id === 'todo-a')!;
      const todoBAfter = state.todos.find((t) => t.id === 'todo-b')!;

      // hai việc có order khác nhau
      expect(todoAAfter.order).not.toBe(todoBAfter.order);
      expect(todoAAfter.order).toBe(0);
      expect(todoBAfter.order).toBe(1);

      // thứ tự hiển thị (cmpTodo) là A rồi B
      const displayOrder = [...state.todos].sort(cmpTodo);
      expect(displayOrder.map((t) => t.id)).toEqual(['todo-a', 'todo-b']);
    });

    it('restore khi không trùng order: todo giữ nguyên order, các việc khác không đổi', () => {
      let state = defaultState(device);
      state = reducer(state, { type: 'addTodo', text: 'X', id: 'x' });
      state = reducer(state, { type: 'addTodo', text: 'Y', id: 'y' });

      const todoX = state.todos.find((t) => t.id === 'x')!;
      const todoY = state.todos.find((t) => t.id === 'y')!;

      const restoredTodo: Todo = { id: 'z', text: 'Z', done: false, order: 99 };
      state = reducer(state, { type: 'restoreTodo', todo: restoredTodo });

      const todoZAfter = state.todos.find((t) => t.id === 'z')!;
      const todoXAfter = state.todos.find((t) => t.id === 'x')!;
      const todoYAfter = state.todos.find((t) => t.id === 'y')!;

      expect(todoZAfter.order).toBe(99);
      expect(todoXAfter.order).toBe(todoX.order);
      expect(todoYAfter.order).toBe(todoY.order);
    });

    it('restore khi trùng order với việc đã lưu trữ: việc đã lưu trữ cũng được tăng order', () => {
      let state = defaultState(device);
      state = reducer(state, { type: 'addTodo', text: 'Archived', id: 'arc' });
      state = reducer(state, { type: 'archiveTodo', id: 'arc', archived: true });

      const restored: Todo = { id: 'new-item', text: 'New Item', done: false, order: 0 };
      state = reducer(state, { type: 'restoreTodo', todo: restored });

      expect(state.todos.find((t) => t.id === 'arc')?.order).toBe(1);
      expect(state.todos.find((t) => t.id === 'new-item')?.order).toBe(0);
    });
  });

  describe('createStore', () => {
    it('subscribe nhận state sau dispatch; hàm hủy trả về từ subscribe làm listener ngừng nhận', () => {
      const store = createStore(defaultState(device));
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.dispatch({ type: 'addTodo', text: 'Việc 1' });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(store.getState());
      expect(store.getState().todos[0].text).toBe('Việc 1');

      unsubscribe();
      store.dispatch({ type: 'addTodo', text: 'Việc 2' });
      expect(listener).toHaveBeenCalledTimes(1); // không gọi thêm sau khi unsubscribe
      expect(store.getState().todos).toHaveLength(2);
    });

    it('destroy(): sau đó dispatch không gọi subscriber; phát visibilitychange (hidden) / pagehide không gọi saveState; timer đang chờ bị hủy', () => {
      vi.useFakeTimers();

      type Handler = () => void;
      const windowListeners: Record<string, Handler> = {};
      const documentListeners: Record<string, Handler> = {};

      vi.stubGlobal('window', {
        addEventListener: (event: string, handler: Handler) => {
          windowListeners[event] = handler;
        },
        removeEventListener: (event: string, handler: Handler) => {
          if (windowListeners[event] === handler) {
            delete windowListeners[event];
          }
        },
      });

      vi.stubGlobal('document', {
        visibilityState: 'hidden',
        addEventListener: (event: string, handler: Handler) => {
          documentListeners[event] = handler;
        },
        removeEventListener: (event: string, handler: Handler) => {
          if (documentListeners[event] === handler) {
            delete documentListeners[event];
          }
        },
      });

      const saveStateSpy = vi.spyOn(db, 'saveState').mockResolvedValue(undefined);
      const store = createStore(defaultState(device));

      // Kiểm tra listener đã được đăng ký
      expect(windowListeners['pagehide']).toBeDefined();
      expect(documentListeners['visibilitychange']).toBeDefined();

      const subscriber = vi.fn();
      store.subscribe(subscriber);

      // Dispatch 1 action -> timer debounce đang chờ (300ms)
      store.dispatch({ type: 'addTodo', text: 'Chờ persist' });
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(saveStateSpy).not.toHaveBeenCalled();

      // Gọi destroy()
      store.destroy();

      // 1. Sau đó dispatch không gọi subscriber
      store.dispatch({ type: 'addTodo', text: 'Sau destroy' });
      expect(subscriber).toHaveBeenCalledTimes(1); // vẫn chỉ 1 lần từ trước destroy

      // 2. Timer đang chờ bị hủy: qua 300ms vẫn không gọi saveState
      vi.advanceTimersByTime(500);
      expect(saveStateSpy).not.toHaveBeenCalled();

      // 3. Listener pagehide và visibilitychange đã bị gỡ
      expect(windowListeners['pagehide']).toBeUndefined();
      expect(documentListeners['visibilitychange']).toBeUndefined();

      // Giả sử có handler cũ bị kích hoạt (hoặc phát event) -> saveState cũng không bị gọi
      if (windowListeners['pagehide']) windowListeners['pagehide']();
      if (documentListeners['visibilitychange']) documentListeners['visibilitychange']();
      expect(saveStateSpy).not.toHaveBeenCalled();
    });
  });
});

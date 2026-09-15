import type { AppState, DesignConfig, DeviceSpec, ISODate, LocalEvent, Note, Occurrence, Todo } from '../core/model';
import { defaultState, normalizeState } from '../core/model';
import { cmpTodo } from '../core/collect';
import { saveState } from '../storage/db';

/** Cùng nhóm hiển thị theo `cmpTodo`: cùng `done`; nếu chưa xong thì cùng có/không `due`,
 * và nếu có `due` thì cùng ngày. Dùng để `moveTodo` chỉ hoán đổi trong nhóm (T-2.14). */
export function sameTodoGroup(a: Todo, b: Todo): boolean {
  if (!!a.archived !== !!b.archived) return false;
  if (a.archived) return false;
  if (a.done !== b.done) return false;
  if (a.done) return true;
  const aHas = a.due != null;
  const bHas = b.due != null;
  if (aHas !== bHas) return false;
  if (aHas && a.due !== b.due) return false;
  return true;
}

export type Action =
  | { type: 'setDevice'; device: DeviceSpec }
  | { type: 'setDesign'; partial: Partial<DesignConfig> }
  | { type: 'load'; state: AppState }
  | { type: 'addEvent'; event: LocalEvent }
  | { type: 'updateEvent'; event: LocalEvent }
  | { type: 'deleteEvent'; id: string }
  | { type: 'addTodo'; text: string; id?: string; due?: ISODate }
  | { type: 'toggleTodo'; id: string }
  | { type: 'updateTodo'; id: string; text: string }
  | { type: 'deleteTodo'; id: string }
  | { type: 'moveTodo'; id: string; dir: -1 | 1 }
  | { type: 'setTodoDue'; id: string; due: ISODate | null }
  | { type: 'archiveTodo'; id: string; archived: boolean }
  | { type: 'restoreTodo'; todo: Todo }
  | { type: 'reorderTodo'; id: string; targetId: string }
  | { type: 'addNote'; note: Note }
  | { type: 'updateNote'; note: Note }
  | { type: 'deleteNote'; id: string }
  | { type: 'pinNote'; id: string; pinned: boolean }
  | { type: 'replaceState'; state: unknown }
  | { type: 'resetAll' }
  | { type: 'setGoogleClientId'; clientId: string }
  | { type: 'setGoogleCalendarIds'; calendarIds: string[] }
  | { type: 'setGoogleCache'; cache: { events: Occurrence[]; fetchedAt: number } | null }
  | { type: 'disconnectGoogle' }
  | { type: 'setShortcutName'; shortcutName: string };

function nextId(explicit?: string): string {
  if (explicit) return explicit;
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;
}

/** Reducer thuần: không mutate state cũ. */
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setDevice':
      return { ...state, device: action.device };
    case 'setDesign':
      return { ...state, design: { ...state.design, ...action.partial } };
    case 'load':
      return action.state;
    case 'addEvent':
      return { ...state, events: [...state.events, action.event] };
    case 'updateEvent':
      // v1.6 (B-003): event mới không mang createdAt -> giữ createdAt của event cũ (nếu có).
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.event.id
            ? action.event.createdAt == null && e.createdAt != null
              ? { ...action.event, createdAt: e.createdAt }
              : action.event
            : e
        ),
      };
    case 'deleteEvent':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) };
    case 'addTodo': {
      const order = state.todos.length > 0 ? Math.max(...state.todos.map((t) => t.order)) + 1 : 0;
      const todo: Todo = { id: nextId(action.id), text: action.text, done: false, order, ...(action.due ? { due: action.due } : {}) };
      return { ...state, todos: [...state.todos, todo] };
    }
    case 'toggleTodo':
      return { ...state, todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) };
    case 'updateTodo':
      return { ...state, todos: state.todos.map((t) => (t.id === action.id ? { ...t, text: action.text } : t)) };
    case 'deleteTodo':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case 'moveTodo': {
      // Hoán đổi theo đúng thứ tự hiển thị (cmpTodo, khớp `sortTodosForDisplay` trong app),
      // chỉ khi việc kề bên cùng nhóm (cùng done, cùng có/không due, cùng ngày due) (T-2.14).
      // T-6.1 (D-028): việc đã lưu trữ bị bỏ khỏi danh sách hiển thị -> nhảy qua khi tìm hàng xóm.
      const sorted = [...state.todos].filter((t) => !t.archived).sort(cmpTodo);
      const idx = sorted.findIndex((t) => t.id === action.id);
      if (idx < 0) return state;
      const swapIdx = idx + action.dir;
      if (swapIdx < 0 || swapIdx >= sorted.length) return state;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      if (!sameTodoGroup(a, b)) return state;
      const orders = new Map<string, number>([
        [a.id, b.order],
        [b.id, a.order],
      ]);
      return { ...state, todos: state.todos.map((t) => (orders.has(t.id) ? { ...t, order: orders.get(t.id)! } : t)) };
    }
    case 'archiveTodo': {
      return {
        ...state,
        todos: state.todos.map((t) => {
          if (t.id !== action.id) return t;
          if (!action.archived) {
            const { archived: _archived, ...rest } = t;
            return rest as Todo;
          }
          return { ...t, archived: true };
        }),
      };
    }
    case 'restoreTodo': {
      if (state.todos.some((t) => t.id === action.todo.id)) return state;
      return { ...state, todos: [...state.todos, action.todo] };
    }
    case 'reorderTodo': {
      // T-6.1 (D-028): kéo id vào vị trí targetId trong danh sách hiển thị (không lưu trữ),
      // chỉ khi cùng nhóm hiển thị (cmpTodo); tính lại order trong nhóm, không đụng nhóm khác.
      const displaySorted = [...state.todos].filter((t) => !t.archived).sort(cmpTodo);
      const idx = displaySorted.findIndex((t) => t.id === action.id);
      const targetIdx = displaySorted.findIndex((t) => t.id === action.targetId);
      if (idx < 0 || targetIdx < 0 || idx === targetIdx) return state;
      const a = displaySorted[idx];
      const b = displaySorted[targetIdx];
      if (!sameTodoGroup(a, b)) return state;
      const group = displaySorted.filter((t) => sameTodoGroup(t, b));
      const withoutA = group.filter((t) => t.id !== a.id);
      const targetIdxInGroup = withoutA.findIndex((t) => t.id === b.id);
      const insertAt = idx < targetIdx ? targetIdxInGroup + 1 : targetIdxInGroup;
      const newGroupOrder = [...withoutA.slice(0, insertAt), a, ...withoutA.slice(insertAt)];
      const orders = new Map<string, number>(newGroupOrder.map((t, i) => [t.id, group[i].order]));
      return { ...state, todos: state.todos.map((t) => (orders.has(t.id) ? { ...t, order: orders.get(t.id)! } : t)) };
    }
    case 'setTodoDue': {
      return {
        ...state,
        todos: state.todos.map((t) => {
          if (t.id !== action.id) return t;
          if (action.due === null) {
            const { due: _due, ...rest } = t;
            return rest as Todo;
          }
          return { ...t, due: action.due };
        }),
      };
    }
    case 'addNote':
      return { ...state, notes: [...state.notes, action.note] };
    case 'updateNote':
      return { ...state, notes: state.notes.map((n) => (n.id === action.note.id ? action.note : n)) };
    case 'deleteNote':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
    case 'pinNote': {
      const notes = state.notes.map((n) => {
        if (n.id === action.id) return { ...n, pinned: action.pinned, updated: Date.now() };
        if (action.pinned && n.pinned) return { ...n, pinned: false };
        return n;
      });
      const design = action.pinned && !state.design.showNote
        ? { ...state.design, showNote: true }
        : state.design;
      return { ...state, notes, design };
    }
    case 'replaceState': {
      const normalized = normalizeState(action.state);
      return normalized ?? state;
    }
    case 'resetAll':
      return defaultState(state.device);
    case 'setGoogleClientId':
      return { ...state, google: { ...state.google, clientId: action.clientId } };
    case 'setGoogleCalendarIds':
      return { ...state, google: { ...state.google, calendarIds: action.calendarIds } };
    case 'setGoogleCache':
      return { ...state, google: { ...state.google, cache: action.cache } };
    case 'disconnectGoogle':
      return { ...state, google: { ...state.google, calendarIds: [], cache: null } };
    case 'setShortcutName':
      return { ...state, shortcutName: action.shortcutName };
    default:
      return state;
  }
}

export interface Store {
  getState: () => AppState;
  dispatch: (action: Action) => void;
  subscribe: (listener: (state: AppState) => void) => () => void;
}

const PERSIST_DEBOUNCE_MS = 300;

/** Tạo store có persist debounce 300ms qua db.ts. */
export function createStore(initialState: AppState): Store {
  let state = initialState;
  const listeners = new Set<(state: AppState) => void>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  function schedulePersist(): void {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void saveState(state);
    }, PERSIST_DEBOUNCE_MS);
  }

  return {
    getState: () => state,
    dispatch(action: Action) {
      state = reducer(state, action);
      schedulePersist();
      for (const listener of listeners) listener(state);
    },
    subscribe(listener: (state: AppState) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

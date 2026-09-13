import type { AppState, DesignConfig, DeviceSpec, ISODate, LocalEvent, Note, Todo } from '../core/model';
import { defaultState, normalizeState } from '../core/model';
import { saveState } from '../storage/db';

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
  | { type: 'addNote'; note: Note }
  | { type: 'updateNote'; note: Note }
  | { type: 'deleteNote'; id: string }
  | { type: 'pinNote'; id: string; pinned: boolean }
  | { type: 'replaceState'; state: unknown }
  | { type: 'resetAll' };

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
      return { ...state, events: state.events.map((e) => (e.id === action.event.id ? action.event : e)) };
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
      const sorted = [...state.todos].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((t) => t.id === action.id);
      if (idx < 0) return state;
      const swapIdx = idx + action.dir;
      if (swapIdx < 0 || swapIdx >= sorted.length) return state;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      const orders = new Map<string, number>([
        [a.id, b.order],
        [b.id, a.order],
      ]);
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
      return { ...state, notes };
    }
    case 'replaceState': {
      const normalized = normalizeState(action.state);
      return normalized ?? state;
    }
    case 'resetAll':
      return defaultState(state.device);
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

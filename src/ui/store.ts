import type { AppState, DesignConfig, DeviceSpec } from '../core/model';
import { saveState } from '../storage/db';

export type Action =
  | { type: 'setDevice'; device: DeviceSpec }
  | { type: 'setDesign'; partial: Partial<DesignConfig> }
  | { type: 'load'; state: AppState };

/** Reducer thuần: không mutate state cũ. */
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setDevice':
      return { ...state, device: action.device };
    case 'setDesign':
      return { ...state, design: { ...state.design, ...action.partial } };
    case 'load':
      return action.state;
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

import { useLayoutEffect, useState } from 'preact/hooks';
import type { AppState } from '../core/model';
import type { Store } from './store';

export function useStoreState(store: Store): AppState;
export function useStoreState(store: Store | null): AppState | null;
export function useStoreState(store: Store | null): AppState | null {
  const [state, setState] = useState<AppState | null>(() => store?.getState() ?? null);

  // useLayoutEffect chạy đồng bộ ngay sau commit trước khi trình duyệt paint,
  // tránh lọt dispatch xảy ra giữa lúc khởi tạo state và lúc effect chạy.
  // Đọc lại store.getState() để đồng bộ trạng thái mới nhất trước khi đăng ký listener.
  useLayoutEffect(() => {
    if (!store) return;
    setState(store.getState());
    return store.subscribe(setState);
  }, [store]);

  return state;
}

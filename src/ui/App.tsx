import { useEffect, useState } from 'preact/hooks';
import type { AppState } from '../core/model';
import { defaultState } from '../core/model';
import { DEVICES, detectDevice } from '../render/devices';
import { loadState } from '../storage/db';
import { createStore, type Store } from './store';
import { Preview } from './screens/Preview';

const TABS = [
  { id: 'preview', label: 'Preview' },
  { id: 'events', label: 'Sự kiện' },
  { id: 'design', label: 'Thiết kế' },
  { id: 'sync', label: 'Đồng bộ' },
  { id: 'guide', label: 'Hướng dẫn' },
] as const;

type TabId = (typeof TABS)[number]['id'];

async function loadInitialState(): Promise<AppState> {
  const saved = await loadState();
  if (saved) return saved;
  const detected = detectDevice(window.screen.width, window.screen.height, window.devicePixelRatio || 1);
  const device = detected.id === 'auto' ? DEVICES.find((d) => d.id === 'iphone-1284x2778')! : detected;
  return defaultState(device);
}

export function App() {
  const [store, setStore] = useState<Store | null>(null);
  const [tab, setTab] = useState<TabId>('preview');

  useEffect(() => {
    let cancelled = false;
    void loadInitialState().then((initial) => {
      if (!cancelled) setStore(createStore(initial));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!store) {
    return <div class="app">Đang tải…</div>;
  }

  return (
    <div class="app">
      <main class="app-content">
        {tab === 'preview' && <Preview store={store} />}
        {tab === 'events' && <div class="placeholder">Sự kiện (sắp có)</div>}
        {tab === 'design' && <div class="placeholder">Thiết kế (sắp có)</div>}
        {tab === 'sync' && <div class="placeholder">Đồng bộ (sắp có)</div>}
        {tab === 'guide' && <div class="placeholder">Hướng dẫn (sắp có)</div>}
      </main>
      <nav class="tabbar">
        {TABS.map((t) => (
          <button key={t.id} class={tab === t.id ? 'tab tab-active' : 'tab'} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

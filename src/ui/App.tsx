import { useEffect, useState } from 'preact/hooks';
import type { AppState } from '../core/model';
import { defaultState } from '../core/model';
import { DEVICES, detectDevice } from '../render/devices';
import { loadState } from '../storage/db';
import { t } from '../core/i18n';
import { createStore, type Store } from './store';
import { Preview } from './screens/Preview';
import { Events } from './screens/Events';

const TABS = [
  { id: 'preview' },
  { id: 'events' },
  { id: 'design' },
  { id: 'sync' },
  { id: 'guide' },
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
  const [lang, setLang] = useState<AppState['design']['lang']>('vi');

  useEffect(() => {
    let cancelled = false;
    void loadInitialState().then((initial) => {
      if (!cancelled) setStore(createStore(initial));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!store) return;
    const update = () => setLang(store.getState().design.lang);
    update();
    return store.subscribe(update);
  }, [store]);

  if (!store) {
    return <div class="app">Đang tải…</div>;
  }

  return (
    <div class="app">
      <main class="app-content">
        {tab === 'preview' && <Preview store={store} />}
        {tab === 'events' && <Events store={store} />}
        {tab === 'design' && <div class="placeholder">{t('common.comingSoon', lang)}</div>}
        {tab === 'sync' && <div class="placeholder">{t('common.comingSoon', lang)}</div>}
        {tab === 'guide' && <div class="placeholder">{t('common.comingSoon', lang)}</div>}
      </main>
      <nav class="tabbar">
        {TABS.map((tabDef) => (
          <button
            key={tabDef.id}
            data-testid={`tab-${tabDef.id}`}
            class={tab === tabDef.id ? 'tab tab-active' : 'tab'}
            onClick={() => setTab(tabDef.id)}
          >
            {t(`tab.${tabDef.id}`, lang)}
          </button>
        ))}
      </nav>
    </div>
  );
}

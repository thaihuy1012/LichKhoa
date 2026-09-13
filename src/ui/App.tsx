import { useEffect, useRef, useState } from 'preact/hooks';
import type { AppState } from '../core/model';
import { defaultState } from '../core/model';
import { DEVICES, detectDevice } from '../render/devices';
import { loadState } from '../storage/db';
import { t } from '../core/i18n';
import { toISODate } from '../core/calendar';
import { consumeState, saveToken, getToken, clearToken } from '../google/oauth';
import { handleAuthRedirect, autoSyncIfNeeded } from './sync';
import { createStore, type Store } from './store';
import { Preview } from './screens/Preview';
import { Events } from './screens/Events';
import { Design } from './screens/Design';
import { Sync, type AuthNotice } from './screens/Sync';
import { Guide } from './screens/Guide';

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
  const [authNotice, setAuthNotice] = useState<AuthNotice | null>(null);
  const bootedRef = useRef(false);

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

  // Chạy 1 lần khi state đã nạp, KHÔNG phụ thuộc tab đang mở (SPEC §2 TH1): xử lý redirect Google
  // (nếu có #access_token/#error) rồi tự đồng bộ nếu token còn hạn và cache cũ/không có.
  useEffect(() => {
    if (!store || bootedRef.current) return;
    bootedRef.current = true;

    const authResult = handleAuthRedirect(window.location.hash, { consumeState, saveToken });
    if (authResult.handled) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setAuthNotice(authResult.ok ? { ok: true } : { ok: false, error: authResult.error });
      setTab('sync'); // để người dùng thấy ngay danh sách lịch / lỗi
    }

    const s = store.getState();
    const today = toISODate(new Date());
    // D-015: sau redirect kết nối thành công, ép đồng bộ ngay (bỏ điều kiện cache > 30').
    const force = authResult.handled && authResult.ok;
    void autoSyncIfNeeded(s.google.cache, s.google.calendarIds, today, Date.now(), { getToken, clearToken }, force).then(
      (outcome) => {
        if (outcome.ran && outcome.result.ok) {
          store.dispatch({
            type: 'setGoogleCache',
            cache: { events: outcome.result.events, fetchedAt: outcome.result.fetchedAt },
          });
        }
      },
    );
  }, [store]);

  if (!store) {
    const detectedLang = navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en';
    return <div class="app">{t('preview.loading', detectedLang)}</div>;
  }

  return (
    <div class="app">
      <main class="app-content">
        {tab === 'preview' && <Preview store={store} />}
        {tab === 'events' && <Events store={store} />}
        {tab === 'design' && <Design store={store} />}
        {tab === 'sync' && (
          <Sync store={store} authNotice={authNotice} onAuthNoticeShown={() => setAuthNotice(null)} />
        )}
        {tab === 'guide' && <Guide store={store} onGoToTab={(t) => setTab(t)} />}
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

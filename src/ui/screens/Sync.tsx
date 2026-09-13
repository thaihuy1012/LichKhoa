import { useEffect, useRef, useState } from 'preact/hooks';
import type { Store } from '../store';
import { buildAuthUrl, newState, getToken, clearToken } from '../../google/oauth';
import { fetchCalendars, AuthError, type GoogleCalendarInfo } from '../../google/calendar';
import { performSyncShared } from '../sync';
import { toISODate } from '../../core/calendar';
import { t } from '../../core/i18n';
import { Toast } from '../components/Toast';

const TOAST_MS = 2600;

export interface AuthNotice {
  ok: boolean;
  error?: string;
}

export interface SyncProps {
  store: Store;
  /** Kết quả xử lý redirect Google, xử lý ở App.tsx (không phụ thuộc tab) — hiện 1 lần rồi báo đã xem. */
  authNotice?: AuthNotice | null;
  onAuthNoticeShown?: () => void;
}

/** Màn Đồng bộ: chỉ UI + gọi nút; xử lý redirect/tự đồng bộ nằm ở `ui/sync.ts` + `App.tsx`. */
export function Sync({ store, authNotice, onAuthNoticeShown }: SyncProps) {
  const [state, setState] = useState(store.getState());
  const [hasToken, setHasToken] = useState(() => getToken() != null);
  const [reauthFlag, setReauthFlag] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendarInfo[]>([]);
  const [calendarsError, setCalendarsError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => store.subscribe(setState), [store]);

  const lang = state.design.lang;

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), TOAST_MS);
  }

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  // Hiện 1 lần kết quả kết nối do App.tsx xử lý (redirect Google) rồi báo đã xem.
  useEffect(() => {
    if (!authNotice) return;
    setHasToken(getToken() != null);
    if (authNotice.ok) {
      setReauthFlag(false);
      showToast(t('sync.connectedToast', lang));
    } else {
      showToast(`${t('sync.connectErrorPrefix', lang)}${authNotice.error ?? ''}`);
    }
    onAuthNoticeShown?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authNotice]);

  // Tải danh sách lịch khi có token.
  useEffect(() => {
    if (!hasToken) {
      setCalendars([]);
      return;
    }
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    fetchCalendars(token)
      .then((list) => {
        if (!cancelled) {
          setCalendars(list);
          setCalendarsError(null);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AuthError) {
          clearToken();
          setHasToken(false);
          setReauthFlag(true);
        } else {
          setCalendarsError(t('sync.calendarsLoadError', lang));
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  async function runSync() {
    const token = getToken();
    if (!token) {
      setHasToken(false);
      setReauthFlag(true);
      return;
    }
    setSyncing(true);
    const today = toISODate(new Date());
    const result = await performSyncShared(token, state.google.calendarIds, today);
    setSyncing(false);
    if (result.ok) {
      store.dispatch({ type: 'setGoogleCache', cache: { events: result.events, fetchedAt: result.fetchedAt } });
      showToast(t('sync.syncOkToast', lang));
    } else if (result.reauth) {
      clearToken();
      setHasToken(false);
      setReauthFlag(true);
    } else {
      showToast(t('sync.networkError', lang));
    }
  }

  function onConnect() {
    const clientId = state.google.clientId.trim();
    if (!clientId) return;
    const s = newState(window.localStorage);
    const redirectUri = window.location.origin + window.location.pathname;
    window.location.href = buildAuthUrl(clientId, redirectUri, s);
  }

  function onDisconnect() {
    clearToken();
    setHasToken(false);
    setReauthFlag(false);
    setCalendars([]);
    store.dispatch({ type: 'disconnectGoogle' });
    showToast(t('sync.disconnectedToast', lang));
  }

  function toggleCalendar(id: string, checked: boolean) {
    const cur = new Set(state.google.calendarIds);
    if (checked) cur.add(id);
    else cur.delete(id);
    store.dispatch({ type: 'setGoogleCalendarIds', calendarIds: [...cur] });
  }

  const connected = hasToken;
  // Từng kết nối (còn calendarIds đã chọn) nhưng nay mất token -> "Kết nối lại", kể cả khi
  // token bị xóa lúc app tự đồng bộ ở nền (App.tsx), không chỉ khi thao tác ngay trong màn này.
  const needsReauth = !connected && (reauthFlag || state.google.calendarIds.length > 0);

  return (
    <div class="sync-screen">
      <label class="field">
        {t('sync.clientIdLabel', lang)}
        <input
          type="text"
          data-testid="sync-clientid"
          value={state.google.clientId}
          placeholder={t('sync.clientIdPlaceholder', lang)}
          onInput={(e) =>
            store.dispatch({ type: 'setGoogleClientId', clientId: (e.target as HTMLInputElement).value })
          }
        />
      </label>
      <p class="hint">{t('sync.clientIdHint', lang)}</p>

      {!connected && !needsReauth && (
        <button
          type="button"
          class="btn btn-primary block"
          data-testid="sync-connect"
          disabled={!state.google.clientId.trim()}
          onClick={onConnect}
        >
          {t('sync.connect', lang)}
        </button>
      )}

      {needsReauth && (
        <button type="button" class="btn btn-primary block" data-testid="sync-reconnect" onClick={onConnect}>
          {t('sync.reconnect', lang)}
        </button>
      )}

      {connected && (
        <>
          <p data-testid="sync-status">{t('sync.connected', lang)}</p>

          <div class="field">
            <span>{t('sync.calendars', lang)}</span>
            <div data-testid="sync-calendar-list" class="sync-calendar-list">
              {calendarsError && <p class="error">{calendarsError}</p>}
              {!calendarsError && calendars.length === 0 && <p class="hint">{t('sync.calendarsEmpty', lang)}</p>}
              {calendars.map((c) => (
                <label key={c.id} class="field field-between sync-calendar-item">
                  <span>{c.summary}</span>
                  <input
                    type="checkbox"
                    class="switch"
                    data-testid={`sync-cal-${c.id}`}
                    checked={state.google.calendarIds.includes(c.id)}
                    onChange={(e) => toggleCalendar(c.id, (e.target as HTMLInputElement).checked)}
                  />
                </label>
              ))}
            </div>
          </div>

          <button type="button" class="btn btn-primary block" data-testid="sync-now" disabled={syncing} onClick={() => void runSync()}>
            {syncing ? t('sync.syncing', lang) : t('sync.syncNow', lang)}
          </button>

          <p data-testid="sync-last">
            {state.google.cache
              ? t('sync.lastSync', lang, { time: new Date(state.google.cache.fetchedAt).toLocaleString() })
              : t('sync.neverSynced', lang)}
          </p>

          <button type="button" class="btn danger block" data-testid="sync-disconnect" onClick={onDisconnect}>
            {t('sync.disconnect', lang)}
          </button>
        </>
      )}

      {needsReauth && <p class="error" data-testid="sync-reauth-msg">{t('sync.reauthNeeded', lang)}</p>}

      <Toast message={toastMsg} />
    </div>
  );
}

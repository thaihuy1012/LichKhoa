import { useEffect, useRef, useState } from 'preact/hooks';
import type { Store } from '../store';
import type { DesignConfig } from '../../core/model';
import { DEVICES, customDevice, detectDevice } from '../../render/devices';
import { renderWallpaper } from '../../render/wallpaper';
import { loadBg, saveBg } from '../../storage/db';
import { toISODate } from '../../core/calendar';
import { savePng, copyPng, openShortcut } from '../../export/share';
import { exportBackup, importBackup } from '../../storage/backup';
import { downloadBlob } from './events/util';
import { t } from '../../core/i18n';
import { Toast } from '../components/Toast';

const RENDER_DEBOUNCE_MS = 150;
const MIN_SIZE = 320;
const MAX_SIZE = 4096;
const TOAST_MS = 2600;

const LAYOUTS: { id: DesignConfig['layout']; testid: string; key: string }[] = [
  { id: 'month', testid: 'layout-month', key: 'settings.layoutMonth' },
  { id: 'agenda', testid: 'layout-agenda', key: 'settings.layoutAgenda' },
  { id: 'todo', testid: 'layout-todo', key: 'settings.layoutTodo' },
];

function isValidSize(n: number): boolean {
  return Number.isInteger(n) && n >= MIN_SIZE && n <= MAX_SIZE;
}

export function Preview({ store }: { store: Store }) {
  const [state, setState] = useState(store.getState());
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [widthText, setWidthText] = useState(String(state.device.width));
  const [heightText, setHeightText] = useState(String(state.device.height));
  const [shortcutNameText, setShortcutNameText] = useState(state.shortcutName);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const bgRef = useRef<Blob | null>(null);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderTokenRef = useRef(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Đồng bộ ngay khi đăng ký: nếu dispatch xảy ra giữa lúc khởi tạo state cục bộ
    // (useState(store.getState()) lúc render) và lúc effect này chạy (sau paint),
    // store đã đổi nhưng Preview chưa nhận — cập nhật lại để không kẹt ở state cũ.
    setState(store.getState());
    return store.subscribe(setState);
  }, [store]);

  useEffect(() => {
    setWidthText(String(state.device.width));
    setHeightText(String(state.device.height));
  }, [state.device.width, state.device.height]);

  useEffect(() => {
    setShortcutNameText(state.shortcutName);
  }, [state.shortcutName]);

  useEffect(() => {
    loadBg().then((b) => {
      bgRef.current = b;
    });
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const token = ++renderTokenRef.current;
      const today = toISODate(new Date());
      renderWallpaper(state, bgRef.current, today)
        .then((b) => {
          if (token !== renderTokenRef.current) {
            // lần render này không còn mới nhất: bỏ kết quả
            return;
          }
          setBlob(b);
          setError(null);
          const url = URL.createObjectURL(b);
          if (urlRef.current) URL.revokeObjectURL(urlRef.current);
          urlRef.current = url;
          setImgUrl(url);
        })
        .catch((err: unknown) => {
          if (token !== renderTokenRef.current) return;
          setError(err instanceof Error ? err.message : t('preview.renderError', state.design.lang));
        });
    }, RENDER_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), TOAST_MS);
  }

  const lang = state.design.lang;

  function setDesign(partial: Partial<DesignConfig>) {
    store.dispatch({ type: 'setDesign', partial });
  }

  function onExportJson() {
    const json = exportBackup(state);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `lichkhoa-backup-${toISODate(new Date())}.json`);
    showToast(t('settings.exportOk', lang));
  }

  async function onImportJson(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const imported = importBackup(text);
      if (!window.confirm(t('settings.importConfirm', lang))) return;
      store.dispatch({ type: 'replaceState', state: imported });
      showToast(t('settings.importOk', lang));
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('settings.importError', lang));
    }
  }

  async function onWipe() {
    if (!window.confirm(t('settings.clearDataConfirm', lang))) return;
    store.dispatch({ type: 'resetAll' });
    // T-4.7 #4: resetAll chỉ đổi state chữ; ảnh nền lưu riêng ở IndexedDB (BG_KEY) phải dọn
    // ngay để lần sau chọn lại nền Ảnh không hiện ảnh cũ của lượt trước.
    bgRef.current = null;
    await saveBg(null);
    showToast(t('settings.wipeOk', lang));
  }

  const isPreset = DEVICES.some((d) => d.id === state.device.id);
  const selectValue = isPreset ? state.device.id : state.device.id === 'auto' ? 'auto' : 'custom';

  function onSelectDevice(id: string) {
    if (id === 'auto') {
      store.dispatch({
        type: 'setDevice',
        device: detectDevice(window.screen.width, window.screen.height, window.devicePixelRatio || 1),
      });
    } else if (id === 'custom') {
      store.dispatch({ type: 'setDevice', device: customDevice(state.device.width, state.device.height) });
    } else {
      const preset = DEVICES.find((d) => d.id === id);
      if (preset) store.dispatch({ type: 'setDevice', device: preset });
    }
  }

  function onWidthInput(text: string) {
    setWidthText(text);
    const w = Number(text);
    const h = Number(heightText);
    if (isValidSize(w) && isValidSize(h)) {
      store.dispatch({ type: 'setDevice', device: customDevice(w, h) });
    }
  }

  function onHeightInput(text: string) {
    setHeightText(text);
    const w = Number(widthText);
    const h = Number(text);
    if (isValidSize(w) && isValidSize(h)) {
      store.dispatch({ type: 'setDevice', device: customDevice(w, h) });
    }
  }

  async function onSave() {
    if (!blob) return;
    const today = toISODate(new Date());
    await savePng(blob, `lichkhoa-${today}.png`);
  }

  function onShortcutNameInput(text: string) {
    setShortcutNameText(text);
    if (text.trim()) {
      store.dispatch({ type: 'setShortcutName', shortcutName: text });
    }
  }

  async function onCopy() {
    if (!blob) return;
    // copyPng gọi navigator.clipboard.write ngay đầu — không await gì trước đó (user activation).
    const ok = await copyPng(blob);
    showToast(ok ? t('preview.copyOk', lang) : t('preview.copyError', lang));
  }

  async function onSetWallpaper() {
    if (!blob) return;
    const ok = await copyPng(blob);
    if (!ok) {
      showToast(t('preview.copyError', lang));
      return;
    }
    openShortcut(state.shortcutName);
    showToast(t('preview.setWallpaperOk', lang));
  }

  return (
    <div class="preview-screen">
      <div class="preview-core">
        <label class="field">
          {t('preview.device', lang)}
          <select
            data-testid="device"
            value={selectValue}
            onChange={(e) => onSelectDevice((e.target as HTMLSelectElement).value)}
          >
            {DEVICES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
            <option value="auto">{t('preview.deviceAuto', lang)}</option>
            <option value="custom">{t('preview.deviceCustom', lang)}</option>
          </select>
        </label>
        {selectValue === 'custom' && (
          <div class="custom-size">
            <input
              type="number"
              aria-label={t('preview.width', lang)}
              value={widthText}
              onInput={(e) => onWidthInput((e.target as HTMLInputElement).value)}
            />
            <input
              type="number"
              aria-label={t('preview.height', lang)}
              value={heightText}
              onInput={(e) => onHeightInput((e.target as HTMLInputElement).value)}
            />
          </div>
        )}
        {error && <p class="error">{error}</p>}
        {imgUrl && <img data-testid="preview" src={imgUrl} alt={t('preview.previewAlt', lang)} />}
        <label class="field shortcut-name-field">
          {t('preview.shortcutName', lang)}
          <input
            type="text"
            data-testid="shortcut-name"
            value={shortcutNameText}
            onInput={(e) => onShortcutNameInput((e.target as HTMLInputElement).value)}
          />
        </label>
        <div class="row-actions">
          <button data-testid="save" onClick={() => void onSave()} disabled={!blob}>
            {t('preview.save', lang)}
          </button>
          <button data-testid="copy" onClick={() => void onCopy()} disabled={!blob}>
            {t('preview.copy', lang)}
          </button>
          <button
            data-testid="set-wallpaper"
            class="btn-primary"
            onClick={() => void onSetWallpaper()}
            disabled={!blob}
          >
            {t('preview.setWallpaper', lang)}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <div class="field">
          <span>{t('settings.layout', lang)}</span>
          <div class="segmented" role="tablist">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={state.design.layout === l.id}
                aria-pressed={state.design.layout === l.id}
                data-testid={l.testid}
                class={state.design.layout === l.id ? 'seg-btn seg-active' : 'seg-btn'}
                onClick={() => setDesign({ layout: l.id })}
              >
                {t(l.key, lang)}
              </button>
            ))}
          </div>
        </div>

        <label class="field">
          {t('settings.language', lang)}
          <select
            data-testid="lang"
            value={state.design.lang}
            onChange={(e) => setDesign({ lang: (e.target as HTMLSelectElement).value as 'vi' | 'en' })}
          >
            <option value="vi">{t('settings.langVi', lang)}</option>
            <option value="en">{t('settings.langEn', lang)}</option>
          </select>
        </label>

        <div class="field field-between">
          <label for="hour12">{t('settings.hour12Switch', lang)}</label>
          <input
            type="checkbox"
            id="hour12"
            class="switch"
            data-testid="hour12"
            checked={state.design.hour12}
            onChange={(e) => setDesign({ hour12: (e.target as HTMLInputElement).checked })}
          />
        </div>

        <label class="field">
          {t('settings.weekStart', lang)}
          <select
            data-testid="weekstart"
            value={String(state.design.weekStart)}
            onChange={(e) => setDesign({ weekStart: (Number((e.target as HTMLSelectElement).value) as 0 | 1) })}
          >
            <option value="1">{t('settings.weekStartMon', lang)}</option>
            <option value="0">{t('settings.weekStartSun', lang)}</option>
          </select>
        </label>

        <div class="field field-between">
          <label for="lunar">{t('settings.lunar', lang)}</label>
          <input
            type="checkbox"
            id="lunar"
            class="switch"
            data-testid="lunar"
            checked={state.design.showLunar}
            onChange={(e) => setDesign({ showLunar: (e.target as HTMLInputElement).checked })}
          />
        </div>

        <div class="field field-between">
          <label for="month-list">{t('preview.monthList', lang)}</label>
          <input
            type="checkbox"
            id="month-list"
            class="switch"
            data-testid="month-list"
            checked={state.design.monthList}
            onChange={(e) => setDesign({ monthList: (e.target as HTMLInputElement).checked })}
          />
        </div>

        <button type="button" class="btn block" data-testid="export-json" onClick={onExportJson}>
          {t('settings.exportJson', lang)}
        </button>
        <p class="hint">{t('settings.exportHint', lang)}</p>

        <label class="btn block btn-file" for="import-json">
          {t('settings.importJson', lang)}
        </label>
        <input
          type="file"
          id="import-json"
          data-testid="import-json"
          accept=".json,application/json"
          class="visually-hidden"
          onChange={(e) => void onImportJson(e)}
        />
        <p class="hint">{t('settings.importHint', lang)}</p>

        <button type="button" class="btn danger block" data-testid="wipe" onClick={() => void onWipe()}>
          {t('settings.clearData', lang)}
        </button>
      </div>

      <Toast message={toastMsg} />
    </div>
  );
}

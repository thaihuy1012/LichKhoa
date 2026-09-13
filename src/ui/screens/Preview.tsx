import { useEffect, useRef, useState } from 'preact/hooks';
import type { Store } from '../store';
import { DEVICES, customDevice, detectDevice } from '../../render/devices';
import { renderWallpaper } from '../../render/wallpaper';
import { loadBg } from '../../storage/db';
import { toISODate } from '../../core/calendar';
import { savePng } from '../../export/share';

const RENDER_DEBOUNCE_MS = 150;
const MIN_SIZE = 320;
const MAX_SIZE = 4096;

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
  const bgRef = useRef<Blob | null>(null);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderTokenRef = useRef(0);

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
          setError(err instanceof Error ? err.message : 'Không dựng được ảnh xem trước');
        });
    }, RENDER_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

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

  return (
    <div class="preview-screen">
      <label class="field">
        Thiết bị
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
          <option value="auto">Tự phát hiện</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
      </label>
      {selectValue === 'custom' && (
        <div class="custom-size">
          <input
            type="number"
            aria-label="Chiều rộng"
            value={widthText}
            onInput={(e) => onWidthInput((e.target as HTMLInputElement).value)}
          />
          <input
            type="number"
            aria-label="Chiều cao"
            value={heightText}
            onInput={(e) => onHeightInput((e.target as HTMLInputElement).value)}
          />
        </div>
      )}
      {error && <p class="error">{error}</p>}
      {imgUrl && <img data-testid="preview" src={imgUrl} alt="Xem trước hình nền" />}
      <button data-testid="save" onClick={() => void onSave()} disabled={!blob}>
        Lưu ảnh
      </button>
    </div>
  );
}

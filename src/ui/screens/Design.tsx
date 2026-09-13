import { useLayoutEffect, useState } from 'preact/hooks';
import type { Store } from '../store';
import type { DesignConfig } from '../../core/model';
import { loadPhoto } from '../../render/background';
import { saveBg } from '../../storage/db';
import { t } from '../../core/i18n';

/** Bảng màu nhấn (port lich-nen.html L410 `ACCENTS`, tông vẫn hợp nền tối). */
const ACCENTS = ['#ffd166', '#ff7a59', '#6ee7b7', '#7cc4ff', '#f5a3c7', '#ffffff'];

const BG_KINDS: { id: DesignConfig['bg']['kind']; testid: string; key: string }[] = [
  { id: 'photo', testid: 'bg-kind-photo', key: 'design.bgPhoto' },
  { id: 'solid', testid: 'bg-kind-solid', key: 'design.bgSolid' },
  { id: 'gradient', testid: 'bg-kind-gradient', key: 'design.bgGradient' },
];

const BLURS: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

const FONTS: { id: DesignConfig['font']; testid: string; key: string }[] = [
  { id: 'sans', testid: 'font-sans', key: 'design.fontSans' },
  { id: 'serif', testid: 'font-serif', key: 'design.fontSerif' },
  { id: 'mono', testid: 'font-mono', key: 'design.fontMono' },
];

const POSITIONS: { id: DesignConfig['position']; testid: string; key: string }[] = [
  { id: 'top', testid: 'position-top', key: 'design.positionTop' },
  { id: 'middle', testid: 'position-middle', key: 'design.positionMiddle' },
  { id: 'bottom', testid: 'position-bottom', key: 'design.positionBottom' },
];

const AGENDA_DAYS_OPTIONS = [3, 5, 7, 14];

/** T-4.6: % vị trí giá trị trên rãnh, dùng làm CSS var `--pct` để tô phần đã chọn = accent. */
function rangePct(value: number, min: number, max: number): string {
  return `${(((value - min) / (max - min)) * 100).toFixed(2)}%`;
}

/** Màn Thiết kế: nền (ảnh/màu/gradient), mờ/tối, màu chữ/nhấn, font, vị trí, scale, boxAlpha, agendaDays. */
export function Design({ store }: { store: Store }) {
  const [state, setState] = useState(store.getState());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useLayoutEffect (không phải useEffect): đăng ký subscribe ngay sau commit, trước khi
  // trình duyệt vẽ khung hình kế tiếp -- tránh lọt mất dispatch xảy ra ngay sau khi mount
  // (vd. chuyển tab rồi bấm/kéo range ngay lập tức) do useEffect bị hoãn tới sau paint.
  useLayoutEffect(() => store.subscribe(setState), [store]);

  const lang = state.design.lang;
  const { bg } = state.design;

  function setDesign(partial: Partial<DesignConfig>) {
    store.dispatch({ type: 'setDesign', partial });
  }

  /** D-012: chuyển sang 'photo' lần đầu (boxAlpha mặc định 1, hộp nền đặc sẽ che ảnh) -> hạ còn 0.35. */
  function boxAlphaPatchForPhoto(wasPhoto: boolean): Partial<DesignConfig> {
    return !wasPhoto && state.design.boxAlpha === 1 ? { boxAlpha: 0.35 } : {};
  }

  function setBgKind(kind: DesignConfig['bg']['kind']) {
    const wasPhoto = bg.kind === 'photo';
    setDesign({ bg: { ...bg, kind }, ...boxAlphaPatchForPhoto(wasPhoto) });
  }

  async function onPickFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const wasPhoto = bg.kind === 'photo';
      const blob = await loadPhoto(file, state.device);
      await saveBg(blob);
      setDesign({ bg: { ...bg, kind: 'photo' }, ...boxAlphaPatchForPhoto(wasPhoto) });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('design.bgError', lang));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div class="design-screen">
      <div class="field">
        <span>{t('design.bg', lang)}</span>
        <div class="segmented" role="tablist">
          {BG_KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={bg.kind === k.id}
              data-testid={k.testid}
              class={bg.kind === k.id ? 'seg-btn seg-active' : 'seg-btn'}
              onClick={() => setBgKind(k.id)}
            >
              {t(k.key, lang)}
            </button>
          ))}
        </div>
      </div>

      <label class="btn block btn-file" for="bg-file">
        {t('design.bgPick', lang)}
      </label>
      <input
        type="file"
        id="bg-file"
        data-testid="bg-file"
        accept="image/*"
        class="visually-hidden"
        onChange={(e) => void onPickFile(e)}
      />
      {processing && <p class="hint">{t('design.bgProcessing', lang)}</p>}
      {error && <p class="error">{error}</p>}

      {bg.kind !== 'photo' && (
        <div class="field-inline">
          <label class="field">
            {t('design.bgColor', lang)}
            <span class="color-row">
              <input
                type="color"
                data-testid="bg-color"
                class="color-input"
                value={bg.color}
                onInput={(e) => setDesign({ bg: { ...bg, color: (e.target as HTMLInputElement).value } })}
              />
              <span class="color-hex" data-testid="bg-color-hex">
                {bg.color.toUpperCase()}
              </span>
            </span>
          </label>
          {bg.kind === 'gradient' && (
            <label class="field">
              {t('design.bgColor2', lang)}
              <span class="color-row">
                <input
                  type="color"
                  data-testid="bg-color2"
                  class="color-input"
                  value={bg.color2 ?? bg.color}
                  onInput={(e) => setDesign({ bg: { ...bg, color2: (e.target as HTMLInputElement).value } })}
                />
                <span class="color-hex" data-testid="bg-color2-hex">
                  {(bg.color2 ?? bg.color).toUpperCase()}
                </span>
              </span>
            </label>
          )}
        </div>
      )}

      <div class="field">
        <span>{t('design.blur', lang)}</span>
        <div class="segmented" role="tablist">
          {BLURS.map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={state.design.blur === b}
              data-testid={`blur-${b}`}
              class={state.design.blur === b ? 'seg-btn seg-active' : 'seg-btn'}
              onClick={() => setDesign({ blur: b })}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <label class="field">
        <span class="field-title">
          {t('design.dim', lang)}
          <span class="field-value" data-testid="dim-value">
            {state.design.dim.toFixed(1)}
          </span>
        </span>
        <input
          type="range"
          data-testid="dim"
          min={0}
          max={0.8}
          step={0.1}
          value={state.design.dim}
          style={{ '--pct': rangePct(state.design.dim, 0, 0.8) }}
          onInput={(e) => setDesign({ dim: Number((e.target as HTMLInputElement).value) })}
        />
      </label>

      <label class="field">
        {t('design.textColor', lang)}
        <span class="color-row">
          <input
            type="color"
            data-testid="text-color"
            class="color-input"
            value={state.design.textColor}
            onInput={(e) => setDesign({ textColor: (e.target as HTMLInputElement).value })}
          />
          <span class="color-hex" data-testid="text-color-hex">
            {state.design.textColor.toUpperCase()}
          </span>
        </span>
      </label>

      <div class="field">
        <span>{t('design.accentColor', lang)}</span>
        <div class="swatches">
          {ACCENTS.map((c, i) => {
            const on = c.toLowerCase() === state.design.accentColor.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                data-testid={`accent-${i}`}
                class={on ? 'swatch swatch-on' : 'swatch'}
                style={{ background: c }}
                aria-label={c}
                aria-pressed={on}
                onClick={() => setDesign({ accentColor: c })}
              />
            );
          })}
          <input
            type="color"
            data-testid="accent-color"
            class="color-input"
            value={state.design.accentColor}
            onInput={(e) => setDesign({ accentColor: (e.target as HTMLInputElement).value })}
          />
          <span class="color-hex" data-testid="accent-color-hex">
            {state.design.accentColor.toUpperCase()}
          </span>
        </div>
      </div>

      <div class="field">
        <span>{t('design.font', lang)}</span>
        <div class="segmented" role="tablist">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={state.design.font === f.id}
              data-testid={f.testid}
              class={state.design.font === f.id ? 'seg-btn seg-active' : 'seg-btn'}
              onClick={() => setDesign({ font: f.id })}
            >
              {t(f.key, lang)}
            </button>
          ))}
        </div>
      </div>

      <div class="field">
        <span>{t('design.position', lang)}</span>
        <div class="segmented" role="tablist">
          {POSITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={state.design.position === p.id}
              data-testid={p.testid}
              class={state.design.position === p.id ? 'seg-btn seg-active' : 'seg-btn'}
              onClick={() => setDesign({ position: p.id })}
            >
              {t(p.key, lang)}
            </button>
          ))}
        </div>
      </div>

      <label class="field">
        <span class="field-title">
          {t('design.scale', lang)}
          <span class="field-value" data-testid="scale-value">
            {state.design.scale.toFixed(1)}×
          </span>
        </span>
        <input
          type="range"
          data-testid="scale"
          min={0.8}
          max={1.3}
          step={0.05}
          value={state.design.scale}
          style={{ '--pct': rangePct(state.design.scale, 0.8, 1.3) }}
          onInput={(e) => setDesign({ scale: Number((e.target as HTMLInputElement).value) })}
        />
      </label>

      <label class="field">
        <span class="field-title">
          {t('design.boxAlpha', lang)}
          <span class="field-value" data-testid="box-alpha-value">
            {Math.round(state.design.boxAlpha * 100)}%
          </span>
        </span>
        <input
          type="range"
          data-testid="box-alpha"
          min={0}
          max={1}
          step={0.05}
          value={state.design.boxAlpha}
          style={{ '--pct': rangePct(state.design.boxAlpha, 0, 1) }}
          onInput={(e) => setDesign({ boxAlpha: Number((e.target as HTMLInputElement).value) })}
        />
      </label>

      <label class="field">
        {t('design.agendaDays', lang)}
        <select
          data-testid="agenda-days"
          value={String(state.design.agendaDays)}
          onChange={(e) => setDesign({ agendaDays: Number((e.target as HTMLSelectElement).value) })}
        >
          {AGENDA_DAYS_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

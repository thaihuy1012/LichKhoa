import { get, set } from 'idb-keyval';
import type { AppState } from '../core/model';
import { normalizeState } from '../core/model';

const STATE_KEY = 'lichkhoa:state';
const BG_KEY = 'lichkhoa:bg';

export async function loadState(): Promise<AppState | null> {
  try {
    const v = await get(STATE_KEY);
    return normalizeState(v);
  } catch {
    return null;
  }
}

export async function saveState(s: AppState): Promise<void> {
  await set(STATE_KEY, s);
}

// Lưu Blob dưới dạng { buf: ArrayBuffer; type: string } thay vì Blob trực tiếp: bản WebKit dùng
// trong Playwright (và một số Safari cũ) ném lỗi khi structured-clone một Blob vào IndexedDB
// (transaction abort, lỗi rỗng) — phát hiện khi T-4.2 lần đầu thực sự lưu ảnh nền qua saveBg().
// ArrayBuffer clone được bình thường ở mọi nơi; chữ ký công khai (Blob|null) giữ nguyên theo SPEC.
interface StoredBg {
  buf: ArrayBuffer;
  type: string;
}

function isStoredBg(v: unknown): v is StoredBg {
  return typeof v === 'object' && v !== null && 'buf' in v && (v as { buf: unknown }).buf instanceof ArrayBuffer;
}

export async function loadBg(): Promise<Blob | null> {
  const v = await get(BG_KEY);
  if (v == null) return null;
  if (v instanceof Blob) return v; // tương thích ngược nếu từng lưu trực tiếp
  if (isStoredBg(v)) return new Blob([v.buf], { type: v.type });
  return null;
}

export async function saveBg(b: Blob | null): Promise<void> {
  if (b === null) {
    await set(BG_KEY, null);
    return;
  }
  const buf = await b.arrayBuffer();
  const stored: StoredBg = { buf, type: b.type };
  await set(BG_KEY, stored);
}

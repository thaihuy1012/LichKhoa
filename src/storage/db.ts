import { get, set } from 'idb-keyval';
import type { AppState } from '../core/model';

const STATE_KEY = 'lichkhoa:state';
const BG_KEY = 'lichkhoa:bg';

export async function loadState(): Promise<AppState | null> {
  const v = await get(STATE_KEY);
  return (v as AppState) ?? null;
}

export async function saveState(s: AppState): Promise<void> {
  await set(STATE_KEY, s);
}

export async function loadBg(): Promise<Blob | null> {
  const v = await get(BG_KEY);
  return (v as Blob) ?? null;
}

export async function saveBg(b: Blob | null): Promise<void> {
  await set(BG_KEY, b);
}

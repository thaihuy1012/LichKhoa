const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const STATE_KEY = 'google_oauth_state';
const TOKEN_KEY = 'google_oauth_token';
/** Biên an toàn trừ khỏi hạn token để tránh dùng token sát hết hạn. */
const EXPIRY_SAFETY_MS = 60_000;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type TokenRecord = { accessToken: string; expiresAt: number };

function defaultLocalStorage(): StorageLike | undefined {
  return typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : undefined;
}

function defaultSessionStorage(): StorageLike | undefined {
  return typeof globalThis.sessionStorage !== 'undefined' ? globalThis.sessionStorage : undefined;
}

/** Sinh `state` ngẫu nhiên (≥128 bit) mã hóa base64url, dùng chống CSRF cho luồng OAuth implicit. */
export function newState(storage: StorageLike | undefined = defaultSessionStorage()): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const state = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  storage?.setItem(STATE_KEY, state);
  return state;
}

/** Xây URL ủy quyền Google OAuth implicit (`response_type=token`); luồng thuần client, không dùng khóa bí mật. */
export function buildAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string,
  prompt?: 'select_account' | 'none'
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: SCOPE,
    include_granted_scopes: 'true',
    state,
  });
  if (prompt) params.set('prompt', prompt);
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/** Parse `#fragment` trả về từ Google sau redirect: token hợp lệ, lỗi, hoặc null nếu hash rỗng/không khớp. */
export function parseFragment(
  hash: string,
  expectedState: string
): { accessToken: string; expiresIn: number } | { error: string } | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const error = params.get('error');
  if (error) return { error: decodeURIComponent(error) };

  const accessToken = params.get('access_token');
  const expiresInRaw = params.get('expires_in');
  const state = params.get('state');

  if (!accessToken || !expiresInRaw) return null;
  if (state !== expectedState) return null;

  const expiresIn = Number(expiresInRaw);
  if (!Number.isFinite(expiresIn)) return null;

  return { accessToken, expiresIn };
}

/** Lưu token vào storage (mặc định localStorage) với `expiresAt = now + expiresIn*1000 - biên an toàn`. */
export function saveToken(
  accessToken: string,
  expiresIn: number,
  now: number = Date.now(),
  storage: StorageLike | undefined = defaultLocalStorage()
): void {
  const record: TokenRecord = {
    accessToken,
    expiresAt: now + expiresIn * 1000 - EXPIRY_SAFETY_MS,
  };
  storage?.setItem(TOKEN_KEY, JSON.stringify(record));
}

/** Đọc token còn hạn từ storage; trả `null` nếu không có hoặc đã hết hạn. */
export function getToken(
  now: number = Date.now(),
  storage: StorageLike | undefined = defaultLocalStorage()
): string | null {
  const raw = storage?.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as TokenRecord;
    if (typeof record.accessToken !== 'string' || typeof record.expiresAt !== 'number') return null;
    if (now >= record.expiresAt) return null;
    return record.accessToken;
  } catch {
    return null;
  }
}

/** Xóa token đã lưu (dùng khi Ngắt kết nối hoặc gặp 401). */
export function clearToken(storage: StorageLike | undefined = defaultLocalStorage()): void {
  storage?.removeItem(TOKEN_KEY);
}

/** Đọc `state` đã lưu bởi `newState` rồi xóa ngay (dùng 1 lần khi xử lý redirect Google, kể cả khi lỗi). */
export function consumeState(storage: StorageLike | undefined = defaultLocalStorage()): string | null {
  const value = storage?.getItem(STATE_KEY) ?? null;
  storage?.removeItem(STATE_KEY);
  return value;
}

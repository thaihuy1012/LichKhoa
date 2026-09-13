import type { Occurrence, ISODate } from '../core/model';
import { fetchEvents, AuthError } from '../google/calendar';
import { parseFragment } from '../google/oauth';
import { toISODate, parseISODate } from '../core/calendar';

/** Cache Google coi là cũ sau 30 phút (SPEC §3 IN-5). */
export const AUTO_SYNC_STALE_MS = 30 * 60 * 1000;

/**
 * Quyết định có tự đồng bộ khi mở app: token còn hạn && (chưa có cache hoặc cache cũ hơn 30 phút).
 * Hàm thuần — test bằng `now`/`hasToken`/`cache` giả, không cần fetch.
 */
export function shouldAutoSync(hasToken: boolean, cache: { fetchedAt: number } | null, now: number): boolean {
  if (!hasToken) return false;
  if (!cache) return true;
  return now - cache.fetchedAt > AUTO_SYNC_STALE_MS;
}

/** Khoảng đồng bộ cố định [today - 1, today + 60] (SPEC §9). */
export function syncRange(today: ISODate): { timeMin: ISODate; timeMax: ISODate } {
  const { y, m0, d } = parseISODate(today);
  return {
    timeMin: toISODate(new Date(y, m0, d - 1)),
    timeMax: toISODate(new Date(y, m0, d + 60)),
  };
}

export type SyncResult =
  | { ok: true; events: Occurrence[]; fetchedAt: number }
  | { ok: false; reauth: true }
  | { ok: false; reauth: false; error: string };

/** Gọi Google, chuẩn hóa kết quả thành `SyncResult`; 401 → `reauth:true`, lỗi khác (vd. mạng) → giữ cache của caller. */
export async function performSync(
  token: string,
  calendarIds: string[],
  today: ISODate,
  now: number = Date.now(),
): Promise<SyncResult> {
  try {
    const { timeMin, timeMax } = syncRange(today);
    const events = await fetchEvents(token, calendarIds, timeMin, timeMax);
    return { ok: true, events, fetchedAt: now };
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, reauth: true };
    return { ok: false, reauth: false, error: err instanceof Error ? err.message : String(err) };
  }
}

let inFlightSync: Promise<SyncResult> | null = null;

/**
 * Bọc `performSync` bằng khóa dùng chung (T-3.4 yêu cầu 3): nếu một lượt đồng bộ (tự động hoặc
 * tay) đang chạy, lượt gọi thêm chỉ chờ chung kết quả thay vì gọi fetch song song lần nữa.
 */
export function performSyncShared(
  token: string,
  calendarIds: string[],
  today: ISODate,
  now: number = Date.now(),
): Promise<SyncResult> {
  if (!inFlightSync) {
    inFlightSync = performSync(token, calendarIds, today, now).finally(() => {
      inFlightSync = null;
    });
  }
  return inFlightSync;
}

/** Có lượt đồng bộ nào (tự động hoặc tay) đang chạy hay không — dùng để vô hiệu hóa nút "Đồng bộ ngay". */
export function isSyncing(): boolean {
  return inFlightSync !== null;
}

export interface AuthRedirectDeps {
  consumeState: () => string | null;
  saveToken: (accessToken: string, expiresIn: number) => void;
}

export type AuthRedirectResult =
  | { handled: false }
  | { handled: true; ok: true }
  | { handled: true; ok: false; error: string };

/**
 * Xử lý `#access_token=…`/`#error=…` khi Google redirect về app. Gọi MỘT lần ở cấp App (không phụ
 * thuộc tab đang mở — SPEC §2 TH1 tự đồng bộ khi mở icon). Không đụng DOM (`history.replaceState`
 * do caller làm sau khi có kết quả).
 */
export function handleAuthRedirect(hash: string, deps: AuthRedirectDeps): AuthRedirectResult {
  if (!hash || !(hash.includes('access_token=') || hash.includes('error='))) return { handled: false };
  const expectedState = deps.consumeState() ?? '';
  const parsed = parseFragment(hash, expectedState);
  if (parsed && 'accessToken' in parsed) {
    deps.saveToken(parsed.accessToken, parsed.expiresIn);
    return { handled: true, ok: true };
  }
  if (parsed && 'error' in parsed) return { handled: true, ok: false, error: parsed.error };
  return { handled: true, ok: false, error: 'invalid_state' };
}

export interface AutoSyncDeps {
  getToken: () => string | null;
  clearToken: () => void;
}

export type AutoSyncOutcome = { ran: false } | { ran: true; result: SyncResult };

/**
 * Tự đồng bộ khi mở app (token còn hạn && cache cũ/không có, trừ khi `force`); 401 → `clearToken()`
 * (người dùng thấy "Kết nối lại" khi mở tab Đồng bộ); lỗi mạng → giữ cache (không xóa gì).
 * `force` (D-015): bỏ qua điều kiện cache khi vừa kết nối Google thành công (chỉ cần có token).
 */
export async function autoSyncIfNeeded(
  cache: { fetchedAt: number } | null,
  calendarIds: string[],
  today: ISODate,
  now: number,
  deps: AutoSyncDeps,
  force = false,
): Promise<AutoSyncOutcome> {
  const token = deps.getToken();
  if (!force && !shouldAutoSync(token != null, cache, now)) return { ran: false };
  if (!token) return { ran: false };
  const result = await performSyncShared(token, calendarIds, today, now);
  if (!result.ok && result.reauth) deps.clearToken();
  return { ran: true, result };
}

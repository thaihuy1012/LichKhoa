import type { AppState } from '../core/model';
import { normalizeState } from '../core/model';

const BACKUP_VERSION = 1;

/** Xuất state thành chuỗi JSON `{version, state}` để sao lưu (không kèm Blob ảnh nền). */
export function exportBackup(s: AppState): string {
  return JSON.stringify({ version: BACKUP_VERSION, state: s });
}

/** Nhập backup: parse JSON, kiểm version, bù/kiểm state qua `normalizeState`. Ném lỗi rõ ràng nếu không hợp lệ. */
export function importBackup(json: string): AppState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Tệp sao lưu không phải JSON hợp lệ');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Tệp sao lưu không hợp lệ');
  }
  const obj = parsed as Record<string, unknown>;
  if (obj['version'] !== BACKUP_VERSION) {
    throw new Error(`Phiên bản sao lưu không được hỗ trợ: ${String(obj['version'])}`);
  }

  const state = normalizeState(obj['state']);
  if (state === null) {
    throw new Error('Dữ liệu sao lưu không hợp lệ');
  }
  return state;
}

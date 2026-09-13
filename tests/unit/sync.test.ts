import { describe, it, expect, vi, afterEach } from 'vitest';
import { performSyncShared, autoSyncIfNeeded } from '../../src/ui/sync';
import calendarList from '../fixtures/google/calendarList.json';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('autoSyncIfNeeded force (D-015: ép đồng bộ ngay sau kết nối thành công)', () => {
  it('force=true bỏ qua cache mới (< 30 phút) và vẫn đồng bộ khi có token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/calendarList')) return { ok: true, status: 200, json: async () => calendarList } as Response;
        return { ok: true, status: 200, json: async () => ({ items: [] }) } as Response;
      }),
    );
    const cacheFresh = { fetchedAt: Date.now() }; // cache vừa xong -> shouldAutoSync bình thường sẽ false
    const outcome = await autoSyncIfNeeded(
      cacheFresh,
      ['cal1@group.calendar.google.com'],
      '2026-01-01',
      Date.now(),
      { getToken: () => 'tok', clearToken: () => {} },
      true,
    );
    expect(outcome.ran).toBe(true);
  });

  it('force=false + cache mới -> không chạy (hành vi cũ giữ nguyên)', async () => {
    const cacheFresh = { fetchedAt: Date.now() };
    const outcome = await autoSyncIfNeeded(
      cacheFresh,
      [],
      '2026-01-01',
      Date.now(),
      { getToken: () => 'tok', clearToken: () => {} },
      false,
    );
    expect(outcome.ran).toBe(false);
  });

  it('force=true nhưng không có token -> không chạy', async () => {
    const outcome = await autoSyncIfNeeded(
      null,
      [],
      '2026-01-01',
      Date.now(),
      { getToken: () => null, clearToken: () => {} },
      true,
    );
    expect(outcome.ran).toBe(false);
  });
});

describe('performSyncShared (T-3.4 yêu cầu 3: chống đồng bộ trùng)', () => {
  it('gọi 2 lần liên tiếp khi lần 1 chưa xong → fetch giả chỉ chạy 1 lượt', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async (url: string) => {
      calls++;
      await new Promise((r) => setTimeout(r, 10));
      if (url.includes('/calendarList')) {
        return { ok: true, status: 200, json: async () => calendarList } as Response;
      }
      return { ok: true, status: 200, json: async () => ({ items: [] }) } as Response;
    });
    vi.stubGlobal('fetch', fetchMock);

    const [r1, r2] = await Promise.all([
      performSyncShared('tok', ['cal1@group.calendar.google.com'], '2026-01-01'),
      performSyncShared('tok', ['cal1@group.calendar.google.com'], '2026-01-01'),
    ]);

    expect(r1).toBe(r2); // cùng một kết quả, chia sẻ 1 lượt fetch
    expect(calls).toBe(2); // 1 calendarList + 1 events; nếu chạy độc lập sẽ là 4
  });

  it('sau khi lượt trước xong, lượt sau gọi lại bình thường (không kẹt khóa)', async () => {
    let calls = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        calls++;
        if (url.includes('/calendarList')) return { ok: true, status: 200, json: async () => calendarList } as Response;
        return { ok: true, status: 200, json: async () => ({ items: [] }) } as Response;
      })
    );

    await performSyncShared('tok', ['cal1@group.calendar.google.com'], '2026-01-01');
    await performSyncShared('tok', ['cal1@group.calendar.google.com'], '2026-01-01');
    expect(calls).toBe(4); // 2 lượt tuần tự, mỗi lượt 2 gọi
  });
});

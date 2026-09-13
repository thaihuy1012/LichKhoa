import { describe, it, expect, vi, afterEach } from 'vitest';
import { performSyncShared } from '../../src/ui/sync';
import calendarList from '../fixtures/google/calendarList.json';

afterEach(() => {
  vi.unstubAllGlobals();
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

import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchCalendars, fetchEvents, normalize, AuthError } from '../../src/google/calendar';
import type { RawGoogleEvent } from '../../src/google/calendar';
import calendarList from '../fixtures/google/calendarList.json';
import eventsCal1 from '../fixtures/google/events-cal1.json';
import eventsCal2 from '../fixtures/google/events-cal2.json';
import eventsMultiday from '../fixtures/google/events-multiday.json';

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('normalize (thuần)', () => {
  it('all-day → allDay=true đúng ngày', () => {
    const raw: RawGoogleEvent[] = (eventsCal1.items as RawGoogleEvent[]).filter((e) => e.id === 'ev1');
    const result = normalize('cal1', '#4285F4', raw);
    expect(result).toEqual([
      {
        id: 'google-cal1-ev1@2026-01-01',
        sourceId: 'ev1',
        source: 'google',
        title: 'Nghi le',
        date: '2026-01-01',
        allDay: true,
        color: '#4285F4',
      },
    ]);
  });

  it('dateTime offset khác → ngày/giờ địa phương đúng (chạy đúng ở cả 2 TZ do dùng Date thật)', () => {
    const raw: RawGoogleEvent[] = (eventsCal1.items as RawGoogleEvent[]).filter((e) => e.id === 'ev3');
    const result = normalize('cal1', '#4285F4', raw);
    const d = new Date('2026-01-05T14:30:00+07:00');
    const expectedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const expectedTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    expect(result).toEqual([
      {
        id: `google-cal1-ev3@${expectedDate}`,
        sourceId: 'ev3',
        source: 'google',
        title: 'Khach hang',
        date: expectedDate,
        time: expectedTime,
        allDay: false,
        color: '#4285F4',
      },
    ]);
  });

  it('cancelled bị bỏ', () => {
    const result = normalize('cal1', '#4285F4', eventsCal1.items as RawGoogleEvent[]);
    expect(result.find((o) => o.sourceId === 'ev2')).toBeUndefined();
    expect(result.length).toBe(2); // ev1 + ev3, bỏ ev2 (cancelled)
  });

  it('T-3.4 yêu cầu 1: all-day nhiều ngày (end loại trừ) → 1 Occurrence mỗi ngày, id …@<date>', () => {
    const raw: RawGoogleEvent[] = (eventsMultiday.items as RawGoogleEvent[]).filter((e) => e.id === 'ev-multi');
    const result = normalize('cal1', '#4285F4', raw);
    expect(result.map((o) => o.date)).toEqual(['2026-09-14', '2026-09-15', '2026-09-16']);
    expect(result.map((o) => o.id)).toEqual([
      'google-cal1-ev-multi@2026-09-14',
      'google-cal1-ev-multi@2026-09-15',
      'google-cal1-ev-multi@2026-09-16',
    ]);
    expect(result.every((o) => o.allDay && o.sourceId === 'ev-multi')).toBe(true);
  });

  it('T-3.4 yêu cầu 1: all-day thiếu end.date → 1 Occurrence duy nhất', () => {
    const raw: RawGoogleEvent[] = (eventsMultiday.items as RawGoogleEvent[]).filter((e) => e.id === 'ev-oneday');
    const result = normalize('cal1', '#4285F4', raw);
    expect(result).toEqual([
      {
        id: 'google-cal1-ev-oneday@2026-09-20',
        sourceId: 'ev-oneday',
        source: 'google',
        title: 'Mot ngay khong end',
        date: '2026-09-20',
        allDay: true,
        color: '#4285F4',
      },
    ]);
  });

  it('T-3.4 yêu cầu 1: khoảng vượt timeMax bị chặn khi truyền range', () => {
    const raw: RawGoogleEvent[] = (eventsMultiday.items as RawGoogleEvent[]).filter((e) => e.id === 'ev-multi');
    const result = normalize('cal1', '#4285F4', raw, { min: '2026-09-14', max: '2026-09-15' });
    expect(result.map((o) => o.date)).toEqual(['2026-09-14', '2026-09-15']);
  });
});

describe('fetchCalendars', () => {
  it('gọi calendarList với Bearer, trả id/summary/color', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(calendarList));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchCalendars('tok123');
    expect(result).toEqual([
      { id: 'cal1@group.calendar.google.com', summary: 'Cong viec', color: '#4285F4' },
      { id: 'cal2@group.calendar.google.com', summary: 'Ca nhan', color: '#0B8043' },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      expect.objectContaining({ headers: { Authorization: 'Bearer tok123' } })
    );
  });

  it('401 → AuthError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({}, 401))
    );
    await expect(fetchCalendars('bad')).rejects.toBeInstanceOf(AuthError);
  });
});

describe('fetchEvents', () => {
  it('nhiều lịch gộp + sắp xếp theo ngày/giờ', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/calendarList')) return jsonResponse(calendarList);
      if (url.includes(encodeURIComponent('cal1@group.calendar.google.com'))) return jsonResponse(eventsCal1);
      if (url.includes(encodeURIComponent('cal2@group.calendar.google.com'))) return jsonResponse(eventsCal2);
      throw new Error(`URL không mong đợi: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchEvents(
      'tok123',
      ['cal1@group.calendar.google.com', 'cal2@group.calendar.google.com'],
      '2026-01-01',
      '2026-01-31'
    );

    expect(result.map((o) => o.sourceId)).toEqual(['ev1', 'ev4', 'ev3']); // 01/01, 03/01, 05/01 — cancelled đã bỏ
    expect(result.every((o) => o.date >= '2026-01-01' && o.date <= '2026-01-31')).toBe(true);
    expect(result.find((o) => o.sourceId === 'ev4')?.color).toBe('#0B8043');
  });

  it('fetch trả 401 khi lấy sự kiện → AuthError', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/calendarList')) return jsonResponse(calendarList);
      return jsonResponse({}, 401);
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchEvents('bad', ['cal1@group.calendar.google.com'], '2026-01-01', '2026-01-31')).rejects.toBeInstanceOf(
      AuthError
    );
  });
});

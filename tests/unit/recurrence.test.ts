import { describe, it, expect } from 'vitest';
import { expandOccurrences } from '../../src/core/recurrence';
import type { LocalEvent } from '../../src/core/model';

function ev(partial: Partial<LocalEvent> & Pick<LocalEvent, 'id' | 'date' | 'repeat'>): LocalEvent {
  return { title: partial.id, ...partial } as LocalEvent;
}

describe('expandOccurrences', () => {
  it('none: chỉ xuất hiện đúng 1 ngày', () => {
    const e = ev({ id: 'a', date: '2026-03-10', repeat: 'none' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-31');
    expect(occ.map((o) => o.date)).toEqual(['2026-03-10']);
  });

  it('daily: xuất hiện mọi ngày trong khoảng, từ ngày bắt đầu', () => {
    const e = ev({ id: 'a', date: '2026-03-05', repeat: 'daily' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-07');
    expect(occ.map((o) => o.date)).toEqual(['2026-03-05', '2026-03-06', '2026-03-07']);
  });

  it('weekly: đúng thứ trong tuần', () => {
    // 2026-03-02 là Thứ Hai
    const e = ev({ id: 'a', date: '2026-03-02', repeat: 'weekly' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-16');
    expect(occ.map((o) => o.date)).toEqual(['2026-03-02', '2026-03-09', '2026-03-16']);
  });

  it('monthly: ngày 31 bỏ qua tháng thiếu ngày', () => {
    const e = ev({ id: 'a', date: '2026-01-31', repeat: 'monthly' });
    const occ = expandOccurrences([e], '2026-01-01', '2026-04-30');
    // Th2 (28 ngày, 2026 không nhuận) và Th4 (30 ngày) không có ngày 31
    expect(occ.map((o) => o.date)).toEqual(['2026-01-31', '2026-03-31']);
  });

  it('yearly: 29/02 chỉ khớp năm nhuận', () => {
    const e = ev({ id: 'a', date: '2024-02-29', repeat: 'yearly' });
    const occ = expandOccurrences([e], '2024-01-01', '2028-12-31');
    expect(occ.map((o) => o.date)).toEqual(['2024-02-29', '2028-02-29']);
  });

  it('until: dừng lặp sau ngày until', () => {
    const e = ev({ id: 'a', date: '2026-03-01', repeat: 'daily', until: '2026-03-03' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-10');
    expect(occ.map((o) => o.date)).toEqual(['2026-03-01', '2026-03-02', '2026-03-03']);
  });

  it('không xuất hiện trước ngày bắt đầu của event', () => {
    const e = ev({ id: 'a', date: '2026-03-15', repeat: 'daily' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-10');
    expect(occ).toEqual([]);
  });

  it('from > to trả mảng rỗng, không lặp vô hạn', () => {
    const e = ev({ id: 'a', date: '2026-03-01', repeat: 'daily' });
    const occ = expandOccurrences([e], '2026-03-10', '2026-03-01');
    expect(occ).toEqual([]);
  });

  it('id duy nhất theo <eventId>@<date>, sourceId/source/allDay đúng quy ước', () => {
    const e = ev({ id: 'a', date: '2026-03-01', repeat: 'none', time: '09:00', color: '#fff' });
    const occ = expandOccurrences([e], '2026-03-01', '2026-03-01');
    expect(occ).toEqual([
      { id: 'a@2026-03-01', sourceId: 'a', source: 'local', title: 'a', date: '2026-03-01', time: '09:00', allDay: false, color: '#fff' },
    ]);
  });

  it('sắp theo ngày rồi giờ, cả ngày (allDay) đứng trước sự kiện có giờ', () => {
    const e1 = ev({ id: 'late', date: '2026-03-01', repeat: 'none', time: '10:00' });
    const e2 = ev({ id: 'allday', date: '2026-03-01', repeat: 'none' });
    const e3 = ev({ id: 'early', date: '2026-03-01', repeat: 'none', time: '08:00' });
    const occ = expandOccurrences([e1, e2, e3], '2026-03-01', '2026-03-01');
    expect(occ.map((o) => o.sourceId)).toEqual(['allday', 'early', 'late']);
  });
});

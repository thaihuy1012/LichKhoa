import { describe, it, expect } from 'vitest';
import { layoutAgenda } from '../../src/render/layout/agenda';
import { layoutTodo } from '../../src/render/layout/todo';
import { layoutNote } from '../../src/render/layout/note';
import { layoutMonth } from '../../src/render/layout/month';
import { DEVICES } from '../../src/render/devices';
import { defaultDesign } from '../../src/core/model';
import type { RenderData, DesignConfig, DeviceSpec, Occurrence, Todo } from '../../src/core/model';
import type { DrawOp } from '../../src/render/layout/common';

const DEV_1179 = DEVICES.find((d) => d.width === 1179 && d.height === 2556)!;
const DEV_1320 = DEVICES.find((d) => d.width === 1320 && d.height === 2868)!;
const DEV_1284 = DEVICES.find((d) => d.width === 1284 && d.height === 2778)!;

function renderData(over: Partial<RenderData> = {}): RenderData {
  return { today: '2026-02-15', occurrences: [], todos: [], note: '', ...over };
}

function occ(date: string, time: string | undefined, title: string, extra: Partial<Occurrence> = {}): Occurrence {
  return {
    id: `${title}@${date}${time ?? ''}`,
    sourceId: 's1',
    source: 'local',
    title,
    date,
    time,
    allDay: !time,
    ...extra,
  };
}

function assertInSafeArea(ops: ReturnType<typeof layoutMonth>, dev: DeviceSpec) {
  const top = dev.height * dev.safeTop;
  const bottom = dev.height * (1 - dev.safeBottom);
  for (const op of ops) {
    if (op.op === 'rect') {
      expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y + op.h).toBeLessThanOrEqual(bottom + 0.01);
    } else if (op.op === 'dot') {
      expect(op.y - op.r).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y + op.r).toBeLessThanOrEqual(bottom + 0.01);
    } else if (op.op === 'text') {
      expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
      expect(op.y).toBeLessThanOrEqual(bottom + 0.01);
    }
  }
}

function textOf(ops: ReturnType<typeof layoutMonth>): string[] {
  return ops.filter((o) => o.op === 'text').map((o) => (o as { text: string }).text);
}

describe('layoutAgenda', () => {
  it('7 ngày đúng thứ tự thời gian; hour12 sinh AM/PM', () => {
    const design: DesignConfig = { ...defaultDesign(), hour12: true, agendaDays: 7 };
    const d = renderData({
      occurrences: [
        occ('2026-02-16', '09:00', 'Sáng'),
        occ('2026-02-15', '08:00', 'Sớm'),
        occ('2026-02-15', '14:00', 'Trưa'),
      ],
    });
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    const iSom = texts.findIndex((t) => t === 'Sớm');
    const iTrua = texts.findIndex((t) => t === 'Trưa');
    const iSang = texts.findIndex((t) => t === 'Sáng');
    expect(iSom).toBeGreaterThanOrEqual(0);
    expect(iTrua).toBeGreaterThan(iSom);
    expect(iSang).toBeGreaterThan(iTrua);
    expect(texts.some((t) => t.includes('AM') || t.includes('PM'))).toBe(true);
  });

  it('vượt 12 dòng thì cắt và có dòng "+N"', () => {
    const design: DesignConfig = defaultDesign();
    const occs: Occurrence[] = [];
    for (let i = 0; i < 20; i++) occs.push(occ('2026-02-15', `0${(i % 9) + 1}:00`, `Việc ${i}`));
    const d = renderData({ occurrences: occs });
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts.some((t) => /^\+\d+$/.test(t))).toBe(true);
  });

  it('mọi op trong vùng an toàn với 3 position x 2 thiết bị (gồm 1284x2778)', () => {
    const positions: DesignConfig['position'][] = ['top', 'middle', 'bottom'];
    for (const dev of [DEV_1179, DEV_1284]) {
      for (const position of positions) {
        const design: DesignConfig = { ...defaultDesign(), position };
        const d = renderData({ occurrences: [occ('2026-02-16', '09:00', 'X')] });
        assertInSafeArea(layoutAgenda(d, design, dev), dev);
      }
    }
  });

  it('1 sự kiện: hộp ôm nội dung, chiều cao < 30% vùng chính', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({ occurrences: [occ('2026-02-15', '09:00', 'X')] });
    const ops = layoutAgenda(d, design, DEV_1179);
    const rect = ops.find((o) => o.op === 'rect')!;
    const usable = DEV_1179.height * (1 - DEV_1179.safeBottom) - DEV_1179.height * DEV_1179.safeTop;
    expect(rect.op).toBe('rect');
    if (rect.op === 'rect') expect(rect.h).toBeLessThan(usable * 0.3);
  });

  it('không có sự kiện: có op text thông báo', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData();
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts).toContain('Không có sự kiện sắp tới');
  });

  it('cắt 12 dòng: không để tiêu đề ngày mồ côi (không có sự kiện bên dưới)', () => {
    const design: DesignConfig = defaultDesign();
    const occs: Occurrence[] = [
      occ('2026-02-15', '01:00', 'A1'),
      occ('2026-02-15', '02:00', 'A2'),
      occ('2026-02-15', '03:00', 'A3'),
      occ('2026-02-16', '01:00', 'B1'),
      occ('2026-02-16', '02:00', 'B2'),
      occ('2026-02-16', '03:00', 'B3'),
      occ('2026-02-17', '01:00', 'C1'),
      occ('2026-02-17', '02:00', 'C2'),
      occ('2026-02-18', '01:00', 'D1'),
      occ('2026-02-18', '02:00', 'D2'),
    ];
    const d = renderData({ occurrences: occs });
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    const moreIdx = texts.findIndex((t) => /^\+\d+$/.test(t));
    expect(moreIdx).toBeGreaterThan(0);
    const moreCount = Number(texts[moreIdx].slice(1));
    // op ngay trước "+N" không được là tiêu đề ngày (weight 700)
    const textOps = ops.filter((o) => o.op === 'text') as Extract<DrawOp, { op: 'text' }>[];
    const moreOpIdx = textOps.findIndex((o) => o.text === texts[moreIdx]);
    const prevOp = textOps[moreOpIdx - 1];
    expect(prevOp.weight).not.toBe(700);
    // "+N" đếm đúng mọi sự kiện chưa hiện (kể cả ngày D bị bỏ tiêu đề hoàn toàn)
    const headerCount = textOps.filter((o) => o.weight === 700).length;
    const itemTitles = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'D1', 'D2'];
    const shownItems = itemTitles.filter((title) => texts.includes(title)).length;
    expect(shownItems + moreCount).toBe(occs.length);
    expect(headerCount + shownItems + 1).toBeLessThanOrEqual(12);
  });

  it('tiêu đề 200 ký tự: cắt kèm "…" và độ rộng ước lượng <= bề rộng hộp', () => {
    const design: DesignConfig = defaultDesign();
    const longTitle = 'A'.repeat(200);
    const d = renderData({ occurrences: [occ('2026-02-15', '09:00', longTitle)] });
    const ops = layoutAgenda(d, design, DEV_1179);
    const rect = ops.find((o) => o.op === 'rect')!;
    const titleOp = ops.find((o) => o.op === 'text' && (o as { text: string }).text.startsWith('A'))!;
    expect(titleOp.op).toBe('text');
    if (titleOp.op === 'text' && rect.op === 'rect') {
      expect(titleOp.text.endsWith('…')).toBe(true);
      const estWidth = titleOp.text.length * titleOp.size * 0.5;
      const boxRight = rect.x + rect.w;
      expect(titleOp.x + estWidth).toBeLessThanOrEqual(boxRight + 0.5);
    }
  });
});

describe('layoutAgenda âm lịch', () => {
  it('showLunar=true: nhãn ngày kèm ngày âm', () => {
    const design: DesignConfig = { ...defaultDesign(), showLunar: true };
    const d = renderData({ today: '2026-02-17', occurrences: [occ('2026-02-17', '09:00', 'X')] });
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts.some((t) => t.includes('ÂL'))).toBe(true);
  });

  it('showLunar=false: không có ngày âm trong nhãn ngày', () => {
    const design: DesignConfig = { ...defaultDesign(), showLunar: false };
    const d = renderData({ today: '2026-02-17', occurrences: [occ('2026-02-17', '09:00', 'X')] });
    const ops = layoutAgenda(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts.some((t) => t.includes('ÂL'))).toBe(false);
  });
});

describe('layoutTodo', () => {
  function todo(text: string, done = false, order = 0): Todo {
    return { id: text, text, done, order };
  }

  it('vượt 12 mục cắt còn 12 và thêm dòng "+N"', () => {
    const design: DesignConfig = defaultDesign();
    const todos = Array.from({ length: 15 }, (_, i) => todo(`Việc ${i}`, false, i));
    const d = renderData({ todos });
    const ops = layoutTodo(d, design, DEV_1179);
    const texts = textOf(ops);
    const itemLines = texts.filter((t) => t.startsWith('Việc'));
    expect(itemLines.length).toBe(12);
    expect(texts.some((t) => /^\+\d+$/.test(t))).toBe(true);
  });

  it('mọi op trong vùng an toàn với 3 position x 2 thiết bị', () => {
    const positions: DesignConfig['position'][] = ['top', 'middle', 'bottom'];
    for (const dev of [DEV_1179, DEV_1320]) {
      for (const position of positions) {
        const design: DesignConfig = { ...defaultDesign(), position };
        const d = renderData({ todos: [todo('A'), todo('B', true)] });
        assertInSafeArea(layoutTodo(d, design, dev), dev);
      }
    }
  });

  it('1 mục: hộp ôm nội dung, chiều cao < 30% vùng chính', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({ todos: [todo('Việc duy nhất')] });
    const ops = layoutTodo(d, design, DEV_1179);
    const rect = ops.find((o) => o.op === 'rect')!;
    const usable = DEV_1179.height * (1 - DEV_1179.safeBottom) - DEV_1179.height * DEV_1179.safeTop;
    expect(rect.op).toBe('rect');
    if (rect.op === 'rect') expect(rect.h).toBeLessThan(usable * 0.3);
  });

  it('không có việc: có op text thông báo', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData();
    const ops = layoutTodo(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts).toContain('Không có việc cần làm');
  });

  it('to-do 200 ký tự: cắt kèm "…" và độ rộng ước lượng <= bề rộng hộp', () => {
    const design: DesignConfig = defaultDesign();
    const longText = 'B'.repeat(200);
    const d = renderData({ todos: [todo(longText)] });
    const ops = layoutTodo(d, design, DEV_1179);
    const rect = ops.find((o) => o.op === 'rect')!;
    const textOp = ops.find((o) => o.op === 'text' && (o as { text: string }).text.startsWith('B'))!;
    expect(textOp.op).toBe('text');
    if (textOp.op === 'text' && rect.op === 'rect') {
      expect(textOp.text.endsWith('…')).toBe(true);
      const estWidth = textOp.text.length * textOp.size * 0.5;
      const boxRight = rect.x + rect.w;
      expect(textOp.x + estWidth).toBeLessThanOrEqual(boxRight + 0.5);
    }
  });
});

describe('layoutNote', () => {
  it('note dài bọc thành nhiều op text', () => {
    const design: DesignConfig = { ...defaultDesign(), showNote: true };
    const d = renderData({
      note: 'Đây là một ghi chú khá dài để kiểm tra việc bọc dòng tự động hoạt động đúng cách khi văn bản vượt quá bề rộng cho phép của dải ghi chú.',
    });
    const ops = layoutNote(d, design, DEV_1179);
    const texts = ops.filter((o) => o.op === 'text');
    expect(texts.length).toBeGreaterThan(1);
  });

  it('khoảng cách dòng cố định <= 1,6x cỡ chữ; mọi op trong noteArea', () => {
    const design: DesignConfig = { ...defaultDesign(), showNote: true };
    const d = renderData({ note: 'Dòng một\nDòng hai' });
    const ops = layoutNote(d, design, DEV_1179);
    const texts = ops.filter((o) => o.op === 'text') as Extract<DrawOp, { op: 'text' }>[];
    expect(texts.length).toBeGreaterThanOrEqual(2);
    const gap = texts[1].y - texts[0].y;
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThanOrEqual(texts[0].size * 1.6);

    const top = DEV_1179.height * DEV_1179.safeTop;
    const bottom = DEV_1179.height * (1 - DEV_1179.safeBottom);
    for (const op of ops) {
      if (op.op === 'rect') {
        expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
        expect(op.y + op.h).toBeLessThanOrEqual(bottom + 0.01);
      } else if (op.op === 'text') {
        expect(op.y).toBeGreaterThanOrEqual(top - 0.01);
        expect(op.y).toBeLessThanOrEqual(bottom + 0.01);
      }
    }
  });

  it('showNote=false hoặc note rỗng -> không có op', () => {
    const design: DesignConfig = { ...defaultDesign(), showNote: false };
    const d = renderData({ note: 'ghi chú' });
    expect(layoutNote(d, design, DEV_1179)).toEqual([]);

    const design2: DesignConfig = { ...defaultDesign(), showNote: true };
    const d2 = renderData({ note: '' });
    expect(layoutNote(d2, design2, DEV_1179)).toEqual([]);
  });
});

describe('layoutTodo nhãn hạn', () => {
  function todoDue(text: string, due: string | undefined, done = false): Todo {
    return { id: text, text, done, due, order: 0 } as Todo;
  }

  it('due trước hôm nay -> "Quá hạn" tô accentColor', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({ today: '2026-02-15', todos: [todoDue('Việc cũ', '2026-02-10')] });
    const ops = layoutTodo(d, design, DEV_1179);
    const label = ops.find((o) => o.op === 'text' && (o as { text: string }).text === 'Quá hạn') as Extract<DrawOp, { op: 'text' }>;
    expect(label).toBeTruthy();
    expect(label.color).toBe(design.accentColor);
  });

  it('due đúng hôm nay -> "Hôm nay"', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({ today: '2026-02-15', todos: [todoDue('Việc hôm nay', '2026-02-15')] });
    const ops = layoutTodo(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts).toContain('Hôm nay');
  });

  it('due tương lai -> nhãn "d/m"', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({ today: '2026-02-15', todos: [todoDue('Việc mai', '2026-02-20')] });
    const ops = layoutTodo(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts).toContain('20/2');
  });

  it('không có due hoặc đã xong -> không có nhãn hạn', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData({
      today: '2026-02-15',
      todos: [todoDue('Không hạn', undefined), todoDue('Xong rồi', '2026-02-10', true)],
    });
    const ops = layoutTodo(d, design, DEV_1179);
    const texts = textOf(ops);
    expect(texts.includes('Quá hạn')).toBe(false);
  });
});

describe('layoutNote tiêu đề ghi chú ghim', () => {
  it('noteTitle khác rỗng -> op text đậm (weight 700) đứng trước nội dung', () => {
    const design: DesignConfig = { ...defaultDesign(), showNote: true };
    const d = renderData({ note: 'Nội dung ghi chú', noteTitle: 'Tiêu đề' });
    const ops = layoutNote(d, design, DEV_1179) as Extract<DrawOp, { op: 'text' }>[];
    const texts = ops.filter((o) => o.op === 'text') as Extract<DrawOp, { op: 'text' }>[];
    expect(texts[0].text).toBe('Tiêu đề');
    expect(texts[0].weight).toBe(700);
    expect(texts[1].y).toBeGreaterThan(texts[0].y);
  });

  it('note rỗng nhưng có noteTitle -> vẫn vẽ (không trả [])', () => {
    const design: DesignConfig = { ...defaultDesign(), showNote: true };
    const d = renderData({ note: '', noteTitle: 'Chỉ tiêu đề' });
    const ops = layoutNote(d, design, DEV_1179);
    expect(ops.length).toBeGreaterThan(0);
    const texts = textOf(ops);
    expect(texts).toContain('Chỉ tiêu đề');
  });
});

describe('showNote: khối chính và dải ghi chú không chồng nhau', () => {
  function bbox(ops: ReturnType<typeof layoutMonth>): { minY: number; maxY: number } {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const op of ops) {
      if (op.op === 'rect') {
        minY = Math.min(minY, op.y);
        maxY = Math.max(maxY, op.y + op.h);
      } else if (op.op === 'dot') {
        minY = Math.min(minY, op.y - op.r);
        maxY = Math.max(maxY, op.y + op.r);
      } else if (op.op === 'text') {
        minY = Math.min(minY, op.y);
        maxY = Math.max(maxY, op.y);
      }
    }
    return { minY, maxY };
  }

  const layouts: [string, (d: RenderData, c: DesignConfig, dev: DeviceSpec) => ReturnType<typeof layoutMonth>][] = [
    ['month', layoutMonth],
    ['agenda', layoutAgenda],
    ['todo', layoutTodo],
  ];

  for (const [name, layout] of layouts) {
    it(`${name}: bbox khối chính không giao với bbox dải note`, () => {
      const design: DesignConfig = { ...defaultDesign(), showNote: true };
      const d = renderData({
        occurrences: [occ('2026-02-16', '09:00', 'X')],
        todos: [{ id: 't1', text: 'Việc', done: false, order: 0 }],
        note: 'Ghi chú hôm nay cần nhớ vài việc quan trọng.',
      });
      const mainOps = layout(d, design, DEV_1179);
      const noteOps = layoutNote(d, design, DEV_1179);
      const mainBox = bbox(mainOps);
      const noteBox = bbox(noteOps);
      expect(mainBox.maxY).toBeLessThanOrEqual(noteBox.minY + 0.01);
    });
  }
});

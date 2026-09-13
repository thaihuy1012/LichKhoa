import { describe, it, expect } from 'vitest';
import { layoutMonth } from '../../src/render/layout/month';
import { DEVICES, detectDevice, customDevice } from '../../src/render/devices';
import { defaultDesign } from '../../src/core/model';
import type { RenderData, DesignConfig, DeviceSpec, Occurrence } from '../../src/core/model';

const DEV_1179 = DEVICES.find((d) => d.width === 1179 && d.height === 2556)!;
const DEV_1320 = DEVICES.find((d) => d.width === 1320 && d.height === 2868)!;

function renderData(today: string, occurrences: Occurrence[] = []): RenderData {
  return { today, occurrences, todos: [], note: '' };
}

function assertAllOpsInSafeArea(ops: ReturnType<typeof layoutMonth>, dev: DeviceSpec) {
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

describe('layoutMonth', () => {
  it('tháng 2/2026: >= 28 op text ngày; có op tô hôm nay fill === accentColor', () => {
    const design: DesignConfig = { ...defaultDesign(), accentColor: '#ff8800' };
    const d = renderData('2026-02-15');
    const ops = layoutMonth(d, design, DEV_1179);

    const dayTextOps = ops.filter(
      (op) => op.op === 'text' && /^\d{1,2}$/.test(op.text) && Number(op.text) >= 1 && Number(op.text) <= 28
    );
    expect(dayTextOps.length).toBeGreaterThanOrEqual(28);

    const todayOps = ops.filter((op) => (op.op === 'rect' || op.op === 'dot') && op.fill === design.accentColor);
    expect(todayOps.length).toBeGreaterThan(0);
  });

  it('ô hôm nay đọc được khi accentColor === textColor', () => {
    const design: DesignConfig = { ...defaultDesign(), accentColor: '#ffffff', textColor: '#ffffff' };
    const d = renderData('2026-02-15');
    const ops = layoutMonth(d, design, DEV_1179);
    const todayText = ops.find(
      (op) => op.op === 'text' && op.text === '15' && op.weight === 700
    );
    expect(todayText).toBeDefined();
    if (todayText && todayText.op === 'text') {
      expect(todayText.color).not.toBe(design.accentColor);
      expect(todayText.color).toBe(design.bg.color);
    }
  });

  it('ngày có occurrence có op dot', () => {
    const design: DesignConfig = defaultDesign();
    const d = renderData('2026-02-01', [
      { id: 'o1', sourceId: 'e1', source: 'local', title: 'Họp', date: '2026-02-10', allDay: true },
    ]);
    const ops = layoutMonth(d, design, DEV_1179);
    const dots = ops.filter((op) => op.op === 'dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('hôm nay có occurrence: chấm occurrence không lẫn vào vòng tô hôm nay (fill khác accentColor)', () => {
    const design: DesignConfig = { ...defaultDesign(), accentColor: '#ff8800' };
    const d = renderData('2026-02-15', [
      { id: 'o1', sourceId: 'e1', source: 'local', title: 'Họp', date: '2026-02-15', allDay: true },
    ]);
    const ops = layoutMonth(d, design, DEV_1179);
    const todayRing = ops.find((op) => op.op === 'dot' && op.fill === design.accentColor)!;
    const otherDots = ops.filter((op) => op.op === 'dot' && op !== todayRing);
    expect(otherDots.length).toBeGreaterThan(0);
    for (const dot of otherDots) {
      if (dot.op === 'dot') {
        const overlapsRing = todayRing.op === 'dot' && dot.x === todayRing.x && dot.fill === todayRing.fill;
        expect(overlapsRing).toBe(false);
      }
    }
  });

  it('mọi op nằm trong vùng an toàn với 3 position x 2 thiết bị', () => {
    const positions: DesignConfig['position'][] = ['top', 'middle', 'bottom'];
    const devices = [DEV_1179, DEV_1320];
    for (const dev of devices) {
      for (const position of positions) {
        const design: DesignConfig = { ...defaultDesign(), position };
        const d = renderData('2026-02-15', [
          { id: 'o1', sourceId: 'e1', source: 'local', title: 'Họp', date: '2026-02-28', allDay: true },
        ]);
        const ops = layoutMonth(d, design, dev);
        assertAllOpsInSafeArea(ops, dev);
      }
    }
  });
});

describe('detectDevice', () => {
  it('khớp preset đúng kích thước vật lý', () => {
    const dev = detectDevice(393, 852, 3);
    expect(dev.width).toBe(1179);
    expect(dev.height).toBe(2556);
    expect(DEVICES.some((p) => p.id === dev.id)).toBe(true);
  });

  it('không khớp preset nào -> id auto', () => {
    const dev = detectDevice(500, 900, 2);
    expect(dev.id).toBe('auto');
    expect(dev.width).toBe(1000);
    expect(dev.height).toBe(1800);
  });

  it('customDevice trả đúng kích thước', () => {
    const dev = customDevice(1000, 2000);
    expect(dev.width).toBe(1000);
    expect(dev.height).toBe(2000);
    expect(dev.id).toBe('custom');
  });
});

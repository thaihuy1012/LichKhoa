import type { DesignConfig, DeviceSpec, RenderData } from '../../core/model';
import { fontSize, noteArea, wrapText, type DrawOp } from './common';

/** Dải ghi chú, tối đa ~4 dòng, nằm dưới khối chính. Hàm thuần. */
const MAX_LINES = 4;

export function layoutNote(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  if (!c.showNote || !d.note) return [];
  const ops: DrawOp[] = [];
  const area = noteArea(dev, c);
  const contentHeight = area.bottom - area.top;
  const margin = dev.width * 0.05;
  const contentLeft = margin;
  const contentWidth = dev.width - 2 * margin;

  ops.push({
    op: 'rect',
    x: contentLeft - margin * 0.4,
    y: area.top,
    w: contentWidth + margin * 0.8,
    h: contentHeight,
    r: 20,
    fill: '#000000',
    alpha: c.boxAlpha,
  });

  const size = fontSize(dev.width * 0.032, c.scale);
  const lines = wrapText(d.note, contentWidth, size, MAX_LINES);
  const rowH = contentHeight / Math.max(1, lines.length);

  lines.forEach((line, i) => {
    const rowTop = area.top + i * rowH;
    const rowCenterY = rowTop + rowH / 2;
    ops.push({
      op: 'text',
      x: contentLeft,
      y: rowCenterY + size * 0.35,
      text: line,
      size,
      weight: 400,
      color: c.textColor,
      align: 'left',
      font: c.font,
    });
  });

  return ops;
}

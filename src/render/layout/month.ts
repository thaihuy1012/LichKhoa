import type { DesignConfig, DeviceSpec, RenderData } from '../../core/model';
import { monthGrid, parseISODate } from '../../core/calendar';
import { blockStartY, fontSize, safeArea, weekdayLabels, LABELS_VI, type DrawOp } from './common';

export type { DrawOp };

/** Bố cục Tháng: tiêu đề, hàng thứ, lưới 6x7, tô hôm nay, chấm sự kiện. Hàm thuần. */
export function layoutMonth(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  const ops: DrawOp[] = [];
  const { top, bottom } = safeArea(dev);
  const usable = bottom - top;
  const contentHeight = usable * 0.82;
  const contentTop = blockStartY(dev, c.position, contentHeight);

  const margin = dev.width * 0.05;
  const gridLeft = margin;
  const gridWidth = dev.width - 2 * margin;
  const colW = gridWidth / 7;

  const titleH = contentHeight * 0.1;
  const weekdayH = contentHeight * 0.06;
  const gridH = contentHeight - titleH - weekdayH;
  const rowH = gridH / 6;

  const { y: year, m0 } = parseISODate(d.today);

  // Hộp nền mờ cho cả khối
  ops.push({
    op: 'rect',
    x: gridLeft - margin * 0.4,
    y: contentTop,
    w: gridWidth + margin * 0.8,
    h: contentHeight,
    r: 24,
    fill: '#000000',
    alpha: c.boxAlpha,
  });

  // Tiêu đề tháng (y theo baseline chữ: tâm dải + 0.35*size để căn giữa theo mắt)
  const titleSize = fontSize(dev.width * 0.045, c.scale);
  const titleCenterY = contentTop + titleH / 2;
  ops.push({
    op: 'text',
    x: dev.width / 2,
    y: titleCenterY + titleSize * 0.35,
    text: `${LABELS_VI.months[m0]} ${year}`,
    size: titleSize,
    weight: 700,
    color: c.textColor,
    align: 'center',
    font: c.font,
  });

  // Hàng thứ
  const weekdaySize = fontSize(dev.width * 0.028, c.scale);
  const labels = weekdayLabels(c.weekStart);
  const weekdayCenterY = contentTop + titleH + weekdayH / 2;
  const weekdayY = weekdayCenterY + weekdaySize * 0.35;
  for (let col = 0; col < 7; col++) {
    ops.push({
      op: 'text',
      x: gridLeft + col * colW + colW / 2,
      y: weekdayY,
      text: labels[col],
      size: weekdaySize,
      weight: 600,
      color: c.textColor,
      align: 'center',
      font: c.font,
    });
  }

  const occDates = new Set(d.occurrences.map((o) => o.date));
  const todayTextColor = c.accentColor.toLowerCase() === c.textColor.toLowerCase() ? c.bg.color : c.textColor;

  const gridTop = contentTop + titleH + weekdayH;
  const grid = monthGrid(year, m0, c.weekStart);
  const daySize = fontSize(Math.min(colW, rowH) * 0.36, c.scale);
  const todayRadius = Math.min(colW, rowH) * 0.35;
  const occRadius = Math.min(colW, rowH) * 0.08;

  for (let row = 0; row < grid.length; row++) {
    const rowTop = gridTop + row * rowH;
    const rowCenterY = rowTop + rowH / 2;
    for (let col = 0; col < 7; col++) {
      const date = grid[row][col];
      if (!date) continue;
      const { d: dayNum } = parseISODate(date);
      const cellCenterX = gridLeft + col * colW + colW / 2;
      const isToday = date === d.today;

      if (isToday) {
        ops.push({ op: 'dot', x: cellCenterX, y: rowCenterY, r: todayRadius, fill: c.accentColor });
      }

      ops.push({
        op: 'text',
        x: cellCenterX,
        y: rowCenterY + daySize * 0.35,
        text: `${dayNum}`,
        size: daySize,
        weight: isToday ? 700 : 400,
        color: isToday ? todayTextColor : c.textColor,
        align: 'center',
        font: c.font,
      });

      if (occDates.has(date)) {
        ops.push({
          op: 'dot',
          x: cellCenterX,
          y: rowCenterY + rowH * 0.3,
          r: occRadius,
          // Trên ô hôm nay nền đã tô accent: dùng màu tương phản để chấm không lẫn vào vòng tô.
          fill: isToday ? todayTextColor : c.accentColor,
        });
      }
    }
  }

  return ops;
}

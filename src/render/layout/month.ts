import type { DesignConfig, DeviceSpec, ISODate, Occurrence, RenderData, Todo } from '../../core/model';
import { monthGrid, parseISODate } from '../../core/calendar';
import { groupAgenda } from '../../core/calendar';
import { t } from '../../core/i18n';
import {
  blockStartY,
  dayLabel,
  fmtTime,
  fontSize,
  mainArea,
  truncate,
  todoDueLabel,
  weekdayLabels,
  lunarCellLabel,
  lunarTodayLine,
  type DrawOp,
} from './common';

export type { DrawOp };

/** Tỉ lệ chiều cao lưới Tháng trong khối nội dung khi `monthList` bật (D-018/T-4.8). */
const GRID_RATIO = 0.62;

/** Vẽ tiêu đề tháng, dòng âm lịch, hàng thứ, lưới 6x7 (tô hôm nay, chấm sự kiện) vào `ops`. Hàm thuần, không vẽ hộp nền. */
function drawGrid(
  ops: DrawOp[],
  d: RenderData,
  c: DesignConfig,
  dev: DeviceSpec,
  contentTop: number,
  contentHeight: number,
  gridLeft: number,
  colW: number
): void {
  const titleH = contentHeight * 0.1;
  const lunarLineH = c.showLunar ? contentHeight * 0.045 : 0;
  const weekdayH = contentHeight * 0.06;
  const gridH = contentHeight - titleH - lunarLineH - weekdayH;
  const rowH = gridH / 6;

  const { y: year, m0 } = parseISODate(d.today);

  // Tiêu đề tháng (y theo baseline chữ: tâm dải + 0.35*size để căn giữa theo mắt)
  const titleSize = fontSize(dev.width * 0.045, c.scale);
  const titleCenterY = contentTop + titleH / 2;
  ops.push({
    op: 'text',
    x: dev.width / 2,
    y: titleCenterY + titleSize * 0.35,
    text: `${t(`month.${m0}`, c.lang)} ${year}`,
    size: titleSize,
    weight: 700,
    color: c.textColor,
    align: 'center',
    font: c.font,
  });

  // Dòng âm lịch hôm nay, dưới tiêu đề tháng
  if (c.showLunar) {
    const lunarSize = fontSize(dev.width * 0.026, c.scale);
    const lunarCenterY = contentTop + titleH + lunarLineH / 2;
    ops.push({
      op: 'text',
      x: dev.width / 2,
      y: lunarCenterY + lunarSize * 0.35,
      text: lunarTodayLine(d.today, c.lang),
      size: lunarSize,
      weight: 400,
      color: c.textColor,
      align: 'center',
      font: c.font,
    });
  }

  // Hàng thứ
  const weekdaySize = fontSize(dev.width * 0.028, c.scale);
  const labels = weekdayLabels(c.weekStart, c.lang);
  const weekdayCenterY = contentTop + titleH + lunarLineH + weekdayH / 2;
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

  const gridTop = contentTop + titleH + lunarLineH + weekdayH;
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

      const dayColor = isToday ? todayTextColor : c.textColor;
      const dayY = c.showLunar ? rowTop + rowH * 0.42 : rowCenterY + daySize * 0.35;
      const lunarCellSize = daySize * 0.55;
      const lunarY = rowTop + rowH * 0.68;

      let ringCenterY = rowCenterY;
      let ringRadius = todayRadius;
      if (isToday) {
        if (c.showLunar) {
          // Dấu hôm nay phải bao trọn cả số dương lẫn số âm (bbox ước lượng: y-size*0.75 .. y+size*0.25).
          const pad = Math.min(colW, rowH) * 0.04;
          const ringTop = dayY - daySize * 0.75 - pad;
          const ringBottom = lunarY + lunarCellSize * 0.25 + pad;
          ringCenterY = (ringTop + ringBottom) / 2;
          const neededRadius = (ringBottom - ringTop) / 2;
          ringRadius = Math.max(todayRadius, neededRadius);
        }
        ops.push({ op: 'dot', x: cellCenterX, y: ringCenterY, r: ringRadius, fill: c.accentColor });
      }

      ops.push({
        op: 'text',
        x: cellCenterX,
        y: dayY,
        text: `${dayNum}`,
        size: daySize,
        weight: isToday ? 700 : 400,
        color: dayColor,
        align: 'center',
        font: c.font,
      });

      if (c.showLunar) {
        ops.push({
          op: 'text',
          x: cellCenterX,
          y: lunarY,
          text: lunarCellLabel(date),
          size: lunarCellSize,
          weight: 400,
          color: dayColor,
          align: 'center',
          font: c.font,
        });
      }

      if (occDates.has(date)) {
        let dotX: number;
        let dotY: number;
        if (isToday) {
          // Chấm sự kiện của ô hôm nay phải nằm HẲN ngoài vòng tô (đủ khoảng cách + occRadius),
          // để luôn tương phản với nền (fill = accentColor) mà không lẫn vào vòng hay chữ.
          const gap = occRadius * 0.6;
          dotX = cellCenterX + colW * 0.32;
          dotY = ringCenterY - ringRadius - occRadius - gap;
        } else if (c.showLunar) {
          // Khi có ngày âm dưới ô, dời chấm sự kiện lên góc trên-phải để không đè lên chữ.
          dotX = cellCenterX + colW * 0.32;
          dotY = rowTop + rowH * 0.16;
        } else {
          dotX = cellCenterX;
          dotY = rowCenterY + rowH * 0.3;
        }
        ops.push({ op: 'dot', x: dotX, y: dotY, r: occRadius, fill: c.accentColor });
      }
    }
  }
}

type ListRow =
  | { kind: 'event'; date: ISODate; occ: Occurrence }
  | { kind: 'todo'; todo: Todo }
  | { kind: 'moreEvents'; count: number }
  | { kind: 'moreTodos'; count: number }
  | { kind: 'empty' };

/** Phân bổ `total` mục vào `budget` dòng, dành 1 dòng cho "+N" nếu không đủ chỗ. */
function allocate(total: number, budget: number): { shown: number; more: number } {
  if (budget <= 0) return { shown: 0, more: 0 };
  if (total <= budget) return { shown: total, more: 0 };
  const shown = Math.max(0, budget - 1);
  return { shown, more: total - shown };
}

/** Xây danh sách sự kiện (từ hôm nay, `agendaDays` ngày, gồm Google) + to-do chưa xong, cắt theo `maxLines`. */
function buildListRows(d: RenderData, c: DesignConfig, maxLines: number): ListRow[] {
  const groups = groupAgenda(d.occurrences, d.today, c.agendaDays);
  const events: { date: ISODate; occ: Occurrence }[] = [];
  for (const g of groups) for (const occ of g.items) events.push({ date: g.date, occ });
  const todos = d.todos.filter((t) => !t.done);

  if (events.length === 0 && todos.length === 0) return [{ kind: 'empty' }];

  const L = Math.max(1, maxLines);
  let eventBudget = Math.ceil(L / 2);
  let todoBudget = L - eventBudget;

  let evAlloc = allocate(events.length, eventBudget);
  let evUsedLines = evAlloc.shown + (evAlloc.more > 0 ? 1 : 0);
  let unusedFromEvents = eventBudget - evUsedLines;
  if (unusedFromEvents > 0) todoBudget += unusedFromEvents;

  const toAlloc = allocate(todos.length, todoBudget);
  const toUsedLines = toAlloc.shown + (toAlloc.more > 0 ? 1 : 0);
  const unusedFromTodos = todoBudget - toUsedLines;
  if (unusedFromTodos > 0) {
    eventBudget += unusedFromTodos;
    evAlloc = allocate(events.length, eventBudget);
  }

  const rows: ListRow[] = [];
  for (let i = 0; i < evAlloc.shown; i++) rows.push({ kind: 'event', date: events[i].date, occ: events[i].occ });
  if (evAlloc.more > 0) rows.push({ kind: 'moreEvents', count: evAlloc.more });
  for (let i = 0; i < toAlloc.shown; i++) rows.push({ kind: 'todo', todo: todos[i] });
  if (toAlloc.more > 0) rows.push({ kind: 'moreTodos', count: toAlloc.more });

  return rows.length > 0 ? rows : [{ kind: 'empty' }];
}

function drawList(
  ops: DrawOp[],
  d: RenderData,
  c: DesignConfig,
  rows: ListRow[],
  listTop: number,
  contentLeft: number,
  contentWidth: number,
  lineSize: number,
  lineH: number
): void {
  let y = listTop;
  for (const row of rows) {
    const rowCenterY = y + lineH / 2;

    if (row.kind === 'empty') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + lineSize * 0.35,
        text: t('agenda.empty', c.lang),
        size: lineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else if (row.kind === 'moreEvents') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + lineSize * 0.35,
        text: t('month.moreEvents', c.lang, { n: row.count }),
        size: lineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else if (row.kind === 'moreTodos') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + lineSize * 0.35,
        text: t('month.moreTodos', c.lang, { n: row.count }),
        size: lineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else if (row.kind === 'event') {
      const occ = row.occ;
      const dotColor = occ.color ?? c.accentColor;
      const dotX = contentLeft + lineSize * 0.3;
      ops.push({ op: 'dot', x: dotX, y: rowCenterY, r: Math.max(2, lineSize * 0.18), fill: dotColor });

      const dateLabel = dayLabel(row.date, d.today, c.lang, false);
      const timeLabel = occ.allDay ? t('events.allDay', c.lang) : fmtTime(occ.time, c.hour12);
      const prefix = timeLabel ? `${dateLabel} · ${timeLabel}` : dateLabel;
      const prefixWidth = prefix.length * lineSize * 0.5 + lineSize * 0.6;
      ops.push({
        op: 'text',
        x: contentLeft + lineSize * 1.2,
        y: rowCenterY + lineSize * 0.35,
        text: prefix,
        size: lineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
      const titleLeft = contentLeft + lineSize * 1.2 + prefixWidth;
      const titleAvailWidth = Math.max(1, contentLeft + contentWidth - titleLeft);
      ops.push({
        op: 'text',
        x: titleLeft,
        y: rowCenterY + lineSize * 0.35,
        text: truncate(occ.title, titleAvailWidth, lineSize),
        size: lineSize,
        weight: 600,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else {
      const todo = row.todo;
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + lineSize * 0.35,
        text: '☐',
        size: lineSize * 1.1,
        weight: 600,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
      const textLeft = contentLeft + lineSize * 1.4;
      let availWidth = Math.max(1, contentLeft + contentWidth - textLeft);

      const due = todo.due ? todoDueLabel(todo.due, d.today, c.lang, todo.dueTime, c.hour12) : null;
      if (due) {
        const labelSize = lineSize * 0.85;
        const labelWidth = due.text.length * labelSize * 0.5 + lineSize * 0.6;
        availWidth = Math.max(1, availWidth - labelWidth);
        ops.push({
          op: 'text',
          x: contentLeft + contentWidth,
          y: rowCenterY + lineSize * 0.35,
          text: due.text,
          size: labelSize,
          weight: due.overdue ? 700 : 600,
          color: due.overdue ? c.accentColor : c.textColor,
          align: 'right',
          font: c.font,
        });
      }

      ops.push({
        op: 'text',
        x: textLeft,
        y: rowCenterY + lineSize * 0.35,
        text: truncate(todo.text, availWidth, lineSize),
        size: lineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    }

    y += lineH;
  }
}

/** Bố cục Tháng: tiêu đề, hàng thứ, lưới 6x7, tô hôm nay, chấm sự kiện; nếu `monthList` bật,
 * lưới thu lại còn ~`GRID_RATIO` chiều cao khối, phần còn lại là danh sách sự kiện + to-do (D-018/T-4.8). Hàm thuần. */
export function layoutMonth(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  const ops: DrawOp[] = [];
  const area = mainArea(dev, c);
  const usable = area.bottom - area.top;

  const margin = dev.width * 0.05;
  const gridLeft = margin;
  const gridWidth = dev.width - 2 * margin;
  const colW = gridWidth / 7;

  if (!c.monthList) {
    const contentHeight = usable * 0.82;
    const contentTop = blockStartY(area, c.position, contentHeight);

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

    drawGrid(ops, d, c, dev, contentTop, contentHeight, gridLeft, colW);
    return ops;
  }

  const gridContentHeight = usable * GRID_RATIO;
  const listMaxH = usable - gridContentHeight;

  const lineSize = fontSize(dev.width * 0.032, c.scale);
  const lineH = lineSize * 1.6;
  const maxLines = Math.max(1, Math.floor(listMaxH / lineH));

  const rows = buildListRows(d, c, maxLines);
  const listHeight = Math.min(listMaxH, rows.length * lineH);

  const contentHeight = gridContentHeight + listHeight;
  const contentTop = blockStartY(area, c.position, contentHeight);

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

  drawGrid(ops, d, c, dev, contentTop, gridContentHeight, gridLeft, colW);
  drawList(ops, d, c, rows, contentTop + gridContentHeight, gridLeft, gridWidth, lineSize, lineH);

  return ops;
}

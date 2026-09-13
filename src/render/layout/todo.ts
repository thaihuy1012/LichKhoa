import type { DesignConfig, DeviceSpec, RenderData, Todo } from '../../core/model';
import { t } from '../../core/i18n';
import { blockStartY, fontSize, mainArea, truncate, todoDueLabel, type DrawOp } from './common';

/** To-do tối đa 12 dòng (SPEC mục 9), vượt quá gộp thành dòng "+N". */
const MAX_LINES = 12;

type Row = { kind: 'item'; todo: Todo } | { kind: 'empty' } | { kind: 'more'; count: number };

/** Bố cục To-do: danh sách với ký hiệu tick, cắt 12 dòng + "+N". Hộp ôm nội dung. Hàm thuần. */
export function layoutTodo(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  const ops: DrawOp[] = [];
  const area = mainArea(dev, c);
  const usable = area.bottom - area.top;

  const margin = dev.width * 0.05;
  const contentLeft = margin;
  const contentWidth = dev.width - 2 * margin;

  const visible = d.todos.length > 0 ? d.todos.slice(0, MAX_LINES) : [];
  const hidden = d.todos.length - visible.length;
  const itemRows: Row[] = visible.length > 0 ? visible.map((todo) => ({ kind: 'item', todo }) as Row) : [{ kind: 'empty' }];
  const rows: Row[] = hidden > 0 ? [...itemRows, { kind: 'more', count: hidden }] : itemRows;

  const padding = fontSize(dev.width * 0.02, c.scale);
  const lineSize = fontSize(dev.width * 0.032, c.scale);
  const itemH = lineSize * 1.7;

  const unscaledBody = rows.length * itemH;
  const unscaledBoxHeight = unscaledBody + padding * 2;
  const scale = unscaledBoxHeight > usable ? usable / unscaledBoxHeight : 1;

  const boxHeight = unscaledBoxHeight * scale;
  const sPadding = padding * scale;
  const sLineSize = lineSize * scale;
  const sItemH = itemH * scale;

  const contentTop = blockStartY(area, c.position, boxHeight);

  ops.push({
    op: 'rect',
    x: contentLeft - margin * 0.4,
    y: contentTop,
    w: contentWidth + margin * 0.8,
    h: boxHeight,
    r: 24,
    fill: '#000000',
    alpha: c.boxAlpha,
  });

  let y = contentTop + sPadding;
  for (const row of rows) {
    const rowCenterY = y + sItemH / 2;

    if (row.kind === 'empty') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + sLineSize * 0.35,
        text: t('todo.empty', c.lang),
        size: sLineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else if (row.kind === 'more') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + sLineSize * 0.35,
        text: `+${row.count}`,
        size: sLineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else {
      const todo = row.todo;
      const mark = todo.done ? '☑' : '☐';
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + sLineSize * 0.35,
        text: mark,
        size: sLineSize * 1.1,
        weight: 600,
        color: todo.done ? c.accentColor : c.textColor,
        align: 'left',
        font: c.font,
      });
      const textLeft = contentLeft + sLineSize * 1.4;
      let availWidth = Math.max(1, contentLeft + contentWidth - textLeft);

      const due = !todo.done && todo.due ? todoDueLabel(todo.due, d.today, c.lang) : null;
      if (due) {
        const labelSize = sLineSize * 0.85;
        const labelWidth = due.text.length * labelSize * 0.5 + sLineSize * 0.6;
        availWidth = Math.max(1, availWidth - labelWidth);
        ops.push({
          op: 'text',
          x: contentLeft + contentWidth,
          y: rowCenterY + sLineSize * 0.35,
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
        y: rowCenterY + sLineSize * 0.35,
        text: truncate(todo.text, availWidth, sLineSize),
        size: sLineSize,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    }

    y += sItemH;
  }

  return ops;
}

import type { DesignConfig, DeviceSpec, RenderData, Occurrence, ISODate } from '../../core/model';
import { groupAgenda } from '../../core/calendar';
import { t } from '../../core/i18n';
import { blockStartY, dayLabel, fmtTime, fontSize, mainArea, truncate, type DrawOp } from './common';

/** Agenda tối đa 12 dòng (SPEC mục 9), vượt quá gộp thành dòng "+N". */
const MAX_LINES = 12;

type Row = { kind: 'header'; date: ISODate } | { kind: 'item'; occ: Occurrence } | { kind: 'empty' } | { kind: 'more'; count: number };

/** Bố cục Agenda: nhóm theo ngày, giờ theo hour12, cắt 12 dòng + "+N". Hộp ôm nội dung. Hàm thuần. */
export function layoutAgenda(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  const ops: DrawOp[] = [];
  const area = mainArea(dev, c);
  const usable = area.bottom - area.top;

  const margin = dev.width * 0.05;
  const contentLeft = margin;
  const contentWidth = dev.width - 2 * margin;

  const groups = groupAgenda(d.occurrences, d.today, c.agendaDays);
  const built: Row[] = [];
  for (const g of groups) {
    built.push({ kind: 'header', date: g.date });
    for (const occ of g.items) built.push({ kind: 'item', occ });
  }
  const visible = built.length > 0 ? built.slice(0, MAX_LINES) : [{ kind: 'empty' } as Row];
  const hidden = built.length - visible.length;
  const rows: Row[] = hidden > 0 ? [...visible, { kind: 'more', count: hidden }] : visible;

  const padding = fontSize(dev.width * 0.02, c.scale);
  const labelSize = fontSize(dev.width * 0.03, c.scale);
  const lineSize = fontSize(dev.width * 0.032, c.scale);
  const headerH = labelSize * 1.9;
  const itemH = lineSize * 1.7;
  const rowH = (r: Row) => (r.kind === 'header' ? headerH : itemH);

  const unscaledBody = rows.reduce((sum, r) => sum + rowH(r), 0);
  const unscaledBoxHeight = unscaledBody + padding * 2;
  const scale = unscaledBoxHeight > usable ? usable / unscaledBoxHeight : 1;

  const boxHeight = unscaledBoxHeight * scale;
  const sPadding = padding * scale;
  const sLabelSize = labelSize * scale;
  const sLineSize = lineSize * scale;

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

  const timeW = contentWidth * 0.22;
  let y = contentTop + sPadding;

  for (const row of rows) {
    const h = rowH(row) * scale;
    const rowCenterY = y + h / 2;

    if (row.kind === 'header') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + sLabelSize * 0.35,
        text: dayLabel(row.date, d.today, c.lang, c.showLunar),
        size: sLabelSize,
        weight: 700,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else if (row.kind === 'empty') {
      ops.push({
        op: 'text',
        x: contentLeft,
        y: rowCenterY + sLineSize * 0.35,
        text: t('agenda.empty', c.lang),
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
      const occ = row.occ;
      const dotColor = occ.color ?? c.accentColor;
      const dotX = contentLeft + sLineSize * 0.3;
      ops.push({ op: 'dot', x: dotX, y: rowCenterY, r: Math.max(2, sLineSize * 0.18), fill: dotColor });

      const timeLabel = occ.allDay ? t('events.allDay', c.lang) : fmtTime(occ.time, c.hour12);
      const textLeft = contentLeft + sLineSize * 1.2;
      if (timeLabel) {
        ops.push({
          op: 'text',
          x: textLeft,
          y: rowCenterY + sLineSize * 0.35,
          text: timeLabel,
          size: sLineSize,
          weight: 400,
          color: c.textColor,
          align: 'left',
          font: c.font,
        });
      }
      const titleLeft = textLeft + timeW;
      const titleAvailWidth = Math.max(1, contentLeft + contentWidth - titleLeft);
      ops.push({
        op: 'text',
        x: titleLeft,
        y: rowCenterY + sLineSize * 0.35,
        text: truncate(occ.title, titleAvailWidth, sLineSize),
        size: sLineSize,
        weight: 600,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    }

    y += h;
  }

  return ops;
}

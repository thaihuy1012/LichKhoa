import type { DesignConfig, DeviceSpec, ISODate, Occurrence, RenderData, Todo } from '../../core/model';
import { t } from '../../core/i18n';
import {
  blockStartY,
  fmtTime,
  fontSize,
  lunarCellLabel,
  mainArea,
  pastel,
  todoDueLabel,
  truncate,
  truncateByFactor,
  weekDates,
  weekdayLabels,
  type DrawOp,
} from './common';

const TODO_FILL = '#fde68a';
const TODO_TEXT = '#1c1c1e';
const OVERDUE_CHIP_COLOR = '#b42318';
const MAX_CHIPS = 4; // 3 chip mục + 1 chip "+N"

type ChipItem =
  | { kind: 'event'; occ: Occurrence }
  | { kind: 'todo'; todo: Todo; overdue: boolean };

type TodayItem = ChipItem;

/** Ước lượng độ rộng chữ theo font: mono rộng hơn sans/serif (không lạc quan hơn thực tế để chữ không tràn chip). */
function charW(font: DesignConfig['font']): number {
  return font === 'mono' ? 0.62 : 0.55;
}

/** Nhãn giờ hiển thị: "HH:mm - HH:mm"; 12h chỉ bỏ hậu tố AM/PM ở giờ bắt đầu khi cùng buổi với giờ kết
 * thúc (khác buổi, vd vắt qua trưa, giữ đủ 2 hậu tố như Inks); không vừa `fitWidth` → thử "HH:mm-HH:mm"
 * (gạch nối liền); vẫn không vừa → chỉ giờ bắt đầu; không `endTime` → giờ bắt đầu; cả ngày → nhãn "Cả ngày". */
function chipTimeText(
  occ: Occurrence,
  hour12: boolean,
  lang: 'vi' | 'en',
  fitWidth?: number,
  size?: number,
  font: DesignConfig['font'] = 'sans'
): string {
  if (occ.allDay) return t('events.allDay', lang);
  if (!occ.time) return '';
  const startOnly = fmtTime(occ.time, hour12);
  if (!occ.endTime) return startOnly;
  const end = fmtTime(occ.endTime, hour12);
  let start = startOnly;
  if (hour12) {
    const startSuffix = startOnly.match(/ (AM|PM)$/)?.[1];
    const endSuffix = end.match(/ (AM|PM)$/)?.[1];
    start = startSuffix === endSuffix ? startOnly.replace(/ (AM|PM)$/, '') : startOnly;
  }
  const spaced = `${start} - ${end}`;
  if (fitWidth === undefined || size === undefined) return spaced;
  const fits = (text: string) => text.length * size * charW(font) <= fitWidth;
  if (fits(spaced)) return spaced;
  const tight = `${start}-${end}`;
  if (fits(tight)) return tight;
  return startOnly;
}

/** Mục mỗi ngày: sự kiện cả ngày → sự kiện có giờ (thứ tự occurrences) → to-do due===ngày (chưa xong);
 * cột hôm nay thêm to-do quá hạn (due < today) trước to-do đúng hạn. */
function dayItems(d: RenderData, date: ISODate, isToday: boolean): ChipItem[] {
  const occToday = d.occurrences.filter((o) => o.date === date);
  const allDay = occToday.filter((o) => o.allDay).map((occ) => ({ kind: 'event', occ }) as ChipItem);
  const timed = occToday.filter((o) => !o.allDay).map((occ) => ({ kind: 'event', occ }) as ChipItem);

  const items: ChipItem[] = [...allDay, ...timed];

  if (isToday) {
    const overdue = d.todos.filter((td) => !td.done && td.due && td.due < date);
    for (const todo of overdue) items.push({ kind: 'todo', todo, overdue: true });
  }
  const dueToday = d.todos.filter((td) => !td.done && td.due === date);
  for (const todo of dueToday) items.push({ kind: 'todo', todo, overdue: false });

  return items;
}

/** Bố cục Tuần giống app Inks: dải 7 ngày với chip sự kiện/to-do + danh sách chi tiết hôm nay. Hàm thuần. */
export function layoutWeek(d: RenderData, c: DesignConfig, dev: DeviceSpec): DrawOp[] {
  const ops: DrawOp[] = [];
  const area = mainArea(dev, c);
  const usable = area.bottom - area.top;

  const margin = dev.width * 0.05;
  const gridLeft = margin;
  const gridWidth = dev.width - 2 * margin;
  const gap = gridWidth * 0.008;
  const colW = (gridWidth - gap * 6) / 7;

  const dates = weekDates(d.today, c.weekStart);
  const labels = weekdayLabels(c.weekStart, c.lang);
  const items = dates.map((date) => dayItems(d, date, date === d.today));

  // Header do dải (thứ + số ngày + âm lịch)
  const weekdaySize = fontSize(dev.width * 0.024, c.scale);
  const dayNumSize = fontSize(dev.width * 0.036, c.scale);
  const lunarSize = dayNumSize * 0.45;
  const headerPad = fontSize(dev.width * 0.012, c.scale);
  const weekdayLineH = weekdaySize * 1.3;
  const dayNumLineH = dayNumSize * 1.15;
  const lunarLineH = c.showLunar ? lunarSize * 1.35 : 0;
  const headerH = headerPad + weekdayLineH + dayNumLineH + lunarLineH + headerPad * 0.6;

  // Chip: dòng giờ nhỏ hơn dòng tên (~0.85x, tối thiểu 20px ở 1284) để khoảng giờ đủ chỗ hiện đầy đủ.
  const chipTextSize = fontSize(dev.width * 0.0187, c.scale);
  const chipTimeSize = fontSize(dev.width * 0.0159, c.scale);
  const chipLine1H = Math.max(chipTimeSize, chipTextSize) * 1.2;
  const chipLine2H = chipTextSize * 1.05;
  const chipPad = chipTextSize * 0.22;
  let chipH = chipPad * 2 + chipLine1H + chipLine2H;
  const chipGap = chipH * 0.12;

  let maxSlots = Math.max(1, Math.min(MAX_CHIPS, Math.max(...items.map((it) => it.length))));
  let stripH = headerH + maxSlots * chipH + Math.max(0, maxSlots - 1) * chipGap;

  // Tràn: giảm số slot chip tới khi dải vừa vùng an toàn (giữ tối thiểu 1 slot).
  while (stripH > usable && maxSlots > 1) {
    maxSlots -= 1;
    stripH = headerH + maxSlots * chipH + Math.max(0, maxSlots - 1) * chipGap;
  }
  if (stripH > usable) {
    // vẫn tràn (thiết bị cực nhỏ): co đều chip cho vừa dải
    const scale = usable / stripH;
    chipH *= scale;
    stripH = usable;
  }

  // Danh sách hôm nay
  const nameSize = fontSize(dev.width * 0.0312, c.scale);
  const subSize = nameSize * 0.58;
  const listGap = fontSize(dev.width * 0.025, c.scale);
  const itemInnerGap = nameSize * 0.12;
  const itemPad = nameSize * 0.22;
  const itemH = itemPad * 2 + nameSize * 1.05 + itemInnerGap + subSize * 1.2;
  const moreLineH = subSize * 1.7;

  const listAvail = Math.max(0, usable - stripH - listGap);
  const todayIdx = dates.indexOf(d.today);
  const todayList: TodayItem[] = todayIdx >= 0 ? items[todayIdx] : [];

  let shownCount = 0;
  let moreCount = 0;
  if (todayList.length > 0) {
    const maxByItems = Math.floor(listAvail / itemH);
    if (maxByItems >= todayList.length) {
      shownCount = todayList.length;
    } else if (maxByItems <= 0) {
      shownCount = 0;
      moreCount = Math.floor(listAvail / moreLineH) > 0 ? todayList.length : 0;
    } else {
      // Chừa 1 dòng cho "+N" nếu còn dư
      const withMoreLineAvail = listAvail - moreLineH;
      const maxWithMore = Math.max(0, Math.floor(withMoreLineAvail / itemH));
      shownCount = Math.min(maxWithMore, todayList.length - 1);
      moreCount = todayList.length - shownCount;
    }
  }
  const emptyRowFits = todayList.length === 0 && listAvail >= moreLineH;
  const listRows = todayList.length === 0 ? (emptyRowFits ? 1 : 0) : shownCount + (moreCount > 0 ? 1 : 0);
  const listHeight = todayList.length === 0 ? (emptyRowFits ? moreLineH : 0) : shownCount * itemH + (moreCount > 0 ? moreLineH : 0);
  const hasList = listRows > 0 && listHeight <= listAvail + 0.01;

  const contentHeight = stripH + (hasList ? listGap + listHeight : 0);
  const contentTop = blockStartY(area, c.position, contentHeight);

  if (c.boxAlpha > 0) {
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
  }

  // Tô cột hôm nay: từ đỉnh đầu cột tới đáy dải chip.
  if (todayIdx >= 0) {
    const colX = gridLeft + todayIdx * (colW + gap);
    ops.push({
      op: 'rect',
      x: colX,
      y: contentTop,
      w: colW,
      h: stripH,
      r: 16,
      fill: c.accentColor,
      alpha: 0.25,
    });
  }

  for (let i = 0; i < 7; i++) {
    const date = dates[i];
    const isToday = date === d.today;
    const colX = gridLeft + i * (colW + gap);
    const colCenterX = colX + colW / 2;
    const dayNum = Number(date.split('-')[2]);

    let y = contentTop + headerPad;
    ops.push({
      op: 'text',
      x: colCenterX,
      y: y + weekdayLineH * 0.75,
      text: labels[i],
      size: weekdaySize,
      weight: isToday ? 700 : 400,
      color: c.textColor,
      align: 'center',
      font: c.font,
    });
    y += weekdayLineH;
    ops.push({
      op: 'text',
      x: colCenterX,
      y: y + dayNumLineH * 0.75,
      text: `${dayNum}`,
      size: dayNumSize,
      weight: isToday ? 700 : 400,
      color: c.textColor,
      align: 'center',
      font: c.font,
    });
    y += dayNumLineH;
    if (c.showLunar) {
      ops.push({
        op: 'text',
        x: colCenterX,
        y: y + lunarLineH * 0.75,
        text: lunarCellLabel(date),
        size: lunarSize,
        weight: 400,
        color: c.textColor,
        align: 'center',
        font: c.font,
      });
      y += lunarLineH;
    }

    const dayChips = items[i];
    const chipsTop = contentTop + headerH;
    const overflow = dayChips.length > maxSlots ? dayChips.length - (maxSlots - 1) : 0;
    const visibleChips = overflow > 0 ? dayChips.slice(0, maxSlots - 1) : dayChips.slice(0, maxSlots);

    let cy = chipsTop;
    for (const chip of visibleChips) {
      drawChip(ops, chip, colX, cy, colW, chipH, chipTextSize, chipTimeSize, c);
      cy += chipH + chipGap;
    }
    if (overflow > 0) {
      const fillColor = c.textColor;
      ops.push({ op: 'rect', x: colX, y: cy, w: colW, h: chipH, r: 10, fill: fillColor, alpha: 0.16 });
      ops.push({
        op: 'text',
        x: colX + colW / 2,
        y: cy + chipH / 2 + chipTextSize * 0.35,
        text: `+${overflow}`,
        size: chipTextSize,
        weight: 600,
        color: c.textColor,
        align: 'center',
        font: c.font,
      });
    }
  }

  if (hasList) {
    const listTop = contentTop + stripH + listGap;
    if (todayList.length === 0) {
      ops.push({
        op: 'text',
        x: gridLeft,
        y: listTop + moreLineH * 0.7,
        text: t('week.todayEmpty', c.lang),
        size: subSize * 1.2,
        weight: 400,
        color: c.textColor,
        align: 'left',
        font: c.font,
      });
    } else {
      let y = listTop;
      for (let i = 0; i < shownCount; i++) {
        drawTodayItem(ops, todayList[i], gridLeft, y, gridWidth, itemH, nameSize, subSize, itemInnerGap, d.today, c);
        y += itemH;
      }
      if (moreCount > 0) {
        ops.push({
          op: 'text',
          x: gridLeft,
          y: y + moreLineH * 0.7,
          text: t('week.more', c.lang, { n: moreCount }),
          size: subSize * 1.2,
          weight: 400,
          color: c.textColor,
          align: 'left',
          font: c.font,
        });
      }
    }
  }

  return ops;
}

function drawChip(
  ops: DrawOp[],
  chip: ChipItem,
  x: number,
  y: number,
  w: number,
  h: number,
  titleSize: number,
  timeSize: number,
  c: DesignConfig
): void {
  const fill = chip.kind === 'todo' ? TODO_FILL : pastel(chip.occ.color);
  ops.push({ op: 'rect', x, y, w, h: h, r: 10, fill });

  const pad = titleSize * 0.22;
  const availWidth = w - pad * 2;
  const textColor = chip.kind === 'todo' && chip.overdue ? OVERDUE_CHIP_COLOR : TODO_TEXT;
  const line1 =
    chip.kind === 'event'
      ? chipTimeText(chip.occ, c.hour12, c.lang, availWidth, timeSize, c.font)
      : `☐${chip.overdue ? ` ${t('todo.overdue', c.lang)}` : ''}`;
  const line1Size = chip.kind === 'event' ? timeSize : titleSize;
  const line2 = chip.kind === 'event' ? chip.occ.title : chip.todo.text;

  ops.push({
    op: 'text',
    x: x + pad,
    y: y + pad + line1Size * 0.85,
    text: chip.kind === 'event' ? line1 : truncateByFactor(line1, availWidth, line1Size, charW(c.font)),
    size: line1Size,
    weight: 600,
    color: textColor,
    align: 'left',
    font: c.font,
  });
  ops.push({
    op: 'text',
    x: x + pad,
    y: y + pad + line1Size * 1.2 + titleSize * 0.9,
    text: truncateByFactor(line2, availWidth, titleSize, charW(c.font)),
    size: titleSize,
    weight: 400,
    color: TODO_TEXT,
    align: 'left',
    font: c.font,
  });
}

function drawTodayItem(
  ops: DrawOp[],
  item: TodayItem,
  x: number,
  y: number,
  w: number,
  h: number,
  nameSize: number,
  subSize: number,
  innerGap: number,
  today: ISODate,
  c: DesignConfig
): void {
  const color = item.kind === 'todo' ? TODO_FILL : pastel(item.occ.color);
  const barW = Math.max(4, nameSize * 0.14);
  const pad = nameSize * 0.22;

  ops.push({ op: 'rect', x, y: y + pad * 0.4, w: barW, h: h - pad * 0.8, r: barW / 2, fill: color });

  const textLeft = x + barW + nameSize * 0.4;
  const availWidth = Math.max(1, w - (textLeft - x));
  const name = item.kind === 'event' ? item.occ.title : item.todo.text;

  ops.push({
    op: 'text',
    x: textLeft,
    y: y + pad + nameSize * 0.8,
    text: truncate(name, availWidth, nameSize),
    size: nameSize,
    weight: 700,
    color: c.textColor,
    align: 'left',
    font: c.font,
  });

  const subY = y + pad + nameSize * 1.05 + innerGap + subSize * 0.8;
  if (item.kind === 'event') {
    const timeText = chipTimeText(item.occ, c.hour12, c.lang);
    ops.push({
      op: 'text',
      x: textLeft,
      y: subY,
      text: `◷ ${timeText}`,
      size: subSize,
      weight: 400,
      color: c.textColor,
      align: 'left',
      font: c.font,
    });
  } else if (item.todo.due) {
    const due = todoDueLabel(item.todo.due, today, c.lang);
    ops.push({
      op: 'text',
      x: textLeft,
      y: subY,
      text: due.text,
      size: subSize,
      weight: due.overdue ? 700 : 400,
      color: due.overdue ? c.accentColor : c.textColor,
      align: 'left',
      font: c.font,
    });
  }
}

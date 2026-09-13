import { useState } from 'preact/hooks';
import type { Store } from '../../store';
import type { AppState, LocalEvent, Occurrence } from '../../../core/model';
import { monthGrid, parseISODate, toISODate } from '../../../core/calendar';
import { expandOccurrences } from '../../../core/recurrence';
import { solarToLunar } from '../../../core/lunar';
import { eventToIcs } from '../../../export/ics';
import { t } from '../../../core/i18n';
import { Sheet } from '../../components/Sheet';
import { ALARM_MINUTES, EVENT_COLORS, addMinutesToTime, downloadBlob, minutesBetween, newId } from './util';

interface Props {
  store: Store;
  state: AppState;
  showToast: (msg: string) => void;
}

function lastDayOfMonth(y: number, m0: number): number {
  return new Date(y, m0 + 1, 0).getDate();
}

/** Nhãn ngày âm trong ô lưới: "d/m" cho mùng 1, còn lại chỉ ngày âm. Port lich-nen.html renderCalendar. */
function lunarCellText(date: string): string {
  const l = solarToLunar(date);
  return l.day === 1 ? `${l.day}/${l.month}` : `${l.day}`;
}

/** Dòng meta dưới tiêu đề sự kiện: "Hằng tuần, Nhắc trước 15 phút" (port lich-nen.html L783-788). */
function eventMeta(ev: LocalEvent, lang: 'vi' | 'en'): string {
  const parts: string[] = [];
  if (ev.repeat && ev.repeat !== 'none') parts.push(t(`repeat.${ev.repeat}`, lang));
  if (ev.alarmMin) parts.push(t('events.alarmMeta', lang, { label: t(`alarm.${ev.alarmMin}`, lang) }));
  return parts.join(', ');
}

export function EventsTab({ store, state, showToast }: Props) {
  const lang = state.design.lang;
  const today = toISODate(new Date());
  const [ym, setYm] = useState(() => {
    const p = parseISODate(today);
    return { y: p.y, m0: p.m0 };
  });
  const [selected, setSelected] = useState(today);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(today);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [repeat, setRepeat] = useState<LocalEvent['repeat']>('none');
  const [until, setUntil] = useState('');
  const [color, setColor] = useState(EVENT_COLORS[0]);
  const [alarmMin, setAlarmMin] = useState(0);

  const grid = monthGrid(ym.y, ym.m0, state.design.weekStart);
  const monthFrom = `${ym.y}-${String(ym.m0 + 1).padStart(2, '0')}-01`;
  const monthTo = toISODate(new Date(ym.y, ym.m0, lastDayOfMonth(ym.y, ym.m0), 12));
  const monthOcc = expandOccurrences(state.events, monthFrom, monthTo);
  const occByDate = new Map<string, Occurrence[]>();
  for (const o of monthOcc) {
    const list = occByDate.get(o.date);
    if (list) list.push(o);
    else occByDate.set(o.date, [o]);
  }
  const dayOcc = occByDate.get(selected) ?? [];

  function gotoMonth(delta: number) {
    let y = ym.y;
    let m0 = ym.m0 + delta;
    if (m0 < 0) {
      m0 = 11;
      y -= 1;
    } else if (m0 > 11) {
      m0 = 0;
      y += 1;
    }
    setYm({ y, m0 });
    const day = Math.min(parseISODate(selected).d, lastDayOfMonth(y, m0));
    setSelected(toISODate(new Date(y, m0, day, 12)));
  }

  function openNew() {
    setEditingId(null);
    setTitle('');
    setAllDay(false);
    setDate(selected);
    setStart('09:00');
    setEnd('10:00');
    setRepeat('none');
    setUntil('');
    setColor(EVENT_COLORS[0]);
    setAlarmMin(0);
    setSheetOpen(true);
  }

  function openEdit(ev: LocalEvent) {
    setEditingId(ev.id);
    setTitle(ev.title);
    setAllDay(!ev.time);
    setDate(ev.date);
    setStart(ev.time ?? '09:00');
    // S4 (T-2.7 L93): time có nhưng thiếu durationMin -> ô Kết thúc để trống (không mặc định +60).
    setEnd(!ev.time ? '10:00' : ev.durationMin != null ? addMinutesToTime(ev.time, ev.durationMin) : '');
    setRepeat(ev.repeat);
    setUntil(ev.until ?? '');
    setColor(ev.color || EVENT_COLORS[0]);
    setAlarmMin(ev.alarmMin ?? 0);
    setSheetOpen(true);
  }

  function buildEvent(): LocalEvent {
    const trimmedTitle = title.trim() || t('events.untitled', lang);
    const time = allDay ? undefined : start || '09:00';
    let durationMin: number | undefined;
    // S4 (T-2.7 L93): Kết thúc trống -> không có durationMin (không mặc định +60).
    if (!allDay && end.trim()) {
      const mins = minutesBetween(start || '09:00', end);
      durationMin = mins > 0 ? mins : undefined;
    }
    const untilVal = repeat !== 'none' && until ? until : undefined;
    return {
      id: editingId ?? newId(),
      title: trimmedTitle,
      date,
      time,
      durationMin,
      repeat,
      until: untilVal,
      color,
      alarmMin: alarmMin || undefined,
    };
  }

  function save() {
    const ev = buildEvent();
    if (editingId) store.dispatch({ type: 'updateEvent', event: ev });
    else store.dispatch({ type: 'addEvent', event: ev });
    setSelected(ev.date);
    const p = parseISODate(ev.date);
    setYm({ y: p.y, m0: p.m0 });
    setSheetOpen(false);
    showToast(t(editingId ? 'events.savedToast' : 'events.addedToast', lang));
  }

  function remove() {
    if (!editingId) return;
    if (!window.confirm(t('events.deleteConfirm', lang))) return;
    store.dispatch({ type: 'deleteEvent', id: editingId });
    setSheetOpen(false);
    showToast(t('events.deletedToast', lang));
  }

  function exportIcs() {
    const ev = buildEvent();
    const blob = new Blob([eventToIcs(ev)], { type: 'text/calendar;charset=utf-8' });
    downloadBlob(blob, `lichkhoa-${ev.date}.ics`);
    showToast(t('events.icsToast', lang));
  }

  function onOccClick(o: Occurrence) {
    const src = state.events.find((e) => e.id === o.sourceId);
    if (src) openEdit(src);
  }

  const weekdayOrder = state.design.weekStart === 1 ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];

  return (
    <div class="events-tab">
      <div class="cal-header">
        <button type="button" data-testid="cal-prev" onClick={() => gotoMonth(-1)} aria-label={t('events.prevMonth', lang)}>
          ‹
        </button>
        <div class="cal-title">
          {t(`month.${ym.m0}`, lang)} {ym.y}
        </div>
        <button type="button" data-testid="cal-next" onClick={() => gotoMonth(1)} aria-label={t('events.nextMonth', lang)}>
          ›
        </button>
      </div>
      <div class="cal-weekdays">
        {weekdayOrder.map((dow) => (
          <div key={dow} class="cal-wd">
            {t(`weekday.short.${dow}`, lang)}
          </div>
        ))}
      </div>
      <div class="cal-grid">
        {grid.flatMap((row, ri) =>
          row.map((cellDate, ci) => {
            if (!cellDate) return <div key={`${ri}-${ci}`} class="cal-cell cal-cell-empty" />;
            const isToday = cellDate === today;
            const isSelected = cellDate === selected;
            const occ = occByDate.get(cellDate) ?? [];
            return (
              <button
                key={cellDate}
                type="button"
                data-testid={`cal-cell-${cellDate}`}
                class={`cal-cell${isToday ? ' cal-today' : ''}${isSelected ? ' cal-selected' : ''}`}
                onClick={() => setSelected(cellDate)}
              >
                <span class="cal-daynum">{parseISODate(cellDate).d}</span>
                {state.design.showLunar && <span class="cal-lunar">{lunarCellText(cellDate)}</span>}
                <span class="cal-dots">
                  {occ.slice(0, 3).map((o, i) => (
                    <i key={i} class="cal-dot" style={{ background: o.color || EVENT_COLORS[0] }} />
                  ))}
                </span>
              </button>
            );
          }),
        )}
      </div>
      <div class="day-list">
        <button type="button" data-testid="add-event" class="btn block" onClick={openNew}>
          {t('events.add', lang)}
        </button>
        {dayOcc.length === 0 && <p class="empty">{t('events.dayEmpty', lang)}</p>}
        {dayOcc.map((o) => {
          const src = o.source === 'local' ? state.events.find((e) => e.id === o.sourceId) : undefined;
          const meta = src ? eventMeta(src, lang) : '';
          return (
            <button key={o.id} type="button" data-testid="ev-item" class="ev-item" onClick={() => onOccClick(o)}>
              <span class="ev-item-bar" style={{ background: o.color || EVENT_COLORS[0] }} />
              <span class="ev-item-time">{o.allDay ? t('events.allDay', lang) : o.time}</span>
              <span class="ev-item-body">
                <span class="ev-item-title">{o.title}</span>
                {meta && <span class="ev-item-meta">{meta}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div class="sheet-head">
          <button type="button" data-testid="ev-cancel" class="link" onClick={() => setSheetOpen(false)}>
            {t('events.cancel', lang)}
          </button>
          <div class="sheet-title">{editingId ? t('events.edit', lang) : t('events.add', lang)}</div>
          <button type="button" data-testid="ev-save" class="link strong" onClick={save}>
            {t('events.save', lang)}
          </button>
        </div>
        <div class="field">
          <input
            type="text"
            data-testid="ev-title"
            placeholder={t('events.title', lang)}
            aria-label={t('events.title', lang)}
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field field-between">
          <label for="ev-allday">{t('events.allDay', lang)}</label>
          <input
            type="checkbox"
            id="ev-allday"
            class="switch"
            data-testid="ev-allday"
            checked={allDay}
            onChange={(e) => setAllDay((e.target as HTMLInputElement).checked)}
          />
        </div>
        <div class="field">
          <label for="ev-date">{t('events.date', lang)}</label>
          <input
            type="date"
            id="ev-date"
            data-testid="ev-date"
            value={date}
            onInput={(e) => setDate((e.target as HTMLInputElement).value)}
          />
        </div>
        {!allDay && (
          <div class="field-inline">
            <div class="field">
              <label for="ev-start">{t('events.startTime', lang)}</label>
              <input
                type="time"
                id="ev-start"
                data-testid="ev-start"
                value={start}
                onInput={(e) => setStart((e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="field">
              <label for="ev-end">{t('events.endTime', lang)}</label>
              <input
                type="time"
                id="ev-end"
                data-testid="ev-end"
                value={end}
                onInput={(e) => setEnd((e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
        )}
        <div class="field">
          <label for="ev-repeat">{t('events.repeat', lang)}</label>
          <select
            id="ev-repeat"
            data-testid="ev-repeat"
            value={repeat}
            onChange={(e) => setRepeat((e.target as HTMLSelectElement).value as LocalEvent['repeat'])}
          >
            <option value="none">{t('repeat.none', lang)}</option>
            <option value="daily">{t('repeat.daily', lang)}</option>
            <option value="weekdays">{t('repeat.weekdays', lang)}</option>
            <option value="weekly">{t('repeat.weekly', lang)}</option>
            <option value="monthly">{t('repeat.monthly', lang)}</option>
            <option value="yearly">{t('repeat.yearly', lang)}</option>
          </select>
        </div>
        {repeat !== 'none' && (
          <div class="field">
            <label for="ev-until">{t('events.until', lang)}</label>
            <input
              type="date"
              id="ev-until"
              data-testid="ev-until"
              value={until}
              onInput={(e) => setUntil((e.target as HTMLInputElement).value)}
            />
          </div>
        )}
        <div class="field">
          <label for="ev-alarm">{t('events.alarm', lang)}</label>
          <select
            id="ev-alarm"
            data-testid="ev-alarm"
            value={String(alarmMin)}
            onChange={(e) => setAlarmMin(Number((e.target as HTMLSelectElement).value))}
          >
            {ALARM_MINUTES.map((m) => (
              <option key={m} value={m}>
                {t(`alarm.${m}`, lang)}
              </option>
            ))}
          </select>
          <p class="hint">{t('events.alarmHint', lang)}</p>
        </div>
        <div class="field">
          <label>{t('events.color', lang)}</label>
          <div class="swatches">
            {EVENT_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                data-testid={`ev-color-${i}`}
                class={c === color ? 'swatch swatch-on' : 'swatch'}
                style={{ background: c }}
                aria-label={c}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div class="sheet-actions">
          <button type="button" data-testid="ev-ics" class="btn block" onClick={exportIcs}>
            {t('events.addToAppleCalendar', lang)}
          </button>
          {editingId && (
            <button type="button" data-testid="ev-delete" class="btn danger block" onClick={remove}>
              {t('events.delete', lang)}
            </button>
          )}
        </div>
      </Sheet>
    </div>
  );
}

import { useEffect, useState } from 'preact/hooks';
import type { DayAlarmWindow, ReminderSource, ReminderWindow } from '../../export/reminder';
import { dayAlarmWindow, defaultReminderAt, reminderText, reminderWindow } from '../../export/reminder';
import { openShortcut } from '../../export/share';
import { t } from '../../core/i18n';

export interface ReminderDialogProps {
  open: boolean;
  onClose: () => void;
  source: ReminderSource;
  title: string;
  note?: string;
  alarmShortcutName: string;
  reminderShortcutName: string;
  dayAlarmShortcutName: string;
  onSave: () => Promise<boolean | void> | boolean | void;
  /** Ghi ngay xuống IndexedDB trước khi rời app sang Phím tắt (T-7.5, chống mất dữ liệu). Bắt buộc truyền. */
  flush: () => Promise<void>;
  showToast: (msg: string) => void;
  lang: 'vi' | 'en';
}

/** Hộp thoại chọn thời điểm nhắc trên iPhone qua Phím tắt (IN-11/IN-12, SPEC §3 IN-12).
 * Dùng chung cho Sự kiện (EventsTab), Việc cần làm (TodosTab) và Ghi chú (NoteTab). */
export function ReminderDialog({
  open,
  onClose,
  source,
  title,
  note,
  alarmShortcutName,
  reminderShortcutName,
  dayAlarmShortcutName,
  onSave,
  flush,
  showToast,
  lang,
}: ReminderDialogProps) {
  const [at, setAt] = useState<string>(() => (open ? defaultReminderAt(source, new Date()) : ''));

  useEffect(() => {
    if (open) {
      setAt(defaultReminderAt(source, new Date()));
    }
  }, [open]);

  if (!open) return null;

  const now = new Date();
  const isValid = Boolean(at && !isNaN(new Date(at).getTime()));
  const win: ReminderWindow = isValid ? reminderWindow(at, now) : 'past';
  const dayWin: DayAlarmWindow = isValid ? dayAlarmWindow(at, now) : 'past';

  async function handleAction(kind: 'alarm' | 'dayalarm' | 'reminder') {
    const shortcutName =
      kind === 'alarm'
        ? alarmShortcutName
        : kind === 'dayalarm'
        ? dayAlarmShortcutName
        : reminderShortcutName;
    try {
      const ok = await onSave();
      if (ok === false) return;
    } catch {
      return;
    }
    try {
      await flush();
    } catch {
      // Ghi thất bại (vd. IndexedDB lỗi): dữ liệu vẫn đúng trong state RAM và sẽ được
      // ghi lại qua debounce/pagehide sau đó (T-7.5). Không chặn người dùng mở Phím tắt.
    }
    onClose();
    showToast(t('reminder.openedToast', lang, { name: shortcutName }));
    const payload = reminderText(at, title, note);
    openShortcut(shortcutName, payload);
  }

  let statusHint = '';
  let statusClass = '';
  if (!isValid || win === 'past' || dayWin === 'past') {
    statusHint = t('reminder.statusPast', lang);
    statusClass = 'rem-hint-past';
  } else if (dayWin === 'today') {
    statusHint = t('reminder.statusToday', lang);
  } else if (dayWin === 'too-early') {
    statusHint = t('reminder.statusTooEarly', lang);
    statusClass = 'rem-hint-warning';
  } else if (win === 'alarm-ok') {
    statusHint = t('reminder.statusAlarmOk', lang);
  } else {
    statusHint = t('reminder.statusOver24h', lang);
    statusClass = 'rem-hint-warning';
  }

  return (
    <>
      <div class="rem-backdrop" onClick={onClose} />
      <div class="rem-dialog" role="dialog" aria-modal="true" aria-labelledby="rem-dialog-title">
        <div class="sheet-head">
          <div id="rem-dialog-title" class="sheet-title">
            {t('reminder.title', lang)}
          </div>
        </div>
        <div class="field">
          <label for="rem-at">{t('reminder.at', lang)}</label>
          <input
            id="rem-at"
            type="datetime-local"
            step="60"
            data-testid="rem-at"
            value={at}
            onInput={(e) => setAt((e.target as HTMLInputElement).value)}
          />
          <p class={`hint rem-status ${statusClass}`}>{statusHint}</p>
        </div>
        <div class="rem-actions">
          <button
            type="button"
            data-testid="rem-alarm"
            class="btn block"
            disabled={win !== 'alarm-ok'}
            onClick={() => void handleAction('alarm')}
          >
            {t('reminder.alarm', lang)}
          </button>
          <div class="rem-hint rem-hint-alarm" data-testid="rem-hint-alarm">
            {t('reminder.hintAlarm', lang)}
          </div>

          <button
            type="button"
            data-testid="rem-dayalarm"
            class="btn block"
            disabled={dayWin !== 'ok'}
            onClick={() => void handleAction('dayalarm')}
          >
            {t('reminder.dayAlarm', lang)}
          </button>
          <div class="rem-hint rem-hint-dayalarm" data-testid="rem-hint-dayalarm">
            {t('reminder.hintDayAlarm', lang)}
          </div>

          <button
            type="button"
            data-testid="rem-reminder"
            class="btn block"
            disabled={win === 'past'}
            onClick={() => void handleAction('reminder')}
          >
            {t('reminder.reminder', lang)}
          </button>
          <div class="rem-hint rem-hint-reminder" data-testid="rem-hint-reminder">
            {t('reminder.hintReminder', lang)}
          </div>

          <button type="button" data-testid="rem-none" class="btn block rem-none-btn" onClick={onClose}>
            {t('reminder.none', lang)}
          </button>
        </div>
      </div>
    </>
  );
}

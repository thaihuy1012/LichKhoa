import { useEffect, useState } from 'preact/hooks';
import type { ReminderSource, ReminderWindow } from '../../export/reminder';
import { defaultReminderAt, reminderText, reminderWindow } from '../../export/reminder';
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
  onSave: () => Promise<boolean | void> | boolean | void;
  showToast: (msg: string) => void;
  lang: 'vi' | 'en';
}

/** Hộp thoại chọn thời điểm nhắc trên iPhone qua Phím tắt (IN-11, SPEC dòng 30-32).
 * Dùng chung cho Sự kiện (EventsTab), Việc cần làm (TodosTab) và Ghi chú (NoteTab). */
export function ReminderDialog({
  open,
  onClose,
  source,
  title,
  note,
  alarmShortcutName,
  reminderShortcutName,
  onSave,
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

  const isValid = Boolean(at && !isNaN(new Date(at).getTime()));
  const win: ReminderWindow = isValid ? reminderWindow(at, new Date()) : 'past';

  async function handleAction(kind: 'alarm' | 'reminder') {
    const shortcutName = kind === 'alarm' ? alarmShortcutName : reminderShortcutName;
    try {
      const ok = await onSave();
      if (ok === false) return;
    } catch {
      return;
    }
    onClose();
    showToast(t('reminder.openedToast', lang, { name: shortcutName }));
    const payload = reminderText(at, title, note);
    openShortcut(shortcutName, payload);
  }

  let statusHint = '';
  if (win === 'past') {
    statusHint = t('reminder.statusPast', lang);
  } else if (win === 'reminder-only') {
    statusHint = t('reminder.statusReminderOnly', lang);
  } else {
    statusHint = t('reminder.statusAlarmOk', lang);
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
          <p
            class={`hint rem-status ${
              win === 'past' ? 'rem-hint-past' : win === 'reminder-only' ? 'rem-hint-warning' : ''
            }`}
          >
            {statusHint}
          </p>
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
          <button
            type="button"
            data-testid="rem-reminder"
            class="btn block"
            disabled={win === 'past'}
            onClick={() => void handleAction('reminder')}
          >
            {t('reminder.reminder', lang)}
          </button>
          <button type="button" data-testid="rem-none" class="btn block rem-none-btn" onClick={onClose}>
            {t('reminder.none', lang)}
          </button>
        </div>
      </div>
    </>
  );
}

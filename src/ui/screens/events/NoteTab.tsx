import { useState } from 'preact/hooks';
import type { Store } from '../../store';
import type { AppState, Note } from '../../../core/model';
import { t } from '../../../core/i18n';
import { Sheet } from '../../components/Sheet';
import { ReminderDialog } from '../../components/ReminderDialog';
import { newId } from './util';

interface Props {
  store: Store;
  state: AppState;
  showToast: (msg: string) => void;
}

/** Danh sách ghi chú (ghim lên đầu, mới sửa trước) + sheet thêm/sửa. Port lich-nen.html L895-932. */
export function NoteTab({ store, state, showToast }: Props) {
  const lang = state.design.lang;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nTitle, setNTitle] = useState('');
  const [nBody, setNBody] = useState('');
  const [nPin, setNPin] = useState(false);

  const notes = [...state.notes].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.updated || 0) - (a.updated || 0),
  );

  function openNew() {
    setEditingId(null);
    setNTitle('');
    setNBody('');
    setNPin(false);
    setReminderOpen(false);
    setSheetOpen(true);
  }

  function openEdit(n: Note) {
    setEditingId(n.id);
    setNTitle(n.title);
    setNBody(n.body);
    setNPin(n.pinned);
    setReminderOpen(false);
    setSheetOpen(true);
  }

  function save(options?: { suppressToast?: boolean }): boolean {
    const title = nTitle.trim();
    const body = nBody.trim();
    if (!title && !body) {
      showToast(t('notes.emptyToast', lang));
      return false;
    }
    const id = editingId ?? newId();
    const note: Note = { id, title, body, pinned: false, updated: Date.now() };
    if (editingId) store.dispatch({ type: 'updateNote', note });
    else store.dispatch({ type: 'addNote', note });
    if (nPin) store.dispatch({ type: 'pinNote', id, pinned: true });
    setSheetOpen(false);
    setReminderOpen(false);
    if (!options?.suppressToast) {
      showToast(t('notes.savedToast', lang));
    }
    return true;
  }

  function remove() {
    if (!editingId) return;
    if (!window.confirm(t('notes.deleteConfirm', lang))) return;
    store.dispatch({ type: 'deleteNote', id: editingId });
    setSheetOpen(false);
    setReminderOpen(false);
    showToast(t('notes.deletedToast', lang));
  }

  return (
    <div class="note-tab">
      <div class="field field-between">
        <label for="note-show">{t('notes.showLabel', lang)}</label>
        <input
          type="checkbox"
          id="note-show"
          class="switch"
          data-testid="note-show"
          checked={state.design.showNote}
          onChange={(e) => store.dispatch({ type: 'setDesign', partial: { showNote: (e.target as HTMLInputElement).checked } })}
        />
      </div>
      <p class="hint">{t('notes.showHint', lang)}</p>

      <button type="button" data-testid="add-note" class="btn block" onClick={openNew}>
        {t('notes.add', lang)}
      </button>
      {notes.length === 0 && <p class="empty">{t('notes.empty', lang)}</p>}
      <div class="note-list">
        {notes.map((n) => (
          <button key={n.id} type="button" data-testid="note-item" class="note-item" onClick={() => openEdit(n)}>
            <span class="note-item-head">
              <span>{n.title || t('events.untitled', lang)}</span>
              {n.pinned && <span class="note-item-pin">{t('notes.pinBadge', lang)}</span>}
            </span>
            {n.body && <span class="note-item-body">{n.body}</span>}
          </button>
        ))}
      </div>

      <Sheet open={sheetOpen} onClose={() => { setSheetOpen(false); setReminderOpen(false); }}>
        <div class="sheet-head">
          <button type="button" data-testid="nt-cancel" class="link" onClick={() => { setSheetOpen(false); setReminderOpen(false); }}>
            {t('events.cancel', lang)}
          </button>
          <div class="sheet-title">{editingId ? t('notes.edit', lang) : t('notes.new', lang)}</div>
          <button type="button" data-testid="nt-save" class="link strong" onClick={() => void save()}>
            {t('events.save', lang)}
          </button>
        </div>
        <div class="field">
          <input
            type="text"
            data-testid="nt-title"
            placeholder={t('events.title', lang)}
            aria-label={t('events.title', lang)}
            value={nTitle}
            onInput={(e) => setNTitle((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <textarea
            data-testid="nt-body"
            rows={6}
            placeholder={t('notes.bodyPlaceholder', lang)}
            aria-label={t('notes.bodyPlaceholder', lang)}
            value={nBody}
            onInput={(e) => setNBody((e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div class="field field-between">
          <label for="nt-pin">{t('notes.pin', lang)}</label>
          <input
            type="checkbox"
            id="nt-pin"
            class="switch"
            data-testid="nt-pin"
            checked={nPin}
            onChange={(e) => setNPin((e.target as HTMLInputElement).checked)}
          />
        </div>
        <div class="sheet-actions">
          <button
            type="button"
            data-testid="rem-open"
            class="btn block"
            disabled={!nTitle.trim() && !nBody.trim()}
            onClick={() => setReminderOpen(true)}
          >
            {t('reminder.open', lang)}
          </button>
          {editingId && (
            <button type="button" data-testid="nt-delete" class="btn danger block" onClick={remove}>
              {t('notes.delete', lang)}
            </button>
          )}
        </div>
      </Sheet>

      <ReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        source={{ kind: 'note' }}
        title={nTitle.trim() || nBody.trim().split('\n')[0]?.trim() || ''}
        note={nBody.trim() || undefined}
        alarmShortcutName={state.alarmShortcutName}
        reminderShortcutName={state.reminderShortcutName}
        onSave={() => save({ suppressToast: true })}
        showToast={showToast}
        lang={lang}
      />
    </div>
  );
}

import { useState } from 'preact/hooks';
import type { Store } from '../../store';
import type { AppState, ISODate, Todo } from '../../../core/model';
import { t } from '../../../core/i18n';
import { toISODate } from '../../../core/calendar';
import { sameTodoGroup } from '../../store';
import { sortTodosForDisplay, todoDueLabel } from './util';

interface Props {
  store: Store;
  state: AppState;
}

function DueBadge({
  todo,
  today,
  lang,
  onChange,
}: {
  todo: Todo;
  today: ISODate;
  lang: 'vi' | 'en';
  onChange: (due: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <input
        type="date"
        class="todo-due-input"
        data-testid="todo-due-edit"
        value={todo.due ?? ''}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).value;
          onChange(v || null);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
      />
    );
  }
  if (!todo.due) {
    return (
      <button type="button" class="todo-due-add" data-testid="todo-due-label" onClick={() => setEditing(true)}>
        + {t('events.todoDue', lang)}
      </button>
    );
  }
  const label = todoDueLabel(todo.due, today, lang);
  return (
    <button
      type="button"
      class={label.overdue ? 'todo-due-label todo-due-overdue' : 'todo-due-label'}
      data-testid="todo-due-label"
      onClick={() => setEditing(true)}
    >
      {label.text}
    </button>
  );
}

export function TodosTab({ store, state }: Props) {
  const lang = state.design.lang;
  const today = toISODate(new Date());
  const [inputText, setInputText] = useState('');
  const [inputDue, setInputDue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showDone, setShowDone] = useState(false);

  const sorted = sortTodosForDisplay(state.todos);
  const open = sorted.filter((x) => !x.done);
  const done = sorted.filter((x) => x.done);

  function add() {
    const text = inputText.trim();
    if (!text) return;
    store.dispatch({ type: 'addTodo', text, due: inputDue || undefined });
    setInputText('');
    setInputDue('');
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function commitEdit() {
    if (editingId) {
      const text = editingText.trim();
      if (text) store.dispatch({ type: 'updateTodo', id: editingId, text });
    }
    setEditingId(null);
  }

  function renderRow(todo: Todo, list: Todo[]) {
    const idx = list.indexOf(todo);
    return (
      <div key={todo.id} class="todo-item" data-testid="todo-item">
        <button
          type="button"
          data-testid="todo-toggle"
          class={todo.done ? 'todo-toggle todo-toggle-done' : 'todo-toggle'}
          aria-label={todo.done ? t('events.todoMarkUndone', lang) : t('events.todoMarkDone', lang)}
          onClick={() => store.dispatch({ type: 'toggleTodo', id: todo.id })}
        >
          {todo.done ? '✓' : ''}
        </button>
        {editingId === todo.id ? (
          <input
            type="text"
            class="todo-edit-input"
            value={editingText}
            onInput={(e) => setEditingText((e.target as HTMLInputElement).value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
        ) : (
          <button type="button" data-testid="todo-edit" class="todo-text" onClick={() => startEdit(todo)}>
            {todo.text}
          </button>
        )}
        <DueBadge
          todo={todo}
          today={today}
          lang={lang}
          onChange={(due) => store.dispatch({ type: 'setTodoDue', id: todo.id, due })}
        />
        <button
          type="button"
          data-testid="todo-up"
          disabled={idx <= 0 || !sameTodoGroup(todo, list[idx - 1])}
          onClick={() => store.dispatch({ type: 'moveTodo', id: todo.id, dir: -1 })}
        >
          ↑
        </button>
        <button
          type="button"
          data-testid="todo-down"
          disabled={idx >= list.length - 1 || !sameTodoGroup(todo, list[idx + 1])}
          onClick={() => store.dispatch({ type: 'moveTodo', id: todo.id, dir: 1 })}
        >
          ↓
        </button>
        <button type="button" data-testid="todo-del" onClick={() => store.dispatch({ type: 'deleteTodo', id: todo.id })}>
          ×
        </button>
      </div>
    );
  }

  return (
    <div class="todos-tab">
      <div class="addrow">
        <input
          type="text"
          data-testid="todo-input"
          placeholder={t('events.todoNew', lang)}
          aria-label={t('events.todoNew', lang)}
          value={inputText}
          onInput={(e) => setInputText((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') add();
          }}
        />
        <label class="todo-due-hint">
          {t('events.todoDue', lang)}
          <input
            type="date"
            data-testid="todo-due"
            aria-label={t('events.todoDue', lang)}
            value={inputDue}
            onInput={(e) => setInputDue((e.target as HTMLInputElement).value)}
          />
        </label>
        <button type="button" data-testid="todo-add" onClick={add}>
          {t('events.todoAdd', lang)}
        </button>
      </div>
      {open.length === 0 && <p class="empty">{t('todo.empty', lang)}</p>}
      <div class="todo-list">{open.map((todo) => renderRow(todo, open))}</div>
      {done.length > 0 && (
        <div class="todo-done-group">
          <button type="button" data-testid="todo-done-toggle" class="row btnrow" onClick={() => setShowDone((v) => !v)}>
            {t('events.todoDoneCount', lang, { n: done.length })}
          </button>
          {showDone && <div class="todo-done-list">{done.map((todo) => renderRow(todo, done))}</div>}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'preact/hooks';
import type { Store } from '../store';
import { useStoreState } from '../useStoreState';
import { t } from '../../core/i18n';
import { Toast } from '../components/Toast';
import { EventsTab } from './events/EventsTab';
import { TodosTab } from './events/TodosTab';
import { NoteTab } from './events/NoteTab';

type Segment = 'events' | 'todos' | 'note';

const TOAST_MS = 2600;

export function Events({ store }: { store: Store }) {
  const state = useStoreState(store);
  const [segment, setSegment] = useState<Segment>('events');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  // T-6.2: toast có thể mang nút hành động (vd. "Hoàn tác"), hiện lâu hơn (~5s) khi có hành động.
  function showToast(msg: string, action?: { label: string; onClick: () => void }) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    setToastAction(action ?? null);
    toastTimerRef.current = setTimeout(
      () => {
        setToastMsg(null);
        setToastAction(null);
      },
      action ? 5000 : TOAST_MS,
    );
  }

  const lang = state.design.lang;
  const SEGMENTS: { id: Segment; testid: string; label: string }[] = [
    { id: 'events', testid: 'seg-events', label: t('events.segEvents', lang) },
    { id: 'todos', testid: 'seg-todos', label: t('events.segTodos', lang) },
    { id: 'note', testid: 'seg-note', label: t('events.segNote', lang) },
  ];

  return (
    <div class="events-screen">
      <div class="segmented" role="tablist">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            data-testid={s.testid}
            class={segment === s.id ? 'seg-btn seg-active' : 'seg-btn'}
            onClick={() => setSegment(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div class="events-body">
        {segment === 'events' && <EventsTab store={store} state={state} showToast={showToast} />}
        {segment === 'todos' && <TodosTab store={store} state={state} showToast={showToast} />}
        {segment === 'note' && <NoteTab store={store} state={state} showToast={showToast} />}
      </div>
      <Toast
        message={toastMsg}
        actionLabel={toastAction?.label}
        onAction={() => {
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastAction?.onClick();
          setToastMsg(null);
          setToastAction(null);
        }}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from 'preact/hooks';
import type { Store } from '../store';
import { t } from '../../core/i18n';
import { Toast } from '../components/Toast';
import { EventsTab } from './events/EventsTab';
import { TodosTab } from './events/TodosTab';
import { NoteTab } from './events/NoteTab';

type Segment = 'events' | 'todos' | 'note';

const TOAST_MS = 2600;

export function Events({ store }: { store: Store }) {
  const [state, setState] = useState(store.getState());
  const [segment, setSegment] = useState<Segment>('events');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setState(store.getState());
    return store.subscribe(setState);
  }, [store]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), TOAST_MS);
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
        {segment === 'todos' && <TodosTab store={store} state={state} />}
        {segment === 'note' && <NoteTab store={store} state={state} showToast={showToast} />}
      </div>
      <Toast message={toastMsg} />
    </div>
  );
}

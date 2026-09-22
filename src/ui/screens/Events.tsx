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
  const undoActionsRef = useRef<(() => void)[]>([]);
  // SC-005 / D-036 siết: không gọi store.subscribe trực tiếp (khóa store-subscribe-guard) — dùng
  // state từ useStoreState. Handler gọi dispatch rồi showToast đồng bộ, Preact chưa render lại giữa
  // hai lệnh -> renderedStateRef lúc đó = trạng thái NGAY TRƯỚC dispatch của thao tác mới.
  const renderedStateRef = useRef(state);
  renderedStateRef.current = state;
  const afterLastUndoableRef = useRef<typeof state | null>(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      undoActionsRef.current = [];
      afterLastUndoableRef.current = null;
    },
    [],
  );

  function handleUndoAll() {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    const actions = undoActionsRef.current.slice();
    undoActionsRef.current = [];
    for (let i = actions.length - 1; i >= 0; i--) {
      actions[i]();
    }
    afterLastUndoableRef.current = null;
    setToastMsg(null);
    setToastAction(null);
  }

  // T-6.2 / B-016 (D-036): gộp Hoàn tác khi có thao tác liên tiếp trong lúc toast còn hiện (~5s).
  // Siết: chỉ nối thêm khi giữa lần showToast có action trước và lần này store nhận đúng 1 dispatch
  // (chính thao tác mới): trạng thái ngay trước dispatch đó trùng tham chiếu với trạng thái đã lưu.
  function showToast(msg: string, action?: { label: string; onClick: () => void }) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    if (action) {
      const nothingBetween =
        afterLastUndoableRef.current !== null && renderedStateRef.current === afterLastUndoableRef.current;
      if (undoActionsRef.current.length > 0 && nothingBetween) {
        undoActionsRef.current.push(action.onClick);
      } else {
        undoActionsRef.current = [action.onClick];
      }
      afterLastUndoableRef.current = store.getState();
      setToastAction({ label: action.label, onClick: handleUndoAll });
      toastTimerRef.current = setTimeout(
        () => {
          setToastMsg(null);
          setToastAction(null);
          undoActionsRef.current = [];
          afterLastUndoableRef.current = null;
          toastTimerRef.current = null;
        },
        5000,
      );
    } else {
      undoActionsRef.current = [];
      afterLastUndoableRef.current = null;
      setToastAction(null);
      toastTimerRef.current = setTimeout(
        () => {
          setToastMsg(null);
          setToastAction(null);
          toastTimerRef.current = null;
        },
        TOAST_MS,
      );
    }
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
        onAction={handleUndoAll}
      />
    </div>
  );
}

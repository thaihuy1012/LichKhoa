import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { Store } from '../../store';
import type { AppState, ISODate, Todo } from '../../../core/model';
import { t } from '../../../core/i18n';
import { toISODate } from '../../../core/calendar';
import { sameTodoGroup } from '../../store';
import { sortTodosForDisplay, todoDueLabel } from './util';

interface Props {
  store: Store;
  state: AppState;
  showToast: (msg: string, action?: { label: string; onClick: () => void }) => void;
}

/** T-6.2: một bộ cử chỉ pointer duy nhất cho mỗi hàng, phân biệt vuốt ngang / nhấn giữ kéo / chạm thường. */
const LONG_PRESS_MS = 450;
const MOVE_CANCEL_PX = 8;
const SWIPE_ACTIVATE_PX = 16;
const EARLY_SWIPE_PX = 4; // T-6.3 (#4): ngưỡng chặn cuộn sớm trong touchmove, thấp hơn SWIPE_ACTIVATE_PX
const SWIPE_PANEL_PX = 160;
const SWIPE_OPEN_RATIO = 0.4;

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

interface DragInfo {
  id: string;
  listKey: 'open' | 'done';
  originalIndex: number;
  finalIndex: number;
  rowHeight: number;
  rawDy: number;
}

type Phase = 'idle' | 'pending' | 'swipe' | 'drag';

interface GestureCallbacks {
  onSwipeSettle: (open: boolean) => void;
  onBeginDrag: (rowEl: HTMLDivElement) => void;
  onDragMove: (dy: number) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}

/** Bộ nhận cử chỉ dùng chung cho hàng thường và hàng đã lưu trữ (T-6.2). `canDrag` tắt cho hàng lưu trữ.
 * `isOpen`: hàng đang mở sẵn (panel lộ ra) hay không, để vuốt tiếp từ vị trí mở không giật về 0 (T-6.3 #2). */
function useRowGesture(canDrag: boolean, isOpen: boolean, cb: GestureCallbacks) {
  const phaseRef = useRef<Phase>('idle');
  const startRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const [dx, setDx] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const rowElRef = useRef<HTMLDivElement | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  // Safari iOS (bằng chứng review T-6.2 lượt 1): hàng có `touch-action: pan-y` để cuộn dọc mượt
  // khi không kéo. Nhưng WebKit chốt quyết định cuộn/không-cuộn cho cả chuỗi chạm ngay khi touch
  // bắt đầu di chuyển theo `touch-action`; gọi `preventDefault()` trên PointerEvent (`onPointerMove`
  // ở JSX) không còn chặn được cuộn nữa một khi WebKit đã "giành" cử chỉ — nó hủy pointer luôn
  // (bắn `pointercancel`) trước khi JS kịp phản ứng. Cách chặn được: đăng ký listener `touchmove`
  // gốc (không qua JSX, vì {passive:false} không tự đặt được qua props) trực tiếp trên phần tử
  // hàng, gọi `preventDefault()` ngay khi đang vuốt ngang (đã xác định hướng) hoặc đang kéo (đã qua
  // nhấn giữ) — tức TRƯỚC khi trình duyệt kịp chốt cuộn cho lần di chuyển đó.
  useEffect(() => {
    const el = rowElRef.current;
    if (!el) return;
    function onTouchMove(e: TouchEvent) {
      if (phaseRef.current === 'swipe' || phaseRef.current === 'drag') {
        e.preventDefault();
        return;
      }
      // T-6.3 (#4, soát chéo M6): còn `pending` (chưa qua ngưỡng SWIPE_ACTIVATE_PX=16 để JS tự
      // chuyển phase) nhưng đã thấy rõ hướng ngang (|dx|>|dy|) từ vài px đầu -> chặn cuộn NGAY,
      // không đợi đủ 16px, vì WebKit chốt quyền cuộn/vuốt-lùi từ những pixel di chuyển đầu tiên.
      if (phaseRef.current === 'pending' && e.touches.length === 1) {
        const touch = e.touches[0];
        const dxNow = touch.clientX - startRef.current.x;
        const dyNow = touch.clientY - startRef.current.y;
        if (Math.abs(dxNow) > EARLY_SWIPE_PX && Math.abs(dxNow) > Math.abs(dyNow)) e.preventDefault();
      }
    }
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []);

  function onPointerDown(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('input')) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    pointerIdRef.current = e.pointerId;
    phaseRef.current = 'pending';
    clearTimer();
    if (canDrag) {
      timerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'pending') return;
        phaseRef.current = 'drag';
        suppressClickRef.current = true;
        setDragging(true);
        const el = rowElRef.current;
        if (el) {
          try {
            el.setPointerCapture(e.pointerId);
          } catch {
            /* ignore: pointer may already be released */
          }
          cb.onBeginDrag(el);
        }
      }, LONG_PRESS_MS);
    }
  }

  function onPointerMove(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    const dxNow = e.clientX - startRef.current.x;
    const dyNow = e.clientY - startRef.current.y;
    if (phaseRef.current === 'pending') {
      if (Math.abs(dxNow) > SWIPE_ACTIVATE_PX && Math.abs(dxNow) > Math.abs(dyNow)) {
        clearTimer();
        phaseRef.current = 'swipe';
        suppressClickRef.current = true;
        const el = rowElRef.current;
        if (el) {
          try {
            el.setPointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }
        // T-6.3 (#2, soát chéo M6): hàng đang mở sẵn (isOpen) -> điểm bắt đầu của dx là -PANEL_PX,
        // không phải 0, nếu không hàng giật về 0 rồi mới chạy theo ngón tay tiếp.
        const base = isOpen ? -SWIPE_PANEL_PX : 0;
        setDx(Math.min(0, Math.max(-SWIPE_PANEL_PX - 24, base + dxNow)));
      } else if (Math.abs(dyNow) > MOVE_CANCEL_PX) {
        clearTimer();
        phaseRef.current = 'idle';
      }
      return;
    }
    if (phaseRef.current === 'swipe') {
      e.preventDefault();
      const base = isOpen ? -SWIPE_PANEL_PX : 0;
      setDx(Math.min(0, Math.max(-SWIPE_PANEL_PX - 24, base + dxNow)));
      return;
    }
    if (phaseRef.current === 'drag') {
      e.preventDefault();
      cb.onDragMove(dyNow);
    }
  }

  function endGesture(cancelled: boolean) {
    clearTimer();
    if (phaseRef.current === 'swipe') {
      const openThreshold = -SWIPE_PANEL_PX * SWIPE_OPEN_RATIO;
      const cur = dx ?? 0;
      cb.onSwipeSettle(!cancelled && cur <= openThreshold);
      setDx(null);
    } else if (phaseRef.current === 'drag') {
      setDragging(false);
      if (cancelled) cb.onDragCancel();
      else cb.onDragEnd();
    }
    phaseRef.current = 'idle';
    pointerIdRef.current = null;
    // T-6.3 (#3, soát chéo M6): dọn cờ suppressClick kể cả khi không có `click` nào theo sau (đề
    // phòng thêm, ngoài chỗ `onPointerCancel` đã tự dọn) — chạy sau tick hiện tại nên vẫn kịp nuốt
    // đúng 1 lần click "ma" phát sinh ngay sau cử chỉ (nếu có) trước khi tự dọn.
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }

  function onPointerUp(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    endGesture(false);
  }

  function onPointerCancel(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    // `pointercancel` (vd. WebKit giành cuộn giữa chừng) không kéo theo sự kiện `click` nào sau đó
    // -> phải tự dọn cờ suppressClick ở đây, nếu không lần chạm HỢP LỆ tiếp theo trên hàng này sẽ bị
    // nuốt oan (kẹt trạng thái). `endGesture(true)` bên dưới đã lo phần dọn `dragInfo`/`dx` để hàng
    // nổi hoặc panel vuốt trở lại đúng chỗ (không mutate state thật khi bị hủy).
    suppressClickRef.current = false;
    endGesture(true);
  }

  function onClickCapture(e: JSX.TargetedMouseEvent<HTMLDivElement>) {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  }

  return {
    dx,
    dragging,
    rowElRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClickCapture },
  };
}

function SwipeRow({
  id,
  isOpen,
  setOpen,
  canDrag,
  dragInfo,
  setDragInfo,
  listKey,
  index,
  list,
  onDragCommit,
  actions,
  children,
}: {
  id: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  canDrag: boolean;
  dragInfo: DragInfo | null;
  setDragInfo: (update: DragInfo | null | ((prev: DragInfo | null) => DragInfo | null)) => void;
  listKey: 'open' | 'done';
  index: number;
  list: Todo[];
  onDragCommit: (id: string, targetId: string) => void;
  actions: JSX.Element;
  children: JSX.Element;
}) {
  const { dx, dragging, rowElRef, handlers } = useRowGesture(canDrag, isOpen, {
    onSwipeSettle: (open) => setOpen(open),
    onBeginDrag: (rowEl) => {
      const rect = rowEl.getBoundingClientRect();
      setDragInfo({ id, listKey, originalIndex: index, finalIndex: index, rowHeight: rect.height + 6, rawDy: 0 });
    },
    onDragMove: (dy) => {
      setDragInfo((prev) => {
        if (!prev || prev.id !== id) return prev;
        const steps = Math.round(dy / prev.rowHeight);
        const finalIndex = Math.min(list.length - 1, Math.max(0, prev.originalIndex + steps));
        return { ...prev, rawDy: dy, finalIndex };
      });
    },
    onDragEnd: () => onDragCommit(id, ''),
    onDragCancel: () => setDragInfo(null),
  });

  const isDraggedRow = dragInfo?.id === id && dragInfo.listKey === listKey;
  let shiftPx = 0;
  if (dragInfo && dragInfo.listKey === listKey && !isDraggedRow) {
    const { originalIndex, finalIndex, rowHeight } = dragInfo;
    if (originalIndex < finalIndex && index > originalIndex && index <= finalIndex) shiftPx = -rowHeight;
    else if (originalIndex > finalIndex && index >= finalIndex && index < originalIndex) shiftPx = rowHeight;
  }

  const innerStyle: Record<string, string> = {};
  if (isDraggedRow) {
    innerStyle.transform = `translateY(${dragInfo!.rawDy}px) scale(1.03)`;
    innerStyle.transition = 'none';
  } else if (dx !== null) {
    innerStyle.transform = `translateX(${dx}px)`;
    innerStyle.transition = 'none';
  } else if (shiftPx !== 0) {
    innerStyle.transform = `translateY(${shiftPx}px)`;
  } else if (isOpen) {
    innerStyle.transform = `translateX(-${SWIPE_PANEL_PX}px)`;
  }

  // Đóng hẳn (không vuốt, không mở) -> ẩn hẳn panel nút (không chỉ che bằng transform): review
  // T-6.2 lượt 2 phát hiện mép phải lộ vệt cong mảnh khi đóng, do góc bo `.todo-item-wrap` clip
  // hình chữ nhật `.todo-item-inner` để lộ một mẩu panel phía sau qua góc bo. `visibility: hidden`
  // khi đóng loại bỏ hẳn phần đó khỏi hiển thị bất kể góc bo/viền.
  const showActions = isOpen || dx !== null;

  return (
    <div
      class="todo-item-wrap"
      ref={rowElRef}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onClickCapture={handlers.onClickCapture}
    >
      <div class="todo-swipe-actions" style={{ visibility: showActions ? 'visible' : 'hidden' }}>
        {actions}
      </div>
      <div
        class={isDraggedRow || dragging ? 'todo-item-inner todo-item-dragging' : 'todo-item-inner'}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}

export function TodosTab({ store, state, showToast }: Props) {
  const lang = state.design.lang;
  const today = toISODate(new Date());
  const [inputText, setInputText] = useState('');
  const [inputDue, setInputDue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [swipeOpenId, setSwipeOpenId] = useState<string | null>(null);
  const [dragInfo, setDragInfoState] = useState<DragInfo | null>(null);

  function setDragInfo(update: DragInfo | null | ((prev: DragInfo | null) => DragInfo | null)) {
    setDragInfoState((prev) => (typeof update === 'function' ? (update as (p: DragInfo | null) => DragInfo | null)(prev) : update));
  }

  const activeTodos = state.todos.filter((x) => !x.archived);
  const archivedTodos = [...state.todos.filter((x) => !!x.archived)].sort((a, b) => a.order - b.order);
  const sorted = sortTodosForDisplay(activeTodos);
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

  function handleArchive(todo: Todo) {
    setSwipeOpenId(null);
    store.dispatch({ type: 'archiveTodo', id: todo.id, archived: true });
    // T-6.3 (#1, soát chéo M6): việc lưu trữ vẫn còn trong state (chỉ mang cờ `archived: true`) ->
    // Hoàn tác phải BỎ cờ đó (`archiveTodo … archived: false`), không phải `restoreTodo` (dùng cho
    // việc đã XÓA hẳn khỏi mảng, `restoreTodo` không làm gì nếu id vẫn còn trong state).
    showToast(t('events.todoArchivedToast', lang), {
      label: t('events.undo', lang),
      onClick: () => store.dispatch({ type: 'archiveTodo', id: todo.id, archived: false }),
    });
  }

  function handleDelete(todo: Todo) {
    setSwipeOpenId(null);
    store.dispatch({ type: 'deleteTodo', id: todo.id });
    showToast(t('events.todoDeletedToast', lang), {
      label: t('events.undo', lang),
      onClick: () => store.dispatch({ type: 'restoreTodo', todo }),
    });
  }

  function handleRestore(todo: Todo) {
    setSwipeOpenId(null);
    store.dispatch({ type: 'archiveTodo', id: todo.id, archived: false });
  }

  function handleDragEnd(list: Todo[], listKey: 'open' | 'done') {
    setDragInfoState((prev) => {
      if (!prev || prev.listKey !== listKey) return null;
      const { id, originalIndex, finalIndex } = prev;
      if (finalIndex !== originalIndex) {
        const dragged = list[originalIndex];
        const withoutDragged = list.filter((tItem) => tItem.id !== id);
        const preview = [...withoutDragged.slice(0, finalIndex), dragged, ...withoutDragged.slice(finalIndex)];
        const target = finalIndex > originalIndex ? preview[finalIndex - 1] : preview[finalIndex + 1];
        if (target) store.dispatch({ type: 'reorderTodo', id, targetId: target.id });
      }
      return null;
    });
  }

  function renderRow(todo: Todo, list: Todo[], listKey: 'open' | 'done') {
    const idx = list.indexOf(todo);
    const content = (
      <div class="todo-item" data-testid="todo-item">
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
    return (
      <SwipeRow
        key={todo.id}
        id={todo.id}
        isOpen={swipeOpenId === todo.id}
        setOpen={(open) => setSwipeOpenId(open ? todo.id : null)}
        canDrag={true}
        dragInfo={dragInfo}
        setDragInfo={setDragInfo}
        listKey={listKey}
        index={idx}
        list={list}
        onDragCommit={() => handleDragEnd(list, listKey)}
        actions={
          <>
            <button type="button" data-testid="todo-swipe-archive" class="todo-swipe-archive" onClick={() => handleArchive(todo)}>
              {t('events.todoArchive', lang)}
            </button>
            <button type="button" data-testid="todo-swipe-delete" class="todo-swipe-delete" onClick={() => handleDelete(todo)}>
              {t('events.todoDelete', lang)}
            </button>
          </>
        }
      >
        {content}
      </SwipeRow>
    );
  }

  function renderArchivedRow(todo: Todo) {
    const content = (
      <div class="todo-item todo-archived-item" data-testid="todo-archived-item">
        <span class="todo-text">{todo.text}</span>
      </div>
    );
    return (
      <SwipeRow
        key={todo.id}
        id={todo.id}
        isOpen={swipeOpenId === todo.id}
        setOpen={(open) => setSwipeOpenId(open ? todo.id : null)}
        canDrag={false}
        dragInfo={null}
        setDragInfo={() => {}}
        listKey="open"
        index={0}
        list={[]}
        onDragCommit={() => {}}
        actions={
          <>
            <button type="button" data-testid="todo-swipe-restore" class="todo-swipe-restore" onClick={() => handleRestore(todo)}>
              {t('events.todoRestore', lang)}
            </button>
            <button type="button" data-testid="todo-swipe-delete" class="todo-swipe-delete" onClick={() => handleDelete(todo)}>
              {t('events.todoDelete', lang)}
            </button>
          </>
        }
      >
        {content}
      </SwipeRow>
    );
  }

  return (
    <div class="todos-tab" onClick={() => setSwipeOpenId(null)}>
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
      <div class="todo-list">{open.map((todo) => renderRow(todo, open, 'open'))}</div>
      {done.length > 0 && (
        <div class="todo-done-group">
          <button type="button" data-testid="todo-done-toggle" class="row btnrow" onClick={() => setShowDone((v) => !v)}>
            {t('events.todoDoneCount', lang, { n: done.length })}
          </button>
          {showDone && <div class="todo-done-list">{done.map((todo) => renderRow(todo, done, 'done'))}</div>}
        </div>
      )}
      {archivedTodos.length > 0 && (
        <div class="todo-archived-group">
          <button
            type="button"
            data-testid="todo-archived-toggle"
            class="row btnrow"
            onClick={() => setShowArchived((v) => !v)}
          >
            {t('events.todoArchivedCount', lang, { n: archivedTodos.length })}
          </button>
          {showArchived && <div class="todo-archived-list">{archivedTodos.map((todo) => renderArchivedRow(todo))}</div>}
        </div>
      )}
    </div>
  );
}

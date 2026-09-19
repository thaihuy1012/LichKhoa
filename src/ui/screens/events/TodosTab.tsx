import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { Store } from '../../store';
import type { AppState, ISODate, Todo } from '../../../core/model';
import { t } from '../../../core/i18n';
import { toISODate } from '../../../core/calendar';
import { ReminderDialog } from '../../components/ReminderDialog';
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

/** SC-002: trình duyệt có Touch Events (Safari iOS, Chrome Android, chromium `hasTouch`) -> cử chỉ bằng
 * NGÓN TAY đi hoàn toàn qua `touchstart/touchmove/touchend/touchcancel`; pointer `pointerType: 'touch'`
 * bị bỏ qua. Lý do: WebKit iOS hủy luồng POINTER (`pointercancel`) bất cứ khi nào một cử chỉ gốc của
 * UIKit (cuộn, nhấn giữ hệ thống…) tranh ngón tay, trong khi luồng TOUCH vẫn chạy tiếp tới `touchend`.
 * Bộ cũ kết thúc kéo bằng `pointerup`/`pointercancel` -> `onDragCancel` -> "thả tay thứ tự như cũ"
 * (tái hiện: tests/e2e/todo-touch.spec.ts "Chuỗi sự kiện iOS…"). Chuột/bút vẫn dùng Pointer Events. */
const HAS_TOUCH_EVENTS = typeof window !== 'undefined' && 'ontouchstart' in window;

/** Nút hành động đơn nhiệm trong hàng (▲▼×, tick, hạn, nút panel vuốt): chạm vào đây KHÔNG mở đầu nhấn
 * giữ kéo và KHÔNG bị chặn touchmove sớm, để click của nút không bị nuốt (SC-002 triệu chứng 2).
 * `todo-edit` (chữ việc) là ngoại lệ lưỡng dụng theo thiết kế T-6.2/T-6.3: chạm nhanh sửa, nhấn giữ kéo. */
function isActionButton(target: EventTarget | null): boolean {
  const btn = (target as HTMLElement | null)?.closest?.('button') as HTMLElement | null | undefined;
  return !!btn && btn.dataset.testid !== 'todo-edit';
}

function findTouch(list: TouchList, id: number | null): Touch | null {
  for (let i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i];
  return null;
}

/** Bộ nhận cử chỉ dùng chung cho hàng thường và hàng đã lưu trữ (T-6.2). `canDrag` tắt cho hàng lưu trữ.
 * `isOpen`: hàng đang mở sẵn (panel lộ ra) hay không, để vuốt tiếp từ vị trí mở không giật về 0 (T-6.3 #2).
 * Một máy trạng thái (`begin`/`move`/`endGesture`) nhận dữ liệu từ 2 nguồn: Pointer Events (chuột/bút)
 * hoặc Touch Events (ngón tay, xem HAS_TOUCH_EVENTS). */
function useRowGesture(canDrag: boolean, isOpen: boolean, cb: GestureCallbacks) {
  const phaseRef = useRef<Phase>('idle');
  const startRef = useRef({ x: 0, y: 0 });
  const sourceRef = useRef<'pointer' | 'touch' | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const touchIdRef = useRef<number | null>(null);
  const onActionRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const [dx, setDx] = useState<number | null>(null);
  const dxRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const rowElRef = useRef<HTMLDivElement | null>(null);
  // Listener touch gốc đăng ký 1 lần (xem effect dưới) -> luôn đọc props mới nhất qua ref.
  const latestRef = useRef({ canDrag, isOpen, cb });
  latestRef.current = { canDrag, isOpen, cb };

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function updateDx(v: number | null) {
    dxRef.current = v;
    setDx(v);
  }

  /** Bắt pointer về hàng (chỉ nguồn pointer; touch đã tự "bắt" về phần tử touchstart theo spec). */
  function capturePointer() {
    const el = rowElRef.current;
    if (!el || sourceRef.current !== 'pointer' || pointerIdRef.current === null) return;
    try {
      el.setPointerCapture(pointerIdRef.current);
    } catch {
      /* ignore: pointer may already be released */
    }
  }

  function begin(x: number, y: number, target: EventTarget | null, source: 'pointer' | 'touch') {
    startRef.current = { x, y };
    sourceRef.current = source;
    phaseRef.current = 'pending';
    clearTimer();
    // SC-002 (lượt 1, test "giữ nút ▼ hơi lâu"): giữ tay > LONG_PRESS_MS trên nút hành động từng bị coi
    // là mở đầu kéo -> suppressClick nuốt click thật của nút.
    onActionRef.current = isActionButton(target);
    if (latestRef.current.canDrag && !onActionRef.current) {
      timerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'pending') return;
        phaseRef.current = 'drag';
        suppressClickRef.current = true;
        setDragging(true);
        const el = rowElRef.current;
        if (el) {
          capturePointer();
          latestRef.current.cb.onBeginDrag(el);
        }
      }, LONG_PRESS_MS);
    }
  }

  /** Trả về true nếu lần di chuyển thuộc về cử chỉ (vuốt/kéo) -> nơi gọi chặn hành vi mặc định (cuộn). */
  function move(x: number, y: number): boolean {
    const dxNow = x - startRef.current.x;
    const dyNow = y - startRef.current.y;
    const { isOpen: open, cb: callbacks } = latestRef.current;
    // T-6.3 (#2, soát chéo M6): hàng đang mở sẵn -> điểm bắt đầu của dx là -PANEL_PX, không phải 0.
    const base = open ? -SWIPE_PANEL_PX : 0;
    if (phaseRef.current === 'pending') {
      if (Math.abs(dxNow) > SWIPE_ACTIVATE_PX && Math.abs(dxNow) > Math.abs(dyNow)) {
        clearTimer();
        phaseRef.current = 'swipe';
        suppressClickRef.current = true;
        capturePointer();
        updateDx(Math.min(0, Math.max(-SWIPE_PANEL_PX - 24, base + dxNow)));
        return true;
      }
      if (Math.abs(dyNow) > MOVE_CANCEL_PX) {
        clearTimer();
        phaseRef.current = 'idle';
      }
      return false;
    }
    if (phaseRef.current === 'swipe') {
      updateDx(Math.min(0, Math.max(-SWIPE_PANEL_PX - 24, base + dxNow)));
      return true;
    }
    if (phaseRef.current === 'drag') {
      callbacks.onDragMove(dyNow);
      return true;
    }
    return false;
  }

  function endGesture(cancelled: boolean) {
    clearTimer();
    const callbacks = latestRef.current.cb;
    if (phaseRef.current === 'swipe') {
      const openThreshold = -SWIPE_PANEL_PX * SWIPE_OPEN_RATIO;
      const cur = dxRef.current ?? 0;
      callbacks.onSwipeSettle(!cancelled && cur <= openThreshold);
      updateDx(null);
    } else if (phaseRef.current === 'drag') {
      setDragging(false);
      if (cancelled) callbacks.onDragCancel();
      else callbacks.onDragEnd();
    }
    phaseRef.current = 'idle';
    sourceRef.current = null;
    pointerIdRef.current = null;
    touchIdRef.current = null;
    // T-6.3 (#3, soát chéo M6): dọn cờ suppressClick kể cả khi không có `click` nào theo sau — chạy sau
    // tick hiện tại nên vẫn kịp nuốt đúng 1 lần click "ma" phát sinh ngay sau cử chỉ (nếu có).
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }

  // Nhánh ngón tay (SC-002). Đăng ký 1 lần trên phần tử hàng, KHÔNG qua JSX: `touchmove` phải là
  // {passive:false} và có sẵn TRƯỚC touchstart thì `preventDefault()` mới chặn được cuộn trên Safari iOS
  // (WebKit chốt cuộn/không-cuộn từ các pixel di chuyển đầu; listener thêm giữa chừng không được tính).
  // Không bao giờ preventDefault ở touchstart -> click của nút con giữ nguyên.
  useEffect(() => {
    const el = rowElRef.current;
    if (!el || !HAS_TOUCH_EVENTS) return;
    function onTouchStart(e: TouchEvent) {
      if (sourceRef.current === 'touch' && phaseRef.current !== 'idle') {
        // Ngón thứ hai chạm khi đang chờ nhấn giữ -> bỏ; đang vuốt/kéo -> tiếp tục theo ngón đầu.
        if (phaseRef.current === 'pending') {
          clearTimer();
          phaseRef.current = 'idle';
        }
        return;
      }
      if (e.touches.length !== 1) return;
      if ((e.target as HTMLElement).closest('input')) return;
      const t = e.changedTouches[0];
      touchIdRef.current = t.identifier;
      begin(t.clientX, t.clientY, e.target, 'touch');
    }
    function onTouchMove(e: TouchEvent) {
      if (sourceRef.current !== 'touch') return;
      const t = findTouch(e.changedTouches, touchIdRef.current) ?? findTouch(e.touches, touchIdRef.current);
      if (!t) return;
      if (move(t.clientX, t.clientY)) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      // T-6.3 (#4, soát chéo M6): còn `pending` nhưng đã thấy rõ hướng ngang (|dx|>|dy|) từ vài px đầu ->
      // chặn cuộn NGAY, không đợi đủ 16px. SC-002: trừ khi chạm trúng nút hành động — một cú chạm nút hơi
      // xê dịch không được bị preventDefault (nguy cơ iOS bỏ click); vuốt từ nút vẫn được sau 16px.
      if (phaseRef.current === 'pending' && !onActionRef.current) {
        const dxNow = t.clientX - startRef.current.x;
        const dyNow = t.clientY - startRef.current.y;
        if (Math.abs(dxNow) > EARLY_SWIPE_PX && Math.abs(dxNow) > Math.abs(dyNow) && e.cancelable) e.preventDefault();
      }
    }
    function onTouchEnd(e: TouchEvent) {
      if (sourceRef.current !== 'touch' || !findTouch(e.changedTouches, touchIdRef.current)) return;
      endGesture(false);
    }
    function onTouchCancel(e: TouchEvent) {
      if (sourceRef.current !== 'touch' || !findTouch(e.changedTouches, touchIdRef.current)) return;
      // Không có `click` nào theo sau touchcancel -> tự dọn cờ (tránh nuốt oan lần chạm kế tiếp).
      suppressClickRef.current = false;
      // SC-002: hệ thống giành ngón tay giữa lúc KÉO -> áp thứ tự người dùng đang thấy xem trước (không
      // bật về thứ tự cũ như triệu chứng); đang VUỐT -> đóng panel như trước.
      endGesture(phaseRef.current !== 'drag');
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchCancel);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, []);

  /** Ngón tay đã do nhánh Touch Events xử lý -> bỏ qua bản sao pointer của nó. */
  function isTouchHandledElsewhere(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    return e.pointerType === 'touch' && HAS_TOUCH_EVENTS;
  }

  function onPointerDown(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (isTouchHandledElsewhere(e)) return;
    if ((e.target as HTMLElement).closest('input')) return;
    pointerIdRef.current = e.pointerId;
    begin(e.clientX, e.clientY, e.target, 'pointer');
  }

  function onPointerMove(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (sourceRef.current !== 'pointer' || pointerIdRef.current !== e.pointerId) return;
    if (move(e.clientX, e.clientY)) e.preventDefault();
  }

  function onPointerUp(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (sourceRef.current !== 'pointer' || pointerIdRef.current !== e.pointerId) return;
    endGesture(false);
  }

  function onPointerCancel(e: JSX.TargetedPointerEvent<HTMLDivElement>) {
    if (sourceRef.current !== 'pointer' || pointerIdRef.current !== e.pointerId) return;
    // `pointercancel` không kéo theo `click` nào -> tự dọn cờ suppressClick (tránh kẹt trạng thái).
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

  // SC-002 (triệu chứng 1 "2 việc chồng lên nhau và không nhìn thấy"): dịch dọc khi KÉO phải đặt trên
  // `.todo-item-wrap`, không phải `.todo-item-inner` — wrap có `overflow: hidden` (cắt panel vuốt), nên
  // hàng kéo/hàng nhường chỗ dịch bên trong khung của chính nó bị cắt mất (tái hiện bằng hit-test
  // `elementFromPoint`: tests/e2e/todo-gestures.spec.ts "SC-002…", chromium + webkit). Vuốt ngang vẫn
  // dịch `inner` bên trong wrap (cần bị cắt để lộ panel).
  const wrapStyle: Record<string, string> = {};
  if (isDraggedRow) {
    wrapStyle.transform = `translateY(${dragInfo!.rawDy}px) scale(1.02)`;
    wrapStyle.transition = 'none';
  } else if (dragInfo && dragInfo.listKey === listKey) {
    // Chỉ có hiệu ứng trượt khi đang kéo; lúc thả (dragInfo=null) bỏ transition để hàng không trượt ngược.
    if (shiftPx !== 0) wrapStyle.transform = `translateY(${shiftPx}px)`;
    wrapStyle.transition = 'transform 0.15s ease';
  }

  const innerStyle: Record<string, string> = {};
  if (dx !== null) {
    innerStyle.transform = `translateX(${dx}px)`;
    innerStyle.transition = 'none';
  } else if (isOpen && !isDraggedRow) {
    innerStyle.transform = `translateX(-${SWIPE_PANEL_PX}px)`;
  }

  // Đóng hẳn (không vuốt, không mở) -> ẩn hẳn panel nút (không chỉ che bằng transform): review
  // T-6.2 lượt 2 phát hiện mép phải lộ vệt cong mảnh khi đóng, do góc bo `.todo-item-wrap` clip
  // hình chữ nhật `.todo-item-inner` để lộ một mẩu panel phía sau qua góc bo. `visibility: hidden`
  // khi đóng loại bỏ hẳn phần đó khỏi hiển thị bất kể góc bo/viền.
  const showActions = isOpen || dx !== null;

  return (
    <div
      class={isDraggedRow || dragging ? 'todo-item-wrap todo-item-wrap-dragging' : 'todo-item-wrap'}
      style={wrapStyle}
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
  const [reminderOpen, setReminderOpen] = useState(false);
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

  function saveForReminder(): boolean {
    const text = inputText.trim();
    if (!text) return false;
    store.dispatch({ type: 'addTodo', text, due: inputDue || undefined });
    setInputText('');
    setInputDue('');
    setReminderOpen(false);
    return true;
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
      <div class="addrow" style={{ flexWrap: 'wrap' }}>
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
        <button
          type="button"
          data-testid="rem-open"
          class="btn block"
          disabled={!inputText.trim()}
          onClick={() => setReminderOpen(true)}
          style={{
            background: '#2a2a33',
            color: '#f2f2f2',
            opacity: !inputText.trim() ? 0.45 : undefined,
            cursor: !inputText.trim() ? 'not-allowed' : undefined,
          }}
        >
          {t('reminder.open', lang)}
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

      <ReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        source={{
          kind: 'todo',
          due: inputDue || undefined,
        }}
        title={inputText.trim()}
        alarmShortcutName={state.alarmShortcutName}
        reminderShortcutName={state.reminderShortcutName}
        onSave={saveForReminder}
        flush={store.flush}
        showToast={showToast}
        lang={lang}
      />
    </div>
  );
}
